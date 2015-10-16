define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        forimg = require('wmforimg'),
        lib = require('lib'),
        tips = require('wmtips'),
        loginBox = require('loginBox'),
        out_share = require('out_share');
    var role = lib.getRole();
    var init = function () {
        out_share.init($(".out_share a"));
        bind();
        $(".for_img_item:eq(0)").click();
    };
    var bind = function () {
        var $page = $("#page"),
            $maximg = $page.find(".max_img img"),
            $add_call_msg_con = $page.find(".add_call_msg_con"),
            $add_call_parend =$add_call_msg_con.find(".add_call_parend");
        if ($page.find(".min_img_list .for_img_item").length >= 5) {
            var _forimg = new forimg.Slide({
                forImgBoxEle: ".min_img_list_sub",
                direction: 1,
                callback: function () {
                    var that = this;
                    $page.on("click", ".uproll", function () {
                        that.prev();
                        return false;
                    });
                    $page.on("click", ".downroll", function () {
                        that.next();
                        return false;
                    });
                }
            });
        } else {
            $page.find(".uproll,.downroll").remove();
        }
        $page.on("click", ".for_img_item", function () {
            var $this = $(this);
            if ($this.hasClass("curr")) { return false;}
            $page.find(".min_img_list .curr").removeClass("curr");
            $this.addClass("curr");
            var _url = $this.find("img").attr("src");
            $maximg.css({
                visibility: "hidden"
            }).stop(true, true);
            $maximg.attr("src", _url);
            lib.geometricZoom({
                boxW: 410,
                boxH: 430,
                $img: $maximg,
                callback: function () {
                    this.css({ display: "none" }).fadeIn(800);
                }
            });
            return false;
        });
        $page.on("click", ".add_call_btn", function () {
            var $this = $(this), $parent = $this.closest(".single_sun_data");;
            if ($parent.hasClass("call_msg")) {
                $add_call_msg_con.find(".add_call_parend").empty().append('<a href="#" class="wm_ico fork2 del_call"></a><span class="title">引用：</span>' + $parent.attr("data_msg")).css("display", "block");
                $page.find("#call_msg_id").val($parent.attr("data_id"));
            } else {
                $add_call_msg_con.find(".add_call_parend").empty().css("display", "none");
            }
            $page.find(".add_call_msg_txt").focus();
            return false;
        });
        $page.on("click", ".del_call", function () {
            var $this = $(this);
            $this.closest(".add_call_parend").empty().css("display", "none");
            $page.find("#call_msg_id").val('');
            return false;
        });
        $page.on("click", ".praise", function () {
            var $this = $(this), errorTips, roleTips;
            lib.verificationLogin(function () {
                if (role.key === "1") {
                    $.ajax({
                        url: domains.api+"/productsun/sunuse/" + global_setting.sun_id,
                        type: "get",
                        dataType: "jsonp",
                        success: function (data) {
                            if (data.success) {
                                $this.find(".ui_btn_txt").empty().append('有用(' + data.success + ')');
                            } else {
                                errorTips = $this.data("errorTips");
                                if (!errorTips) {
                                    errorTips = new tips({
                                        ele: $this,
                                        con: '<p>只能点一次哦~</p>',
                                        direction: "tc",
                                        close: 2000,
                                        offset: { left: 5, top: -5 }
                                    });
                                }
                                errorTips.show();
                            }
                        }
                    });
                } else {
                    roleTips = $this.data("roleTips");
                    if (!roleTips) {
                        roleTips = new tips({
                            ele: $this,
                            con: '<p>' + role.value + '账号不能点这个哦！<br><a href="#" class="login" style="color: #4fa2d6;">重新登录</a></p>',
                            direction: 'tc',
                            offset: {
                                top: -5
                            },
                            callBack: function () {
                                this.$tipsBox.on("click", ".login", function () {
                                    loginBox();
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
        $page.on("click", ":submit", function () {
            var $this = $(this), roleTips;
            lib.verificationLogin(function () {
                if (role.key === "1") {
                    $this.closest("form").submit();
                } else {
                    roleTips = $this.data("roleTips");
                    if (!roleTips) {
                        roleTips = new tips({
                            ele: $this,
                            con: '<p>' + role.value + '账号不能进行回复晒单操作！<br><a href="#" class="login" style="color: #4fa2d6;">重新登录</a></p>',
                            direction: 'tc',
                            offset: {
                                top: -5
                            },
                            callBack: function () {
                                this.$tipsBox.on("click", ".login", function () {
                                    loginBox();
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
    };
    init();
});
