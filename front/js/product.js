// finales functions returns on Kanap

(async function(){
    const productId = getProductId()
    console.log(productId)
    const productInfos = await getProductInfos(productId)
    console.log(productInfos)
    productPublication(productInfos)

})()


// get Id URL from welcome page

function getProductId(){
    return new URL(location.href).searchParams.get("id")
}

// fetch API informations and complete them with Id 

function getProductInfos(productId){
    return fetch(`http://localhost:3000/api/products/${productId}`)
    .then(res => res.json())
    .then(canapes => canapes)
    .catch(function(error){
        console.log('problème avec fetch :' + error.message);
    })}

// include colors choices according to colors array length

function colorChoice (productInfos){
    for (let i = 0; i < productInfos.colors.length ; i++){
        const colorOption = document.createElement('option');
        const optionValue = document.querySelector('#colors').appendChild(colorOption);
        colorOption.setAttribute('value', productInfos.colors[i]);
        colorOption.textContent = productInfos.colors[i];
        console.log(colorOption.textContent)   
}
}

// complete HTML with corresponding informations

function productPublication(productInfos){
    const img = document.createElement('img');
    const item_img = document.querySelector('.item__img').appendChild(img);
    img.setAttribute('src', productInfos.imageUrl);
    img.setAttribute('alt', productInfos.altTxt);

    const title = document.querySelector('#title');
    title.textContent = productInfos.name;

    const price = document.querySelector('#price');
    price.textContent = productInfos.price;

    const description = document.querySelector('#description');
    description.textContent = productInfos.description;

    colorChoice(productInfos);
    
    }
    



