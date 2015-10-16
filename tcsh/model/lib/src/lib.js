/*
wmlib
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $, box, loginBox;
    try {
        $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
           box = require("http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js"),
           loginBox = require("http://s.tcsh.me/tcsh/model/wmloginbox/dist/wmloginbox.js");
        
    } catch (e) {
        require("http://s.tcsh.me/tcsh/model/seajs_jqueryui/development-bundle/ui/jquery.color.js")($);
    }
    var cookie_user_data, role;
    var roleTxt = {
        "1": "买家",
        "2": "卖家",
        "4": "管理员",
        "8": "运营",
        "32": "未审核通过的商家"
    };
    var roleUserNameLink = {
        "1": domains.member,//买家
        "2": domains.sell,//卖家
        "4": domains.z + "/brand/list",//管理员
        "8": domains.operator,//运营
        "32": domains.account + "/seller/next"//未审核通过的商家
    };
    if (!this.JSON) {
        this.JSON = {};
    }
    (function () {

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        if (typeof Date.prototype.toJSON !== 'function') {

            Date.prototype.toJSON = function (key) {

                return isFinite(this.valueOf()) ?
                       this.getUTCFullYear() + '-' +
                     f(this.getUTCMonth() + 1) + '-' +
                     f(this.getUTCDate()) + 'T' +
                     f(this.getUTCHours()) + ':' +
                     f(this.getUTCMinutes()) + ':' +
                     f(this.getUTCSeconds()) + 'Z' : null;
            };

            String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
        }

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            },
            rep;


        function quote(string) {

            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.

            escapable.lastIndex = 0;
            return escapable.test(string) ?
                '"' + string.replace(escapable, function (a) {
                    var c = meta[a];
                    return typeof c === 'string' ? c :
                        '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"' :
                '"' + string + '"';
        }


        function str(key, holder) {

            // Produce a string from holder[key].

            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.

            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // If we were called with a replacer function, then call the replacer to
            // obtain a replacement value.

            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

            // What happens next depends on the value's type.

            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':

                    // JSON numbers must be finite. Encode non-finite numbers as null.

                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':

                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.

                    return String(value);

                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.

                case 'object':

                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.

                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying this object value.

                    gap += indent;
                    partial = [];

                    // Is the value an array?

                    if (Object.prototype.toString.apply(value) === '[object Array]') {

                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.

                        v = partial.length === 0 ? '[]' :
                            gap ? '[\n' + gap +
                                    partial.join(',\n' + gap) + '\n' +
                                        mind + ']' :
                                  '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // If the replacer is an array, use it to select the members to be stringified.

                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            k = rep[i];
                            if (typeof k === 'string') {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {

                        // Otherwise, iterate through all of the keys in the object.

                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.

                    v = partial.length === 0 ? '{}' :
                        gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                                mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }

        // If the JSON object does not yet have a stringify method, give it one.

        if (typeof JSON.stringify !== 'function') {
            JSON.stringify = function (value, replacer, space) {

                // The stringify method takes a value and an optional replacer, and an optional
                // space parameter, and returns a JSON text. The replacer can be a function
                // that can replace values, or an array of strings that will select the keys.
                // A default replacer method can be provided. Use of the space parameter can
                // produce text that is more easily readable.

                var i;
                gap = '';
                indent = '';

                // If the space parameter is a number, make an indent string containing that
                // many spaces.

                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }

                    // If the space parameter is a string, it will be used as the indent string.

                } else if (typeof space === 'string') {
                    indent = space;
                }

                // If there is a replacer, it must be a function or an array.
                // Otherwise, throw an error.

                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                         typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }

                // Make a fake root object containing our value under the key of ''.
                // Return the result of stringifying the value.

                return str('', { '': value });
            };
        }


        // If the JSON object does not yet have a parse method, give it one.

        if (typeof JSON.parse !== 'function') {
            JSON.parse = function (text, reviver) {

                // The parse method takes a text and an optional reviver function, and returns
                // a JavaScript value if the text is a valid JSON text.

                var j;

                function walk(holder, key) {

                    // The walk method is used to recursively walk the resulting structure so
                    // that modifications can be made.

                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }


                // Parsing happens in four stages. In the first stage, we replace certain
                // Unicode characters with escape sequences. JavaScript handles many characters
                // incorrectly, either silently deleting them, or treating them as line endings.

                text = String(text);
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }

                // In the second stage, we run the text against regular expressions that look
                // for non-JSON patterns. We are especially concerned with '()' and 'new'
                // because they can cause invocation, and '=' because it can cause mutation.
                // But just to be safe, we want to reject all unexpected forms.

                // We split the second stage into 4 regexp operations in order to work around
                // crippling inefficiencies in IE's and Safari's regexp engines. First we
                // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                // replace all simple value tokens with ']' characters. Third, we delete all
                // open brackets that follow a colon or comma or that begin the text. Finally,
                // we look to see that the remaining characters are only whitespace or ']' or
                // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                if (/^[\],:{}\s]*$/.
    test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                    // In the third stage we use the eval function to compile the text into a
                    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                    // in JavaScript: it can begin a block or an object literal. We wrap the text
                    // in parens to eliminate the ambiguity.

                    j = eval('(' + text + ')');

                    // In the optional fourth stage, we recursively walk the new structure, passing
                    // each name/value pair to a reviver function for possible transformation.

                    return typeof reviver === 'function' ?
                        walk({ '': j }, '') : j;
                }

                // If the text is not JSON parseable, then a SyntaxError is thrown.

                throw new SyntaxError('JSON.parse');
            };
        }
    }());
    var _queryString = function (val) {
        /*获取url参数*/
        var _getVal = function (val) {
            var _ret, re;
            var uri = window.location.href;
            re = new RegExp("" + val + "\=([^\&\?]*)", "gi");
            _ret = uri.match(re);
            return ((uri.match(re)) ? decodeURI(uri.match(re)[0].substr(val.length + 1)) : null);
        };
        /*获取单个url参数*/
        if (val.constructor == String) {
            return _getVal(val);
        }
        /*批量获取url参数*/
        //queryString的参数为对象时返回对象
        if (val.constructor == Object) {
            var ival
            for (var i in val) {
                if (val.hasOwnProperty(i)) {
                    ival = _getVal(i);
                    if (ival) {
                        val[i] = ival;
                    }
                }
            }
            return val;
        }
        //queryString参数为数组是返回数组
        if (val.constructor == Array) {
            var i = val.length;
            while (i--) {
                val[i] = _getVal(val[i]);
            }
            return val;
        }
        return null;
    };
    var _getStrLength = function (val) {
        if (typeof val != "string") { return 0 };
        var realLength = 0, len = val.length, charCode = -1;
        while (len--) {
            charCode = val.charCodeAt(len);
            realLength += ((charCode >= 0 && charCode <= 128) ? 1 : 2);
        }
        return realLength;
    };
    var _fileSize = function (fileObj) {
        var image = new Image();
        image.dynsrc = fileObj.value;
        return image.fileSize || fileObj.files[0].size;
    };
    var _islogin = function (callback, showLoginBox) {
        var _invBox;
        var _settimeout = setTimeout(function () {
            _invBox = box.invBox({
                content: '<p style="text-align: center;line-height: 70px;"><img src="http://s.tcsh.me/tcsh/view/public/img/loading/loading18_18_1.gif" style="vertical-align: middle;" /> 正在检测用户数据！</p>',
                btns: []
            });
        }, 1000);
        $.ajax({
            url: domains.account + '/user/islogin',
            type: "get",
            dataType: "jsonp",
            timeout: 5000,
            success: function (data) {
                clearTimeout(_settimeout);
                _invBox && _invBox.close();
                if (data.response) {
                    typeof callback === "function" && callback();
                } else {
                    typeof showLoginBox === "function" ? showLoginBox() : loginBox();
                }
            },
            error: function () {
                var i = 5;
                var $errmsg = $('<p>服务器忙，请5秒后刷新重试！</p>');
                _invBox.setCon($errmsg);
                setInterval(function () {
                    $errmsg.empty().append("服务器忙，请" + --i + "秒后刷新重试！");
                    if (i <= 0) {
                        window.location.reload();
                    }
                }, 1000);
            }
        });
    };
    var _cookie = function (key, value) {
        var _cookies, isArr = key instanceof Array, retArr = {}, _cookieObj;
        var date = new Date();
        date.setTime(date.getTime() + 259200000);//86400000*3
        //存在value，视为赋值
        if (value) {
            document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + ";path=/;domain=.tcsh.me;expires=" + date.toGMTString();
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
        document.cookie = encodeURIComponent(key) + "=x;path=/;domain=.tcsh.me ;expires=" + date.toGMTString();
    };
    var _imgLoad = function (src, callabck) {
        var o = new Image();
        o.src = src;
        if (o.complete) {
            typeof callabck === "function" && callabck();
        } else {
            o.onload = function () {
                typeof callabck === "function" && callabck();
            };
        }
    };
    var _geometricZoom = function (op) {
        _imgLoad(op.$img.attr("src"), function () {
            op.$img.css({
                width: "auto",
                height: "auto",
                visibility: "hidden"
            });
            _w = op.$img.width();
            _h = op.$img.height();
            _max = Math.max(_w, _h);
            if (_max === _w) {
                if (_w >= op.boxW) {
                    op.$img.css({
                        "width": op.boxW,
                        "height": op.boxW / _w * _h,
                        "margin-top": (op.boxH / 2) - (op.boxW / _w * _h) / 2
                    });
                } else {
                    op.$img.css({
                        "width": _w,
                        "height": _h,
                        "margin-top": op.boxH / 2 - _h / 2
                    });
                }
            }
            if (_max === _h) {
                if (_h >= op.boxH) {
                    op.$img.css({
                        "width": op.boxH / _h * _w,
                        "height": op.boxH,
                        "margin-top": (op.boxH / 2) - op.boxH / 2
                    });
                } else {
                    op.$img.css({
                        "width": _w,
                        "height": _h,
                        "margin-top": (op.boxH / 2) - _h / 2
                    });
                }
            }
            op.$img.css({
                visibility: "visible"
            });
            typeof op.callback === "function" && op.callback.call(op.$img);
        });
    };
    var _countdown = function (op) {
        var _id, _setInterval, _ele;
        var _op = $.extend({
            parent: "body",
            ele: "",
            countdownModel: '<span class="ui_btn ui_btn_h23gray18"><span class="ui_btn_txt">${i}秒后重新获取</span></span>',
            start: 60,
            step: 1000,
            endCallBack: function () { }
        }, op);
        if (!_op.ele) {
            throw "lib.countdown Parameter ele is Null";
            return false;
        }
        _op.$parent = $(_op.parent);
        _op.$ele = $(_op.ele);
        _id = _op.$ele.attr("id");
        if (!_id) {
            _id = "libcountdown" + parseInt(Math.random() * 99999) + 99999;
            _op.$ele.attr("id", _id);
        }
        _op.$ele = _op.$ele.clone(true);
        _ele = $(_op.countdownModel.replace(/(\$\{\i\})/g, _op.start)).attr("id", _id);
        _op.$parent.find("#" + _id).replaceWith(_ele);
        _setInterval = setInterval(function () {
            _op.start--;
            _ele = $(_op.countdownModel.replace(/(\$\{\i\})/g, _op.start)).attr("id", _id);
            _op.$parent.find("#" + _id).replaceWith(_ele);
            if (_op.start <= 0) {
                clearInterval(_setInterval);
                _op.$parent.find("#" + _id).replaceWith(_op.$ele);
                typeof _op.endCallBack === "function" && _op.endCallBack();
            }
        }, _op.step);
        return _setInterval;
    };
    var _sendsms = function (op) {
        $.ajax({
            url: (op.url || domains.account + "/code?") + $.param(op.param || {}),
            type: op.type || "get",
            dataType: "jsonp"
        });
    };
    var _sendemail = function (op) {
        $.ajax({
            url: (op.url || domains.account + "/code?") + $.param(op.param || {}),
            type: op.type || "get",
            dataType: "jsonp"
        });
    };
    var _turnTime = function (m) {
        var retObj = {};
        //日
        retObj.d = parseInt(m / 1000 / 60 / 60 / 24);
        //时
        retObj.h = parseInt(m % (1000 * 60 * 60 * 24) / 1000 / 60 / 60);
        //分
        retObj.m = parseInt(m % (1000 * 60 * 60) / 1000 / 60);
        //秒
        retObj.s = parseInt(m % (1000 * 60) / 1000);

        return retObj;
    };
    var _getRole = function (isReset) {
        if (isReset) {
            cookie_user_data = $.trim(_cookie("wm.user.data"));
            if (cookie_user_data) {
                cookie_user_data = cookie_user_data.split("|");
                role = $.trim(cookie_user_data[0]);
            }
        }
        if (role) {
            return {
                key: role,
                value: roleTxt[role]
            }
        } else {
            return null;
        }
    };
    var _getUserNameLinkURL = function () {
        var _type = _getRole();
        if (_type) {
            return roleUserNameLink[_type.key];
        } else {
            return domains.www
        }
    };
    var _addFavorite = function (sURL, sTitle) {
        try {
            window.external.addFavorite(sURL || window.location.href, sTitle || "同城生活");
        }
        catch (e) {
            try {
                window.sidebar.addPanel(sTitle || "同城生活", sURL || window.location.href, "");
            }
            catch (e) {
                alert("加入收藏失败，请使用Ctrl+D进行添加");
            }
        }
    };
    var _getSuffixName = function (fileName) {
        if (typeof fileName === "string") {
            var point = fileName.lastIndexOf(".");
            return fileName.substr(point + 1);
        }
        return "";
    };
    var _BGShine = function (ele) {
        var self = this, $ele = $(ele), queue = [];
        this.init = function (op) {
            op.frequency = op.frequency || 1
            while (op.frequency--) {
                queue.push(function () {
                    if (typeof op.change_color === "string" && typeof op.original_color === "string") {
                        $ele.stop(true, true).animate({ backgroundColor: op.change_color }, 300, function () {
                            $ele.animate({ backgroundColor: op.original_color }, 100, function () {
                                if (queue.length) {
                                    queue.shift()();
                                } else {
                                    typeof op.callback === "function" && op.callback.call($ele);
                                }
                            });
                        });
                    } else {
                        $ele.stop(true, true).animate(op.change_color, 300, function () {
                            $ele.animate(op.original_color, 100, function () {
                                if (queue.length) {
                                    queue.shift()();
                                } else {
                                    typeof op.callback === "function" && op.callback.call($ele);
                                }
                            });
                        });
                    }
                });
            }
        };
        this.start = function () {
            queue.shift()();
        };
        this.queue = queue;
        this.emptyQueue = function () {
            self.queue = [];
            $ele.stop(true, true);
        };
    };
    (function () {
        cookie_user_data = $.trim(_cookie("wm.user.data"));
        if (cookie_user_data) {
            cookie_user_data = cookie_user_data.split("|");
            role = $.trim(cookie_user_data[0]);
        }
    })();
    //获取url参数
    exports.queryString = function (val) {
        return _queryString(val);
    };
    //获取字符长度
    exports.getStrLength = function (val) {
        return _getStrLength(val);
    };
    //获取上传文件大小
    exports.getFileSize = function (fileObj) {
        return _fileSize(fileObj);
    };
    //验证登录状态
    exports.verificationLogin = function (callback, showLoginBox) {
        _islogin(callback, showLoginBox);
    };
    //cookie读取
    exports.cookie = function (key, value) {
        return _cookie(key, value);
    };
    //cookie删除
    exports.removeCookie = function (key) {
        _removeCookie(key);
    };
    //图片加载完成回调
    exports.imgLoad = function (src, callabck) {
        _imgLoad(src, callabck);
    };
    //图片等比缩放
    exports.geometricZoom = function (op) {
        _geometricZoom(op);
    };
    //倒计时效果
    exports.countdown = function (op) {
        return _countdown(op);
    };
    //发送短信
    exports.sendSMS = function (op) {
        _sendsms(op);
    };
    //发送邮件
    exports.sendEMail = function (op) {
        _sendemail(op);
    };
    //日时分秒
    exports.turnTime = function (m) {
        return _turnTime(m);
    };
    //获取权限信息
    exports.getRole = function (isReset) {
        return _getRole(isReset);
    };
    //各自的首页
    exports.getUserNameLinkURL = function () {
        return _getUserNameLinkURL();
    };
    //获取后缀名
    exports.getSuffixName = function (fileName) {
        return _getSuffixName(fileName);
    };
    //收藏
    exports.addFavorite = _addFavorite;
    //背景闪耀
    /*
    ele：闪耀元素，
    original_color：原始背景，
    change_color：改变背景，
    frequency：闪耀次数
    */
    exports.BGShine = function (op) {
        if (op.ele) {
            var $ele = $(op.ele), _gbshine = $ele.data("BGShine");
            if (!_gbshine) {
                _gbshine = new _BGShine(op.ele);
                $ele.data("BGShine", _gbshine)
            } else {
                _gbshine.emptyQueue();
            }
            _gbshine.init(op);
            _gbshine.start();
        } else {
            throw "lib.BGShine ele parameter can not be null";
        }
    };

});