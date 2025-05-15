<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $stmt = $pdo->query("SELECT * FROM inventory ORDER BY created_at DESC");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $items
    ]);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Failed to fetch items: ' . $e->getMessage()]);
}
?> 