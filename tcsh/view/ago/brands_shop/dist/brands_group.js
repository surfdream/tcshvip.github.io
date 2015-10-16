define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        lib = require('lib'),
        lazyload = require('wmlazyload');
    var init = function () {
        var $page = $("#page"),
            $brands_box = $page.find(".brands_box"),
            $countdown_box = $page.find(".countdown_box"),
            _serviceTicks = global_setting.serviceTicks,
            serviceTicks = new Date(_serviceTicks);
        lazyload.init();
        $brands_box.find(".b_item").each(function () {
            var $this = $(this), _d, _dobj;
            if ($this.attr("no_end")) {
                $this.find(".b_end_date").empty().append("永久开放");
            } else {
                _d = new Date($this.attr("data_y") - 0, $this.attr("data_m") - 0 - 1, $this.attr("data_d") - 0, 23, 59, 59);
                if (_d.getTime() - _serviceTicks > 0) {
                    _dobj = lib.turnTime(_d.getTime() - _serviceTicks);
                    $this.find(".b_end_date").addClass("setinterval_date").data("dobj", _dobj).empty().append("剩余时间：" + _dobj.d + "天" + _dobj.h + "小时" + _dobj.m + "分" + _dobj.s + "秒");
                }
                else {
                    $this.remove();
                }
            }
        });
        $countdown_box.find(".b_item").each(function () {
            //下面所有计算，仅针对时间，所以getMonth方法使用过程未+1，如果后面维护 +1 了  这句注释记得干掉
            var $this = $(this),
                _d = new Date(_serviceTicks),
                _end_date = new Date(_d.getFullYear(), _d.getMonth(), _d.getDate(), 23, 59, 59),
                _show_date = lib.turnTime(_end_date.getTime() - _serviceTicks);
            $this.find(".countdown_end_date").data("dobj", _show_date).empty().append("剩余时间：" + _show_date.h + "小时" + _show_date.m + "分" + _show_date.s + "秒");
        });
        setInterval(function () {
            var _data, str;
            $brands_box.find(".setinterval_date").each(function () {
                var $this = $(this), _data = $this.data("dobj");
                if (_data.s--) {
                    $this.empty().append('剩余时间：' + _data.d + '天' + _data.h + "小时" + _data.m + '分' + _data.s + '秒');
                } else {
                    _data.s = 59;
                    if (_data.m--) {
                        $this.empty().append('剩余时间：' + _data.d + '天' + _data.h + "小时" + _data.m + '分' + _data.s + '秒');
                    } else {
                        _data.m = 59;
                        if (_data.h--) {
                            $this.empty().append('剩余时间：' + _data.d + '天' + _data.h + "小时" + _data.m + '分' + _data.s + '秒');
                        } else {
                            $this.removeClass("setinterval_date");
                        }
                    }
                }
            });
            if ($countdown_box.find(".countdown_end_date").length) {
                _data = $countdown_box.find(".countdown_end_date:eq(0)").data("dobj");
                if (_data.s--) {
                    str = '剩余时间：' + _data.h + "小时" + _data.m + '分' + _data.s + '秒'
                } else {
                    _data.s = 59;
                    if (_data.m--) {
                        str = '剩余时间：' + _data.h + "小时" + _data.m + '分' + _data.s + '秒'
                    } else {
                        _data.m = 59;
                        if (_data.h--) {
                            str = '剩余时间：' + _data.h + "小时" + _data.m + '分' + _data.s + '秒'
                        } else {
                            str = "";
                        }
                    }
                }
                $countdown_box.find(".countdown_end_date").empty().append(str);
            }
        }, 1000);
        bind();
    };
    var bind = function () {
        var $page = $("#page");
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
        }
    };
    init();
});