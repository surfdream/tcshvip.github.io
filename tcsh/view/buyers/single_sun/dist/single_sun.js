define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        upload = require("wmupload"),
        tips = require("wmtips"),
        box = require("wmbox"),
        verification = require("wmverification");
    var init = function () {
        verification.init($(".single_sun"));

        bind();
    };
    var bind = function () {
        var $form = $(".single_sun"), $img_list = $form.find(".img_list");
        var uploadTips;
        $form.find(".up_img_file").on("change", function () {
            var $this = $(this);
            upload.upload($this, function (data) {
                if (data.response && data.upLoadSuccess) {
                    $img_list.append('<li><a href="#" class="wm_ico fork2 del_upimg" title="删除此图"></a><img src="' + data.response.imgurl + '" title="晒单照片" alt="晒单照片" class="img_item"></li>')
                } else {
                    if (!uploadTips) {
                        uploadTips = new tips({
                            ele: ".uploadimg_btn",
                            con: "上传失败，请重新上传！",
                            skin: "red2",
                            direction: "tc",
                            offset: { top: -5 },
                            close: 2000
                        });
                    }
                    uploadTips.show();
                }
            });
        });
        $form.on("click", ".del_upimg", function () {
            var $this = $(this);
            $this.closest("li").remove();
            return false;

        });
        $form.on("click", ":submit", function () {
            var _v = verification.verify($form), _picUrlArr=[];
            if (_v) {
                $img_list.find(".img_item").each(function () {
                    _picUrlArr.push($(this).attr("src"));
                });
                $form.find("#PicUrl").val('["'+_picUrlArr.join('","')+'"]');
            } else {
                return false;
            }
        });
    };
    init();
});
