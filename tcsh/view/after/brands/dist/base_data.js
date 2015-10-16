define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        upload = require('wmupload'),
        tips = require('wmtips'),
        showartwork = require('wmshowartwork');
    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            serviceQQHtml = [
                '<li class="form_row">',
                    '<label class="row_key">&nbsp;</label>',
                    '<input type="text" class="form_txt service_qq">',
                    '<a href="#" class="btn25_25 add_btn_service_qq">+</a>',
                    '<a href="#" class="btn25_25 del_btn_service_qq">-</a>',
                '</li>'].join('');
        $page.find(".up_img_box").hover(function () {
            var $this = $(this);
            $this.find(".preview_box").stop(true, true).animate({ width: 20 })
        }, function () {
            var $this = $(this);
            $this.find(".preview_box").stop(true, true).animate({ width: 1 })
        });
        $page.find(".form_file").on("change", function () {
            var $this = $(this);
            upload.upload($this, function (data) {
                var $img;
                if (data.response) {
                    $img = this.closest(".up_img_box").find("img");
                    this.find(".preview").removeData("showartwork");
                    if ($img.length) {
                        $img.attr("src", data.response.imgurl).css("display", "block");
                    } else {
                        this.closest(".up_img_box").append('<img src="' + data.response.imgurl + '" />');
                    }
                }
            });
            return false;
        });
        $page.on("click", ".preview", function () {
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
                            top:-5
                        }

                    });
                    $this.data("previewTips", _previewTips);
                }
                _previewTips.show();
            }
            return false;
        });
        $page.on("click", ".add_btn_service_qq", function () {
            var $this = $(this).closest(".form_row").after(serviceQQHtml);
            return false;
        });
        $page.on("click", ".del_btn_service_qq", function () {
            var $this = $(this).closest(".form_row"), $serviceQQHtml;
            $this.remove();
            $(".service_qq:eq(0)").closest(".form_row").find(".row_key").empty().append('客服QQ：');
            if (!$(".service_qq").length) {
                $serviceQQHtml = $(serviceQQHtml);
                $serviceQQHtml.find(".row_key").empty().append('客服QQ：');
                $page.find(".certificate").before($serviceQQHtml);
            }
            return false;
        });
    };
    init();
});