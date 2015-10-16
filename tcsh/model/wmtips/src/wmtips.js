/*
泡泡
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    require('../../wmtips/css/style.css');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
     juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js");
    var tips = function (op) {
        var self = this;
        var _op = $.extend({
            ele: 'body',
            con: '',
            skin: 'yellow1',
            width: '',
            height: '',
            close: false,
            offset: {},
            direction: 'br',
            callBack: undefined,
            minIndex: 2000
        }, op);
        var _html = juicer([
            '<div class="wm_tips ${skin} ${direction}" data-direction="${direction}" style="z-index:${minIndex}">',
                '<div class="wm_tips_per ">',
                    '<div class="tips_arrow "><em>◆</em><span>◆</span></div>',
                    '<div class="wm_tips_con"></div>',
                    '<div class="close"><a href="#">×</a></div>',
                '</div>',
            '</div>'
        ].join(''));
        //创建
        var create = function () {
            self.$this = $(_op.ele);
            _op.minIndex = _op.minIndex + $(".wm_tips").length;
            self.$tipsBox = $(_html.render(_op));
            self.$tipsBox.on("click", ".close", function () {
                self.hide();
                return false;
            });
            self.$tipsCon = self.$tipsBox.find(".wm_tips_con");
            $per = self.$tipsBox.find('.wm_tips_per');
            self.$tipsCon.empty().append(_op.con);
            $("body").append(self.$tipsBox);
            self.position();
            typeof _op.callBack === "function" && _op.callBack.call(self);
        };
        this.$tipsBox, this.$tipsCon, this.$this;
        this.isShow = false;
        var $per, isAend = true;;
        //显示
        this.show = function (callback) {
            !self.$tipsBox && create();
            if (!isAend) return;
            isAend = false;
            self.position();
            self.$tipsBox.fadeIn(function () {
                isAend = true;
            });
            self.isShow = true;
            if (_op.close) {
                setTimeout(function () {
                    self.hide();
                }, _op.close)
            }
            return self;
        };
        /*
        隐藏和关闭，酌情使用
        会重复显示的建议使用隐藏，显示
        仅显示1次，显示之后建议直接关闭
        合理使用
        */
        //隐藏
        this.hide = function (callback) {
            if (!isAend) return;
            isAend = false;
            self.$tipsBox.fadeOut(function () {
                isAend = true;
            });
            self.isShow = false;
            return self;
        };
        //关闭（清除dom）
        this.close = function (callback) {
            self.hide();
            self.$tipsBox.remove();
            self.$tipsBox = undefined;
            this.isShow = false;
            typeof callback === "function" && callback.call(self);
            return self;
        };
        //定位
        this.position = function (key) {
            var _offset = self.$this.offset(),
                _width = self.$this.outerWidth(),
                _height = self.$this.outerHeight(),
                _box_width = self.$tipsBox.outerWidth(),
                _box_height = self.$tipsBox.outerHeight();
            var _key = key || self.$tipsBox.attr("data-direction");
            if (_op.offset && _op.offset.top) {
                _offset.top += (_op.offset.top - 0 || 0);
            }
            if (_op.offset && _op.offset.left) {
                _offset.left += (_op.offset.left - 0 || 0);
            }
            var _css = {
                "br": { top: _offset.top + _height, left: _offset.left + _width - 25 },
                "bc": { top: _offset.top + _height, left: _offset.left + _width / 2 - _box_width / 2 },
                "bl": { top: _offset.top + _height, left: _offset.left - _box_width + 24 },
                "tr": { top: _offset.top - _box_height, left: _offset.left + _width - 25 },
                "tc": { top: _offset.top - _box_height, left: _offset.left + _width / 2 - _box_width / 2 },
                "tl": { top: _offset.top - _box_height, left: _offset.left - _box_width + 24 },
                "lt": { top: _offset.top - 7, left: _offset.left - _box_width - 7 },
                "lc": { top: _offset.top - _box_height / 2 + 7, left: _offset.left - _box_width - 7 },
                "lb": { top: _offset.top - _box_height + _height + 7, left: _offset.left - _box_width - 7 },
                "rt": { top: _offset.top - 7, left: _offset.left + _width - 7 },
                "rc": { top: _offset.top - _box_height / 2 + 7, left: _offset.left + _width + 7 },
                "rb": { top: _offset.top - _box_height + _height + 7, left: _offset.left + _width + 7 }
            }
            if (_css[_key]) {
                self.$tipsBox.css(_css[_key]);
            } else {
                self.$tipsBox.addClass('br').attr("data-direction", "br");
                self.$tipsBox.css(_css["br"]);
            }
            return self;
        };
        //设置内容
        this.setCon = function (con, callback) {
            !self.$tipsBox && create();
            self.$tipsCon.empty().append(con);
            typeof callback === "function" && callback();
            return self;
        };
        create();
    };
    return tips;

});