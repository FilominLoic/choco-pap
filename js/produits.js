function displaytodo(article) {
 
    let products = document.getElementById('produits')
    let articleDiv=document.createElement("div")
    let image = document.createElement("img")
    image.src= article.image
    image.classList.add("imageproduit");
    articleDiv.appendChild(image)
    let title =document.createElement("h2")
    title.innerText= article.title
    articleDiv.appendChild(title);
    let prix = document.createElement("p")
    prix.innerText= article.price
    articleDiv.appendChild(prix)
    let note = document.createElement("p")
    note.innerText= article.note 
    articleDiv.appendChild(note)
    let ajoute = document.createElement("button")
    ajoute.classList.add("butonajoute");
    ajoute.innerText="Ajouter dans le panier"
    articleDiv.appendChild(ajoute)
    articleDiv.classList.add("articleDiv");
    products.appendChild(articleDiv)
}
onload = function () {
    fetch('./products.json')
        .then((reponse) => {
            reponse.json().then((produit) => {
                for (const article of produit) {
                    displaytodo(article);
                } 
                let products = document.getElementById('produits')
                 console.log(products)
            }).catch((error) => {
                console.log(error);
            })
        })
        .catch((error) => {
            console.error(error);
        });
}
