document.addEventListener('DOMContentLoaded', function() {
    console.clear();

    // Update cart badge if cookie exists
    if (document.cookie.includes(',counter=')) {
        const counter = document.cookie.split(',')[1].split('=')[1];
        document.getElementById("badge").innerHTML = counter;
    }

    // Fetch products and render cart
    fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/product')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            renderCart(products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            document.getElementById('cartContainer').innerHTML = `
                <div class="error-message">
                    <h2>Error Loading Cart</h2>
                    <p>We couldn't load your cart items. Please try again later.</p>
                </div>
            `;
        });

    function renderCart(products) {
        const cartContainer = document.getElementById('cartContainer');
        const boxContainer = document.createElement('div');
        boxContainer.id = 'boxContainer';
        cartContainer.appendChild(boxContainer);

        // Check if cart is empty
        if (!document.cookie.includes('orderId=')) {
            boxContainer.innerHTML = `
                <div class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <a href="index.html">Continue Shopping</a>
                </div>
            `;
            document.getElementById('totalItem').textContent = 'Total Items: 0';
            return;
        }

        const counter = Number(document.cookie.split(',')[1].split('=')[1]);
        document.getElementById("totalItem").textContent = `Total Items: ${counter}`;

        const items = document.cookie.split(',')[0].split('=')[1].split(' ');
        let totalAmount = 0;
        const itemCounts = {};

        // Count quantity of each item
        items.forEach(item => {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        });

        // Render each unique item with quantity
        Object.keys(itemCounts).forEach(itemId => {
            if (!itemId) return; // Skip empty strings
            
            const product = products.find(p => p.id === itemId);
            if (product) {
                const quantity = itemCounts[itemId];
                totalAmount += product.price * quantity;
                createCartItem(product, quantity);
            }
        });

        // Create total section
        const totalContainer = document.createElement('div');
        totalContainer.id = 'totalContainer';

        const totalDiv = document.createElement('div');
        totalDiv.id = 'total';

        const totalTitle = document.createElement('h2');
        totalTitle.textContent = 'Total Amount';
        totalDiv.appendChild(totalTitle);

        const totalAmountElement = document.createElement('h4');
        totalAmountElement.textContent = `Amount: Rs ${totalAmount}`;
        totalAmountElement.id = 'toth4';
        totalDiv.appendChild(totalAmountElement);

        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'button';

        const placeOrderBtn = document.createElement('button');
        const placeOrderLink = document.createElement('a');
        placeOrderLink.href = 'orderPlaced.html';
        placeOrderLink.textContent = 'Place Order';
        placeOrderBtn.appendChild(placeOrderLink);
        buttonDiv.appendChild(placeOrderBtn);
        totalDiv.appendChild(buttonDiv);

        totalContainer.appendChild(totalDiv);
        cartContainer.appendChild(totalContainer);
    }

    function createCartItem(product, quantity) {
        const boxContainer = document.getElementById('boxContainer');
        
        const boxDiv = document.createElement('div');
        boxDiv.id = 'box';

        const productImage = document.createElement('img');
        productImage.src = product.preview;
        productImage.alt = product.name;

        const productName = document.createElement('h3');
        productName.textContent = `${product.name} × ${quantity}`;

        const productPrice = document.createElement('h4');
        productPrice.textContent = `Amount: Rs${product.price * quantity}`;

        boxDiv.appendChild(productImage);
        boxDiv.appendChild(productName);
        boxDiv.appendChild(productPrice);
        boxContainer.appendChild(boxDiv);
    }
});