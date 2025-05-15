<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id']) || !isset($data['name']) || !isset($data['quantity']) || !isset($data['price'])) {
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE inventory SET name = ?, quantity = ?, price = ? WHERE id = ?");
        $stmt->execute([$data['name'], $data['quantity'], $data['price'], $data['id']]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Item updated successfully'
            ]);
        } else {
            echo json_encode(['error' => 'Item not found']);
        }
    } catch(PDOException $e) {
        echo json_encode(['error' => 'Failed to update item: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?> 