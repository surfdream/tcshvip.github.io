/*
页面统计模块v1.0
统计内容：
页面进入时间
离开时间
时长
浏览器内核
客户端信息
城市编码
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    var _postDataUrl = domains.api + "/behavior/wmfootlog";
    var postData = {};
    var init = function () {
        var _userAgent = navigator.userAgent;
        //PC浏览器内核
        if ($.browser.webkit) {
            postData.browser = "webkit"
        }
        if ($.browser.safari) {
            postData.browser = "safari"
        }
        if ($.browser.opera) {
            postData.browser = "opera"
        }
        if ($.browser.msie) {
            postData.browser = "msie"
        }
        if ($.browser.mozilla) {
            postData.browser = "mozilla"
        }
        //IOS终端
        if (!postData.browser && !!_userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            postData.client_side = "IOS";
        }
            //android终端或者uc浏览器
        else if (!postData.browser && (_userAgent.indexOf('Android') > -1 || _userAgent.indexOf('Linux') > -1)) {
            postData.client_side = "Android";
        }
            //iPhone或者QQHD浏览器
        else if (!postData.browser && (_userAgent.indexOf('iPhone') > -1 || _userAgent.indexOf('Mac') > -1)) {
            postData.client_side = "iPhone";
        }
            //iPad
        else if (!postData.browser && _userAgent.indexOf('iPad') > -1) {
            postData.client_side = "iPad";
        }
            //webApp
        else if (!postData.browser && _userAgent.indexOf('Safari') == -1) {
            postData.client_side = "webApp";
        } else {
            postData.client_side = encodeURIComponent((!!_userAgent.match(/AppleWebKit.*Mobile/) || !!_userAgent.match(/Windows Phone/) || !!_userAgent.match(/Android/) || !!_userAgent.match(/MQQBrowser/)) ? "手机端" : "PC端");
        }
        //内核版本
        postData.version = $.browser.version;
        //活动时间
        postData.activ_time = 0;
        //分辨率
        postData.resolution = window.screen.width + "*" + window.screen.height;

        bind();
    };
    var bind = function () {
        var $window = $(window), $body = $("body");
        var time_start = new Date(), _savt;
        var sendPostData = function () {
            var time_end = new Date();
            var _user_iptocity = JSON.parse(lib.cookie("user_iptocity")) || {};
            //停留时间
            postData.time_seconds = time_end.getTime() - time_start.getTime();
            //进入页面时间
            postData.time_start = encodeURIComponent(time_start.getFullYear() + "年" + (time_start.getMonth() + 1) + "月" + time_start.getDate() + "日 " + time_start.getHours() + ":" + time_start.getMinutes() + ":" + time_start.getSeconds());
            //离开页面时间
            postData.time_end = encodeURIComponent(time_end.getFullYear() + "年" + (time_end.getMonth() + 1) + "月" + time_end.getDate() + "日 " + time_end.getHours() + ":" + time_end.getMinutes() + ":" + time_end.getSeconds());
            //页面URL
            postData.url = window.location.href;
            //城市编码
            postData.address_code = _user_iptocity.areaCode || "";
            //城市名称
            postData.address_name = encodeURIComponent(_user_iptocity.areaName || "");
            //用户Id
            postData.userId = lib.cookie("wm.user.id") || "";
            $.ajax({
                url: _postDataUrl,
                async: false,
                type: "get",
                dataType: "jsonp",
                data: postData
            });
        };
        //关闭页面
        window.onbeforeunload = function () {
            postData.type = encodeURIComponent("关闭页面");
            sendPostData();
        };
        $window.on("blur", function () {
            clearInterval(_savt);
            _savt = null;
        });
        $window.on("focus ", function () {
            if (!_savt) {
                _savt = setInterval(function () {
                    postData.activ_time++;
                    if (postData.activ_time === 5) {
                        postData.type = encodeURIComponent("活跃5秒");
                        sendPostData();
                    }
                }, 1000);
            }
        });
        $window.focus();
        //当前页面常规跳转的统计
        $body.on("click.statistics", "a", function () {
            var $this = $(this),
                _href = $this.attr("href"),
                _target = $this.attr("target");
            if (_target === "_blank") {
                postData.type = encodeURIComponent("新窗口打开");
                postData.des_url = _href;
                sendPostData();
            }
            else {
                if (_href !== "#") {
                    postData.type = encodeURIComponent("当前页面跳转");
                    postData.des_url = _href;
                    sendPostData();
                }
            }

        });
    };
    try {
        init();
    } catch (e) { }
    require.setURL = function (url) {
        if (typeof url === "string") {
            _postDataUrl = url
        } else {
            throw "PRT's setURL parameter type error！"
        }
    };
});