/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

const HTTP_PROXY = "https://crossrun.onrender.com/";

var peersListArguments = ["https://aur.xyz/auracoin-peers/", "main", "firstlevel"];
var amountIsAuracoin = true;

var keys = {
    address: null,
    keyList: null,
    publicKey: null,
    privateKey: null
};

function loadKeys() {
    keys.keyList = JSON.parse(localStorage.getItem("walletKeys") || "{}");
    keys.address = getURLParameter("address") || localStorage.getItem("currentSelectedAddress");
    
    if (keys.address == null) {
        window.location.href = "setup.html";
    }
    
    keys.publicKey = null;
    keys.privateKey = keys.keyList[keys.address].privateKey;
}

function getPeerList(callback = function() {}, error = function() {}, address = "https://aur.xyz/auracoin-peers/", type = "main", level = "firstlevel") {
    $.ajax({
        url: address + type + "-" + level + ".aup",
        success: callback,
        error: error
    });
}

function getConsensus(data) {
    if (Object.keys(data["hash"]).length > 0) {
        var hash = Object.keys(data["hash"]).reduce(function(a, b) {
            if (data[a] > data[b]) {
                return a;
            } else {
                return b;
            }
        });

        return data["data"][hash];
    } else {
        return null;
    }
}

function getNodeValues(command = "/", callback = function() {}, peersListArguments = []) {
    getPeerList(function(data) {
        var peers = data.split("\n").filter(function(element) {
            return (
                element.trim() != "" &&
                !element.startsWith("#")
            );
        });

        var proxiedPeers = [];

        for (var i = 0; i < peers.length; i++) {
            if (!peers[i].startsWith("https://")) {
                proxiedPeers.push(peers[i]);
            }
        }

        var peerResultsHash = {};
        var peerResultsData = {};
        var peerCount = 0;

        if (peers.length > 0) {
            for (var i = 0; i < peers.length; i++) {
                var proxyPrefix = "";

                if (proxiedPeers.includes(peers[i])) {
                    proxyPrefix = HTTP_PROXY;
                }

                $.ajax({
                    url: proxyPrefix + peers[i] + command,
                    timeout: 5000,
                    success: function(data) {
                        peerResultsData[CryptoJS.SHA256(data)] = data;

                        if (typeof peerResultsHash[data] == "number") {
                            peerResultsHash[CryptoJS.SHA256(data)]++;
                        } else {
                            peerResultsHash[CryptoJS.SHA256(data)] = 1;
                        }

                        peerCount++;

                        if (peerCount >= peers.length) {
                            callback({hash: peerResultsHash, data: peerResultsData});
                        }
                    },
                    error: function() {
                        peerCount++;

                        if (peerCount >= peers.length) {
                            callback({hash: peerResultsHash, data: peerResultsData});
                        }
                    }
                });
            }
        } else {
            callback({});
        }
    }, function() {
        callback(null);
    }, ...peersListArguments);
}

function getPublicKey(address, callback = function() {}, peersListArguments = []) {
    getNodeValues("/getAddressPublicKey?address=" + address, function(data) {
        try {
            callback(getConsensus(data).split("/")[2]);
        } catch (e) {
            callback(null);
        }
    }, peersListArguments);
}

function getAddressBalance(address, callback = function() {}, peersListArguments = []) {
    getNodeValues("/getAddressBalance?address=" + address, function(data) {
        try {
            callback(Number(getConsensus(data).split("/")[2]));
        } catch (e) {
            callback(null);
        }
    }, peersListArguments);
}

function generateKeyPair() {
    var keyPair = new KJUR.crypto.ECDSA({curve: "secp256k1"}).generateKeyPairHex();

    return {
        publicKey: keyPair.ecpubhex.substring(2),
        privateKey: keyPair.ecprvhex
    };
}

function generateTransactionURL(sender, senderPublicKey, receiver, amount, certificate, signature, nonce) {
    return "/handleTransaction?sender=" + sender +
    "&senderPublicKey=" + senderPublicKey +
    "&receiver=" + receiver +
    "&amount=" + amount +
    "&certificate=" + certificate +
    "&signature=" + signature +
    "&nonce=" + nonce
}

function sendTransaction(sender, senderPublicKey, receiver, amount, certificate, signature, nonce, callback = function() {}, peersListArguments = []) {
    getNodeValues((
        generateTransactionURL(sender, senderPublicKey, receiver, amount, certificate, signature, nonce)
    ), callback, peersListArguments);
}

function updatePublicKey() {
    getPublicKey(keys.address, function(data) {
        keys.publicKey = data;
    }, peersListArguments);
}

function updateAmountReadout() {
    getAddressBalance(keys.address, function(data) {
        var currentAuro = data;
        var currentAuracoin;

        lastAddressBalance = currentAuro;
        
        if (currentAuro == null) {
            currentAuro = "----------";
            currentAuracoin = "--";
        } else {
            currentAuracoin = currentAuro / AURO_IN_AURACOIN;
        }

        $(".currentAuro").text(currentAuro);
        $(".currentAuracoin").text(currentAuracoin);
        $("title").text(_("auroraAuracoinAmount", "A " + currentAuracoin));
    }, peersListArguments);
}

function updateAddressReadout() {
    $(".currentAddress").text(keys.address);

    $(".currentAddressQR").attr("src", "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=auracoin:" + keys.address + "&bgcolor=ffffff&color=000000");
    $(".currentAddressQRTab").attr("src", "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=auracoin:" + keys.address + "&bgcolor=f0f0f0&color=262626");
}

function switchAmount() {
    if (amountIsAuracoin) {
        $(".amountSymbol").text("A.");
        $(".amountContent").removeClass("currentAuracoin");
        $(".amountContent").addClass("currentAuro");
    } else {
        $(".amountSymbol").text("A ");
        $(".amountContent").removeClass("currentAuro");
        $(".amountContent").addClass("currentAuracoin");
    }

    amountIsAuracoin = !amountIsAuracoin;

    updateAmountReadout();
}

$(function() {
    if (getURLParameter("plURL") != null || (localStorage.getItem("plURL") != null && localStorage.getItem("plURL") != "null")) {
        peersListArguments[0] = getURLParameter("plURL") || localStorage.getItem("plURL");

        if (getURLParameter("plURL") != null) {
            localStorage.setItem("plURL", getURLParameter("plURL"));
        }
    }

    if (getURLParameter("plNetwork") != null || (localStorage.getItem("plNetwork") != null && localStorage.getItem("plNetwork") != "null")) {
        peersListArguments[1] = getURLParameter("plNetwork") || localStorage.getItem("plNetwork");

        if (getURLParameter("plNetwork") != null) {
            localStorage.setItem("plNetwork", getURLParameter("plNetwork"));
        }
    }

    if (getURLParameter("plLevel") != null || (localStorage.getItem("plLevel") != null && localStorage.getItem("plLevel") != "null")) {
        peersListArguments[2] = getURLParameter("plLevel") || localStorage.getItem("plLevel");

        if (getURLParameter("plLevel") != null) {
            localStorage.setItem("plLevel", getURLParameter("plLevel"));
        }
    }

    if (getURLParameter("address") != null) {
        localStorage.setItem("currentSelectedAddress", getURLParameter("address"));
    }
});
