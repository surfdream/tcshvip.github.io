define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        juicer = require('juicer'),
        box = require('wmbox'),
        page = require('wmpage');

    var init = function () {
        var _page = page.Create({
            url: global_setting.PageInfo.url || domains.sell + '/product/list',
            element: ".wm_page",
            index: global_setting.PageInfo.Index,
            sum: global_setting.PageInfo.TotalItems,
            size: global_setting.PageInfo.Size,
            front: true,
            pagekey: global_setting.PageInfo.pageKey,
            param: global_setting.PageInfo.WhereDic
        });

        bind();

    };
    var bind = function () {
        var $page = $("#page"),
            $body = $("body")
        ;
        var _comm_item = juicer([
            '{@each items as item}',
            '<li class="comm_item">',
                '<a href="#" class="chk_comm_item" data_id="${item.id}" data_img="${item.productImgDefault}" data_name="${item.productName}" data_code="${item.goodsId}" data_inventory="${item.stockCount}">',
                    '<img src="${item.productImgDefault}">',
                    '<span class="comm_name">名称：${item.productName}</span>',
                    '<span class="comm_code">货号：${item.goodsId}</span>',
                    '<span class="comm_inventory">库存：${item.stockCount}</span>',
                    '<b class="iconfont">&#xe60c;</b>',
                '</a>',
            '</li>',
            '{@/each}'
        ].join(''));
        var _curr_comm_item = juicer([
            '{@each list as item}',
            '{@if item}',
            '<li class="comm_item">',
                '<a href="#" class="remove_curr curr" data_id="${item.id}">',
                    '<img src="${item.img}">',
                    '<span class="comm_name">名称：${item.name}</span>',
                    '<span class="comm_code">货号：${item.goodsId}</span>',
                    '<span class="comm_inventory">库存：${item.stockCount}</span>',
                    '<b class="iconfont">&#xe60c;</b>',
                '</a>',
            '</li>',
            '{@/if}',
            '{@/each}'
        ].join(''));
        var chkObject = function () {
            var self = this;
            var _dataArr = [], _dataObj = {};
            this.data = _dataObj;
            this.length = 0;
            this.push = function (data) {
                if (!_dataObj[data.id]) {
                    _dataObj[data.id] = data;
                    _dataArr.push(data);
                    self.length = _dataArr.length;
                    return true;
                }
                return false;
            };
            this.remove = function (id) {
                if (_dataObj[id]) {
                    _dataObj[id] = null;
                    for (var i in _dataArr) {
                        if (_dataArr[i].id == id) {
                            _dataArr.splice(i, 1);
                            self.length = _dataArr.length;
                            return true;
                        }
                    }
                }
                return false;
            };
            this.getIds = function () {
                var _ids = [];
                for (var i in _dataObj) {
                    _dataObj[i] && _ids.push(i);
                }
                return _ids;
            };
        };
        $page.on("click", ".comm_to_cr", function () {
            var $this = $(this),
                my_comm = $this.data("my_comm"),
                $tr = $this.closest("tr"),
                _commune_id = $tr.attr("data_commune_id");
            if (!my_comm) {
                my_comm = box.alert({
                    boxCls: 'crowd_box my_comm',
                    titleText: '我的商品',
                    content: [
                        '<div class="comm_main">',
                            '<ul class="search_form wm_form">',
                                '<li class="form_row no_wrap">',
                                    '<label class="row_key">关键字：</label>',
                                    '<input type="text" class="form_txt search_key" placeholder="名称/货号" />',
                                '</li>',
                                '<li class="form_row no_wrap">',
                                    '<label class="row_key">商品类型：</label>',
                                    '<select class="form_sel classparent">',
                                        '<option value="0">-请选择-</option>',
                                    '</select>',
                                    '<select class="form_sel classthis">',
                                        '<option value="0">-请选择-</option>',
                                    '</select>',
                                '</li>',
                                '<li class="form_row">',
                                    '<label class="row_key">&nbsp;</label>',
                                    '<a href="#" class="ui_btn ui_btn_h24green4 search_submit"><span class="ui_btn_txt">查询</span></a>',
                                '</li>',
                            '</ul>',
                            '<div class="curr_length" title="以选择的商品"><span class="iconfont">&#xf0178;</span><b class="count">0</b></div>',
                            '<ul class="comm_list"></ul>',
                            '<div class="wm_page"></div>',
                            '<div class="btns">',
                                '<a href="#" class="ui_btn ui_btn_h26blue2 submit_all"><span class="ui_btn_txt">提交所有</span></a>',
                                '<a href="#" class="ui_btn ui_btn_h26blue2 submit_chk"><span class="ui_btn_txt">提交选择</span></a>',
                                '<a href="#" class="ui_btn ui_btn_h26white6 close"><span class="ui_btn_txt">取消</span></a>',
                            '</div>',
                            '<div class="curr_box">',
                                '<a href="#" class="return_list"><span class="iconfont">&#xf0007;</span>返回列表</a>',
                                '<ul class="curr_list"></ul>',
                            '</div>',
                        '</div>',
                    ].join(''),
                    btns: [],
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        var classList,
                            _zindex = this.wmBox.css("z-index"),
                            _chkObject = new chkObject();
                        var $comm_list = this.wmBox.find(".comm_list"),
                            $curr_length = this.wmBox.find(".curr_length"),
                            $curr_box = this.wmBox.find(".curr_box"),
                            $curr_list = $curr_box.find(".curr_list"),
                            $count = $curr_length.find(".count"),
                            $class = this.wmBox.find(".classthis"),
                            $search_key = this.wmBox.find(".search_key");
                        //选中已选商品
                        var chkCurr = function () {
                            $comm_list.find(".curr").removeClass("curr");
                            for (var i in _chkObject.data) {
                                _chkObject.data[i] && $comm_list.find(".chk_comm_item[data_id='" + _chkObject.data[i].id + "']").addClass("curr");
                            }
                        };
                        //商品分类
                        $.ajax({
                            url: domains.api + "/category/brand/" + global_setting.brand_id,
                            type: "get",
                            dataType: "jsonp",
                            success: function (data) {
                                var _data = classList = data;
                                var $classparent = $(".classparent").empty();
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
                            },
                            error: function () {
                                alert("getSubordinateList  Error !")
                            }
                        });
                        var initData = function (op) {
                            op = $.extend(op, {});
                            //商品数据
                            $.ajax({
                                url: domains.api2 + "/product/merchant/show_batch.json",
                                dataType: "jsonp",
                                data: {
                                    category_id: op.category_id,
                                    key: op.key,
                                    page_size: 18,
                                    page_no: 1
                                },
                                success: function (data) {
                                    if (data.response) {
                                        $comm_list.empty().append(_comm_item.render(data.response.data));
                                        // 异步分页
                                        var _page = page.Create({
                                            url: domains.api2 + "/product/merchant/show_batch.json",
                                            async: true,
                                            size: 18,
                                            index: 1,
                                            sum: data.response.data.totalItem,
                                            pagekey: "page_no",
                                            dataType: "jsonp",
                                            front: true,
                                            param: {
                                                size: 18,
                                                totalcount: data.response.data.totalItem,
                                                key: op.key,
                                                category_id: op.category_id
                                            },
                                            success: function (data) {
                                                $comm_list.empty().append(_comm_item.render(data.response.data));
                                                _page.setIndex(this.index);
                                                chkCurr();
                                            },
                                            error: function () {
                                                alert("系统繁忙，请稍后再试！");
                                            }
                                        });
                                        chkCurr();
                                    }
                                },
                                error: function () {
                                    alert("系统繁忙，请稍后再试！");
                                }
                            });
                        };
                        initData();
                        //选择商品
                        this.wmBox.on("click", ".chk_comm_item", function () {
                            var $this = $(this),
                                $img,
                                _offset,
                                _curr_lengthoffset,
                                _img = $this.attr("data_img")
                            _id = $this.attr("data_id");
                            $(this).toggleClass("curr");
                            if ($this.hasClass("curr")) {
                                _curr_lengthoffset = $curr_length.offset();
                                _chkObject.push({
                                    id: _id,
                                    img: _img,
                                    name: $this.attr("data_name"),
                                    code: $this.attr("data_code"),
                                    inventory: $this.attr("data_inventory")
                                });
                                _offset = $this.offset();
                                $img = $('<img src="' + _img + '" style="border: 1px solid #f60;position: absolute;top:' + (_offset.top + 5) + 'px;left:' + (_offset.left + 5) + 'px;width:70px;height:70px;z-index:' + (_zindex + 100) + '">');
                                $body.append($img);
                                $img.animate({
                                    top: _curr_lengthoffset.top + 50,
                                    left: _curr_lengthoffset.left,
                                    width: 40,
                                    height: 40
                                }, function () {
                                    $img.animate({
                                        top: _curr_lengthoffset.top
                                    }).fadeOut(function () {
                                        $img.remove();
                                    });
                                });

                            } else {
                                _chkObject.remove(_id);
                            }
                            $count.empty().append(_chkObject.length);
                            return false;
                        });
                        //商品类型联动
                        this.wmBox.on("change.classType", ".classparent", function () {
                            var $this = $(this),
                                _val = $this.val(),
                                _data = classList,
                                s2,
                                subData;
                            if (_val-0) {
                                s2 = _val.substr(0, 2);
                                subData = _data[s2 + "0000"].itemList[_val].itemList;
                                $class.empty().append('<option value="' + _val + '">--请选择--</option>');
                                for (var i in subData) {
                                    $class.append('<option value="' + i + '">' + subData[i].name + '</option>');
                                }
                            } else {
                                $class.empty().append('<option value="0">--请选择--</option>');
                            }
                            return false;
                        });
                        //显示已选商品
                        this.wmBox.on("click", ".curr_length", function () {
                            $curr_list.empty().append(_curr_comm_item.render({ list: _chkObject.data }));
                            $curr_box.animate({
                                left: 0
                            });
                            return false;
                        });
                        //返回选择列表
                        this.wmBox.on("click", ".return_list", function () {
                            chkCurr();
                            $curr_box.animate({
                                left: 800
                            });
                            return false;
                        });
                        //移除已选商品
                        this.wmBox.on("click", ".remove_curr", function () {
                            var $this = $(this),
                                _id = $this.attr("data_id");
                            _chkObject.remove(_id);
                            $this = $this.closest(".comm_item");
                            $this.fadeOut(function () {
                                $this.remove();
                            });
                            $count.empty().append(_chkObject.length);
                            return false;
                        });
                        //提交所有商品
                        this.wmBox.on("click", ".submit_all", function () {
                            $.ajax({
                                url: domains.seller + "/asyn/commune/commit_all_products.json",
                                data: {
                                    communeId: _commune_id
                                },
                                traditional: true,
                                success: function (data) {
                                    if (data.response) {
                                        alert("提交成功！");
                                        window.location.reload();
                                    } else {
                                        alert(data.error || "提交失败！");
                                    }
                                },
                                error: function () {
                                    alert("系统繁忙！");
                                }

                            });
                            return false;
                        });
                        //提交选择商品
                        this.wmBox.on("click", ".submit_chk", function () {
                            $.ajax({
                                url: domains.seller + "/asyn/commune/commit_products.json",
                                data: {
                                    communeId: _commune_id,
                                    product_id: _chkObject.getIds()
                                },
                                traditional: true,
                                success: function (data) {
                                    if (data.response) {
                                        alert("提交成功！");
                                        window.location.reload();
                                    } else {
                                        alert(data.error || "提交失败！");
                                    }
                                },
                                error: function () {
                                    alert("系统繁忙！");
                                }

                            });
                            return false;
                        });
                        //搜索
                        this.wmBox.on("click", ".search_submit", function () {
                            initData({
                                key: $.trim($search_key.val()),
                                category_id: $class.val()
                            });
                            return false;
                        });
                    }
                });
                $this.data("my_comm", my_comm);
            }
            my_comm.show();
            return false;
        });
    };
    init();
});
