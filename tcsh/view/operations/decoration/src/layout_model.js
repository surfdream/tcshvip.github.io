define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";

    var domains = require('domains');
    var $ = require("jquery"),
        box = require("wmbox"),
        juicer = require("juicer");

    var init = function () {

        bind();

    };
    var bind = function () {
        var $page = $("#page");
        var _model_attr_box = juicer([
            '<div class="model_attr_head">',
                '<h3>{@if id}编辑{@else}添加{@/if}-装修模块</h3>',
                '<a href="#" class="iconfont close">&#xf00b3;</a>',
            '</div>',
            '<div class="model_attr_con">',
                '<ul class="wm_form">',
                    '<li class="form_row">',
                        '<label class="row_key">模块名称：</label>',
                        '<input type="text" class="form_txt model_name" value="${name}" />',
                    '</li>',
                    '<li class="form_row">',
                        '<label class="row_key">图标：</label>',
                        '<div class="file_box">',
                            '<img src="{@if model_ico}${model_ico}{@else}' + domains.a + '/tcsh/view/public/img/pit.png{@/if}" class="model_ico" />',
                            '<span class="iconfont">&#xf0024;</span>',
                            '<input type="file" class="form_file" />',
                        '</div>',
                    '</li>',
                    '<li class="form_row">',
                        '<label class="row_key">模块说明：</label>',
                        '<textarea class="form_textarea w500 model_remark"></textarea>',
                    '</li>',
                    '<li class="form_row">',
                        '<label class="row_key">使用费：</label>',
                        '<input type="text" class="form_txt w30 costs" value="${costs}" />/',
                        '<select class="form_sel costs_unit">',
                            '<option vlaue="月">月</option>',
                            '<option value="年">年</option>',
                        '</select>',
                    '</li>',
                    '<li class="form_row">',
                        '<label class="row_key">装修引用：</label>',
                        '<input type="text" class="form_txt w500 set_page_url" value="${set_page_url}" />',
                    '</li>',
                    '<li class="form_row">',
                        '<label class="row_key">&nbsp;</label>',
                        '<a href="#" class="submit">保存</a>',
                    '</li>',
                '</ul>',
            '</div>'
        ].join(''));
        var createModelBox = function (data) {
            return box.invBox({
                boxCls: "model_attr_box",
                content: _model_attr_box.render(data),
                callback: function () {
                    this.close = this.hide;
                    this.wmBox.find(".model_remark").val(data.remark);
                    this.wmBox.find(".costs_unit").val(data.costs_unit);
                }
            });
        };

        //添加
        $page.on("click", ".add_model", function () {
            var $this = $(this), model_attr_box = $this.data("model_attr_box");
            if (!model_attr_box) {
                model_attr_box = createModelBox({});
                $this.data("model_attr_box", model_attr_box);
            }
            model_attr_box.show();
            return false;
        });
        //修改
        $page.on("click", ".edit_model", function () {
            var $this = $(this), model_attr_box = $this.data("model_attr_box"),$tr=$this.closest("tr");
            if (!model_attr_box) {
                model_attr_box = createModelBox($tr.data("row_data"));
                $this.data("model_attr_box", model_attr_box);
            }
            model_attr_box.show();
            return false;
        });
    };
    init();
});
