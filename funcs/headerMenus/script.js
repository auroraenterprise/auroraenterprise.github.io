/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

var headerMenus = {
    show: function(menuName) {
        if (!$("div.headerMenu[name='" + menuName + "']").is(":visible")) {
            headerMenus.hide();

            $("div.headerMenu:not([name='" + menuName + "'])").fadeOut();

            $("div.headerMenu[name='" + menuName + "']").fadeIn();
            $(".headerButton:focus").addClass("active");
        }
    },

    hide: function() {
        $("div.headerMenu").fadeOut();
        $(".headerButton.active").removeClass("active");
    }
};

$(function() {
    $("html").click(function() {
        headerMenus.hide();
    });

    $(".headerMenu").click(function(event) {
        event.stopPropagation();
    });
});