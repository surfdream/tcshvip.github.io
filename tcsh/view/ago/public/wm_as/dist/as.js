/*
otherData:约定
1、logo：logo图片URL
2、brandId：品牌id
3、discount：折扣
例子：otherData:"logo,brandId,discount"
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js'),
        juicer = require('http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js');

    require('http://s.tcsh.me/tcsh/view/ago/public/wm_as/css/style.css');
    var appendMask = function () {
        var $body = $("body");
        $body.append('<div class="wmas-mask"style="display:block; top: 0; bottom: 0; left: 0; right: 0; z-index: 1000; background-color: #000; filter: alpha(opacity=70); opacity:0.7; position: fixed;  _position: absolute;zoom: 1;_height:' + $body.height() + '"><iframe class="sdialog-mask-iframe" style="display: none; _display: block; width: 100%; height: 100%; filter: alpha(opacity=0); opacity: 0;" frameborder="0" src="javascript:\'\';"></iframe></div>');
    };
    var _callbackFun = {};
    var init = function (op) {
        op = $.extend({
            callback: function () { }
        }, op)
        window.document.domain = "tcsh.me"
        var $body = $("body"), $page = $("#page"), _locateKey, _locateKeyList, $locate, locateOffset, _asRemarkImg, i, _arr = [];
        if (lib.queryString("is_as_locate")) {
            $page.find(".wm_as_pit").append('<div class="wm_as_mask"><a class="nail" href="#" title="定位"><img src="http://s.tcsh.me/tcsh/view/ago/public/wm_as/img/nail.png" style="width:100px;height:100px"></a></div>')
        }
        _locateKey = lib.queryString("locateKey");
        if (_locateKey) {
            $locate = $page.find("[data_as_pit_key='" + _locateKey + "']");
            locateOffset = $locate.offset();
            appendMask();
            $body.append('<span style="z-index:1001;display: block;width:' + $locate.outerWidth() + 'px;height:' + $locate.outerHeight() + 'px;position: absolute;top:' + locateOffset.top + 'px;left:' + locateOffset.left + 'px;background:url(' + decodeURIComponent(lib.queryString("asRemarkImg")) + ')"></span>');
            $("body").animate({
                scrollTop: locateOffset.top - 150
            })
        }
        _locateKeyList = lib.cookie("wmad_locateKeyList");
        if (_locateKeyList && window != window.top) {
            _locateKeyList = _locateKeyList.split(',');
            i = _locateKeyList.length;
            _asRemarkImg = lib.cookie("wmad_asRemarkImgList").split(',');
            appendMask();
            while (i--) {
                $locate = $page.find("[data_as_pit_key='" + _locateKeyList[i] + "']");
                locateOffset = $locate.offset();
                _arr.push('<a href="#" class="halo" data_key="' + _locateKeyList[i] + '" style="display: block;width:' + $locate.outerWidth() + 'px;height:' + $locate.outerHeight() + 'px;position: absolute;top:' + locateOffset.top + 'px;left:' + locateOffset.left + 'px;background:url(' + decodeURIComponent(_asRemarkImg[i]) + ')"></a>');
            }
            $body.append(_arr.join(''));
        }
        _locateKeyList && window === window.top && lib.removeCookie("wmad_locateKeyList");
        bind();
        $actual_advertisement_model = $body.find(".actual_advertisement_model");
        if ($actual_advertisement_model.length) {
            _setcallback(op.callback);
            window.location.origin = window.location.origin || (window.location.protocol + "//" + window.location.host);
            $.ajax({
                url: domains.api2+"/advert/getadvert.json",
                type: "get",
                data: {
                    pathname: encodeURIComponent(window.location.origin + window.location.pathname),
                    otherData: op.otherData || ""
                },
                dataType: "jsonp",
                success: function (data) {
                    var forIndex = 0,
                        setTimeoutIndex = 0;
                    for (var i in data) {
                        //异步处理，如果页面存在大量广告属性，能够提高性能
                        forIndex++;
                        (function (i) {
                            setTimeout(function () {
                                var _as_model, $data_as_pit_key;
                                $data_as_pit_key = $body.find("[data_as_pit_key='" + i + "']");
                                if ($data_as_pit_key.length) {
                                    _as_model = juicer("{@each list as item}" + $.trim($body.find("#" + i).html()) + "{@/each}");
                                    $data_as_pit_key.find(".actual_advertisement_liat").append(_as_model.render({ list: data[i] }));
                                    typeof _callbackFun[i] === "function" && _callbackFun[i].call($data_as_pit_key);;
                                }
                                setTimeoutIndex++;
                                //使用异步加速，当2个index相等的时候，视为所有广告位以加载完毕，执行回调
                                forIndex === setTimeoutIndex && typeof op.endCallback === "function" && op.endCallback.call($data_as_pit_key);
                            }, 10);
                        })(i);
                    }
                },
                error: function () {

                }
            });
        }
    };
    var bind = function () {
        var $body = $("body"), $page = $("#page");
        $page.on("click", ".nail", function () {
            var $this = $(this);
            window.opener.dw($this.closest(".wm_as_pit").attr("data_as_pit_key"), lib.queryString("lk"));
            window.close();
            return false;
        });
        $body.on("click", ".halo", function () {
            var $this = $(this);
            top.dw($this.attr("data_key"));
            return false;
        });
    };
    var _setcallback = function (key, fun) {
        if (typeof key === "string" && typeof fun === "function") {
            if (_callbackFun[key]) {
                throw "as.js the presence of the same callback interfaces keyword setCallback！";//存在相同key
            }
            _callbackFun[key] = fun;
        }
        if (key.constructor === Object) {
            if (!_callbackFun[key.key]) {
                _callbackFun[key.key] = key.fun;
            } else {
                throw "as.js the presence of the same callback interfaces keyword setCallback！";//存在相同key
            }
        }
        if (key.constructor === Array) {
            for (var i in key) {
                if (_callbackFun[key[i].key]) {
                    throw ("as.js the presence of the same callback interfaces keyword setCallback！" + key[i].key);//存在相同key
                    break;
                }
                _callbackFun[key[i].key] = key[i].fun;
            }
        }
    }
    exports.init = function (op) {
        init(op);
    };
    exports.setCallback = function (key, fun) {
        _setcallback(key, fun);
    };
});
