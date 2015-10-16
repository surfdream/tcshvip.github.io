define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
        box = require("wmbox"),
        juicer = require("juicer")
    ;


    var init = function () {

        bind();

    };
    var bind = function () {
        var $form = $("#page");
        var _add_row_box = [
            '<div class="ar_head">',
                '<h3>添加容器行</h3>',
                '<a href="#" class="iconfont close">&#xf00b3;</a>',
            '</div>',
            '<div class="ar_con">',
                '<ul class="wm_form layout_list">',
                    '<li class="form_row">',
                        '<div class="layout_item lib_m1">',
                            '<span class="cus_main">960</span>',
                        '</div>',
                    '</li>',
                    '<li class="form_row">',
                        '<div class="layout_item lcb_m1_l1_1">',
                            '<span class="cus_main">750</span>',
                            '<span class="cus_left">200</span>',
                        '</div>',
                        '<div class="layout_item lcb_m1_l1_2">',
                            '<span class="cus_main">750</span>',
                            '<span class="cus_left">200</span>',
                        '</div>',
                    '</li>',
                    '<li class="form_row">',
                        '<div class="layout_item lcb_m1_l1_r1_1">',
                            '<span class="cus_main">520</span>',
                            '<span class="cus_left">210</span>',
                            '<span class="cus_right">210</span>',
                        '</div>',
                        '<div class="layout_item lcb_m1_l1_r1_2">',
                            '<span class="cus_main">520</span>',
                            '<span class="cus_left">210</span>',
                            '<span class="cus_right">210</span>',
                        '</div>',
                        '<div class="layout_item lcb_m1_l1_r1_3">',
                            '<span class="cus_main">520</span>',
                            '<span class="cus_left">210</span>',
                            '<span class="cus_right">210</span>',
                        '</div>',
                    '</li>',
                    '<li class="form_row">',
                        '<a href="#" class="add_cus">添加自定义模块</a>',
                    '</li>',
                '</ul>',
            '</div>'
        ].join('');
        var _container_html = [
            '<div class="container_head">',
                '<h3>容器定义</h3>',
                '<a href="#" class="iconfont close">&#xf00b3;</a>',
            '</div>',
            '<div class="container_con">',
                '<p class="msg"><i class="wm_ico bulb1" style="margin-top: -6px;"></i>页面总宽度960px;</p>',
                '<ul class="wm_form layout_list">',
                    '<li class="form_row">',
                        '<label class="row_key">容器宽度：</label>',
                        '<input type="text" class="form_txt w30 box_width" />px',
                    '</li>',
                '</ul>',
                '<div class="btns">',
                    '<a href="#" class="close append">确定</a>',
                    '<a href="#" class="close">取消</a>',
                '</div>',
            '</div>'
        ].join('');
        $form.on("click", ".add_custom_box", function () {
            box.invBox({
                boxCls: "add_row_box",
                content: _add_row_box,
                callback: function () {
                    var self = this;
                    this.close = this.hide;
                    var $layout_list = this.wmBox.find(".layout_list");
                    //添加行
                    this.wmBox.on("click", ".add_cus", function () {
                        $layout_list.append('<li class="form_row cus_edit_box"><div class="layout_item"></div><div class="btns"><a href="#" class="add_container" ><span class="iconfont">&#xf0175;</span>添加容器</a><a href="#" class="remove_container" ><span class="iconfont">&#xf00b3;</span>删除模块</a></div></li>');
                        self.position();
                        return false;
                    });
                    //删除行
                    this.wmBox.on("click", ".remove_container", function () {
                        var $cus_edit_box = $(this).closest(".cus_edit_box");
                        $cus_edit_box.fadeOut(function () {
                            $cus_edit_box.remove();
                            self.position();
                        });
                        return false;
                    });
                    //添加列
                    this.wmBox.on("click", ".add_container", function () {
                        var $this = $(this),
                            container = $this.data("containerbox"),
                            $layout_item = $this.closest(".cus_edit_box").find(".layout_item");
                        if (!container) {
                            container = box.invBox({
                                boxCls: "container_box",
                                content: _container_html,
                                callback: function () {
                                    var self = this;
                                    this.close = this.hide;
                                    this.wmBox.on("click", ".append", function () {
                                        var _v = self.wmBox.find(".box_width").val() || 0;
                                        $layout_item.find("span").css("margin-right", 10);
                                        $layout_item.append('<span class="block" style="width:' + parseInt((_v / 960) * 230) + 'px">' + _v + '<a class="iconfont remove_block" href="#">&#xf00b3;</a></span>');
                                        self.wmBox.find(".box_width").val('');
                                        return false;
                                    });
                                    this.wmBox.find(".box_width").on("keydown", function (e) {
                                        if (e.keyCode === 13) {
                                            self.wmBox.find(".append").click();
                                        }
                                    })
                                }
                            });
                            $this.data("containerbox", container);
                        }
                        container.show();
                        container.wmBox.find(".box_width").focus();
                        return false;
                    });
                    //删除列
                    this.wmBox.on("click", ".remove_block", function () {
                        var $block = $(this).closest(".block");
                        $block.fadeOut(function () {
                            $block.remove();
                        });
                        return false;
                    });
                }
            });
            return false;
        });

    };
    init();
});
