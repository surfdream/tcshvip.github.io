define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        verification = require('wmverification'),
        tips = require("wmtips");
    var init = function () {
        verification.init();
        var $wm_balance = $(".wm_balance");
        var errorCode = global_setting.current.code;
        if (errorCode) {
            for (var i in global_setting.current.code_list) {
                //数据类型可能会导致BUG
                if (global_setting.current.code_list[i].code === errorCode) {
                    new tips({
                        ele: $wm_balance.find(":submit"),
                        con: '<p>' + global_setting.current.code_list[i].message + '</p>',
                        direction: 'tc',
                        close: 5000,
                        offset: {
                            top: -5
                        }
                    }).show();
                    return false;
                }
            }

        }
        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            $wm_balance = $(".wm_balance");
        $page.on("click", "#balance_pay", function () {
            var $this = $(this);
            if ($this.attr("checked")) {
                $(".is_balance_pay").val("t");
            } else {
                $(".is_balance_pay").val("");
            }
        });
        $page.on("click", ".bank_tab_key:not(.curr)", function () {
            var $this = $(this), parent = $this.closest(".bank_box"), key = $this.attr("tab_key_val");
            $this.closest(".bank_tab_keys").find(".curr").removeClass("curr");
            $this.addClass("curr");
            parent.attr("class", "bank_box " + key);
            return false;
        });
        $page.on("change", ".bank_item_chk", function () {
            var $this = $(this);
            $this.closest(".tab_main").find(".curr").removeClass("curr");
            $this.closest(".bank_item").addClass("curr");
        });
        $page.find(".paypal").on("click", ":submit", function () {
            var $thisform = $(this).closest("form");
            $thisform.attr("action", $thisform.find(".bank_item_chk:checked").val());
            if ($page.find("#balance_pay:checked").length) {
                $thisform.append('<input type="hidden" name="useBalance" value="true">');
            }
        });
        $page.on("click", ".f5", function () {
            var $this = $(this), $pay_money = $this.closest(".pay_money"), clone = $pay_money.clone(true);
            $pay_money.empty().append('<i class="wm_ico loading18_18_1" title="loading18_18_1"></i><span style="color: #999;padding-left: 10px;">正在刷新...</span>');
            $.ajax({
                url: domains.order+'/order/asyn/price',
                data: { orderid: global_setting.current.orderid },
                cache:false,
                success: function (data) {
                    if (data.response) {
                        setTimeout(function () {
                            clone.find("b").empty().append('￥' + (data.response.deliveryprice + data.response.orderprice).toFixed(2));
                            $pay_money.empty().append(clone.html());
                            $page.find("#pay_money").empty().append('￥' + (data.response.deliveryprice + data.response.orderprice).toFixed(2));
                        }, 2000); 
                    }
                }
            });
            return false;
        });
        $wm_balance.on("click", ":submit", function () {
            return verification.verify($(this).closest("form"));
        });
    };
    init();
});
