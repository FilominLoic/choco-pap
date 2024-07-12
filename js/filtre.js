
    let productsData = [];
    let cart = [];

    // Fonction pour afficher un produit
    function displayProduct(article) {
        let products = document.getElementById('produits');
        let articleDiv = document.createElement("div");

        let image = document.createElement("img");
        image.src = article.image;
        image.classList.add("imageproduit");
        articleDiv.appendChild(image);

        let title = document.createElement("h2");
        title.innerText = article.title;
        articleDiv.appendChild(title);

        let prix = document.createElement("p");
        prix.innerText = `${article.price} €`;
        articleDiv.appendChild(prix);

        let note = document.createElement("p");
        note.innerText = `Note : ${article.note}`;
        articleDiv.appendChild(note);

        let ajoute = document.createElement("button");
        ajoute.classList.add("butonajoute");
        ajoute.innerText = "Ajouter dans le panier";
        ajoute.addEventListener('click', () => addToCart(article));
        articleDiv.appendChild(ajoute);

        articleDiv.classList.add("articleDiv");
        products.appendChild(articleDiv);
    }

    // Fonction pour ajouter un produit au panier
    function addToCart(article) {
        let cartItem = cart.find(item => item.id === article.id);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...article, quantity: 1 });
        }
        updateCart();
    }

    // Fonction pour mettre à jour la quantité d'un produit dans le panier
    function updateQuantity(id, newQuantity) {
        let cartItem = cart.find(item => item.id === id);
        if (cartItem) {
            cartItem.quantity = newQuantity;
            if (cartItem.quantity <= 0) {
                removeFromCart(id);
            } else {
                updateCart();
            }
        }
    }

    // Fonction pour supprimer un produit du panier
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }

    // Fonction pour réinitialiser le panier
    function resetCart() {
        cart = [];
        updateCart();
    }

    // Fonction pour mettre à jour l'affichage du panier
    function updateCart() {
        let listproduit = document.getElementById('listproduit');
        listproduit.innerHTML = '';

        cart.forEach(item => {
            let listItem = document.createElement('li');

            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" width="50" height="50">
                <span>${item.title} - ${item.price} € x </span>
                <input type="number" value="${item.quantity}" min="0" class="quantity-input" data-id="${item.id}">
                <button class="remove-btn" data-id="${item.id}">Supprimer</button>
            `;

            listproduit.appendChild(listItem);
        });

        updateCartTotal();
        updateCartQuantity();

        // Ajout des écouteurs d'événements pour les champs de saisie de quantité
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (event) => {
                let newQuantity = parseInt(event.target.value);
                let id = event.target.getAttribute('data-id');
                updateQuantity(id, newQuantity);
            });
        });

        // Ajout des écouteurs d'événements pour les boutons de suppression
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                let id = event.target.getAttribute('data-id');
                removeFromCart(id);
            });
        });

        // Sauvegarder le panier dans le LocalStorage
        saveCart();
    }

    // Fonction pour mettre à jour le total du panier
    function updateCartTotal() {
        let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        document.querySelector('#total span').innerText = total.toFixed(2) + ' €';
    }

    // Fonction pour mettre à jour la quantité d'articles affichée dans l'icône du panier
    function updateCartQuantity() {
        let quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('quantity').innerText = quantity;
    }

    // Fonction pour filtrer les produits
    function filterProducts() {
        const allCheckbox = document.getElementById('ch-all');
        if (allCheckbox.checked) {
            displayFilteredProducts(productsData);
            return;
        }

        const selectedCategories = Array.from(document.querySelectorAll('.filter-checkbox:checked'))
                                        .map(cb => cb.id.replace('ch-', ''));

        const minPrice = parseFloat(document.getElementById('prix-min').value) || 0;
        const maxPrice = parseFloat(document.getElementById('prix-max').value) || Infinity;
        const minNote = parseFloat(document.getElementById('note-min').value) || 0;
        const maxNote = parseFloat(document.getElementById('note-max').value) || 5;

        const filteredProducts = productsData.filter(product => {
            const inCategory = selectedCategories.length === 0 || selectedCategories.some(category => product.category.includes(category));
            const inPriceRange = product.price >= minPrice && product.price <= maxPrice;
            const inNoteRange = product.note >= minNote && product.note <= maxNote;
            return inCategory && inPriceRange && inNoteRange;
        });

        displayFilteredProducts(filteredProducts);
    }

    // Fonction pour afficher les produits filtrés
    function displayFilteredProducts(products) {
        const productsContainer = document.getElementById('produits');
        productsContainer.innerHTML = '';
        products.forEach(product => displayProduct(product));
    }

    // Fonction pour sauvegarder le panier dans le LocalStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Fonction pour restaurer le panier depuis le LocalStorage
    function loadCart() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            updateCart();
        }
    }

    // Chargement initial et ajout des écouteurs d'événements
    window.onload = function () {
        fetch('./products.json')
            .then((response) => response.json())
            .then((produit) => {
                productsData = produit;
                displayFilteredProducts(productsData);

                document.querySelectorAll('.filter-checkbox').forEach(cb => cb.addEventListener('change', () => {
                    if (cb.id === 'ch-all') {
                        document.querySelectorAll('.filter-checkbox:not(#ch-all)').forEach(otherCb => {
                            otherCb.checked = false;
                        });
                    } else {
                        document.getElementById('ch-all').checked = false;
                    }
                    filterProducts();
                }));

                document.querySelectorAll('.filter-input').forEach(input => input.addEventListener('input', filterProducts));
            })
            .catch((error) => {
                console.error('Erreur de chargement des produits:', error);
            });

        // Ajout de l'écouteur d'événement pour le bouton de réinitialisation du panier
        document.querySelector('.reset').addEventListener('click', resetCart);

        // Charger le panier depuis le LocalStorage
        loadCart();
    }

