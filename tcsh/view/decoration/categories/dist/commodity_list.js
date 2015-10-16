define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        page = require('wmpage'),
        juicer = require('juicer'),
        box = require('wmbox');
    var g_ShopClassData;
    var initShopClassData = function (callback) {
        var data = {
            100000: {
                id: 100000,
                name: "全部",
                itemList: {},
                isCustom: false
            },
            110000: {
                id: 110000,
                name: "未分组",
                itemList: {},
                isCustom: false
            },
            120000: {
                id: 120000,
                name: "自定义1级分组1",
                itemList: {
                    120100: {
                        id: 120100,
                        name: "自定义2级分组1.1",
                        itemList: {}
                    },
                    120200: {
                        id: 120200,
                        name: "自定义2级分组1.2",
                        itemList: {}
                    },
                    120300: {
                        id: 120300,
                        name: "自定义2级分组1.3",
                        itemList: {}
                    }
                },
                isCustom: true
            },
            130000: {
                id: 130000,
                name: "自定义1级分组2",
                itemList: {
                    130100: {
                        id: 130100,
                        name: "自定义2级分组2.1",
                        itemList: {}
                    },
                    130200: {
                        id: 130200,
                        name: "自定义2级分组2.2",
                        itemList: {}
                    },
                    130300: {
                        id: 130300,
                        name: "自定义2级分组2.3",
                        itemList: {}
                    }
                },
                isCustom: true
            },
            140000: {
                id: 140000,
                name: "自定义1级分组3",
                itemList: {},
                isCustom: true
            }
        };
        g_ShopClassData = data;
        typeof callback === "function" && callback(data);
    };
    //初始化类别
    var initClass = function () {
        $.ajax({
            url: domains.api+"/category/brand/" + global_setting.brand_id,
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                var _data = data;
                var $classparent = $(".classparent").empty();
                $classparent.data("data_class", data);
                var $class = $(".classthis").empty();
                $class.append('<option value="0">--请选择--</option>');
                $classparent.append('<option value="0">--请选择--</option>');
                for (var i in _data) {
                    $classparent.append('<optgroup value="' + i + '" label="' + _data[i].name + '"></optgroup>')
                }
                $classparent.find('optgroup').each(function () {
                    var $this = $(this), _val = $this.attr("value");
                    var list = _data[_val].itemList;
                    for (i in list) {
                        $this.append('<option value="' + i + '">' + list[i].name + '</option>');
                    }
                });
            }, error: function () {
                alert("getSubordinateList  Error !")
            }
        });
    };
    //初始化店铺分类
    var initShopClass = function () {
        initShopClassData(function (data) {
            var $shop_class1 = $(".shop_class1"), _arr = [];
            $shop_class1.data("data_class", data);
            $shop_class1.empty().append('<option value="0">--请选择--</option>');
            $(".shop_class2").empty().append('<option value="0">--请选择--</option>');
            for (var i in data) {
                _arr.push('<option value="' + i + '">' + data[i].name + '</option>');
            }
            $shop_class1.append(_arr.join(''));
        });
    };
    var init = function () {
        initClass();
        initShopClass();
        if (global_setting && global_setting.PageInfo) {
            var _page = page.Create({
                url: global_setting.PageInfo.url || domains.sell+'/product/list',
                element: ".wm_page",
                index: global_setting.PageInfo.Index,
                sum: global_setting.PageInfo.TotalItems,
                size: global_setting.PageInfo.Size,
                front: true,
                pagekey: global_setting.PageInfo.pageKey,
                param: global_setting.PageInfo.WhereDic
            });
        }
        bind();
    };
    var bind = function () {
        var $form = $("#page"),
            $class = $form.find(".classthis"),
            $shop_class2 = $form.find(".shop_class2");
        var _group_list = juicer([
            '{@each data as item}',
            '{@if item.isCustom}',
            '<li class="group_item" data_id="${item.id}">',
                '<span class="iconfont chk">&#xf00b2;</span>',
                '<label>${item.name}</label>',
                '<ul class="sub_group_list">',
                    '{@each item.itemList as subitem}',
                    '<li class="sub_group_item" data_id="${subitem.id}">',
                        '<span class="iconfont chk">&#xf00b2;</span>',
                        '<label>${subitem.name}</label>',
                    '</li>',
                    '{@/each}',
                '</ul>',
            '</li>',
            '{@/if}',
            '{@/each}'
        ].join(''));
        //商品类型联动
        $form.on("change.classType", ".classparent", function () {
            var $this = $(this), _val = $this.val();
            var _data = $this.data("data_class");
            var s2 = _val.substr(0, 2);
            var subData = _data[s2 + "0000"].itemList[_val].itemList;
            $class.empty().append('<option value="0">--请选择--</option>');
            for (var i in subData) {
                $class.append('<option value="' + i + '">' + subData[i].name + '</option>');
            }
            return false;
        });
        //店铺分类联动
        $form.on("change.classType", ".shop_class1", function () {
            var $this = $(this), _val = $this.val();
            var _data = $this.data("data_class");
            var subData = _data[_val].itemList;
            $shop_class2.empty().append('<option value="0">--请选择--</option>');
            for (var i in subData) {
                $shop_class2.append('<option value="' + i + '">' + subData[i].name + '</option>');
            }
            return false;
        });
        //设置分组
        $form.on("click", ".set_group", function () {
            var $this = $(this), setBox = $this.data("setBox");
            if (!setBox) {
                setBox = box.relyBox({
                    rely: $this,
                    boxCls: "group_box",
                    content: _group_list.render({ data: g_ShopClassData }),
                    btns: [],
                    callback: function () {
                        this.close = this.hide;
                        this.wmBox.on("click", ".sub_group_item", function () {
                            $(this).find(".chk").toggleClass("chked");
                            return false;
                        });
                        this.wmBox.on("click", ".chk", function () {
                            $(this).toggleClass("chked");
                            return false;
                        });
                        this.wmBox.on("click", ".showhide", function () {
                            var $this = $(this), $group_item = $this.closest(".group_item");
                            $group_item.toggleClass("hide");
                            if ($group_item.hasClass("hide")) {
                                $this.empty().append('&#xf0175;');
                            } else {
                                $this.empty().append('&#xf0175;');
                            }
                            return false;
                        });
                        this.wmBox.find(".group_item").each(function () {
                            var $this = $(this);
                            if ($this.find(".sub_group_list .sub_group_item").length) {
                                $this.find(".chk:eq(0)").replaceWith('<span class="iconfont showhide">&#xf0176;</span>');
                            }
                        });
                        
                    }
                });
                $this.data("setBox", setBox);
            }
            setBox.show();
            return false;
        });
    };
    init();
});
