define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        verification = require('verification'),
        area = require('area'),
        box = require('wmbox'),
        wm_ad = require('wm_ad'),
        tips = require("wmtips");
    var updataId;
    var init = function () {
        area();
        verification.init();
        bind();
    };
    var bind = function () {
        var $page = $(".main_con"), $da_list = $page.find(".da_list");
        $page.on("click.setAddress", ".da_item", function () {
            var $this = $(this);
            wm_ad.ajaxSetDefault({
                id: $this.attr("data_id"),
                success: function () {
                    $da_list.find(".curr").removeClass("curr");
                    $this.addClass("curr");
                }
            });
            return false;
        });
        $page.on("click", ":submit", function () {
            var $this = $(this).closest(".wm_form"),
                $telphone=$page.find("#telphone"),
                $phone=$page.find(".phone");
            var $selProvince, $selCity, $selDistricts, landline_code, phoneErrorTips;
            var newAddressData = {};
            if (!verification.verify($this)) {
                return false;
            }
            $("#id").val(updataId);
            landline_code = $this.find(".landline_code1").val();
            landline_code += ("-" + $this.find(".landline_code2").val());
            landline_code += ("-" + $this.find(".landline_code3").val());
            $telphone.val(landline_code === "--" ? "" : landline_code);
            if (!$telphone.val() && !$phone.val()) {
                phoneErrorTips = $this.data("phoneErrorTips");
                if (!phoneErrorTips) {
                    phoneErrorTips = new tips({
                        ele: $phone,
                        con: '手机和座机必选一个',
                        skin: "red2",
                        close: 2000,
                        direction: "rt",
                        offset: { left: 15 }
                    });
                    $this.data("phoneErrorTips", phoneErrorTips);
                }
                phoneErrorTips.show();
                return false;
            }
            $selProvince = $this.find("#selProvince_rent");
            $selCity = $this.find("#selCity_rent");
            $selDistricts = $this.find("#selDistricts_rent");
            newAddressData.ProvinceTxt = $selProvince.find(":selected").html();
            newAddressData.CityTxt = $selCity.find(":selected").html();
            newAddressData.DistrictsTxt = $selDistricts.find(":selected").html().replace(/请选择/g,"");
            //newAddressData.areaTxt = newAddressData.ProvinceTxt + " " + newAddressData.CityTxt + " " + newAddressData.DistrictsTxt + newAddressData.address;
            $("#remark").val(newAddressData.ProvinceTxt + " " + newAddressData.CityTxt + " " + newAddressData.DistrictsTxt);
            //if (verification.verify($this)) {
            //    newAddressData.id = updataId;
            //    //newAddressData.id = parseInt(Math.random() * 999) + 100;
            //    $selProvince = $this.find("#selProvince_rent");
            //    $selCity = $this.find("#selCity_rent");
            //    $selDistricts = $this.find("#selDistricts_rent");
            //    newAddressData.ProvinceTxt = $selProvince.find(":selected").html();
            //    newAddressData.CityTxt = $selCity.find(":selected").html();
            //    newAddressData.DistrictsTxt = $selDistricts.find(":selected").html();
            //    newAddressData.areaCode = $selDistricts.val();
            //    newAddressData.address = $this.find(".textarea_address").val();
            //    newAddressData.areaTxt = newAddressData.ProvinceTxt + " " + newAddressData.CityTxt + " " + newAddressData.DistrictsTxt + newAddressData.address;
            //    newAddressData.chinaZip = $this.find(".chinazip").val();
            //    newAddressData.consigneeName = $this.find(".consignee_name").val();
            //    landline_code = $this.find(".landline_code1").val();
            //    landline_code += ("-" + $this.find(".landline_code2").val());
            //    landline_code += ("-" + $this.find(".landline_code3").val());
            //    newAddressData.landlineCode = landline_code === "--" ? "" : landline_code;
            //    newAddressData.phone = $this.find(".phone").val();
            //    newAddressData.isDefault = !!$this.find("[name='isdefault']:checked").length;
            //    console.log(newAddressData);
            //}
            //return false;
        });
        $page.on("click", ".upaditem", function (e) {
            var $this = $(this), $item = $this.closest('.da_item'), _data = $item.data("addressdata"), _v, $form = $page.find(".ad_form");
            $form.find("h3").empty().append('修改收货地址');
            updataId = _data.id;
            if (_data && _data.id) {
                $form.attr("action", "/action/updateDelivery")
                $form.find(".textarea_address").val(_data.address);
                $form.find(".chinazip").val(_data.chinaZip);
                $form.find(".consignee_name").val(_data.consigneeName);
                _v = _data.landlineCode.split('-');
                $form.find(".landline_code1").val(_v[0]);
                $form.find(".landline_code2").val(_v[1]);
                $form.find(".landline_code3").val(_v[2]);
                $form.find(".phone").val(_data.phone);
                if (_data.isDefault) {
                    $form.find("[name='isdefault']").attr("checked", "checked");
                }
                _v = _data.areaCode + "";
                $form.find("#selProvince_rent").val(_v.substr(0, 2) + "0000").change();
                $form.find("#selCity_rent").val(_v.substr(0, 4) + "00").change();
                $form.find("#selDistricts_rent").val(_v);
                $item.attr("isupdate", "t");
                verification.verify($form);
            }
            e.stopPropagation();
        });
        $page.on("click", ".deladitem", function () {
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
    };
    init();
});
