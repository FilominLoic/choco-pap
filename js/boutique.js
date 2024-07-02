const openShopping = document.getElementById('panier');
const closeShopping = document.getElementById('closelist');
const list = document.getElementById('list');
const listproduit = document.getElementById('listproduit');
const listshopping = document.getElementById('listshopping');
const total = document.getElementById('total');
const quantity = document.getElementById('quantity');

openShopping.addEventListener('click', () => {
    listshopping.classList.add("show");
    listshopping.classList.remove("hide");
    console.log('entre');
})
closeShopping.addEventListener('click', () => {
    listshopping.classList.remove("show");
    console.log('sortie');
    listshopping.classList.add("hide");
});


    
