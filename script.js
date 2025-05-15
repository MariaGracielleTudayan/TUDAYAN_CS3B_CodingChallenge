$(document).ready(function() {
    // Load items when page loads
    loadItems();

    // Event Listeners
    $('#addItemForm').on('submit', handleAddItem);
    $('#editItemForm').on('submit', handleEditItem);
    $('#searchInput').on('input', handleSearch);
    $('.close').on('click', function() {
        $('#editModal').hide();
    });
});

// Load all items
function loadItems() {
    $.ajax({
        url: 'read.php',
        method: 'GET',
        success: function(response) {
            if (response.success) {
                displayItems(response.data);
            } else {
                alert('Error loading items: ' + response.error);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('Error loading items');
        }
    });
}

// Display items in the table
function displayItems(items) {
    $('#inventoryList').empty();
    
    items.forEach(function(item) {
        const row = `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₱${parseFloat(item.price).toFixed(2)}</td>
                <td>${new Date(item.created_at).toLocaleString()}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="openEditModal(${item.id}, '${item.name}', ${item.quantity}, ${item.price})">Edit</button>
                    <button class="action-btn delete-btn" onclick="handleDelete(${item.id})">Delete</button>
                </td>
            </tr>
        `;
        $('#inventoryList').append(row);
    });
}

// Handle adding new item
function handleAddItem(e) {
    e.preventDefault();
    
    const formData = {
        name: $('#name').val(),
        quantity: parseInt($('#quantity').val()),
        price: parseFloat($('#price').val())
    };

    $.ajax({
        url: 'create.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success) {
                $('#addItemForm')[0].reset();
                loadItems();
                alert('Item added successfully!');
            } else {
                alert('Error adding item: ' + response.error);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('Error adding item');
        }
    });
}

// Handle editing item
function handleEditItem(e) {
    e.preventDefault();
    
    const formData = {
        id: $('#editId').val(),
        name: $('#editName').val(),
        quantity: parseInt($('#editQuantity').val()),
        price: parseFloat($('#editPrice').val())
    };

    $.ajax({
        url: 'update.php',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            if (response.success) {
                $('#editModal').hide();
                loadItems();
                alert('Item updated successfully!');
            } else {
                alert('Error updating item: ' + response.error);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('Error updating item');
        }
    });
}

// Handle deleting item
function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    $.ajax({
        url: 'delete.php',
        method: 'DELETE',
        data: { id: id },
        success: function(response) {
            if (response.success) {
                loadItems();
                alert('Item deleted successfully!');
            } else {
                alert('Error deleting item: ' + response.error);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('Error deleting item');
        }
    });
}

// Open edit modal with item data
function openEditModal(id, name, quantity, price) {
    $('#editId').val(id);
    $('#editName').val(name);
    $('#editQuantity').val(quantity);
    $('#editPrice').val(price);
    $('#editModal').show();
}

// Handle search functionality
function handleSearch(e) {
    const searchTerm = $(e.target).val().toLowerCase();
    
    $('#inventoryList tr').each(function() {
        const name = $(this).find('td:eq(1)').text().toLowerCase();
        $(this).toggle(name.includes(searchTerm));
    });
} 