define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        juicer = require('juicer'),
        verification = require('wmverification'),
        tips = require('wmtips'),
        upload = require('wmupload');
    var init = function () {
        window.document.domain = "tcsh.me"
        var $form = $(".update_brands_story_form");
        $(".display_img").each(function () {
            var $this = $(this);
            $this.attr("src") && $this.css("display", "block").closest(".shopwindow_main").addClass("hover_mask");
        });
        verification.init();
        bind();
    };
    var bind = function () {
        var $form = $(".update_brands_story_form");
        var imgtype = 'jpg,jpeg,gif,png';
        var _shopwindowItemHtml = [
            '<li class="form_row mb20 shopwindow_item">',
                '<label class="row_key">&nbsp;</label>',
                '<div class="floatleft w410 shopwindow_main">',
                    '<a href="#" class="display">',
                        '<img src="" class="display_img" />',
                        '+',
                        '<span class="up_mask">点击修改</span>',
                    '</a>',
                    '<input type="text" class="form_txt mb7 c32 shopwindow_title" placeholder="店名/别名/Title">',
                    '<p class="pt-20"></p>',
                    '<input type="text" class="form_txt c32 shopwindow_remark" placeholder="地址/详细说明/备注">',
                    '<a href="#" class="btn25_25 add_shopwindow_item">+</a>',
                    '<a href="#" class="btn25_25 remove_shopwindow_item">-</a>',
                    '<input type="file" class="form_file shopwindow_img_file" title="点击上传">',
                '</div>',
            '</li>'
        ].join('');
        var _shopwindowImgFileChange = function () {
            var $this = $(this);
            var fileErrtips;
            var _v = $this.val();
            _v = _v.substr(_v.lastIndexOf(".") + 1).toLowerCase();
            if (imgtype.indexOf(_v) >= 0) {
                upload.upload($this, function (data) {
                    var $img_item = this.closest(".form_row");
                    if (data.response) {
                        $img_item.find(".display_img").attr("src", data.response.imgurl).css("display", "block");
                        $img_item.find(".shopwindow_main").addClass("hover_mask");
                    }
                });
            } else {
                fileErrtips = $this.data("fileErrtips");
                if (!fileErrtips) {
                    fileErrtips = new tips({
                        ele: $this.closest('.form_row').find(".img_brand"),
                        con: '<p>请选择：' + imgtype + '格式的文件进行上传！</p>',
                        close: 2000,
                        direction: 'rc',
                        offset: {
                            top: -5
                        }
                    });
                    $this.data("fileErrtips", fileErrtips);
                }
                fileErrtips.show();
            }
        };
        $form.on("click", ".img_brand", function () {
            var $this = $(this); $parent = $this.closest(".form_row");
            $parent.find('.form_file').click();
            return false;
        });
        $form.find(".brand_img_file").change(function () {
            var $this = $(this);
            var fileErrtips;
            var _v = $this.val();
            _v = _v.substr(_v.lastIndexOf(".") + 1).toLowerCase();
            if (imgtype.indexOf(_v) >= 0) {
                upload.upload($this, function (data) {
                    var $img_item = this.closest(".form_row");
                    if (data.response) {
                        $img_item.find("img").attr("src", data.response.imgurl);
                    }
                });
            } else {
                fileErrtips = $this.data("fileErrtips");
                if (!fileErrtips) {
                    fileErrtips = new tips({
                        ele: $this.closest('.form_row').find(".img_brand"),
                        con: '<p>请选择：' + imgtype + '格式的文件进行上传！</p>',
                        close: 2000,
                        direction: 'rc',
                        offset: {
                            top: -5
                        }
                    });
                    $this.data("fileErrtips", fileErrtips);
                }
                fileErrtips.show();
            }
            return false;
        });
        $form.find(".shopwindow_img_file").change(function () {
            _shopwindowImgFileChange.call(this);
            return false;
        });
        $form.on("click", ":submit", function () {
            var postData = {}
            if (verification.verify($form)) {
                postData.brand_img_url = $(".img_brand").find("img").attr("src");
                postData.Email = $form.find(".email").val();
                postData.FounderSay = $form.find(".founder_say").val();
                postData.shopwindowItem = [];
                $(".shopwindow_item").each(function () {
                    var _data = {};
                    var $this = $(this);
                    _data.img = $this.find(".display_img").attr("src");
                    _data.title = $this.find(".shopwindow_title").val();
                    _data.remark = $this.find(".shopwindow_remark").val();
                    if (_data.img && _data.title && _data.remark) {
                        postData.shopwindowItem.push(_data);
                    }
                });
                postData.shopwindowItem = JSON.stringify(postData.shopwindowItem);
                postData.Story = $form.find(".story").val();
                postData.CnName = $form.find(".cn_name").val();
                postData.EnName = $form.find(".en_name").val();
                postData.Country = $form.find(".country").val();
                postData.Year = $form.find(".year").val();
                postData.Product = $form.find(".product").val();
                postData.HeadQuarter = $form.find(".head_quarter").val();
                postData.BelongGroup = $form.find(".belong_group").val();
                postData.Remark = $form.find(".remark").val();
                $.ajax({
                    url: domains.sell+"/brand/update",
                    type: "post",
                    dataType: "json",
                    data: postData,
                    success: function (data) {
                        if (data.response.success) {
                            window.location.href = window.location.href;
                        }
                    }
                })
            }
            return false;
        });
        $form.on("click", ".display", function () {
            var $this = $(this); $parent = $this.closest(".form_row");
            $parent.find('.form_file').click();
            return false
        });
        $form.on("click", ".add_shopwindow_item", function () {
            var $shopwindowItemHtml = $(_shopwindowItemHtml);
            $shopwindowItemHtml.find(".shopwindow_img_file").change(function () {
                _shopwindowImgFileChange.call(this);
                return false;
            });
            $(".shopwindow_item:last").after($shopwindowItemHtml);
            return false;
        });
        $form.on("click", ".remove_shopwindow_item", function () {
            var $this = $(this), $item = $this.closest(".shopwindow_item"), errtips;
            if ($(".shopwindow_item").length > 1) {
                if ($item.index(".shopwindow_item") == 0) {
                    $item.remove();
                    $(".shopwindow_item:eq(0) .row_key").empty().append('橱窗展示：');
                } else {
                    $item.remove();
                }
            }
            else {
                $item.find(".add_shopwindow_item").click();
                $this.click();
            }
            return false;
        });
    };
    init();
});