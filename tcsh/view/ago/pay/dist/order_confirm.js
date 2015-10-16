define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');

    var $ = require('jquery'),
        juicer = require('juicer'),
        box = require('wmbox'),
        wm_ad = require('wm_ad');
    var init = function () {
        bind();
    };
    var bind = function () {
        var $page = $("#page"), $da_list = $page.find(".da_list"), ad_box, newAddressData;
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
                            '<span>地&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;址：</span>',
                            '<b>${areaTxt}</b>',
                        '</li>',
                        '{@if landlineCode}',
                        '<li>',
                            '<span>座&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;机：</span>',
                            '<b>${landlineCode}</b>',
                        '</li>',
                        '{@/if}',
                        '{@if phone}',
                        '<li>',
                            '<span>联系电话：</span>',
                            '<b>${phone}</b>',
                        '</li>',
                        '{@/if}',
                        '<li>',
                            '<span>邮&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;编：</span>',
                            '<b>${chinaZip}</b>',
                        '</li>',
                    '</ul>',
                    '<div class="btns">',
                        '<a href="#" class="set_default">设为默认</a>',
                        '<a class="wm_ico fork1 deladitem" href="#" title="删除"></a>',
                        '<a class="wm_ico pen1 upaditem" href="#" title="编辑"></a>',
                    '</div>',
                '</div>'
            ].join(''));
            _html = $(_html.render(data || newAddressData));
            _html.data("AddressData", data || newAddressData);
            return _html;
        };
        $page.on("click.setAddress", ".da_item", function () {
            var $this = $(this);
            $da_list.find(".curr").removeClass("curr");
            $this.addClass("curr");
            return false;
        });
        $page.on("click.setDefault", ".set_default", function () {
            var $this = $(this);
            var $set_default = $page.find("span.set_default");
            $set_default.replaceWith('<a href="#" class="set_default">设为默认</a>');
            $this.replaceWith('<span class="set_default">默认地址</span>');
            return false;
        });
        $page.on("click.showallad", ".showall", function () {
            $page.find(".hideda_list").slideDown(300)
            $(this).remove();
            return false;
        });
        $page.on("click.addad", ".addadbtn", function () {
            wm_ad.show({
                titleText: "添加收货地址",
                saveCallBack: function (data) {
                    var _html;
                    _html = _createADBox(data);
                    $(".da_item:eq(0)").before(_html);
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
            var _data = $da_item.data("AddressData");
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
                },
                showCallBack: function () {
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
        $page.on("click.changeSum", ".changetxt_btn", function () {
            var $this = $(this);
            var $amount = $this.closest("td").find(".amount");
            var _v = ($amount.val() - 0 || 1);
            _v = _v + ($this.attr("basesum") - 0) || 1
            $amount.val(_v <= 0 ? 1 : _v);
            return false;
        });
        $page.on("click.orderSubmit", ".submit_order", function () {
            var postData = {};
            postData.ad_id = $(".da_list").find(".curr").attr("data_id");
        });
        $page.on("click.deladitem", ".deladitem", function () {
            var $this = $(this), $da_item = $this.closest(".da_item");
            var confirm_box = $this.data("confirmBox");
            if (!confirm_box) {
                confirm_box = box.relyBox({
                    rely: $this,
                    boxCls: "confirm_box",
                    content: '<p class="relymsg">你确定要<b style="color:#e13436">删除此收货地址吗？</b><br><span style="color:#999">删除后将无法恢复！</span></p>',
                    btns: [
                        {
                            cls: "ui_btn_h23yellow8", res: "close", text: "确定", callback: function () {
                                $da_item.slideUp(function () {
                                    $(this).remove();
                                })
                            }
                        },
                        {
                            cls: "ui_btn_h23yellow8", res: "close", text: "取消", callback: function () { }
                        }
                    ]
                });
                $this.data("confirmBox", confirm_box);
            }
            confirm_box.show();
            return false;
        });
        if ($.browser.msie && $.browser.version === "6.0") {
            $page.find(".amount_box").hover(function () {
                $(this).addClass("amount_box_hover");
            }, function () {
                $(this).removeClass("amount_box_hover");
            });
        }
    };
    init();
});
