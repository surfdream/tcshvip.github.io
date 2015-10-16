define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        juicer = require('juicer'),
        lib = require('lib'),
        forImg = require('wmforimg'),
        lazyload = require('wmlazyload'),
        page = require('wmpage'),
        loginBox = require('wmloginbox'),
        collection = require("wmcollection"),
        tips = require("wmtips"),
        waterfall = require('wmwaterfall');
    var big_ads, _waterfall;
    var $loading = $('<i style="display: none;width: 200px;margin: 0 auto;padding: 20px 0;filter: progid:DXImageTransform.Microsoft.gradient(enabled=true,startColorstr=#99000000, endColorstr=#99000000);background:rgba(000,000,000,0.5);"><img src="http://s.tcsh.me/tcsh/view/public/img/loading/loading_200_200.gif" style="margin: 0 auto;display: block;width:50px;height:50px"></i>');
    var _role=lib.getRole();
    var init = function () {
        big_ads = new forImg.Fade({
            forImgBoxEle: ".shop_big_ads",
            interval: 8000,
            callback: function () {
                var that = this;
                var i = this.forImgItem.length
                var $indexBox = this.forImgBox.find(".indexBox"), indexItem = [];
                $indexBox.empty().append('<ul></ul>');
                $indexBox = $indexBox.find("ul");
                while (i--) {
                    indexItem[i] = '<li class="index_item wm_ico point_white1"></li>'
                }
                $indexBox.append(indexItem.join(''));
                $indexBox.css({ "padding-left": "50%", "margin-left": "-" + $indexBox.width() / 2 + "px" })
                this.indexs = $indexBox.find('.index_item');
                this.indexs.eq(0).addClass("curr");
                this.forImgBox.find("#nextbtn").click(function () {
                    that.next();
                    return false;

                });
                this.forImgBox.find("#prevbtn").click(function () {
                    that.prev();
                    return false;
                });
                this.indexs.click(function () {
                    that.setIndex(this);
                });
                this.automatic(true);
            }
        });
        _waterfall = waterfall.create({
            spacing: 30
        });
        //_waterfall.stuff();
        lazyload.init();
        bind();
        $(".commodity_list").append($loading);
    };
    var bind = function () {
        var body = $("body").get(0), $paeg = $("#page");
        var maxLoad = 3, ajaxIndex = 1, pageData, ajaxIsReturn = true;
        var _itemHtml = juicer([
            '{@each list as item}',
            '<li class="commodity_item waterfall_item">',
                '<div class="lazyload_img_bg">',
                    '<a href="/product/view/${item.id}" target="_blank">',
                        '<img src="http://s.tcsh.me/tcsh/view/public/img/pit.png" lazyload_url="${item.ProductImgDefault}" class="lazyload" lazyload="t" />',
                    '</a>',
                '</div>',
                '<a href="/product/view/${item.id}" class="commodity_data">${item.ProductName}</a>',
                '<span class="parity dlink">市场价：￥${item.MarketPrice}</span>',
                '{@each item.ComparePrice as _list}',
                    '<span class="parity">${_list.name}：￥${_list.price}</span>',
                '{@/each}',
                '<span class="commodity_price">',
                    '<b>特卖价：￥${item.SalePrice}（${item.discount}折）</b>',
                '</span>',
            '</li>',
            '{@/each}'
        ].join(''));
        var appendQueue = [], _start = global_setting.PageInfo.Start;
        if (global_setting.PageInfo.TotalItems > global_setting.PageInfo.Size) {
            $(window).on("scroll.waterfall", function () {
                var scrollTop = body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
                if (ajaxIndex <= 3 && ajaxIsReturn && scrollTop >= _waterfall.getMaxBott() - 1500) {
                    $loading.css("display", "block");
                    ++ajaxIndex;
                    ajaxIsReturn = false;
                    $.ajax({
                        url: domains.api+"/product/pagemerchant",
                        type: "get",
                        data: {
                            id: global_setting.PageInfo.WhereDic.id,
                            start: global_setting.PageInfo.Start += global_setting.PageInfo.Size,
                            size: global_setting.PageInfo.Size,
                            category: global_setting.PageInfo.WhereDic.category,
                            sort: global_setting.PageInfo.Sort,
                            total: global_setting.PageInfo.TotalItems
                        },
                        dataType: "jsonp",
                        success: function (data) {
                            appendQueue.push(data);
                            //_waterfall.append(_itemHtml.render(data));
                            ajaxIsReturn = true;
                            if (ajaxIndex > 3) {
                                pageData = data.PageInfo;
                                page.CreateStartPage({
                                    url: domains.item+'/merchant/list/' + global_setting.PageInfo.WhereDic.id,
                                    element: ".wm_page",
                                    param: {
                                        category: global_setting.PageInfo.WhereDic.category,
                                        sort: pageData.Sort,
                                        asc: pageData.Asc,
                                        total: pageData.TotalItems
                                    },
                                    pagekey: "start",
                                    start: _start,
                                    size: 60,
                                    sum: pageData.TotalItems,
                                    front: true
                                });

                            }
                        }
                    });
                }
            });
            setInterval(function () {
                if (appendQueue.length) {
                    var $append = $(_itemHtml.render(appendQueue.shift())).fadeOut(0);
                    _waterfall.append($append);
                    $loading.css("display", "none");
                    $append.fadeIn(400);
                }

            }, 1000);
        };
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
        $paeg.on("click", ".keep", function () {
            var $this = $(this), thisTips, roleTips,errorTips;
            if (!_role || (_role && _role.key == "1")) {
                collection.collectBusiness({
                    id: global_setting.mer_id,
                    success: function (data) {
                        if (data.response) {
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
                            _keepError.call($this,"请不要重复收藏！");
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
    };
    init();
});