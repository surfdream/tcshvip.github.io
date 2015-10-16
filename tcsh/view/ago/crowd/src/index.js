define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
        friend = require("friend"),
        search_crowd = require('search_crowd'),
        crowd_data = require('crowd_data'),
        lazyload = require('lazyload')
    ;

    /* 右侧定位方法  */
    var $page = $("#page"),
        $body = $("body"),
        $right = $page.find(".main_con_right"),
        $left = $page.find(".main_con_left"),
        $shopping = $right.find(".shopping"),
        _shopping_top = $shopping.offset().top + $shopping.outerHeight()
    ;
    var right_position = function () {
        var _wleft = $left.outerWidth(true),
            _oleft = $left.offset().left,
            _bottom_top = $page.find(".bottom").offset().top,
            scrollTop = $body[0].scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0,
            _scroll_top = scrollTop + $(window).height()
        ;
        if (_shopping_top < _scroll_top && _scroll_top <= _bottom_top) {
            $right.css({
                "position": "fixed",
                "bottom": "0",
                "left": _wleft + _oleft
            });
        }else if (scrollTop < _shopping_top) {
            $right.css({
                "position": "static"
            });
        }else {
            $right.css({
                "position": "absolute",
                "bottom": "50px",
                "right": "0",
                "left": "auto"
            });
        }

    };


    var init = function () {
        var $page = $("#page");

        lazyload.init();

        bind();
        right_position();
    };

    var bind = function () {
        var $page = $("#page"),
            $commune_tab = $page.find(".commune_tab");

        /* tab  */
        $page.on("click", ".commune_tab_title_item", function () {
            var $this = $(this);
            $commune_tab.find(".commune_tab_title_item.tab_item_cur").removeClass("tab_item_cur");
            $this.addClass("tab_item_cur");
            $commune_tab.find(".commune_tab_con").css("display", "none").eq($this.index()).css("display", "block");
            return false;
        });
        /* 加入公社  */
        $page.on("click", ".join_commune", function () {
            var $this = $(this),
                _thisBox = $this.data("thisBox")
            ;
            if (!_thisBox) {
                _thisBox = search_crowd.createBox();
                $this.data("thisBox", _thisBox);
            }
            _thisBox.show();
            return false;
        });
        /* 关注  */
        $page.on("click", ".m_focus", function () {
            var $this = $(this);
            $this.toggleClass("d_focus");
            if ($this.hasClass("d_focus")) {
                friend.focusFriend({
                    focus_id: $this.closest(".friend").attr("data_id"),
                    success: function () {
                        $this.find(".cancel").removeClass("dis_none");
                        $this.find(".cancel").siblings("span").addClass("dis_none");
                    },
                    error: function () {
                        alert("系统繁忙，请稍后再试！");
                    }
                });
            } else {
                var _arr = [],
                    _id = $this.closest(".friend").attr("data_id")
                ;
                _arr.push(_id);
                friend.delFocusFriend({
                    ids: _arr,
                    success: function () {
                        $this.find(".cancel").addClass("dis_none");
                        $this.find(".cancel").siblings("span").removeClass("dis_none");
                    },
                    error: function () {
                        alert("系统繁忙，请稍后再试！");
                    }
                });
            };
            return false;
        });
        /* 帮会资料 */
        $page.on("click", ".commune_detail_infor", function () {
            crowd_data.showBox();
            return false;
        });
        /* 右侧定位  */
        $(window).on("scroll.crowd", function () {
            right_position();
        });
    };
    init();
});