/*
分页
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    /*
    参数说明：
    $element，分页容器
    isStart,分页模式
    index，当前页(Create接口有效)
    start，当前页起始条数（CreateStartPage接口有效）
    size，每页显示条数
    sum，记录总条数
    url，跳转路劲
    param,URL中携带参数
    showItemLength，显示分页个数
    pagekey，url中代表分页参数的键
    front，是否有前置，当index大于显示个数时，最前方出现1...
    across，是否有跳转项功能(Create接口有效)
    async，是否异步分页
    dataType,请求类型，默认json，可按jq的ajax配置来配置
    success，异步分页的情况下，异步请求正常返回回调函数
    error，异步分页的情况下，异步请求异常回调函数
    实例属性说明：
    以上属性实例中均存在
    pageItemLength，总页数
    restItem，重置分页（方法）
    setIndex，设置分页项（方法），接收一个数值的参数
    */
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js");
    var juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js");
    var _link = juicer('<a href="${_href}" class="page_link" value="${dataval}">${val}</a>'),
     _before = juicer('<a href="${_href}" class="page_before page_link" value="${dataval}">${val}</a>'),
     _next = juicer('<a href="${_href}" class="page_next page_link" value="${dataval}">${val}</a>'),
     _btnto1 = juicer('<a href="${_href}" class="page_link" value="${dataval}">${val}</a>');
    require('http://s.tcsh.me/tcsh/model/wmpage/css/style.css#')
    var _$ = function (t) {
        return t instanceof $ ? t : $(t);
    };
    var pageBase = function (op) {
        var i;
        if (!op) return;
        this.$element = _$(op.element || ".wm_page")
        this.index = (op.index - 0) || 1;
        this.start = (op.start - 0) || 0;
        this.size = (op.size - 0) || 20;
        this.sum = (op.sum-0) || 1;
        this.url = op.url || '';
        this.showItemLength = (op.showItemLength-0) || 5;
        this.pagekey = op.pagekey || "page";
        if (this.sum && this.size) {
            i = this.sum / this.size;
            this.pageItemLength = parseInt(i) === i ? i : parseInt(i) + 1
        };
    };
    //同步分页
    var page = function (op) {
        var _html, pingItem;
        var self = this;
        //拼url
        var pingurl = function (val) {
            var _url = self.url, _data;
            _url += _url.indexOf('?') >= 0 ? "&" : "?";
            _data = $.extend({}, op.param);
            _data[self.pagekey] = val;
            _url += $.param(_data);
            return _url;
        };
        //拼html
        if (op.isStart) {
            //start模式
            pingItem = function () {
                var i, _html = [], _i, x, _index = parseInt((self.start || 0) / self.size) + 1;
                i = self.pageItemLength > self.showItemLength ? self.showItemLength : self.pageItemLength;
                if (self.start / self.size != parseInt(self.start / self.size)) {
                    i += 1;
                    _index += 1;
                }
                //总页数
                _html.push('<span>共' + self.pageItemLength + '页</span>');
                //当前页是第一页的时候 前一页按钮无效
                if (self.start > 0) {
                    _html.push(_before.render({ "_href": pingurl(self.start - self.size < 0 ? 0 : self.start - self.size), "dataval": self.start - self.size < 0 ? 0 : self.start - self.size, "val": "<" }));
                } else {
                    _html.push(_before.render({ "_href": "javascript:void(0);", "dataval": "javascript:void(0);", "val": "<" }));
                }
                if (op.front && _index >= self.showItemLength) {
                    _html.push(_btnto1.render({ "_href": pingurl(0), "dataval": "0", "val": "1" }));
                    _html.push('<span class="ellipsis">...</span>');
                }
                //末尾项
                if (_index > self.pageItemLength - self.showItemLength) {
                    //能显示的页数少于需要显示的页数
                    _i = self.pageItemLength - self.showItemLength <= 0 ? 0 : self.pageItemLength - self.showItemLength;
                    _index = _index > self.pageItemLength ? self.pageItemLength : _index;
                    for (; _i < self.pageItemLength; _i++) {
                        x = _i + 1
                        if (x == _index) {
                            _html.push('<b>' + x + '</b>');
                        } else {
                            _html.push(_link.render({ "_href": pingurl((x - 1) * self.size), "dataval": (x - 1) * self.size, "val": x }));
                        }
                    }
                } else {
                    //index处于最前面几项
                    if (_index < self.showItemLength) {
                        for (_i = 0; _i < i ; _i++) {
                            x = _i + 1;
                            if (x == _index) {
                                _html.push('<b>' + _index + '</b>');
                            } else {
                                _html.push(_link.render({ "_href": pingurl((x - 1) * self.size), "dataval": (x - 1) * self.size, "val": x }));
                            }
                        }
                    } else {
                        //index处于中间项
                        for (_i = -1; _i < i - 1; _i++) {
                            x = _index + _i;
                            if (x == _index) {
                                _html.push('<b>' + _index + '</b>');
                            } else {
                                _html.push(_link.render({ "_href": pingurl((x - 1) * self.size), "dataval": (x - 1) * self.size, "val": x }));
                            }
                            if (x > self.pageItemLength - 1) {
                                i = Number.MAX_VALUE;
                                break;
                            }
                        }
                    }
                    i < self.pageItemLength && _html.push('<span class="ellipsis">...</span>');
                }
                //尾部省略号
                if (_index + 1 > self.pageItemLength) {
                    _html.push(_next.render({ "_href": "javascript:void(0);", "dataval": "javascript:void(0);", "val": ">" }));
                } else {
                    x = _index + 1;
                    _html.push(_next.render({ "_href": pingurl(self.start + self.size), "dataval": self.start + self.size, "val": ">" }));
                }
                //跳转项
                //op.across && _html.push('<span>跳转至</span><input type="text" class="page_txt" /><span>页</span><input type="button" value="确定" />');
                return _html.join('');
            };
        } else {
            //pageIndex模式
            pingItem = function () {
                var i, _html = [], _i, x;
                i = self.pageItemLength > self.showItemLength ? self.showItemLength : self.pageItemLength;
                //总页数
                _html.push('<span>共' + self.pageItemLength + '页</span>');
                //当前页是第一页的时候 前一页按钮无效
                if (self.index - 1 > 0) {
                    _html.push(_before.render({ "_href": pingurl(self.index - 1), "dataval": self.index - 1, "val": "<" }));
                } else {
                    _html.push(_before.render({ "_href": "javascript:void(0);", "dataval": "javascript:void(0);", "val": "<" }));
                }
                if (op.front && self.index > self.showItemLength) {
                    _html.push(_btnto1.render({ "_href": pingurl(1), "dataval": "1", "val": "1" }));
                    _html.push('<span class="ellipsis">...</span>');
                }
                //末尾项
                if (self.index > self.pageItemLength - self.showItemLength) {
                    //能显示的页数少于需要显示的页数
                    _i = self.pageItemLength - self.showItemLength <= 0 ? 0 : self.pageItemLength - self.showItemLength;
                    self.index = self.index > self.pageItemLength ? self.pageItemLength : self.index;
                    for (; _i < self.pageItemLength; _i++) {
                        x = _i + 1
                        if (x == self.index) {
                            _html.push('<b>' + x + '</b>');
                        } else {
                            _html.push(_link.render({ "_href": pingurl(x), "dataval": x, "val": x }));
                        }
                    }
                } else {
                    //index处于最前面几项
                    if (self.index < self.showItemLength) {
                        for (_i = 0; _i < i ; _i++) {
                            x = _i + 1;
                            if (x == self.index) {
                                _html.push('<b>' + self.index + '</b>');
                            } else {
                                _html.push(_link.render({ "_href": pingurl(x), "dataval": x, "val": x }));
                            }
                        }
                    } else {
                        //index处于中间项
                        for (_i = -1; _i < i - 1; _i++) {
                            x = self.index + _i;
                            if (x == self.index) {
                                _html.push('<b>' + self.index + '</b>');
                            } else {
                                _html.push(_link.render({ "_href": pingurl(x), "dataval": x, "val": x }));
                            }
                            if (x > self.pageItemLength - 1) {
                                i = Number.MAX_VALUE;
                                break;
                            }
                        }
                    }
                    i < self.pageItemLength && _html.push('<span class="ellipsis">...</span>');
                }
                //尾部省略号
                if (self.index + 1 > self.pageItemLength) {
                    _html.push(_next.render({ "_href": "javascript:void(0);", "dataval": "javascript:void(0);", "val": ">" }));
                } else {
                    x = self.index + 1;
                    _html.push(_next.render({ "_href": pingurl(x), "dataval": x, "val": ">" }));
                }
                //跳转项
                op.across && _html.push('<span>跳转至</span><input type="text" class="pageacross_txt" /><span>页</span><input type="button" class="pageacross_btn" value="确定" />');
                return _html.join('');
            };
        }
        //继承
        pageBase.apply(this, arguments);
        //异常处理
        if (!this.url) {
            throw "pageModel url parameter is null or undefined";
        }
        _html = pingItem();
        this.$element.each(function () {
            $(this).empty().append(_html);
        });
        this.$element.on("click", ".pageacross_btn", function () {
            var pageacross_txt = $(this).parent().find(".pageacross_txt");
            var _v = $.trim(pageacross_txt.val()) - 0;
            if (_v) {
                window.location.href = pingurl(_v);
            } else {
                alert("异常翻页！");
                pageacross_txt.val('').focus();
            }
            return false;
        })
        this.restItem = function () {
            var _html = pingItem();
            self.$element.each(function () {
                $(this).empty().append(_html);
            });
        };
        this.setIndex = function (index) {
            self.index = index
            var $newindex, $newindexnext, $newindexbefore, $b;
            var _nextindex = index + 1, _beforeindex = index - 1;
            _nextindex = _nextindex > self.pageItemLength ? self.pageItemLength : _nextindex;
            _beforeindex = _beforeindex < 1 ? 1 : _beforeindex;
            $newindex = self.$element.find('.page_link:not(.page_before):not(.page_next)[value="' + index + '"]');

            $b = self.$element.find("b");
            if ($newindex.length) {
                $b.replaceWith(_link.render({ "_href": pingurl($b.html()), "dataval": $b.html(), "val": $b.html() }));
                $newindex.replaceWith('<b>' + self.index + '</b>');
            }
            $newindexnext = self.$element.find('.page_link:not(.page_before):not(.page_next)[value="' + _nextindex + '"]');
            $newindexbefore = self.$element.find('.page_link:not(.page_before):not(.page_next)[value="' + _beforeindex + '"]');
            if (!$newindexnext.length || !$newindexbefore.length) {
                this.restItem();
            }
            self.$element.find(".page_before").replaceWith(_before.render({ "_href": index === _beforeindex ? "javascript:void(0);" : pingurl(_beforeindex), "dataval": _beforeindex, "val": "<" }));
            self.$element.find(".page_next").replaceWith(_next.render({ "_href": index === _nextindex ? "javascript:void(0);" : pingurl(_nextindex), "dataval": _nextindex, "val": ">" }));
        };
    };
    //异步分页
    var asyncPage = function (op) {
        var _page = new page(op);
        _page.$element.off("click.page").on("click.page", ".page_link", function () {
            var $this = $(this), _url = $this.attr("href"), callObj = {};
            if (_url.indexOf("?") < 0) { return false; }
            callObj.index = $.trim($this.attr("value")) - 0;
            var _ajax = {
                url: _url,
                type: "get",
                dataType: op.dataType || "json",
                success: function (data) {
                    if (typeof op.success === "function") {
                        op.success.call(callObj, data);
                    }
                },
                error: function () {
                    if (typeof op.error === "function") {
                        op.error.call(callObj);
                    }
                }
            };
            if (typeof op.ajaxAgo === "function") {
                op.ajaxAgo(callObj) && $.ajax(_ajax);
            } else {
                $.ajax(_ajax);
            }
            return false
        });
        return _page;
    };
    exports.Create = function (op) {
        if (op.async) {
            return new asyncPage(op);
        } else {
            return new page(op);
        }
    };
    exports.CreateStartPage = function (op) {
        op.isStart = true;
        return exports.Create(op);
        //op.isStart = true;
        //if (op.async) {
        //    return new asyncPage(op);
        //} else {
        //    return new page(op);
        //}
    };
});