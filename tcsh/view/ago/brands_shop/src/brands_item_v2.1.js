define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        juicer = require('juicer'),
        lib = require('lib'),
        forImg = require('wmforimg'),
        page = require('wmpage'),
        loginBox = require('wmloginbox'),
        collection = require("wmcollection"),
        tips = require("wmtips"),
        lazyload = require("wmlazyload"),
        qq_server = require("qq_server"),
        waterfall = require('wmwaterfall');
    var big_ads, _waterfall;
    var _role = lib.getRole();


    var init = function () {
        var $page = $("#page"),
            $waterfall_list = $page.find(".waterfall_list"),
            $shop_nav_sub = $page.find(".shop_nav_sub"),
            $shop_nav_item = $shop_nav_sub.find('li');
        big_ads = new forImg.Fade({
            forImgBoxEle: ".booth_box",
            forImgBoxListEle: ".booth_list",
            forImgItemEle: ".booth_item",
            interval: 8000,
            callback: function () {
                var that = this;
                var i = this.forImgItem.length
                var $indexBox = this.forImgBox.find(".indexBox").empty(), indexItem = [];
                while (i--) {
                    indexItem[i] = '<li class="index_item wm_ico point_white1"></li>'
                }
                $indexBox.append(indexItem.join(''));
                this.indexs = $indexBox.find('.index_item');
                this.indexs.eq(0).addClass("curr");
                this.indexs.click(function () {
                    that.setIndex(this);
                });
                this.forImgBox.find(".to_right").click(function () {
                    that.next();
                    return false;
                });
                this.forImgBox.find(".to_left").click(function () {
                    that.prev();
                    return false;
                });
                this.forImgBox.hover(function () {
                    $indexBox.stop().animate({ "bottom": 0 });
                }, function () {
                    $indexBox.stop().animate({ "bottom": -30 });
                });
                this.automatic(true);
                if ($.browser.msie && $.browser.version === "6.0") {
                    that.forImgBox.hover(function () {
                        $(this).addClass("booth_box_hover");
                    }, function () {
                        $(this).removeClass("booth_box_hover");
                    });
                }
            }
        });

        _waterfall = waterfall.create({
            spacing: 20
        });
        lazyload.init({
            callback: function () {
                _waterfall.reset();
            }
        });


        bind();
        $page.find(".commodity_list").append($loading);
        if (global_setting.mer_id == lib.cookie("wm.user.id") && $shop_nav_item.length <= 3) {
            new tips({
                ele: $shop_nav_item.last(),
                con: '<p><i class="wm_ico sigh1" style="margin-right:10px"></i>导航太单调？赶紧去<a href="' + domains.sell + '/market?set_nav=t" target="_blank" style="color:#4fa2d6;margin:0 5px">店铺设置</a>设置导航吧~</p>',
                direction: 'br',
                offset: {
                    top: 5,
                    left: -30
                },
                minIndex: 1
            }).show();
        }
        if (global_setting.mer_id == lib.cookie("wm.user.id") && big_ads.forImgItem.length == 0) {
            new tips({
                ele: big_ads.forImgBox,
                con: '<p><i class="wm_ico sigh1" style="margin-right:10px"></i>橱窗位太空旷？赶紧去<a href="' + domains.sell + '/product/list" target="_blank" style="color:#4fa2d6;margin:0 5px">商品列表</a>寻找商品，加入橱窗吧~</p>',
                direction: 'bc',
                offset: {
                    top: 5
                },
                minIndex: 1
            }).show();
        }
        //$page.find(".order_by_btn").each(function () {
        //    var $this = $(this);
        //    $this.attr("href", domains.item+"/merchant/list/100047?" + $.param($.extend(global_setting.PageInfo.WhereDic, $this.data("order_by_data"))));
        //});
        page.CreateStartPage({
            url: domains.item + '/merchant/list/' + global_setting.PageInfo.WhereDic.id,
            element: ".wm_page",
            param: {
                category: global_setting.PageInfo.WhereDic.category,
                sort: global_setting.PageInfo.WhereDic.Sort || 0,
                asc: global_setting.PageInfo.WhereDic.Asc || 0,
                total: global_setting.PageInfo.TotalItems
            },
            pagekey: "start",
            start: global_setting.PageInfo.Start,
            size: global_setting.PageInfo.Size * 3,
            sum: global_setting.PageInfo.TotalItems,
            front: true
        });
        qq_server.Create();
    };
    var bind = function () {
        var $win = $(window), $paeg=$("#page");
        //加入收藏异常处理
        var _keepError = function (msg) {
            var $this = this, errorTips;
            errorTips = $this.data("errorTips");
            if (!errorTips) {
                errorTips = new tips({
                    ele: $this,
                    con: '<p><i class="wm_ico sigh1" style="margin-right:10px"></i>' + (msg || '收藏失败！@码农，赶快处理！') + '</p>',
                    close: 2000,
                    direction: 'tc',
                    skin: "red2",
                    offset: {
                        top: -6
                    }
                });
                $this.data("errorTips", errorTips);
            }
            errorTips.show();
        };
        //加入收藏
        $paeg.on("click", ".keep", function () {
            var $this = $(this), thisTips, roleTips, errorTips;
            if (!_role || (_role && _role.key == "1")) {
                collection.collectBusiness({
                    id: global_setting.mer_id,
                    success: function (data) {
                        if (data.success) {
                            thisTips = $this.data("thisTips");
                            if (!thisTips) {
                                thisTips = new tips({
                                    ele: $this,
                                    con: '<p><i class="wm_ico hook2" style="margin-right:10px"></i>收藏成功！</p>',
                                    close: 2000,
                                    direction: 'tc',
                                    offset: {
                                        top: -6
                                    }
                                });
                                $this.data("thisTips", thisTips);
                            }
                            thisTips.show();
                        } else {
                            _keepError.call($this, "请不要重复收藏！");
                        }
                    },
                    error: function () {
                        _keepError.call($this);
                    }
                });
            }
            else {
                roleTips = $this.data("roleTips");
                if (!roleTips) {
                    roleTips = new tips({
                        ele: $this,
                        con: '<p>' + _role.value + '账号不能进行收藏操作！<br><a href="#" class="login" style="color: #4fa2d6;">重新登录</a></p>',
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
            return false;
        });
        //这个比较吃性能
        $win.on("scroll.fixed", function () {
            _waterfall.reset();
        });
        

    }
    init();
});