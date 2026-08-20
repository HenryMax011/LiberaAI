<?php
declare(strict_types=1);

require_once __DIR__ . '/../lib/bootstrap.php';
require_once __DIR__ . '/../lib/leads.php';
require_once __DIR__ . '/../lib/smtp.php';

$smtpConfigured = is_smtp_configured();
$smtpAuth = false;
$smtpError = null;
if ($smtpConfigured) {
    $smtpAuth = smtp_test_auth();
    if (!$smtpAuth) {
        $smtpError = smtp_last_response();
    }
}

header('Content-Type: application/json; charset=UTF-8');
echo json_encode([
    'ok' => true,
    'smtp' => $smtpConfigured,
    'smtpAuth' => $smtpAuth,
    'smtpError' => $smtpError,
    'gtm' => defined('GTM_ID') ? GTM_ID : null,
    'php' => PHP_VERSION,
], JSON_UNESCAPED_UNICODE);
