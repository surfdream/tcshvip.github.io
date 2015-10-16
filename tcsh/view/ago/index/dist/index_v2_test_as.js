define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        lazyload = require("wmlazyload"),
        dsxy = require("dsxy"),
        wmas = require("wmas"),
        forImg = require("wmforimg");
    var init = function () {
        var $page = $("#page");
        lazyload.init({
            lazyloadEle: "img"
        });
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
    };
    var bind = function () {
        var $body = $("body"), body = $body[0], $page = $("#page"), $ann_list = $page.find(".ann_list"), $class_nav = $page.find(".class_nav");
        $class_nav.find(".ci_hoverkey").hover(function () {
            var $this = $(this),
                $sub_class = $this.find(".sub_class"),
                $sub_classH = $sub_class.outerHeight(),
                windowH = $(window).outerHeight(),
                scrollTop = parseFloat(body.scrollTop || document.documentElement.scrollTop || window.pageYOffset),
                _negative,
                _data_hover_color = $this.attr("data_hover_color");
            if (_data_hover_color) {
                $this.find(".sub_class").css("background", _data_hover_color);
                $this.find(".class_hover_item").css("background", _data_hover_color);
                $this.removeAttr("data_hover_color")
            }
            $this.addClass("chked");
            if ($sub_class.offset().top - scrollTop <= 0) {
                $sub_class.stop().css({ "top": 4 });
            }
            _negative = windowH + scrollTop - $sub_class.offset().top - $sub_classH;
            if (_negative < 0) {
                $sub_class.stop().animate({ "top": parseFloat($sub_class.css("top")) + _negative - 20 });
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

    };
    init();
});
