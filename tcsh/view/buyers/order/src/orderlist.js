define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        box = require("wmbox"),
        evaluate = require('wmevaluate'),
        sharebox = require('wmshare'),
        page = require("wmpage");
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);
    var _global_setting = global_setting;
    var init = function () {
        $(".comm_item").each(function () {
            $(this).find("tr:last").addClass("nobo");
        });
        $("#order_status").val($("#sel_order_status").val());
        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            $selStatus = $page.find("#sel_order_status"),
            $order_status = $page.find("#order_status"),
            $search_form = $page.find(".search_form"),
            $order_list = $page.find(".order_list");
        $page.find(".show_date_box").datepicker();
        if (_global_setting.current.page.totalcount) {
            var _page = page.Create({
                url: (_global_setting.current.page.url || domains.order+"/orders/myorders") + "?" + $search_form.serialize(),
                index: (_global_setting.current.page.pageindex) || 1,
                size: (_global_setting.current.page.pagesize) || 10,
                sum: (_global_setting.current.page.totalcount) || 0,
                param: _global_setting.current.page.param,
                pagekey: "pageindex",
                front: true
            });
        }
        $page.on("change", "#sel_order_status", function () {
            var _v = $(this).val();
            $order_status.val(_v);
            $search_form.submit();
        });
        //(已付款)撤销
        $page.on("click", ".revocation:not(.del_in)", function () {
            var $this = $(this), $order_item = $this.closest(".order_item");
            var reError, reTimeout;
            _content = $('<div class="confirm_main"><p class="msg"><i class="wm_ico ask1" style="margin: -5px 10px 0 0;"></i>确定要退款吗？</p><p class="remark">退款原因</p><textarea class="remark_msg"></textarea></div>');
            _confirmBox = box.alert({
                content: _content,
                boxCls: "confirm_box",
                btns: [
                    {
                        cls: "ui_btn_h37red16",
                        text: "确定",
                        callback: function () {
                            var _this = this, _remark_msg = $.trim(_this.wmBox.find(".remark_msg").val());
                            if (_remark_msg.length >= 100) {
                                alert("退款原因过长！");
                                return false;
                            }
                            $this.empty().append("撤销中").addClass("del_in");
                            $.ajax({
                                url: domains.order+"/order/apply_refund",
                                type: "get",
                                data: {
                                    orderId: $order_item.attr("orderid"),
                                    reason: encodeURIComponent(_this.wmBox.find(".remark_msg").val())
                                },
                                dataType: "json",
                                success: function (data) {
                                    _this.close();
                                    if (data.response) {
                                        if ($page.find("#sel_order_status").val() === "All") {
                                            $page.find(".search_form :submit").click();
                                        } else {
                                            $order_item.slideUp(800, function () {
                                                $order_item.remove();
                                            });
                                        }
                                    } else {
                                        reError = $this.data('reError');
                                        if (!reError) {
                                            reError = box.alert({
                                                boxCls: "orderErrbox",
                                                titleText: "系统提示",
                                                content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">订单撤销失败，请检查订单状态是否允许撤销！</p>',
                                                btns: [
                                                       { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                                                ],
                                                callback: function () {
                                                    this.wmBox.find(".close").removeClass("close").addClass("hide");
                                                }
                                            });
                                            $this.data('reError', reError);
                                        }
                                        reError.show();
                                    }
                                },
                                error: function () {
                                    reTimeout = $this.data('reTimeout');
                                    if (!reError) {
                                        reTimeout = box.alert({
                                            boxCls: "orderErrbox",
                                            titleText: "系统提示",
                                            content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">订单撤销超时，请稍后再试！</p>',
                                            btns: [
                                                   { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                                            ], callback: function () {
                                                this.wmBox.find(".close").removeClass("close").addClass("hide");
                                            }
                                        });
                                        $this.data('reTimeout', reTimeout);
                                    }
                                    reTimeout.show();
                                }
                            });

                        }
                    },
                    {
                        cls: "ui_btn_h37gray19",
                        res: "close",
                        text: "取消",
                        callback: function () { }
                    }
                ],
                callback: function () {
                    this.close = this.hide;
                }
            });
            return false;
        });
        //(未付款)撤销
        $page.on("click", ".revocation2", function () {
            var $this = $(this), $order_item = $this.closest(".order_item");
            var reError, reTimeout;
            if (confirm("确定要撤销订单吗？")) {
                $.ajax({
                    url: "/order/cancel",
                    type: "get",
                    data: {
                        orderId: $order_item.attr("orderid")
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.response) {
                            if ($page.find("#sel_order_status").val() === "All") {
                                $page.find(".search_form :submit").click();
                            } else {
                                $order_item.slideUp(800, function () {
                                    $order_item.remove();
                                });
                            }

                        } else {
                            reError = $this.data('reError');
                            if (!reError) {
                                reError = box.alert({
                                    boxCls: "orderErrbox",
                                    titleText: "系统提示",
                                    content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">订单撤销失败，请检查订单状态是否允许撤销！</p>',
                                    btns: [
                                           { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                                    ],
                                    callback: function () {
                                        this.wmBox.find(".close").removeClass("close").addClass("hide");
                                    }
                                });
                                $this.data('reError', reError);
                            }
                            reError.show();
                        }
                    },
                    error: function () {
                        reTimeout = $this.data('reTimeout');
                        if (!reError) {
                            reTimeout = box.alert({
                                boxCls: "orderErrbox",
                                titleText: "系统提示",
                                content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">订单撤销超时，请稍后再试！</p>',
                                btns: [
                                       { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                                ], callback: function () {
                                    this.wmBox.find(".close").removeClass("close").addClass("hide");
                                }
                            });
                            $this.data('reTimeout', reTimeout);
                        }
                        reTimeout.show();
                    }
                });
            }
            return false;
        });
        //提醒发货
        $page.on("click", ".remind", function () {
            var $this = $(this), $order_item = $this.closest(".order_item");
            var remindSuccess, remindError, remindTimeout;
            //alert("ajaxToRevocation");
            $.ajax({
                url: "",
                type: "get",
                dataType: "json",
                success: function (data) {
                    if (data.response) {
                        remindSuccess = $this.data("remindSuccess");
                        if (!remindSuccess) {
                            remindSuccess = box.alert({
                                boxCls: "orderErrbox",
                                titleText: "系统提示",
                                content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">成功发送提醒！</p>',
                                btns: [
                                       { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                                ],
                                callback: function () {
                                    this.wmBox.find(".close").removeClass("close").addClass("hide");
                                }
                            });
                            $this.data('remindSuccess', remindSuccess);
                        }
                        remindSuccess.show();
                    } else {
                        remindError = $this.data("remindError");
                        if (!remindError) {
                            if (!remindError) {
                                remindError = box.alert({
                                    boxCls: "orderErrbox",
                                    titleText: "系统提示",
                                    content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">提醒发送失败，请稍后再试！</p>',
                                    btns: [
                                           { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                                    ],
                                    callback: function () {
                                        this.wmBox.find(".close").removeClass("close").addClass("hide");
                                    }
                                });
                                $this.data('remindError', remindError);
                            }
                            remindError.show();
                        }
                    }
                },
                error: function () {
                    remindTimeout = $this.data("remindTimeout");
                    if (!remindTimeout) {
                        remindTimeout = box.alert({
                            boxCls: "orderErrbox",
                            titleText: "系统提示",
                            content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">提醒发送失败，请稍后再试！</p>',
                            btns: [
                                   { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                            ],
                            callback: function () {
                                this.wmBox.find(".close").removeClass("close").addClass("hide");
                            }
                        });
                        $this.data('remindTimeout', remindTimeout);
                    }
                    remindTimeout.show();
                }
            });
            return false;
        });
        //删除
        $page.on("click", ".deloredr", function () {
            var $this = $(this), $order_item = $this.closest(".order_item");
            var delError, delTimeout;
            //alert("ajaxToRevocation");
            $.ajax({
                url: "",
                type: "get",
                dataType: "json",
                success: function (data) {
                    if (data.response) {
                        $order_item.slideUp(function () {
                            $order_item.remove();
                        }, 800);
                    } else {
                        delError = $this.data('delError');
                        if (!reError) {
                            delError = box.alert({
                                boxCls: "orderErrbox",
                                titleText: "系统提示",
                                content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">订单删除失败，请检查订单状态是否允许删除！</p>',
                                btns: [
                                       { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                                ], callback: function () {
                                    this.wmBox.find(".close").removeClass("close").addClass("hide");
                                }
                            });
                            $this.data('delError', delError);
                        }
                        delError.show();
                    }
                },
                error: function () {
                    delTimeout = $this.data('delTimeout');
                    if (!delTimeout) {
                        delTimeout = box.alert({
                            boxCls: "orderErrbox",
                            titleText: "系统提示",
                            content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">订单删除超时，请稍后再试！</p>',
                            btns: [
                                   { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                            ], callback: function () {
                                this.wmBox.find(".close").removeClass("close").addClass("hide");
                            }
                        });
                        $this.data('delTimeout', delTimeout);
                    }
                    delTimeout.show();
                }
            });
            return false;
        });
        //投诉
        $page.on("click", ".complaints", function () {
            var $this = $(this), complaints;
            complaints = $this.data("complaints");
            if (!complaints) {
                complaints = box.invBox({
                    boxCls: "complaintsBox",
                    titleText: "系统提示",
                    content: [
                        '<div class="complaints_con">',
                            '<h3>投诉原因</h3>',
                            '<textarea></textarea>',
                            '<div class="complaints_btns">',
                                '<a href="#" class="ui_btn ui_btn_h26yellow12 submit_complaints hide"><span class="ui_btn_txt">提交</span></a>',
                                '<a href="#" class="ui_btn ui_btn_h26gray11 hide"><span class="ui_btn_txt">取消</span></a>',
                            '</div>',
                        '</div>'
                    ].join(''),
                    btns: [
                           { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                    ],
                    callback: function () {
                        this.wmBox.find(".close").removeClass("close").addClass("hide");
                    }
                });
                complaints.wmBox.on("click", ".submit_complaints", function () {
                    $.ajax({
                        url: "",
                        type: "get",
                        data: {},
                        dataType: "json",
                        success: function (data) {
                            if (data.response) {
                                box.alert({
                                    boxCls: "orderErrbox",
                                    titleText: "系统提示",
                                    content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">投诉成功，我们会尽快处理！</p>',
                                    btns: [
                                           { cls: "ui_btn_h40red2", res: "close", text: "确    定" }
                                    ]
                                });
                            } else {
                                box.alert({
                                    boxCls: "orderErrbox",
                                    titleText: "系统提示",
                                    content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">投诉失败，请稍后再试！</p>',
                                    btns: [
                                           { cls: "ui_btn_h40red2", res: "close", text: "确    定" }
                                    ]
                                });
                            }
                            complaints.hide();
                        },
                        error: function () {
                            box.alert({
                                boxCls: "orderErrbox",
                                titleText: "系统提示",
                                content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">投诉失败，请稍后再试！</p>',
                                btns: [
                                       { cls: "ui_btn_h40red2", res: "close", text: "确    定" }
                                ]
                            });
                            complaints.hide();
                        }
                    });

                });

                $this.data('complaints', complaints);
            }
            complaints.show();
            return false;
        });
        //分享
        $page.on("click", ".share_btn", function () {
            var $this = $(this), _sharebox;
            if ($this.attr("isshow")) { return false }
            $page.click();
            sharebox.show($this);
            return false;
        });
        $page.on("click.hideShareBox", function () {
            sharebox.hide();
        });
        //评价
        $page.on("click", ".evaluate_btn", function () {
            var $evaluate_btn = $(this);
            evaluate.show({
                orderid: $evaluate_btn.attr("orderid"),
                productid: $evaluate_btn.attr("productid"),
                itemid: $evaluate_btn.attr("itemid")
            });
            return false;
        });
    };
    init();
});
