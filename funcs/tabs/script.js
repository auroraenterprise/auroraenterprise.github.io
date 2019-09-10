/*
    Aurora Website
    
    Copyright (C) Aurora Enterprise. All Rights Reserved.
    
    https://aur.xyz
    Licensed by the Aurora Open-Source Licence, which can be found at LICENCE.md.
*/

var tabs = {
    select: function(name, group = null) {
        if (group == null) {
            $(".tabGroup").children().hide();
            $(".tabGroup > [name='" + name + "']").show();
        } else {
            $(".tabGroup[name='" + group + "']").children().hide();
            $(".tabGroup[name='" + group + "'] > [name='" + name + "']").show();
        }
    }
};