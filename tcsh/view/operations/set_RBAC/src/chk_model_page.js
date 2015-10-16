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
                    var $nav = $('<dl><dt><a href="#" class="iconfont f5_tree">&#xf015c;</a><a href="#" class="nav_nide" data_id="' + data.id + '" data_name="' + data.name + '">根目录</a></dt></dl>');
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
                if (data[i].subList && data[i].subList.length) {
                    $append = $('<dd><dl></dl></dd>'), $dl = $append.find("dl");
                    $dl.append('<dt><a href="#" class="iconfont show_sub_btn">&#xf0175;</a><a href="#" class="nav_nide" data_id="' + data[i].id + '" data_name="' + data[i].name + '" data_parent_id="' + parent_id + '" data_parent_name="' + parent_name + '">' + data[i].name + '</a></dt>');
                    _createNav($dl, data[i].subList, data[i].id, data[i].name);
                }
                else {
                    $append = '<dd><a href="#" class="nav_nide get_model_page_list" data_id="' + data[i].id + '" data_name="' + data[i].name + '" data_parent_id="' + parent_id + '" data_parent_name="' + parent_name + '">' + data[i].name + '</a></dd>';
                }
                $ele.append($append);
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
                '<div class="cmp_page_list_box">',
                    '<h3></h3>',
                    '<table class="table_list cmp_page_list" cellpadding="0" cellspacing="0">',
                        '<thead>',
                            '<tr>',
                                '<th class="w160">页面名称</th>',
                                '<th class="">URL</th>',
                            '</tr>',
                        '</thead>',
                        '<tbody></tbody>',
                    '</table>',
                '</div>',
                '<div class="btns">',
                    '<a href="#" class="ui_btn ui_btn_h26blue2 submit"><span class="ui_btn_txt">确定</span></a>',
                    '<a href="#" class="ui_btn ui_btn_h26white6 close"><span class="ui_btn_txt">取消</span></a>',
                '</div>',
            '</div>',
        '</div>'
    ].join('');
    var _page_item = juicer([
        '{@each success as item}',
        '<tr data_id="${item.id}" data_name="${item.name}" data_url="${item.url}" data_model_id="${id}">',
            '<td><span class="chkbox iconfont">&#xf00b2;</span>${item.name}</td>',
            '<td>${item.url}</td>',
        '</tr>',
        '<tr>',
            '<td colspan="2" style="border-bottom: 1px solid #ccc;padding: 0 0 10px 40px;">备注：${item.remark}</td>',
        '</tr>',
        '{@/each}'
    ].join(''));
    var _create = function (op) {
        return box.invBox({
            boxCls: "inv_default_skin chk_model_page",
            content: _chk_model_page,
            callback: function () {
                var self = this,
                    $nav_tree = self.wmBox.find(".nav_tree"),
                    $cmp_page_list_box = self.wmBox.find(".cmp_page_list_box"),
                    $cmp_page_list = self.wmBox.find(".cmp_page_list").find("tbody");
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
                    $this.attr("class", "iconfont show_sub_btn").empty().append("&#xf0175;");
                    return false
                });
                //刷新导航树
                this.wmBox.on("click", ".f5_tree", function () {
                    initNav();
                    return false;
                });
                //选择节点模块
                this.wmBox.on("click", ".nav_nide", function () {
                    var $this = $(this);
                    $nav_tree.find(".curr").removeClass("curr");
                    $this.addClass("curr");
                    $this.parent().find(".show_sub_btn").click();
                    return false;
                });
                //获取模块页面列表
                this.wmBox.on("click", ".get_model_page_list", function () {
                    var $this = $(this);
                    var _id = $this.attr("data_id");
                    api.getModelPageList({
                        id: _id,
                        success: function (data) {
                            if (data.success) {
                                $cmp_page_list.empty().append(_page_item.render(data));
                                $cmp_page_list_box.find("h3").empty().append($this.attr("data_name"));
                            } 
                        },
                        error: function () {
                            alert("系统繁忙！");
                        }
                    });
                    return false;
                });
                //选择页面
                $cmp_page_list.on("click", "tr", function () {
                    var $this = $(this);
                    $cmp_page_list.find(".curr").removeClass("curr");
                    $this.addClass("curr");
                });
                //确认
                this.wmBox.on("click", ".submit", function () {
                    var $curr = $cmp_page_list.find(".curr"),
                        _id = $curr.attr("data_id"),
                        _name = $curr.attr("data_name"),
                        _model_id = $curr.attr("data_model_id"),
                        _url = $curr.attr("data_url");
                    var data = {
                        id: _id,
                        name: _name,
                        model_id: _model_id,
                        url: _url
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
