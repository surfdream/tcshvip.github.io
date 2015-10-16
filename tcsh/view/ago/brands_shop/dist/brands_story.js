define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        lib = require('lib'),
        tips = require("wmtips"),
        loginbox = require('wmloginbox');
    var _len = 140;
    var shopwindowH, role = lib.getRole();//角色，1 = 买家，2 = 卖家，3 = 买家+卖家(测试用，正常数据不会有)，4 = 管理员， 8 = 运营;
    var init = function () {
        var $page = $("#page"),
            $show_brands_img = $page.find(".show_brands_img"),
            $show_brands_list = $page.find(".show_brands_list"),
            tracknick = lib.cookie("wm.user.username");
        if (tracknick) {
            $page.find(".login_data").empty().append('<span style="padding-right:10px"><b class="len">还可输入' + _len + '字</b></span><a href="' + lib.getUserNameLinkURL() + '">' + tracknick + '</a>');
        } else {
            $page.find(".login_data").empty().append('<span>需先登录后才能评分（<b>可输入140字</b>）</span><a href="#" class="login_btn">登录</a><em>|</em><a href="' + domains.account + '/register">注册</a><a href="#"></a>');
        }
        shopwindowH = $show_brands_list.height();
        $show_brands_list.height(190);
        $show_brands_img.attr("src", $show_brands_list.find(".shopwindow_item:eq(0)").attr("data_img"));
        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            $show_brands_img = $page.find(".show_brands_img"),
            $show_brands_list = $page.find(".show_brands_list"),
            $story_txt = $page.find(".story_box").find(".story_txt"),
            $len = $page.find('.len');
        $page.find(".show_all_shopwindow").toggle(function () {
            var $this = $(this);
            $this.find("i").attr("class", "wm_ico arrow3up");
            $show_brands_list.animate({
                "height": shopwindowH
            });
        }, function () {
            var $this = $(this);
            $this.find("i").attr("class", "wm_ico arrow3down");
            $show_brands_list.animate({
                "height": 190
            });
        });
        $page.find(".shopwindow_item").hover(function () {
            $show_brands_list.find(".hover").removeClass("hover");
            $(this).addClass("hover");
            $show_brands_img.attr("src", $(this).attr("data_img"));
        });
        $page.on("click", ".login_btn", function () {
            loginbox();
            return false;
        });
        $page.find(".story_box .more").toggle(function () {
            $(this).empty().append("收起");
            $story_txt.removeClass("h115");
        }, function () {
            $(this).empty().append("更多>>");
            $story_txt.addClass("h115");
        });
        $page.on("click", ":submit", function () {
            var $this = $(this), roleTips, $form, v_tips, _v, $comment_txt;
            lib.verificationLogin(function () {
                if (role.key === "1") {
                    $form = $this.closest("form"),
                    $comment_txt = $form.find(".comment_txt");
                    _v = $.trim($comment_txt.val());
                    if (_v.length) {
                        $form.submit();
                    } else {
                        v_tips = $this.data("v_tips");
                        if (!v_tips) {
                            v_tips = new tips({
                                ele: $this,
                                con: '<p>评价内容为空，是很不负责任的表现哦~</p>',
                                direction: 'tc',
                                close: 3000,
                                offset: {
                                    top: -5
                                },
                                callBack: function () {
                                    this.$tipsBox.on("click", ".login", function () {
                                        loginbox();
                                        return false;
                                    });
                                }
                            });
                            $this.data("v_tips", v_tips);
                        }
                        v_tips.show();
                        $comment_txt.val(_v).focus();
                    }
                } else {
                    roleTips = $this.data("roleTips");
                    if (!roleTips) {
                        roleTips = new tips({
                            ele: $this,
                            con: '<p>' + role.value + '账号不能进行品牌评价操作！<br><a href="#" class="login" style="color: #4fa2d6;">重新登录</a></p>',
                            direction: 'tc',
                            offset: {
                                top: -5
                            },
                            callBack: function () {
                                this.$tipsBox.on("click", ".login", function () {
                                    loginbox();
                                    return false;
                                });
                            }
                        });
                        $this.data("roleTips", roleTips);
                    }
                    roleTips.show();
                }
            });
            return false;
        });
        $page.on("keyup", ".comment_txt", function () {
            var $this = $(this), _v = $(this).val();
            var _vLengh = _v.length;
            if (_len - _vLengh >= 0) {
                $len.empty().append('还可输入' + (_len - _vLengh) + '字');
                $this.data("txt", _v);
            } else {
                $len.empty().append('已经超出' + (_vLengh - _len) + '字');
            }
        });
        $page.find(".comment_btn :submit").click(function () {
            var $comment_txt = $page.find(".comment_txt");
            var _vLengh = $comment_txt.val().length;
            if (_len - _vLengh < 0) {
                if (confirm("字数超出，继续提交将被自动截断！确定继续？")) {
                    $comment_txt.val($comment_txt.val().substr(0, _len));
                    return true;
                }
                return false;
            }
        });
    };
    init();
});