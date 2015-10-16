define(function (require, exports, module) {
    var $ = require("jquery"),
        upload = require('wmupload'),
        juicer = require("juicer");
    var itemHtml = [
        '<li class="p_forimg_item">',
            '<ul>',
                '<li class="form_row">',
                    '<label class="row_key">优先级：</label>',
                    '<input type="text" class="form_txt txt_index w30" /></li>',
                '<li class="form_row">',
                    '<label class="row_key">标题：</label>',
                    '<input type="text" class="form_txt txt_title w500" /></li>',
                '<li class="form_row">',
                    '<label class="row_key">链接地址：</label>',
                    '<input type="text" class="form_txt txt_url w500" placeholder="http://" /></li>',
                '<li class="form_row">',
                    '<label class="row_key">图片：</label>',
                    '<div class="relative floatleft">',
                        '<a href="#" class="upimg">+',
                        '<span>图片比例为<b>740*250</b></span>',
                        '</a>',
                        '<input type="file" class="form_file" title="点击上传">',
                        '<input type="hidden" name="xxx" class="file_url">',
                    '</div>',
                '</li>',
            '</ul>',
            '<a class="wm_ico fork1 del_item" title="删除"></a>',
        '</li>'
    ].join('');
    var init = function () {
        var $page = $("#page"), $forimg_list = $page.find(".p_forimg_list");
        window.document.domain = "tcsh.me";
        $forimg_list.prepend('<li class="btns fixed_box" style="left:' + ($forimg_list.offset().left + $forimg_list.outerWidth()) + 'px"><a href="#" class="add" title="添加优先店铺">+</a></li>');
        bind();
    };
    var bind = function () {
        var $page = $("#page"), $before_box = $page.find(".before_box");
        $page.on("click", ".show", function () {
            var $this = $(this);
            $this.closest(".p_forimg_item").find(".none").removeClass("none");
            $this.remove();
            return false;
        });
        $page.on("click", ".add", function () {
            var $before = $(itemHtml);
            $before_box.before(itemHtml);
            return false;
        });
        $page.on("click", ".del_item", function () {
            if (confirm("确定要删除？")) {
                $(this).closest(".p_forimg_item").remove();
            }
            return false;
        });
        $page.on("click", ".removeAll", function () {
            if (confirm("确定要删除全部？")) {
                $page.find(".p_forimg_item").remove();
            }
            return false;
        });
        $page.find(".form_file").change(function () {
            var $this = $(this);
            upload.upload($this, function (data) {
                if (data.response) {
                    this.closest(".form_row").find("img").attr("src", data.response.imgurl).css("display", "block");
                }
            });
            return false;
        });
    };
    init();
});
