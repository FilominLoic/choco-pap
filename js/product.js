document.addEventListener("DOMContentLoaded", function() {
    // Fonction pour récupérer les paramètres de l'URL
    function getQueryParams() {
        const params = {};
        window.location.search.substring(1).split("&").forEach(pair => {
            const [key, value] = pair.split("=");
            params[key] = decodeURIComponent(value);
        });
        return params;
    }

    const params = getQueryParams();
    const productId = params.id;

    fetch('./products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                document.getElementById('product-image').src = product.image;
                document.getElementById('product-title').innerText = product.title;
                document.getElementById('product-price').innerText = `${product.price} €`;
                document.getElementById('product-description').innerText = product.description;
                document.getElementById('product-ingredients').innerText = product.ingredients;

                // Ajouter un événement pour ajouter au panier
                document.querySelector('.butonajoute').addEventListener('click', () => {
                    const quantityElement = document.getElementById('qte');
                    if (quantityElement) {
                        const quantity = parseInt(quantityElement.value);
                        if (quantity > 0) {
                            addToCart(product, quantity);
                        } else {
                            alert('Veuillez entrer une quantité valide.');
                        }
                    } else {
                        console.error("L'élément de quantité n'a pas été trouvé.");
                    }
                });
            } else {
                document.getElementById('product-details').innerText = "Produit non trouvé.";
            }
        })
        .catch(error => {
            console.error('Erreur de chargement des produits:', error);
        });

    // Fonction pour ajouter un produit au panier
    function addToCart(product, quantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let cartItem = cart.find(item => item.id === product.id);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    // Fonction pour mettre à jour la quantité d'un produit dans le panier
    function updateQuantity(id, newQuantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let cartItem = cart.find(item => item.id === id);
        if (cartItem) {
            cartItem.quantity = newQuantity;
            if (cartItem.quantity <= 0) {
                removeFromCart(id);
            } else {
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            }
        }
    }

    // Fonction pour supprimer un produit du panier
    function removeFromCart(id) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    // Fonction pour mettre à jour le panier et l'afficher
    function updateCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let list = document.getElementById('listproduit');
        let total = 0;

        list.innerHTML = '';
        cart.forEach(item => {
            let listItem = document.createElement('li');
            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" width="50" height="50">
                <span>${item.title} - ${item.price} € x </span>
                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                <button class="remove-btn" data-id="${item.id}">Supprimer</button>
            `;
            list.appendChild(listItem);
            total += item.price * item.quantity;

            // Ajouter un écouteur d'événement pour changer la quantité
            listItem.querySelector('.quantity-input').addEventListener('input', (event) => {
                let newQuantity = parseInt(event.target.value);
                if (isNaN(newQuantity) || newQuantity <= 0) {
                    alert('Veuillez entrer une quantité valide.');
                    return;
                }
                updateQuantity(item.id, newQuantity);
            });

            // Ajouter un écouteur d'événement pour supprimer le produit
            listItem.querySelector('.remove-btn').addEventListener('click', () => {
                removeFromCart(item.id);
            });
        });

        document.getElementById('total').innerText = `Total: ${total.toFixed(2)} €`;
        document.getElementById('quantity').innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Initialiser la quantité de panier et afficher les éléments au chargement de la page
    updateCart();

    // Ajouter un écouteur d'événement pour réinitialiser le panier
    document.querySelector('.reset').addEventListener('click', () => {
        localStorage.removeItem('cart');
        updateCart();
    });

    // Ajouter un écouteur d'événement pour valider le panier
    document.querySelector('.submit').addEventListener('click', () => {
        alert('Panier validé!');
        localStorage.removeItem('cart');
        updateCart();
    });
});
