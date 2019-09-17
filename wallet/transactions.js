/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

const PAGINATION_INCREASE_AMOUNT = 20;

var paginationAmount = PAGINATION_INCREASE_AMOUNT;

function addTransactionEntry(sender, receiver, amount = 0, timestamp = null) {
    // TODO: Add timestamp info to entries

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
        transactionEntry.append($("<span>")
            .text(_("processingTransaction"))
            .attr("title", _("processingTransactionTooltip"))
        );
    } else { // Transaction is verified
        transactionEntry.append($("<span>")
            .text(_("verifiedTransaction"))
            // .attr("title", lang.format(new Date(timestamp), lang.language))
        );
    }

    $("#transactionEntries").append(transactionEntry);
}

function getTransactionEntries() {
    $("main").attr("class", "article");
    $("#transactionEntriesHeader").show();
    $("#transactionEntries").show();
    $("#transactionEntriesEmpty").hide();
    $("#transactionEntriesError").hide();

    getAddressBalance(keys.address, function(balance) {
        var balanceDifference = balance;

        getNodeValues("/getBlockchain", function(multiBlockchain) {
            try {
                var blockchain = JSON.parse(getConsensus(multiBlockchain));
                var orderedEntries = [];

                $("#transactionEntries").empty();
        
                for (var i = 0; i < blockchain.blocks.length; i++) {
                    for (var j = 0; j < blockchain.blocks[i].data.length; j++) {
                        var blockData = blockchain.blocks[i].data[j];

                        if (blockData.type == "transaction") {
                            if (blockData.body.sender == keys.address) {
                                orderedEntries.unshift({
                                    sender: blockData.body.sender,
                                    receiver: blockData.body.receiver,
                                    amount: -blockData.body.amount,
                                    timestamp: blockchain.blocks[i].timestamp
                                });

                                balanceDifference += blockData.body.amount;
                            } else if (blockData.body.receiver == keys.address) {
                                orderedEntries.unshift({
                                    sender: blockData.body.sender,
                                    receiver: blockData.body.receiver,
                                    amount: blockData.body.amount,
                                    timestamp: blockchain.blocks[i].timestamp
                                });

                                balanceDifference -= blockData.body.amount;
                            }
                        }
                    }
                }

                if (orderedEntries.length > 0 || balanceDifference != 0) {
                    if (balanceDifference > 0) {
                        addTransactionEntry(null, keys.address, balanceDifference, null);
                    } else if (balanceDifference < 0) {
                        addTransactionEntry(keys.address, null, balanceDifference, null);                    
                    }

                    for (var i = 0; i < Math.min(orderedEntries.length, paginationAmount); i++) {
                        addTransactionEntry(orderedEntries[i].sender, orderedEntries[i].receiver, orderedEntries[i].amount, orderedEntries[i].timestamp);                    
                    }

                    if (orderedEntries.length > paginationAmount) {
                        $("#transactionEntries").append(
                            $("<div class='center'>").append($("<button>")
                                .text(_("loadMore"))
                                .attr("onclick", "paginationAmount += PAGINATION_INCREASE_AMOUNT; getTransactionEntries();")
                            )
                        );
                    }
                } else {
                    $("main").attr("class", "center");
                    $("#transactionEntriesHeader").hide();
                    $("#transactionEntries").hide();
                    $("#transactionEntriesEmpty").show();
                    $("#transactionEntriesError").hide();
                }
            } catch {
                $("main").attr("class", "center");
                $("#transactionEntriesHeader").hide();
                $("#transactionEntries").hide();
                $("#transactionEntriesEmpty").hide();
                $("#transactionEntriesError").show();
            }
        }, peersListArguments);
    }, peersListArguments)
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
    setInterval(function() {
        if (paginationAmount == PAGINATION_INCREASE_AMOUNT) {
            getTransactionEntries();
        }
    }, 10000);

    $("#sendAmount").bind("keyup mouseup", function() {
        updatePercentBalance();
    });

    $("#sendSymbol").change(function() {
        updatePercentBalance();
    });    
});