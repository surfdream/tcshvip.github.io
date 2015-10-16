/*
分类数据选择
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js")
    juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
    box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js')
    ;
    require('http://s.tcsh.me/tcsh/model/wmclassbox/css/style.css');
    var gData;
    var createBox = function (data) {
        var _html = juicer([
            '<div class="chk_class_head">',
                '<a href="#" class="close">×</a>',
                '<h3>选择分类</h3>',
            '</div>',
            '<div class="wm_class">',
                '<ul class="wm_class_list">',
                '{@each classList as list,index}',
                    '<li class="class_item clearfix">',
                        '<span class="floatleft w110 class_no1_name">',
                            '<input type="checkbox" class="chk_item class_item_no1" id="class_${key}_${index}" data_name="${list.name}" data_id="${index}" /><label class="chk_key" for="class_${key}_${index}"><b>${list.name}</b></label>',
                        '</span>',
                        '<div class="floatleft w910 classlist" data_ids="{@each list.itemList as item,index}${index},{@/each}">',
                            '{@each list.itemList as itemList,index}',
                            '<div class="class_list_no2">',
                                '<span>',
                                    '<input type="checkbox" class="chk_item class_item_no2" data_name="${itemList.name}" data_id="${index}" id="province_${key}_${index}" />',
                                    '<label class="chk_key" for="province_${key}_${index}">${itemList.name}</label>',
                                    '<b class="sum"></b>',
                                    '<a href="#" class="wm_ico arrow9down showclass_no3"></a>',
                                '</span>',
                                '<div class="class_list_no3"><ul>',
                                    '{@each itemList.itemList as item3,index}',
                                    '<li>',
                                        '{@if ischkNo3}',
                                        '<input type="checkbox" class="chk_item class_item_no3" id="class_${key}_${index}" data_name="${item3.name}" data_id="${index}" />',
                                        '{@/if}',
                                    '<label for="class_${key}_${index}">${item3.name}</label></li>',
                                    '{@/each}',
                                '</ul><a href="#" class="class_no3hide">×</a></div>',
                            '</div>',
                           '{@/each}',
                        '</div>',
                    '</li>',
                    '{@/each}',
                '</ul>',
            '</div>',
            '<div class="btns">',
               '<a href="#" class="ui_btn ui_btn_h27gray8 submit"><span class="ui_btn_txt">确定</span></a>',
            '</div>',
        ].join(''));
        _html = $(_html.render(data));
        _html.find()
        return _html;
    };
    var init = function (callback) {
        $.ajax({
            url: domains.api + "/category",
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                gData = data;
                typeof callback === "function" && callback(gData);
            }, error: function () {

            }
        });
    };

    var _box = function (op) {
        var self = this;
        var _box = box.invBox({
            boxCls: 'chk_class_box',
            content: createBox({
                key: parseInt(Math.random() * 999999),
                classList: gData || {},
                ischkNo3: op.ischkNo3
            }),
            callback: function () {
                this.close = this.hide;
                //一级分类
                this.wmBox.on("change", ".class_item_no1", function () {
                    var $this = $(this), $class_item = $this.closest(".class_item");
                    if ($this.attr("checked")) {
                        $class_item.find(".class_item_no2:enabled").attr("checked", "checked").change();
                    } else {
                        $class_item.find(".class_item_no2:enabled").removeAttr("checked").change();
                    }
                });
                //显示3级
                this.wmBox.on("click", ".showclass_no3", function () {
                    var $this = $(this), $wm_class = $this.closest(".wm_class");
                    $wm_class.find(".class_list_no2_showclass_no3").removeClass("class_list_no2_showclass_no3");
                    $this.closest(".class_list_no2").addClass("class_list_no2_showclass_no3");
                    return false;
                });

                this.wmBox.on("change", ".class_item_no2", function () {
                    var $this = $(this),
                        $class_list_no2 = $this.closest(".class_list_no2"),
                        $class_list_no1 = $class_list_no2.closest(".class_item")
                    ;
                    if ($this.attr("checked")) {
                        $class_list_no2.find(".class_item_no3:enabled").attr("checked", "checked");
                    } else {
                        $class_list_no2.find(".class_item_no3:enabled").removeAttr("checked");
                    }
                });
                this.wmBox.on("change", ".class_item_no3", function () {
                    var $this = $(this),
                        $class_list_no2 = $this.closest(".class_list_no2")
                    ;
                    //3级选中个数和3级总个数相同判断为全选
                    if ($class_list_no2.find(".class_item_no3").length === $class_list_no2.find(".class_item_no3:checked").length) {
                        $class_list_no2.find(".class_item_no2").attr("checked", "checked");
                    } else {
                        $class_list_no2.find(".class_item_no2").removeAttr("checked");
                    }
                });

                //计算个数
                this.wmBox.on("change", ".class_item_no2,.class_item_no3", function () {
                    var $this = $(this),
                        $class_list_no2 = $this.closest(".class_list_no2"),
                        $sum = $class_list_no2.find(".sum"),
                        _labellength = $class_list_no2.find("label").length,
                        _chklength = $class_list_no2.find(".class_item_no3:checked").length;
                    $sum.empty();
                    if (op.ischkNo3) {
                        _chklength && $sum.append("(" + _chklength + ")");
                    } else {
                        $this.attr("checked") && $sum.append("(" + _labellength + ")");
                    }

                });
                this.wmBox.on("click", ".class_no3hide", function () {
                    var $this = $(this);
                    $this.closest(".class_list_no2_showclass_no3").removeClass("class_list_no2_showclass_no3");
                    return false;
                });
                this.wmBox.on("click", ".submit", function () {
                    var $this = $(this);
                    self.hide();
                    typeof op.submitCallback === "function" && op.submitCallback.call(self);
                    return false;
                });
            }
        });
        var _classData = {
            "1": function () {
                var _retData = {};
                self.wmBox.find(".class_item_no1").each(function () {
                    var $this = $(this),
                        _id = $this.attr("data_id");
                    if ($this.closest(".class_item").find(".classlist :checked").length) {
                        _retData[_id] = {
                            id: _id,
                            name: $this.attr("data_name")
                        }
                    }
                });
                return _retData;
            },
            "2": function () {
                var _retData = {
                    relevanceData: {},
                    data: {}
                };
                self.wmBox.find(".class_item_no2:checked").each(function () {
                    var $this = $(this),
                        _id = $this.attr("data_id"),
                        $no1 = $this.closest(".class_item").find(".class_item_no1"),
                       _no1Id = $no1.attr("data_id"),
                       _no1Name = $no1.attr("data_name");
                    if (!_retData.relevanceData[_no1Id]) {
                        _retData.relevanceData[_no1Id] = {
                            id: _no1Id,
                            name: _no1Name,
                            itemList: {}
                        }
                    }
                    //保存关联数据和非关联数据
                    _retData.relevanceData[_no1Id].itemList[_id] = _retData.data[_id] = {
                        id: _id,
                        name: $this.attr("data_name")
                    };
                });
                return _retData;
            },
            "3": function () {
                var _retData = {
                    relevanceData: {},
                    data: {}
                };
                self.wmBox.find(".class_item_no3:checked").each(function () {
                    var $this = $(this),
                        _id = $this.attr("data_id");
                    _retData.data[_id] = {
                        id: _id,
                        name: $this.attr("data_name")
                    }
                });
                return _retData;
            }
        };
        this.hide = _box.hide;
        this.close = _box.close;
        this.wmBox = _box.wmBox;
        //获取选中的值，index从1开始计数
        this.getVal = function (index) {
            return _classData[index || 2]()
        };
        this.show = function (cb) {
            typeof op.callback === "function" && op.callback.call(self);
            typeof cb === "function" && cb.call(self);
            _box.show();
        };
        this.chked = function (ids, isreset) {
            if (isreset) {
                self.wmBox.find(".chk_item").removeAttr('checked');
                self.wmBox.find(".sum").empty();
            }
            if (typeof ids === "string") {
                ids = ids.split(',');
            }
            for (var i in ids) {
                self.wmBox.find(".chk_item[data_id='" + ids[i] + "']").attr("checked", "checked").change();
            }
        };
        this.disabled = function (ids) {
            var $chk_item;
            if (ids) {
                if (typeof ids === "string") {
                    ids = ids.split(',');
                }
                self.wmBox.find(".chk_item").removeAttr("disabled");
                for (var i in ids) {
                    $chk_item = self.wmBox.find(".chk_item[data_id='" + ids[i] + "']");
                    $chk_item.attr("disabled", "disabled");
                    $chk_item.hasClass("class_item_no1") && $chk_item.closest(".class_item").find(".chk_item").attr("disabled", "disabled");
                    $chk_item.hasClass("class_item_no2") && $chk_item.closest(".class_list_no2").find(".class_item_no3").attr("disabled", "disabled");
                }
                self.wmBox.find(".class_list_no2").each(function () {
                    var $this = $(this);
                    if ($this.find(".class_item_no3").length && $this.find(".class_item_no3:disabled").length === $this.find(".class_item_no3").length) {
                        $this.find(".class_item_no2").attr("disabled", "disabled");
                    }
                });
                self.wmBox.find(".class_item").each(function () {
                    var $this = $(this);
                    if ($this.find(".class_item_no2").length && $this.find(".class_item_no2:disabled").length === $this.find(".class_item_no2").length) {
                        $this.find(".class_item_no1").attr("disabled", "disabled");
                    }
                });
            }
        }
        typeof op.callback === "function" && op.callback.call(this);
    };
    init();
    /*
    ischkNo3        bool        三级是否可选
    callback        function    显示前的回调
    submitCallback  function    确定按钮的回调
    */
    exports.createBox = function (op) {
        return new _box($.extend({
            ischkNo3: true
        }, op));
    };
    exports.data = function (callback) {
        if (gData) {
            typeof callback === "function" && callback(gData);
        } else {
            init(callback);
        }
    };
});
