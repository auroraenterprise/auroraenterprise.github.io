/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

function generateWallet() {
    var keyPair = generateKeyPair();
    var publicKey = keyPair.publicKey;
    var privateKey = keyPair.privateKey;

    var keyList = JSON.parse(localStorage.getItem("walletKeys") || "{}");

    $("#setUpWallet, #generateWalletError").fadeOut(500);

    setTimeout(function() {
        $("#generateWalletLoading").fadeIn(500);        
    }, 500);

    setTimeout(function() {
        getNodeValues("/handleRegistrationFromPublicKey?publicKey=" + publicKey, function(data) {
            var status = getConsensus(data);

            $("#generateWalletLoading").fadeOut(500);

            setTimeout(function() {
                try {
                    if (status.split("/")[0] == "RegistrationFromPublicKey") {
                        keyList[status.split("/")[1]] = {
                            privateKey: privateKey
                        };
                
                        localStorage.setItem("walletKeys", JSON.stringify(keyList));
                        localStorage.setItem("currentSelectedAddress", status.split("/")[1]);

                        $("#generateWalletResultAddress").text(status.split("/")[1]);
                        $("#generateWalletResultPublicKey").text(publicKey);
                        $("#generateWalletResultPrivateKey").text(privateKey);
                        $("#generateWalletResult").fadeIn(500);
                    } else {
                        $("#generateWalletErrorCode").text(status || "-ClientError");
                        $("#generateWalletError").fadeIn(500);
                    }
                } catch (e) {
                    $("#generateWalletErrorCode").text(status || "-ClientError");
                    $("#generateWalletError").fadeIn(500);
                }
            }, 500);
        }, peersListArguments);
    }, 1000);
}

function setUpWallet() {
    var address = $("#address").val();
    var privateKey = $("#privateKey").val();

    var keyList = JSON.parse(localStorage.getItem("walletKeys") || "{}");

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