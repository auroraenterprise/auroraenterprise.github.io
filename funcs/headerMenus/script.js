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