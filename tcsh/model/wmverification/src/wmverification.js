/*
验证模块
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    require('../css/style.css#');
    require('../../wmtips/css/style.css#');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
     tips = require("http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js"),
     lib = require("http://s.tcsh.me/tcsh/model/lib/dist/lib.js");
    var wmverification = function () {
        var self = this,
            _direction = 'rt',
            _offset = { left: 15 },
            _skin = "red2";
        var _verification = {
            empty: function (v) {
                //非空
                v = $.trim(v);
                return v.length > 0;
            },
            numer: function (_v) {
                //数字
                var _regExp = /^-(\d*\.)?\d|(\d*\.)?\d+$/;
                return _regExp.test($.trim(_v));
            },
            positiveNumber: function (_v) {
                //正数
                var _regExp = /^([0-9]*\.)?\d+$/;
                return _regExp.test($.trim(_v));
            },
            positiveInteger: function (_v) {
                //正整数
                var _regExp = /^[0-9]*[1-9][0-9]*$/;
                return _regExp.test($.trim(_v));
            },
            nonNegative: function (_v) {
                //非负数
                var _regExp = /^[0-9]*([1-9]*\.)?\d+$/;
                return _regExp.test($.trim(_v));
            },
            chars: function (_v) {
                //字符
                var _regExp = /^[a-z,A-Z]+$/;
                return _regExp.test(_v);
            },
            max: function (obj, key) {
                //最大
                var _v = $(obj).val();
                return _v.length - 0 <= key - 0;
            },
            min: function (obj, key) {
                //最小
                var _v = $(obj).val();
                return _v.length >= key;
            },
            minvalue: function (obj, key) {
                //最小值
                var _v = $(obj).val();
                if (_v - 0 === parseFloat(_v)) {
                    return _v - 0 >= key - 0;
                } else {
                    return false;
                }
            },
            email: function (_v) {
                //邮箱地址
                if (!_v) {
                    return true;
                }
                var _regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                return _regExp.test(_v);
            },
            size: function (obj, key) {
                //范围
                var _v = $(obj).val().length, _key = eval('(' + key + ')');
                return _v >= _key[0] && _v <= _key[1];
            },
            contain: function (obj, key) {
                //包含
                var _v = $(obj).val(), _key = key.substr(1, key.length - 2).split(',');
                for (var i in _key) {
                    if (_key[i] + "" == _v) {
                        return true;
                    }
                }
                return false;
            },
            same: function (obj, key) {
                //相同
                var $this = $(obj), _val = $this.val(), $same = $("[name='" + key + "']");
                return _val == $same.val();
            },
            chinaZip: function (_v) {
                //邮编（国内）
                if (!_v) {
                    return true;
                }
                var _regExp = /^[0-9]\d{5}(?!\d)$/;
                return _regExp.test(_v);
            },
            chinaID: function (_v) {
                //身份证号（国内）
                if (!_v) {
                    return true;
                }
                var _regExp = /\d{15}|\d{18}/;
                return _regExp.test(_v);
            },
            phone: function (_v) {
                //手机号
                if (!_v) {
                    return true;
                }
                var _regExp = /^1[3|4|5|8]\d{9}$/;
                return _regExp.test(_v);
            },
            url: function (_v) {
                //url
                var _regExp = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
                return _regExp.test(_v);
            },
            phone86: function (_v) {
                //带86的手机号
                if (!_v) {
                    return true;
                }
                var _regExp = /^((\+86)|(86))?1[3|4|5|8]\d{9}$/;
                return _regExp.test(_v);
            },
            regname: function (_v) {
                //注册用户名
                var _length = lib.getStrLength(_v);//长度
                var lenghtbool = _length >= 4 && _length <= 20;
                return /^[\u4e00-\u9fa5_a-zA-Z]+\w{0,20}/.test(_v) && !(/\s/.test(_v)) && lenghtbool;
            },
            loginname: function (_v) {
                //登录名格式
                var _length = lib.getStrLength(_v);
                var _regMailExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                var _regPhoneExp = /^1[3|4|5|8]\d{9}$/;
                var lenghtbool = _length >= 4 && _length <= 20;
                var mailbool = _regMailExp.test(_v);
                var phonebool = _regPhoneExp.test(_v);
                return lenghtbool || mailbool || phonebool;
            },
            loginpassword: function (_v) {
                //登录密码格式
                var _regNumerExp = /^[0-9]*$/;
                var _regCharExp = /^[a-z,A-Z]+$/;
                var _length = lib.getStrLength(_v);
                var lenghtbool = _length >= 6 && _length <= 16;
                var isNumer = _regNumerExp.test(_v);
                var isChar = _regCharExp.test(_v);
                return lenghtbool && !isNumer && !isChar;
            },
            waybillNumber: function (_v) {
                if (!_v) {
                    return true;
                }
                var _regExp = /^[a-z,A-Z,0-9]*$/;
                return _regExp.test($.trim(_v));
            }
        };
        var _verifySingle = function (_form) {
            var $this = $(this),
                    _val = $this.val(),
                    vtype = $this.attr('wmv').split('|'),
                    msgs = ($this.attr('wmvmsg') || "").split('|'),
                    $wmv_msg,
                    errmsg,
                    retBool = true,
                    errTips,
                    j,
                    _test,
                    _key = $this.attr("name");
            for (var i in vtype) {
                _test = _verification[vtype[i]];
                if (vtype[i].indexOf(":") > 0) {
                    j = vtype[i].split(':');
                    if (!_verification[j[0]].call($this, $this, j[1])) {
                        errmsg = msgs[i];
                        $this.attr("wmvresult", "false");
                        retBool = retBool && false;
                        break;
                    } else {
                        $this.removeAttr("wmvresult");
                    }
                } else if (_test) {
                    if (!_test.call($this, _val)) {
                        errmsg = msgs[i];
                        $this.attr("wmvresult", "false");
                        retBool = retBool && false;
                        break;
                    } else {
                        $this.removeAttr("wmvresult");
                    }
                } else {
                    throw "缺少基础验证类型！"
                }
            }
            $wmv_msg = _form.find("[for='" + _key + "']");
            errTips = $this.data("errTips");
            if (!retBool) {
                //不需要错误表现 直接返回
                if (!self.strikingError) { $wmv_msg.attr("class", "wmv_msg wmv_error").empty(); return false }
                if ($wmv_msg.length) {
                    $wmv_msg.attr("class", "wmv_msg wmv_error").empty().append('<i class="wm_ico fork2"></i>' + errmsg);
                } else {
                    if (!errTips) {
                        errTips = new tips({
                            ele: $this,
                            con: errmsg,
                            skin: _skin,
                            direction: _direction,
                            minIndex: self.minZIndex,
                            offset: _offset
                        });
                        $this.data("errTips", errTips).attr('iserr', "t");
                    }
                    errTips.setCon(errmsg);
                    errTips.show();
                }
                return false;
            } else {
                if (!self.strikingSuccess) { $wmv_msg.attr("class", "wmv_msg wmv_success").empty(); return true }
                $wmv_msg.length && $wmv_msg.attr("class", "wmv_msg wmv_success").empty().append('<i class="wm_ico hook2"></i>正确！');
                errTips && errTips.hide();
                return true;
            }
        };
        var _hideTips = function () {
            var $this = $(this);
            var errTips = $this.data("errTips");
            errTips && errTips.hide && errTips.hide();
            $this.removeAttr('iserr');
        };
        //初始化
        this.init = function (form, callback) {
            if (typeof form === "function") {
                callback = form;
                form = null;
            }
            var _form = $(form || '.wm_form');
            _form.on('blur', '[wmv]', function () {
                _verifySingle.call(this, _form);
            });
            _form.on('focus', '[wmv]', function () {
                _hideTips.call(this);
            });
            typeof callback === "function" && callback.call(self);
        };
        //验证
        this.verify = function (form) {
            var _form = $(form || '.wm_form');
            var retV = true;
            _form.find('[wmv]:visible').each(function () {
                retV = _verifySingle.call(this, _form) && retV;
            });
            //$("[wmvresult='false']:eq(0)").focus();
            return retV;
        };
        //添加新规则
        this.addRule = function (op) {
            if (!op) { return }
            var _op;
            if (op.constructor == Array) {
                _op = op.shift();
                if (_verification[_op.key]) {
                    throw ("已存在" + key + "addRule添加失败！");
                } else {
                    _verification[_op.key] = _op.fun;
                }
                if (op.length) { self.addRule(op); }

            } else {
                if (_verification[op.key]) {
                    throw ("已存在" + key + "addRule添加失败！");
                } else {
                    _verification[op.key] = op.fun;
                }
            }

        };
        this.setDirection = function (v) {
            if ('tltctrblbcbrrtrcrbltlclb'.indexOf(v) >= 0) {
                _direction = v;
            }
            return self;
        };
        this.setOffSet = function (v) {
            v = v || {};
            _offset.left = (v.left - 0) || 0;
            _offset.top = (v.top - 0) || 0;
            return self;
        };
        this.setTipSkin = function (v) {
            _skin = v;
            return self;
        };
        this.position = function () {
            $("[wmv][iserr]").each(function () {
                var $this = $(this);
                var errTips = $this.data("errTips");
                errTips && errTips.position && errTips.position();
            });
        };
        //是否表现正确提示
        this.strikingSuccess = true;
        //是否表现错误提示
        this.strikingError = true;
        //验证层，如果直接在页面上可以不用设置
        this.minZIndex = 2000;
        this.hideTips = function (form) {
            var _form = $(form || '.wm_form');
            _form.find("[wmv]").each(function () {
                _hideTips.call(this);
            });
        };
    };
    return new wmverification();
});