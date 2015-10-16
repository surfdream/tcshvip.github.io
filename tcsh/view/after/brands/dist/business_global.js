define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        juicer = require('juicer'),
        verification = require('wmverification'),
        tips = require('wmtips'),
        box = require('wmbox'),
        lib = require('lib'),
        area = require('area'),
        upload = require('wmupload');
    var init = function () {
        var $page = $("#page"), i, $nav_list, $add_btn_service_qq0;
        window.document.domain = "tcsh.me";
        verification.addRule([
            {
                key: "imgEmpty", fun: function () {
                    return !!this.find(".file_url").val();
                }
            }
        ]);
        bind();
        if (lib.queryString("set_nav")) {
            $("body,html").animate({ scrollTop: 400 });
        }
        $nav_list = $page.find(".chk_list");
        if (global_setting.gps && global_setting.gps.length && $nav_list.length) {
            $nav_list = $page.find(".chk_list");
            for (i in global_setting.gps) {
                $nav_list.find(".nav_name[data_id='" + global_setting.gps[i].key + "']").attr("checked", "checked");
            }
        }
        area({
            parent: $page,
            provincesEle: "#selProvince_rent",
            cityEle: "#selCity_rent"
        });
        if (global_setting.address) {
            $page.find("#selProvince_rent").val(global_setting.address[0].key).change();
            setTimeout(function () {
                $page.find("#selCity_rent").val(global_setting.address[1].key).change();
            }, 200)

        }
        $page.find(".service_qq").change();

    };
    var bind = function () {
        var $form = $(".business_global"),
            $nav_list = $form.find('.chk_list'),
            serviceQQHtml = [
                '<li class="form_row">',
                    '<label class="row_key">&nbsp;</label>',
                    '<input type="text" class="form_txt service_qq">',
                    '<a href="#" class="btn25_25 add_btn_service_qq">+</a>',
                    '<a href="#" class="btn25_25 del_btn_service_qq">-</a>',
                '</li>'].join('');
        $form.find(".form_file").change(function () {
            var $this = $(this);
            upload.upload($this, function (data) {
                var $form_row = this.closest(".form_row")
                if (data.response) {
                    $form_row.find("img").attr("src", data.response.imgurl).css("display", "block");
                    $form_row.find(".file_url").val(data.response.imgurl);
                }
            });
            return false;
        });
        $form.on("click", ":submit", function () {
            var $this = $(this), gps, qq, provinces, $selProvince_rent, $selCity_rent;
            if (verification.verify($form)) {
                gps = [], qq = [], provinces = [];
                $nav_list.find('.nav_name:checked').each(function () {
                    var $this = $(this);
                    gps.push({
                        key: $this.val(),
                        val: $this.attr("data_name")
                    });
                });
                $selProvince_rent = $form.find("#selProvince_rent"), $selCity_rent = $form.find("#selCity_rent")
                provinces.push({
                    key: $selProvince_rent.val(),
                    val: $selProvince_rent.find("option:selected").html()
                });
                provinces.push({
                    key: $selCity_rent.val(),
                    val: $selCity_rent.find("option:selected").html()
                });
                $form.find(".service_qq").each(function () {
                    var $this = $(this), _v = $.trim($this.val());
                    _v && qq.push(_v);
                });
                $.ajax({
                    url:domains.sell+ '/api/market/add',
                    type: "post",
                    dataType: "json",
                    data: {
                        "subject": encodeURIComponent($form.find(".subject").val()),
                        "special": $form.find(".special").val(),
                        "_330_215": $form.find("._330_215").val(),
                        "_740_250": $form.find("._740_250").val(),
                        "_130_130": $form.find("._130_130").val(),
                        "gps": JSON.stringify(gps),
                        "qq": JSON.stringify(qq),
                        "address": JSON.stringify(provinces)
                    },
                    success: function (data) {
                        if (data.success) {
                            box.alert({
                                boxCls: "business_global_box",
                                content: '<p style="width: 500px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;"><b style="color:#e13436;font-weight: 700;"><i class="wm_ico hook5" style="margin-right:10px"></i>设置成功！</b></p>',
                                btns: [
                                    { cls: "ui_btn_h46red8", text: "确定", res: "close" },
                                    { cls: "ui_btn_h46red8", text: "取消", res: "close" }
                                ],
                                callback: function () {
                                    this.close = function () {
                                        if (lib.queryString("set_nav")) {
                                            try {
                                                window.opener.location.reload();
                                                window.open(window.location.href, "_self", "");
                                                window.close();
                                            } catch (e) {
                                                window.location.href = domains.sell+"/market";
                                            }

                                        } else {
                                            window.location.href = domains.sell+"/market";
                                        }
                                    }
                                }
                            });
                        } else {
                            box.alert({
                                boxCls: "business_global_box",
                                content: '<p style="width: 500px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;"><b style="color:#e13436;font-weight: 700;"><i class="wm_ico sigh2" style="margin-right:10px"></i>服务器繁忙，请稍候再试！</b></p>',
                                btns: [
                                    { cls: "ui_btn_h46red8", text: "确定", res: "close" },
                                    { cls: "ui_btn_h46red8", text: "取消", res: "close" }
                                ],
                                callback: function () {
                                    window.location.reload();
                                }
                            });
                        }
                    },
                    error: function () {
                    }
                });
            }
            return false;
        });
        $form.on("click", ".add_btn_service_qq", function () {
            var $serviceQQ = $(serviceQQHtml);
            $serviceQQ.find(".service_qq").on("change", function () {
                var $this = $(this), $form_row = $this.closest(".form_row"), $qqlink = $form_row.find(".qqlink"), _v = $this.val();
                if ($qqlink.length) {
                    $qqlink.replaceWith('<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=' + _v + '&amp;site=qq&amp;menu=yes" class="qqlink" style="vertical-align: bottom;display: inline-block;line-height: 0;margin-left:10px"><img border="0" src="http://wpa.qq.com/pa?p=2:' + _v + ':51" alt="点击这里给我发消息" title="点击这里给我发消息"></a>');
                } else {
                    $form_row.append('<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=' + _v + '&amp;site=qq&amp;menu=yes" class="qqlink" style="vertical-align: bottom;display: inline-block;line-height: 0;margin-left:10px"><img border="0" src="http://wpa.qq.com/pa?p=2:' + _v + ':51" alt="点击这里给我发消息" title="点击这里给我发消息"></a>');
                }
            });
            $(this).closest(".form_row").after($serviceQQ);
            return false;
        });
        $form.on("click", ".del_btn_service_qq", function () {
            var $this = $(this).closest(".form_row"), $serviceQQHtml;
            $this.remove();
            $(".service_qq:eq(0)").closest(".form_row").find(".row_key").empty().append('客服QQ：');
            if (!$(".service_qq").length) {
                $serviceQQHtml = $(serviceQQHtml);
                $serviceQQHtml.find(".row_key").empty().append('客服QQ：');
                $form.find(".qq_next_item").before($serviceQQHtml);
            }
            return false;
        });
        $form.find(".service_qq").on("change", function () {
            var $this = $(this), $form_row = $this.closest(".form_row"), $qqlink = $form_row.find(".qqlink"), _v = $this.val();
            if ($qqlink.length) {
                $qqlink.replaceWith('<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=' + _v + '&amp;site=qq&amp;menu=yes" class="qqlink" style="vertical-align: bottom;display: inline-block;line-height: 0;margin-left:10px"><img border="0" src="http://wpa.qq.com/pa?p=2:' + _v + ':51" alt="点击这里给我发消息" title="点击这里给我发消息"></a>');
            } else {
                $form_row.append('<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=' + _v + '&amp;site=qq&amp;menu=yes" class="qqlink" style="vertical-align: bottom;display: inline-block;line-height: 0;margin-left:10px"><img border="0" src="http://wpa.qq.com/pa?p=2:' + _v + ':51" alt="点击这里给我发消息" title="点击这里给我发消息"></a>');
            }
        });
    };
    init();
});