<?php
declare(strict_types=1);

function smtp_read($socket): string
{
    $data = '';
    while ($line = fgets($socket, 515)) {
        $data .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }

    return $data;
}

function smtp_last_response(): string
{
    return $GLOBALS['__smtp_last_response'] ?? '';
}

function smtp_set_last_response(string $response): void
{
    $GLOBALS['__smtp_last_response'] = trim($response);
}

function smtp_expect($socket, array $expectCodes): bool
{
    $response = smtp_read($socket);
    smtp_set_last_response($response);
    $code = (int) substr($response, 0, 3);

    return in_array($code, $expectCodes, true);
}

function smtp_cmd($socket, string $command, array $expectCodes): bool
{
    fwrite($socket, $command . "\r\n");

    return smtp_expect($socket, $expectCodes);
}

function smtp_parse_from(string $from): array
{
    if (preg_match('/<([^>]+)>/', $from, $m)) {
        return ['email' => trim($m[1]), 'display' => trim($from)];
    }

    return ['email' => trim($from), 'display' => trim($from)];
}

function smtp_format_from_header(string $fromHeader): string
{
    $parsed = smtp_parse_from($fromHeader);
    $email = $parsed['email'];
    $display = trim(preg_replace('/<[^>]+>/', '', $fromHeader), " \t\"'");
    if ($display === '' || $display === $email) {
        return '<' . $email . '>';
    }

    if (preg_match('/[^\x20-\x7E]/', $display) || preg_match('/[&<>"\r\n]/', $display)) {
        return '=?UTF-8?B?' . base64_encode($display) . '?= <' . $email . '>';
    }

    return $display . ' <' . $email . '>';
}

function smtp_ehlo_host(): string
{
    $host = preg_replace('/[^a-zA-Z0-9.-]/', '', $_SERVER['HTTP_HOST'] ?? '') ?: '';
    if ($host === '' || str_contains($host, 'localhost')) {
        return 'localhost';
    }

    return $host;
}

function smtp_cafile(): string
{
    $candidates = [
        trim((string) (getenv('SMTP_CAFILE') ?: '')),
        trim((string) (ini_get('openssl.cafile') ?: '')),
        trim((string) (ini_get('curl.cainfo') ?: '')),
        dirname(SITE_ROOT) . DIRECTORY_SEPARATOR . 'scripts' . DIRECTORY_SEPARATOR . 'cacert.pem',
        SITE_ROOT . DIRECTORY_SEPARATOR . 'cacert.pem',
    ];

    foreach ($candidates as $path) {
        if ($path !== '' && is_file($path) && is_readable($path)) {
            return $path;
        }
    }

    return '';
}

function smtp_ssl_context(bool $verifyPeer = true)
{
    $opts = [
        'verify_peer' => $verifyPeer,
        'verify_peer_name' => $verifyPeer,
        'allow_self_signed' => !$verifyPeer,
        'crypto_method' => STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT
            | (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT') ? STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT : 0),
    ];

    $cafile = smtp_cafile();
    if ($cafile !== '') {
        $opts['cafile'] = $cafile;
    } elseif ($verifyPeer) {
        // Sem CA bundle o handshake costuma falhar em Windows/XAMPP.
        $opts['verify_peer'] = false;
        $opts['verify_peer_name'] = false;
        $opts['allow_self_signed'] = true;
    }

    return stream_context_create(['ssl' => $opts, 'socket' => ['tcp_nodelay' => true]]);
}

function smtp_enable_crypto($socket): bool
{
    $methods = [];
    if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
        $methods[] = STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
    }
    $methods[] = STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
    $methods[] = STREAM_CRYPTO_METHOD_TLS_CLIENT;

    foreach ($methods as $method) {
        $result = @stream_socket_enable_crypto($socket, true, $method);
        if ($result === true) {
            return true;
        }
    }

    $last = error_get_last();
    $detail = is_array($last) ? trim((string) ($last['message'] ?? '')) : '';
    smtp_set_last_response(
        'TLS handshake failed'
        . ($detail !== '' ? ' — ' . $detail : '')
        . (smtp_cafile() === '' ? ' (openssl.cafile / cacert.pem ausente)' : '')
    );

    return false;
}

function smtp_open(string $remote, bool $startTls = false, int $timeout = 12): mixed
{
    $context = smtp_ssl_context(true);
    $socket = @stream_socket_client(
        $remote,
        $errno,
        $errstr,
        $timeout,
        STREAM_CLIENT_CONNECT,
        $context
    );

    if (!$socket && str_starts_with($remote, 'ssl://')) {
        // Retry sem verificação estrita de CA (ambientes sem cacert.pem).
        $context = smtp_ssl_context(false);
        $socket = @stream_socket_client(
            $remote,
            $errno,
            $errstr,
            $timeout,
            STREAM_CLIENT_CONNECT,
            $context
        );
    }

    if (!$socket) {
        smtp_set_last_response('CONNECT ' . $remote . ' — ' . $errstr . ' (' . $errno . ')');
        return false;
    }

    stream_set_timeout($socket, $timeout);

    if (!smtp_expect($socket, [220])) {
        fclose($socket);
        return false;
    }

    $ehloHost = smtp_ehlo_host();
    if (!smtp_cmd($socket, 'EHLO ' . $ehloHost, [250])) {
        fclose($socket);
        return false;
    }

    if ($startTls) {
        if (!smtp_cmd($socket, 'STARTTLS', [220])) {
            fclose($socket);
            return false;
        }
        if (!smtp_enable_crypto($socket)) {
            fclose($socket);
            return false;
        }
        if (!smtp_cmd($socket, 'EHLO ' . $ehloHost, [250])) {
            fclose($socket);
            return false;
        }
    }

    return $socket;
}

function smtp_authenticate($socket, string $user, string $pass): bool
{
    return smtp_cmd($socket, 'AUTH LOGIN', [334])
        && smtp_cmd($socket, base64_encode($user), [334])
        && smtp_cmd($socket, base64_encode($pass), [235]);
}

function smtp_deliver_message($socket, string $to, string $fromHeader, string $subject, string $htmlBody): bool
{
    $from = smtp_parse_from($fromHeader);

    if (!smtp_cmd($socket, 'MAIL FROM:<' . $from['email'] . '>', [250])
        || !smtp_cmd($socket, 'RCPT TO:<' . $to . '>', [250, 251])
        || !smtp_cmd($socket, 'DATA', [354])) {
        return false;
    }

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $messageId = '<' . bin2hex(random_bytes(16)) . '@' . smtp_ehlo_host() . '>';
    $date = gmdate('D, d M Y H:i:s') . ' +0000';
    $message = 'Date: ' . $date . "\r\n"
        . 'Message-ID: ' . $messageId . "\r\n"
        . 'From: ' . smtp_format_from_header($fromHeader) . "\r\n"
        . 'To: <' . $to . ">\r\n"
        . 'Subject: ' . $encodedSubject . "\r\n"
        . "MIME-Version: 1.0\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n"
        . "\r\n"
        . $htmlBody . "\r\n.\r\n";

    fwrite($socket, $message);

    if (!smtp_expect($socket, [250])) {
        return false;
    }

    smtp_cmd($socket, 'QUIT', [221]);
    fclose($socket);

    return true;
}

function smtp_attempt_send(string $to, string $subject, string $htmlBody, string $fromHeader, string $remote, bool $startTls): bool
{
    $user = trim((string) (getenv('SMTP_USER') ?: ''));
    $pass = preg_replace('/\s+/', '', (string) (getenv('SMTP_PASS') ?: ''));
    if ($user === '' || $pass === '') {
        smtp_set_last_response('SMTP_USER/SMTP_PASS vazios no .env');
        return false;
    }

    $socket = smtp_open($remote, $startTls);
    if ($socket === false) {
        return false;
    }

    if (!smtp_authenticate($socket, $user, $pass)) {
        error_log('[smtp] Autenticação rejeitada: ' . smtp_last_response());
        fclose($socket);
        return false;
    }

    return smtp_deliver_message($socket, $to, $fromHeader, $subject, $htmlBody);
}

function smtp_connection_for_port(string $host, int $port): array
{
    if ($port === 587) {
        return ['tcp://' . $host . ':587', true];
    }

    if ($port === 465) {
        return ['ssl://' . $host . ':465', false];
    }

    return ['tcp://' . $host . ':' . $port, false];
}

function smtp_send(string $to, string $subject, string $htmlBody, string $fromHeader): bool
{
    $host = trim((string) (getenv('SMTP_HOST') ?: ''));
    $port = (int) (getenv('SMTP_PORT') ?: 465);
    $to = trim($to);

    if ($host === '' || $to === '') {
        smtp_set_last_response('SMTP_HOST/ALERT_EMAIL_TO vazios no .env');
        return false;
    }

    [$remote, $startTls] = smtp_connection_for_port($host, $port);
    if (smtp_attempt_send($to, $subject, $htmlBody, $fromHeader, $remote, $startTls)) {
        return true;
    }

    error_log('[smtp] Falha em ' . $remote . ': ' . smtp_last_response());

    // Fallback apenas entre 465 e 587 quando a porta configurada falhar.
    $fallback = $port === 465
        ? ['tcp://' . $host . ':587', true]
        : ($port === 587 ? ['ssl://' . $host . ':465', false] : null);

    if ($fallback === null) {
        return false;
    }

    [$remote, $startTls] = $fallback;
    if (smtp_attempt_send($to, $subject, $htmlBody, $fromHeader, $remote, $startTls)) {
        return true;
    }

    error_log('[smtp] Falha no fallback ' . $remote . ': ' . smtp_last_response());
    return false;
}

function smtp_test_auth(): bool
{
    $host = trim((string) (getenv('SMTP_HOST') ?: ''));
    $port = (int) (getenv('SMTP_PORT') ?: 465);
    $user = trim((string) (getenv('SMTP_USER') ?: ''));
    $pass = preg_replace('/\s+/', '', (string) (getenv('SMTP_PASS') ?: ''));
    if ($host === '' || $user === '' || $pass === '') {
        return false;
    }

    [$remote, $startTls] = smtp_connection_for_port($host, $port);
    $socket = smtp_open($remote, $startTls);
    if ($socket === false) {
        return false;
    }

    $ok = smtp_authenticate($socket, $user, $pass);
    smtp_cmd($socket, 'QUIT', [221]);
    fclose($socket);

    return $ok;
}
