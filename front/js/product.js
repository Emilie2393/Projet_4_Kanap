(async function(){
    const produitId = getproduitId()
    const produitInfos = getproduitInfos(produitId)
    produitPublication(produitInfos)

})()