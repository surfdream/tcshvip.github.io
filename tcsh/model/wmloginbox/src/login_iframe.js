define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("jquery"),
    lib = require('lib'),
    verification = require('wmverification');
    var init = function () {
        var $form = $(".wmlogin_form"),
            $user_name = $("#user_name"),
            tracknick = lib.cookie("wm.user.username");
        window.document.domain = "tcsh.me";
        $user_name.val(tracknick || '').focus();
        verification.init($form, function () {
            this.setTipSkin('white1').setDirection("tl").setOffSet({ left: 200, top: -5 }).strikingSuccess = false;
        });
        bind();
        $user_name.attr("tabindex", "1");
        $form.find(":password").attr("tabindex", "2");
    };
    var bind = function () {
        var $form = $(".wmlogin_form");
        var errorBox, timeoutBox, testBox, issubmit = false, _loginId;
        var v_name = function (_v, callback) {
            $.ajax({
                url: domains.account+'/user/account_exists.json'',
                data: {
                    username: encodeURI(_v)
                },
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    typeof callback === "function" && callback(data);
                }
            });
        };
        var v_code = function (_v, callback) {
            $.ajax({
                url: domains.account+'/check_captcha.json',
                data: {
                    vcode: _v
                },
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    typeof callback === "function" && callback(data);
                }
            });
        };
        $form.on("click", ".login_btn", function () {
            var $this = $(this);
            var $username = $("[name='username']"), $msg = $("[for='" + $username.attr("name") + "']"), _v = $.trim($username.val());
            if (!verification.verify()) {
                return false;
            }
            if (!issubmit) {
                v_name(_v, function (data) {
                    if (!data.response) {
                        issubmit = false;
                        $msg.empty().append('<i class="wm_ico fork2"></i>用户名不存在！');
                    } else {
                        issubmit = true;
                        _loginId = data.attachment.userid
                        $msg.empty();
                        $this.click();
                    }
                });
                return false;
            }
            $.ajax({
                url: "/login",
                type: "post",
                data: {
                    username: _loginId,
                    password: $form.find("[name='password']").val(),
                    authcode: $form.find(".v_code_txt").val()
                },
                dataType: "json",
                success: function (data) {
                    if (data.response) {
                        window.top.location.reload();
                    } else {
                        if (data.attachment.require_authcode && !$form.find(".v_code_txt").length) {
                            $form.find("#pw_row").after('<li class="form_row"><label class="row_key">验证码：</label><input type="text" class="form_txt w100 v_code_txt" wmv="empty" wmvmsg="验证码不能为空！" tabindex="3"><img src="' + domains.account + '/captcha.svl" class="mrl5 v_code_img" title="点击更换" style="vertical-align: middle;" /></li>')
                        }
                        alert(data.attachment.message);
                    }
                },
                error: function () {
                    alert("服务器正忙，请稍后再试！");
                }
            });
            return false;
        });
        $form.find("[name='username']").on("change", function () {
            var $this = $(this), $msg = $("[for='" + $this.attr("name") + "']"), _v = $.trim($this.val());
            if (_v) {
                $msg.empty().append('<i class="loading18_18_1"></i>正在检测登录名').css("display", "inline-block");
                v_name(_v, function (data) {
                    if (!data.response) {
                        issubmit = false;
                        $msg.empty().append('<i class="wm_ico fork2"></i>用户名不存在！');
                    } else {
                        if (data.attachment.require_authcode && !$form.find(".v_code_txt").length) {
                            $form.find("#pw_row").after('<li class="form_row"><label class="row_key">验证码：</label><input type="text" class="form_txt w100 v_code_txt" wmv="empty" wmvmsg="验证码不能为空！" tabindex="3"><img src="' + domains.account + '/captcha.svl" class="mrl5 v_code_img" title="点击更换" style="vertical-align: middle;" /></li>')
                        }
                        issubmit = true;
                        _loginId = data.attachment.userid
                        $msg.empty();
                    }
                });
            }
        })

        $form.on("keypress", function (e) {
            if (e.keyCode == 13) {
                $(".login_btn").click();
            }
        });
        $form.on("click", ".go_reg", function () {
            top.location.href = domains.account + '/register.do';
            return false;
        });
        $form.on("blur", ".v_code_txt", function () {
            var $this = $(this), _v = $.trim($this.val()), v_code_tips;
            if (_v) {
                v_code(_v, function (data) {
                    if (!data.response) {
                        v_code_tips = $this.data("v_code_tips");
                        if (!v_code_tips) {
                            v_code_tips = new tips({
                                ele: $this,
                                con: '验证码错误！',
                                skin: 'white1',
                                direction: 'tl',
                                offset: { left: 270, top: -5 }
                            });
                            $this.data("v_code_tips", v_code_tips);
                        }
                        v_code_tips.show();
                        $form.find(".v_code_img").click();
                    }
                });
            }
        });
        $form.on("focus", ".v_code_txt", function () {
            var $this = $(this), v_code_tips;
            v_code_tips = $this.data("v_code_tips");
            v_code_tips && v_code_tips.hide();
        });
        $form.on("click", ".v_code_img", function () {
            $(this).attr("src", domains.account + "/captcha.svl");
            return false;
        });
    };
    init();

});
