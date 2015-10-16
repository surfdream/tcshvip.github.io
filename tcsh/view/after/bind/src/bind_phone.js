define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        box = require("wmbox"),
        verification = require("wmverification");
    var init = function () {
        var $page = $(".update_password");
        global_setting && global_setting.current && global_setting.current.initmsg && alert(global_setting.current.initmsg);
            
       
        verification.init($page);
        bind();
    };
    var bind = function () {
        var $page = $(".update_password");
        $page.on("click", ":submit", function () {
            return verification.verify($page);
        });
    };
    init();
});
