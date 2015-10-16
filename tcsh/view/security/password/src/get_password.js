define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        box = require('wmbox'),
        verification = require("wmverification");
    var init = function () {
        var $page = $("#page");
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
        verification.strikingSuccess = false;
        bind();
        $page.find("#Accounts").find("option:eq(0)").attr("selected", "selected");
        $page.find("#Accounts").change()

    };
    var bind = function () {
        var $page = $("#page");
        $page.find("#Accounts").on("change", function () {
            var $this = $(this);
            $page.find(".hide_item").css("display", "none");
            switch ($this.find(":selected").attr("data_key")) {
                case "e":
                    $page.find("#email").css("display", "block");
                    break;
                case "p":
                    $page.find("#phone").css("display", "block");
                    break;
            }
            $page.find(".accounttype").val($this.val());
            return false;
        });
        $page.on("click", ".getphonevc", function () {
            var $this = $(this);
            lib.countdown({
                parent: $this.closest(".form_row"),
                ele: $this,
                start: 60
            });
            lib.sendSMS({
                url: domains.account+'/actions/sendphonecode?',
                param: {
                    encrypt: $page.find("#pcode").val()
                },
                type: "post"

            });
            return false
        });
        $page.on("click", ".getemailvc", function () {
            var $this = $(this);
            lib.countdown({
                parent: $this.closest(".form_row"),
                ele: $this,
                start: 60
            });
            lib.sendEMail({
                url: domains.account+"/actions/sendemail?",
                param: {
                    encrypt: $page.find("#ecode").val()
                },
                type: "post"

            });
            return false
        });
        $page.on("click", ".change_code", function () {
            $page.find(".change_code img").attr("src",domains.account+ "/auth?t=" + new Date().getTime());
            return false;
        });
        $page.on("click", ":submit", function () {
            return verification.verify($(this).closest("form"));
        });
    };
    init();
});
