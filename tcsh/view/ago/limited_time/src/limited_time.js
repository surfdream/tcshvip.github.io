define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        lazyload = require('wmlazyload');
    var init = function () {
        $("body,html").scrollTop(0);
        lazyload.init();
        var $page = $("#page"), $pointTime = $page.find(".point_time");
        //初始化时间长轴
        var initAxis = function () {
            var _d = new Date(global_setting.serviceTicks),
            sDate = new Date(_d.getFullYear(), _d.getMonth(), _d.getDate(), 7, 0, 0),
            point_time = (_d.getTime() - sDate.getTime()) / 1000 / 60;
            $pointTime.animate({ "left": parseInt($pointTime.css("left")) + point_time - 5 }, 1000, function () {
                $pointTime.attr("title", _d.getHours() + ":" + _d.getMinutes() + ":" + _d.getSeconds());
                //时间轴红点移动，1px正好1分钟
                setInterval(function () {
                    $pointTime.css("left", parseInt($pointTime.css("left")) + 1);
                }, 60000);
                //维护红点的title
                setInterval(function () {
                    _d = new Date();
                    $pointTime.attr("title", _d.getHours() + ":" + _d.getMinutes() + ":" + _d.getSeconds());
                }, 1000);
            });

        };
        //初始化限时购每个场次
        var initItem = function () {
            var _d = new Date(global_setting.serviceTicks);
            var $item = $(".time_itme"), $dateEach;
            //下面所有计算，仅针对时间，所以getMonth方法使用过程未+1，如果后面维护 +1 了  这句注释记得干掉
            $item.each(function () {
                var $this = $(this), start_tim = $this.attr("start_time").split(':'), end_time = $this.attr("end_time").split(":"), _data;
                var _startTime = new Date(_d.getFullYear(), _d.getMonth(), _d.getDate(), start_tim[0], start_tim[1], 0).getTime(),
                    _endTime = new Date(_d.getFullYear(), _d.getMonth(), _d.getDate(), end_time[0], end_time[1], 59).getTime();
                if (_d.getTime() >= _startTime && _d.getTime() <= _endTime) {
                    $this.removeClass("disabled");
                    //结束时间-当前时间
                    _data = lib.turnTime(_endTime - _d.getTime());
                    $this.find(".axis_item_msg").data("data_tiem", _data).attr("dateeach", "剩余时间").empty().append('<i class="wm_ico horometer2"></i>剩余时间：' + _data.h + "小时" + _data.m + '分' + _data.s + '秒');
                } else {
                    if (_d.getTime() > _endTime) {
                        $this.find(".axis_item_msg").empty().append('<i class="wm_ico horometer2"></i>' + $this.attr("data_txt") + '，已结束，明天请早');
                    }
                    if (_d.getTime() < _startTime) {
                        //开始时间-当前时间
                        _data = lib.turnTime(_startTime - _d.getTime());
                        $this.find(".axis_item_msg").data("data_tiem", _data).attr("dateeach", "距离开始还有").empty().append('<i class="wm_ico horometer2"></i>距离开始还有：' + _data.h + "小时" + _data.m + '分' + _data.s + '秒');
                    }
                    $this.addClass("disabled");
                }
            });
            $dateEach = $("[dateeach]");
            setInterval(function () {
                $dateEach.each(function () {
                    var $this = $(this), _data = $this.data("data_tiem");
                    if (_data.s--) {
                        $this.empty().append('<i class="wm_ico horometer2"></i>' + $this.attr("dateeach") + '：' + _data.h + "小时" + _data.m + '分' + _data.s + '秒');
                    } else {
                        _data.s = 59;
                        if (_data.m--) {
                            $this.empty().append('<i class="wm_ico horometer2"></i>' + $this.attr("dateeach") + '：' + _data.h + "小时" + _data.m + '分' + _data.s + '秒');
                        } else {
                            _data.m = 59;
                            if (_data.h--) {
                                $this.empty().append('<i class="wm_ico horometer2"></i>' + $this.attr("dateeach") + '：' + _data.h + "小时" + _data.m + '分' + _data.s + '秒');
                            } else {
                                $this.removeAttr("dateeach");
                                $dateEach = $("[dateeach]");
                            }
                        }
                    }
                });
            }, 1000);
        };
        //初始化短轴
        var initMinor = function () {
            var $timeline = $(".timeline");
            var $minor = $('<div class="minor"></div>');
            var $item = $(".time_itme");
            $item.each(function () {
                var $this = $(this);
                var _offset = $this.offset();
                $minor.append('<a href="#" data_offtop="' + _offset.top + '" class="mionr_item ' + ($this.hasClass("disabled") ? "" : "hover") + '" data_txt="' + $this.attr("data_txt") + '"><b></b><span>' + $this.attr("data_txt") + '</span></a>');
            });
            $minor.css({ "left": $timeline.offset().left + $timeline.outerWidth() + 20, "top": $timeline.find(".timeline_axis").offset().top - 150 });
            $timeline.append($minor);
            $minor.find(".hover").click();
        };
        initAxis();
        initItem();
        bind();
        initMinor();
    };
    var bind = function () {

        var $win = $(window), $page = $("#page"), $body = $("body"), body = $body[0], $timeline_minor = $(".timeline_minor"), $minor;
        var _timelineOFfset = $page.find(".timeline").offset();
        $page.on("click", ".mionr_item", function () {
            var $this = $(this);
            $("body,html").animate({ scrollTop: $page.find(".time_itme[data_txt='" + $this.attr("data_txt") + "']").offset().top - 180 });
            return false;
        });
        
        //为了让IE6看起来不挫逼，加个动画，凸凸
        if ($.browser.msie && $.browser.version === "6.0") {
            $win.on("scroll.fixed", function () {
                var $this = $(this), t = Math.random() * 99999;
                $this.data("t", t);
                (function (t) {
                    setTimeout(function () {
                        if (t == $this.data("t")) {
                            var scrollTop = body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
                            $minor = $minor || $(".minor");
                            $minor.animate({ "top": scrollTop });
                        }
                    }, 500)
                })(t);
            });
        } else {
            $win.on("scroll.minor", function () {
                var scrollTop = body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
                var $addClass;
                $minor = $minor || $(".minor");
                //长轴效果
                if (scrollTop >= 150) {
                    $timeline_minor.addClass("fixed").css("left", _timelineOFfset.left);
                } else {
                    $timeline_minor.removeClass("fixed").css("left", 0);
                }
                //短轴效果
                $(".mionr_item").each(function () {
                    var $this = $(this);
                    if (scrollTop >= $this.attr("data_offtop") - 0 - 200) {
                        $addClass = $this;
                    }
                });
                $minor.find(".hover").removeClass("hover");
                $addClass ? $addClass.addClass("hover") : $minor.find(".mionr_item:eq(0)").addClass("hover");
            });
        }
    };
    init();
});
