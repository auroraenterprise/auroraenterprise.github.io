/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

var peersListArguments = ["https://aur.xyz/auracoin-peers/", "test", "firstlevel"];
var bigAmountIsAuracoin = true;
var lastAddressBalance = 0;

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
    }, peersListArguments);
}

function updateAddressReadout() {
    $(".currentAddress").text(keys.address);

    $(".currentAddressQR").attr("src", "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=auracoin:" + keys.address + "&bgcolor=ffffff&color=000000");
    $(".currentAddressQRTab").attr("src", "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=auracoin:" + keys.address + "&bgcolor=f0f0f0&color=262626");
}

function getSendValue() {
    var value = Number($("#sendAmount").val());
    var isAuracoin = $("#sendSymbol").children("option:selected").val() == "auracoin";

    if (value != null && value != NaN && value != undefined) {
        if (isAuracoin) {
            return value * AURO_IN_AURACOIN;
        } else {
            return value;
        }
    } else {
        return 0;
    }
}

function updatePercentBalance() {
    if (lastAddressBalance > 0) {
        $("#sendPercentBalance").text(Math.round((getSendValue() / lastAddressBalance) * 100));
    } else {
        $("#sendPercentBalance").text("0");
    }
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

function sendTransaction() {
    var sendingAddress = keys.address;
    var receivingAddress = $("#sendAddress").val();
    var sendAmount = getSendValue();

    if (receivingAddress.trim() != "" && String(sendAmount).trim() != "") {
        if (receivingAddress.length == ADDRESS_LENGTH) {
            if (receivingAddress != "0000000000") {
                if (receivingAddress != keys.address) {
                    if (sendAmount > 0) {
                        if (lastAddressBalance - sendAmount >= 0) {
                            // TODO: Handle the transaction.
                        } else {
                            $("#sendError").text(_("sendBalanceError"));
                        }
                    } else {
                        $("#sendError").text(_("sendAmountError"));
                    }
                } else {
                    $("#sendError").text(_("sendSelfError"));
                }
            } else {
                $("#sendError").text(_("sendDonationError"));
            }
        } else {
            $("#sendError").text(_("sendAddressError"));
        }
    } else {
        $("#sendError").text(_("fieldsRequiredError"));
    }
}

$(function() {
    loadKeys();

    updatePublicKey();
    updateAmountReadout();
    updateAddressReadout();

    setInterval(updateAmountReadout, 10000);

    $("#sendAmount").bind("keyup mouseup", function() {
        updatePercentBalance();
    });

    $("#sendSymbol").change(function() {
        updatePercentBalance();
    });
});