define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require('jquery'),
        juicer = require('juicer'),
        upload = require('wmupload'),
        verification = require('verification'),
        box = require('wmbox');
    window.document.domain = "tcsh.me";
    var init = function () {
        bind();
    };
    var bind = function () {
        var $page = $("#page")
        ;
        var _face_box = juicer([
            '<div class="afb_head">',
                '<h3>添加社徽</h3>',
                '<a href="#" class="iconfont close">&#xf00b3;</a>',
            '</div>',
            '<div class="afb_main">',
                '<form action="' + domains.operator + '/commune/sys_icon/add.json" method="post">',
                    '<div class="wm_form">',
                        '<ul>',
                            '<li class="form_row">',
                                '<label class="row_key"><b class="form_must">*</b>标题：</label>',
                                '<input type="text" class="form_txt" name="title" value="${name}" wmv="empty" wmvmsg="标题不能为空！" />',
                            '</li>',
                            '<li class="form_row">',
                                '<label class="row_key"><b class="form_must">*</b>图片：</label>',
                                '<img src="" style="display:none" />',
                                '<span href="#" class="iconfont upface" style="vertical-align: top;margin-left: 10px;">&#xf0024;</span>',
                                '<input type="file" class="form_file" />',
                                '<input type="hidden" class="face_url" name="imagePath" />',
                            '</li>',
                        '</ul>',
                    '</div>',
                    '<div class="btns">',
                        '<a href="#" class="close">取消</a><input type="submit" class="submit" value="确定">',
                    '</div>',
                '</form>',
            '</div>'
        ].join(''));
        $page.on("click", ".add_face", function () {
            var $this = $(this),
                face_box = $this.data("face_box");
            if (!face_box) {
                face_box = box.invBox({
                    boxCls: "af_box",
                    content: _face_box.render({}),
                    callback: function () {
                        var self = this;
                        this.wmBox.find(".form_file").on("change", function () {
                            upload.upload($(this), function (data) {
                                var $form_row = this.closest(".form_row")
                                if (data.response) {
                                    $form_row.find("img").attr("src", data.response.imgurl).css("display", "block");
                                    $form_row.find(".face_url").val(data.response.imgurl);
                                }
                            });
                        });
                        this.wmBox.on("click", ".submit", function () {
                            return verification.verify(self.wmBox);
                        });
                    }
                });
                $this.data("face_box", face_box);
            }
            face_box.show();
            return false;
        });
        $page.on("click", ".remove_face", function () {
            var $li = $(this).closest("li");
            $.ajax({
                url: domains.operator + "/commune/sys_icon/delete.json",
                data: {
                    ids: $li.attr("data_id")
                },
                success: function (data) {
                    if (data.success) {
                        $li.fadeOut(function () {
                            $li.remove();
                        });
                    }
                }
            });
            return false;
        });
    };
    init();
});
