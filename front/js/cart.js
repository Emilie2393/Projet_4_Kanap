

(async function(){
    
    const local = await getLocal();
    console.log(local)
    getItem(local);

})()

// get local storage informations //

function getLocal(){
    return JSON.parse(localStorage.getItem('product'))
}

// get HTML position //

const item = document.querySelector('#cart__items');

// place informations of local storage and API into the cart. control the cart with functions // 

function getItem(local){
    
for (let i=0; i < local.length; i++) {

    let productId = local[i].reference;
    
    
    fetch("http://localhost:3000/api/products/" + productId)
    .then(res => res.json())
    .then(canape => {
        item.innerHTML = item.innerHTML + `<article class="cart__item" data-id=${productId} data-color=${local[i].couleur}>
        <div class="cart__item__img">
            <img src=${canape.imageUrl} alt=${canape.altTxt}>
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${canape.name}</h2>
                <p>${local[i].couleur}</p>
                <p> ${canape.price * local[i].quantite} € </p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${local[i].quantite}>
                </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
            </div>
            </div>
        </div>
    </article>`
    
    deleteIt(local);

    })
    .catch(function(error){
        console.log('problème avec fetch :' + error.message);
    })  
    
}}


// delete an item 

function deleteIt(local){
    const deleteItem = document.querySelectorAll('.deleteItem');
        for (let product of deleteItem){
            product.addEventListener('click', function(event){
                event.preventDefault();
                let deleteProduct = product.closest('article');
                deleteProduct.remove();

                // select the right item to delete
                const deleteId = deleteProduct.dataset.id;
                const deleteColor = deleteProduct.dataset.color;
                console.log(deleteId)

                // keep items to purchase by reference and colour, delete the rest of local storage
                local = local.filter((productToKeep) => productToKeep.reference !== deleteId || productToKeep.couleur !== deleteColor);
                localStorage.setItem('product', JSON.stringify(local));
                console.log(local)
            }
            )}
    }
