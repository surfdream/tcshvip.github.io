/*
是否单选按钮
v1.0
*/

/*
个性化：单选钮，复选框
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
     juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js");
    var _container = '<div class="cr-btn"><ul class="sliding-range"></ul></div>'
    , _item = juicer('<li _value="${itemvalue}"><a href="#" class="text ${isactive} ${isdisabled}" title=${itemtext}>${itemtext}</a></li>')
    , _slider = '<li class="block"><a href="#"></a></li>';

    //不同类型获取值的get方法不同
    var getFun = {
        "radio": function () {

            return this.find(".active").closest("li").attr("_value");
        },
        "checkbox": function () {
            var valArr = [];
            this.find(".active").each(function () {
                valArr.push($(this).closest("li").attr("_value"));
            });
            return {
                stringVal: valArr.join(','),
                arrayVal: valArr
            }
        },
        "radiotext": function () {
            return $.trim(this.find(".active").closest("li").text());
        },
        "checkboxtext": function () {
            var valArr = [];
            this.find(".active").each(function () {
                valArr.push($.trim($(this).closest("li").text()));
            });
            return {
                stringVal: valArr.join(','),
                arrayVal: valArr
            }
        }
    };
    //工厂函数
    var _factory = function (options) {
        var _fun = {
            "radio": function () {
                return new cr(options.element);
            },
            "checkbox": function () {
                return new cr(options.element);
            },
            "tworadio": function () {
                return new tworadio(options.element);
            }
        }
        return _fun[options.type]();

    };
    //基础方法
    var baseFun = function () {
        this.setSkin = function (skinName) {
            if (!this.hasClass(skinName)) {
                this.addClass(skinName);
            }
        };
        this.setDom = function ($container) {
            this.each(function () {
                var _this = $(this);
                $container.append(_item.render({
                    "itemvalue": _this.val(),
                    "itemtext": _this.attr("title"),
                    "isactive": _this.attr("checked") ? "active" : "",
                    "isdisabled": _this.attr("disabled") ? "noactive" : "",
                }));
            });
        };
        this.show = function (callback) {
            this.show(0, callback);
        };
        this.hide = function (callback) {
            this.hide(0, callback);
        };
        this.remove = function (isremoveBtn) {
            this.container.remove();
            if (isremoveBtn) {
                this.$.remove();
            }
        };
    };
    //仅仅2个状态的按钮，类似开关
    var tworadio = function (options) {
        var that//选择器对应jq对象
        , self = this//对象本身
        , _element//选择器
        , _eq0//选择器对象中第一个元素
        , _itemlength//选择器选择元素个数
        , _initoptions//init中的参数，因为init执行一次就会被销毁，所以外部保存init中的部分数据
        , _isremove = false//是否被删除
        , _privateFun;//私有方法
        _element = options;
        that = _element.constructor == jQuery ? _element : $(_element);
        _eq0 = that.eq(0);
        _itemlength = that.length;
        //获取基础方法
        _privateFun = new baseFun();
        var _setTitle = function (title) {
            self.container.attr("title", title);
        };
        //表示原始jq对象，既选择器选择的jq对象
        this.$ = that;
        //按钮总体容器
        this.container;
        //初始化工作，仅被执行一次
        this.init = function (options) {
            //容器（目前所有项都是以li的方式在该容器内部）
            var $container;
            _initoptions = options;
            //如果选择器前面还没有容器，则插入容器
            if (!_eq0.prev('.cr-btn').length) {
                _eq0.before(_container);
            }
            //取到总容器
            self.container = _eq0.prev('.cr-btn');
            //取到真正放元素的容器
            $container = self.container.find(".sliding-range");
            //清空
            $container.html('');
            //设置html
            _privateFun.setDom.call(that, $container);
            //默认样式中的划块，可自己改css修改样式
            $container.append(_slider);
            //设置状态class
            self.container.addClass(options.delaultVal ? "yes" : "no");
            //附加样式
            self.container.addClass(options.appendClass || "");
            //设置title
            _setTitle(options.delaultVal ? (options.trueTitle || "") : (options.flaseTitle || ""));
            //绑定效果展示click事件
            self.container.click(function (event) {
                $this = $(this);
                $this.toggleClass("yes");
                $this.toggleClass("no");
            });
            //绑定逻辑click事件
            self.container.click(function (event) {
                $this = $(this);
                if ($this.hasClass("yes")) {
                    _setTitle(options.trueTitle || "");
                    if (typeof options["trueCallback"] === "function") {
                        options["trueCallback"].call(self);
                    }
                } else {
                    _setTitle(options.falseTitle || "");
                    if (typeof options["falseCallback"] === "function") {
                        options["falseCallback"].call(self);
                    }
                }
            });
            //隐藏原有标签
            that.css("display", "none");
            //换肤
            _privateFun.setSkin.call(self.container, options.skinName);
            //销毁本身init方法
            self.init = null;
        };
        //设置false状态
        this.setFalse = this.setfalse = function () {
            if (_isremove) return;
            self.container.removeClass("yes").addClass("no");
            _setTitle(_initoptions.falseTitle || "");
            if (typeof _initoptions["falseCallback"] === "function") {
                _initoptions["falseCallback"].apply(self, arguments);
            }

        };
        //设置true状态
        this.setTrue = this.settrue = function () {
            if (_isremove) return;
            self.container.removeClass("no").addClass("yes");
            _setTitle(_initoptions.trueTitle || "");
            if (typeof _initoptions["trueCallback"] === "function") {
                _initoptions["trueCallback"].apply(self, arguments);
            }
        };
        //移除按钮
        this.remove = function (isremoveBtn) {
            _privateFun.remove.call(self, isremoveBtn);
            _isremove = true;
        };
        //隐藏按钮
        this.hide = function (callback) {
            if (_isremove) return;
            _privateFun.hide.call(self.container, callback);
        };
        //显示按钮
        this.show = function (callback) {
            if (_isremove) return;
            _privateFun.show.call(self.container, callback);
        };
        //重置（未完成）
        this.reset = function () { };
    };
    //有多个项的单选复选
    var cr = function (options) {
        var that//选择器对应jq对象
        , self = this//对象本身
        , _element//选择器
        , _type//类型，表示单选还是多选
        , _eq0//选择器对象中第一个元素
        , _itemlength//选择器选择元素个数
        , _isremove = false//是否被删除
        , _privateFun;//私有方法
        _element = options;
        that = _element.constructor == jQuery ? _element : $(_element);
        _eq0 = that.eq(0);
        _type = that.attr("type");
        _itemlength = that.length;
        //获取基础方法
        _privateFun = new baseFun();
        //表示原始jq对象，既选择器选择的jq对象
        this.$ = that;
        //初始化工作，仅被执行一次
        this.init = function (options) {
            //容器（目前所有项都是以li的方式在该容器内部）
            var $container;
            //如果选择器前面还没有容器，则插入容器
            if (!_eq0.prev('.cr-btn').length) {
                _eq0.before(_container);
            }
            //取到总容器
            self.container = _eq0.prev('.cr-btn');
            //附加样式
            self.container.addClass(options.appendClass || "");
            //取到真正放元素的容器
            $container = self.container.find(".sliding-range");
            //设置html
            _privateFun.setDom.call(that, $container);
            //根据类型调整皮肤名
            options.skinName = (options.type + "")[0] + "-" + options.skinName;
            //委托绑定各种事件，单选和多选展示方式不同
            if (options.type === "radio") {
                //展示效果委托
                self.container.delegate(".text:not(.noactive)", "click", function (event) {
                    var $this = $(this);
                    $container.find(".active").removeClass("active");
                    $this.toggleClass("active");
                    event.preventDefault();
                });
                //业务逻辑委托
                self.container.delegate(".text:not(.noactive)", "click", function () {
                    if (typeof options.callBack === "function") {
                        options.callBack.call(self);
                    }
                });
            } else {
                //展示效果委托
                self.container.delegate(".text:not(.noactive)", "click", function (event) {
                    var $this = $(this);
                    $this.toggleClass("active");
                    event.preventDefault();
                });
                //业务逻辑委托
                self.container.delegate(".text:not(.noactive)", "click", function () {
                    if (typeof options.callBack === "function") {
                        options.callBack.call(self);
                    }
                });
            }
            self.container.delegate(".text.noactive", "click", function (event) {
                if (typeof options.disabledCallback === "function") {
                    options.disabledCallback.call(self);
                }
                event.preventDefault();
            });
            //隐藏原有标签
            that.css("display", "none");
            //设置第一项和最后一项样式
            $container.find("li:first").addClass("cr-first");
            $container.find("li:last").addClass("cr-last");
            //设置皮肤
            _privateFun.setSkin.call(self.container, options.skinName);
            //销毁本身init方法
            self.init = null;
        };
        //获取值
        this.val = function (setval, isreset) {
            var _argumentstype = 'string|number|boolean'
            , _i;
            //是否需要先重置
            if (isreset === true) self.container.find("li[_value] .text").removeClass("active");
            //原始类型参数时，单个选中
            if (_argumentstype.indexOf(typeof setval) >= 0) {
                self.container.find("li[_value='" + (setval + "") + "'] .text").click();
                return this;
            }
            //数组类型参数
            if (setval && setval.constructor == Array) {
                //复选处理
                if (_type == "checkbox") {
                    _i = setval.length;
                    while (_i--) {
                        //这种写法是在处理大数据量时有突出表现......
                        (function (i) {
                            setTimeout(function () {
                                //确保数组内是原始类型
                                if (_argumentstype.indexOf(typeof setval[i]) >= 0) {
                                    self.container.find("li[_value='" + (setval[i] + "") + "'] .text:not(.noactive)").removeClass("active").addClass("active");
                                }
                            }, 10);
                        })(_i);
                    }
                }
                //单选处理
                if (_type == "radio") {
                    self.container.find("li[_value='" + (setval[setval.length - 1] + "") + "'] .text").click();
                }
                return this;
            }
            //对象类型（选中并修改展示文本），if条件中验证了对象是否存在需要的属性
            if (setval && setval.constructor == Object && setval.val && setval.text) {
                self.container.find("li[_value='" + (setval.val + "") + "'] .text").html(setval.text).attr("title", setval.text).click();
            }
            return getFun[_type].call(self.container);
        };
        //获取展示文本
        this.getText = function () {
            return getFun[_type + "text"].call(self.container);
        };
        //移除按钮
        this.remove = function (isremoveBtn) {
            _privateFun.remove.call(self, isremoveBtn);
            _isremove = true;
        };
        //隐藏按钮
        this.hide = function (callback) {
            if (_isremove) return;
            _privateFun.hide.call(self.container, callback);
        };
        //显示按钮
        this.show = function (callback) {
            if (_isremove) return;
            _privateFun.show.call(self.container, callback);
        };
        //重置（未完成）
        this.reset = function () { };
    };
    exports.init = function (options1, options2) {
        var $this
        , crbtn
        , _options2 = {
            type: "radio",
            skinName: "delault"
        };
        _options2 = $.extend(_options2, options2);
        if (typeof options1 === "string" || options1.constructor == jQuery) {
            _options2.element = options1
            _options2 = $.extend(_options2, options2);
        } else {
            _options2 = $.extend(_options2, options1);
        }
        //$this = _options2.element.constructor == jQuery ? _options2.element : typeof _options2.element === "string" ? $(":visible:" + _options2.type + _options2.element) : $(_options2.element);
        var btn = _factory(_options2);
        btn.init(_options2);
        return btn;
    };
});