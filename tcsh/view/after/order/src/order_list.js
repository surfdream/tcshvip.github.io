define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        tips = require('wmtips'),
        box = require('wmbox'),
        verification = require('wmverification'),
        page = require('wmpage');
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);
    var init = function () {
        if (global_setting && global_setting.current && global_setting.current.page && global_setting.current.page.totalcount) {
            var _page = page.Create({
                url: domains.sell+'/order/list?' + $(".seleft_box .wm_form").serialize(),
                element: ".wm_page",
                size: global_setting.current.page.pagesize,
                index: global_setting.current.page.pageindex,
                sum: global_setting.current.page.totalcount,
                pagekey: global_setting.current.page.pagekey,
                front: true
            });
        };
        verification.init($("#page"));
        $(".list_tab a:eq(" + global_setting.current.menuIndex + ")").attr("class", "ui_btn ui_btn_h36white3");
        bind();

    };
    var bind = function () {
        var $page = $("#page");
		
		
        //同意撤销
        $page.on("click", ".revocation_order", function () {
            var $this = $(this), $order_item = $this.closest(".order_item"), _key = $this.attr("data_key");
            var errorTips;
            $.ajax({
                url: "/order/refund/judge",
                type: "get",
                data: {
                    orderid: $order_item.attr("orderid"),
                    agree: _key
                },
                dataType: "json",
                success: function (data) {
                    if (data.response) {
                        window.location.href = window.location.href;
                    } else {
                        errorTips = $this.data("errorTips");
                        if (!errorTips) {
                            errorTips = new tips({
                                ele: $this.closest('.btn_list'),
                                con: '<p>服务器繁忙，请稍候再试！<br>@码农，赶紧解决问题！</p>',
                                close: 2000,
                                direction: 'rt',
                                offset: {
                                    left: 15
                                }
                            });
                            $this.data("errorTips", errorTips);
                        }
                        errorTips.show();
                    }
                },
                error: function () {
                    errorTips = $this.data("errorTips");
                    if (!errorTips) {
                        errorTips = new tips({
                            ele: $this.closest('.btn_list'),
                            con: '<p>服务器繁忙，请稍候再试！<br>@码农，赶紧解决问题！</p>',
                            close: 2000,
                            direction: 'rt',
                            offset: {
                                left: 15
                            }
                        });
                        $this.data("errorTips", errorTips);
                    }
                    errorTips.show();
                }
            });
            return false;
        });
        $page.on("click", ".remind_pay", function () {
            var $this = $(this), _key = $this.attr("data_key");
            var errorTips, successTips;
            $.ajax({
                url: "",
                type: "get",
                data: {
                    key: _key
                },
                dataType: "json",
                success: function () {
                    successTips = $this.data("successTips");
                    if (!successTips) {
                        successTips = new tips({
                            ele: $this.closest('.btn_list'),
                            con: '<p><i class="wm_ico hook2" style="margin-right:10px"></i>付款提醒，已发送！</p>',
                            close: 2000,
                            direction: 'rt',
                            offset: {
                                left: 15
                            }
                        });
                        $this.data("successTips", successTips);
                    }
                    successTips.show();
                },
                error: function () {
                    errorTips = $this.data("errorTips");
                    if (!errorTips) {
                        errorTips = new tips({
                            ele: $this.closest('.btn_list'),
                            con: '<p>服务器繁忙，请稍候再试！<br>@码农，赶紧解决问题！</p>',
                            close: 2000,
                            direction: 'rt',
                            offset: {
                                left: 15
                            }
                        });
                        $this.data("errorTips", errorTips);
                    }
                    errorTips.show();
                }
            });
            return false;
        });
        $page.on("click", ".edit_shipping", function () {
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = box.invBox({
					boxCls:"set_shipping_box",
					content:'<span class="displayblock colgray set_shipping_box"><label for="">修改运费：</label><input type="text" value="0.00" class="txt_shipping" /><a href="#" class="ui_btn ui_btn_h21gray9 confirm_shipping"><span class="ui_btn_txt">确定</span></a><a href="#" class="wm_ico fork7 close"></a></span>',
					callback:function(){
						var self = this,
							_box = this.wmBox.find(".set_shipping_box")
						;
						this.close = this.hide;	
						this.wmBox.find(".confirm_shipping").on("click", function () {
							var _this = $(this);
							var _v = _box.find(".txt_shipping").val() - 0;
							if ( _v >= 0) {
								$.ajax({
									url: "/order/update",
									type: "post",
									dataType: "json",
									data: {
										orderid: $this.closest(".order_item").attr("orderid"),
										delivery_price: _v.toFixed(2)
									},
									success:function(){
										window.location.reload();	
									},
									error:function(){
										alert("系统繁忙，请稍后再试！")	
									}
								});
							}else{
								alert("请输入正确的运费！");
							}
							return false;
						});
					}	
				});
				$this.data("thisBox",_thisBox);	
			};
			_thisBox.show();
            $(this).closest("tr").find(".set_shipping_box").toggleClass("isset");
            return false;
        });
        
        $page.on("click", ".refund", function () {
            var $this = $(this), $order_item = $this.closest(".order_item");
            var errorTips;
            $.ajax({
                url: domains.sell+"/order/JudgeRejection/pass",
                type: "get",
                data: {
                    orderid: $order_item.attr("orderid")
                },
                dataType: "json",
                success: function (data) {
                    if (data.response) {
                        window.location.href = window.location.href;
                    } else {
                        errorTips = $this.data("errorTips");
                        if (!errorTips) {
                            errorTips = new tips({
                                ele: $this.closest('.btn_list'),
                                con: '<p>操作失败，请检查账户余额！</p>',
                                close: 2000,
                                direction: 'rt',
                                offset: {
                                    left: 15
                                }
                            });
                            $this.data("errorTips", errorTips);
                        }
                        errorTips.setCon('<p>操作失败，请检查账户余额！</p>');
                        errorTips.show();
                    }

                },
                error: function () {
                    errorTips = $this.data("errorTips");
                    if (!errorTips) {
                        errorTips = new tips({
                            ele: $this.closest('.btn_list'),
                            con: '<p>服务器繁忙，请稍候再试！<br>@码农，赶紧解决问题！</p>',
                            close: 2000,
                            direction: 'rt',
                            offset: {
                                left: 15
                            }
                        });
                        $this.data("errorTips", errorTips);
                    }
                    errorTips.setCon('<p>服务器繁忙，请稍候再试！<br>@码农，赶紧解决问题！</p>');
                    errorTips.show();
                }
            });
            return false;
        });
        $page.on("click", ".not_refund", function () {
            var $this = $(this);
            box.invBox({
                boxCls: "refuse_reason_box",
                content: [
                    '<div class="refuse_reason">',
                        '<h3>请说明原因：</h3>',
                        '<textarea class="reason"></textarea>',
                        '<div class="btns">',
                            '<a href="#" class="ui_btn ui_btn_h27gray8 confirm_not_refund"><span class="ui_btn_txt">确定</span></a>',
                            '<a href="#" class="ui_btn ui_btn_h27gray8 close"><span class="ui_btn_txt">取消</span></a>',
                        '</div>',
                    '</div>'
                ].join(''),
                callback: function () {
                    var self = this;
                    this.wmBox.on("click", ".confirm_not_refund", function () {
                        var $order_item = $this.closest(".order_item"), _v = $.trim(self.wmBox.find(".reason").val());
                        if (_v.length >= 100) {
                            alert("字数过长！");
                            return false;
                        }
                        var errorTips;
                        $.ajax({
                            url: domains.sell+"/order/JudgeRejection/fail",
                            type: "post",
                            data: {
                                orderid: $order_item.attr("orderid"),
                                reason: encodeURIComponent(_v)
                            },
                            dataType: "json",
                            success: function () {
                                window.location.href = window.location.href;
                            },
                            error: function () {
                                errorTips = $this.data("errorTips");
                                if (!errorTips) {
                                    errorTips = new tips({
                                        ele: $this.closest('.btn_list'),
                                        con: '<p>服务器繁忙，请稍候再试！<br>@码农，赶紧解决问题！</p>',
                                        close: 2000,
                                        direction: 'rt',
                                        offset: {
                                            left: 15
                                        }
                                    });
                                    $this.data("errorTips", errorTips);
                                }
                                errorTips.show();
                            }
                        });
                        return false;
                    });
                }
            });
            return false;
        });
        $page.find("#OrderTimeFrom").datepicker({
            onClose: function (data, e) { if (!(/\d{4}-\d{2}-\d{2}/.test(data))) { e.input.val(''); } }
        });
        $page.find("#OrderTimeEnd").datepicker({
            onClose: function (data, e) { if (!(/\d{4}-\d{2}-\d{2}/.test(data))) { e.input.val(''); } }
        });
        window._reload = function () {
            $page.find(".seleft_box :submit").click();
        };
    };
    init();
});
