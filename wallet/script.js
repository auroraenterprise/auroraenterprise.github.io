/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

var keys = {
    address: null,
    keyList: null,
    publicKey: null,
    privateKey: null
};

function loadKeys() {
    keys.keyList = JSON.parse(localStorage.getItem("walletKeys") || "{}");
    keys.address = getURLParameter("address");
    keys.privateKey = keys.keyList[keys.address].privateKey;

    if (keys.address == null) {
        window.location.href = "setup.html";
    }
}