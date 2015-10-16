define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        lib = require("lib"),
        verification = require("verification"),
        page = require("wmpage"),
        box = require("wmbox")
    ;
    var init = function () {
        verification.addRule([
            {
                key: 'sel_empty',
                fun: function () {
                    return !!(this.val() - 0 === 1);
                }
            }
        ]);
        if (global_setting && global_setting.PageInfo) {
            var _page = page.Create({
                url: global_setting.PageInfo.url + "?" + $(".user_list_search").serialize(),
                element: ".wm_page",
                index: global_setting.PageInfo.Index,
                sum: global_setting.PageInfo.TotalItems,
                size: global_setting.PageInfo.Size,
                front: true,
                param: global_setting.PageInfo.param,
                pagekey: global_setting.PageInfo.pageKey,
                across: true
            });
        }
        bind();
    };
    var bind = function () {
        var $form = $("#page");
        var _gifts_box = juicer([
            '<div class="gifts_box_head">',
                '<h3>{@if id}编辑{@else}添加{@/if}-礼物</h3>',
                '<a href="#" class="iconfont close">&#xf00b3;</a>',
            '</div>',
            '<div class="gifts_box_main">',
                '<form action="' + domains.operator + '/present/{@if id}edit{@else}add{@/if}">',
                    '<div class="wm_form">',
                        '<ul>',
                            '<li class="form_row">',
                                '<label class="row_key"><b class="form_must">*</b>礼物标题：</label>',
                                '<input type="text" class="form_txt" name="title" value="${name}" wmv="empty" wmvmsg="礼物标题不能为空！" />',
                            '</li>',
                            '<li class="form_row">',
                                '<label class="row_key"><b class="form_must">*</b>礼物类型：</label>',
                                '<select class="form_sel gifts_type" wmv="sel_empty" wmvmsg="暂时只能添加商品！">',
                                    '<option value="0">-请选择-</option>',
                                    '<option value="1">商品</option>',
                                    '<option value="2">代金卷</option>',
                                '</select>',
                            '</li>',
                            '<li class="form_row gifts_type_main"></li>',
                            '<li class="form_row getway_list">',
                                '<label class="row_key"><b class="form_must">*</b>获取途径：</label>',
                                '<div class="floatleft">',
                                    '<input type="checkbox" name="${m}" id="${m}_reg" value="1" /><label class="chk_key" for="${m}_reg">注册</label>',
                                '</div>',
                            '</li>',
                            '<li class="form_row">',
                                '<label class="row_key">QQ：</label>',
                                '<input type="text" class="form_txt" name="sellerqq" value="${qq}" />',
                            '</li>',
                            '<li class="form_row">',
                                '<label class="row_key">备注：</label>',
                                '<textarea class="form_textarea w500" name="remark" value="${remark}">${remark}</textarea>',
                            '</li>',
                        '</ul>',
                    '</div>',
                    '<div class="btns">',
                        '<a href="#" class="close">取消</a><input type="submit" class="submit" value="确定">',
                        '<input type="hidden" name="id" value="${id}" />',
                    '</div>',
                '</form>',
            '</div>'
        ].join(''));   
        var gifts_type = {
            //商品礼物配置
            "1": juicer([
                '<fieldset>',
                    '<legend>商品</legend>',
                    '<p style="border: 1px solid #ffcc7f;background-color: #ffffe5;width: 90%;margin: 10px auto;padding-left: 10px;">礼物商品库存数据将不受正常销售影响！</p>',
                    '<ul>',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>商品ID：</label>',
                            '<input type="text" class="form_txt w50 cid" name="productid" value="${product_id}" />',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key">商家ID：</label><span class="cuid">${seller_id}</span>',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key">商家名称：</label><span class="cuname">${seller_name}</span>',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key">商品名称：</label><a href="' + domains.item + '/${product_id}.html" class="floatleft w410 cname" target="_blank">${product_name}</a>',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>礼品数量：</label>',
                            '<input type="text" class="form_txt w50 csum" name="presentcount" value="${sum}" wmv="positiveInteger" wmvmsg="请填写正确的数量！" />',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key">推广商品：</label>',
                            '<div class="floatleft" style="width: 100%">',
                                '<ul class="promotion_list">',
                                    '{@each promotion as item}',
                                    '<li class="promotion_item">',
                                        '<input type="text" class="form_txt w50 promotion_id" placeholder="商品Id" value="${item}" /><a href="#" target="_blank" class="comm_link"></a>',
                                        '<a href="#" class="iconfont remove_item">&#xf0155;</a>',
                                    '</li>',
                                    '{@/each}',
                                '</ul>',
                                '<a href="#" class="add_promotion">添加推广商品</a>',
                                '<input type="hidden" class="promotion_data" name="promotion" />',
                            '</div>',
                        '</li>',
                    '</ul>',
                '</fieldset>'
            ].join('')),
            //代金券礼物配置
            "2": juicer([
                '<fieldset>',
                    '<legend>代金券</legend>',
                    '<ul>',
                        '<li class="form_row">',
                            '<p style="border: 1px solid #ffcc7f;background-color: #ffffe5;width: 90%;margin: 10px auto;padding-left: 10px;">代金券系统正在开发</p>',
                        '</li>',
                    '</ul>',
                '</fieldset>'
            ].join(''))
        };
        var emptyGiftsData = function () {
            this.find(".cid").val("");
            this.find(".cuid").empty();
            this.find(".cuname").empty();
            this.find(".cname").attr("href", "").empty();
        };
        var createGiftsBox = function (op) {
            return box.invBox({
                boxCls: "gifts_box",
                content: _gifts_box.render($.extend({ m: "chk_m_" + parseInt(Math.random() * 9999) }, op)),
                callback: function () {
                    var self = this;
                    var $promotion_list = this.wmBox.find(".promotion_list");
                    this.close = function () {
                        verification.hideTips(self.wmBox);
                        self.hide();
                    };
                    //商品类型联动
                    this.wmBox.find(".gifts_type").on("change", function () {
                        var $this = $(this), _v = $this.val();
                        self.wmBox.find(".gifts_type_main").empty().append(gifts_type[_v].render(op && op.gifts_data));
                        self.position();
                        verification.hideTips(self.wmBox);
                    });
                    //根据商品ID获取礼物信息
                    this.wmBox.on("change", ".cid", function () {
                        var _v = $(this).val(), _sum = self.wmBox.find(".csum").val();
                        if (_v) {
                            $.ajax({
                                url: "http://operator.tcsh.me/asyn/product/product_with_sellerinfo.json",
                                dataType: "jsonp",
                                data: {
                                    product_id: _v
                                },
                                success: function (data) {
                                    if (data.response.data) {
                                        self.wmBox.find(".gifts_type_main").find(".cid").val(data.response.data.product_id);
                                        self.wmBox.find(".gifts_type_main").find(".cuid").empty().append(data.response.data.seller_id);
                                        self.wmBox.find(".gifts_type_main").find(".cuname").empty().append(data.response.data.seller_name);
                                        self.wmBox.find(".gifts_type_main").find(".cname").attr("href", domains.item + "/" + data.response.data.product_id + ".html").empty().append("product_name");
                                    } else {
                                        alert(data.response.error.message || "服务器繁忙");
                                        emptyGiftsData.call(self.wmBox.find(".gifts_type_main"));

                                    }
                                },
                                error: function () {
                                    alert("服务器繁忙");
                                    emptyGiftsData.call(self.wmBox.find(".gifts_type_main"));
                                }
                            });
                        } else {
                            emptyGiftsData.call(self.wmBox.find(".gifts_type_main"));
                        }
                    });
                    this.wmBox.on("change", ".promotion_id", function () {
                        var $this = $(this), _v = $this.val(), $promotion_item = $this.closest(".promotion_item");
                        if (_v) {
                            $.ajax({
                                url: "http://operator.tcsh.me/asyn/product/product_with_sellerinfo.json",
                                dataType: "jsonp",
                                data: {
                                    product_id: _v
                                },
                                success: function (data) {
                                    if (data.response.data) {
                                        $promotion_item.find(".comm_link").attr("href", domains.item + "/" + data.response.data.product_id + ".html").empty().append(data.response.data.seller_name);
                                        $promotion_item.data("promotion_item", { product_id: data.response.data.product_id, seller_name: data.response.data.seller_name });
                                    } else {
                                        alert("无效的商品ID");
                                        $this.val('');
                                        $promotion_item.data("promotion_item", 0);
                                    }
                                },
                                error: function () {
                                    $this.val('');
                                    alert("服务器繁忙");
                                    $promotion_item.data("promotion_item", 0);
                                }
                            });
                        } else {
                            $promotion_item.find(".comm_link").attr("href", "").empty();
                            $promotion_item.data("promotion_item", 0);
                        }
                    });
                    //提交
                    this.wmBox.on("click", ".submit", function () {
                        if (verification.verify(self.wmBox)) {
                            var _promotion_data = [];
                            self.wmBox.find(".promotion_item").each(function () {
                                var _promotion_item = $(this).data("promotion_item");
                                _promotion_item && _promotion_data.push(_promotion_item.product_id);
                            });
                            self.wmBox.find(".promotion_data").val(JSON.stringify(_promotion_data));
                            return true
                        }
                        return false;
                    });
                    //添加推广
                    this.wmBox.on("click", ".add_promotion", function () {
                        if (!$promotion_list.length) {
                            $promotion_list = self.wmBox.find(".promotion_list")
                        }
                        $promotion_list.append([
                            '<li class="promotion_item">',
                                '<input type="text" class="form_txt w50 promotion_id" placeholder="商品Id" /><a href="#" target="_blank" class="comm_link"></a>',
                                '<a href="#" class="iconfont remove_item">&#xf0155;</a>',
                            '</li>'
                        ].join(''));
                        return false;
                    });
                    //移除推广
                    this.wmBox.on("click", ".remove_item", function () {
                        var $this = $(this).closest(".promotion_item");
                        $this.fadeOut(function () {
                            $this.remove();
                        });
                        return false;
                    });
                    if (op) {
                        //初始化
                        //礼物类别
                        this.wmBox.find(".gifts_type").val(op.type).change();
                        //根据商品id取数据
                        this.wmBox.find(".cid").change();
                        //礼物获取途径
                        for (var i in op.getway) {
                            this.wmBox.find(".getway_list [value='" + op.getway[i] + "']").attr("checked", "checked");
                        }
                        this.wmBox.find(".promotion_item").length && this.wmBox.find(".promotion_id").change();
                        typeof op.callback === "function" && op.callback.call(this);
                    }
                    verification.minZIndex = self.wmBox.css("z-index");
                    
                }
            });
        };

        $form.on("click", ".show_details", function () {
            var $this = $(this),
               $tr = $this.closest("tr"),
               gifts_box = $this.data("gifts_box");
            if (!gifts_box) {
                gifts_box = createGiftsBox({
                    id: $tr.attr("data_id"),
                    name: $tr.attr("data_name"),
                    type: $tr.attr("data_type"),
                    gifts_data: {
                        product_id: $tr.attr("data_product_id"),
                        sum: $tr.attr("data_present_count"),
                        promotion: $tr.data("promotion")
                    },
                    getway: $tr.attr("data_getway").split(","),
                    remark: $tr.attr("data_remark"),
                    qq: $tr.attr("data_qq"),
                    callback: function () {
                        this.wmBox.find(".btns,.add_promotion,.remove_item").remove();

                    }
                });
                $this.data("gifts_box", gifts_box);
            }
            gifts_box.show();
            return false;
        });
        //添加礼物
        $form.on("click", ".add_gifts", function () {
            var $this = $(this), gifts_box = $this.data("gifts_box");
            if (!gifts_box) {
                gifts_box = createGiftsBox();
                $this.data("gifts_box", gifts_box);
            }
            gifts_box.show();
            return false;
        });
        //编辑礼物
        $form.on("click", ".edit_gifts", function () {
            var $this = $(this),
                $tr = $this.closest("tr"),
                gifts_box = $this.data("gifts_box");
            if (!gifts_box) {
                gifts_box = createGiftsBox({
                    id: $tr.attr("data_id"),
                    name: $tr.attr("data_name"),
                    type: $tr.attr("data_type"),
                    gifts_data: {
                        product_id: $tr.attr("data_product_id"),
                        sum: $tr.attr("data_present_count"),
                        promotion: $tr.data("promotion")
                    },
                    getway: $tr.attr("data_getway").split(","),
                    remark: $tr.attr("data_remark"),
                    qq: $tr.attr("data_qq")
                });
                $this.data("gifts_box", gifts_box);
            }
            gifts_box.show();
            return false;
        });
        ////下架礼物
        //$form.on("click", ".down_gifts", function () {
        //    $.ajax({
        //        url: "",
        //        dataType: "json",
        //        data: {},
        //        success: function () { },
        //        error: function () {
        //            alert("系统繁忙！");
        //        }
        //    });
        //    return false;
        //});

        //$form.on("click", ".up_gifts", function () {
        //    $.ajax({
        //        url: "",
        //        dataType: "json",
        //        data: {},
        //        success: function () { },
        //        error: function () {
        //            alert("系统繁忙！");
        //        }
        //    });
        //    return false;
        //});
    };
    init();

});