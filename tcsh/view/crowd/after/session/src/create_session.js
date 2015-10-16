define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        box = require("wmbox"),
        page = require("wmpage"),
        classbox = require("classbox")
    ;
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);
    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            $type_list = $page.find(".type_list"),
            $pagebusiness_list = $page.find(".business_list"),
            $get_business_val = $page.find("#get_business_val");
        var business_box;
        //重置商家选择
        var unbusiness_box = function () {
            business_box.wmBox.remove();
            business_box = null;
            $pagebusiness_list.empty();
        };
        var _type_item_html = juicer([
            '{@each data as item}',
            '<li class="type_item" data_id="${item.id}">',
                '<div class="select_box"><span class="type_name">${item.name}</span></div>',
                '<div class="rebates_box">',
                    '扣点：<input type="text" class="form_txt rebates_txt w30" value="{@if olddata[item.id]}${olddata[item.id].rebates}{@/if}" />%',
                '</div>',
                '<a href="#" class="iconfont remove_item">&#xf00b3;</a>',
            '</li>',
            '{@/each}'
        ].join(''));
        var _business_item_html = juicer([
            '{@each data_list as item}',
            '<li class="business_item" data_id="${item.id}" data_name="${item.name}">',
                '<span class="business_name">${item.name}</span>',
                '<i class="iconfont">&#xe62a;</i>',
            '</li>',
            '{@/each}'
        ].join(''))
        //选择分类
        $page.on("click", ".add_type", function () {
            var $this = $(this),
                thisBox = $this.data("thisBox");
            if (!thisBox) {
                thisBox = classbox.createBox({
                    callback: function () {
                        var _olddata = [];
                        $type_list.find(".type_item").each(function () {
                            _olddata.push($(this).attr("data_id"));
                        });

                        _olddata.length && this.chked(_olddata, true);
                    },
                    submitCallback: function () {
                        if (business_box) {
                            if (confirm("变更数据将重置已邀请的商家，确定变更？")) {
                                unbusiness_box();
                            } else {
                                return false;
                            }
                        }
                        //3层分类数据
                        var _data = this.getVal(3).data,
                            //老数据
                            _olddata = {},
                            _get_business_val = [],
                            //2层分类数据（用于获取商家）
                            _data1 = this.getVal(1);

                        $type_list.find(".type_item").each(function () {
                            var $this = $(this),
                                _id = $this.attr("data_id"),
                                _rebates = $this.find(".rebates_txt").val();
                            _olddata[_id] = {
                                rebates: _rebates
                            };
                        });
                        $type_list.find(".type_item").remove();
                        $type_list.prepend(_type_item_html.render({ data: _data, olddata: _olddata }));
                        for (var i in _data1) {
                            _get_business_val.push(i);
                        }
                        $get_business_val.val(_get_business_val.join(','));
                    }
                });
                $this.data("thisBox", thisBox);
            }
            thisBox.show();
            return false;
        });
        //移除已有分类
        $page.on("click", ".remove_item", function () {
            var $this = $(this).closest(".type_item");
            if (business_box) {
                if (confirm("变更数据将重置已邀请的商家，确定变更？")) {
                    unbusiness_box();
                } else {
                    return false;
                }
            }
            $this.fadeOut(function () {
                $this.remove();
            });
            return false;
        });
        //批量设置扣点
        $page.on("click", ".set_rebates", function () {
            var _v = prompt("请输入批量设置的扣点值,该设置将重置所有扣点。") - 0;
            if (_v && _v >= 0) {
                $page.find(".rebates_txt").val(_v);
            }
            return false;
        });
        //选择商家
        $page.on("click", ".chk_business", function () {
            if (!business_box) {
                business_box = box.alert({
                    boxCls: "crowd_box business_box",
                    titleText: "选择可邀请商家",
                    content: [
                        '<div class="business_main">',
                            '<ul class="business_list">',
                                '<li class="loading"><i class="wm_ico loading32_32_1" style="margin-right:10px"></i>数据加载中...</li>',
                            '</ul>',
                            '<div class="wm_page"></div>',
                            '<div class="btns">',
                                '<a href="#" class="ui_btn ui_btn_h26blue2 sure_btn"><span class="ui_btn_txt">确定</span></a>',
                                '<a href="#" class="ui_btn ui_btn_h26white6 close"><span class="ui_btn_txt">取消</span></a>',
                            '</div>',
                        '</div>'
                    ].join(''),
                    btns: [],
                    callback: function () {
                        this.close = this.hide;
                        var self = this;
                        var $business_list = this.wmBox.find(".business_list");
                        $.ajax({
                            url: "",
                            dataType: "json",
                            success: function () { },
                            error: function () {
                                var data = {
                                    success: {
                                        totalcount: 999,
                                        page: 40,
                                        data_list: [
                                            {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "品位之家家居专营店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "朗琦官方旗舰店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "瓷善汇家居直营店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "百鸟峥茗群星专卖店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "吉客旗舰店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "布布宝贝婴儿洗护专卖店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "娜塔莎旗舰店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "发派旗舰店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "山鸟家居旗舰店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "典缀旗舰店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "八喜"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "忆往昔旗舰店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "品位之家家居专营店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "朗琦官方旗舰店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "瓷善汇家居直营店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "百鸟峥茗群星专卖店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "吉客旗舰店"
                                            }, {
                                                id: parseInt(Math.random() * 9999) + 10000,
                                                name: "布布宝贝婴儿洗护专卖店"
                                            }
                                        ]
                                    }
                                };
                                $business_list.empty().append(_business_item_html.render(data.success));
                                // 异步分页
                                var _page = page.Create({
                                    url: "http://www.baidu.com",
                                    async: true,
                                    size: 18,
                                    index: data.success.page || 1,
                                    sum: data.success.totalcount,
                                    pagekey: "page",
                                    dataType: "json",
                                    front: true,
                                    param: {
                                        size: 18,
                                        totalcount: data.success.totalcount
                                    },
                                    success: function (data) {
                                        $business_list.empty().append(_business_item_html.render(data.success));
                                        _page.setIndex(this.index);

                                    },
                                    error: function () {
                                        alert("系统繁忙，请稍后再试！");
                                    }
                                });
                            }
                        });

                        this.wmBox.on("click", ".business_item", function () {
                            $(this).toggleClass("curr");
                            return false;
                        });

                        this.wmBox.on("click", ".sure_btn", function () {
                            var _html = [];
                            self.wmBox.find(".business_item.curr").each(function () {
                                var $this = $(this);
                                _html.push('<li class="business_item" data_id="' + $this.attr("data_id") + '" data_name="' + $this.attr("data_name") + '">' + $this.attr("data_name") + '<a class="wm_ico fork2  remove_business" href="#"></a></li>')
                            });
                            $pagebusiness_list.empty().append(_html.join(''));
                            self.close();
                            return false;
                        });
                    }
                });
            }
            business_box.show();

            return false;
        });
        //日历插件
        var _baseDate = new Date().getTime();
        $page.find(".show_date").datepicker({
            minDate: new Date(_baseDate),
            onClose: function (data, e) {
                if (!(/\d{4}-\d{2}-\d{2}/.test(data))) {
                    e.input.val('');
                }
                setTimeout(function () {
                    verification.verify(e.input.parent());
                }, 500);
            }
        });
    };
    init();
});