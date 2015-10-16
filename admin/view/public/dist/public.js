define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        lib = require("http://s.tcsh.me/tcsh/model/lib/dist/lib.js");
    var $body = $("body");
    var init = function () {
        var $page = $body.find("#page");
        var tracknick = lib.cookie("wm.user.username");
        if (tracknick) {
            $body.find(".head_top .user_data span").empty().append(tracknick + ',欢迎你！');
        }
        bind();
    };
    var bind = function () {

    };
    init();
});
