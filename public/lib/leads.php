<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/smtp.php';

function normalize_phone(string $phone): string
{
    return preg_replace('/\D/', '', $phone) ?? '';
}

function get_client_ip(): string
{
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($forwarded !== '') {
        return trim(explode(',', $forwarded)[0]);
    }

    return $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'N/A';
}

function is_smtp_configured(): bool
{
    $pass = preg_replace('/\s+/', '', getenv('SMTP_PASS') ?: '');

    return (getenv('SMTP_HOST') ?: '') !== ''
        && (getenv('SMTP_PORT') ?: '') !== ''
        && (getenv('SMTP_USER') ?: '') !== ''
        && $pass !== ''
        && (getenv('SMTP_FROM') ?: '') !== ''
        && (getenv('ALERT_EMAIL_TO') ?: '') !== '';
}

function build_email_html(array $lead): string
{
    $row = static function (string $label, string $value): string {
        return '<tr><td style="padding:10px;border:1px solid #ddd;font-weight:700;background:#f8f8f8;">'
            . htmlspecialchars($label, ENT_QUOTES, 'UTF-8')
            . '</td><td style="padding:10px;border:1px solid #ddd;">'
            . htmlspecialchars($value ?: '-', ENT_QUOTES, 'UTF-8')
            . '</td></tr>';
    };

    $optional = '';
    if (!empty($lead['email'])) {
        $optional .= $row('E-mail', $lead['email']);
    }
    if (!empty($lead['services'])) {
        $optional .= $row('Serviços', implode(', ', $lead['services']));
    }
    if (!empty($lead['licenseType'])) {
        $optional .= $row('Licença de interesse', $lead['licenseType']);
    }

    return '<div style="font-family:Arial,sans-serif;color:#111;">'
        . '<h2 style="margin:0 0 12px;color:#222;">Novo lead recebido</h2>'
        . '<table style="border-collapse:collapse;width:100%;max-width:820px;">'
        . $row('Nome', $lead['name'])
        . $row('Telefone', $lead['phone'])
        . $optional
        . $row('Origem', $lead['source'])
        . $row('URL', $lead['pageUrl'])
        . $row('IP', $lead['ip'])
        . $row('Data de conversão', $lead['conversionDate'])
        . $row('UTM Source', $lead['utm_source'])
        . $row('UTM Medium', $lead['utm_medium'])
        . $row('UTM Campaign', $lead['utm_campaign'])
        . '</table></div>';
}

function send_email_notification(array $lead): bool
{
    $to = trim((string) (getenv('ALERT_EMAIL_TO') ?: ''));
    $from = trim((string) (getenv('SMTP_FROM') ?: ''));
    if ($to === '' || $from === '') {
        return false;
    }

    $subject = '[CONTATO ' . $lead['source'] . '] ' . BRAND_NAME;
    return smtp_send($to, $subject, build_email_html($lead), $from);
}

function persist_lead_backup(array $lead, array $meta = []): ?string
{
    $dir = SITE_ROOT . '/content/leads';
    if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
        return null;
    }

    $file = $dir . '/' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.json';
    $payload = ['lead' => $lead, 'meta' => $meta];
    $encoded = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if ($encoded === false) {
        return null;
    }

    if (@file_put_contents($file, $encoded, LOCK_EX) === false) {
        return null;
    }

    return $file;
}

function update_lead_backup_meta(string $file, array $meta): void
{
    if (!is_file($file)) {
        return;
    }

    $raw = @file_get_contents($file);
    if ($raw === false) {
        return;
    }

    $payload = json_decode($raw, true);
    if (!is_array($payload) || !isset($payload['lead']) || !is_array($payload['lead'])) {
        $payload = ['lead' => json_decode($raw, true) ?: [], 'meta' => []];
    }

    $payload['meta'] = array_merge($payload['meta'] ?? [], $meta);
    $encoded = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if ($encoded === false) {
        return;
    }

    @file_put_contents($file, $encoded, LOCK_EX);
}

function send_lead_to_rd(array $lead): bool
{
    $webhookUrl = trim((string) (getenv('RD_WEBHOOK_URL') ?: ''));
    if ($webhookUrl === '' || !function_exists('curl_init')) {
        return false;
    }

    $payload = json_encode($lead, JSON_UNESCAPED_UNICODE);
    if ($payload === false) {
        return false;
    }

    $ch = curl_init($webhookUrl);
    if ($ch === false) {
        return false;
    }

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 4,
        CURLOPT_CONNECTTIMEOUT => 3,
    ]);
    curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $status >= 200 && $status < 300;
}

function dispatch_lead_notifications(array $lead): bool
{
    return send_lead_to_rd($lead);
}

function leads_flush_response(array $response, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('Connection: close');

    $body = json_encode($response, JSON_UNESCAPED_UNICODE);
    if ($body === false) {
        $body = '{"success":true,"message":"Lead recebido com sucesso."}';
    }

    header('Content-Length: ' . (string) strlen($body));
    echo $body;

    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
        return;
    }

    while (ob_get_level() > 0) {
        ob_end_flush();
    }
    flush();
}

function leads_finish_response_and_dispatch(array $lead, array $response, int $status = 200): never
{
    ignore_user_abort(true);
    set_time_limit(60);

    $backupFile = persist_lead_backup($lead, [
        'receivedAt' => gmdate('c'),
        'emailSent' => null,
    ]);

    leads_flush_response($response, $status);

    $emailSent = false;
    $smtpError = null;
    if (is_smtp_configured()) {
        $emailSent = send_email_notification($lead);
        if (!$emailSent) {
            $smtpError = smtp_last_response();
            error_log('[leads] Falha SMTP ao enviar lead de ' . $lead['name'] . ' (' . $lead['phone'] . ') — ' . $smtpError);
        }
    } else {
        $smtpError = 'SMTP nao configurado no .env';
        error_log('[leads] SMTP nao configurado para lead de ' . $lead['name']);
    }

    if ($backupFile !== null) {
        update_lead_backup_meta($backupFile, [
            'emailSent' => $emailSent,
            'smtpError' => $smtpError,
            'rdSent' => dispatch_lead_notifications($lead),
            'processedAt' => gmdate('c'),
        ]);
    } else {
        dispatch_lead_notifications($lead);
    }

    exit;
}

function process_lead(array $payload): array
{
    $name = trim((string) ($payload['name'] ?? ''));
    $phone = normalize_phone((string) ($payload['phone'] ?? ''));

    if ($name === '' || strlen($name) < 3) {
        return ['success' => false, 'status' => 400, 'message' => 'Nome é obrigatório e deve ter no mínimo 3 caracteres.'];
    }

    if ($phone === '' || strlen($phone) < 10) {
        return ['success' => false, 'status' => 400, 'message' => 'Telefone é obrigatório e deve ter no mínimo 10 dígitos.'];
    }

    $services = [];
    if (!empty($payload['services']) && is_array($payload['services'])) {
        foreach ($payload['services'] as $item) {
            $item = trim((string) $item);
            if ($item !== '') {
                $services[] = $item;
            }
        }
    }

    $lead = [
        'name' => $name,
        'phone' => $phone,
        'email' => strtolower(trim((string) ($payload['email'] ?? ''))),
        'licenseType' => trim((string) ($payload['licenseType'] ?? '')),
        'services' => $services,
        'source' => (string) ($payload['source'] ?? 'LP_SITE'),
        'pageUrl' => (string) ($payload['pageUrl'] ?? 'N/A'),
        'ip' => get_client_ip(),
        'conversionDate' => gmdate('c'),
        'utm_source' => (string) ($payload['utm_source'] ?? ''),
        'utm_medium' => (string) ($payload['utm_medium'] ?? ''),
        'utm_campaign' => (string) ($payload['utm_campaign'] ?? ''),
    ];

    return [
        'success' => true,
        'status' => 200,
        'message' => 'Lead recebido com sucesso.',
        'lead' => $lead,
    ];
}

function json_response(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
