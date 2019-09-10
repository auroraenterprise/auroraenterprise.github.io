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
    keys.address = getURLParameter("address") || localStorage.getItem("currentSelectedAddress");
    keys.privateKey = keys.keyList[keys.address].privateKey;

    if (keys.address == null) {
        window.location.href = "setup.html";
    }
}

function getPeersList(callback = function() {}, error = function() {}, address = "https://aur.xyz/auracoin-peers/", type = "main", level = "firstlevel") {
    $.ajax({
        url: address + type + "-" + level + ".aup",
        success: function() {
            callback(...arguments);
        },
        error: function() {
            error(...arguments);
        }
    });
}

function getConsensus(data) {
    if (Object.keys(data).length > 0) {
        return Object.keys(data).reduce(function(a, b) {
            if (data[a] > data[b]) {
                return a;
            } else {
                return b;
            }
        });
    } else {
        return null;
    }
}

function getNodeValues(command = "/", callback = function() {}, peersListArguments = []) {
    getPeersList(function(data) {
        var peers = data.split("\n").filter(function(element) {
            return (
                element.trim() != "" &&
                !element.startsWith("#")
            );
        });

        var peerResults = {};
        var peerCount = 0;

        if (peers.length > 0) {
            for (var i = 0; i < peers.length; i++) {
                $.ajax({
                    url: peers[i] + command,
                    success: function(data) {
                        if (typeof peerResults[data] == "number") {
                            peerResults[data]++;
                        } else {
                            peerResults[data] = 1;
                        }

                        peerCount++;

                        if (peerCount >= peers.length) {
                            callback(peerResults);
                        }
                    },
                    error: function() {
                        peerCount++;

                        if (peerCount >= peers.length) {
                            callback(peerResults);
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

function getAddressBalance(address, callback = function() {}, peersListArguments = []) {
    getNodeValues("/getAddressBalance?address=" + address, function(data) {
        try {
            callback(Number(getConsensus(data).split("/")[2]));
        } catch {
            callback(null);
        }
    }, peersListArguments);
}