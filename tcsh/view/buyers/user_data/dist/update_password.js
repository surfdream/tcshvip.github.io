define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        box = require("wmbox"),
        verification = require("verification");
    var init = function () {
        verification.init();
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ":submit", function () {
            var $this = $(this), $form = $this.closest("form"), errorBox;
            if (verification.verify($this.closest("form"))) {
                $.ajax({
                    url:domains.member+ "/asyn/user/resetpassword",
                    type: "post",
                    dataType: "json",
                    data: {
                        oldPassword: $.trim($form.find("[name='oldPassword']").val()),
                        newPassword: $.trim($form.find("[name='newpassword']").val())
                    },
                    success: function (data) {
                        if (data.response && data.response.result) {
                            box.alert({
                                boxCls: "uppassmsg",
                                titleText: "修改成功",
                                content: '<p style="width:350px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;font-weight: 700;color: #535353;"><b style="color:#e13436;font-weight: 700;"><i class="wm_ico hook8" style="margin-right:10px;margin-top: -8px;"></i>密码修改成功！</b><a href="' + domains.account + '/logout">重新登录</a>。</p>',
                                btns: [
                                    {
                                        cls: "ui_btn_h46red8 mrl", text: "确定", res: "close", callback: function () {
                                            window.location.href = domains.account+'/logout';
                                        }
                                    }
                                ],
                                callback: function () {
                                    this.close = function () { window.location.href = domains.account+'/logout'; }
                                }
                            });
                        } else {
                            errorBox = $this.data("errorBox");
                            if (!errorBox) {
                                errorBox = box.alert({
                                    boxCls: "uppassmsg",
                                    content: '<p style="width:350px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;font-weight: 700;color: #535353;"><b style="color:#e13436;font-weight: 700;"><i class="wm_ico ban1" style="margin-right:10px;margin-top: -8px;"></i>密码修改失败！</b>' + data.response.message + '。</p>',
                                    btns: [
                                        {
                                            cls: "ui_btn_h46red8 mrl", text: "确定", res: "close", callback: function () { }
                                        }
                                    ],
                                    callback: function () {
                                        this.close = this.hide;
                                    }
                                });
                            }
                            errorBox.setCon('<p style="width:350px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;font-weight: 700;color: #535353;"><b style="color:#e13436;font-weight: 700;"><i class="wm_ico ban1" style="margin-right:10px;margin-top: -8px;"></i>密码修改失败！</b>' + data.response.message + '。</p>')
                            errorBox.show();
                        }
                    },
                    error: function () {
                        errorBox = $this.data("errorBox");
                        if (!errorBox) {
                            errorBox = box.alert({
                                boxCls: "uppassmsg",
                                content: '<p style="width:350px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;font-weight: 700;color: #535353;"><b style="color:#e13436;font-weight: 700;"><i class="wm_ico ban1" style="margin-right:10px;margin-top: -8px;"></i>密码修改失败！</b>服务器繁忙。</p>',
                                btns: [
                                    {
                                        cls: "ui_btn_h46red8 mrl", text: "确定", res: "close", callback: function () { }
                                    }
                                ],
                                callback: function () {
                                    this.close = this.hide;
                                }
                            });
                        }
                        errorBox.setCon('<p style="width:350px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;font-weight: 700;color: #535353;"><b style="color:#e13436;font-weight: 700;"><i class="wm_ico ban1" style="margin-right:10px;margin-top: -8px;"></i>密码修改失败！</b>服务器繁忙。</p>')
                        errorBox.show();
                    }
                });
            }
            return false;
        });
    };
    init();
});
