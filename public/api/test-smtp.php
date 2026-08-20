<?php
declare(strict_types=1);

require_once __DIR__ . '/../lib/bootstrap.php';
require_once __DIR__ . '/../lib/leads.php';
require_once __DIR__ . '/../lib/smtp.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Use POST com o campo password.'], 405);
}

$payload = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($payload)) {
    json_response(['success' => false, 'message' => 'JSON invalido.'], 400);
}

$expected = (string) (getenv('ADMIN_PASSWORD') ?: getenv('BLOG_ADMIN_PASSWORD') ?: '');
$provided = (string) ($payload['password'] ?? '');
if ($expected === '' || !hash_equals($expected, $provided)) {
    json_response(['success' => false, 'message' => 'Nao autorizado.'], 403);
}

if (!is_smtp_configured()) {
    json_response(['success' => false, 'message' => 'SMTP nao configurado.', 'smtpAuth' => false], 500);
}

$authOk = smtp_test_auth();
if (!$authOk) {
    json_response([
        'success' => false,
        'message' => 'Autenticacao SMTP falhou.',
        'smtpAuth' => false,
        'smtpError' => smtp_last_response(),
    ], 500);
}

$to = trim((string) (getenv('ALERT_EMAIL_TO') ?: ''));
$from = trim((string) (getenv('SMTP_FROM') ?: ''));
$subject = '[TESTE SMTP] ' . BRAND_NAME;
$html = '<p>Teste de envio do site em ' . gmdate('c') . '.</p>';
$sent = smtp_send($to, $subject, $html, $from);

json_response([
    'success' => $sent,
    'message' => $sent ? 'E-mail de teste enviado para ' . $to : 'Falha ao enviar e-mail de teste.',
    'smtpAuth' => true,
    'smtpError' => $sent ? null : smtp_last_response(),
    'to' => $to,
], $sent ? 200 : 500);
