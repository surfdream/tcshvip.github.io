/*
弹窗
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    require("../css/style.css#");
    require("../../../view/public/wm_btn/css/style.css#");
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
     juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js");
    //判断IE6
    var isIE6 = $.browser.msie && $.browser.version === "6.0";
    var hasBox = false;
    //初始化固定，记住 只有IE6那鸟货才有这动画....
    var initFixed = function () {
        if (isIE6) {
            hasBox = true;
            var $win = $(window), $body = $("body"), body = $body[0], _windowH = $win.height();
            $win.on("scroll.fixed", function () {
                var $this = $(this), t = Math.random() * 99999;
                $this.data("t", t);
                (function (t) {
                    setTimeout(function () {
                        if (t == $this.data("t")) {
                            var self = $("body > .fixed_box:visible");
                            if (self.length) {
                                var scrollTop = body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
                                var _top = _windowH / 2 - self.outerHeight() / 2;
                                self.css("margin-top", 0);
                                self.animate({ "top": scrollTop + _top });
                            }
                        }
                    }, 500)
                })(t);
            });
        }
    };
    //弹层基类
    var boxy_base = function () {
        var _wmBox, _mask, self = this;
        this.create = function (options, callBack) {
            var _opacity = options._opacity || "0.5";
            var mask = '<div class="wmBox-mask"style="display:block; top: 0; bottom: 0; left: 0; right: 0; z-index: 1000; background-color: #000; filter: alpha(opacity=' + _opacity * 100 + '); opacity:' + _opacity + '; position: fixed;  _position: absolute;zoom: 1;_height:' + $("body").height() + '"><iframe class="sdialog-mask-iframe" style="display: none; _display: block; width: 100%; height: 100%; filter: alpha(opacity=0); opacity: 0;" frameborder="0" src="javascript:\'\';"></iframe></div>';
            var self = this;
            var _body = $("body");
            var _zindex = $(".wmBox").length + (options.basezIndex || 10001);
            self.zIndex = _zindex;
            _wmBox = $(this._html.render(options));
            _body.append(_wmBox);
            _mask = $(mask);
            _mask.click(function (event) {
                event.preventDefault();
                event.stopPropagation()
            });
            _mask.mousemove(function (event) {
                event.preventDefault();
                event.stopPropagation()
            });
            _wmBox.css("z-index", _zindex + 1);
            _mask.css("z-index", _zindex);
            self.mask = _mask;

            typeof callBack === "function" && callBack(_wmBox, _mask);
            options.mask && _body.append(_mask);
            _wmBox.on("click", ".sure,.close", function (event) {
                self.close();
                event.preventDefault();
            });
            _wmBox.on("click", ".hide", function (event) {
                self.hide();
                event.preventDefault();
            });
            _wmBox.on("click", ".sure", function (event) {
                if (typeof options.sureCallBack === "function") {
                    options.sureCallBack.call(self);
                }
                event.preventDefault();
            });
            _wmBox.on("click", ".wm_btn_item", function (event) {
                var $this = $(this), _i = $this.attr("dataindex");
                if (options.btns && typeof options.btns[_i].callback === "function") {
                    options.btns[_i].callback.call(self, $this);
                }
                event.preventDefault();
            });
            _wmBox.css({ "paddingBottom": _wmBox.find(".wmBox-botton").outerHeight() + 10 });
            _wmBox.on("click.stopPropagation", function (event) {
                event.stopPropagation();
            });
            _wmBox.mousemove(function (event) {
                event.stopPropagation();
            });
            return _wmBox;
        }
        this.show = function () {

        };
        this.hide = function () {
            _wmBox.fadeOut();
            _mask.fadeOut();
        };
        this.close = function (callback) {
            _wmBox.fadeOut(function () {
                $(this).remove();
                typeof callback === "function" && callback();
            });
            _mask.fadeOut(function () {
                $(this).remove();
            });
        };
        this.position = function () {

        };
        this.setCon = function (_html) {
            _wmBox.find(".wmBox-content").empty().append(_html);
            return self;
        };
        this.setIndex = function (zindex) {

        }
    };
    //创建alert方法
    var _alert = function (options, callback) {
        var self = this, _options, _wmBox, cssObj;
        this._html = juicer([
            '<div class="wmBox ${boxCls} fixed_box" id="${boxId}">',
                '<div class="wmBox-head">',
                    '<h3 class="wmBox-title">${titleText}</h3>',
                    '<a class="close" href="javascript:void(0);">&times;</a>',
                '</div>',
                '<div class="wmBox-content"></div>',
                '<div class="wmBox-botton">',
                    '{@each btns as btnsitem,i}',
                    '<a class="wm_btn_item ui_btn ${btnsitem.cls} ${btnsitem.res}" href="#" dataindex="${i}"><span class="ui_btn_txt">${btnsitem.text}</span></a>',
                    '{@/each}',
                '</div>',
            '</div>'
        ].join(''));
        _options = $.extend({
            "titleText": "系统提示",
            "content": "",
            "mask": true,
            "btns": [
                { cls: "ui_btn_h23red6", res: "sure", text: "确定" }
            ]
        }, options);
        _options.callback = options ? options.callback || callback : undefined;
        this.wmBox = _wmBox = this.create(_options, function (_wmBox, _mask) {
            _wmBox.find('.wmBox-content').append(_options.content);
        });
        if (isIE6) {
            cssObj = { "zoom": 1, "width": _wmBox.outerWidth() }
            _wmBox.find(".wmBox-head").css(cssObj);
            _wmBox.find(".wmBox-botton").css(cssObj);

        }
        this.position = function () {
            self.wmBox.css({
                "marginTop": -(_wmBox.outerHeight() / 2) + "px",
                "marginLeft": -(_wmBox.outerWidth() / 2) + "px"
            });
        };
        this.show = function (callback) {
            self.wmBox.show();
            self.mask.css("display", "block");
            self.position();
            typeof callback === "function" && callback();
        };
        this.setTitle = function (txt) {
            self.wmBox.find(".wmBox-title").empty().append(txt);
        };
        this.close = function (callback) {
            self.wmBox.fadeOut(function () {
                $(this).remove();
                typeof callback === "function" && callback();
            });
            self.mask.fadeOut(function () {
                $(this).remove();
            });
        };
        this.hide = function () {
            self.wmBox.fadeOut();
            self.mask.fadeOut();
        };
        this.setIndex = function (zindex) {
            self.wmBox.css("z-index", zindex + 1);
            self.mask.css("z-index", zindex);
        }
        typeof _options.callback === "function" && _options.callback.call(this);
        this.wmBox.attr("top", this.wmBox.css("top"));
        !hasBox && initFixed();
        hasBox && isIE6 && $(window).scroll();
    };
    _alert.prototype = new boxy_base();
    //创建依赖弹窗方法
    var _relyBox = function (options, callback) {
        var self = this, _options, _wmBox, cssObj, relyOffset, $win, scrollLeft, scrollTop;
        if (!options.rely) {
            throw "relyBox rely parameter is null or undefined";
        }
        this.rely = $(options.rely);
        $win = $(window);
        scrollLeft = $win.scrollLeft();
        scrollTop = $win.scrollTop();
        relyOffset = this.rely.offset();
        this._html = juicer([
            '<div class="wmBox wm_relyBox ${boxCls}" id="${boxId}">',
                '<div class="wmBox-content"></div>',
                '<div class="wmBox-botton">',
                    '{@each btns as btnsitem,i}',
                    '<a class="wm_btn_item ui_btn ${btnsitem.cls} ${btnsitem.res}" href="#" dataindex="${i}"><span class="ui_btn_txt">${btnsitem.text}</span></a>',
                    '{@/each}',
                '</div>',
            '</div>'
        ].join(''));
        this.show = function (callback) {
            self.position();
            _wmBox.show();
            typeof callback === "function" && callback.call(self);
        };
        _options = $.extend({
            "content": "",
            "mask": false,
            "offset": {
                top: 0,
                left: 0
            },
            "btns": [
                { cls: "ui_btn_h22red10", res: "sure", text: "确定" },
                { cls: "ui_btn_h22gray6", res: "close", text: "取消" }
            ]
        }, options);
        _options.callback = options ? options.callback || callback : undefined;
        this.wmBox = _wmBox = this.create(_options, function (_wmBox, _mask) {
            _wmBox.find('.wmBox-content').append(_options.content);
        });
        if (isIE6) {
            cssObj = { "zoom": 1, "width": _wmBox.outerWidth() }
            _wmBox.find(".wmBox-botton").css(cssObj);

        }
        this.position = function () {
            scrollLeft = $win.scrollLeft();
            scrollTop = $win.scrollTop();
            relyOffset = this.rely.offset();
            var _left = relyOffset.left - (_options.offset.left || 0);
            if (_left + _wmBox.outerWidth() > $("body").outerWidth()) {
                _left = relyOffset.left - _wmBox.outerWidth() + self.rely.outerWidth();
            }
            _wmBox.css({
                "marginTop": "0px",
                "marginLeft": "0px",
                "top": relyOffset.top + self.rely.outerHeight() + 5 + (_options.offset.top || 0),
                "left": _left - scrollLeft
            });
        };
        this.hide = function () {
            self.wmBox.fadeOut();
        };
        this.close = function (callback) {
            self.wmBox.fadeOut(function () {
                $(this).remove();
                typeof callback === "function" && callback();
            });
        };
        this.setIndex = function (zindex) {
            self.wmBox.css("z-index", zindex + 1);
            self.mask.css("z-index", zindex);
        }
        typeof _options.callback === "function" && _options.callback.call(this);

    };
    _relyBox.prototype = new boxy_base();
    //无边框弹窗
    var _invBox = function (options, callback) {
        var self = this, _options, _wmBox, cssObj;
        this._html = juicer([
            '<div class="wmBox invBox ${boxCls} fixed_box" id="${boxId}">',
                '<div class="wmBox-content"></div>',
            '</div>'
        ].join(''));
        _options = $.extend({
            "content": "",
            "mask": true
        }, options);
        _options.callback = options ? options.callback || callback : undefined;
        this.wmBox = _wmBox = this.create(_options, function (_wmBox, _mask) {
            _wmBox.find('.wmBox-content').append(_options.content);
        });
        if (isIE6) {
            cssObj = { "zoom": 1, "width": _wmBox.outerWidth() }
            _wmBox.find(".wmBox-head").css(cssObj);
            _wmBox.find(".wmBox-botton").css(cssObj);

        }
        this.position = function () {
            self.wmBox.css({
                "marginTop": -(_wmBox.outerHeight() / 2) + "px",
                "marginLeft": -(_wmBox.outerWidth() / 2) + "px"
            })
        };
        this.show = function (callback) {
            self.wmBox.show();
            self.mask.css("display", "block");
            self.position();
            typeof callback === "function" && callback.call(self);
        };
        this.hide = function () {
            self.wmBox.fadeOut();
            self.mask.fadeOut();
        };
        this.setIndex = function (zindex) {
            self.wmBox.css("z-index", zindex + 1);
            self.mask.css("z-index", zindex);
        }
        typeof _options.callback === "function" && _options.callback.call(this);
        this.wmBox.attr("top", this.wmBox.css("top"));
        !hasBox && initFixed();
        hasBox && isIE6 && $(window).scroll();
    };
    _invBox.prototype = new boxy_base();
    //公开接口
    exports.alert = function (options, callback) {
        var boxy = new _alert(options, callback);
        boxy.show();
        return boxy;
    };
    exports.relyBox = function (options, callback) {
        var boxy = new _relyBox(options, callback);
        boxy.show();
        return boxy;
    };
    exports.invBox = function (options, callback) {
        var boxy = new _invBox(options, callback);
        boxy.show();
        return boxy;
    };
});