define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        tips = require("wmtips"),
        lazyload = require("wmlazyload"),
        loginBox = require("loginBox"),
        forImg = require("wmforimg");
    var role = lib.getRole();
    var init = function () {
        var $page = $("#page"),
            $brands_box = $page.find(".brands_box"),
            $countdown_box = $page.find(".countdown_box"),
            _serviceTicks = global_setting.serviceTicks,
            serviceTicks = new Date(_serviceTicks);
        lazyload.init();
        new forImg.Fade({
            forImgBoxEle: ".big_ads",
            interval: 5000,
            callback: function () {
                var that = this;
                var i = this.forImgItem.length
                var $indexBox = this.forImgBox.find(".indexBox"), indexItem = [];
                $indexBox.empty().append('<ul></ul>');
                $indexBox = $indexBox.find("ul");
                while (i--) {
                    indexItem[i] = '<li class="index_item">' + (i + 1) + '</li>';
                }
                $indexBox.append(indexItem.join(''));
                this.indexs = $indexBox.find('.index_item');
                this.indexs.eq(0).addClass("curr");
                this.indexs.click(function () {
                    that.setIndex(this);
                });
                this.forImgBox.find(".to_right").click(function () {
                    that.next(function () {
                        this.forImgBox.find(".big_ads_left img,.big_ads_right img").attr("src", $(".big_ads").find(".for_img_item:visible img").attr("src"));
                    });
                    return false
                });
                this.forImgBox.find(".to_left").click(function () {
                    that.prev(function () {
                        this.forImgBox.find(".big_ads_left img,.big_ads_right img").attr("src", $(".big_ads").find(".for_img_item:visible img").attr("src"));
                    });
                    return false
                });
                this.automatic(true);
            }
        });
        new forImg.Fade({
            forImgBoxEle: ".block_for_con",
            interval: 5000,
            callback: function () {
                var that = this;
                var i = this.forImgItem.length
                var $indexBox = this.forImgBox.find(".indexBox"), indexItem = [];
                $indexBox.empty().append('<ul></ul>');
                $indexBox = $indexBox.find("ul");
                while (i--) {
                    indexItem[i] = '<li class="index_item">' + (i + 1) + '</li>'
                }
                $indexBox.append(indexItem.join(''));
                this.indexs = $indexBox.find('.index_item');
                this.indexs.eq(0).addClass("curr");
                this.indexs.click(function () {
                    that.setIndex(this);
                });
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
        //$brands_box.find(".b_item").each(function () {
        //    var $this = $(this), _d, _dobj;
        //    if ($this.attr("no_end")) {
        //        $this.find(".b_end_date").empty().append("永久开放");
        //    } else {
        //        _d = new Date($this.attr("data_y") - 0, $this.attr("data_m") - 0 - 1, $this.attr("data_d") - 0, 23, 59, 59);
        //        if (_d.getTime() - _serviceTicks > 0) {
        //            _dobj = lib.turnTime(_d.getTime() - _serviceTicks);
        //            $this.find(".b_end_date").addClass("setinterval_date").data("dobj", _dobj).empty().append("剩余时间：" + _dobj.d + "天" + _dobj.h + "小时" + _dobj.m + "分" + _dobj.s + "秒");
        //        }
        //        else {
        //            $this.remove();
        //        }
        //    }
        //});
        //$countdown_box.find(".b_item").each(function () {
        //    //下面所有计算，仅针对时间，所以getMonth方法使用过程未+1，如果后面维护 +1 了  这句注释记得干掉
        //    var $this = $(this),
        //        _d = new Date(_serviceTicks),
        //        _end_date = new Date(_d.getFullYear(), _d.getMonth(), _d.getDate(), 23, 59, 59),
        //        _show_date = lib.turnTime(_end_date.getTime() - _serviceTicks);
        //    $this.find(".countdown_end_date").data("dobj", _show_date).empty().append("剩余时间：" + _show_date.h + "小时" + _show_date.m + "分" + _show_date.s + "秒");
        //});
        //setInterval(function () {
        //    var _data, str;
        //    $brands_box.find(".setinterval_date").each(function () {
        //        var $this = $(this), _data = $this.data("dobj");
        //        if (_data.s--) {
        //            $this.empty().append('剩余时间：' + _data.d + '天' + _data.h + "小时" + _data.m + '分' + _data.s + '秒');
        //        } else {
        //            _data.s = 59;
        //            if (_data.m--) {
        //                $this.empty().append('剩余时间：' + _data.d + '天' + _data.h + "小时" + _data.m + '分' + _data.s + '秒');
        //            } else {
        //                _data.m = 59;
        //                if (_data.h--) {
        //                    $this.empty().append('剩余时间：' + _data.d + '天' + _data.h + "小时" + _data.m + '分' + _data.s + '秒');
        //                } else {
        //                    $this.removeClass("setinterval_date");
        //                }
        //            }
        //        }
        //    });
        //    if ($countdown_box.find(".countdown_end_date").length) {
        //        _data = $countdown_box.find(".countdown_end_date:eq(0)").data("dobj");
        //        if (_data.s--) {
        //            str = '剩余时间：' + _data.h + "小时" + _data.m + '分' + _data.s + '秒'
        //        } else {
        //            _data.s = 59;
        //            if (_data.m--) {
        //                str = '剩余时间：' + _data.h + "小时" + _data.m + '分' + _data.s + '秒'
        //            } else {
        //                _data.m = 59;
        //                if (_data.h--) {
        //                    str = '剩余时间：' + _data.h + "小时" + _data.m + '分' + _data.s + '秒'
        //                } else {
        //                    str = "";
        //                }
        //            }
        //        }
        //        $countdown_box.find(".countdown_end_date").empty().append(str);
        //    }
        //}, 1000);
        bind();
    };
    var bind = function () {
        var $page = $("#page"), $brands_box;
        $page.on("click", ".praise", function () {
            var $this = $(this), errorTips, roleTips;
            lib.verificationLogin(function () {
                if (role.key === "1") {
                    $.ajax({
                        url: domains.api+"/productsun/sunuse/" + $this.closest(".new_single_sun_item").attr("sun_id"),
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
                                    $this.data("errorTips", errorTips);
                                }
                                errorTips.show();
                            }
                        },
                        error: function () {
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
        if ($.browser.msie && $.browser.version === "6.0") {
            $page.find(".block_680_210_box .b_item").hover(function () {
                $(this).addClass("b_item_hover");
            }, function () {
                $(this).removeClass("b_item_hover");
            });
            $page.find(".block_330_215_box .b_item").hover(function () {
                $(this).addClass("b_item_hover");
            }, function () {
                $(this).removeClass("b_item_hover");
            });
            $page.find(".big_ads").hover(function () {
                $(this).addClass("big_ads_hover");
            }, function () {
                $(this).removeClass("big_ads_hover");
            });
        }
    };
    init();
});
