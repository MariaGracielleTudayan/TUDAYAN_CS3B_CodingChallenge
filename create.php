<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['name']) || !isset($data['quantity']) || !isset($data['price'])) {
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO inventory (name, quantity, price) VALUES (?, ?, ?)");
        $stmt->execute([$data['name'], $data['quantity'], $data['price']]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Item added successfully',
            'id' => $pdo->lastInsertId()
        ]);
    } catch(PDOException $e) {
        echo json_encode(['error' => 'Failed to add item: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?> 