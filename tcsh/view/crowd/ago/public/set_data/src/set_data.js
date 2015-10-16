define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
		box = require("http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js"),
        juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
        upload = require('http://s.tcsh.me/tcsh/model/wmupload/dist/wmupload.js'),
        lib = require("http://s.tcsh.me/tcsh/model/lib/dist/lib.js"),
        page = require('http://s.tcsh.me/tcsh/model/wmpage/dist/wmpage.js'),
        crowd_data = require('http://s.tcsh.me/tcsh/view/public/wm_crowd_data/dist/crowd_data.js'),
        showartwork = require('http://s.tcsh.me/tcsh/model/wmshowartwork/dist/wmshowartwork.js')
    ;
    require('../css/style.css#');
    var init = function () {
        var $body = $("body");
        var _offset
        ;
        if (lib.queryString("edit_comm")) {
            $body.append('<div id="setdata_mask"></div>');
            $(".crowd_adv").each(function () {
                var $this = $(this),
                    _demo_folder = $this.attr("data_demo_folder"),
                    _imgs = $this.attr("data_demo_imgs").split(','),
                    _materialdata = {},
                    _offset = $this.offset();
                var $mask = $('<div class="sd_box_mask" style="top:' + _offset.top + 'px;left:' + _offset.left + 'px;width:' + $this.outerWidth() + 'px;height:' + $this.outerHeight() + 'px"></div>');
                $mask.append([
                    '<a href="#" class="edit_btn iconfont opacity_btn" title="透明显示">&#xf00e9;</a>',
                    '<a href="#" class="edit_btn iconfont material" title="素材案例">&#xe62f;</a>',
                    '<a href="#" class="edit_btn iconfont edit_data" title="配置">&#xf013e;</a>'
                ].join(''));
                if (!_demo_folder || !_imgs.length) {
                    $mask.find(".material").remove();
                }
                _materialdata.folder = _demo_folder;
                _materialdata.imgs = _imgs;
                _materialdata.page = $this.attr("data_page");
                _materialdata.location = $this.attr("data_location");
                $mask.data("materialdata", _materialdata);
                $body.append($mask);
            });
        }
        bind();
    };
    var bind = function () {
        var $page = $("body");
        var g_data = {
            comm: {},
            old_comm: {}
        };
        var boss_box = juicer([
            '<a href="#" class="return_prev "><< 返回</a>',
            '<fieldset>',
                '<legend>入驻商家</legend>',
                '<ul class="boss_list">',
                    '{@each data as item}',
                    '<li class="boss_item" data_id="${item.id.sellerId}">',
                        '<a href="#" class="init_comm_list" data_id="${item.id.sellerId}">',
                            '<img src="${item.logo}">',
                            '<span class="boss_name">${item.sellerName}</span>',
                        '</a>',
                    '</li>',
                    '{@/each}',
                '</ul>',
            '</fieldset>'
        ].join(''));
        var comm_list_box = [
            '<a href="#" class="return_prev "><< 返回</a>',
            '<ul class="wm_form comm_search">',
                '<li class="form_row">',
                    '<label class="row_key">关键字：</label>',
                    '<input type="text" class="form_txt search_key" placeholder="名称/货号" />',
                '</li>',
                '<li class="form_row">',
                    '<a href="#" class="ui_btn ui_btn_h24green4 search_btn"><span class="ui_btn_txt">搜索</span></a>',
                '</li>',
            '</ul>',
            '<fieldset>',
                '<legend>可用商品</legend>',
                '<ul class="comm_list"></ul>',
            '</fieldset>',
            '<div class="wm_page"></div>'
        ].join('');
        var comm_item = juicer([
            '{@each data as item}',
            '<li class="comm_item" data_comm_id="${item.id.communeId}" data_id="${item.id.productId}">',
                '<img src="${item.productImg}" class="comm_img">',
                '<div class="comm_data">',
                    '<p class="comm_name">${item.productName}</p>',
                    '<span class="stock_box">库存：<span class="stock_val"></span></span>',
                    '<span>货号：${item.serialNum}</span>',
                    '<p class="price">￥${item.productPrice}</p>',
                '</div>',
                '<div class="btns">',
                    '<a href="' + domains.item + '/${item.id.productId}.html" target="_blank" class="ui_btn ui_btn_h22white7"><span class="ui_btn_txt">查看商品</span></a>',
                    '{@if item.using}',
                    '<a href="javascript:void(0);" class="ui_btn ui_btn_h22white7"><span class="ui_btn_txt">已配置</span></a>',
                    '{@else}',
                    '<a href="#" class="ui_btn ui_btn_h22red21 init_comm_data" data_id="${item.id.productId}"><span class="ui_btn_txt">选择商品</span></a>',
                    '{@/if}',
                '</div>',
            '</li>',
            '{@/each}'
        ].join(''))
        var edit_box = juicer([
            '<a href="#" class="return_prev "><< 返回</a>',
            '<ul class="wm_form">',
                '<li class="form_row">',
                    '<label class="row_key"><b class="form_must">*</b>标题：</label>',
                    '<input type="text" class="form_txt w500 comm_name" value="${productName}" />',
                '</li>',
                '<li class="form_row">',
                    '<label class="row_key">描述：</label>',
                    '<input type="text" class="form_txt w500 comm_description" value="${describe}" />',
                '</li>',
                '<li class="form_row">',
                    '<label class="row_key"><b class="form_must">*</b>图片：</label>',
                    '<div class="custom_img_btn">',
                        '<input type="file" class="form_file upimg" /><span class="ui_btn ui_btn_h27gray8"><span class="ui_btn_txt">上传自定义</span></span>',
                    '</div>',
                    '<div class="chkimg_box">',
                        '<fieldset>',
                            '<ul class="img_list"></ul>',
                        '</fieldset>',
                    '</div>',
                '</li>',
                '<li class="form_row">',
                    '<label class="row_key">&nbsp;</label><a href="#" class="ui_btn ui_btn_h26blue2 submit" data_id="${id}" data_post_url="${post_url}"><span class="ui_btn_txt">确定</span></a>',
                '</li>',
            '</ul>'
        ].join(''));
        var old_comm_box = juicer([
            '<a href="#" class="return_prev"><< 返回</a>',
            '<div class="limit">',
            '<table class="table_list" border="0" cellspacing="0">',
                '<thead>',
                    '<tr>',
                        '<th>图片</th>',
                        '<th>商品名称</th>',
                        '<th>库存</th>',
                        '<th>点击数</th>',
                        '<th class="w100">操作</th>',
                    '</tr>',
                '</thead>',
                '<tbody>',
                    '{@each data as item}',
                    '<tr data_id="${item.id.productId}">',
                        '<td><img src="${item.productImg}" class="comm_img"></td>',
                        '<td>${item.productName}</td>',
                        '<td>${item.stock}</td>',
                        '<td>${item.serialNum}</td>',
                        '<td>',
                            '<div class="btn_list">',
                                '<a href="#" class="ui_btn ui_btn_h23yellow8 portal init_old_comm_data" data_id="${item.id.productId}"><span class="ui_btn_txt">编辑商品<span class="wm_ico arrow6down"></span></span></a>',
                                '<ul>',
                                    '<li class="btn_list_last">',
                                        '<a href="#" class="init_old_comm_data" data_id="${item.id.productId}">编辑商品</a>',
                                    '</li>',
                                    '<li class="btn_list_end">',
                                        '<a href="#" class="delold_comm">移除</a>',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</td>',
                    '</tr>',
                    '{@/each}',
                '</tbody>',
            '</table>',
            '</div>'
        ].join(''));
        //获取商品列表
        var getCommList = function (op) {
            $.ajax({
                url: domains.commune + "/asyn/commune/products.json",
                data: {
                    sellerId: op.sellerId || "",
                    productName: op.productName || "",
                    page: op.page || 1,
                    size: op.size || 20
                },
                dataType: "jsonp",
                success: function (data) {
                    typeof op.success === "function" && op.success(data);
                },
                error: function () {
                    typeof op.error === "function" && op.error();
                }
            });
        };
        //获取已分配商品
        var getOldCommList = function (op) {
            $.ajax({
                url: domains.commune + "/service/commune/location_data.json",
                data: {
                    communeId: global_setting.communeId,
                    location: op.location,
                    page: 1,
                    size: op.size || 20
                },
                dataType: "jsonp",
                success: function (data) {
                    typeof op.success === "function" && op.success(data);
                },
                error: function () {
                    typeof op.error === "function" && op.error();
                }
            });
        };
        //获取商品详细数据
        var getCommData = function (op) {
            $.ajax({
                url: domains.api2 + "/product/list/by_ids.json",
                dataType: "jsonp",
                data: {
                    id: op.ids.join(',')
                },
                success: function (data) {
                    typeof op.success === "function" && op.success(data);
                },
                error: function () {
                    typeof op.error === "function" && op.error();
                }
            });
        };
        //透明度
        $page.on("click", ".opacity_btn", function () {
            $(this).closest(".sd_box_mask").toggleClass("opacity_mask");
            return false;
        });
        //配置
        $page.on("click", ".edit_data", function () {
            var $this = $(this),
                _edit_box = $this.data("edit_box"),
                materialdata = $this.closest(".sd_box_mask").data("materialdata");
            if (!_edit_box) {
                _edit_box = box.alert({
                    boxCls: 'crowd_box chk_data',
                    titleText: "配置",
                    content: [
                        '<div class="chk_main">',
                            '<div class="entrance_type">',
                                '<a href="#" class="entrance_item show_boss"><span class="name">选择商家</span><span class="remark">仅查找某个商家的商品</span></a>',
                                '<a href="#" class="entrance_item init_comm_list"><span class="name">选择商品</span><span class="remark">直接选择商品</span></a>',
                                '<a href="#" class="entrance_item show_oldcomm"><span class="name">已有数据</span><span class="remark">已经在页面上展示的数据</span></a>',
                            '</div>',
                            '<div class="edit_comm"></div>',
                            '<div class="boss_box"></div>',
                            '<div class="comm_box"></div>',
                            '<div class="old_comm_box"></div>',
                        '</div>'
                    ].join(''),
                    btns: [],
                    callback: function () {
                        this.close = this.hide;
                        var self = this;
                        var $boss_box = this.wmBox.find(".boss_box"),
                            $comm_box = this.wmBox.find(".comm_box"),
                            $old_comm_box = this.wmBox.find(".old_comm_box"),
                            $edit_comm = this.wmBox.find(".edit_comm"),
                            $comm_list;
                        //初始化商品列表
                        var init_comm_list = function (op) {
                            op = $.extend({}, op);
                            getCommList({
                                sellerId: op.sellerId,
                                productName: op.productName,
                                page: op.page,
                                size: op.size,
                                success: function (data) {
                                    var _ids = [];
                                    if (data.response.data) {
                                        $comm_box.animate({
                                            left: 0
                                        });
                                        $comm_box.empty().append(comm_list_box);
                                        $comm_box.find(".search_key").val(op.productName);
                                        $comm_list = $comm_box.find(".comm_list");
                                        $comm_list.empty().append(comm_item.render(data.response));
                                        for (var i in data.response.data) {
                                            g_data.comm[data.response.data[i].id.productId] = data.response.data[i];
                                            g_data.comm[data.response.data[i].id.productId].chkimg = data.response.data[i].productImgDefault;
                                            _ids.push(data.response.data[i].id.productId);
                                        }
                                        $comm_list = $comm_box.find(".comm_list");
                                        // 异步分页
                                        var _page = page.Create({
                                            url: domains.commune + "/asyn/commune/products.json",
                                            async: true,
                                            size: 20,
                                            index: 1,
                                            sum: data.response.paging.total,
                                            pagekey: "page",
                                            dataType: "jsonp",
                                            front: true,
                                            param: {
                                                size: 20,
                                                sellerId: op.sellerId,
                                                totalcount: data.response.paging.total,
                                                productName: op.productName
                                            },
                                            success: function (data) {
                                                if (data.response.data) {
                                                    $comm_list.empty().append(comm_item.render(data.response));
                                                    for (var i in data.response.data) {
                                                        g_data.comm[data.response.data[i].id.productId] = data.response.data[i];
                                                    }
                                                    _page.setIndex(this.index);
                                                } else {
                                                    alert("系统繁忙！");
                                                }
                                            },
                                            error: function () {
                                                alert("系统繁忙！");
                                            }
                                        });
                                        if (_ids.length) {
                                            getCommData({
                                                ids: _ids,
                                                success: function (data) {
                                                    var _id;
                                                    for (var i in data.response.data) {
                                                        _id = data.response.data[i].id;
                                                        g_data.comm[_id] = $.extend(g_data.comm[_id], data.response.data[i]);
                                                        $comm_list.find(".comm_item[data_id='" + _id + "'] .stock_val").empty().append(g_data.comm[_id].stockCount);
                                                    }
                                                },
                                                error: function () {
                                                    alert("获取库存失败！");
                                                }
                                            });
                                        }
                                    } else {
                                        alert("系统繁忙！");
                                    }
                                },
                                error: function (data) {
                                    alert("系统繁忙！");
                                }
                            });
                        };
                        //初始化已分配商品列表
                        var init_oldcomm_list = function () {
                            getOldCommList({
                                location: materialdata.location,
                                success: function (data) {
                                    var _ids = [];
                                    if (data.response) {
                                        $old_comm_box.animate({
                                            left: 0
                                        });
                                        $old_comm_box.empty().append(old_comm_box.render(data.response));
                                        for (var i in data.response.data) {
                                            g_data.old_comm[data.response.data[i].id.productId] = data.response.data[i];
                                            //因为数据来源是2份，而后端对象命名冲突，苦逼的前端给他们区分下
                                            g_data.old_comm[data.response.data[i].id.productId].chkimg = data.response.data[i].productImg
                                            _ids.push(data.response.data[i].id.productId);
                                        }
                                        if (_ids.length) {
                                            getCommData({
                                                ids: _ids,
                                                success: function (data) {
                                                    var _id;
                                                    for (var i in data.response.data) {
                                                        _id = data.response.data[i].id;
                                                        g_data.old_comm[_id] = $.extend(g_data.old_comm[_id], data.response.data[i]);
                                                    }
                                                },
                                                error: function () {
                                                    alert("获取库存失败！");
                                                }
                                            });
                                        }
                                    } else {
                                        alert("系统繁忙！");
                                    }
                                },
                                error: function (data) {
                                    alert("系统繁忙！");
                                }
                            });
                        };
                        //初始化商品详细
                        var init_comm_data = function (data) {
                            var $img_list, $curr, _img_arr = [];
                            if (data) {
                                $edit_comm.empty().append(edit_box.render(data));
                                $img_list = $edit_comm.find(".img_list");
                                for (var i in data.productImg) {
                                    data.productImg[i] && _img_arr.push('<li class="chkimg_item" data_img="' + data.productImg[i] + '"><img src="' + data.productImg[i] + '"><span class="iconfont">&#xe60c;</span></li>');
                                }
                                $img_list.empty().append(_img_arr.join(''));
                                if (data.chkimg) {
                                    $curr = $img_list.find(".chkimg_item[data_img='" + data.chkimg + "']");
                                    if ($curr.length) {
                                        $curr.addClass("curr");
                                    } else {
                                        $img_list.append('<li class="chkimg_item curr" data_img="' + data.chkimg + '"><img src="' + data.chkimg + '"><span class="iconfont">&#xe60c;</span></li>');
                                    }
                                }
                                $edit_comm.animate({
                                    left: 0
                                });
                            }
                        };
                        //返回
                        var return_prev = function () {
                            this.animate({
                                left: 800
                            });
                        };
                        //选择入驻商家
                        this.wmBox.on("click", ".show_boss", function () {
                            crowd_data.getBossList({
                                communeId: global_setting.communeId,
                                success: function (data) {
                                    if (data.response) {
                                        $boss_box.animate({
                                            left: 0
                                        });
                                        $boss_box.empty().append(boss_box.render(data.response));
                                        init_boss_list = function () {
                                            $boss_box.animate({
                                                left: 0
                                            });
                                        };
                                    } else {
                                        alert("获取失败！");
                                    }
                                },
                                error: function (data) {
                                    alert("系统繁忙！");
                                }
                            });
                            return false;
                        });
                        //显示已有数据
                        this.wmBox.on("click", ".show_oldcomm", function () {
                            init_oldcomm_list();
                            return false;
                        });
                        //显示可选商品
                        this.wmBox.on("click", ".init_comm_list", function () {
                            var $this = $(this);
                            init_comm_list({
                                sellerId: $this.attr("data_id")
                            });
                            return false;
                        });
                        //初始化商品数据
                        this.wmBox.on("click", ".init_comm_data", function () {
                            init_comm_data($.extend(g_data.comm[$(this).attr("data_id")], {
                                post_url: domains.commune + "/asyn/commune/commit_product.json"
                            }));
                            return false;
                        });
                        //初始化已分配商品数据
                        this.wmBox.on("click", ".init_old_comm_data", function () {
                            init_comm_data($.extend(g_data.old_comm[$(this).attr("data_id")], {
                                post_url: domains.commune + "/asyn/commune/update_product.json"
                            }));
                            return false;
                        });
                        //选择图片
                        this.wmBox.on("click", ".chkimg_item", function () {
                            $edit_comm.find(".curr").removeClass("curr");
                            $(this).addClass("curr");
                            return false;
                        });
                        //返回入口
                        this.wmBox.on("click", ".return_prev", function () {
                            return_prev.call($(this).parent());
                            return false;
                        });
                        //提交数据
                        this.wmBox.on("click", ".submit", function () {
                            var $this = $(this), _id = $this.attr("data_id");
                            $.ajax({
                                url: $this.attr("data_post_url"),
                                dataType: "json",
                                type: "post",
                                data: {
                                    productName: $edit_comm.find(".comm_name").val(),
                                    productImg: $edit_comm.find(".img_list .curr").attr("data_img"),
                                    describe: $edit_comm.find(".comm_description").val(),
                                    location: materialdata.location,
                                    productId: _id,
                                    communeId: global_setting.communeId
                                },
                                success: function (data) {
                                    if (data.response.data) {
                                        alert("设置成功！");
                                        $comm_list.find(".init_comm_data[data_id='" + _id + "']").replaceWith('<a href="javascript:void(0);" class="ui_btn ui_btn_h22white7"><span class="ui_btn_txt">已配置</span></a>');
                                        return_prev.call($edit_comm);
                                    } else {
                                        alert("设置失败！");
                                    }
                                },
                                error: function () {
                                    alert("系统繁忙！");
                                }
                            });
                            return false;
                        });
                        //查询商品
                        this.wmBox.on("click", ".search_btn", function () {
                            var $this = $(this);
                            init_comm_list({
                                productName: $comm_box.find(".search_key").val()
                            });
                            return false;
                        });
                        //上传图片
                        this.wmBox.on("change", ".upimg", function () {
                            var $this = $(this);
                            upload.upload($this, function (data) {
                                if (data.response) {
                                    $edit_comm.find(".img_list").prepend('<li class="chkimg_item" data_img="' + data.response.imgurl + '"><img src="' + data.response.imgurl + '"><span class="iconfont">&#xe60c;</span></li>');

                                }
                            });
                        });
                        //移除已有商品
                        this.wmBox.on("click", ".delold_comm", function () {
                            var $this = $(this), $tr = $this.closest("tr");
                            if (confirm("确定移除展示中的商品？\n移除后需要重新编辑才能恢复！")) {
                                $.ajax({
                                    url: domains.commune + "/asyn/commune/remove_product.json",
                                    data: {
                                        location: materialdata.location,
                                        productId: $tr.attr("data_id"),
                                        communeId: global_setting.communeId
                                    },
                                    dataType: "jsonp",
                                    success: function (data) {

                                    },
                                    error: function () { }
                                });
                            }
                            return false;
                        });
                    }
                });
                $this.data("edit_box", _edit_box);
            }
            _edit_box.show();
        });
        //查看素材
        $page.on("click", ".material", function () {
            var $this = $(this),
                $mask = $this.closest(".sd_box_mask"),
                _materialdata = $mask.data("materialdata");
            box.alert({
                boxCls: 'crowd_box material_box',
                titleText: "素材查看",
                content: juicer([
                    '<div class="material_main">',
                        '<p class="activate_msg">',
                            '<i class="iconfont">&#xf00b6;</i><b>亲爱的社长：</b>我们提供平台设计师的设计方案，便于商品图片的美化。',
                            '<span class="remark">选择图片下方的<b>源文件</b>进行下载，替换源文件的<b>商品图片</b>以及<b>文字内容</b>即可达到效果哦</span>',
                        '</p>',
                        '<ul class="material_list">',
                            '{@each imgs as url}',
                            '<li class="material_item">',
                                '<a href="#" class="showartwork" data_show_img="${folder}${url}.jpg">',
                                    '<img src="${folder}${url}.jpg">',
                                '</a>',
                                '<a href="${folder}${url}.psd">PS文件</a>',
                                '<a href="${folder}${url}.fw.png">FW文件</a>',
                            '</li>',
                            '{@/each}',
                        '</ul>',
                    '</div>'
                ].join(''), _materialdata),
                btns: [],
                callback: function () {
                    this.close = this.hide;
                    this.wmBox.on("click", ".showartwork", function () {
                        var $this = $(this), _showartwork;
                        _showartwork = $this.data("showartwork");
                        if (!_showartwork) {
                            _showartwork = showartwork.create($this.attr("data_show_img"));
                            $this.data("showartwork", _showartwork);
                        }
                        _showartwork.show();
                        return false;
                    });
                }
            });
            return false;
        });
    };
    init();
});