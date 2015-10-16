/*
文本框下拉
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
     juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js");
    var _$ = function (j) {
        return j instanceof $ ? j : $(j);
    };
    var _getScrollTop = function () {
        var $body = $("body"), body = $body[0];
        return body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
    }
    var bind = function (op) {
        var $window = $(window), $body = $("body");
        $window.on("resize.downList", function () {
            $body.find(".input_downlist:visible").each(function () {
                var $this = $(this), _op = $this.data("createData"), _offset = _op.input.offset();
                if ($this.css("position") === "fixed") {
                    _offset.top = _offset.top - _getScrollTop() + _op.input.outerHeight();
                } else {
                    _offset.top = _offset.top + _op.input.outerHeight();
                }
                $this.css({
                    top: _offset.top,
                    left: _offset.left
                });
            });
        });
        //当resize被绑定后改变bind为正常的全局方法
        bind = function (op) {
            var $body = $("body"),
                self = this,
                _position,
                _parentH,
                _currH,
                $curr;
            if ($.browser.msie && $.browser.version) {
                this.$downBox[0].onselectstart = function () { return false };
            }
            this.$input.on("keydown", function (e) {
                if (e.keyCode == 38 || e.keyCode == 40) {
                    var $this = $(this), $deomBox = $body.find("#" + $this.attr("for")), $nextCurr/*下一个准备被激活的而不是指位子的下一个*/;
                    self.showDownList();
                    $curr = $deomBox.find("." + op.chkedClass);
                    if (!$curr.length) {
                        $curr = $deomBox.find("." + op.itemClass + ":eq(0)");
                        $curr.addClass(op.chkedClass);
                    } else {
                        $curr.removeClass(op.chkedClass);
                        $nextCurr = e.keyCode == 40 ? $curr.next() : $curr.prev();
                        if ($nextCurr.length) {
                            $nextCurr.addClass(op.chkedClass);
                        } else {
                            $deomBox.find("." + op.itemClass + (e.keyCode == 40 ? ":first" : ":last")).addClass(op.chkedClass);
                        }
                    }
                    $curr = $deomBox.find("." + op.chkedClass);
                    _position = $curr.position();
                    _currH=$curr.outerHeight();
                    _parentH = $deomBox.outerHeight();
                    if (_position.top < 0) {
                        $deomBox.scrollTop($deomBox.scrollTop() + _position.top);
                    }
                    if (_position.top + _currH > _parentH) {
                        $deomBox.scrollTop($deomBox.scrollTop() + (_position.top + _currH - _parentH));
                    }
                    typeof op.updownCallback === "function" && op.updownCallback.call(op.input, $deomBox.find("." + op.chkedClass));
                    return false;
                }
                if (e.keyCode == 13) {
                    self.hideDownList();
                }
            });
        }
        bind.call(this, op);
    }
    var downList = function (op) {
        var self = this;
        var _op = $.extend({
            input: null,
            chkedClass: "curr",
            itemClass: "input_downitem",
            updownCallback: function (v) {
                this.val(v.attr("data_text"));
            }
        }, op);
        var $body = $("body"), _id, _downBox, _downBoxId, _offset,
            _listItemModel = juicer(_op.listItemModel || '<ul>{@each list as item}<li class="' + _op.itemClass + '" data_text="${item.txt}">${item.txt}</li>{@/each}</ul>');
        if (!_op.input) {
            throw "parameter input wminputdown created can not be empty！"
            return false;
        }
        _op.input = _$(_op.input);
        if (!_op.input.length) {
            throw "wminputdown Element not found！"
            return false;
        }
        //检测结束
        _op.input.attr("autocomplete", "off");
        _offset = _op.input.offset();
        _id = _op.input.attr("id");
        if (!_id) {
            _id = "down_list_input" + parseInt(Math.random() * 999999);
            _op.input.attr("id", _id);
        }
        _downBoxId = _id + "_downbox";
        _op.input.attr("for", _downBoxId);
        this.$downBox = $('<div id="' + _downBoxId + '" class="input_downlist" for="' + _id + '"></div>');
        if (_op.position === "fixed") {
            _offset.top = _offset.top - _getScrollTop() + _op.input.outerHeight();
        } else {
            _offset.top = _offset.top + _op.input.outerHeight();
        }
        this.$downBox.css({
            'width': _op.width || (_op.input.outerWidth() - 2),
            'position': _op.position || "absolute",
            'z-index': _op.zIndex,
            'top': _offset.top,
            'left': _offset.left,
            'display':'none'
        });
        this.$downBox.data('instantiation', this);
        this.$downBox.data('createData', { input: _op.input });
        this.$input = _op.input;
        $body.append(this.$downBox);
        bind.call(this, _op);
        this.html = function (v) {
            if (v) {
                self.$downBox.empty().append(v)
            } else {
                return self.$downBox.html();
            }
            $(window).resize();
            return self;
        };
        this.append = function (data, callback) {
            self.$downBox.append(_listItemModel.render(data));
            $(window).resize();
            typeof callback === "function" && callback.call(self, _op);
            return self;
        };
        this.empty = function (callback) {
            self.$downBox.empty();
            $(window).resize();
            typeof callback === "function" && callback.call(self, _op);
            return self;
        };
        this.setModel = function (v) {
            if (typeof v === "string") {
                _listItemModel = juicer(v);
            }
            return self;
        };
        this.showDownList = function (callback) {
            self.$downBox.css("display", "block");
            $(window).resize();
            return self;
        };
        this.hideDownList = function () {
            self.$downBox.css("display", "none");
            return self;
        };
        typeof _op.callback === "function" && _op.callback.call(this);
    };
    exports.Create = function (op) {
        return new downList(op);
    }
});
