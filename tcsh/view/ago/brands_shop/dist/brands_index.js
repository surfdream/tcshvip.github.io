define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        waterfall = require('wmwaterfall'),
        lazyload = require('wmlazyload'),
        lib=require('lib'),
        forImg = require('wmforimg');
    var init = function () {
        var $page = $("#page"),
            _serviceTicks = global_setting.serviceTicks,
            serviceTicks = new Date(_serviceTicks),
            $countdown_box = $page.find(".countdown_box");
        lazyload.init();
        //头部广告位
        new forImg.Slide({
            forImgBoxEle: ".big_ads",
            interval: 5000,
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

                this.indexs = $indexBox.find('.index_item');
                this.indexs.eq(0).addClass("curr");
                this.forImgBox.find(".to_right").click(function () {
                    that.next();
                    return false
                });
                this.forImgBox.find(".to_left").click(function () {
                    that.prev();
                    return false
                });
                this.indexs.click(function () {
                    that.setIndex(this);
                });
                this.automatic(true);
            }
        });
        //右侧新品入住
        new forImg.Fade({
            forImgBoxEle: ".new_commodity_box",
            interval: 10000,
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
                this.automatic(true);
            }
        });
        //品牌类型滚动
        $page.find(".updownfor").each(function () {
            var $this = $(this);
            new forImg.Slide({
                forImgBoxEle: $this,
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
                    this.indexs = $indexBox.find('.index_item');
                    this.indexs.eq(0).addClass("curr");
                    this.indexs.click(function () {
                        that.setIndex(this);
                    });
                    this.automatic(true);
                }
            });
        });
        _waterfall = waterfall.create({
            listEle: ".one_week_good_brands_list",
            itemEle: ".one_week_good_brands_item",
            spacing: 1
        });
        _waterfall.stuff();
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        if ($.browser && $.browser.msie && $.browser.version && $.browser.version === "6.0") {
            $page.find(".big_ads").hover(function () {
                $(this).find(".big_ads_btns a").css("display", "inline-block");
            }, function () {
                $(this).find(".big_ads_btns a").css("display", "none");
            });
        }
        $page.on("click", ".commodity_tab_key", function () {
            var $this = $(this);
            $this.closest(".content_right_item_con").attr("class", "content_right_item_con " + $this.attr("tab_key"));
            return false;
        });
        if ($.browser.msie && $.browser.version === "6.0") {
            $page.find(".big_ads").hover(function () {
                $(this).addClass("big_ads_hover");
            }, function () {
                $(this).removeClass("big_ads_hover");
            });
            $page.find(".block_330_215_box .b_item").hover(function () {
                $(this).addClass("b_item_hover");
            }, function () {
                $(this).removeClass("b_item_hover");
            });         
        }
    };
    init();
});