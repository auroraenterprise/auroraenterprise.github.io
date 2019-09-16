var lang = {
    locales: {},
    language: "",
    log: [],

    languageData: {
        name: "Neutral",
        nameShort: "Neutral",
        textDirection: "ltr",
        strings: {}
    },

    load: function(code, data) {
        if (typeof(data) == "string") {
            lang.locales[code] = JSON.parse(data);
        } else {
            lang.locales[code] = data;
        }
    },

    use: function(code) {
        if (code in lang.locales) {
            lang.language = code;
            lang.languageData = lang.locales[code];
        } else {
            if (code == "en-AU" || code == "en-US") {
                lang.use("en-GB");
            } else {
                throw "Cannot use language \"" + code + "\"";
            }
        }
    },

    getLocale: function() {
        if (core.getURLParameter("lang") != null) {
            localStorage.setItem("lang", core.getURLParameter("lang"));
        }

        if (localStorage.getItem("lang") != null) {
            return localStorage.getItem("lang");
        } else {
            return navigator.language;
        }
    },

    addToLog: function(data, result, success = true, date = new Date()) {
        lang.log.push({
            data: data,
            result: result,
            success: success,
            date: date
        });
    },

    format: function(data, code, options = {}) {
        if (data instanceof Number) {
            return data.toLocaleString(code, options);
        } else if (data instanceof Date) {
            return data.toLocaleDateString(code, options);
        } else {
            return data;
        }
    },

    translate: function(string, arguments = {}, useLocaleFormats = true) {
        if (typeof(arguments) != "object") {
            arguments = [arguments];
        }

        if (lang.languageData.strings[string] != undefined) {
            var foundTranslation = null;

            if (typeof(lang.languageData.strings[string]) == "object") {
                var rules = lang.languageData.strings[string];

                for (var rule in rules) {
                    var originalRule = rule;

                    for (var argument in arguments) {
                        if (useLocaleFormats) {
                            rule = rule.replace(new RegExp("{" + argument + "}", "g"), lang.format(arguments, lang.language));
                        } else {
                            rule = rule.replace(new RegExp("{" + argument + "}", "g"), arguments);
                        }
                    }

                    if (eval(rule.replace(new RegExp("{arg}", "g"), arguments[argument])) == true) {
                        foundTranslation = rules[originalRule];
                    }
                }
            } else {
                foundTranslation = lang.languageData.strings[string];
            }

            if (foundTranslation != null) {
                lang.addToLog(string, foundTranslation);

                return foundTranslation;
            } else {
                lang.addToLog(string, null, false);

                throw "Could not translate string \"" + string + "\"";
            }
        } else {
            lang.addToLog(string, null, false);
        }
    }
};

function _() {
    return lang.translate(arguments);
}

$(function() {
    setInterval(function() {
        $("*:not(script, style, meta, link, .noTranslate)").each(function() {
            if ($(this).html().trim()[0] == "@") {
                if ($(this).html().substring(1).split("|").length == 2) {
                    $(this).html(lang.translate(
                        $(this).html().trim().substring(1).split("|")[0],
                        $(this).html().trim().substring(1).split("|")[1].split("\\")
                    ));
                } else {
                    $(this).html(lang.translate(
                        $(this).html().trim().substring(1).split("|")[0]
                    ));
                }
            }

            var thisParent = this;

            $.each(this.attributes, function(index, element) {
                if ($(thisParent).attr(element.name)[0] == "@") {
                    if ($(thisParent).attr(element.name).substring(1).split("|").length == 2) {
                        $(thisParent).attr(element.name, lang.translate(
                            $(thisParent).attr(element.name).substring(1).split("|")[0],
                            $(thisParent).attr(element.name).substring(1).split("|")[1].split("\\")
                        ));
                    } else {
                        $(thisParent).attr(element.name, lang.translate(
                            $(thisParent).attr(element.name).substring(1).split("|")[0]
                        ));
                    }
                }
            });
        });
    }, 10);

    lang.use(lang.getLocale());

    $("html, body").css("display", "unset");
});

$("html, body").css("display", "none");