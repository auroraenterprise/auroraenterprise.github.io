/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

var lastAddressBalance = 0;

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

function generateTransaction(receivingAddress, amount) {
    var signatureObject = new KJUR.crypto.ECDSA({"curve": "secp256k1"});
    var nonce = randint(0, TRANSACTION_NONCE_RANGE);
    var certificate = keys.address + keys.publicKey + receivingAddress + String(amount) + String(nonce);
    var signature = KJUR.crypto.ECDSA.asn1SigToConcatSig(
        signatureObject.signHex(
            CryptoJS.enc.Hex.stringify(CryptoJS.SHA1(certificate)),
            keys.privateKey
        )
    );

    return {
        sender: keys.address,
        senderPublicKey: keys.publicKey,
        receiver: receivingAddress,
        amount: amount,
        certificate: certificate,
        signature: signature,
        nonce: nonce
    };
}

function makeTransaction() {
    var receivingAddress = $("#sendAddress").val();
    var sendAmount = getSendValue();

    if (receivingAddress.trim() != "" && String(sendAmount).trim() != "") {
        if (receivingAddress.length == ADDRESS_LENGTH) {
            if (receivingAddress != "0000000000") {
                if (receivingAddress != keys.address) {
                    if (sendAmount > 0) {
                        if (lastAddressBalance - sendAmount >= 0) {
                            var transaction = generateTransaction(receivingAddress, sendAmount);

                            sendTransaction(
                                transaction.sender,
                                transaction.senderPublicKey,
                                transaction.receiver,
                                transaction.amount,
                                transaction.certificate,
                                transaction.signature,
                                transaction.nonce,
                                function(data) {
                                    var status = getConsensus(data);

                                    if (status == "Status/ok") {
                                        window.location.href = "transactions.html";
                                    } else {
                                        $("#sendButton").removeAttr("disabled");
                                        $("#sendError").text(_("sendCodeError"));
                                        $("#sendErrorCode").text(status);
                                    }
                                },
                                peersListArguments
                            );

                            $("#sendButton").attr("disabled", "true");
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

    setInterval(function() {
        if (keys.publicKey == null) {
            updatePublicKey();
        }
    }, 10000);

    setInterval(updateAmountReadout, 10000);

    $("#sendAmount").bind("keyup mouseup", function() {
        updatePercentBalance();
    });

    $("#sendSymbol").change(function() {
        updatePercentBalance();
    });
});