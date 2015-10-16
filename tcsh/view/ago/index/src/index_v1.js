define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        lazyload = require("wmlazyload"),
        dsxy = require("dsxy"),
        tips = require("wmtips"),
        wmas = require("wmas"),
        juicer = require("juicer"),
        forImg = require("wmforimg");
    var init = function () {
        var $body = $("body"),
            body = $body[0],
            $page = $("#page"),
            $class_nav = $page.find(".class_nav");
        ;
        lazyload.init();
        var new_comm_item = juicer([
            '{@each success as item}',
            '<li class="comm_item">',
                '<a href="' + domains.item + '/${item.id}.html" target="_blank">',
                    '<img src="${item.product_img}"/>',
                    '<span>${item.product_name}</span>',
                    '<span>￥${item.sale_price}</span>',
                '</a>',
            '</li>',
            '{@/each}',
        ].join(''));
        //广告数据初始化
        wmas.init({
            otherData: "logo",
            callback: [
                {
                    key: "adv_1920_480",
                    fun: function () {
                        //大广告
                        new forImg.Fade({
                            forImgBoxEle: ".adv_1920_480",
                            interval: 5000,
                            callback: function () {
                                var that = this;
                                var i = this.forImgItem.length
                                var $indexBox = this.forImgBox.find(".indexBox"), indexItem = [];
                                while (i--) {
                                    indexItem[i] = '<li class="wm_ico point_white1"></li>';
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
                    key: "adv_360_430",
                    fun: function () {
                        this.find(".brand_img img[src='']").attr("src", "http://s.tcsh.me/tcsh/view/ago/index/img/logo1.jpg");
                        this.find(".brand_name[data_name='']").append('品牌名称');
                        //上新
                        new forImg.Slide({
                            forImgBoxEle: ".new_comm .con_row_main",
                            interval: 3000,
                            direction: true,
                            callback: function () {
                                var that = this;
                                var _initCommList = function (callback) {
                                    var _id = this.attr("data_id"),
                                        self = this;
                                    $.ajax({
                                        url: domains.api2 + "/product/recommend.json",
                                        type: "get",
                                        data: {
                                            merchant_id: _id,
                                            count: 6
                                        },
                                        dataType: "jsonp",
                                        success: function (data) {
                                            var $ul = $('<ul class="comm_list"></ul>');
                                            self.append($ul.append(new_comm_item.render(data)));
                                            typeof callback === "function" && callback.call(self);
                                        },
                                        error: function () {
                                            var $ul = $('<ul class="comm_list"></ul>');
                                            var data = {
                                                success: [
                                                    {
                                                        id: "0",
                                                        product_name: "暂无商品",
                                                        product_img: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png",
                                                        sale_price: 0
                                                    },
                                                    {
                                                        id: "0",
                                                        product_name: "暂无商品",
                                                        product_img: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png",
                                                        sale_price: 0
                                                    },
                                                    {
                                                        id: "0",
                                                        product_name: "暂无商品",
                                                        product_img: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png",
                                                        sale_price: 0
                                                    },
                                                    {
                                                        id: "0",
                                                        product_name: "暂无商品",
                                                        product_img: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png",
                                                        sale_price: 0
                                                    },
                                                    {
                                                        id: "0",
                                                        product_name: "暂无商品",
                                                        product_img: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png",
                                                        sale_price: 0
                                                    },
                                                    {
                                                        id: "0",
                                                        product_name: "暂无商品",
                                                        product_img: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png",
                                                        sale_price: 0
                                                    }
                                                ]
                                            };
                                            $ul.append(new_comm_item.render(data));
                                            self.append($ul);
                                            typeof callback === "function" && callback.call(self);
                                        }
                                    });
                                };
                                _initCommList.call(this.forImgBox.find(".brand_item:eq(0)").addClass("hover"), function () {
                                    this.find(".adv_img,.comm_list").fadeIn();
                                });
                                this.forImgItem.length > 4 && this.automatic(true, function () {
                                    var $hover = that.forImgBox.find(".hover");
                                    if (!$hover.length || $hover.index() > 3) {
                                        $hover.removeClass("hover");
                                        that.forImgBox.find(".adv_img,.comm_list").stop(true, true).fadeOut();
                                        that.forImgBox.find(".brand_item:eq(0)").addClass("hover");
                                        $hover = that.forImgBox.find(".hover");
                                        if (!$hover.find(".comm_list").length) {
                                            _initCommList.call($hover, function () {
                                                $hover.find(".adv_img,.comm_list").stop(true, true).fadeIn();
                                            });
                                        }
                                        $hover.find(".adv_img,.comm_list").stop(true, true).fadeIn();
                                    }
                                });
                                this.forImgItem.hover(function () {
                                    var $this = $(this);
                                    if ($this.find(".comm_list").length) {
                                        that.forImgBox.find(".hover").removeClass("hover");
                                        that.forImgBox.find(".adv_img,.comm_list").stop(true, true).fadeOut();
                                        $this.addClass("hover");
                                        $this.find(".adv_img,.comm_list").stop(true, true).fadeIn();
                                    } else {
                                        _initCommList.call($this);
                                    }
                                }, function () { });
                            }
                        });
                    }
                }
            ]
        });
        var _navHtml = juicer([
            '{@each list as item1}',
            '{@if item1.sort!=0}',
            '<li class="ci_hoverkey">',
                '<a href="' + domains.s + '/list/${item1.id}.html" target="_blank" class="class_item"><span class="arrow">></span><span class="class_name">${item1.nickname}</span></a>',
                '<a href="' + domains.s + '/list/${item1.id}.html" target="_blank" class="class_item class_hover_item"><span class="arrow">&nbsp;</span><span class="class_name">${item1.nickname}</span></a>',
                '<div class="sub_class">',
                    '<ul class="sub_class_list">',
                        '{@each item1.itemList as item2}',
                        '{@if item2.row == 1}',
                        '<li>',
                            '<a href="' + domains.s + '/list/${item2.id}.html" target="_blank" class="fw700">${item2.nickname}</a><span class="hr"></span>',
                            '<ul class="end_class_list">',
                                '{@each item2.itemList as item3}',
                                '<li><a href="' + domains.s + '/list/${item3.id}.html" target="_blank">${item3.nickname}</a></li>',
                                '{@/each}',
                            '</ul>',
                        '</li>',
                        '{@/if}',
                        '{@/each}',
                    '</ul>',
                    '<ul class="sub_class_list">',
                        '{@each item1.itemList as item2}',
                        '{@if item2.row == 2}',
                        '<li>',
                            '<a href="' + domains.s + '/list/${item2.id}.html" target="_blank" class="fw700">${item2.nickname}</a><span class="hr"></span>',
                            '<ul class="end_class_list">',
                                '{@each item2.itemList as item3}',
                                '<li><a href="' + domains.s + '/list/${item3.id}.html" target="_blank">${item3.nickname}</a></li>',
                                '{@/each}',
                            '</ul>',
                        '</li>',
                        '{@/if}',
                        '{@/each}',
                    '</ul>',
                '</div>',
            '</li>',
            '{@/if}',
            '{@/each}'
        ].join(''));
        $.ajax({
            url: domains.api + "/category/nav",
            type: "get",
            data: {
                type: "array"
            },
            dataType: "jsonp",
            success: function (data) {
                $class_nav.find(".class_list").empty().append(_navHtml.render({ list: data }));
                //分类导航
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
            }
        });
        //热卖单品
        new forImg.Slide({
            forImgBoxEle: ".adv_190_240",
            interval: 4000,
            callback: function () {
                var that = this;
                this.forImgBox.on("click", ".prev", function () {
                    that.prev();
                    return false;
                });
                this.forImgBox.on("click", ".next", function () {
                    that.next();
                    return false;
                });
                this.automatic(true, function () {
                    //页面加载后用户啥都不操作 会导致某些图片被轮播滚过来的时候还没是未加载状态
                    //这里手动触发懒加载
                    lazyload.triggerLazyload();
                });
            }
        });
        //妩媚潮流界
        new forImg.Slide({
            forImgBoxEle: ".popular_class",
            interval: 3000,
            callback: function () {
                var that = this, self = this;
                this.forImgItem.attr("data_key", 0);
                this.forImgItem.hover(function () {
                    var $this = $(this),
                        index = $this.index(),
                        _key = parseInt(Math.random() * 999999) + 99999;
                    $this.attr("data_key", _key);
                    (function (t, i, key) {
                        setTimeout(function () {
                            if (t.attr("data_key") == key) {
                                t.stop().animate({
                                    width: 740
                                }, function () {
                                    t.find(".limit").css({
                                        width: "auto"
                                    });
                                    t.find(".class_right").fadeIn();
                                });
                                if (i >= 2) {
                                    self.forImgBoxList.stop().animate({
                                        'margin-left': -240 * (index - 2)
                                    });
                                }
                            }
                        }, 300);
                    })($this, index, _key);
                }, function () {
                    var $this = $(this);
                    $this.find(".class_right").fadeOut(function () {
                        $this.find(".limit").css({
                            width: 240
                        });
                        $this.stop().animate({
                            width: 238
                        });
                        $this.attr("data_key", 0);
                    });
                    self.forImgBoxList.stop().animate({
                        'margin-left': 0
                    });
                });
                this.automatic(true);
                this.forImgBox.on("click", ".prev", function () {
                    if (!self.forImgBox.find(".for_img_item[data_key!='0']").length) {
                        self.prev();

                    }
                    return false;
                });
                this.forImgBox.on("click", ".next", function () {
                    if (!self.forImgBox.find(".for_img_item[data_key!='0']").length) {
                        self.next();
                    }
                    return false;
                });
                this.forImgBox.find(".sub_class_item a").hover(function () {
                    var $this = $(this),
                        $for_img_item = $this.closest(".for_img_item"),
                        $class_max_img = $for_img_item.find(".class_max_img");
                    $class_max_img.attr("href", $this.attr("href"));
                    $class_max_img.find("img").attr("src", $this.attr("data_img"));
                }, function () {

                });
                this.forImgItem.each(function () {
                    var $this = $(this),
                        $class_max_img = $this.find(".class_max_img"),
                        $a = $this.find(".sub_class_item:eq(0) a");
                    $class_max_img.attr("href", $a.attr("href"));
                    $class_max_img.find("img").attr("src", $a.attr("data_img"));
                });
                this.forImgItem.css({
                    width: 238,
                    visibility: "visible"
                });
            }
        });
        //公告
        new forImg.Slide({
            forImgBoxEle: ".ann_for_box",
            interval: 4000,
            direction: true,
            callback: function () {
                var that = this;
                this.automatic(true);
            }
        });
        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            $search_form = $page.find(".search_form"),
            $search_txt = $search_form.find(".search_form");
        //推荐
        $page.find(".top_item").hover(function () {
            var $this = $(this),
                _w = $this.attr("data_w") - 0,
                _h = $this.attr("data_h") - 0,
                $img = $this.find('img'),
                _imgW = $img.width(),
                _imgH = $img.height();
            $img.stop().animate({
                'margin-top': _h - _imgH >= 0 ? 0 : _h - _imgH,
                'margin-left': _w - _imgW >= 0 ? 0 : _w - _imgW
            });
        }, function () {
            var $this = $(this),
                $img = $this.find('img');
            $img.stop().animate({
                'margin-top': 0,
                'margin-left': 0
            });
        });
        //搜索
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
