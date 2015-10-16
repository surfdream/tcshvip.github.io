define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        lib = require("lib"),
        box = require("wmbox"),
        tips = require("wmtips"),
        wm_ad = require('wm_ad');
    var _sum = function () {
        var $page = $(".main_con"),
            $comm_item = $page.find(".comm_item"),
        i = 0;
        $page.find(".express").each(function () {
            var $this = $(this).find(":selected");
            if (!$this.length) {
                $this = $(this).find("option:eq(0)");
            }
            i += ($this.attr("price") || 0) - 0;
        });
        $comm_item.each(function () {
            var $this = $(this);
            i += ($this.attr("pay_money") - 0) * ($this.attr("pay_count") - 0);
        });
        $page.find(".money_sum").empty().append('商品总价：<b class="pay_money_sum">￥' + i.toFixed(2) + '</b>（含运费）');
    };
    var init = function () {
        _sum();
        var $page = $(".main_con"),
            $DeliveryId = $page.find("[name='DeliveryId']"),
            $adcurr = $(".da_item.curr");
        if ($adcurr.length) {
            $adcurr.find(".set_default").replaceWith('<span class="set_default">默认地址</span>');
            $DeliveryId.val($adcurr.attr("data_id"));
        }
        bind();
        if (global_setting.current.command.DeliveryId) {
            $adcurr.removeClass("curr");
            $(".da_item[data_id='" + global_setting.current.command.DeliveryId + "']").addClass("curr");
            $DeliveryId.val(global_setting.current.command.DeliveryId);
        }
    };
    var bind = function () {
        var $page = $(".main_con"), $da_list = $page.find(".da_list"), $DeliveryId = $page.find("[name='DeliveryId']");
        var _createADBox = function (data) {
            var _html = juicer([
                '<div class="da_item" data_id="${id}">',
                    '<ul class="da_item_head">',
                        '<li>',
                            '<h3>${ProvinceTxt} ${CityTxt}<b>(${consigneeName}&nbsp;收)</b></h3>',
                        '</li>',
                    '</ul>',
                    '<ul class="da_data">',
                        '<li>',
                            '<span>地<i></i>址：</span>',
                            '<b>${areaTxt}</b>',
                        '</li>',
                        '{@if phone}',
                        '<li  class="floatleft pr50">',
                            '<span>联系电话：</span>',
                            '<b>${phone}</b>',
                        '</li>',
                        '{@else if landlineCode}',
                        '<li  class="floatleft pr50">',
                            '<span>联系电话：</span>',
                            '<b>${landlineCode}</b>',
                        '</li>',
                        '{@/if}',
                        '<li>',
                            '<span>邮<i></i>编：</span>',
                            '<b>${chinaZip}</b>',
                        '</li>',
                    '</ul>',
                    '<div class="btns">',
                        '<a href="#" class="set_default">设为默认</a>',
                        '<a class="wm_ico fork1 deladitem" href="#" title="删除"></a>',
                        '<a class="wm_ico pen1 upaditem" href="#" title="编辑"></a>',
                    '</div>',
                    '<i class="wm_ico hook4 curr_mark"></i>',
                '</div>'
            ].join(''));
            _html = $(_html.render(data || newAddressData));
            _html.data("AddressData", data || newAddressData);
            return _html;
        };
        $page.on("click.addad", ".addadbtn", function () {
            wm_ad.show({
                titleText: "添加收货地址",
                saveCallBack: function (data) {
                    var _html;
                    _html = _createADBox(data);
                    $(".da_list_btns").after(_html);
                    _html.click();
                    if (data.isDefault) {
                        _html.find(".set_default").click();
                    }

                }
            });
            return false;
        });
        $page.on("click.upaditem", ".upaditem", function () {
            var $this = $(this), _html, $da_item = $this.closest(".da_item"), upBox = $this.data("upBox");
            var _data = $da_item.data("addressdata");
            wm_ad.show({
                titleText: "修改收货地址",
                saveCallBack: function (data) {
                    data.id = $da_item.attr("data_id");
                    _html = _createADBox(data);
                    _html.find(".upaditem").data("upBox", $this.data("upBox"));
                    $da_item.replaceWith(_html);
                    _html.click();
                    if (data.isDefault) {
                        _html.find(".set_default").click();
                    }
                    $DeliveryId.val(data.id);
                },
                showCallBack: function () {
                    var _v;
                    if (_data && _data.id) {
                        _v = _data.areaCode;
                        this.wmBox.find("#selProvince_rent").val(_v.substr(0, 2) + "0000").change();
                        this.wmBox.find("#selCity_rent").val(_v.substr(0, 4) + "00").change();
                        this.wmBox.find("#selDistricts_rent").val(_v);
                        this.wmBox.find(".textarea_address").val(_data.address);
                        this.wmBox.find(".chinazip").val(_data.chinaZip);
                        this.wmBox.find(".consignee_name").val(_data.consigneeName);
                        _v = _data.landlineCode.split('-');
                        this.wmBox.find(".landline_code1").val(_v[0]);
                        this.wmBox.find(".landline_code2").val(_v[1]);
                        this.wmBox.find(".landline_code3").val(_v[2]);
                        this.wmBox.find(".phone").val(_data.phone);
                        if (_data.isDefault) {
                            this.wmBox.find("[name='isdefault']").attr("checked", "checked");
                        }
                    }
                }
            });
            return false;
        });
        $page.on("click.setAddress", ".da_item", function () {
            var $this = $(this), ids = [], _href = "", data_id, bids = [], i;
            //$da_list.find(".curr").removeClass("curr");
            //$this.addClass("curr");
            //data_id = $this.attr("data_id")
            //$DeliveryId.val(data_id);
            global_setting.current.command.DeliveryId = $this.attr("data_id");
            ids = global_setting.current.Id;
            bids = global_setting.current.Bid;
            for (i in ids) {
                ids[i] = "id=" + ids[i];
            }
            for (i in bids) {
                bids[i] = "bid=" + bids[i];
            }
            _href = window.location.href.substr(0, window.location.href.indexOf("?") + 1);
            _href += $.param(global_setting.current.command);
            if (bids) {
                _href += ("&" + bids.join('&'));
            }
            if (ids) {
                _href += ("&" + ids.join('&'));
            }

            window.location.href = _href;
            return false;
        });
        $page.on("click.setDefault", "a.set_default", function () {
            var $this = $(this);
            wm_ad.ajaxSetDefault({
                id: $this.closest(".da_item").attr("data_id"),
                success: function () {
                    var $set_default = $page.find("span.set_default");
                    $set_default.replaceWith('<a href="#" class="set_default">设为默认</a>');
                    $this.replaceWith('<span class="set_default">默认地址</span>');
                }
            })

            return false;
        });
        $page.on("click.deladitem", ".deladitem", function () {
            var $this = $(this), $da_item = $this.closest('.da_item'), _data = $da_item.data("addressdata"), $form = $page.find(".ad_form");
            var confirm_box = $this.data("confirmBox");
            if (!confirm_box) {
                confirm_box = box.relyBox({
                    rely: $this,
                    boxCls: "confirm_box",
                    content: '<p class="relymsg">你确定要<b style="color:#e13436">删除此收货地址吗？</b><br><span style="color:#999">删除后将无法恢复！</span></p>',
                    btns: [
                        {
                            cls: "ui_btn_h23yellow8", res: "close", text: "确定", callback: function () {
                                wm_ad.ajaxDel({
                                    id: $da_item.attr("data_id"),
                                    success: function () {
                                        $da_item.slideUp(300, function () {
                                            $(this).remove();
                                        });
                                        if ($da_item.attr("isupdate")) {
                                            $form.find(".form_sel").val(0);
                                            $form.find(".form_txt").val('');
                                            $form.find(":checked").removeAttr("checked");
                                            $form.find(".form_textarea").val('');
                                        }
                                    }
                                });
                            }
                        },
                        {
                            cls: "ui_btn_h23yellow8", res: "close", text: "取消", callback: function () {

                            }
                        }
                    ]
                });
                $this.data("confirmBox", confirm_box);
            }
            confirm_box.show();
            return false;
        });
        $page.on("click.showallad", ".showall", function () {
            $page.find(".hideda_list").slideDown(300)
            $(this).remove();
            return false;
        });
        $page.on("focus", ".remark", function () {
            var $this = $(this);
            $this.css({ overflow: 'visible' }).animate({ height: "100px" }, 400);

        });
        $page.on("blur", ".remark", function () {
            var $this = $(this);
            $this.scrollTop(0).css({ overflow: 'hidden' }).animate({ height: "18px" }, 300);
        });
        $page.on("click", ":submit", function () {
            var $this = $(this), errtips;
            if (!(global_setting.current.command.DeliveryId - 0)) {
                errtips = $this.data("errtips");
                if (!errtips) {
                    errtips = new tips({
                        ele: $this,
                        con: '<p>请选择收货地址！</p>',
                        close: 2000,
                        skin: "red2",
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
        });
        $page.on("change", ".express", function () {
            _sum();
        });
    };
    init();
});
