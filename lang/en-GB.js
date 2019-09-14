/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

(function() {
    var langData = {
        name: "English (United Kingdom)",
        nameShort: "English",
        textDirection: "ltr",
        strings: {
            "aurora": "Aurora",
            "auroraAuracoin": "Aurora - Auracoin",

            "goHome": "Go to main page",
            "home": "Home",
            "about": "About",
            "products": "Products",
            "visitGithub": "Visit us on GitHub",
            "auracoin": "Auracoin",
            "tagline": "Creating the next crypto",

            "contribute": "Contribute",
            "trade": "Trade",
            "viewGithub": "View code on GitHub",
            "openWallet": "Open wallet",

            "send": "Send",
            "receive": "Receive",
            "cancel": "Cancel",
            "open": "Open",
            "or": "or",
            "fieldsRequiredError": "Sorry! It appears that you have not filled in all of the required fields.",

            "dashboard": "Dashboard",
            "transactions": "Transactions",
            "settings": "Settings",
            "exitWallet": "Exit wallet",
            "auracoinAddress": "Auracoin address",
            "amount": "Amount",
            "publicKey": "Public key",
            "privateKey": "Private key",
            "thisAddress": {"true": "Address: {0}"},

            "enterAddressAndAmount": "Enter address and amount to send to below.",
            "percentOfBalance": {"true": "{0}% of your balance"},
            "sendAmountError": "Sorry! The amount you entered is invalid.",
            "sendBalanceError": "Sorry! The amount you entered exceeds your balance for this address.",
            "sendSelfError": "Sorry! You can't send yourself money, that's just pointless.",
            "sendAddressError": "Sorry! It appears that the address is not of the correct length.",
            "sendDonationError": "The receiving address is the coinbase, it already has infinite money!",
            "sendCodeError": "Sorry! An error occurred whilst adding your transaction:",

            "setUpWallet": "Set up wallet",
            "infoSetUpWallet": "Welcome to the Auracoin wallet! To open your wallet, please enter your information below.",
            "newWalletKeys": "Haven't got an address and keys? We can generate you a pair via the Auracoin network.",
            "generateWalletKeys": "Generate wallet keys",
            "existingWalletKeys": "Already got an address and keys? Enter them below and open your wallet!",
            "setUpWalletKeyError": "Sorry! It appears that either your address or private key is not of the correct length.",
        }
    };

    lang.load("en-GB", langData);
})();