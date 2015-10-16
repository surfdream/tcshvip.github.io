define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        area = require("wmarea"),
        verification = require("wmverification"),
        wmad = require("wm_ad"),
        box = require('wmbox'),
        lib = require("lib");
    ;
    var init = function () {
        var $page = $("#page"), _zone;
        new area();
        if (global_setting.zone) {
            _zone = global_setting.zone;
            $page.find("#selProvince_rent").val(_zone.substr(0, 2) + "0000").change();
            setTimeout(function () {
                $page.find("#selCity_rent").val(_zone.substr(0, 4) + "00").change();
            }, 200);
            setTimeout(function () {
                $page.find("#selDistricts_rent").val(_zone);
            }, 400);
        }
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ".send_default", function () {
            var $this = $(this);
            wmad.ajaxSetSendDefault({
                id: $this.closest("tr").attr("data_id"),
                success: function (data) {
                    if (data.success) {
                        alert("设置成功！");
                        window.location.href = window.location.href;
                    } else {
                        alert(data.error);
                    }
                },
                error: function () {
                    alert("服务器繁忙，请稍候再试！");
                }
            });
            return false;
        });
        $page.on("click", ".del", function () {
            var $this = $(this), delconfirm = $this.data("delconfirm");
            if (!delconfirm) {
                delconfirm = box.relyBox({
                    rely: $this,
                    content: '<p style="font-size: 14px;">确定要删除吗？<span style="display: block;color: #999;font-size: 12px;">删除后不可恢复</span></p>',
                    btns: [
                           {
                               cls: "ui_btn_h22red10", res: "close", text: "确定", callback: function () {
                                   this.hide();
                                   $.ajax({
                                       url: $this.attr("href"),
                                       type: "get",
                                       dataType: "json",
                                       success: function (data) {
                                           if (data.success) {
                                               setTimeout(function () {
                                                   alert("删除成功！");
                                                   window.location.href = domains.sell+"/Logistics";
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
                           { cls: "ui_btn_h22gray6", res: "close", text: "取消", callback: function () { } }
                    ],
                    callback: function () {
                        this.close = this.hide;
                    }

                });
                $this.data("delconfirm", delconfirm);
            }
            delconfirm.show();
            return false;
        });
        $page.on("click", ".return_default", function () {
            var $this = $(this);
            wmad.ajaxSetReturnDefault({
                id: $this.closest("tr").attr("data_id"),
                success: function (data) {
                    if (data.success) {
                        alert("设置成功！");
                        window.location.href = window.location.href;
                    } else {
                        alert(data.error);
                    }
                },
                error: function () {
                    alert("服务器繁忙，请稍候再试！");
                }
            });
            return false;
        });
        $page.on("click", ":submit", function () {
            var $form = $(this).closest("form"), postData, landline_code, $selProvince, $selCity, $selDistricts, _provinceTxt, _cityTxt, _districtsTxt;
            if (verification.verify($form)) {
                landline_code = $form.find(".landline_code1").val();
                landline_code += ("-" + $form.find(".landline_code2").val());
                landline_code += ("-" + $form.find(".landline_code3").val());
                $selProvince = $form.find("#selProvince_rent");
                $selCity = $form.find("#selCity_rent");
                $selDistricts = $form.find("#selDistricts_rent");
                _provinceTxt = $selProvince.find(":selected").html();
                _cityTxt = $selCity.find(":selected").html();
                _districtsTxt = $selDistricts.find(":selected").html().replace(/请选择/g, "");
                postData = {
                    receiver: encodeURIComponent($form.find(".receiver").val()),
                    zone: $form.find("#selDistricts_rent").val(),
                    address: encodeURIComponent($form.find(".address").val()),
                    postcode: $form.find(".chinazip").val(),
                    telphone: landline_code === "--" ? "" : landline_code,
                    mobilephone: $form.find(".phone").val(),
                    remark: encodeURIComponent($form.find(".remark").val()),
                    company_name: encodeURIComponent($form.find(".company_name").val()),
                    area: encodeURIComponent(_provinceTxt + " " + _cityTxt + " " + _districtsTxt)
                };
                if (global_setting.updataId) {
                    postData.id = global_setting.updataId
                    wmad.ajaxUpdate({
                        data: postData,
                        isSend: true,
                        type: "post",
                        dataType: "json",
                        success: function (data) {
                            if (data.success) {
                                alert("保存成功！");
                                window.location.href = domains.sell+"/Logistics";
                            } else {
                                alert(data.error);
                            }
                        },
                        error: function () {
                            alert("服务器繁忙，请稍候再试！");
                        }
                    });
                } else {
                    wmad.ajaxAdd({
                        data: postData,
                        isSend: true,
                        dataType: "json",
                        type: "post",
                        success: function (data) {
                            if (data.success) {
                                alert("保存成功！");
                                window.location.href = domains.sell+"/Logistics";
                            } else {
                                alert(data.error);
                            }
                        },
                        error: function () {
                            alert("服务器繁忙，请稍候再试！");
                        }
                    });
                }
            }
            return false;
        });
    };
    init();
});