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
        qq_server = require("qq_server"),
        waterfall = require('wmwaterfall');
    var big_ads, _waterfall;
    var _role = lib.getRole();
    var _itemHtml = juicer([
           '{@each list as item,index}',
           '<li class="commodity_item waterfall_item">',
               '<div class="lazyload_img_bg">',
                   '<a href="' + domains.item + '/${item.id}.html" target="_blank">',
                       '<img src="${item.ProductImgDefault}" lazyload_url="${item.ProductImgDefault}" class="lazyload" lazyload="t" />',
                   '</a>',
               '</div>',
               '<a href="' + domains.item + '/${item.id}.html" class="commodity_data">${item.ProductName}</a>',
               '<span class="parity dlink">市场价：￥${item.MarketPrice}</span>',
               '{@each item.ComparePrice as _list}',
                   '<span class="parity">${_list.name}：￥${_list.price}</span>',
               '{@/each}',
               '<span class="commodity_price">',
                   '<b>特卖价：￥${item.SalePrice}（${item.discount}折）</b>',
               '</span>',
           '</li>',
           '{@if iskeep && index==1}',
           '<li class="commodity_item waterfall_item"><a href="#" class="keep" title="收藏店铺"></a></li>',
           '{@/if}',
           '{@/each}'
    ].join(''));
    var $loading = $('<i style="display: none;width: 200px;margin: 0 auto;padding: 20px 0;filter: progid:DXImageTransform.Microsoft.gradient(enabled=true,startColorstr=#99000000, endColorstr=#99000000);background:rgba(000,000,000,0.5);"><img src="http://s.tcsh.me/tcsh/view/public/img/loading/loading_200_200.gif" style="margin: 0 auto;display: block;width:50px;height:50px"></i>');
    var isStuff = true;
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
        $.ajax({
            url: domains.api+"/product/pagemerchant",
            type: "get",
            data: {
                id: global_setting.PageInfo.WhereDic.id,
                start: global_setting.PageInfo.Start,
                size: global_setting.PageInfo.Size,
                category: global_setting.PageInfo.WhereDic.category || 0,
                sort: global_setting.PageInfo.Sort,
                total: global_setting.PageInfo.TotalItems,
                asc: global_setting.PageInfo.Asc || 0
            },
            dataType: "jsonp",
            success: function (data) {
                var $html, i, _arr = [], _appendHtml;
                data.iskeep = true;
                _appendHtml = _itemHtml.render(data);
                isStuff = data.list.length > 2;
                if (data.list.length < 2) {
                    i = 2 - data.list.length;
                    while (i--) {
                        _arr.push('<li class="commodity_item waterfall_item"></li>');
                    }
                    _appendHtml += _arr.join('');
                    _appendHtml += '<li class="commodity_item waterfall_item"><a href="#" class="keep" title="收藏店铺"></a></li>';
                }
                $html = $(_appendHtml);
                //这个处理有点2
                _waterfall.append($html.css("visibility", "hidden"), function () {
                    $html.css({ "visibility": "visible", "display": "none" });
                    $html.fadeIn(800);
                });
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
            url: domains.item+'/merchant/list/' + global_setting.PageInfo.WhereDic.id,
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
        var body = $("body").get(0), $paeg = $("#page"), appendQueue = [], _setInterval;
        var maxLoad = 3, ajaxIndex =0, ajaxIsReturn = true;
        if (global_setting.PageInfo.TotalItems > global_setting.PageInfo.Size) {
            maxLoad = parseInt(((global_setting.PageInfo.Start + global_setting.PageInfo.Size * maxLoad)) / global_setting.PageInfo.TotalItems) + 1;
            $(window).on("scroll.waterfall", function () {
                var scrollTop = body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
                if (ajaxIndex <= maxLoad && ajaxIsReturn && scrollTop >= _waterfall.getMaxBott() - 1500 && global_setting.PageInfo.Start + global_setting.PageInfo.Size < global_setting.PageInfo.TotalItems) {
                    $loading.css("display", "block");
                    ajaxIsReturn = false;
                    $.ajax({
                        url: domains.api+"/product/pagemerchant",
                        type: "get",
                        data: {
                            id: global_setting.PageInfo.WhereDic.id,
                            start: global_setting.PageInfo.Start += global_setting.PageInfo.Size,
                            size: global_setting.PageInfo.Size,
                            category: global_setting.PageInfo.WhereDic.category || 0,
                            sort: global_setting.PageInfo.Sort,
                            total: global_setting.PageInfo.TotalItems,
                            asc: global_setting.PageInfo.Asc || 0
                        },
                        dataType: "jsonp",
                        success: function (data) {
                            ++ajaxIndex;
                            appendQueue.push(data);
                            ajaxIsReturn = true;
                        }
                    });
                }
            });
            _setInterval = setInterval(function () {
                if (appendQueue.length) {
                    var $append = $(_itemHtml.render(appendQueue.shift())).fadeOut(0);
                    _waterfall.append($append.css("visibility", "hidden"), function () {
                        $append.css({ "visibility": "visible", "display": "none" })
                        $append.fadeIn(800);
                    });
                    if (ajaxIndex > maxLoad && !appendQueue.length) {
                        clearInterval(_setInterval);
                        setTimeout(function () {
                            isStuff && _waterfall.stuff();
                        }, 1000);
                    }
                }
            }, 1000);
        } else {
            setTimeout(function () {
                isStuff && _waterfall.stuff();
            }, 1000);
        }
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
    }
    init();
});