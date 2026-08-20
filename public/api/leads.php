<?php
declare(strict_types=1);

require_once __DIR__ . '/../lib/leads.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Método não permitido.'], 405);
}

$payload = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($payload)) {
    json_response(['success' => false, 'message' => 'JSON inválido.'], 400);
}

$result = process_lead($payload);
if (!$result['success']) {
    json_response(['success' => false, 'message' => $result['message']], $result['status']);
}

leads_finish_response_and_dispatch(
    $result['lead'],
    ['success' => true, 'message' => $result['message']],
    $result['status']
);
