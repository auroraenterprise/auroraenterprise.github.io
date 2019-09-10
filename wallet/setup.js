/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

function setUpWallet() {
    var address = $("#address").val();
    var privateKey = $("#privateKey").val();

    var keyList = {};

    if (address == "" && privateKey == "") {
        $("#setUpWalletError").text(_("fieldsRequiredError"));
    } else if (address.length == ADDRESS_LENGTH && privateKey.length == PRIVATE_KEY_LENGTH) {
        keyList[address] = {
            privateKey: privateKey
        };

        localStorage.setItem("walletKeys", JSON.stringify(keyList));
        localStorage.setItem("currentSelectedAddress", address);

        window.location.href = "index.html";
    } else {
        $("#setUpWalletError").text(_("setUpWalletKeyError"));
    }
}