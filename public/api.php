<?php
// Set the response header to return JSON
header('Content-Type: application/json');

// The deploy workflow writes this file from the ADMIN_PASSWORD secret.
// It is not in the repository.
$passwordFile = __DIR__ . '/admin-password.php';
if (is_readable($passwordFile)) {
    require_once $passwordFile;
}

// Path to the JSON file
define('JSON_FILE', 'settings.json');

// Function to send a JSON response
function sendResponse($status, $message = '', $data = null) {
    http_response_code($status);
    echo json_encode(['success' => $status === 200, 'message' => $message, 'data' => $data]);
    exit;
}

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, 'Method not allowed');
}

try {
    // Decode the request payload
    $input = json_decode(file_get_contents('php://input'), true);

    // Refuse to authenticate at all rather than accept an empty password
    if (!defined('ADMIN_PASSWORD') || ADMIN_PASSWORD === '') {
        sendResponse(500, 'Admin password is not configured on the server');
    }

    // Validate the request payload
    if (!isset($input['password']) || !is_string($input['password'])
        || !hash_equals(ADMIN_PASSWORD, $input['password'])) {
        sendResponse(403, 'Unauthorized: Invalid password');
    }

    if (!isset($input['settings']) || !is_array($input['settings'])) {
        sendResponse(400, 'Invalid data format');
    }

    // Write the settings to the JSON file
    $data = json_encode($input['settings'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if (file_put_contents(JSON_FILE, $data) === false) {
        sendResponse(500, 'Failed to save JSON file');
    }

    sendResponse(200, 'Data saved successfully');
} catch (Exception $e) {
    sendResponse(500, 'Server error: ' . $e->getMessage());
}
