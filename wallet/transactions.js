/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

const PAGINATION_INCREASE_AMOUNT = 10;

var paginationAmount = PAGINATION_INCREASE_AMOUNT * 2;

function addTransactionEntry(sender, receiver, amount = 0, timestamp = null) {
    var transactionEntry = $("<div class='transactionEntry'>");

    if (sender == null || receiver == null) { // Unconfirmed transaction
        transactionEntry.addClass("newTransaction");
    }

    if (sender == null) {
        transactionEntry.append($("<span>").text(_("unconfirmedTransaction")));
    } else if (sender == keys.address) {
        transactionEntry.append($("<code>")
            .append($("<strong title='@thisIsYou'>").text(sender))
        );
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
    } else if (receiver == keys.address) {
        transactionEntry.append($("<code>")
            .append($("<strong title='@thisIsYou'>").text(receiver))
        );
    } else {
        transactionEntry.append($("<code>")
            .append($("<span>").text(receiver))
        );
    }
    
    if (amount > 0) {
        transactionEntry.append($("<strong class='positive'>")
            .append($("<span title='+A." + amount + "'>").text("+A " + amount / AURO_IN_AURACOIN))
        );
    } else if (amount < 0) {
        transactionEntry.append($("<strong class='negative'>")
            .append($("<span title='-A." + Math.abs(amount) + "'>").text("-A " + Math.abs(amount / AURO_IN_AURACOIN)))
        );
    } else {
        transactionEntry.append($("<strong>")
            .append($("<span title='A.0'>").text("A 0"))
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
            .attr("title", _("verifiedAt", lang.format(new Date((timestamp * 1000) - (new Date().getTimezoneOffset() * 60 * 1000)), lang.language, {
                dateStyle: "full",
                timeStyle: "full"
            })))
        );
    }

    $("#transactionEntries").append(transactionEntry);
}

function getTransactionEntries(doTransition = true) {
    getAddressBalance(keys.address, function(balance) {
        var balanceDifference = balance;

        getNodeValues("/getBlockchain?cutoff=" + (paginationAmount + PAGINATION_INCREASE_AMOUNT), function(multiBlockchain) {
            $("#transactionEntriesLoading").fadeOut(500);

            setTimeout(function() {
                $("main").attr("class", "article");
                $("#transactionEntriesHeader").fadeIn(500);
                $("#transactionEntries").fadeIn(500);
        
                try {
                    var blockchain = JSON.parse(getConsensus(multiBlockchain));
                    var orderedEntries = [];

                    $("#transactionEntries").empty();

                    if (blockchain != null) {
                        balanceDifference -= blockchain["verifiedAmounts"][keys.address];
                    }
            
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
                                } else if (blockData.body.receiver == keys.address) {
                                    orderedEntries.unshift({
                                        sender: blockData.body.sender,
                                        receiver: blockData.body.receiver,
                                        amount: blockData.body.amount,
                                        timestamp: blockchain.blocks[i].timestamp
                                    });
                                }
                            }
                        }
                    }

                    $("#transactionEntriesEmpty").hide();
                    $("#transactionEntriesError").hide();

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
                                $("<div class='center'>").append($("<button id='loadMoreTransactionEntries'>")
                                    .text(_("loadMore"))
                                    .attr("onclick", "loadMoreTransactionEntries();")
                                )
                            );
                        }
                    } else {
                        $("main").attr("class", "center");
                        $("#transactionEntriesHeader").hide();
                        $("#transactionEntries").hide();
                        $("#transactionEntriesEmpty").fadeIn(500);
                        $("#transactionEntriesError").hide();
                    }
                } catch {
                    $("main").attr("class", "center");
                    $("#transactionEntriesHeader").hide();
                    $("#transactionEntries").hide();
                    $("#transactionEntriesEmpty").hide();
                    $("#transactionEntriesError").fadeIn(500);
                }
            }, doTransition ? 500 : 0);
        }, peersListArguments);
    }, peersListArguments);
}

function retryTransactionEntries() {
    $("main").attr("class", "center");
    $("#transactionEntriesHeader").hide();
    $("#transactionEntries").hide();
    $("#transactionEntriesEmpty").hide();
    $("#transactionEntriesError").fadeOut(500);
    $("#transactionEntriesLoading").fadeIn(500);

    setTimeout(getTransactionEntries, 500);
}

function loadMoreTransactionEntries() {
    $("#loadMoreTransactionEntries")
        .text(_("loadingMore"))
        .attr("disabled", "true")
    ;

    paginationAmount += PAGINATION_INCREASE_AMOUNT;
    
    getTransactionEntries(false);
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