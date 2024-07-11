let productsData = [];

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
    articleDiv.appendChild(ajoute);
    articleDiv.classList.add("articleDiv");
    products.appendChild(articleDiv);
}

// Fonction pour filtrer les produits
function filterProducts() {
    console.log('Filtrage des produits...'); // Message de debug

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
        const inCategory = selectedCategories.length === 0 || selectedCategories.some(category => product.category[category]);
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

// Chargement initial des produits et ajout des écouteurs d'événements pour les filtres
window.onload = function () {
    fetch('./products.json')
        .then((response) => response.json())
        .then((produit) => {
            productsData = produit;
            displayFilteredProducts(productsData);

            // Ajout des écouteurs d'événements pour les filtres
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
}
