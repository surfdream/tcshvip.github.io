/*
瀑布流
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js');
    var waterall = function (op) {
        var self = this;
        var _op = $.extend({
            listEle: ".waterfall_list",
            itemEle: ".waterfall_item",
            spacing: 20
        }, op);
        var _i = 0, _random;
        var _maxW, _setTop = 0, _setLeft = 0;
        //监控区域内的所有Img的加载情况,无图片直接执行回调
        var monitorImgOnload = function ($imgParent/*img的祖先级*/, callback/*回调*/) {
            var _listFindImgLength = $imgParent.find("img").length;
            _i = 0;
            if (_listFindImgLength === 0) {
                typeof callback === "function" && callback();
                return
            }
            $imgParent.find("img").on("error", function () {
                $(this).attr("src", "http://s.tcsh.me/tcsh/view/public/img/img404_1.png");
            });
            if (navigator.appName == "Microsoft Internet Explorer") {
                $imgParent.find("img").each(function () {
                    var img = new Image();
                    img.onreadystatechange = function () {
                        if (img.readyState == "complete") {
                            _i++;
                            _i === _listFindImgLength && typeof callback === "function" && callback();
                        }
                    };
                    img.src = $(this).attr("src");
                });
            } else {
                $imgParent.find("img").load(function () {
                    _i++;
                    _i === _listFindImgLength && typeof callback === "function" && callback();
                });
            }
        };
        //设置每项
        var setItem = function ($item/*设置项*/, isWrap/*可选项，是否已经存在换行*/) {
            var _isWrap = isWrap || false, $bott, _bott = 0;
            $item.css({
                "position": "absolute"
            });
            $item.each(function (i) {
                var $this = $(this), _w = $this.outerWidth(), _h = $this.outerHeight(), _bott = Number.MAX_VALUE;
                if (_isWrap) {
                    self.$List.find("[bott]").each(function () {
                        var $this = $(this);
                        _bott = Math.min(_bott, $this.attr("bott") - 0);
                    });
                    $bott = self.$List.find("[bott='" + _bott + "']:eq(0)").removeAttr("bott");
                    _setTop = _bott;
                    _setLeft = $bott.attr("left") - 0;
                } else {
                    _setTop = 0;
                    _setLeft = $this.index() * (_w + self.Spacing);
                    _isWrap = _setLeft + _w * 2 + self.Spacing * 2 >= _maxW;
                }
                $this.css({
                    top: _setTop,
                    left: _setLeft
                }).attr("bott", _setTop + _h + self.Spacing).attr("left", _setLeft).attr("top", _setTop);
                _setLeft += _w + self.Spacing;
            });
            self.$List.find("[bott]").each(function () {
                var $this = $(this);
                _bott = Math.max(_bott, $this.attr("bott") - 0);
            });
            self.$List.height(_bott);
        };
        //列表元素
        this.$List = $(_op.listEle);
        //每项
        this.$Item = $(_op.itemEle);
        //元素间距
        this.Spacing = _op.spacing;
        //重置
        this.reset = function () {
            self.$List = $(_op.listEle);
            self.$Item = $(_op.itemEle);
            _maxW = self.$List.width(), _setTop = 0, _setLeft = 0;
            self.$Item.css({
                top: 0,
                left: 0
            }).removeAttr("left").removeAttr("bott");
            setItem(self.$Item);
        };
        //插入
        this.append = function ($append, callback) {
            if (!($append instanceof $)) {
                $append = $($append);
            }
            var $oldEle = self.$List.find("[bott]");
            self.$List.append($append);
            self.$Item = $(_op.itemEle);
            if (!$oldEle.length) {
                monitorImgOnload($append, function () {
                    self.reset();
                    typeof callback === "function" && callback.call(self.$List);
                    
                });
            } else {
                var _maxTop = -1;
                monitorImgOnload($append, function () {
                    _setLeft = 0;
                    $oldEle.each(function () {
                        _maxTop = Math.max(_maxTop, parseFloat($(this).attr("top")));
                        _setLeft = Math.max(_setLeft, parseFloat($(this).attr("left")));
                    });
                    setItem($append, _maxTop > 0);
                    typeof callback === "function" && callback.call(self.$List);
                });
            }
        };
        //获取最大底部
        this.getMaxBott = function () {
            var _maxBott = 0;
            self.$List.find("[bott]").each(function () {
                _maxBott = Math.max(_maxBott, parseFloat($(this).attr("bott")));
            });
            return _maxBott;
        };
        //填充因为瀑布流导致的空白(切记补白 之后不能在插入了)
        this.stuff = function () {
            var $html = self.$Item.last().clone().empty();
            var _maxBott = self.getMaxBott();
            $html.css({
                top: 0,
                left: 0
            }).removeAttr("bott").removeAttr("left").removeAttr("top").addClass("waterallstuff");
            self.$List.find("[bott]").each(function () {
                var $append = $html.clone();
                if ($(this).attr("bott") != _maxBott) {
                    self.append($append, function () {
                        $append.removeAttr("bott");
                        $append.css({
                            "display": "block",
                            "height": _maxBott - ($append.attr("top") - 0) - self.Spacing
                        });
                    });
                    
                }
            });
        };
        self.$List.css({
            "position": "relative"
        });
        self.reset();
    };
    exports.create = function (op) {
        return new waterall(op);
    };
});