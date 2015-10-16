define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        box = require("wmbox"),
        juicer = require("juicer"),
        api = require("api")
    ;
    var initNav = function () {
        var self = this;
        api.getModelTree({
            success: function (data) {
                if (data.success) {
                    var $nav = $('<dl><dt><a href="#" class="iconfont f5_tree">&#xf015c;</a><a href="#" class="nav_nide get_sub_model" data_id="' + data.success.id + '" data_name="' + data.success.name + '">' + data.success.name + '</a></dt></dl>');
                    var $nav_tree = self.wmBox.find(".nav_tree");
                    _createNav($nav, data.success.subList, data.success.id, data.success.name);
                    $nav_tree.empty().append($nav);
                    self.wmBox.find(".nav_nide:eq(0)").click();
                    self.position();
                }
            },
            error: function () {
                alert("模块树初始化失败，请稍后再试！");
            }
        });
    };
    var _createNav = function ($ele, data, parent_id, parent_name) {
        var $append, $dl;
        if (data && data.length) {
            for (var i in data) {
                $append = $('<dd><dl></dl></dd>'), $dl = $append.find("dl");
                $dl.append('<dt><a href="#" class="iconfont show_sub_btn">&#xf01b9;</a><a href="#" class="nav_nide get_sub_model" data_id="' + data[i].id + '" data_name="' + data[i].name + '" data_parent_id="' + parent_id + '" data_parent_name="' + parent_name + '">' + data[i].name + '</a></dt>');
                if (data[i].subList && data[i].subList.length) {
                    _createNav($dl, data[i].subList, data[i].id, data[i].name);
                    $ele.append($append);
                }
                
            }
        }
    };
    var _chk_model_page = [
        '<div class="ids_main">',
            '<div class="ids_head">',
                '<h3>选择模块页面</h3>',
                '<a href="#" class="iconfont close">&#xf00b3;</a>',
            '</div>',
            '<div class="ids_con">',
                '<div class="nav_tree"></div>',
                '<div class="cmp_submodel_list_box">',
                    '<h3></h3>',
                    '<ul>',
                    '</ul>',
                '</div>',
                '<div class="btns">',
                    '<a href="#" class="ui_btn ui_btn_h26blue2 submit"><span class="ui_btn_txt">确定</span></a>',
                    '<a href="#" class="ui_btn ui_btn_h26white6 close"><span class="ui_btn_txt">取消</span></a>',
                '</div>',
            '</div>',
        '</div>'
    ].join('');
    var _submodel = juicer([
        '{@each sub_model_list as item}',
        '{@if item.subList.length==0}',
        '<li>',
            '<a href="#" class="sub_model_item" data_id="${item.id}" data_name="${item.name}">${item.name}</a>',
        '</li>',
        '{@/if}',
        '{@/each}'
    ].join(''));
    var _create = function (op) {
        return box.invBox({
            boxCls: "inv_default_skin chk_model_page",
            content: _chk_model_page,
            callback: function () {
                var self = this,
                    $nav_tree = self.wmBox.find(".nav_tree"),
                    $cmp_submodel_list_box = self.wmBox.find(".cmp_submodel_list_box"),
                    $cmp_submodel_list = $cmp_submodel_list_box.find("ul");
                this.close = this.hide;
                //展看树
                this.wmBox.on("click", ".show_sub_btn", function () {
                    var $this = $(this), $parentdd = $this.closest("dd");
                    $parentdd.addClass("show_sub_dd");
                    $this.attr("class", "iconfont hide_sub_btn").empty().append("&#xf0176;");
                    return false
                });
                //缩起树
                this.wmBox.on("click", ".hide_sub_btn", function () {
                    var $this = $(this), $parentdd = $this.closest("dd");
                    $parentdd.removeClass("show_sub_dd");
                    $this.attr("class", "iconfont show_sub_btn").empty().append("&#xf01b9;");
                    return false
                });
                //刷新导航树
                this.wmBox.on("click", ".f5_tree", function () {
                    initNav.call(self);
                    return false;
                });
                //选择节点模块
                this.wmBox.on("click", ".nav_nide", function () {
                    var $this = $(this);
                    $nav_tree.find(".curr").removeClass("curr");
                    $this.addClass("curr");
                    return false;
                });
                //获取模块列表
                this.wmBox.on("click", ".get_sub_model", function () {
                    var $this = $(this);
                    var _id = $this.attr("data_id");
                    
                    api.getModelDetail({
                        id: _id,
                        success: function (data) {
                            if (data.success) {
                                $cmp_submodel_list_box.find("h3").empty().append($this.attr("data_name"));
                                $cmp_submodel_list.empty().append(_submodel.render(data.success));
                            }
                        },
                        error: function () {
                            var data = {};
                            data.success = {
                                sub_model_list: [
                                    {
                                        id: 1,
                                        name: "子模块名称",
                                        remark: "备注备注备注"
                                    },
                                    {
                                        id: 1,
                                        name: "子模块名称",
                                        remark: "备注备注备注"
                                    },
                                    {
                                        id: 1,
                                        name: "子模块名称",
                                        remark: "备注备注备注"
                                    },
                                    {
                                        id: 1,
                                        name: "子模块名称",
                                        remark: "备注备注备注"
                                    }
                                ]
                            }
                            if (data.success) {
                                $cmp_submodel_list_box.find("h3").empty().append($this.attr("data_name"));
                                $cmp_submodel_list.empty().append(_submodel.render(data.success));
                            }
                        }
                    });
                    return false;
                });
                //选择模块
                this.wmBox.on("click", ".sub_model_item", function () {
                    var $this = $(this);
                    $cmp_submodel_list.find(".curr").removeClass("curr");
                    $this.addClass("curr");
                    return false;
                });
                this.wmBox.on("dblclick", ".sub_model_item", function () {
                    self.wmBox.find(".submit").click();
                    return false;
                });
                //确认
                this.wmBox.on("click", ".submit", function () {
                    var $form = self.wmBox.find(".cmp_submodel_list_box"),
                        $curr = $form.find(".curr"),
                        _id = $curr.attr("data_id"),
                        _name = $curr.attr("data_name");
                    var data = {
                        id: _id,
                        name: _name
                    }
                    typeof op.submitCallback === "function" && op.submitCallback.call(self, data);
                    self.close();
                    return false;
                });
                initNav.call(this);

            }
        });
    }
    exports.create = function (op) {
        return _create($.extend({}, op));
    }
});
