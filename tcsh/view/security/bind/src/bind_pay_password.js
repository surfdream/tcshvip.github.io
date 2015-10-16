define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        box = require("wmbox"),
        tips = require("wmtips"),
        verification = require("wmverification");
    var init = function () {
        var $form = $(".pay_password");
        var _code = global_setting.current.code - 0, errorBox;
        if (global_setting.current.code + "") {
            if (_code === 0) {
                box.alert({
                    boxCls: "uppassmsg",
                    content: '<p style="width:350px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;font-weight: 700;color: #535353;"><b style="color:#e13436;font-weight: 700;"><i class="wm_ico hook8" style="margin-right:10px;margin-top: -8px;"></i>支付密码修改成功！</b></p>',
                    btns: [
                        {
                            cls: "ui_btn_h46red8 mrl", text: "确定", res: "close", callback: function () { }
                        }
                    ],
                    callback: function () {
                        this.close = function () { window.location.href = domains.member+'/userdata/PayPassword'; }
                    }
                });
            } else {
                for (var i in global_setting.current.code_list) {
                    //数据类型可能会导致BUG(这个结构后端要求的)
                    if (global_setting.current.code_list[i].code === _code) {
                        errorBox = box.alert({
                            boxCls: "uppassmsg",
                            content: '<p style="width:350px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;font-weight: 700;color: #535353;"><b style="color:#e13436;font-weight: 700;"><i class="wm_ico ban1" style="margin-right:10px;margin-top: -8px;"></i>支付密码修改失败！</b>' + global_setting.current.code_list[i].message + '。</p>',
                            btns: [
                                {
                                    cls: "ui_btn_h46red8 mrl", text: "确定", res: "close", callback: function () { }
                                }
                            ],
                            callback: function () {
                                this.close = this.hide;
                            }
                        });
                        errorBox.show();
                    }

                }
                if (global_setting.current.initmsg) {
                    box.alert({
                        boxCls: "uppassmsg",
                        content: '<p style="width:350px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;font-weight: 700;color: #535353;"><b style="color:#e13436;font-weight: 700;"><i class="wm_ico sigh2" style="margin-right:10px;margin-top: -8px;"></i>' + global_setting.current.initmsg + '</b></p>',
                        btns: [
                            {
                                cls: "ui_btn_h46red8 mrl", text: "确定", res: "close", callback: function () { }
                            }
                        ]
                    });
                }
            }
        }

        verification.init(function () {
            this.setOffSet({ top: 10, left: 20 });
        });
        bind();
    };
    var bind = function () {
        var $form = $(".pay_password");
        $form.on("click", ".getphonevc", function () {
            var $this = $(this), $parent = $this.closest(".getphonevc_box"), phonevcTips, _v;
            if (verification.verify($this.closest(".row_phone"))) {
                lib.verificationLogin(function () {
                    _v = $.trim($form.find("#phone").val());
                    if (_v) {
                        $.ajax({
                            url: domains.account+"/actions/IsPhoneEnabled",
                            type: "get",
                            dataType: "jsonp",
                            data: {
                                phone: _v
                            },
                            success: function (data) {
                                if (data.response) {
                                    lib.countdown({
                                        parent: $parent,
                                        ele: $this,
                                        start: 60
                                    });
                                    lib.sendSMS({
                                        url: domains.member+"/action/phoneCode?phone=" + _v
                                    });
                                } else {
                                    phonevcTips = $this.data("errTips");
                                    if (!phonevcTips) {
                                        phonevcTips = new tips({
                                            ele: $form.find("#phone"),
                                            con: "<p>此手机已被注册！</p>",
                                            skin: "red2",
                                            direction: "rc",
                                            close: 2000,
                                            offset: { top: 10, left: 20 }
                                        });
                                        $this.data("errTips", phonevcTips);
                                    }
                                    phonevcTips.show();
                                }
                            }
                        });
                    } else {
                        lib.countdown({
                            parent: $parent,
                            ele: $this,
                            start: 60
                        });
                        lib.sendSMS({
                            url: domains.member+"/action/phoneCode"
                        });
                    }

                });
            }
            return false;
        });
        $form.on("click", ":submit", function () {
            return verification.verify($form);
        });
    };
    init();
});