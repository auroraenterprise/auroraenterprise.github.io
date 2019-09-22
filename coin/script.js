/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

var minersOnlineLast = 0;

function getStats() {
    getPeerList(function(data) {
        var peers = data.split("\n").filter(function(element) {
            return (
                element.trim() != "" &&
                !element.startsWith("#")
            );
        });

        $(".statsMinersExisting").text(lang.format(peers.length, lang.language));

        var proxiedPeers = [];

        for (var i = 0; i < peers.length; i++) {
            if (!peers[i].startsWith("https://") && !peers[i].includes("serveo.net")) {
                proxiedPeers.push(HTTP_PROXY + peers[i]);
            }
        }

        var successfulPeers = 0;

        if (peers.length > 0) {
            for (var i = 0; i < peers.length; i++) {
                $.ajax({
                    url: peers[i],
                    success: function() {
                        successfulPeers++;

                        if (successfulPeers > minersOnlineLast) {
                            $(".statsMinersOnline").text(lang.format(Math.min(successfulPeers, peers.length), lang.language));
                        }
                    },
                    error: function() {
                        if (successfulPeers > minersOnlineLast) {
                            $(".statsMinersOnline").text(lang.format(Math.min(successfulPeers, peers.length), lang.language));
                        }
                    }
                });
            }
        }
    }, function() {});

    getNodeValues("/getBlockHeight", function(data) {
        var status = getConsensus(data);

        try {
            $(".statsBlockHeight").text(lang.format(Number(status.split("/")[2]), lang.language));
        } catch (e) {}
    });

    getNodeValues("/getBlockchain?cutoff=1", function(data) {
        var blockchain = JSON.parse(getConsensus(data));
        var totalCirculation = 0;

        for (var address in blockchain.verifiedAmounts) {
            totalCirculation += blockchain.verifiedAmounts[address];
        }

        $(".statsTotalCirculation").text("A " + Math.round(totalCirculation / AURO_IN_AURACOIN));
    });
}

$(function() {
    getStats();

    setInterval(getStats, 10000);
});