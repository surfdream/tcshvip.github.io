define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        lazyload = require("wmlazyload"),
        dsxy = require("dsxy"),
        tips = require("wmtips"),
        wmas = require("wmas"),
        forImg = require("wmforimg");
    var init = function () {
        var $page = $("#page"),
            $logo_entrance = $page.find(".logo_entrance"),
            $content = $page.find(".content"),
            $class_nav = $page.find(".class_nav"),
            $con_sub = $content.find(".con_sub"),
            _left,
            _role,
            _defaultFun,
            tracknick;
        tracknick = lib.cookie("wm.user.username"),
        lazyload.init({
            lazyloadEle: "img"
        });
        _role = lib.getRole();
        _defaultFun = function () {
            $logo_entrance.empty().append('<div class="logo_entrance_bg"></div><ul><li><a href="' + domains.account + '/register">注册</a></li><li><a href="' + domains.account + '/login">登录</a></li><li><a href="#" class="go_business">商家入驻</a></li></ul>');

        };
        if (_role) {
            switch (_role.key) {
                case "1":
                    $.ajax({
                        url: domains.order+"/order/asyn/profile",
                        type: "get",
                        dataType: "jsonp",
                        success: function (data) {
                            $logo_entrance.empty().append('<img class="user_av" src="' + data.response.avatar + '" /><p class="user_msg">您好！<a href="' + lib.getUserNameLinkURL() + '" title="' + tracknick + '">' + tracknick + '</a></p><div class="btns"><a href="#" class="registration">签到</a></div><ul class="user_shortcut_link"><li><a href="' + domains.order + '/orders/myorders?SelectOrderStatus=Sent" target="_blank"><b>' + data.response.waitforconfirm + '</b><span>待确认</span></a></li><li><a href="' + domains.order + '/orders/myorders?SelectOrderStatus=UnPay" target="_blank"><b>' + data.response.waitforpay + '</b><span>待付款</span></a></li><li><a href="' + domains.order + '/orders/myorders?SelectOrderStatus=Success" target="_blank"><b>' + data.response.waitforcommit + '</b><span>待评价</span></a></li></ul>');
                        },
                        error: function () {
                            _defaultFun();
                        }
                    });
                    break;
                case "2":
                    $.ajax({
                        url: domains.order+"/order/asyn/profile",
                        type: "get",
                        dataType: "jsonp",
                        success: function (data) {
                            $logo_entrance.empty().append('<img class="user_av" src="' + data.response.avatar + '" /><p class="user_msg">您好！<a href="' + lib.getUserNameLinkURL() + '" title="' + tracknick + '">' + tracknick + '</a></p><ul class="user_shortcut_link"><li><a href="' + domains.sell + '/order/list?Status=Paid" target="_blank"><b>' + data.response.waitforsend + '</b><span>待发货</span></a></li><li><a href="' + domains.sell + '/order/list?Status=Refunding" target="_blank"><b>' + data.response.waitforrefund + '</b><span>退款</span></a></li><li><a href="' + domains.sell + '/order/list?Status=RefundingGoods" target="_blank"><b>' + data.response.complaint + '</b><span>投诉</span></a></li></ul>');
                        },
                        error: function () {
                            _defaultFun();
                        }
                    });
                    break;
                default:
                    _defaultFun();
                    break;
            }
        } else {
            _defaultFun();
        }

        wmas.init({
            callback: [
                {
                    key: "index_700_300_forimg", fun: function () {
                        new forImg.Fade({
                            forImgBoxEle: ".adv_700_300",
                            interval: 5000,
                            callback: function () {
                                var that = this;
                                var i = this.forImgItem.length
                                var $indexBox = this.forImgBox.find(".indexBox"), indexItem = [];
                                while (i--) {
                                    indexItem[i] = '<li>' + (i + 1) + '</li>';
                                }
                                $indexBox.append(indexItem.join(''));
                                this.indexs = $indexBox.find('li');
                                this.indexs.eq(0).addClass("curr");
                                this.indexs.click(function () {
                                    that.setIndex(this);
                                });
                                this.automatic(true);
                            }
                        });
                    }
                },
                {
                    key: "index_100_100_forimg", fun: function () {
                        new forImg.Slide({
                            forImgBoxEle: ".adv_100_100",
                            interval: 5000,
                            callback: function () {
                                var that = this;
                                this.forImgBox.find(".to_right").click(function () {
                                    that.next();
                                    return false
                                });
                                this.forImgBox.find(".to_left").click(function () {
                                    that.prev();
                                    return false
                                });
                                this.automatic(true);
                            }
                        });
                    }
                },
                {
                    key: "index_70_70_forimg", fun: function () {
                        new forImg.Slide({
                            forImgBoxEle: ".adv_70_70",
                            interval: 3000,
                            callback: function () {
                                this.automatic(true);
                            }
                        });
                    }
                }
            ]
        });
        bind();
        $class_nav.css({
            left: $con_sub.offset().left,
            visibility: "visible"
        });
    };
    var bind = function () {
        var $body = $("body"),
            body = $body[0],
            $page = $("#page"),
            $ann_list = $page.find(".ann_list"),
            $class_nav = $page.find(".class_nav"),
            $search_form = $page.find(".search_form"),
            $search_txt = $search_form.find(".search_form");
        $class_nav.find(".ci_hoverkey").hover(function () {
            var $this = $(this),
                $sub_class = $this.find(".sub_class"),
                $sub_classH = $sub_class.outerHeight(),
                windowH = $(window).outerHeight(),
                scrollTop = parseFloat(body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) || 0,
                _negative,
                $sub_class_data,
                _top = 0,
                _data_hover_color = $this.attr("data_hover_color");
            if (!$sub_class.length) {
                $sub_class_data = $this.find(".sub_class_data")
                $this.append($sub_class_data.html());
                $sub_class = $this.find(".sub_class");
                $sub_class_data.remove();
                $sub_classH = $sub_class.outerHeight()
            }
            if (_data_hover_color) {
                $this.find(".sub_class").css("background", _data_hover_color);
                $this.find(".class_hover_item").css("background", _data_hover_color);
                $this.removeAttr("data_hover_color")
            }
            $this.addClass("chked");
            if ($sub_class.offset().top - scrollTop <= 50 && $sub_classH < windowH) {
                $sub_class.stop().css({ "top": 4 });
            }
            _negative = windowH + scrollTop - $sub_class.offset().top - $sub_classH;
            if (_negative < 40) {
                $sub_class.stop().animate({ "top": parseFloat($sub_class.css("top")) + _negative - 63 });
            }

        }, function () {
            var $this = $(this);
            $this.removeClass("chked");
        });
        $ann_list.on("click", ".ui_btn", function () {
            var $this = $(this);
            $ann_list.attr("class", "ann_list " + $this.attr("data_key"));
            $ann_list.find(".more").attr("href", $this.attr("dmu"));
            return false;
        });
        $page.on("click", ".go_business", function () {
            var $this = $(this), _dsxy = $this.data("dsxy");
            if (!_dsxy) {
                _dsxy = dsxy.show();
                $this.data("dsxy", _dsxy);
            }
            _dsxy.show();
            return false;
        });
        $page.on("click", ".search_type_item", function () {
            var $this = $(this).closest("li");
            $this.closest("ul").prepend($this);
            $search_form.attr("action", $this.attr("data_action"));
            $search_txt.focus();
            return false;
        });
        $page.find(".search_type").hover(function () {
            $search_form.addClass("showsearch_type")
        }, function () {
            $search_form.removeClass("showsearch_type")
        });
        $page.on("click", ".registration", function () {
            var $this = $(this), errorTips = $this.data("errorTips");
            if (!errorTips) {
                errorTips = new tips({
                    ele: $this,
                    con: '<p>谢谢您的关注！<br>签到功能还在开发中，不要心急哦！</p>',
                    close: 2000,
                    direction: 'tc',
                    offset: {
                        top: -5
                    }
                });
            }
            errorTips.show();
            return false;
        });
        $page.on("click", ".search_form .submit", function () {
            var $txt = $page.find(".search_txt"), _v = $.trim($txt.val());
            if (!_v) {
                $txt.focus();
                return false;
            }

        });
    };
    init();
});
