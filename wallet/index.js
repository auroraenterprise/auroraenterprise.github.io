/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

function updateAmountReadout() {
    getAddressBalance(keys.address, function(data) {
        var currentAuro = data;
        var currentAuracoin;
        
        if (currentAuro == null) {
            currentAuro = "----------";
            currentAuracoin = "--";
        } else {
            currentAuracoin = currentAuro / AURO_IN_AURACOIN;
        }

        $(".currentAuro").text(currentAuro);
        $(".currentAuracoin").text(currentAuracoin);
    }, ["https://aur.xyz/auracoin-peers/", "test", "firstlevel"]);
}

$(function() {
    loadKeys();

    updateAmountReadout();

    setInterval(updateAmountReadout, 10000);
});