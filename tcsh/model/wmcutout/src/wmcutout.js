/*
截取图片
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        wmmove = require('../../wmmove/dist/wmmove.js'),
        wmwmchangewh = require("../../wmchangewhbox/dist/wmchangewhbox.js");
    var cutout = function (op) {
        var self = this;
        var _move;
        var _op = $.extend({
            parentBox: '.cutout_parent',
            cutoutRangeEle: ".cutout_range",
            cutoutSourceEle: ".cutout_source",
            cutoutLimitEle: '.cutout_limit',
            cutoutPreviewEle: '.previewitem',
            changewh: false
        }, op);
        var preview = function () {
            var _this = this;
            //var _position = this.$changeBox.position();
            var __w = self.$cutoutSource.width(), __h = self.$cutoutSource.height();
            self.$cutoutPreview.each(function () {
                var $cloneimg = $(this).data("imgClone");
                var b1 = __w / $cloneimg.width(), b2 = __h / $cloneimg.height;
                var x1 = __w / __h;
                $cloneimg.css({
                    "margin-top": -(_this.position.top / b2),
                    "margin-left": -(_this.position.left / b1)
                });
            });
        };
        var _cutoutSourceChange = function () {
            var _w, _h, _max, _min;
            self.$cutoutSource.width('auto');
            self.$cutoutSource.height('auto');
            _w = self.$cutoutSource.outerWidth(),
            _h = self.$cutoutSource.outerHeight(),
            _max = Math.max(_w, _h);
            if (_max === _w) {
                self.$cutoutSource.width(self.maxWidth - 2);
            }
            if (_max === _h) {
                self.$cutoutSource.height(self.maxHeight - 2);
            }
            _w = self.$cutoutSource.width();
            _h = self.$cutoutSource.height();
            self.$cutoutSource.width(_w);
            self.$cutoutSource.height(_h);
            self.$cutoutLimit.width(_w);
            self.$cutoutLimit.height(_h);
            _min = Math.min(_w, _h);
            self.$cutoutRange.width(_min);
            self.$cutoutRange.height(_min);
            self.limit = _min;
        };
        var init = function () {           
            _move = wmmove.create({
                moveEle: _op.cutoutRangeEle,
                parentEle: _op.cutoutLimitEle,
                moveOffset: { top: -21, left: -21 },
                event: _op.event,
                mousemoveCallback: function () {
                    var _this = this;
                    var _position = this.$moveBox.position();
                    preview.call({
                        position: _position,
                        width: _this.$moveBox.width(),
                        height: _this.$moveBox.height()
                    });
                }
            });
            if (_op.changewh) {
                wmwmchangewh.create({
                    changeEle: _op.cutoutRangeEle,
                    paeentBox: _op.cutoutLimitEle,
                    changeBtnDownCallback: function () {
                        _move.stop = true;
                    },
                    changeBtnUpCallback: function () {
                        _move.stop = false;
                    },
                    changePX: function () {
                        var _this = this;
                        var _parentW, _parentH, _w, _h, _x;
                        _x = (this.pageX - this.offsetX - this.outerWidth) + (this.pageY - this.offsetY - this.outerHeight);
                        _w = _this.width + _x / 2, _h = _this.height + _x / 2;
                        _parentW = _this.$paeentBox.outerWidth();
                        _parentH = _this.$paeentBox.outerHeight()
                        if (_this.parentTop + _h > _parentH) {
                            _w = _h = _parentH - _this.parentTop;
                        }
                        if (_this.parentLeft + _w > _parentW) {
                            _h = _w = _parentW - _parentLeft;
                        }
                        return {
                            Width: _w,
                            Height: _h
                        }
                    },
                    changeBtnMousemoveCallback: function () {
                        var _this = this;
                        var _position = this.$changeBox.position();
                        preview.call({
                            position: _position,
                            width: _this.width,
                            height: _this.height
                        });
                    }
                });
            }
            bind();
        };
        var bind = function () {
            self.$cutoutSource.load(function () {
                _cutoutSourceChange();
                var _w, _h, _min, _b;
                _w = self.$cutoutSource.width();
                _h = self.$cutoutSource.height();
                _min = Math.min(_w, _h);
                _b = _w / _h;
                self.$cutoutPreview.each(function () {
                    var $this = $(this);
                    var $imgClone = self.$cutoutSource.clone();
                    var _imgCloneW = _w, _imgCloneH = _h;
                    var _thisW = $this.width(), _thisH = $this.height(), _thismin = Math.min(_thisH, _thisW), _b1, b2;
                    if (_thisW < _w && _thisH < _h) {
                        _imgCloneW = _imgCloneW * (_thisW / _imgCloneW);
                        _imgCloneH = _imgCloneW * (_thisH / _imgCloneH);
                    }
                    if (_thisW > _w) {
                        _imgCloneW = _thisW;
                        _imgCloneH = _imgCloneW / _b;
                    } else {

                    }
                    if (_thisH > _imgCloneH) {
                        _imgCloneH = _thisH;
                        _imgCloneW = _imgCloneH * _b;
                    }
                    $imgClone.css({
                        width: _imgCloneW,
                        height: _imgCloneH
                    });
                    $this.data("imgClone", $imgClone);
                    $this.empty().append($imgClone);
                });
            });
            self.$cutoutSource.load();
        };
        this.$parentBox = $(_op.parentBox);
        this.$cutoutRange = $(_op.cutoutRangeEle);
        this.$cutoutPreview = $(_op.cutoutPreviewEle);
        this.$cutoutLimit = this.$cutoutRange.closest(_op.cutoutLimitEle);
        this.$cutoutSource = this.$parentBox.find(_op.cutoutSourceEle);
        this.maxWidth = this.$parentBox.width();
        this.maxHeight = this.$parentBox.height();
        this.limit = 0;
        this.setCutoutSource = function (op) {
            if (!op) { return false; }
            if (typeof op.src === "string") {
                self.$cutoutSource.attr("src", op.src);
                self.$cutoutSource.load();
            }
        };
        this.stop = function (tf) {
            _move.stop = tf;
        };
        init();
    };
    exports.create = function (op) {
        return new cutout(op);
    };
});