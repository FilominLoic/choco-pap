function addToCart(article) {
    let cartItem = cart.find(item => item.id === article.id);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...article, quantity: 1 });
    }
    updateCart();
}
function updateCart() {
    let listproduit = document.getElementById('listproduit');
    listproduit.innerHTML = '';
    cart.forEach(item => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" width="50" height="50">
            <span>${item.title} - ${item.price} € x ${item.quantity}</span>
        `;
        listproduit.appendChild(listItem);
    });
    updateCartTotal();
}

// Fonction pour mettre à jour le total du panier
function updateCartTotal() {
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.querySelector('#total span').innerText = total.toFixed(2) + ' €';
}