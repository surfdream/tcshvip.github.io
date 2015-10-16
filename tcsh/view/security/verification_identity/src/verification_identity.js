define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        verification = require('wmverification'),
        box = require("wmBox");
    var init = function () {
        if (global_setting && global_setting.current && global_setting.current.initmsg) {
            box.alert({
                boxCls: "msg",
                content: '<p style="width:350px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;font-weight: 700;color: #535353;"><b style="color:#e13436;font-weight: 700;"><i class="wm_ico sigh2" style="margin-right:10px;margin-top: -8px;"></i>' + global_setting.current.initmsg + '</b></p>',
                btns: [
                           {
                               cls: "ui_btn_h46red8 mrl", text: "确定", res: "close", callback: function () {
                                  
                               }
                           }
                ]
            });
        }
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ":submit", function () {
            return verification.verify($(this).closest("form"));
        });
        $page.on("click", ".getphonevc", function () {
            var $this = $(this), $parent = $this.closest(".getphonevc_box"), phonevcTips, _v;
            lib.verificationLogin(function () {
                lib.countdown({
                    parent: $parent,
                    ele: $this,
                    start: 60
                });
                lib.sendSMS({
                    url: domains.member+"/action/phoneCode",
                    type:"post"
                });

            });
            return false
        });

    };
    init();
});
