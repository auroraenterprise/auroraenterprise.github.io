/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

var bigAmountIsAuracoin = true;

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

function updateAddressReadout() {
    $(".currentAddress").text(keys.address);
}

function switchBigAmount() {
    if (bigAmountIsAuracoin) {
        $("#bigAmountSymbol").text("A.");
        $("#bigAmountContent").attr("class", "currentAuro");
    } else {
        $("#bigAmountSymbol").text("A ");
        $("#bigAmountContent").attr("class", "currentAuracoin");
    }

    bigAmountIsAuracoin = !bigAmountIsAuracoin;

    updateAmountReadout();
}

$(function() {
    loadKeys();

    updateAmountReadout();
    updateAddressReadout();

    setInterval(updateAmountReadout, 10000);
});