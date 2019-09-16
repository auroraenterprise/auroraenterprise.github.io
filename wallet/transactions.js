/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

function addTransactionEntry(sender, receiver, amount = 0) {
    var transactionEntry = $("<div class='transactionEntry'>");

    if (sender == null || receiver == null) { // Unconfirmed transaction
        transactionEntry.addClass("newTransaction");
    }

    if (sender == null) {
        transactionEntry.append($("<span>").text(_("unconfirmedTransaction")));
    } else {
        transactionEntry.append($("<code>")
            .append($("<span>").text(sender))
        );
    }

    transactionEntry.append($("<span>")
        .addClass("icon")
        .text("chevron_right")
    );

    if (receiver == null) {
        transactionEntry.append($("<span>").text(_("unconfirmedTransaction")));
    } else {
        transactionEntry.append($("<code>")
            .append($("<span>").text(receiver))
        );
    }
    
    if (amount > 0) {
        transactionEntry.append($("<strong class='positive'>")
            .append($("<span>").text("+A " + amount / AURO_IN_AURACOIN))
        );
    } else if (amount < 0) {
        transactionEntry.append($("<strong class='negative'>")
            .append($("<span>").text("-A " + Math.abs(amount / AURO_IN_AURACOIN)))
        );
    } else {
        transactionEntry.append($("<strong>")
            .append($("<span>").text("A 0"))
        );
    }

    if (sender == null || receiver == null) { // Transaction still processing
        transactionEntry.append($("<span>").text(_("processingTransaction")));
    } else { // Transaction is verified
        transactionEntry.append($("<span>").text(_("verifiedTransaction")));
    }

    $("#transactionEntries").append(transactionEntry);
}

function getTransactionEntries() {
    // TODO: Add working transaction entry getter instead of placeholder

    $("#transactionEntries").empty();

    addTransactionEntry(keys.address, null, AURO_IN_AURACOIN * -0.5);
    addTransactionEntry("0000000000", keys.address, AURO_IN_AURACOIN);
    addTransactionEntry("0123456789", keys.address, AURO_IN_AURACOIN * 2);
}

$(function() {
    loadKeys();

    updatePublicKey();
    updateAmountReadout();
    updateAddressReadout();
    getTransactionEntries();

    setInterval(function() {
        if (keys.publicKey == null) {
            updatePublicKey();
        }
    }, 10000);

    setInterval(updateAmountReadout, 10000);
    // setInterval(getTransactionEntries, 10000);

    $("#sendAmount").bind("keyup mouseup", function() {
        updatePercentBalance();
    });

    $("#sendSymbol").change(function() {
        updatePercentBalance();
    });    
});