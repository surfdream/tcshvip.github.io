// JavaScript Document

define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
		upload = require("wmupload"),
        bankbox = require('bankbox'),
        box = require('wmbox'),
		brand_box = require('brand_box'),
		page = require("wmpage"),
		verification = require('wmverification'),
        tips = require('wmtips'),
		bank_data = require("bank_data").getObjectData()
    ;
    var gData = {},
		brandsBox,
		bankid,
        isEmptyLogo = true,
        isCredentials = true
    ;
    var init = function () {
        var $upload_form = $(".upload_form"),
			$page = $("#page"),
			$brand_kinds = $upload_form.find(".brand_kinds"),
			brands_val,
			$bank,
            $brand_name = $upload_form.find("#BrandName"),
            brand_name = $brand_name.val(),
            $brand_img = $upload_form.find(".brand_img img"),
            $brandid = $upload_form.find("#BrandId")
        ;

        /*
		 *
		 *  密码规则不符，有除字母数字之外的字符
		 *
		 */
        if (global_setting && global_setting.current && global_setting.current.model && global_setting.current.model.selected_types) {
            brands_val = global_setting.current.model.selected_types;
        }
        for (var i in brands_val) {
            $brand_kinds.find(".brand_type[value='" + brands_val[i] + "']").attr("checked", "checked")
        }




        if (global_setting && global_setting.current && global_setting.current.model && global_setting.current.model.bankid) {
            bankid = global_setting.current.model.bankid;
            $page.find(".more_bank_name").empty().append(bank_data[bankid]);
            $page.find(".bank_item_chk").removeAttr("checked");
            $page.find(".bank_item_chk[data_id='" + global_setting.current.model.bankid + "']").attr("checked", "checked");
        }

        /*
		 *
		 *  自定义验证条件
		 *
		 */
        verification.addRule([
            {
                key: "emptyLogo", fun: function () {
                    if (isEmptyLogo) {
                        return true;
                    }
                    return !!this.find("img").attr("src").length;
                }
            },
            {
                key: "emptyTxt", fun: function () {
                    return !!this.find(".form_txt").val()
                }
            },
            {
                key: "emptyClass", fun: function () {
                    return !!this.find(".brand_type:checked").length;
                }
            },
            {
                key: "credentials", fun: function () {
                    if (isCredentials) {
                        return true;
                    }
                    return !!this.find("img[src!='']").length;
                }
            }
        ]);
        verification.init($upload_form, function () {
            this.setTipSkin("white1").setOffSet({
                left: 15,
                top: 10
            });
        });
       
        if ($page.find(".logoCon").length) {
            $.ajax({
                url: domains.api+"/category",
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    gData.ClassList = [], _arr = [];
                    for (var i in data) {
                        gData.ClassList.push({
                            value: i,
                            name: data[i].name
                        });
                    }
                    if (brandsBox) {
                        for (i in gData.ClassList) {
                            _arr.push('<option value="' + gData.ClassList[i].value + '">' + gData.ClassList[i].name + '</option>');
                        }
                        brandsBox.wmBox.find(".brands_selectt .sel_class").append(_arr.join(''));
                    }
                }
            });
            $.ajax({
                url: domains.api+"/brand/get",
                type: "get",
                data: {
                    category: 0,
                    key: ""
                },
                dataType: "jsonp",
                success: function (data) {
                    gData.BrandsList = data.list
                    if (brandsBox) {
                        brandsBox.setCon(_createBrandsList());
                    }
                }
            });
        }
        if ($brandid.val() - 0) {
            $brand_name.after('<a href="#" class="wm_ico fork2 del_ed_brand" title="删除已选品牌" style="position: absolute;left: 400px;top: 16px;"></a>');
            $upload_form.find(".brand_kinds").css({
                display: "none"
            });
        }
        if ($brand_img.attr("src")) {
            $brand_img.css({
                display: "block"
            });
        }
        $upload_form.find(".cre_img_con img[src!='']").css({
            display: "block"
        });

        bind();
    }
    var bind = function () {
        var $upload_form = $(".upload_form"),
            $more_bank_name = $upload_form.find(".more_bank_name"),
            $bankea_box = $upload_form.find(".bankea_box"),
            $bankareaId = $upload_form.find("#BankAreaId"),
            $get_ea_key = $upload_form.find(".get_ea_key"),
            $brand_name = $upload_form.find("#BrandName"),
            $brand_img = $upload_form.find(".brand_img img"),
            $logo_upload = $upload_form.find(".logo_upload"),
            $brand_kinds = $upload_form.find(".brand_kinds")
        ;
        var bindFileUpload = function (callback) {
            this.change(function () {
                var $this = $(this);
                upload.upload($this, function (data) {
                    var $up_row = this.closest(".up_row")
                    ;
                    if (data.response) {
                        $up_row.find("img").attr("src",$.trim( data.response.imgurl)).css("display", "block");
                        $up_row.find(".form_hide").val(data.response.imgurl);
                        $up_row.find("#BrandLogo").val(data.response.imgurl);
                        setTimeout(function () {
                            verification.hideTips($up_row.parent());
                        }, 400);
                        typeof callback === "function" && callback.call(this, data);
                    }
                });
                return false;
            });
        }
        var _ea_itme_html = juicer([
            '{@each Data as item}',
                '<li>',
                    '<a href="#" class="ea_item" data_id="${item.Id}"><i class="wm_ico hook6"></i>${item.Name}</a>',
                '</li>',
            '{@/each}'
        ].join(''));
        bindFileUpload.call($upload_form.find(".file_upload"));

        $upload_form.on("click", ":submit", function () {
            var $this = $(this), thisTips = $this.data("thisTips");
            isEmptyLogo = false, isCredentials = false;
            if (verification.verify($upload_form)) {
                if (!($upload_form.find("#BrandId").val()-0)) {
                    $.ajax({
                        url:domains.account+ "/actions/brand_exists",
                        data: {
                            name: encodeURIComponent($.trim($brand_name.val()))
                        },
                        type: "get",
                        dataType: "jsonp",
                        success: function (data) {
                            if (!data.response) {
                                $this.closest("form").submit();
                            } else {
                                if (!thisTips) {
                                    thisTips = new tips({
                                        ele: $this,
                                        con: '<p>品牌名称已存在！</p>',
                                        skin: 'white1',
                                        direction: "tc",
                                        close: 5000,
                                        offset: { top: -5, left: 0 }
                                    });
                                    $this.data("thisTips", thisTips);
                                }
                                thisTips.show();
                            }
                        }
                    });
                } else {
                    return true;
                }
            }
            return false;
        });

        $upload_form.find(".bank_item_chk").on("change", function () {
            var $this = $(this);
            if ($this.attr("data_id") && $this.attr("data_id") != "0") {
                $upload_form.find("#BankId").val($this.attr("data_id"));
                $bankea_box.css("display", "block");
            } else {
                $bankea_box.css("display", "none");
                $upload_form.find("#BankId").val(0);
            }
            if ($bankareaId.val()) {
                $bankareaId.val('');
                $get_ea_key.val('');
            }
            verification.position();
            $more_bank_name.empty();
        });
        $upload_form.on("click", ".more_bank", function () {
            var $this = $(this), _bankbox;
            _bankbox = $this.data("bankbox");
            if (!_bankbox) {
                _bankbox = bankbox.Create({
                    callback: function () {
                        this.checked(bankid);
                    },
                    chkedCallback: function () {
                        $upload_form.find("#BankId").val(this.val);
                        $more_bank_name.empty().append(this.name);
                        if (this.val) {
                            $upload_form.find(".bank_item_chk:checked").removeAttr("checked");
                            $bankea_box.css("display", "block");
                            $get_ea_key.val('');
                            $upload_form.find(".bank_item_chk[data_id='" + this.val + "']").attr("checked", "checked");
                        }
                    }
                });
                $this.data("bankbox", _bankbox);
            }
            _bankbox.show();
            return false;
        });
        $upload_form.on("click", ".get_ea", function () {
            var $this = $(this),
                _get_ea_key = $get_ea_key.val(),
                eaBox = $this.data("eaBox");
            if (!eaBox) {
                eaBox = box.alert({
                    titleText: "请选择开户行",
                    boxCls: "ea_box",
                    content: '<div class="ea_main"><p class="curr_data"><b>以选择：</b></p><ul class="ea_list"></ul><div class="wm_page ea_list_page"></div></div>',
                    btns: [
                            { cls: "ui_btn_h46red8 chked_btn", res: "hide", text: "确定" },
                            { cls: "alink", res: "hide", text: "取消" }],
                    callback: function () {
                        var self = this;
                        this.close = function () {
                            self.hide();
                        };
                        this.wmBox.on("click", ".ea_item", function () {
                            var $this = $(this);
                            var _txt = $.trim($this.text())
                            self.wmBox.find(".curr_data")
                                .data("curr_id", $this.attr("data_id"))
                                .data("curr_txt", _txt)
                                .empty().append('<b>以选择：</b>' + _txt);
                            self.wmBox.find(".curr").removeClass("curr");
                            $this.addClass("curr");
                            return false;
                        });
                        this.wmBox.on("dblclick", ".ea_item", function () {
                            var $this = $(this);
                            var _txt = $.trim($this.text())
                            self.wmBox.find(".curr_data")
                                .data("curr_id", $this.attr("data_id"))
                                .data("curr_txt", _txt)
                                .empty().append('<b>以选择：</b>' + _txt);
                            self.wmBox.find(".curr").removeClass("curr");
                            $this.addClass("curr");
                            self.wmBox.find(".chked_btn").click();
                            return false;
                        });
                        this.wmBox.on("click", ".chked_btn", function () {
                            var $curr_data = self.wmBox.find(".curr_data");
                            if ($curr_data.data("curr_id")) {
                                $bankareaId.val($curr_data.data("curr_id"));
                                $get_ea_key.val($curr_data.data("curr_txt"));
                            }
                            return false;
                        });
                    }
                });
                $this.data("eaBox", eaBox);
            }
            eaBox.setCon('<div class="ea_main"><p class="curr_data"><b>以选择：</b></p><ul class="ea_list"></ul><div class="wm_page ea_list_page"></div></div>');
            $.ajax({
                url: domains.account+"/actions/bank/list",
                type: "get",
                dataType: "jsonp",
                data: {
                    code: $upload_form.find("#BankId").val(),
                    key: _get_ea_key
                },
                success: function (data) {
                    if (data.response && data.response.TotalCount) {
                        var _appendHtml = _ea_itme_html.render(data.response);
                        eaBox.wmBox.find(".ea_list").empty().append(_get_ea_key ? _appendHtml.replace(new RegExp(_get_ea_key, "g"), '<b>' + _get_ea_key + '</b>') : _appendHtml);
                        var _page = page.Create({
                            url:domains.account+ '/actions/bank/list',
                            element: ".ea_list_page",
                            param: {
                                total: data.response.TotalCount,
                                size: data.response.PageSize,
                                code: $upload_form.find("#BankId").val(),
                                key: _get_ea_key
                            },
                            pagekey: "pageindex",
                            async: true,
                            index: 1,
                            size: data.response.PageSize,
                            sum: data.response.TotalCount,
                            front: true,
                            dataType: "jsonp",
                            success: function (data) {
                                var _appendHtml = _ea_itme_html.render(data.response);
                                eaBox.wmBox.find(".ea_list").empty().append(_get_ea_key ? _appendHtml.replace(new RegExp(_get_ea_key, "g"), '<b>' + _get_ea_key + '</b>') : _appendHtml);
                                _page.setIndex(this.index);
                            },
                            error: function () {
                                eaBox.wmBox.find(".ea_list").empty();
                                _page.setIndex(this.index);
                            }
                        });
                        eaBox.wmBox.find(".ea_list_page").css("display", "block");
                    } else {
                        eaBox.wmBox.find(".ea_list").empty().append('<li style="height: 40px;text-align:center;">暂无数据！</li>')
                    }
                }
            });
            eaBox.show();
            return false;
        });

        $upload_form.on("click", ".brand_btn", function () {
            if (!brandsBox) {
                brandsBox = brand_box.Create(function (data) {
                    var $brands_id = $upload_form.find("#BrandId"),
						$brand_name = $upload_form.find("#BrandName"),
						$brandLogo = $upload_form.find("#BrandLogo"),
						$brand_type = $upload_form.find(".brand_type")
                    ;
                    if (data.length) {
                        $brand_img.css({
                            display: "block"
                        }).attr("src", data.imgSrc);
                        $upload_form.find(".brand_img_file").remove();
                        $upload_form.find(".brand_kinds").css({
                            display: "none"
                        });
                        
                        $brands_id.val(data.id);
                        $brandLogo.val(data.imgSrc)
                        $brand_name.val(data.name).attr("disabled", "disabled");
                        if (!$upload_form.find(".del_ed_brand").length) {
                            $brand_name.after('<a href="#" class="wm_ico fork2 del_ed_brand" title="删除已选品牌" style="position: absolute;left: 400px;top: 16px;"></a>');
                        }
                        setTimeout(function () {
                            verification.verify($upload_form);
							verification.hideTips($brand_type.closest(".form_row"));
                        }, 300);
                    }
                });
            }
            brandsBox.show();
            return false;
        });

        $upload_form.on("click", ".del_ed_brand", function () {
            $brand_name.val('').removeAttr("disabled").focus();
            $brand_img.attr("src", "").css({
                display: "none"
            });
            if (!$logo_upload.find(".file_upload").length) {
                $logo_upload.append('<input type="file" class="file_upload brand_img_file" />');
                bindFileUpload.call($logo_upload.find(".file_upload"));
                $brand_kinds.css({
                    display: "block"
                });
            }
            $upload_form.find("#BrandId").val('');
            $(this).remove();
            return false;
        });

    }
    init();
})