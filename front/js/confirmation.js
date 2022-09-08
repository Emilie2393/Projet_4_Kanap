// get orderId from url 
function getOrderId(){
    return new URL(location.href).searchParams.get("commande");
}

let OrderHtml = document.querySelector('#orderId').innerHTML = getOrderId();