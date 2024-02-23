//manage-script.js

// Function to fetch and display auto parts with update and delete button
async function getAutoParts() {
    try {
        const response = await fetch('/autoparts');
        const data = await response.json();
        // Display auto parts in a list
        const autoPartsListManagement = document.getElementById('manage-container');

        data.forEach(autoPart => {
            const autoPartItemManagement = document.createElement('div');
            autoPartItemManagement.classList.add('manage-cart'); // Add a class for styling
            autoPartItemManagement.innerHTML = `
                <p>ID: ${autoPart.id}</p>
                <p>Name: ${autoPart.name}</p>
                <p>Category: ${autoPart.category}</p>
                <p>Purchase Price: ${autoPart.purchase_price}</p>
                <p>Sale Price: ${autoPart.sale_price}</p>
                <p>Stock: ${autoPart.stock}</p>
                <button class="updateBtn" onclick="updateAutoPart(${autoPart.id})">Update</button>
                <button class="deleteBtn" onclick="deleteAutoPart(${autoPart.id})">Delete</button>
            `;
            autoPartsListManagement.appendChild(autoPartItemManagement);
        });
    } catch (error) {
        console.error('Error fetching auto parts:', error);
    }
}

// Function to handle the click event for creating a new auto part
async function createAutoPart() {
    try {
        const form = document.getElementById('createAutoPartForm');
        const jsonData = {
            name: form.elements['name'].value,
            category: form.elements['category'].value,
            make: form.elements['make'].value,
            models: form.elements['models'].value,
            description: form.elements['description'].value,
            purchase_price: parseFloat(form.elements['purchasePrice'].value),
            sale_price: parseFloat(form.elements['salePrice'].value),
            photo: form.elements['photo'].value,
            stock: parseInt(form.elements['stock'].value, 10),
        };
        const response = await fetch('/autoparts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        });

        if (response.ok) {
            console.log('Auto part created successfully');
            // Refresh the auto parts list after creation
            getAutoParts();
        } else {
            console.error('Failed to create auto part');
        }
    } catch (error) {
        console.error('Error creating auto part:', error);
    }
}

function updateAutoPart(autoPartID) {
    try {
        // Fetch the auto part data to pre-fill the form
        fetch(`/autoparts/${autoPartID}`)
        .then(response => response.json())
        .then(autoPart => {
            // Fill the form fields with auto part data
            document.getElementById('name').value = autoPart.name;
            document.getElementById('category').value = autoPart.category;
            document.getElementById('make').value = autoPart.make;
            document.getElementById('models').value = autoPart.models;
            document.getElementById('description').value = autoPart.description;
            document.getElementById('purchasePrice').value = autoPart.purchase_price;
            document.getElementById('salePrice').value = autoPart.sale_price;
            document.getElementById('stock').value = autoPart.stock;
            document.getElementById('photo').value = autoPart.photo;

            // Show the modal when the button is clicked
            const modal = document.getElementById("myModal");
            modal.style.display = "block";

            // Close the modal when the user clicks on the close button
            const closeBtn = document.getElementsByClassName("close")[0];
            closeBtn.onclick = function() {
                modal.style.display = "none";
            };

            // Add event listener to the form submission
            const updateForm = document.getElementById('updateAutoPartForm');
            updateForm.addEventListener('submit', event => {
                event.preventDefault(); // Prevent default form submission
                // Get updated values from form fields
                const updatedData = {
                    name: updateForm.elements['name'].value,
                    category: updateForm.elements['category'].value,
                    make: updateForm.elements['make'].value,
                    models: updateForm.elements['models'].value,
                    description: updateForm.elements['description'].value,
                    purchase_price: parseFloat(updateForm.elements['purchasePrice'].value),
                    sale_price: parseFloat(updateForm.elements['salePrice'].value),
                    stock: parseFloat(updateForm.elements['stock'].value),
                    photo: updateForm.elements['photo'].value,
                };
                // Call function to update the auto part
                submitUpdatedAutoPart(autoPartID, updatedData);
                // Close the modal after submitting the form
                modal.style.display = "none";
            });
        });
    } catch (error) {
        console.error('Error updating auto part:', error);
    }
}

// Function to submit the updated auto part data
async function submitUpdatedAutoPart(autoPartID, updatedData) {
    try {
        const response = await fetch(`/autoparts/${autoPartID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            console.log(`Auto part with ID ${autoPartID} updated successfully`);
            // Refresh the auto parts list after updating
            getAutoParts();
        } else {
            console.error(`Failed to update auto part with ID ${autoPartID}`);
        }
    } catch (error) {
        console.error('Error updating auto part:', error);
    }
}

// Function to handle the click event for deleting an auto part
async function deleteAutoPart(autoPartID) {
    try {
        const response = await fetch(`/autoparts/${autoPartID}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log(`Auto part with ID ${autoPartID} deleted successfully`);
            // Refresh the auto parts list after deletion
            getAutoParts();
        } else {
            console.error(`Failed to delete auto part with ID ${autoPartID}`);
        }
    } catch (error) {
        console.error('Error deleting auto part:', error);
    }
}

function getOrders() {
    fetch("http://localhost:3000/orders")
    .then(response => response.json())
    .then(data => {
        //console.log('Orders Data:', data); // Log the received data
        const ordersList = document.getElementById('ordersList');
        if (data.length === 0) {
            ordersList.innerHTML = '<p>No orders available.</p>';
        } else {
            const ordersHTML = data.map(order => {
                let itemsList = ''
                // Check if items array is not null and not empty
                if (order.items && order.items.length > 0) {
                    itemsList = `
                        <ul>
                            ${order.items.map(item => `<li>${item.name} - ${item.price}</li>`).join('')}
                        </ul>
                    `;
                } else {
                    itemsList = '<p>No items available.</p>';
                }

                return `
                    <div>
                        <a><strong>Receipt Name:</strong> ${order.receipt_name}</a>
                        <a><strong>Identification Number:</strong> ${order.identification_number}</a>
                        <a><strong>Phone Number:</strong> ${order.phone_number}</a>
                        <a><strong>Email:</strong> ${order.email}</a>
                        <a><strong>Address:</strong> ${order.address}</a>
                        <a><strong>Workshop Address:</strong> ${order.workshop_address}</a>
                        <a><strong>Date:</strong> ${order.date}</a>
                        <a><strong>Hour:</strong> ${order.hour}</a>
                        <p><strong>Items:</strong></p>
                        ${itemsList}
                        <p><strong>Total:</strong> ${order.total}</p>
                        <button class="deleteOrderBtn" data-order-id="${order.id}">Delete Order</button>
                        <hr/>
                    </div>
                `;
            }).join('');

            ordersList.innerHTML = ordersHTML;
    
             // Add event listeners to delete order buttons
             const deleteOrderButtons = document.querySelectorAll('.deleteOrderBtn');
             deleteOrderButtons.forEach(button => {
                 button.addEventListener('click', () => {
                     const orderId = button.dataset.orderId;
                     deleteOrder(orderId);
                 });
             });
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to handle the click event for deleting an order
async function deleteOrder(orderId) {
    try {
        const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log(`Order with ID ${orderId} deleted successfully`);
            // Refresh the orders list after deletion
            getOrders();
        } else {
            console.error(`Failed to delete order with ID ${orderId}`);
        }
    } catch (error) {
        console.error('Error deleting order:', error);
    }
}

// Function to be called when the window loads
function onLoad() {
    getAutoParts();
    getOrders();
}

// Set the window.onload handler to call onLoad function
window.onload = onLoad;
