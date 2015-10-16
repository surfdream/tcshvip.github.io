define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        box = require("wmbox"),
        lib = require("lib"),
        tips = require("wmtips"),
        dsxy = require("dsxy"),
        verification = require('wmverification');
    var pacthtml = [
        '<div class="pact_mian">',
            '<ul>',
                '<li>',
                    '<h3>第一条 隐私保护原则</h3>',
                    '<p>同城生活承诺尊重您的隐私和您的个人信息安全。同城生活并且承诺尽可能地为您提供最佳的服务。比如，同城生活会利用通过网站运作而收集到的这些信息， 来制定您的个性化沟通方式和购物经历、也可以更好地对您的客户服务调查做出反应、对您的订单和帐户信息及客户服务需求与您进行沟通、就同城生活网站中的商品和活动与您进行沟通以及为了其他推广宣传目的、优化管理、促销、调查等其他本网站的特别项目使用这些信息。同城生活也可以用这样的信息来阻止可能的被禁止项目和非法活动，用以加强使用规则和条款的实施，并用以解决争议和保护其合法的私有财产权益及解决涉及同城生活的交易活动而产生的问题。</p>',
                '</li>',
                '<li>',
                    '<h3>第二条 禁止泄密原则</h3>',
                    '<p>同城生活不可以向任何其他人出售或出租您的个人信息。但如果是为经营目的需要的，同城生活可以将信息交付给一些服务提供商只在为同城生活的经营来使用。例如，他们负责处理同城生活的装运业务、数据管理业务、电子邮件发送业务、市场调查业务、信息分析业务和促销管理业务。买卖同城生活网站上的商品， 查阅数据资料、销售信函、市场调查、分析报告和促销手段。同城生活提供给其服务提供商的个人信息的前提是他们需要这些信息来完成其服务并同时承诺尽可能保护您的个人信息。</p>',
                '</li>',
                '<li>',
                    '<h3>第三条 保密例外原则</h3>',
                    '<p>在极少数情况下，同城生活可以透露特定的信息，例如，政府机构请求、法院调查令等法律规定的情况，以及为执行本网站的政策或保护他人的权益、财产 和安全。同城生活也会和那些协助进行诈骗防范和调查的公司共享信息。下在法律范围内响应法院指令，以便加强本网站的管理政策或保护他人的权利、财产或 保险。同城生活同时与公司分享信息协助保护或调查。同城生活不会提供信息给那些推销和商业目的公司或代理机构行。</p>',
                '</li>',
                '<li>',
                    '<h3>第四条 意外免责原则</h3>',
                    '<p>同城生活会将非常认真地保护您的个人信息。然而，尽管同城生活已经尽力了，但是仍有第三方通过非法手段在中途截取发送的信息的风险。这在所有互联网 使用中都是真实存在的。以至于同城生活无法完全保证您传送的任何信息的安全。发送任何信息的风险都您都须承担。特别是，同城生活将采取所有合理的预防措施来确保您的订购和付款详细信息的安全，除非同城生活存在疏忽，否则同城生活将不承担因您提供的信息被非法侵入而造成您和第三方的相应损失。</p>',
                '</li>',
                '<li>',
                    '<h3>第五条 补充条款</h3>',
                    '<p>同城生活决不会发送电子邮件来向您索要登录帐户和密码。如果您接收了这样的电子邮件，绝对不要回复。</p>',
                '</li>',
            '</ul>',
        '</div>'
    ].join('');
    var init = function () {
        var $form = $(".reg_form");
        if (global_setting && global_setting.current && global_setting.current.message) {
            box.alert({
                boxCls: "errbox",
                content: "<p>" + global_setting.current.message + "</p>"
            });
        }
        verification.init($form, function () {
            this.setTipSkin('white1').setDirection("tl").setOffSet({ left: 270, top: -5 });
        });
        bind();
    };
    var bind = function () {
        var v_name = function (_v, callback) {
            $.ajax({
                url: domains.account+'/user/account_exists.json',
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
                url:domains.account+ '/check_captcha.json',
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
        var $form = $(".reg_form");
        $form.on("click", ":submit", function () {
            var v_name_tips;
            if (verification.verify($form)) {
                v_name($.trim($form.find("#user_email").val()), function (data) {
                    if (data.response) {
                        v_name_tips = $form.find("#user_email").data("v_name_tips");
                        if (!v_name_tips) {
                            v_name_tips = new tips({
                                ele: $form.find("#user_email"),
                                con: '该邮箱已被注册！！！',
                                skin: 'white1',
                                direction: 'tl',
                                offset: { left: 270, top: -5 }
                            });
                            $form.find("#user_email").data("v_name_tips", v_name_tips);
                        }
                        v_name_tips.show();
                    }
                    else {
                        $form.submit();
                    }
                });
            }
            return false;
        });
        $form.on("click", ".pact", function () {
            var $this = $(this);
            box.alert({
                boxCls: "pactbox",
                titleText: "同城生活用户服务协议",
                content: pacthtml
            });
            $this.closest(".form_row").find("input").attr("checked", "checked");
            return false;
        });
        $form.on("click", ".go_business", function () {
            var $this = $(this), _dsxy = $this.data("dsxy");
            if (!_dsxy) {
                _dsxy = dsxy.show();
                $this.data("dsxy", _dsxy);
            }
            _dsxy.show();
            return false;
        });
        $form.on("focus", ".form_txt", function () {
            if (!$form.find(".v_code_img").length) {
                $form.find(".v_code_txt").after('<img src="' + domains.account + '/captcha.svl" class="mrl5 v_code_img" title="点击更换" />');
            }
        });
        $form.on("click", ".v_code_img", function () {
            $(this).attr("src", domains.account+'/captcha.svl?t=' + new Date().getTime());
            return false;
        });
        $form.on("blur", "#user_email", function () {
            var $this = $(this), v = $.trim($this.val()), v_name_tips;
            if (verification.verify($this.closest($this.closest("li")))) {
                $this.val("正在检测用户邮箱").attr("disabled", "disabled");
                $this.after('<i class="loading18_18_1 chrysanthemum" style="position: absolute;right: 18px;top: 62px;"></i>');
                v_name(v, function (data) {
                    v_name_tips = $this.data("v_name_tips");
                    if (data.response) {
                        if (!v_name_tips) {
                            v_name_tips = new tips({
                                ele: $this,
                                con: '该邮箱已被注册！！！',
                                skin: 'white1',
                                direction: 'tl',
                                offset: { left: 270, top: -5 }
                            });
                            $this.data("v_name_tips", v_name_tips);
                        }
                        v_name_tips.show();
                    }
                    $this.val(v).removeAttr("disabled");
                    $form.find(".chrysanthemum").remove();
                });
            }
        });
        $form.on("focus", "#user_email", function () {
            var $this = $(this), v_name_tips;
            v_name_tips = $this.data("v_name_tips");
            v_name_tips && v_name_tips.hide();
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
    };
    init();
});
