/*
拖拽
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js");
    //var ie67 = ($.browser.msie && parseInt($.browser.version, 10) <= 7) ? true : false;
    var wmmove = function (op) {
        var self = this;
        var _op = $.extend({
            moveEle: ".wmmove",
            event: 'mousedown',
            parentEle: ".wmmoveparent",
            moveOffset: { top: 0, left: 0 },
            mousemoveCallback: function () { }
        }, op);
        var nomove = false;
        var init = function () {
            var _w, _h;
            self.$moveBox.css({ "position": "absolute" });
            _w = self.$moveBox.outerWidth();
            _h = self.$moveBox.outerHeight();
            bind();
        };
        var bind = function () {
            var $body = $("body");
            if (_op.event === "mousedown") {
                self.$moveBox.on("mousedown.wmmove", function (e) {
                    var $this = $(this), _offset;
                    self.isDown = true;
                    _offset = $this.offset();
                    self.mouseParentX = e.pageX - _offset.left;
                    self.mouseParentY = e.pageY - _offset.top;
                });
                $body.on("mouseup.wmmove", function () {
                    self.isDown = false;
                });
            } else {
                self.isDown = true;
                self.mouseParentX = self.$moveBox.outerWidth() / 2;
                self.mouseParentY = self.$moveBox.outerHeight() / 2;
                //self.stop = true;
            }
            $body.on("mousemove.wmmove", function (e) {
                if (!self.isDown) { return; }
                if (self.stop) { return; }
                var $this = self.$moveBox;
                var _pageX = e.pageX, _pageY = e.pageY, _top, _left, _parentOffset, _parentW, _parentH, _w, _h, _thisPosition;
                _top = _pageY - self.mouseParentY;
                _left = _pageX - self.mouseParentX;
                if (self.$moveParentBox.length) {
                    //父级容器对于窗口的偏移值
                    _parentOffset = self.$moveParentBox.offset();
                    //父级容器宽高
                    _parentW = self.$moveParentBox.outerWidth();
                    _parentH = self.$moveParentBox.outerHeight();
                    //移动框宽高
                    _w = $this.outerWidth();
                    _h = $this.outerHeight();
                    //
                    _top = _top < _parentOffset.top ? _parentOffset.top : _top;
                    _left = _left < _parentOffset.left ? _parentOffset.left : _left;

                    _top = _top + _h > _parentOffset.top + _parentH ? _parentOffset.top + _parentH - _h : _top;
                    _left = _left + _w > _parentOffset.left + _parentW ? _parentOffset.left + _parentW - _w : _left;
                }
                _top = _top + (_op.moveOffset.top || 0);
                _left = _left + (_op.moveOffset.left || 0);
                $this.css({ top: _top, left: _left });
                typeof _op.mousemoveCallback === "function" && _op.mousemoveCallback.call(self, { pageX: _pageX, pageY: _pageY });
            });
        };
        this.$moveBox = $(_op.moveEle);
        this.$moveParentBox = $(_op.parentEle);
        this.$movemask = undefined;
        this.isDown = false;
        this.mouseParentX = 0;
        this.mouseParentY = 0;
        this.stop = false;
        init();
    };
    exports.create = function (op) {
        return new wmmove(op);
    }
});