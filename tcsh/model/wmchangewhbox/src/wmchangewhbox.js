/*
文本框拉伸
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js");

    var wmchangewhbox = function (op) {
        var self = this;
        var _op = $.extend({
            changeEle: ".wmchangewhbox",
            paeentBox: '.changeboxparent',
            changeBtnDownCallback: function () { },
            changeBtnUpCallback: function () { },
            changeBtnMousemoveCallback: function () { },
            changePX: function () { }
        }, op);
        var init = function () {
            self.$changeBox.css("position") == "static" && self.$changeBox.css("position", "relative");
            self.$changeBtn = $('<a href="#" class="changebtn" style="cursor:se-resize;display: block; position: absolute; width: 5px; height: 5px; border: 1px solid #999; bottom: -4px; right: -4px; background: #fff; "></a>');
            self.$changeBox.append(self.$changeBtn);
            bind();
        };
        var bind = function () {
            var $body = $("body");
            self.$changeBtn.on("mousedown", function () {
                self.stop = false;
                typeof _op.changeBtnDownCallback === "function" && _op.changeBtnDownCallback.call(self);
            });
            $body.on("mouseup", function () {
                self.stop = true;
                typeof _op.changeBtnUpCallback === "function" && _op.changeBtnUpCallback.call(self);
            });
            $body.on("mousemove.changewhbox", function (e) {
                var _pageX, _pageY, _w, _h, _offset, _endw, _endh, _endfun, _position, _parentOffset, _parentW, _parentH;
                if (self.stop) { return };
                _pageX = e.pageX, _pageY = e.pageY;
                _offset = self.$changeBox.offset();
                _w = self.$changeBox.outerWidth();
                _h = self.$changeBox.outerHeight();
                if (self.$paeentBox.length) {
                    _parentOffset = self.$paeentBox.offset()
                    _position = {
                        top: _offset.top - _parentOffset.top,
                        left: _offset.left - _parentOffset.left
                    };
                }
                if (typeof _op.changePX === "function") {
                    _endfun = _op.changePX.call({
                        pageY: _pageY,
                        pageX: _pageX,
                        offsetY: _offset.top,
                        offsetX: _offset.left,
                        parentTop: _position.top,
                        parentLeft: _position.left,
                        width: self.$changeBox.width(),
                        height: self.$changeBox.height(),
                        outerWidth: _w,
                        outerHeight: _h,
                        $changeBox: self.$changeBox,
                        $paeentBox: self.$paeentBox,
                        $changeBtn: self.$changeBtn,
                        stop: self.stop
                    });
                }
                _endw = (_endfun && _endfun.Width) || (_pageX - _offset.left - _w + self.$changeBox.width());
                _endh = (_endfun && _endfun.Height) || (_pageY - _offset.top - _h + self.$changeBox.height());
                if (self.$paeentBox.length) {
                    _parentOffset = self.$paeentBox.offset()
                    _parentW = self.$paeentBox.outerWidth();
                    _parentH = self.$paeentBox.outerHeight();
                    if (_endw + _position.left > _parentW) {
                        _endw = _parentW - _position.left - 2;
                    }
                    if (_endh + _position.top > _parentH) {
                        _endh = _parentH - _position.top - 2;
                    }
                }
                self.$changeBox.width(_endw);
                self.$changeBox.height(_endh);
                typeof _op.changeBtnMousemoveCallback === "function" && _op.changeBtnMousemoveCallback.call({
                    $changeBox: self.$changeBox,
                    width: self.$changeBox.width(),
                    height: self.$changeBox.height()
                });
            });
        };
        this.$changeBox = $(_op.changeEle);
        this.$paeentBox = this.$changeBox.closest(_op.paeentBox);
        this.$changeBtn;
        this.stop = true;
        init();
    }
    exports.create = function (op) {
        return new wmchangewhbox(op);
    }
});