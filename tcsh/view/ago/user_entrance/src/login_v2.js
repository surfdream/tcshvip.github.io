define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        verification = require('wmverification'),
        lib = require("lib"),
        tips = require("wmtips"),
        box = require('wmbox');
    var retUrl = lib.queryString('returnurl');
    var init = function () {
        var $form = $(".login_form"), 
			$user_name;
        var tracknick = lib.cookie("wm.user.username");
        if (tracknick) {
            $form.find("[name='username']").val(tracknick);
        }
        verification.init($form, function () {
            this.setTipSkin('white1').setDirection("tl").setOffSet({ left: 270, top: -5 });
        });
        $user_name = $form.find("#user_name");
        $user_name.focus();
        $user_name.after('<span id="v_mask" style="display: none;background: #ccc; position: absolute;width: 282px;line-height: 40px;height: 38px;padding-left: 10px;top: 51px;_top:26px;left: 1px;">正在检测用户名<i class="loading18_18_1 chrysanthemum" style="float: right;margin: 10px;"></i></span>');
        bind();

        if (lib.cookie("rln")) {
            $user_name.val(lib.cookie("rln"));
            $form.find("#remember_name").attr("checked", "checked");
        }
        $user_name.focus();
    };
    var bind = function () {
        var v_name = function (_v, callback) {
            $.ajax({
                url: domains.account+'/user/account_exists.json',
                cache: false,
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
                cache: false,
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
        var $page = $("#page"),
         $form = $page.find(".login_form"),
         $show_other_login = $page.find(".show_other_login");
        var errorBox, timeoutBox, testBox, issubmit = false, _loginId;
        $page.on("click", ".show_other_login", function () {
            $(this).closest(".third_party").toggleClass('ishide');
            return false;
        });
        $form.on("blur", "#user_name", function () {
            var $this = $(this), 
				v = $.trim($this.val()), 
				v_name_tips, 
				$v_mask = $page.find("#v_mask")
			;
            issubmit = false;
            if (verification.verify($this.closest($this.closest("li")))) {
                $this.attr("disabled", "disabled");
                $v_mask.css("display", "block");
                $this.after('');
                v_name(v, function (data) {
                    if (!data.response) {
                        v_name_tips = $this.data("v_name_tips");
                        if (!v_name_tips) {
                            v_name_tips = new tips({
                                ele: $this,
                                con: '用户名不存在',
                                skin: 'white1',
                                direction: 'tl',
                                offset: { left: 270, top: -5 }
                            });
                            $this.data("v_name_tips", v_name_tips);
                        }
                        v_name_tips.show();
                    } else {
                        if (data.attachment.require_authcode && !$form.find(".v_code_txt").length) {
                            $form.find("#pw_row").after('<li class="form_row"><input type="text" class="form_txt mb10 w170 v_code_txt" placeholder="验证码" wmv="empty" wmvmsg="验证码不能为空！"><img src="' + domains.account + '/captcha.svl" class="mrl5 v_code_img" title="点击更换" /></li>')
                        }
                    }
                    $this.removeAttr("disabled");
                    $v_mask.css("display", "none");
                });
            }
        });
        $form.on("focus", "#user_name", function () {
            var $this = $(this), v_name_tips;
            v_name_tips = $this.data("v_name_tips");
            v_name_tips && v_name_tips.hide();
        });
        $form.on("click", ":submit", function () {
            var $this = $(this), $msg, v_name_tips, $username;
            if (!verification.verify()) {
                return false;
            }
            if (!issubmit) {
                if (verification.verify($form)) {
                    v_name($.trim($form.find("#user_name").val()), function (data) {
                        if (!data.response) {
                            issubmit = false;
                            v_name_tips = $form.find("#user_name").data("v_name_tips");
                            if (!v_name_tips) {
                                v_name_tips = new tips({
                                    ele: $form.find("#user_name"),
                                    con: '用户名不存在',
                                    skin: 'white1',
                                    direction: 'tl',
                                    offset: { left: 270, top: -5 }
                                });
                                $form.find("#user_name").data("v_name_tips", v_name_tips);
                            }
                            v_name_tips.show();
                        } else {
                            if (data.attachment.require_authcode && !$form.find(".v_code_txt").length) {
                                issubmit = false;
                                $form.find("#pw_row").after('<li class="form_row"><input type="text" class="form_txt mb10 w170 v_code_txt" placeholder="验证码" wmv="empty" wmvmsg="验证码不能为空！"><img src="' + domains.account + '/captcha.svl" class="mrl5 v_code_img" title="点击更换" /> </li>')
                                return false;
                            }
                            issubmit = true;
                            _loginId = data.attachment.userid;

                            $this.click();
                        }
                    });
                }
                return false;
            }
            $.ajax({
                url: "/login.do",
                type: "post",
                data: {
                    username: _loginId,
                    password: $form.find("[name='password']").val(),
                    authcode: $form.find(".v_code_txt").val()
                },
                dataType: "json",
                success: function (data) {
                    if (data.response) {
                        //登录成功记住账号
                        if ($form.find("#remember_name:checked").length) {
                            lib.cookie("rln", $form.find("#user_name").val());
                        } else {
                            lib.removeCookie("rln");
                        }
                        if ($form.find("#rememberPassword").attr("checked")) {
                            lib.cookie("rmn", $form.find("[name='username']").val());
                            lib.cookie("rmp", $form.find("[name='password']").val());
                        } else {
                            lib.removeCookie("rmn");
                            lib.removeCookie("rmp");
                        }
                        //未审核通过的商家跳转
                        if (data.attachment.redirect) {
                            window.location.href = decodeURIComponent(data.attachment.redirect);
                            return false;
                        }
                        /////////////////////
                        //登出后登入成功，跳转
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
                        ////////////////////////////////////////////
                    } else {
                        if (data.attachment.require_authcode && !$form.find(".v_code_txt").length) {
                            $form.find("#pw_row").after('<li class="form_row"><input type="text" class="form_txt mb10 w170 v_code_txt" placeholder="验证码" wmv="empty" wmvmsg="验证码不能为空！"><img src="' + domains.account + '/captcha.svl" class="mrl5 v_code_img" title="点击更换" /> </li>')
                        }
                        if (!errorBox) {
                            errorBox = box.alert({
                                boxId: "loginErrbox",
                                titleText: "登录提示",
                                content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">' + data.attachment.message + '</p>',
                                btns: [
                                    { cls: "ui_btn_h40red2", res: "hide", text: "确定" }
                                ],
                                callback: function () {
                                    this.wmBox.find(".close").removeClass("close").addClass("hide");
                                }
                            });
                        }
                        errorBox.setCon('<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">' + data.attachment.message + '</p>')
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
