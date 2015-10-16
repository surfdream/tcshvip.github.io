define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        box = require("wmbox"),
        verification = require("wmverification"),
        tips = require("wmtips"),
        wm_ad = require('wm_ad');

    var init = function () {
        verification.addRule([
            {
                key: "logistics", fun: function () {
                    return this.val() != "0";
                }
            }
        ]);
        verification.init();
        bind();
    };
    var bind = function () {
        var $page = $(".send_ship"), $da_list = $page.find(".da_list");
        var _createADBox = function (data) {
            var _html = juicer([
                '<div class="da_item" data_id="${id}">',
                    '<ul class="da_item_head">',
                        '<li>',
                            '<h3>${ProvinceTxt} ${CityTxt}<b>(${consigneeName}&nbsp;发)</b></h3>',
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
                titleText: "使用新地址",
                type: "post",
                isSend: true,
                dataType:"json",
                saveCallBack: function (data) {
                    var _html;
                    _html = _createADBox(data);
                    $(".da_list_btns").after(_html);
                    _html.click();
                    if (data.isDefault) {
                        _html.find(".set_default").click();
                    }
                    $page.find("#DeliveryId").val(data.id);
                    window.location.reload();
                }
            });
            return false;
        });
        $page.on("click.setAddress", ".da_item", function () {
            var $this = $(this), ids = [], _href = "", bids = [], i;
            $da_list.find(".curr").removeClass("curr");
            $this.addClass("curr");
            $page.find("#DeliveryId").val($this.attr("data_id"))
            return false;
        });
        $page.on("click.setDefault", "a.set_default", function () {
            var $this = $(this);
            wm_ad.ajaxSetSendDefault({
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
                    content: '<p class="relymsg">你确定要<b style="color:#e13436">删除此发货地址吗？</b><br><span style="color:#999">删除后将无法恢复！</span></p>',
                    btns: [
                        {
                            cls: "ui_btn_h23yellow8", res: "close", text: "确定", callback: function () {
                                this.hide();
                                $.ajax({
                                    url: $this.attr("href"),
                                    type: "get",
                                    dataType: "json",
                                    success: function (data) {
                                        if (data.success) {
                                            setTimeout(function () {
                                                alert("删除成功！");
                                                window.location.reload();
                                            }, 800);
                                        } else {
                                            alert(data.error);
                                        }
                                    },
                                    error: function () {
                                        alert("服务器繁忙，请稍候再试！");
                                    }
                                });
                            }
                        },
                        {
                            cls: "ui_btn_h23yellow8", res: "close", text: "取消", callback: function () {

                            }
                        }
                    ],
                    callback: function () {
                        this.close = this.hide;
                    }
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
        $page.on("click.upaditem", ".upaditem", function () {
            var $this = $(this), _html, $da_item = $this.closest(".da_item"), upBox = $this.data("upBox");
            var _data = $da_item.data("addressdata");
            wm_ad.show({
                id: _data.id,
                type: "post",
                dataType: "json",
                titleText: "修改发货地址",
                isSend: true,
                saveCallBack: function (data) {
                    data.id = $da_item.attr("data_id");
                    _html = _createADBox(data);
                    _html.find(".upaditem").data("upBox", $this.data("upBox"));
                    $da_item.replaceWith(_html);
                    _html.click();
                    if (data.isDefault) {
                        _html.find(".set_default").click();
                    }
                    $page.find("#DeliveryId").val(data.id);
                    window.location.reload();
                },
                showCallBack: function () {
                    var _v;
                    if (_data && _data.id) {
                        _v = _data.areaCode;
                        this.wmBox.find(".company_name").val(_data.companyName);
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
        $page.on("click", ":submit", function () {
            var $this = $(this), errTips;
            if (!($page.find("#DeliveryId").val() - 0)) {
                errTips = $this.data("errTips");
                if (!errTips) {
                    errTips = new tips({
                        ele: $this,
                        con: "请选择发货地址",
                        skin: "red2",
                        direction: "tc",
                        offset: { top: -10 }
                    });
                    $this.data("errTips", errTips);
                }
                errTips.show();
                return false;
            }
            return verification.verify($page);
        });
    };
    init();
});
