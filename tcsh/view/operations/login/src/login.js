define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        forimg = require("forimg"),
        verification = require("verification")
    ;

    var init = function () {
        if (global_setting && global_setting.initMsg) {
            alert(global_setting.initMsg);
        }
        new forimg.Fade({
            interval:500,
            callback: function () {
                this.automatic();
            }
        });
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ".submit", function () {
            return verification.verify($(this).closest("form"));
        });
    };
    init()
});
