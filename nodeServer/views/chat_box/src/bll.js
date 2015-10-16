define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var $ = require('jquery'),
    //获取推送信息
    socket = io.connect('http://172.16.1.110:7758');
    var _cookie = function (key, value) {
        var _cookies, isArr = key instanceof Array, retArr = {}, _cookieObj;
        //存在value，视为赋值
        if (value) {
            document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + ";path=/;";
            return encodeURIComponent(value);
        }
        else {
            //没有value视为取值
            _cookies = document.cookie.split(";");
            //key为数组取多个
            if (isArr) {
                _cookieObj = {};
                //cookie To Object
                for (var i in _cookies) {
                    var _cookieItem = _cookies[i].split("=");
                    _cookieItem[0] = _cookieItem[0].replace(/^( |[\s　])+|( |[\s　])+$/g, "");
                    _cookieObj[_cookieItem[0]] = _cookieItem[1];
                }
                //遍历取值
                for (i in key) {
                    retArr[key[i]] = _cookieObj[encodeURIComponent(key[i])];
                }
                return retArr;
            } else {
                //遍历取值
                for (var i in _cookies) {
                    var _cookieItem = _cookies[i].split("=");
                    _cookieItem[0] = _cookieItem[0].replace(/^( |[\s　])+|( |[\s　])+$/g, "");
                    if (_cookieItem[0] == encodeURIComponent(key)) {
                        return decodeURIComponent(_cookieItem[1]);
                    }
                }
                return null;
            }
        }
    };
    var _removeCookie = function (key) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = encodeURIComponent(key) + "=x;path=/;expires=" + date.toGMTString();
    };
    var editor = new UE.ui.Editor()//编辑器
    //简单队列
    var queue = function () {
        var self = this;
        this.list = [];
        this.add = function (data, cb) {
            self.list.push(data);
            cb && cb();
        };
        this.get = function () {
            return self.list.shift();
        };
    };

    var _user_name = _cookie('f2euser_name');
    var init = function () {
        editor.render("myEditor");
        editor.ready(function () {
            editor.setHeight(120);
        });
        bind();

    };
    var bind = function () {
        var $page = $("#page"), $chat_window = $page.find(".chat_window");
        $page.on("click", ".send", function () {
            if (!_user_name) {
                _user_name = $.trim(prompt("亲，您叫啥？"));
                _cookie('f2euser_name', _user_name);
            }
            if (!editor.getContentTxt()) {
                return false;
            }
            $.ajax({
                url: 'push?',
                type: "post",
                data: {
                    uname: _user_name||"",
                    text: encodeURIComponent(editor.getContentTxt())
                },
                dataType: "text",
                cache: false
            });
            editor.setContent('');
            return false;
        });
        editor.addListener('keydown', function () {
            var e = arguments[1];
            if (e.ctrlKey && e.keyCode === 13) {
                $page.find(".send").click();
                return false;
            }
        })
        //这边就是获取推送信息的递归了，只要把推送来的数据放到，队列里面就可以了
        socket.on('chat_box', function (data) {
            $chat_window.append('<p><span class="user_name">' + data.userName + '</span><span class="ip">(' + data.ip + ')</span>' + data.date + (data.remark ? '<span class="remark">' + data.remark + '</span>' : '') + '</p>' + (data.msg ? ('<p class="msg">' + decodeURIComponent(data.msg) + '</p>') : ''));
            console.log(data)
            $chat_window.scrollTop(10000);
        });
    };
    init();
});
