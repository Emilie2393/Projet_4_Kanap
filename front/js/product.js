// finales functions returns on Kanap

async function finalProduct() {
    const productId = getProductId()
    console.log("productId:", productId)
    const productInfos = await getProductInfos(productId)
    console.log("productInfos:", productInfos)
    productPublication(productInfos)
    saveItems(productInfos)
}

finalProduct()

// get Id URL from welcome page to complete product page -----------------------------------------------------------------------------------

function getProductId() {
    return new URL(location.href).searchParams.get("id")
}

// fetch API informations and complete them with Id 

function getProductInfos(productId) {
    return fetch(`http://localhost:3000/api/products/${productId}`)
        .then(res => res.json())
        .then(products => products)
        .catch(function (error) {
            console.log('problème avec fetch :' + error.message);
        })
}

// include colors choices according to colors array length

function colorChoice(product) {
    for (let i = 0; i < product.colors.length; i++) {
        const colorOption = document.createElement('option');
        const optionValue = document.querySelector('#colors').appendChild(colorOption);
        colorOption.setAttribute('value', product.colors[i]);
        colorOption.textContent = product.colors[i];


    }
}

// complete HTML with corresponding informations

function productPublication(product) {
    const img = document.createElement('img');
    const item_img = document.querySelector('.item__img').appendChild(img);
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.altTxt);

    const title = document.querySelector('#title');
    title.textContent = product.name;

    const price = document.querySelector('#price');
    price.textContent = product.price;

    const description = document.querySelector('#description');
    description.textContent = product.description;

    colorChoice(product);

}

// save data into local storage to complete cart page ---------------------------------------------------------------------------------------

function saveBasket(storage) {
    localStorage.setItem('product', JSON.stringify(storage));
}

// select color and quantity

const valideButton = document.querySelector('#addToCart')

// select options, save them into the finale object and put them into local storage 

function saveItems(product) {

    // listen click on add button 
    valideButton.addEventListener('click', function (event) {

        event.preventDefault();

        const colorSelect = document.querySelector('#colors');
        const colorSave = colorSelect.value;

        const quantitySelect = document.querySelector('#quantity');
        const quantitySave = quantitySelect.value;

        if (colorSave == '' || quantitySave == 0) {
            window.alert("Merci d'ajouter une couleur et une quantité")
        }
        else {

            // save color and quantity into itemsObject
            let itemsObject = {
                reference: product._id,
                quantite: Number(quantitySave),
                couleur: colorSave,
            }

            let storage = JSON.parse(localStorage.getItem('product'));
            // if storage is empty
            if (storage == null) {
                let storage = [];
                storage.push(itemsObject);
                saveBasket(storage);
                window.alert('Article ajouté au panier')
            }
            // if storage has already an item 
            else {
                if (storage[0].reference == itemsObject.reference && storage[0].couleur == itemsObject.couleur) {
                    storage[0].quantite += itemsObject.quantite;
                    saveBasket(storage);
                    console.log('localstorage:', storage)
                }
                else {
                    storage.push(itemsObject);
                    saveBasket(storage);
                    console.log('localstorage:', storage)
                }
                window.alert('Article ajouté au panier')
            }
        }
    })
}






