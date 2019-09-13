/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

const ADDRESS_LENGTH = 10;
const PUBLIC_KEY_LENGTH = 128;
const PRIVATE_KEY_LENGTH = 64;
const TRANSACTION_NONCE_RANGE = Math.random(2, 64) - 1;
const AURO_IN_AURACOIN = Math.pow(10, 8);

function getURLParameter(name) {
    return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null;
}

function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (min - max + 1)) + min;
}

function toHexString(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), function(data) {
        return "00" + data.toString(16).slice(-2)
    }).join("");
}