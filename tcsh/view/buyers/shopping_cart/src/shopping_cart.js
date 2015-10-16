define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        box = require("wmbox"),
        lib = require("lib"),
        collection = require("wmcollection"),
        tips = require("wmtips");
    var _global_setting;
    _global_setting = global_setting;
    //_global_setting.shopping_cart_already = 40;
    //_global_setting.shopping_cart_max = 50;
    var $page = $(".main_con");
    var statPayMoney = function () {
        var $pay_money_sum = $page.find(".pay_money_sum");
        var _pay_money_sum = 0, _i;
        $page.find(".comm_item").each(function () {
            var $this = $(this);
            if ($this.find(".chk:checked").length) {
                _pay_money_sum += parseInt(($this.attr("pay_money") - 0 || 0) * 100);
            }
        });
        _pay_money_sum = _pay_money_sum / 100 + "";
        _i = _pay_money_sum.lastIndexOf(".");
        if (_i < 0) {
            _pay_money_sum = _pay_money_sum + ".00";
        }
        $pay_money_sum.empty().append('￥' + _pay_money_sum);
    };
    var init = function () {
        var _v = _global_setting.shopping_cart_already / _global_setting.shopping_cart_max * 100;
        var $pipes_water = $page.find(".pipes_water");
        $page.find(".money_sum").empty();
        if (_v >= 80) {
            $pipes_water.css({ "background-position": "0 -20px" });
        }
        $pipes_water.animate({ width: _v + "%" }, 800);
        statPayMoney();
        bind();
    };
    var bind = function () {
        var _amountKeyDowm;
        var getRecordList = function () {
            var _item = juicer([
                '{@each response as item}',
                '<li>',
                    '<img src="${item.ProductImgDefault}" class="user_img" title="${item.ProductName}">',
                    '<span>￥${item.SalePrice}</span>',
                    '<span><b>[${item.BrandName}]</b>${item.ProductName}</span>',
                '</li>',
                '{@/each}'].join(''));
            var ids = lib.cookie("pdt_ids");
            if (ids) {
                ids = ids.split('|');
                for (var i in ids) {
                    ids[i] = "id=" + ids[i];
                }
                $.ajax({
                    url: domains.cart+"/product/viewed?" + ids.join("&"),
                    type: "get",
                    dataType: "jsonp",
                    success: function (data) {
                        if (data.response) {
                            for (var i in data.response) {
                                data.response[i].ProductName = decodeURIComponent(data.response[i].ProductName);
                                data.response[i].BrandName = decodeURIComponent(data.response[i].BrandName);
                            }
                            $page.find(".record_list .record_list").empty().append(_item.render(data));
                        }
                    }
                });
            }
        };
        var upAmount = function () {
            var $this = $(this);
            var _v = parseInt(($this.find(".amount").val() - 0) <= 0 ? 1 : ($this.find(".amount").val() - 0)), _v = _v||1
                _commId = $this.closest(".comm_item").attr("comm_id");
            $.ajax({
                url:domains.cart+ '/cart/item/update',
                type: "get",
                data: {
                    count: _v,
                    id: _commId
                },
                cache:false,
                dataType: "json",
                success: function (data) {
                    //data = {
                    //    response: {
                    //        actual_purchase: _v,
                    //        pay_money: parseInt(Math.random() * 999) + 10
                    //    }
                    //}
                    $this.find(".amount").val(data.response.count);
                    $this.attr("pay_money", data.response.price);
                    $this.find(".pay_money").empty().append((data.response.price * data.response.count).toFixed(2));
                    //$this.find(".pay_postage").empty().append("含邮费：" + data.response.postage);
                    statPayMoney();
                },
                error: function () {
                    var data = {
                        response: {
                            actual_purchase: _v,
                            pay_money: parseInt(Math.random() * 999) + 10,
                            postage: parseInt(Math.random() * 9) + 10
                        }
                    }
                    $this.find(".amount").val(data.response.actual_purchase);
                    $this.attr("pay_money", data.response.pay_money);
                    $this.find(".pay_money").empty().append(data.response.pay_money);
                    $this.find(".pay_postage").empty().append("含邮费：" + data.response.postage);
                    statPayMoney();
                }
            });
        };
        //加入收藏异常处理
        var _keepError = function (msg) {
            var $this = this, errorTips;
            errorTips = $this.data("errorTips");
            if (!errorTips) {
                errorTips = new tips({
                    ele: $this,
                    con: '<p><i class="wm_ico sigh1" style="margin-right:10px"></i>' + (msg || '收藏失败！@码农，赶快处理！') + '</p>',
                    close: 2000,
                    direction: 'lt',
                    skin: "red2",
                    offset: {
                        top: 2
                    }
                });
                $this.data("errorTips", errorTips);
            }
            errorTips.show();
        };
        $page.find(".allchk").on("change",function () {
            var $this = $(this);
            if ($this.attr("checked")) {
                $page.find(".chk:not(.chk_pay_afterward):enabled").attr("checked", "checked");
            } else {
                $page.find(".chk:not(.chk_pay_afterward):enabled").removeAttr("checked");
            }
        });
        $page.find(".brands_chk").on("change",function () {
            var $this = $(this), $shopping_cart_item = $this.closest(".shopping_cart_item");
            if ($this.attr("checked")) {
                $shopping_cart_item.find(".chk").attr("checked", "checked");
            } else {
                $shopping_cart_item.find(".chk").removeAttr("checked");
            }
        });
        $page.find(".chk").on("change", function () {
            var $this = $(this), $shopping_cart_item;
            if (!$this.attr("checked")) {
                $shopping_cart_item = $this.closest(".shopping_cart_item")
                $page.find(".allchk").removeAttr("checked");
                $shopping_cart_item.find(".brands_chk").removeAttr("checked");
            }
            if (!$(".chk:not(.chk_pay_afterward):checked").length) {
                $(".go_order_confrim").attr("class", "ui_btn ui_btn_h35gray4 go_order_confrim");
            } else {
                $(".go_order_confrim").attr("class", "ui_btn ui_btn_h35yellow9 go_order_confrim");

            }
        });
        $page.find(".amount").on("change",function () {
            upAmount.call($(this).closest(".comm_item"));
        });
        $page.find(".chk_pay_afterward").on("change", function () {
            var $this = $(this), thisTips;
            if ($this.attr("checked")) {
                $(".shopping_cart_item:not([afterward_pay])").each(function () {
                    var $this = $(this);
                    $this.find(".chk").removeAttr("checked").attr("disabled", "disabled");
                });
                thisTips = $this.data("thisTips");
                if (!thisTips) {
                    thisTips = new tips({
                        ele: $this,
                        con: '<p><i class="wm_ico hook2" style="margin-right:10px"></i>以排除不支持货到付款的商品！</p>',
                        close: 2000,
                        direction: 'tc',
                        offset: {
                            top: -5,
                            left: 50
                        }
                    });
                    $this.data("thisTips", thisTips);
                }
                thisTips.show();
            } else {
                $(".shopping_cart_item").each(function () {
                    var $this = $(this);
                    $this.find(".chk:disabled").removeAttr("disabled");
                });
            }
            statPayMoney();
        });
        $page.on("keydown", ".amount", function () {
            var $this = $(this);
            if ($this.val().length > 6) {
                return false;
            }
            _amountKeyDowm = setTimeout(function () {
                $this.blur();
            }, 400);
        });
        $page.on("keyup", ".amount", function () {
            var $this = $(this);
            clearInterval(_amountKeyDowm);
        });
        $page.on("click", ".changetxt_btn", function () {
            var $this = $(this), _v = $this.attr("basesum") - 0, $txt = $this.closest(".comm_item").find(".amount");
            var _txtVal = $txt.val() - 0 + _v;
            _txtVal = _txtVal <= 0 ? 1 : _txtVal;
            setTimeout(function () {
                if ($txt.val() == _txtVal) {
                    upAmount.call($this.closest(".comm_item"));
                }
            }, 600);
            $txt.val(_txtVal);
            return false;
        });
        $page.on("click", ".collection", function () {
            var $this = $(this), businessId = $this.closest(".shopping_cart_item").attr("business_id"), thisTips;
            collection.collectBusiness({
                id: businessId,
                success: function (data) {
                    if (data.response) {
                        thisTips = $this.data("thisTips");
                        if (!thisTips) {
                            thisTips = new tips({
                                ele: $this,
                                con: '<p><i class="wm_ico hook2" style="margin-right:10px"></i>收藏成功！</p>',
                                close: 2000,
                                direction: 'lt',
                                offset: {
                                    top: 2
                                }
                            });
                            $this.data("thisTips", thisTips);
                        }
                        thisTips.show();
                    }
                    else {
                        _keepError.call($this, "请不要重复收藏！");
                    }

                },
                error: function () {

                    _keepError.call($this);
                }
            });
            return false;
        });
        $page.on("click", ".del_comm_item", function () {
            var $this = $(this), $parendBox = $this.closest(".shopping_cart_item"), del_confirm = $this.data("del_confirm");
            if (!del_confirm) {
                del_confirm = box.relyBox({
                    boxCls: 'del_confirm',
                    rely: $this,
                    content: "<p>确定要删除此商品吗？<br/>删除后将无法恢复！</p>",
                    btns: [
                        {
                            cls: "ui_btn_h22red10", res: "sure", text: "确定", callback: function () {
                                $.ajax({
                                    url: '/cart/remove',
                                    type: 'get',
                                    data: {
                                        id: $this.closest(".comm_item").attr("comm_id")
                                    },
                                    dataType: 'json',
                                    success: function (data) {
                                        if (data) {
                                            var _tips = new tips({
                                                ele: $this,
                                                con: '<p><i class="wm_ico hook2" style="margin-right:10px"></i>删除成功！</p>',
                                                close: 1000,
                                                direction: 'lt',
                                                offset: {
                                                    top: 2
                                                }
                                            });
                                            _tips.show();
                                            setTimeout(function () {
                                                _tips.close();
                                                $this.closest(".comm_item").fadeOut(400, function () {
                                                    $(this).remove();
                                                    if (!$parendBox.find(".comm_item").length) {
                                                        $parendBox.remove();
                                                    }
                                                });
                                            }, 1000);
                                        }
                                        else {
                                            var _tips = new tips({
                                                ele: $this,
                                                con: '<p>删除失败！</p>',
                                                close: 1000,
                                                direction: 'lt',
                                                offset: {
                                                    top: 2
                                                }
                                            });
                                            _tips.show();
                                        }
                                        //对接的时候把异常处理代码复制进来
                                    },
                                    error: function () {
                                        var _tips = new tips({
                                            ele: $this,
                                            con: '<p>删除失败！</p>',
                                            close: 1000,
                                            direction: 'lt',
                                            offset: {
                                                top: 2
                                            }
                                        });
                                        _tips.show();
                                    }
                                });
                            }
                        },
                        { cls: "ui_btn_h22gray6", res: "close", text: "取消" }
                    ],
                    callback: function () {
                        this.close = this.hide;
                    }
                });
                $this.data("del_confirm", del_confirm);
            }
            del_confirm.show();
            return false;
        });
        $page.on("click", ".del_comm_more", function () {
            var $this = $(this), $delItems, ids = [], errtips;
            $delItems = $(".comm_list .chk:checked");
            $delItems.each(function () {
                ids.push("id=" + $(this).closest("tr").attr("comm_id"));
            });
            if (!ids.length) {
                errtips = $this.data("errtips");
                if (!errtips) {
                    errtips = new tips({
                        ele: $this,
                        con: '<p><i class="wm_ico sigh1" style="margin-right:10px"></i>请选择商品！</p>',
                        close: 2000,
                        direction: 'tc',
                        offset: {
                            top: -5
                        }
                    });
                    $this.data("errtips", errtips);
                }
                errtips.show();
                return false;
            }
            if (confirm("确定要删除选中的商品吗？\n删除后将无法恢复！")) {
                $.ajax({
                    url: '/cart/remove?' + ids.join("&"),
                    type: 'get',
                    dataType: 'json',
                    success: function () {
                        window.location.href = window.location.href;
                        //对接的时候把异常处理代码复制进来
                    },
                    error: function () {
                        window.location.href = window.location.href;
                    }
                });
            }
            return false;
        });
        $page.on("click", ".collection_more", function () {
            var $this = $(this), $shopping_cart_item, thisTips, ids = [], errtips;
            $shopping_cart_item = $(".shopping_cart_item");
            $shopping_cart_item.each(function () {
                var $this = $(this);
                if ($this.find(".chk:checked").length) {
                    ids.push("ids=" + $this.attr("business_id"));
                    $this.find(".collection").click();
                }
            });
            if (!ids.length) {
                errtips = $this.data("errtips");
                if (!errtips) {
                    errtips = new tips({
                        ele: $this,
                        con: '<p><i class="wm_ico sigh1" style="margin-right:10px"></i>请选择店铺！</p>',
                        close: 2000,
                        direction: 'tc',
                        offset: {
                            top: -5
                        }
                    });
                    $this.data("errtips", errtips);
                }
                errtips.show();
                return false;
            }

            //$.ajax({
            //    url: '?' + ids.join("&"),
            //    type: "get",
            //    dataType: "json",
            //    success: function (data) {
            //        //对接的时候把异常处理代码复制进来
            //    },
            //    error: function () {
            //        thisTips = $this.data("thisTips");
            //        if (!thisTips) {
            //            thisTips = new tips({
            //                ele: $this,
            //                con: '<p><i class="wm_ico sigh1" style="margin-right:10px"></i>批量收藏，正在开发中......！</p>',
            //                close: 2000,
            //                direction: 'tc',
            //                offset: {
            //                    top: -5
            //                }
            //            });
            //            $this.data("thisTips", thisTips);
            //        }
            //        thisTips.show();
            //    }
            //});
            return false;
        });
        $page.on("click", ".go_order_confrim", function () {
            var $this = $(this);
            var _id = [], postData = {}, _bid = {}, _arrbid = [];
            $page.find(".comm_item").each(function () {
                var $this = $(this), $chk = $this.find(".chk:checked"), bid;
                if ($chk.attr("checked")) {
                    _id.push('id=' + $this.attr("comm_id"));
                    bid = $this.attr("business_id");
                    _bid[bid] = bid;
                }
            });
            if ($page.find(".comm_item .chk").length === $page.find(".comm_item .chk:checked").length) {
                postData.selectall = true
            } else {
                for (var i in _bid) {
                    _arrbid.push("bid=" + i);
                }
            }
            postData.cod = !!$page.find("#pay_afterward:checked").length;
            if (_id.length) {
                lib.verificationLogin(function () {
                    window.location.href = domains.order+"/order/perpare/cart?" + _id.join("&") + "&" + _arrbid.join("&") + "&" + $.param(postData);
                });
            }
            return false;
        });
        $page.on("click", ".tab_key", function () {
            var $this = $(this), $box = $this.closest(".shopping_bott_box");
            $box.find(".curr").removeClass("curr");
            $box.find(".tab_key").attr("class", "tab_key");
            $this.closest("li").addClass("curr");
            $this.attr("class", "ui_btn ui_btn_h29red11 tab_key");
            $box.attr("class", "shopping_bott_box " + $this.attr("data_key"));
            switch ($this.attr("data_key")) {
                case "record_list":
                    getRecordList();
                    break;
            }
            return false;
        });
    };
    init();
});
