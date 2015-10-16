define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        box = require("wmbox"),
        juicer = require("juicer"),
        upload = require("wmupload"),
        showartwork = require('wmshowartwork'),
        tips = require('wmtips'),
        area = require('area'),
        page = require('wmpage'),
        bankbox = require('bankbox'),
        brand_box = require('brand_box'),
        lib = require('lib'),
        verification = require("wmverification");
    var gData = {}, brandsBox;
    var init = function () {
        if (lib.cookie('agree_and_register')) {

        }
        var $page = $("#page"), $more_bank = $page.find(".more_bank");
        $more_bank.length && $more_bank.after('<span class="more_bank_name" style="float: left;font-size: 12px;margin: 10px;"></span>');
        verification.addRule([
            {
                key: "service_qq", fun: function () {
                    var i = 0;
                    $(".service_qq").each(function () {
                        var $this = $(this);
                        if (/[1-9][0-9]{4,}/.test($this.val())) {
                            i++;
                        }
                    });
                    return !!i;
                }
            },
            {
                key: "two_domain_name", fun: function () {
                    return /^[A-Za-z0-9]+$/.test(this.val());
                }
            },
            {
                key: "brandEmpty", fun: function () {
                    return !!this.find("#brands_id").val();
                }
            },
            {
                key: "contactPhone", fun: function (v) {
                    var phoneRegExp = /^1[3|4|5|8]\d{9}$/,
                        phone86RegExp = /^((\+86)|(86))?(13)\d{9}$/,
                        landlineRegExp = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
                    return phoneRegExp.test(v) || landlineRegExp.test(v) || phone86RegExp.test(v);
                }
            }
        ]);
        verification.init();
        verification.strikingSuccess = false;
        if ($page.find(".confirm_brands").length) {
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
        bind();
        $page.find(".bank_item_chk:eq(0)").click();
    };
    var bind = function () {
        var $form = $(".check_in_form"),
            $img,
            $bankea_box, $bankah_box,
            $more_bank_name,
            serviceQQHtml = [
                '<li class="form_row">',
                    '<label class="row_key w100 ">&nbsp;</label>',
                    '<input type="text" class="form_txt w150 service_qq">',
                    '<a href="#" class="btn25_25 add_btn_service_qq">+</a>',
                    '<a href="#" class="btn25_25 del_btn_service_qq">-</a>',
                '</li>'].join('');
        var _invBox, eaBox;
        var _ea_itme_html = juicer([
            '{@each Data as item}',
                '<li>',
                    '<a href="#" class="ea_item" data_id="${item.Id}"><i class="wm_ico hook6"></i>${item.Name}</a>',
                '</li>',
            '{@/each}'
        ].join(''));
        var vTwoDomain = function (callback) {
            if (!_invBox) {
                _invBox = box.invBox({
                    content: '<p style="text-align: center;line-height: 70px;"><img src="http://s.tcsh.me/tcsh/view/public/img/loading/loading18_18_1.gif" style="vertical-align: middle;" /> 正在检测二级域名是否可用！</p>',
                    btns: []
                });
            }
            _invBox.show();
            $.ajax({
                url: domains.account+"/seller/keyExists",
                type: "get",
                timeout: 3000,
                data: {
                    key: $form.find(".two_domain_name").val()
                },
                dataType: "jsonp",
                success: function (data) {
                    if (!data.response) {
                        _invBox.hide();
                        typeof callback === "function" && callback();
                    } else {
                        _invBox.setCon('<p style="text-align: center;line-height: 70px;">' + (data.msg || "域名已存在！") + '</p>');
                        setTimeout(function () {
                            _invBox.hide();
                        }, 3000)
                    }
                },
                error: function () {
                    var i = 5;
                    _invBox.setCon('<p style="text-align: center;line-height: 70px;">服务器繁忙请稍后再试！' + i + '秒后刷新</p>');
                    setInterval(function () {
                        _invBox.setCon('<p style="text-align: center;line-height: 70px;">服务器繁忙请稍后再试！' + --i + '秒后刷新</p>');
                        if (!i) {
                            //window.location.href = window.location.href;
                        }
                    }, 1000)
                }
            });
        };
        $form.on("click", ":submit", function () {
            var $QQ = $form.find("#QQ"),
                $service_qq = $form.find(".service_qq"),
                qqArr = [];
            if ($service_qq.length) {
                $service_qq.each(function () {
                    var _v = $(this).val();
                    _v && qqArr.push(_v);
                });
                $QQ.val(qqArr.join(','));
            }
            if ($form.find("#user_name[error]").length) {
                return false;
            }
            if ($form.find(".two_domain_name").length) {
                if (verification.verify($form)) {
                    vTwoDomain(function () {
                        $form.submit();
                    });
                }
                return false;
            }
            return verification.verify($form);
        });
        $form.on("blur", "#user_name", function () {
            var $this = $(this), $msg = $("[for='" + $this.attr("name") + "']"), _v = $this.val();
            if (_v && !$this.attr("wmvresult")) {
                $msg.empty().append('<i class="loading18_18_1"></i>正在检测登录名');
                $.ajax({
                    url: domains.account+'/nameExists',
                    data: {
                        username: encodeURI(_v)
                    },
                    type: 'get',
                    dataType: 'jsonp',
                    success: function (data) {
                        if (data.response) {
                            $this.attr("error", "用户名已存在");
                            $msg.empty().append('<i class="wm_ico fork2"></i>用户名已存在！');
                        } else {
                            $this.removeAttr("error");
                            $msg.empty();
                        }
                    }
                });
            }
        });
        $form.find('#user_name').focus();
        $form.on("click", ".change_code", function () {
            $form.find(".v_code img").attr("src", domains.account+"/auth")
            return false
        });
        $form.on("click", ".add_btn_service_qq", function () {
            var $this = $(this).closest(".form_row").after(serviceQQHtml);
            return false;
        });
        $form.on("click", ".del_btn_service_qq", function () {
            var $this = $(this).closest(".form_row"), $serviceQQHtml;
            $this.remove();
            $(".service_qq:eq(0)").closest(".form_row").find(".row_key").empty().append('<b class="form_must">*</b>客服QQ：');
            if (!$(".service_qq").length) {
                $serviceQQHtml = $(serviceQQHtml);
                $serviceQQHtml.find(".row_key").empty().append('<b class="form_must">*</b>客服QQ：');
                $serviceQQHtml.attr("name", "service_qq").attr("wmv", "service_qq").attr("wmvmsg", "至少存在一个客服QQ！").append('<span class="wmv_msg" for="service_qq"></span>');
                $form.find(".certificate").before($serviceQQHtml);
            }
            return false;
        });
        //$form.on("blur", ".two_domain_name", function () {
        //    if (verification.verify($form)) {
        //        vTwoDomain();
        //    }
        //});
        $form.find(".two_domain_name").on("keydown", function (event) {
            if (event.keyCode == "13") {
                return false;
            }
        });
        $form.on("click", ".confirm_brands", function () {
            if (!brandsBox) {
                brandsBox = brand_box.Create(function (data) {
                    var $brands_id = $form.find("#brands_id")
                    if (data.length) {
                        if ($img && $img.length) {
                            $img.attr("src", data.imgSrc);
                        } else {
                            $form.find(".confirm_brands").append('<img src="' + data.imgSrc + '" />');
                            $img = $form.find(".confirm_brands img");
                        }
                        $brands_id.val(data.id);
                        $form.find("[for='BrandIdBox']").empty();
                    }
                });
            }
            brandsBox.show();
            return false;
        });
        $form.find(".up_img_box").hover(function () {
            var $this = $(this);
            $this.find(".preview_box").stop(true, true).animate({ width: 20 })
        }, function () {
            var $this = $(this);
            $this.find(".preview_box").stop(true, true).animate({ width: 1 })
        });
        upload.setUploadUrl(domains.account+"/actions/files/upload?", {
            UserName: $form.find("#UserName").val()
        });
        $form.find(".up_img_box .form_file").on("change", function () {
            var $this = $(this);
            upload.upload($this, function (data) {
                var $img;
                if (data.response) {
                    $img = this.closest(".up_img_box").find("img");
                    this.find(".preview").removeData("showartwork");
                    this.closest(".up_img_box").find(".file_url").val(data.response.imgurl);
                    if ($img.length) {
                        $img.attr("src", data.response.imgurl).css("display", "block");
                    } else {
                        this.closest(".up_img_box").append('<img src="' + data.response.imgurl + '" />');
                    }
                }
            });
            return false;
        });
        $form.on("click", ".preview", function () {
            var $this = $(this), $up_img_box = $this.closest(".up_img_box"), $img = $up_img_box.find("img"), _showartwork, _previewTips;
            if ($img.length) {
                _showartwork = $this.data("showartwork");
                if (!_showartwork) {
                    _showartwork = showartwork.create($img.attr("src"));
                    $this.data("showartwork", _showartwork);
                }
                _showartwork.show();
            }
            else {
                _previewTips = $this.data("previewTips");
                if (!_previewTips) {
                    _previewTips = new tips({
                        ele: $up_img_box,
                        con: '<p>没有可预览图片！</p>',
                        close: 2000,
                        direction: 'tc',
                        offset: {
                            top: -5
                        }
                    });
                    $this.data("previewTips", _previewTips);
                }
                _previewTips.show();
            }
            return false;
        });
        $form.on("click", ".get_ea", function () {
            var _get_ea_key = $form.find(".get_ea_key").val();
            if (!eaBox) {
                eaBox = box.alert({
                    titleText: "请选择开户行地址",
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
                                $form.find("#BankAreaId").val($curr_data.data("curr_id"));
                                $form.find(".get_ea_key").val($curr_data.data("curr_txt"));
                            }
                            return false;
                        });
                    }
                });
            }
            eaBox.setCon('<div class="ea_main"><p class="curr_data"><b>以选择：</b></p><ul class="ea_list"></ul><div class="wm_page ea_list_page"></div></div>');
            $.ajax({
                url:domains.account+ "/actions/bank/list",
                type: "get",
                dataType: "jsonp",
                data: {
                    code: $form.find("#BankId").val(),
                    key: _get_ea_key
                },
                success: function (data) {
                    if (data.response && data.response.TotalCount) {
                        var _appendHtml = _ea_itme_html.render(data.response);
                        eaBox.wmBox.find(".ea_list").empty().append(_get_ea_key ? _appendHtml.replace(new RegExp(_get_ea_key, "g"), '<b>' + _get_ea_key + '</b>') : _appendHtml);
                        var _page = page.Create({
                            url: domains.account+'/actions/bank/list',
                            element: ".ea_list_page",
                            param: {
                                total: data.response.TotalCount,
                                size: data.response.PageSize,
                                code: $form.find(".bank_item_chk:checked").attr("data_id"),
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
        $form.on("change", ".bank_item_chk", function () {
            var $this = $(this);
            if (!$bankea_box || !$bankea_box.length) {
                $bankea_box = $form.find(".bankea_box");
            }
            if (!$bankah_box || !$bankah_box.length) {
                $bankah_box = $form.find(".bankah_box");
            }
            if ($this.attr("data_id") && $this.attr("data_id") != "0") {
                $form.find("#BankId").val($this.attr("data_id"));
                $bankea_box.css("display", "block");
                $bankah_box.css("display", "block");
            } else {
                $bankea_box.css("display", "none");
                $bankah_box.css("display", "none");
                $form.find("#BankId").val(0);
            }
            if (!$more_bank_name) {
                $more_bank_name = $form.find(".more_bank_name");
            }
            $more_bank_name.empty();
        });
        $form.on("click", ".more_bank", function () {
            var $this = $(this), _bankbox, $get_ea_key = $form.find(".get_ea_key");
            _bankbox = $this.data("bankbox");
            if (!_bankbox) {
                _bankbox = bankbox.Create({
                    chkedCallback: function () {
                        $form.find("#BankId").val(this.val);
                        if (!$more_bank_name) {
                            $more_bank_name = $form.find(".more_bank_name");
                        }
                        $more_bank_name.empty().append(this.name);
                        if (this.val) {
                            $form.find(".bank_item_chk:checked").removeAttr("checked");
                            $bankea_box.css("display", "block");
                            $bankah_box.css("display", "block");
                            $get_ea_key.val('');
                        }
                    }
                });
                $this.data("bankbox", _bankbox);
            }
            _bankbox.show();
            return false;
        });
    };
    init();
});
