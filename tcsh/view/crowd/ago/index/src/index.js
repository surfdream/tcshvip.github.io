define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
		box = require("wmbox"),
        crowd_type = require("crowd_type"),
        crowd_data = require("crowd_data"),
		forimg = require("forimg"),
		lib = require("lib"),
        verification = require("wmverification"),
        friend = require("friend")
    ;

    /* 右侧定位 方法  */
    var $page = $("#page"),
        $body = $("body"),
        $right = $page.find(".main_con_right"),
        _obusiness = $right.find(".business"),
        _aheight = _obusiness.offset().top + _obusiness.outerHeight()
    ;
    var right_position = function () {
        var _wleft = $page.find(".main_con_left").outerWidth(true),
            _oleft = $page.find(".main_con_left").offset().left,
            _obottom = $page.find(".footer").offset().top,
            scrollTop = $body[0].scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0,
            _scroll_top = scrollTop + $(window).height()        
        ;
        if (_aheight < _scroll_top && _scroll_top < _obottom) {
            $right.css({
                "position": "fixed",
                "left": _wleft + _oleft,
                "bottom":"-30px"
            });
        } else if (_scroll_top > _obottom) {
            $right.css({
                "position": "absolute",
                "left": "auto",
                "right":"0",
                "bottom": "30px"
            });
        } else {
            $right.css({
                "position": "relative",
                "left": 0,
                "bottom": 0
            });
        }
    };

    var init = function () {
        var $page = $("#page");
        $page.find(".mcl_slide").each(function () {
            var $this = $(this),
				m
            ;
            m = parseInt(Math.random() * 2000) + 3000;
            new forimg.Slide({
                forImgBoxEle: $this.find(".slideBox"),
                forImgBoxListEle: ".slideCon",
                forImgItemEle: ".slide_item",
                interval: m,
                callback: function () {
                    var self = this
                    ;

                    this.forImgBox.on("click", ".pre_btn", function () {
                        self.prev();
                        return false;
                    });
                    this.forImgBox.on("click", ".next_btn", function () {
                        self.next();
                        return false;
                    });
                    this.automatic(true);
                }
            });
        });

        if ($page.find(".fade").length) {
            new forimg.Fade({
                forImgBoxEle: ".fade",
                forImgBoxListEle: ".slideCon",
                forImgItemEle: ".slide_item",
                callback: function () {
                    var self = this
                    ;
                    this.forImgBox.on("click", ".pre_btn", function () {
                        self.prev();
                        return false;
                    });
                    this.forImgBox.on("click", ".next_btn", function () {
                        self.next();
                        return false;
                    });
                    this.automatic(true);
                }
            });
        };
        
        right_position();
        bind();
    };

    var bind = function () {
        var $page = $("#page");
        $page.on("click", ".like", function () {
            var $this = $(this);
            $this.toggleClass("Ilike");
            if ($this.hasClass("Ilike")) {
                $this.replaceWith('<span class="like Ilike"><b class="iconfont Alike">&#xe60e;</b> 喜欢</span>');
            } else {
                $this.replaceWith('<span class="like"><b class="iconfont Alike">&#xe62b;</b> 喜欢</span>');
            };

            return false;
        });

        /* 右侧定位  */
        $(window).on("scroll", function () {
            right_position();
        });
        //加入帮社
        $page.on("click", ".chkin_cr", function () {
            crowd_data.join({
                communeId: global_setting.communeId,
                success: function (data) {
                    if (data.success) {

                    } else {

                    }
                },
                error: function () {
                    alert("系统繁忙！")
                }
            });
            return false;
        });

    };
    init();
});