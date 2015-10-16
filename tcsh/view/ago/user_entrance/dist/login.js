define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        verification = require('wmverification'),
        lib = require("lib"),
        box = require('wmbox');
    var retUrl = lib.queryString('returnurl');
    var init = function () {
        var $form = $(".login_form");
        var tracknick = lib.cookie("wm.user.username");
        if (tracknick) {
            $form.find("[name='username']").val(tracknick);
        }
        verification.init();
        verification.strikingSuccess = false;
        bind();
    };
    var bind = function () {
        var $form = $(".login_form");
        var $show_other_login = $(".show_other_login");
        var errorBox, timeoutBox, testBox, issubmit = false;
        $form.on("click.login", ".show_other_login", function () {
            $(this).closest(".form_row").toggleClass('isshow');
            return false;
        });
        $form.on("blur", "[name='username']", function () {
            var $this = $(this), $msg = $("[for='" + $this.attr("name") + "']"), _v = $.trim($this.val());
            if (_v && !$this.attr("wmvresult")) {
                $msg.empty().append('<i class="loading18_18_1"></i>正在检测登录名');
                $.ajax({
                    url: '/nameExists',
                    data: {
                        username: encodeURIComponent(_v)
                    },
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        issubmit = true;
                        if (!data.response) {
                            $msg.empty().append('<i class="wm_ico fork2"></i>用户名不存在！');
                        } else {
                            $msg.empty();
                        }
                    }
                });
            }
        });
        $form.on("click", ":submit", function () {
            var $this = $(this), $msg;
            if (!verification.verify()) {
                return false;
            }
            if (!issubmit) {
                $.ajax({
                    url: '/nameExists',
                    data: {
                        username: $.trim($("[name='username']").val())
                    },
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        issubmit = true;
                        $msg = $("[for='username']");
                        if (!data.response) {
                            $msg.empty().append('<i class="wm_ico fork2"></i>用户名不存在！');
                        } else {
                            $msg.empty();
                            $this.click();
                        }
                    }
                });

                return false;
            }
            $.ajax({
                url: "/login",
                type: "post",
                data: {
                    username: encodeURIComponent($.trim($form.find("[name='username']").val())),
                    password: $form.find("[name='password']").val()
                },
                dataType: "json",
                success: function (data) {
                    if (data.response) {
                        if ($form.find("#rememberPassword").attr("checked")) {
                            lib.cookie("rmn", $form.find("[name='username']").val());
                            lib.cookie("rmp", $form.find("[name='password']").val());
                        } else {
                            lib.removeCookie("rmn");
                            lib.removeCookie("rmp");
                        }
                        if (lib.queryString("loginend")) {
                            try {
                                window.open(window.location.href, "_self", "");
                                window.close();
                            } catch (e) {
                                window.location.href = (retUrl ? decodeURIComponent(retUrl) : "http://www.tcsh.me");
                            }
                        } else {
                            window.location.href = (retUrl ? decodeURIComponent(retUrl) : "http://www.tcsh.me");
                        }
                    } else {
                        if (!errorBox) {
                            errorBox = box.alert({
                                boxId: "loginErrbox",
                                titleText: "登录提示",
                                content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">密码错误，或者账号被锁定！</p>',
                                btns: [
                                    { cls: "ui_btn_h40red2", res: "hide", text: "确定" }
                                ],
                                callback: function () {
                                    this.wmBox.find(".close").removeClass("close").addClass("hide");
                                }
                            });
                        }
                        errorBox.show();
                    }
                },
                error: function () {
                    if (!timeoutBox) {
                        timeoutBox = box.alert({
                            boxId: "loginErrbox",
                            titleText: "登录提示",
                            content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">系统维护请稍后再试！</p>',
                            btns: [
                                   { cls: "ui_btn_h40red2", res: "hide", text: "确定" }
                            ],
                            callback: function () {
                                this.wmBox.find(".close").removeClass("close").addClass("hide");
                            }
                        });
                    }
                    timeoutBox.show();
                }
            });
            return false;
        });
        //$form.find("#rememberPassword").on("change", function () {
        //    var $this = $(this);
        //    if (!$this.attr("checked")) {
        //        lib.removeCookie("rmn");
        //        lib.removeCookie("rmp");
        //    }
        //});
    };
    init();
});
