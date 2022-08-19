
let items = document.getElementById('items');


finalProducts()

async function finalProducts() {
    const canapes = await getProducts()

    for (canape of canapes) {
        publishProducts(canape)
    }
}


function getProducts(){
    return fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(canapes => canapes)
    .catch(function(error){
        console.log('problème avec fetch :' + error.message);
    })}
    


// fetch('http://localhost:3000/api/products')
//     .then(res => res.json())
//     .then(canapes => {console.log(canapes)
    // for(canape of canapes){

    //     publishProducts(canape);
    // }


function child(valeur1,valeur2){
    valeur1.appendChild(valeur2);
}


function publishProducts(canape){
    const a = document.createElement('a');
    child(items, a);
    a.textContent = canape._id;
    a.setAttribute('href', './product.html');
    a.href += '?id=' + canape._id;

    const article = document.createElement('article');
    child(a, article);

    const img = document.createElement('img');
    child(article, img);
    img.setAttribute('src', canape.imageUrl);
    img.setAttribute('alt', canape.altTxt);

    const h3 = document.createElement('h3');
    child(article, h3);
    h3.textContent = canape.name;
    h3.setAttribute('class', 'productName');

    const p = document.createElement('p');
    child(article, p);
    p.textContent = canape.description;
    p.setAttribute('class', 'productDescription');
}
