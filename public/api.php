<?php
// Set the response header to return JSON
header('Content-Type: application/json');

// Define the password (replace with a secure password)
define('PASSWORD', 'securepassword');

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

    // Validate the request payload
    if (!isset($input['password']) || $input['password'] !== PASSWORD) {
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
