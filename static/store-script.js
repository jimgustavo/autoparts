// store-script.js

// Function to fetch and display auto parts for the store 
async function getAutoPartsForStore() {
    try {
        const response = await fetch('/autoparts');
        const data = await response.json();

        // Display auto parts in a list
        const autoPartsListStore = document.getElementById('cart-container');

        data.forEach(autoPart => {
            const autoPartItemStore = document.createElement('div');
            autoPartItemStore.classList.add('cart'); // Add a class for styling
            autoPartItemStore.innerHTML = `
                <img src="${autoPart.photo}" alt="${autoPart.name}" width="232" height="150">
                <a><strong>${autoPart.name}</strong></a>
                <p>Marca: ${autoPart.make}</p>
                <p>Modelo: ${autoPart.models}</p>
                <p>Descripción: ${autoPart.description}</p>
                <p>Precio: ${autoPart.sale_price}</p>
                <p>Stock: ${autoPart.stock}</p>
                <p>ID: ${autoPart.id}</p>
                <button class="addToCartBtn">Añadir al Carrito</button>
            `;
            autoPartsListStore.appendChild(autoPartItemStore);

             // Add event listener to the "Add to Cart" button
             const addToCartBtn = autoPartItemStore.querySelector('.addToCartBtn');
             addToCartBtn.addEventListener('click', () => {
                 addToCart(autoPart);
                 // Scroll to the shopping cart
                 document.getElementById('shopping-cart').scrollIntoView({ behavior: 'smooth' });
             });
        });
    } catch (error) {
        console.error('Error fetching auto parts:', error);
    }
}

// Function to filter and display auto parts based on category
async function filterAutoPartsByCategory(category) {
    try {
        let endpoint;
        if (category === 'all') {
            endpoint = '/autoparts'; // Endpoint to fetch all auto parts
        } else {
            endpoint = `/filter?category=${category}`; // Endpoint to filter by category
        }

        const response = await fetch(endpoint);
        const data = await response.json();
        const autoPartsListWithButtons = document.getElementById('cart-container');

        // Clear previous list
        autoPartsListWithButtons.innerHTML = '';

        data.forEach(autoPart => {
            const autoPartItem = document.createElement('div');
            autoPartItem.classList.add('cart');
            autoPartItem.innerHTML = `
                <img src="${autoPart.photo}" alt="${autoPart.name}" width="232" height="150">
                <a><strong>${autoPart.name}</strong></a>
                <p>Marca: ${autoPart.make}</p>
                <p>Modelo: ${autoPart.models}</p>
                <p>Descripción: ${autoPart.description}</p>
                <p>Precio: ${autoPart.sale_price}</p>
                <p>Stock: ${autoPart.stock}</p>
                <p>ID: ${autoPart.id}</p>
                <button class="addToCartBtn">Añadir al Carrito</button>
            `;
            autoPartsListWithButtons.appendChild(autoPartItem);

            // Add event listener to the "Add to Cart" button
            const addToCartBtn = autoPartItem.querySelector('.addToCartBtn');
            addToCartBtn.addEventListener('click', () => {
                addToCart(autoPart);
                // Scroll to the shopping cart
                document.getElementById('shopping-cart').scrollIntoView({ behavior: 'smooth' });
            });
        });
    } catch (error) {
        console.error('Error filtering auto parts:', error);
    }
}

// Function to filter and display auto parts based on model
async function filterAutoPartsByModel(model) {
    try {
        let endpoint;
        if (model === 'all') {
            endpoint = '/autoparts'; // Endpoint to fetch all auto parts
        } else {
            endpoint = `/filter?models=${model}`; // Endpoint to filter by model
        }

        const response = await fetch(endpoint);
        const data = await response.json();
        const autoPartsListWithButtons = document.getElementById('cart-container');

        // Clear previous list
        autoPartsListWithButtons.innerHTML = '';

        data.forEach(autoPart => {
            const autoPartItem = document.createElement('div');
            autoPartItem.classList.add('cart');
            autoPartItem.innerHTML = `
                <img src="${autoPart.photo}" alt="${autoPart.name}" width="232" height="150">
                <a><strong>${autoPart.name}</strong></a>
                <p>Marca: ${autoPart.make}</p>
                <p>Modelo: ${autoPart.models}</p>
                <p>Descripción: ${autoPart.description}</p>
                <p>Precio: ${autoPart.sale_price}</p>
                <p>Stock: ${autoPart.stock}</p>
                <p>ID: ${autoPart.id}</p>
                <button class="addToCartBtn">Añadir al Carrito</button>
            `;
            autoPartsListWithButtons.appendChild(autoPartItem);

            // Add event listener to the "Add to Cart" button
            const addToCartBtn = autoPartItem.querySelector('.addToCartBtn');
            addToCartBtn.addEventListener('click', () => {
                addToCart(autoPart);
                // Scroll to the shopping cart
                document.getElementById('shopping-cart').scrollIntoView({ behavior: 'smooth' });
            });
        });
    } catch (error) {
        console.error('Error filtering auto parts:', error);
    }
}

// Function to add items to the cart
function addToCart(autoPart) {
    const cartList = document.getElementById('cartList');
    const finalPriceElement = document.getElementById('finalPrice');

    // Create cart item
    const cartItem = document.createElement('li');
    cartItem.innerHTML = `${autoPart.name} - $${autoPart.sale_price}`;

    // Add item to cart list
    cartList.appendChild(cartItem);

    // Update final price
    const currentFinalPrice = parseFloat(finalPriceElement.innerText.replace('Precio Total: $', ''));
    const newFinalPrice = currentFinalPrice + parseFloat(autoPart.sale_price);
    finalPriceElement.innerText = `Precio Total: $${newFinalPrice.toFixed(2)}`;

    // Show the shopping cart
    const shoppingCart = document.getElementById('shopping-cart');
    shoppingCart.style.display = 'block';
}

// Function to handle checkout
function checkout() {
    const cartList = document.getElementById('cartList');
    const checkoutDetails = document.getElementById('checkoutDetails');
    const billDiv = document.getElementById('bill');
    
    // Clear previous bill details
    billDiv.innerHTML = '';

    // Display total price in the bill
    let totalPrice = 0; // Initialize totalPrice variable
    cartList.childNodes.forEach(cartItem => {
        const itemName = cartItem.innerText.split(' - ')[0];
        const itemPrice = parseFloat(cartItem.innerText.split(' - $')[1]);
        const billItem = document.createElement('p');
        billItem.innerText = `${itemName} - $${itemPrice.toFixed(2)}`;
        billDiv.appendChild(billItem);
        totalPrice += itemPrice; // Accumulate the total price
    });

    // Get current date
    var currentDate = new Date();
    // Format the date as per your requirement
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var formattedDate = currentDate.toLocaleDateString('es-ES', options);
    
    // Get current hour
    var currentHour = currentDate.getHours();
    var currentMinute = currentDate.getMinutes();
    var currentSecond = currentDate.getSeconds();
    var hour = currentHour+ 'h:' + currentMinute + 'm:' + currentSecond+'s';

    // Display checkout details in the bill
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutDetailsItem = document.createElement('div');
    checkoutDetailsItem.innerHTML = `
        <h3>Detalles de Pago</h3>
        <p><strong>Nombre de factura:</strong> ${checkoutForm.elements['receiptName'].value}</p>
        <p><strong>Cédula de Identidad:</strong> ${checkoutForm.elements['identificationNumber'].value}</p>
        <p><strong>Número de celular:</strong> ${checkoutForm.elements['phoneNumber'].value}</p>
        <p><strong>Email:</strong> ${checkoutForm.elements['email'].value}</p>
        <p><strong>Dirección Domicilio:</strong> ${checkoutForm.elements['address'].value}</p>
        <p><strong>Dirección Taller:</strong> ${checkoutForm.elements['workshopAddress'].value}</p>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <p><strong>Hora:</strong> ${hour}</p>
        <hr>
    `;
    billDiv.appendChild(checkoutDetailsItem);

    const totalBill = document.createElement('p');
    totalBill.innerText = `Precio Total: $${totalPrice.toFixed(2)}`;
    billDiv.appendChild(totalBill);
    
    // Hide shopping cart and show order details
    document.getElementById('shopping-cart').style.display = 'none';
    checkoutDetails.style.display = 'block';
} 

// Function to send order to API
async function sendOrder() {
    const cartList = document.getElementById('cartList');
    const checkoutDetails = document.getElementById('checkoutDetails');

    // Build the order data
    const orderData = {
        items: [],
        total: 0,
        receipt_name: '',
        identification_number: '',
        phone_number: '',
        email: '',
        address: '',
        workshop_address: '',
        date: '',
        hour: '',
    };

    // Populate order data from cart items
    cartList.childNodes.forEach(cartItem => {
        const itemName = cartItem.innerText.split(' - ')[0];
        const itemPrice = parseFloat(cartItem.innerText.split(' - $')[1]);

        orderData.items.push({ name: itemName, price: itemPrice });
        orderData.total += itemPrice;
    });

    // Get current date
    var currentDate = new Date();
    // Format the date as per your requirement
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var formattedDate = currentDate.toLocaleDateString('en-US', options);

    // Get current hour
    var currentHour = currentDate.getHours();
    var currentMinute = currentDate.getMinutes();
    var currentSecond = currentDate.getSeconds();
    var hour = currentHour+ 'h:' + currentMinute + 'm:' + currentSecond+'s';

    // Populate order data from checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    orderData.receipt_name = checkoutForm.elements['receiptName'].value;
    orderData.identification_number = checkoutForm.elements['identificationNumber'].value;
    orderData.phone_number = checkoutForm.elements['phoneNumber'].value;
    orderData.email = checkoutForm.elements['email'].value;
    orderData.address = checkoutForm.elements['address'].value;
    orderData.workshop_address = checkoutForm.elements['workshopAddress'].value;
    orderData.date = formattedDate;
    orderData.hour = hour;

    // Make a POST request to the API
    try {
        const response = await fetch("http://localhost:3000/orders", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (response.ok) {
            console.log('Order sent successfully');
            // Call the function and pass the message as an argument
            showConfirmationMessage("Tu orden ha sido enviada exitosamente!");
        } else {
            console.error('Failed to send order');
        }
    } catch (error) {
        console.error('Error sending order:', error);
    }

    // Clear the cart and update final price
    cartList.innerHTML = '';
    const finalPriceElement = document.getElementById('finalPrice');
    finalPriceElement.innerText = 'Final Price: $0.00';

    // Hide checkout details
    checkoutDetails.style.display = 'none';
}

function showConfirmationMessage(message) {
    // Display a JavaScript pop-up with the confirmation message
    alert(message);
}

// Fetch and display auto parts when the page loads
window.onload = getAutoPartsForStore;

// Add event listener to the "Checkout" button
const checkoutBtn = document.getElementById('checkoutBtn');
checkoutBtn.addEventListener('click', checkout);

// Add event listener to the "Send Order" button
const sendOrderBtn = document.getElementById('sendOrderBtn');
//sendOrderBtn.addEventListener('click', sendOrder);     It was generating the order twice
// Remove the event listener to prevent multiple executions
sendOrderBtn.removeEventListener('click', sendOrder);