

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

        await fetch("http://localhost:3000/api/products/" + local[i].reference)
            .then(res => res.json())
            .then(product => {
                item.innerHTML = item.innerHTML + `<article class="cart__item" data-id="${local[i].reference}" data-color="${local[i].couleur}">
        <div class="cart__item__img">
            <img src=${product.imageUrl} alt=${product.altTxt}>
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${local[i].couleur}</p>
                <p> ${product.price * local[i].quantite} € </p>
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

                // get each unit price in an array 

                productPriceArray.push({ 'price': product.price, 'identifier': local[i].reference, 'color': local[i].couleur });

            })
            .catch(function (error) {
                console.log('problème avec fetch :' + error.message);
            })
    }
}



// array of objects 'price' matching 'identifier'

var productPriceArray = [];
console.log(productPriceArray)


// get total quantity and prices before order //

function total() {

    const totalQuantity = document.querySelector('#totalQuantity');
    const totalPrice = document.querySelector('#totalPrice');

    let total = 0;
    let totalQuant = 0;
    const local = getLocal();

    for (i = 0; i < local.length; i++) {
        total = total + (productPriceArray[i].price * local[i].quantite);
        totalQuant += Number(local[i].quantite);
    }

    // show quantity total and prices total if there is any changes on the page //
    totalPrice.textContent = total;
    totalQuantity.textContent = totalQuant;
}


// bind quantity change to quantityUpdate function 

function bindQuantityButton() {
    const quantityChange = document.querySelectorAll('.itemQuantity');
    for (let clic of quantityChange) {
        clic.addEventListener('change', quantityUpdate)
    }
}

// get only price from productPriceArray

function getPriceFromProductPriceArray(identifiant) {
    for (i = 0; i < productPriceArray.length; i++) {
        if (productPriceArray[i].identifier == identifiant) {
            return productPriceArray[i].price
        }
    }
}

// save quantity update into local storage //

function quantityUpdate(event) {
    let local = getLocal();
    let clicProduct = event.target.closest('article');
    const clicId = clicProduct.dataset.id;
    const clicColor = clicProduct.dataset.color;
    let newPrice = clicProduct.querySelectorAll('.cart__item__content__description > p:nth-child(3)');

    for (i = 0; i < local.length; i++) {
        if (local[i].reference == clicId && local[i].couleur == clicColor) {
            local[i].quantite = Number(event.target.value);
            console.log('nouvelle quantite local storage:', local[i].quantite);
            // update price on quantity change //
            newPrice[0].textContent = (local[i].quantite * getPriceFromProductPriceArray(local[i].reference)) + " €";
            localStorage.setItem('product', JSON.stringify(local));
            total();
        }
    }
}

// bind delete click to deleteIt function

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

    // update list to get the right calculation

    productPriceArray = productPriceArray.filter((product) => product.identifier !== deleteId || product.color !== deleteColor)
    console.log("delete", productPriceArray)
    total();

    // clear localStorage if all items are deleted

    if (local.length == 0) {
        localStorage.clear();
    }
}

// get form informations from HTML -------------------------------------------------------------------------------------------------------- 

let form = document.querySelector('.cart__order__form');
const submitForm = document.querySelector('#order');

// Listen click on submit button

function bindSubmitButton() {
    submitForm.addEventListener('click', formInformations)
}

bindSubmitButton()

// create an array of product-ID

let products = [];
console.log("id", products)
function getIdFromLocal() {
    let local = getLocal();
    for (let product of local) {
        products.push(product.reference)
    }
}

getIdFromLocal()

// create contact object from each input and save them into local Storage

function formInformations(event) {

    const contact = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value
    }

    if (contact.firstName == "" || contact.lastName == "" || contact.address == "" || contact.city == "" || contact.email == "") {

    }
    else {
        event.preventDefault();
        submitForm.removeAttribute('disabled', 'disabled');

        let contactJson = localStorage.setItem("contact", JSON.stringify(contact));
        let contactScript = JSON.parse(localStorage.getItem('contact'));

        const toSend = {
            contact,
            products
        };
        console.log("send", toSend)

        postInformations(toSend)
    }
}

// listen each change on differents inputs

firstName.addEventListener('change', function () {
    nameCheck(firstName);
})
lastName.addEventListener('change', function () {
    nameCheck(lastName);
})
city.addEventListener('change', function () {
    nameCheck(city);
})
address.addEventListener('change', function () {
    adressCheck(address);
})
email.addEventListener('change', function () {
    mailCheck(email);
})

// control data with regex and choose the right message 

function nameCheck(formInput) {

    let nameControl = new RegExp('^[a-zéèìïã(A-Z\-\\s+)?]+$');
    let nameTest = nameControl.test(formInput.value);
    let errorMessage = formInput.nextElementSibling;

    if (nameTest == false) {
        errorMessage.innerHTML = 'Champ invalide : caractères spéciaux et chiffres interdits';
        submitForm.setAttribute('disabled', 'disabled');
    }
    else {
        errorMessage.innerHTML = " ";
        submitForm.removeAttribute('disabled', 'disabled');
    }
}

function adressCheck(formInput) {
    let adressControl = new RegExp('^[a-zéèìïã(A-Z0-9\\s+)?]+$')
    let adressTest = adressControl.test(formInput.value);
    let errorMessage = formInput.nextElementSibling;

    if (adressTest == false) {
        submitForm.setAttribute('disabled', 'disabled');
        errorMessage.innerHTML = 'Champ invalide : caractères spéciaux interdits';

    }
    else {
        errorMessage.innerHTML = " ";
        submitForm.removeAttribute('disabled', 'disabled');
    }
}

function mailCheck(formInput) {
    let mailControl = new RegExp('^[a-zA-Z0-9\-._]+[@]{1}[a-zA-Z0-9\-._]+[.]{1}[a-z]{2,10}$', 'g')
    let mailTest = mailControl.test(formInput.value);
    let errorMessage = formInput.nextElementSibling;

    if (mailTest == false) {
        errorMessage.innerHTML = 'Champ invalide : format email requis';
        submitForm.setAttribute('disabled', 'disabled');
    }
    else {
        errorMessage.innerHTML = " ";
        submitForm.removeAttribute('disabled', 'disabled');
    }
}

// post command finales informations on confirmation page ----------------------------------------------------------------------------

async function postInformations(infos) {
    console.log(JSON.stringify(infos))
    await fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(infos),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(order => {
            console.log(order.orderId);
            window.location.href = `./confirmation.html?commande=${order.orderId}`;
        })
}






