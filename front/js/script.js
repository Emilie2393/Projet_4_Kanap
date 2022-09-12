
// finales functions returns on Kanap 

finalProducts()

async function finalProducts() {

    // products get API list of products

    const products = await getProducts()

    for (let product of products) {
        publishProducts(product)
    }
}

// fetch API informations

function getProducts(){
    return fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(products => products)
    .catch(function(error){
        console.log('problème avec fetch :' + error.message);
    })}
    
// function for append Child used in the next function

function child(valeur1,valeur2){
    valeur1.appendChild(valeur2);
}

// complete HTML with corresponding informations - product definition is on the 1st function

function publishProducts(product){
    let items = document.getElementById('items');
    const a = document.createElement('a');
    child(items, a);
    a.setAttribute('href', './product.html');
    a.href += '?id=' + product._id;

    const article = document.createElement('article');
    child(a, article);

    const img = document.createElement('img');
    child(article, img);
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.altTxt);

    const h3 = document.createElement('h3');
    child(article, h3);
    h3.textContent = product.name;
    h3.setAttribute('class', 'productName');

    const p = document.createElement('p');
    child(article, p);
    p.textContent = product.description;
    p.setAttribute('class', 'productDescription');
}

