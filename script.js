let cartItems = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchCartData();
});

async function fetchCartData() {
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889');
        const data = await response.json();
        cartItems = data.items.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }));
        renderCart();
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    let subtotal = 0;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemRow = document.createElement('tr');
        itemRow.classList.add('border-b');
        itemRow.innerHTML = `
            <td class="py-4 px-4 flex items-center">
                <img alt="${item.title}" class="h-16 w-16 rounded-md mr-4" src="${item.image}"/>
                <span>${item.title}</span>
            </td>
            <td class="py-4 px-4">₹ ${formatCurrency(item.price)}</td>
            <td class="py-4 px-4">
                <input class="w-16 border rounded-md text-center" type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)"/>
            </td>
            <td class="py-4 px-4">₹ ${formatCurrency(itemTotal)}</td>
            <td class="py-4 px-4 text-yellow-500 cursor-pointer" onclick="removeItem(${item.id})">
                <i class="fas fa-trash"></i>
            </td>
        `;
        cartItemsContainer.appendChild(itemRow);
    });

    document.getElementById('cart-subtotal').innerText =` ₹ ${formatCurrency(subtotal)}`;
    document.getElementById('cart-total').innerText = `₹ ${formatCurrency(subtotal)}`;
}

function updateQuantity(id, quantity) {
    const item = cartItems.find(item => item.id === id);
    if (item) {
        item.quantity = parseInt(quantity);
        renderCart();
    }
}

function removeItem(id) {
    const itemIndex = cartItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        cartItems.splice(itemIndex, 1);
        renderCart();
    }
}

function formatCurrency(value) {
    return (value / 100).toFixed(2); // Assuming price is in paise
}