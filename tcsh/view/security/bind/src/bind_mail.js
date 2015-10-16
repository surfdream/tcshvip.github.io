define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        box = require("wmbox"),
       verification = require("wmverification");
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
        verification.init('.bind_mail_form');
        bind();
    };
    var bind = function () {
        var $form = $(".bind_mail_form");
        $form.on("click", ".change_code", function () {
            var $this = $(this);
            $this.find("img").attr("src", domains.account+"/auth?t="+Math.random()*99999);
            $this.closest(".form_row").find(".form_txt").focus();
            return false;
        });
        $form.on("click", ":submit", function () {
            return verification.verify($form);
        });

    };
    init();
});
