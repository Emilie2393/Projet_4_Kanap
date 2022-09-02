// 1 - Affiche tes produits avec leur prix récupérer depuis l'API
// 2 - Une fois afficher tu met à jour le prix total
// 3 - Créer une fonction Modifier
// 4 - Créer une fonction Supprimer
// 3 - Bind les boutons modifier
// 4 - Bind les boutons supprimer

(async function () {

    const local = await getLocal();
    console.log("local", local)
    await getItem(local);
    bindQuantityButton();
    bindDeleteButton();
    total();
    

})()

// get local storage informations //

function getLocal() {
    return JSON.parse(localStorage.getItem('product'))
}

// get HTML position //

const item = document.querySelector('#cart__items');

// place informations of local storage and API into the cart. control the cart with functions // 

async function getItem(local) {

    // for each products in the local storage //
    for (let i = 0; i < local.length; i++) {

        let productId = local[i].reference;
        console.log(local[i].quantite)


        await fetch("http://localhost:3000/api/products/" + productId)
            .then(res => res.json())
            .then(canape => {

                console.log(canape)
                item.innerHTML = item.innerHTML + `<article class="cart__item" data-id="${productId}" data-color="${local[i].couleur}">
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
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${(Number(local[i].quantite))}>
                </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
            </div>
            </div>
        </div>
    </article>`


                //deleteIt();
                //quantityUpdate();

                // get each unit price in an array { 'ProductId' : 1000 }
                
                productPriceArray.push({ 'prix': canape.price, 'identifiant': productId, 'couleur': local[i].couleur });
                

                
                // [10, 432423424]
                //
                // get each unit quantity un an array //
                //quantityArray.push(Number(local[i].quantite));



            })
            .catch(function (error) {
                console.log('problème avec fetch :' + error.message);
            })
    }
}



// get an array of each prices and quantity per product at the end of the HTML publication //

var productPriceArray = [];
console.log(productPriceArray)

//const quantityArray = [];


// get total quantity and prices before order //

function total() {

    const totalQuantity = document.querySelector('#totalQuantity');
    const totalPrice = document.querySelector('#totalPrice');


    let total = 0;
    let totalQuant = 0;
    const local = getLocal();
    

    for (i = 0; i < local.length; i++) {
        console.log("test",productPriceArray[i].prix)
        total = total + (productPriceArray[i].prix * local[i].quantite);
        totalQuant += Number(local[i].quantite);
        }
    


    // show quantity total and prices total if there is any changes on the page //
    totalPrice.textContent = total;
    totalQuantity.textContent = totalQuant;
    console.log("fonction totale local", local)
}

function GetPriceFromProductPriceArray(identifiant) {
    for (i = 0; i < productPriceArray.length; i++) {
        if (productPriceArray[i].identifiant == identifiant) {
            return productPriceArray[i].prix
        }
    }
}

// save quantity update into local storage //

function quantityUpdate(event) {
    const local = getLocal();
    let clicProduct = event.target.closest('article');
    const clicId = clicProduct.dataset.id;
    const clicColor = clicProduct.dataset.color;
    let newPrice = clicProduct.querySelectorAll('.cart__item__content__description > p:nth-child(3)');

    for (i = 0; i < local.length; i++) {
        if (local[i].reference == clicId && local[i].couleur == clicColor) {
            local[i].quantite = Number(event.target.value);
            console.log('nouvelle quantite local storage:', local[i].quantite);
            // update price on quantity change //
            newPrice[0].textContent = (local[i].quantite * GetPriceFromProductPriceArray(local[i].reference)) + " €";
            localStorage.setItem('product', JSON.stringify(local));
            total();
        }
    }
}

// 
function bindQuantityButton() {
    const quantityChange = document.querySelectorAll('.itemQuantity');
    for (let clic of quantityChange) {
        clic.addEventListener('change', quantityUpdate)
    }
}


function bindDeleteButton() {
    const deleteItem = document.querySelectorAll('.deleteItem');

    for (let product of deleteItem) {
        product.addEventListener('click', deleteIt)

    }
}

// delete an item 

function deleteIt(event) {
    let local = getLocal();
    let deleteProduct = event.target.closest('article');

    // select the right item to delete
    const deleteId = deleteProduct.dataset.id;
    const deleteColor = deleteProduct.dataset.color;

            local = local.filter((local) => local.reference !== deleteId || local.couleur !== deleteColor);
            localStorage.setItem('product', JSON.stringify(local));
            deleteProduct.remove();

            productPriceArray = productPriceArray.filter((product) => product.identifiant !== deleteId || product.couleur !== deleteColor)
            console.log("delete", productPriceArray)
            total();
            
            console.log("local", local)
            
        }









