define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        upload = require("wmupload"),
        lib = require("lib"),
        tips = require("wmtips"),
        box = require("wmbox"),
        verification = require("verification");
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);
    var postData = {}, global_data = {}, locateBox;
    var up_ad_material_main = juicer([
        '<div class="up_ad_material_main wm_form">',
            '<a href="#" class="close_ico close_80_80_1 close_btn"></a>',
            '<div class="up_ad_material_title"><h3>添加广告素材</h3><span class="remark">推荐使用按照尺寸要求制作图片，并采用本地上传</span></div>',
            '<ul>',
                '<li class="form_row not_wrap">',
                    '<label class="row_key">尺寸：</label><span class="adwh">${adWH}</span></li>',
                '<li class="form_row not_wrap">',
                    '<label class="row_key">支持格式：</label><span>JPEG，GIF，PNG</span></li>',
                '<li class="form_row">',
                    '<label class="row_key">广告链接地址：</label><input type="text" class="form_txt ad_url" /></li>',
                '<li class="form_row">',
                    '<label class="row_key">选择广告图片：</label>',
                    '<div class="floatleft w370">',
                        '<ul class="img_list">',
                        '</ul>',
                        '<span class="ui_btn ui_btn_h27gray8 up_new_img"><span class="ui_btn_txt">本地上传</span><input type="file" class="form_file add_new_img"></span>',
                    '</div>',
                '</li>',
                '<li class="form_row">',
                    '<label class="row_key">广告标题：</label><div class="floatleft"><input type="text" class="form_txt ad_msg" /><span class="remark">简洁明了的概括产品，字数不得超过15个字</span></div></li>',
                '<li class="form_row"><label class="row_key">&nbsp;</label><a href="#" class="ui_btn ui_btn_h39red15 save"><span class="ui_btn_txt">确定</span></a></li>',
            '</ul>',
        '</div>'].join(''));
    var initCycle = function (min_date_length, max_date_length) {
        var $cycle = $(".cycle");
        var _arr = [];
        do {
            _arr.push('<option value="' + max_date_length + '">' + max_date_length + '天</option>')
        }
        while (max_date_length-- > min_date_length)
        $cycle.removeAttr("disabled").empty().append(_arr.join(''));
    };
    var init = function () {
        document.domain = "tcsh.me";
        verification.addRule([
            {
                key: "materialEmpty",
                fun: function () {
                    var $form = $(".ad_check_in_form"),
                    $ad_url = $form.find(".ad_url"),
                    $ad_msg = $form.find(".ad_msg");
                    if (!($ad_url.length && $.trim($ad_url.val()).length && $ad_msg.length && $.trim($ad_msg.val()).length)) {
                        setTimeout(function () {
                            verification.hideTips();
                        }, 2000);
                        return false;
                    }
                    return true
                }
            },
            {
                key: 'imgEmpty',
                fun: function () {
                    var $form = $(".ad_check_in_form"),
                        $ad_img = $form.find(".ad_img");
                    return !!$ad_img.length && !!$ad_img.attr("src")
                }
            },
            {
                key: 'imgType',
                fun: function () {
                    var $form = $(".ad_check_in_form"),
                        $ad_img = $form.find(".ad_img"),
                        _src = $ad_img.attr("src"),
                        _typeList = "jpeg,jpg,gif,png";
                    return !!$ad_img.length && !!$ad_img.attr("src") && _typeList.indexOf(lib.getSuffixName(_src).toLowerCase()) > -1;
                }
            }
        ]);
        var $form = $(".ad_check_in_form");
        verification.init($form, function () {
            this.setTipSkin('yellow1');
        });
        bind();
        if (global_setting.initData) {
            postData.pageURL = global_setting.initData.page_url;
            $form.find(".page_list option[page_url='" + global_setting.initData.page_url + "']").attr("selected", "selected").change();
            window.dw(global_setting.initData.locateKey, true);
            $form.find(".cycle").val(global_setting.initData.cycle);
        }
        //upload.setUploadUrl('http://sell.wumeiwang.com/advert/util/upload');
    };
    var bind = function () {
        var $body = $("body"),
            $form = $(".ad_check_in_form"),
            $date_list = $form.find(".date_list"),
            $ad_url,
            $ad_msg,
            $before_box = $form.find(".before_box"),
            chkedBox,
            $ad_img = $form.find(".ad_img"),
            $submit_material = $form.find(".submit_material"),
            _baseDate = new Date(global_setting.serverDate - 0).getTime();
        var createChkImg = function (url, isRelevance) {
            if (url) {
                return '<li class="chk_img ' + (isRelevance ? 'url_relevance_img' : '') + '"><a href="#"><img src="' + url + '"/></a><span class="wm_ico hook13 nail"></span></li>';
            }
            return "";
        };
        $form.on("click", ".go_precision", function () {
            var $this = $(this), $pageList = $form.find(".page_list"), $option = $pageList.find(":selected");
            var _url = $option.attr("page_url"), _data = global_setting.urlList[_url];
            postData.pageURL = _url
            lib.cookie("wmad_locateKeyList", _data.locateKeyList.join(','));
            lib.cookie("wmad_asRemarkImgList", _data.asRemarkImgList.join(','));
            $body.css({
                overflow: "hidden"
            });
            locateBox = box.invBox({
                boxId: "wmad_locate",
                content: '<a href="#" class="close_ico close_80_80_1 close" style="top: 15px;right: 25px;position: absolute;"></a>',
                callback: function () {
                    this.setCon('<a href="#" class="close_ico close_80_80_1 close" style="top: 15px;right: 25px;position: absolute;"></a><iframe src="' + _url + '" style="width:100%;height:' + this.wmBox.outerHeight() + 'px"></iframe>');
                }
            });
            locateBox.show(function () {
                this.wmBox.css({
                    'margin-top': 0,
                    'margin-left': 0,
                    'margin': 0,
                    'left': 0,
                    'top': 0,
                    'bottom': 0,
                    'right': 0
                });
            });
            return false;
        });
        $form.on("click", ".submit_material,.submit_material2", function () {
            var $this = $(this), v_tip = $this.data("v_tip");
            if (postData.locateKey) {
                if (!chkedBox) {
                    chkedBox = box.invBox({
                        boxId: 'up_ad_material',
                        content: up_ad_material_main.render({
                            adWH: global_data.adWH
                        }),
                        callback: function () {
                            var self = this;
                            this.close = this.hide;
                            var _typeList = "jpeg,jpg,gif,png";
                            this.wmBox.find(".ad_url").on("change", function () {
                                var $this = $(this);
                                $.ajax({
                                    url: domains.api2 + "/product/getimg.json",
                                    data: {
                                        num: -1,
                                        url: encodeURIComponent($this.val())
                                    },
                                    type: "get",
                                    dataType: "jsonp",
                                    success: function (data) {
                                        var _arr, $curr_img;
                                        if (data  && data.length) {
                                            _arr = [];
                                            self.wmBox.find(".url_relevance_img").remove();
                                            for (var i in data) {
                                                _arr.push(createChkImg(data[i], 1));
                                            }
                                            self.wmBox.find(".img_list").append(_arr.join(''));
                                        }
                                        if (global_setting.initData) {
                                            $curr_img = self.wmBox.find(".chk_img img[src='" + global_setting.initData.curr_img + "']");
                                            if ($curr_img.length) {
                                                $curr_img.closest(".chk_img").click();
                                            } else {
                                                $curr_img = $(createChkImg(global_setting.initData.curr_img));
                                                self.wmBox.find(".img_list").prepend($curr_img);
                                                $curr_img.click();
                                            }
                                        }
                                    }
                                });
                            });
                            this.wmBox.find(".add_new_img").on("change", function () {
                                if (_typeList.indexOf(lib.getSuffixName($(this).val()).toLowerCase()) > -1) {
                                    upload.upload($(this), function (data) {
                                        self.wmBox.find(".img_list").prepend(createChkImg(data.response.imgurl));
                                    });
                                } else {
                                    alert("请上传jpg，gif，png文件！");
                                }
                            });
                            this.wmBox.on("click", ".chk_img", function () {
                                self.wmBox.find(".chked").removeClass("chked");
                                $(this).addClass("chked");
                                return false;
                            });
                            this.wmBox.on("click", ".save", function () {
                                if (!($ad_url && $ad_url.length)) {
                                    $before_box.before('<li class="form_row"><label class="row_key"><b class="form_must">*</b>广告链接地址：</label><input type="text" class="form_txt w440 ad_url" wmv="empty|url" wmvmsg="广告链接地址不能为空！|请输入正确的URL地址！"/></li><li class="form_row"><label class="row_key"><b class="form_must">*</b>广告标题：</label><input type="text" class="form_txt w440 ad_msg"wmv="empty|max:15" wmvmsg="广告标题不能为空！|广告标题不能超过15个字符！" /></li>');
                                    $ad_url = $form.find(".ad_url");
                                    $ad_msg = $form.find(".ad_msg");
                                }
                                $ad_url.val(self.wmBox.find('.ad_url').val());
                                $ad_msg.val(self.wmBox.find('.ad_msg').val());
                                $ad_img.attr("src", self.wmBox.find('.chked img').attr("src")).css({
                                    display: "block"
                                });

                                $submit_material.replaceWith('<a href="#" class="ui_btn ui_btn_h27gray8 submit_material2"><span class="ui_btn_txt">重新选择素材</span></a>');
                                self.hide();
                                return false;
                            });
                            this.wmBox.on("click", ".close_btn", function () {
                                self.hide();
                                return false;
                            });
                            if (global_setting.initData) {
                                $ad_url = $form.find(".ad_url");
                                $ad_msg = $form.find(".ad_msg");
                                this.wmBox.find(".ad_url").val(global_setting.initData.ad_url).change();
                                this.wmBox.find(".ad_msg").val(global_setting.initData.ad_msg);
                            }
                        }
                    });
                }
                verification.hideTips($form);
                //主页面与弹窗数据关联
                $ad_url && chkedBox.wmBox.find(".ad_url").val($ad_url.val());
                $ad_msg && chkedBox.wmBox.find(".ad_msg").val($ad_msg.val());
                chkedBox.wmBox.find(".adwh").empty().append(global_data.adWH);
                chkedBox.show();
            } else {
                if (!v_tip) {
                    v_tip = new tips({
                        ele: $this,
                        con: '<p><span class="iconfont">&#xf0142;</span>请先确定广告位置！</p>',
                        close: 3000,
                        direction: "rt",
                        offset: {
                            left: 10,
                            top: 5
                        }
                    });
                    $this.data("v_tip", v_tip);
                }
                v_tip.show();
            }
            return false;
        });
        $form.on("click", ":submit", function () {
            var $this = $(this), verificationBox;
            var postURL = domains.api2 + "/tempadvert/seller/add.json";
            if (verification.verify($form)) {
                postData.ad_name = encodeURIComponent($form.find(".ad_name").val());
                postData.ad_sdate = $form.find(".show_date").val();
                postData.cycle = $form.find(".cycle").val();
                postData.ad_img = encodeURIComponent($ad_img.attr("src") || "");
                postData.channelId = $form.find(".page_list").val();
                if (global_setting.initData && global_setting.initData.guid) {
                    postData.stateStr = global_setting.initData.stateStr;
                    postData.guid = global_setting.initData.guid;
                    postURL = domains.api2 + "/advert/seller/update.json";
                    $ad_url = $form.find(".ad_url");
                    $ad_msg = $form.find(".ad_msg");
                }
                postData.ad_url = encodeURIComponent($ad_url.val());
                postData.ad_msg = encodeURIComponent($ad_msg.val());
                verificationBox = $this.data("verificationBox");
                if (!verificationBox) {
                    verificationBox = box.invBox({
                        boxId: 'verification_box',
                        content: '<p class="msg"><i class="wm_ico loading32_32_1" style="margin-right: 14px;"></i>正在检测数据…</p>'
                    });
                    $this.data("verificationBox", verificationBox);
                }
                verificationBox.setCon('<p class="msg"><i class="wm_ico loading32_32_1" style="margin-right: 14px;"></i>正在检测数据…</p>');
                verificationBox.position();
                verificationBox.show();
                //异步检测广告链接地址是否正确
                $.ajax({
                    url: domains.api2 + "/advert/checkurl.json",
                    type: "get",
                    dataType: "jsonp",
                    cache: false,
                    data: {
                        ad_url: postData.ad_url
                    },
                    success: function (data) {
                        if (data.success) {
                            verificationBox.setCon('<p class="msg"><i class="wm_ico loading32_32_1" style="margin-right: 14px;"></i>验证成功，保存中...</p>');
                            verificationBox.position();
                            $.ajax({
                                url: postURL,
                                data: postData,
                                dataType: "jsonp",
                                type: "get",
                                success: function (data) {
                                    if (data.success) {
                                        verificationBox.setCon('<p class="msg"><i class="wm_ico hook8" style="margin-right: 14px;"></i>提交成功，等待审核！<span class="remark">0秒后关闭</span></p>');
                                        verificationBox.position();
                                        lib.countdown({
                                            parent: verificationBox.wmBox.find(".msg"),
                                            ele: "#verification_box .remark",
                                            countdownModel: '<span class="remark">${i}秒后跳转，单击马上跳转</span>',
                                            start: 3,
                                            endCallBack: function () {
                                                window.location.reload();
                                            }
                                        });
                                    } else {
                                        verificationBox.setCon('<p class="msg"><i class="wm_ico hook8" style="margin-right: 14px;"></i>' + (data.error || "提交失败！") + '<span class="remark">0秒后关闭</span></p>');
                                        verificationBox.position();
                                        lib.countdown({
                                            parent: verificationBox.wmBox.find(".msg"),
                                            ele: "#verification_box .remark",
                                            countdownModel: '<span class="remark">${i}秒后关闭</span>',
                                            start: 3,
                                            endCallBack: function () {
                                                verificationBox.hide();
                                            }
                                        });
                                    }
                                },
                                error: function () {
                                    verificationBox.setCon('<p class="msg"><i class="wm_ico ban1" style="margin-right: 14px;"></i>服务器繁忙，请稍候再试！<span class="remark">0秒后关闭</span></p>');
                                    verificationBox.position();
                                    lib.countdown({
                                        parent: verificationBox.wmBox.find(".msg"),
                                        ele: "#verification_box .remark",
                                        countdownModel: '<span class="remark">${i}秒后关闭</span>',
                                        start: 3,
                                        endCallBack: function () {
                                            verificationBox.hide();
                                        }
                                    });
                                }
                            });
                        } else {
                            verificationBox.setCon('<p class="msg"><i class="wm_ico ban1" style="margin-right: 14px;"></i>不允许输入同城生活以外的URL，或者非商家本人的商品和店铺！<span class="remark">0秒后关闭</span></p>');
                            verificationBox.position();
                            lib.countdown({
                                parent: verificationBox.wmBox.find(".msg"),
                                ele: "#verification_box .remark",
                                countdownModel: '<span class="remark">${i}秒后关闭</span>',
                                start: 3,
                                endCallBack: function () {
                                    verificationBox.hide();
                                }
                            });
                        }
                    },
                    error: function () {
                        verificationBox.setCon('<p class="msg"><i class="wm_ico ban1" style="margin-right: 14px;"></i>服务器繁忙，请稍候再试！<span class="remark">0秒后关闭</span></p>');
                        verificationBox.position();
                        lib.countdown({
                            parent: verificationBox.wmBox.find(".msg"),
                            ele: "#verification_box .remark",
                            countdownModel: '<span class="remark">${i}秒后关闭</span>',
                            start: 3,
                            endCallBack: function () {
                                verificationBox.hide();
                            }
                        });
                    }
                });
            }
            return false;
        });
        $form.find(".page_list").on("change", function () {
            var $this = $(this), page_url = $this.find("option:selected").attr("page_url");
            postData.locateKey = null;
            $form.find(".precision_name").empty();
            $form.find(".ad_wh").empty();
            if (!global_setting.urlList[page_url]) {
                $.ajax({
                    url: domains.api2 + "/advert/info.json",
                    dataType: "jsonp",
                    data: {
                        channelId: $this.val()
                    },
                    success: function (data) {
                        global_setting.urlList[page_url] = data[page_url];
                    },
                    error: function () {

                    }
                });
            }
        });
        $form.find(".show_date").datepicker({
            minDate: new Date(_baseDate - 86400000 * 1),
            //minDate: new Date(_baseDate + 86400000 * 3),
            maxDate: new Date(_baseDate + 86400000 * 90),
            onClose: function (data, e) {
                if (!(/\d{4}-\d{2}-\d{2}/.test(data))) {
                    e.input.val('');
                }
                setTimeout(function () {
                    verification.verify(e.input.parent());
                }, 500);
            }
        });
        $form.find(".show_date,.cycle").on("change", function () {
            var _dateV = $form.find(".show_date").val(),
                _cycleV = $form.find(".cycle").val();
            if (_dateV && _cycleV) {
                $.ajax({
                    url: domains.api2 + '/advert/seller/getputdate.json',
                    type: "get",
                    dataType: "jsonp",
                    data: {
                        ad_sdate: _dateV,
                        cycle: _cycleV,
                        locationid: global_data.locationid
                    },
                    success: function (data) {
                        var _arr = [], i = 0;
                        if (data.date_list.length) {
                            for (; i < data.date_list.length; i++) {
                                _arr.push('<li>&#xf006a;<span>' + data.date_list[i] + '</span></li>');
                            }
                            $date_list.empty().append(_arr.join(''));
                        }

                    },
                    error: function () {

                    }
                });
            } else {
                $date_list.empty();
            }
        });
        window.dw = function (key, isInit) {
            var _data = global_setting.urlList[postData.pageURL].data[key], _adWH;
            postData.locateKey = key;
            postData.locationid = global_data.locationid = _data.id;
            //postData.locationid = global_data.locationid = _data.locationid;
            $form.find(".precision_name").empty().append(_data.adName);
            $form.find(".ad_wh").empty().append(_data.adWH);
            _adWH = _data.adWH.split('*');
            global_data.adWH = _data.adWH;
            $form.find(".go_precision .ui_btn_txt").empty().append('重新确定广告位');
            lib.removeCookie('wmad_locateKeyList');
            lib.removeCookie('wmad_asRemarkImgList');
            initCycle(_data.min_date_length, _data.max_date_length);
            if (!isInit) {
                $form.find(".show_date").val('').removeAttr("disabled");
                $date_list.empty();
            }

            locateBox && locateBox.close(function () {
                $body.css({
                    overflow: "auto"
                });
                locateBox = null;
            });
            return false;
        };
    };
    init();
});