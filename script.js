document.addEventListener('DOMContentLoaded', () => {
    // Function to update the cart display
    function updateCartDisplay() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartItemsContainer = document.querySelector('.cart-page');
        if (cartItemsContainer) {
            let totalPrice = 0;
            cartItemsContainer.innerHTML = ''; // Clear previous contents
            cartItems.forEach((item, index) => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <p>${item.name}</p>
                        <p>$${item.price} x ${item.quantity}</p>
                    </div>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                    <button onclick="removeFromCart(${index})" class="btn-remove">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
                totalPrice += item.price * item.quantity;
            });
            const totalDiv = document.createElement('div');
            totalDiv.classList.add('total-price');
            totalDiv.textContent = `Total: $${totalPrice}`;
            cartItemsContainer.appendChild(totalDiv);

            const checkoutButton = document.createElement('button');
            checkoutButton.classList.add('checkout-button');
            checkoutButton.innerText = 'Checkout';
            checkoutButton.addEventListener('click', () => {
                if (cartItems.length === 0) {
                    alert('Your cart is empty!');
                } else {
                    window.location.href = 'checkout.html';
                }
            });
            cartItemsContainer.appendChild(checkoutButton);
        }
    }

    // Add to cart functionality
    window.addToCart = function (productName, productPrice, productImage) {
        const quantityInput = document.querySelector(`input[name='${productName}']`);
        if (quantityInput) {
            const quantity = parseInt(quantityInput.value) || 1;
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            const existingProduct = cartItems.find(item => item.name === productName);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cartItems.push({ name: productName, price: productPrice, image: productImage, quantity: quantity });
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            alert(`${quantity} x ${productName} added to cart`);
            updateCartDisplay(); // Update the cart display dynamically
        } else {
            console.error('Quantity input not found for product:', productName);
        }
    };

    // Display cart items on page load
    updateCartDisplay();

    // Remove item from cart
    window.removeFromCart = function (index) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay(); // Update the cart display dynamically
    };

    // Update quantity of an item in the cart
    window.updateQuantity = function (index, quantity) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems[index].quantity = parseInt(quantity);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay(); // Update the cart display dynamically
    };

    // Render cart on checkout page
    if (window.location.pathname.includes('checkout.html')) {
        renderCart();
        document.getElementById('checkout-form').addEventListener('submit', (event) => {
            event.preventDefault();
            if (validateForm()) {
                localStorage.removeItem('cartItems');
                window.location.href = 'finish-payment.html';
            }
        });
    }

    // Function to render cart items on checkout page
    function renderCart() {
        const cartData = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartContainer = document.getElementById('cart-container');

        if (cartContainer) {
            cartContainer.innerHTML = '';
            if (cartData.length > 0) {
                cartData.forEach(product => {
                    const productElement = document.createElement('div');
                    productElement.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <p>${product.name}</p>
                        <p>Price: $${product.price.toFixed(2)}</p>
                        <p>Quantity: ${product.quantity}</p>
                    `;
                    cartContainer.appendChild(productElement);
                });
            } else {
                cartContainer.innerHTML = '<p>Your cart is empty</p>';
            }
        }

        const totalPriceElement = document.getElementById('total-price');
        if (totalPriceElement) {
            const totalPrice = cartData.reduce((total, product) => total + (product.price * product.quantity), 0);
            totalPriceElement.value = `$${totalPrice.toFixed(2)}`;
        }
    }

    // Validate form on checkout page
    function validateForm() {
        const cardNumber = document.getElementById('credit-card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;

        if (!/^\d{16}$/.test(cardNumber)) {
            alert('Credit Card Number must be 16 digits.');
            return false;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            alert('Expiry Date must be in MM/YY format.');
            return false;
        }

        if (!/^\d{3}$/.test(cvv)) {
            alert('CVV must be 3 digits.');
            return false;
        }

        return true;
    }
});
