/* --自定义滚动条，还不能用-- */
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    require("../css/style.css#");
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        move = require("http://s.tcsh.me/tcsh/model/wmmove/dist/wmmove.js");
    require('http://s.tcsh.me/tcsh/model/seajs_jqueryui/development-bundle/ui/jquery.mousewheel.js')($);
    var _$ = function (ele) {
        if (typeof ele === "string") {
            return $(ele);
        }
        return ele;
    };
    var _createScroll = function (op) {
        var self = this;
        var $ele = _$(op.ele),
            _eleH, _eleW,
            _sliderH, _sliderW,
            _slider_proportion,
            _scroll_mainH,
            _move;
        this.$ele = $ele.clone(true);
        this.$box = $('<div class="wm_scroll_box" unselectable="on"  style="-moz-user-select:none;-webkit-user-select:none;" onselectstart="return false;"><div class="scroll_con_main"></div><div class="scroll_main"><div class="slider"></div></div>');
        this.$con_main = this.$box.find(".scroll_con_main");
        this.$slider = this.$box.find(".slider");
        this.$box.find(".scroll_con_main").append(this.$ele);
        _eleW = $ele.outerWidth();
        _eleH = $ele.outerHeight();
        this.$box.css({
            height: _eleH,
            width: _eleW,
            overflow: "hidden"
        });
        this.$con_main.css({
            height: _eleH,
            width: _eleW,
            overflow: "hidden"
        });
        this.$ele.css({
            height: "auto",
            width: "auto",
            overflow: "visible"
        });
        $ele.replaceWith(this.$box);
        _scroll_mainH = this.$box.find(".scroll_con_main").outerHeight();
        _slider_proportion = this.$ele.outerHeight() / this.$box.outerHeight();
        _sliderH = this.$box.outerHeight() / _slider_proportion;
        this.$slider.css({
            height: _sliderH
        });
        this.$ele.on("mousewheel", function (e) {
            var _top;
            _move.isDown = false;
            e.stopPropagation();
            if (e.originalEvent.wheelDelta > 0) {
                _top = (parseFloat(self.$slider.css("top")) || 0) - self.$slider.outerHeight();
                self.$slider.css({
                    top: _top > 0 ? _top : 0
                });
            } else {
                _top = (parseFloat(self.$slider.css("top")) || 0) + self.$slider.outerHeight();
                _top = _top + self.$slider.outerHeight() > _scroll_mainH ? _scroll_mainH - self.$slider.outerHeight() : _top
                self.$slider.css({
                    top: _top
                });
            }
            self.$con_main.scrollTop(_top * _slider_proportion);
            return false
        });
        _move = move.create({
            moveEle: self.$slider,
            parentEle: self.$slider.parent(),
            mousemoveCallback: function (data) {

                self.$con_main.scrollTop(this.$moveBox.position().top * _slider_proportion);

            }
        });
    };
    exports.scroll = function (op) {
        return new _createScroll(op);
    };
});
