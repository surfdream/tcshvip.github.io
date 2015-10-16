define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        box = require("wmbox"),
        verification = require("verification"),
        juicer = require("juicer"),
        chk_model_page = require("chk_model_page"),
        api = require("api")
    ;
    var g_data = {};
    var _createNav = function ($ele, data, parent_id, parent_name) {
        var $append, $dl;
        if (data && data.length) {
            for (var i in data) {
                if (data[i].subList && data[i].subList.length) {
                    $append = $('<dd><dl></dl></dd>'), $dl = $append.find("dl");
                    $dl.append('<dt><a href="#" class="iconfont show_sub_btn">&#xf0175;</a><a href="#' + data[i].id + '" class="set_node" data_id="' + data[i].id + '" data_name="' + data[i].name + '" data_parent_id="' + parent_id + '" data_parent_name="' + parent_name + '">' + data[i].name + '</a></dt>');
                    $dl.append(_createNav($dl, data[i].subList, data[i].id, data[i].name));
                }
                else {
                    $append = '<dd><a href="#' + data[i].id + '" class="set_node" data_id="' + data[i].id + '" data_name="' + data[i].name + '" data_parent_id="' + parent_id + '" data_parent_name="' + parent_name + '">' + data[i].name + '</a></dd>';;
                }
                $ele.append($append);
            }
        }
    };
    var _model_item = juicer([
        '{@each sub_model_list as item}',
        '<tr data_id="${item.id}" data_name="${item.name}" data_remark="${item.remark}">',
            '<td>${item.name}</td>',
            '<td>{@if item.remark}${item.remark}{@/if}</td>',
            '<td>',
                '<div class="btn_list">',
                    '{@if item.subList.length}',
                    '<a href="#" class="ui_btn ui_btn_h23yellow8 portal edit_model"><span class="ui_btn_txt">修改<span class="wm_ico arrow6down"></span></span></a>',
                    '<ul>',
                        '<li class="btn_list_last">',
                            '<a href="#" class="edit_model">修改</a>',
                        '</li>',
                        '<li class="btn_list_end">',
                            '<a href="#" class="del_model">删除</a>',
                        '</li>',
                    '</ul>',
                    '{@else}',
                    '<a href="http://y.tcsh.me/module/page?search_model_name=${item.name}&search_model_id=${item.id}" class="ui_btn ui_btn_h23yellow8 portal"><span class="ui_btn_txt">页面设置<span class="wm_ico arrow6down"></span></span></a>',
                    '<ul>',
                        '<li class="btn_list_last">',
                            '<a href="http://y.tcsh.me/module/page?search_model_name=${item.name}&search_model_id=${item.id}" class="">页面设置</a>',
                        '</li>',
                        '<li>',
                            '<a href="#" class="edit_model">修改</a>',
                        '</li>',
                        '<li class="btn_list_end">',
                            '<a href="#" class="del_model">删除</a>',
                        '</li>',
                    '</ul>',
                    '{@/if}',
                '</div>',
            '</td>',
        '</tr>',
        '{@/each}'
    ].join(''))
    var initSubModelList = function (data) {
        var $model_list = $(".model_list tbody");
        $model_list.empty().append(_model_item.render(data));
    };
    var initNav = function () {
        api.getModelTree({
            success: function (data) {
                var _hash = window.window.location.hash;
                var $curr;
                if (data.success) {
                    var $nav_tree = $(".nav_tree");
                    var $nav = $('<dl><dt><a href="#" class="iconfont f5_tree">&#xf015c;</a><a href="#" class="set_node" data_id="' + data.success.id + '" data_name="' + data.success.name + '">' + data.success.name + '</a></dt></dl>');
                    _createNav($nav, data.success.subList, data.success.id, data.success.name);
                    $nav_tree.empty().append($nav);
                    $curr = $nav_tree.find("[href='" + _hash + "']")
                    if (_hash.length > 1 && $curr.length) {
                        $nav_tree.find(".show_sub_btn").click();
                        $curr.click();
                    } else {
                        $(".set_node:eq(0)").click();
                    }
                }
            },
            error: function () {
                alert("模块树初始化失败，请稍后再试！");
            }
        });
    };
    var init = function () {
        verification.strikingSuccess = false;
        verification.addRule([
            {
                key: "default_model",
                fun: function () {
                    return !!(this.find(".page_id").val() && this.find(".default_url").val());
                }
            }
        ]);
        bind();
        initNav();
    };
    var bind = function () {
        var $form = $(".nav_list"),
            $add_sub_model = $form.find(".add_sub_model"),
            $set_nav_tree = $form.find(".set_nav_tree");
        var _modelBox = juicer([
             '<div class="model_box_main">',
                 '<div class="model_box_head">',
                     '<h3>{@if id }修改模块{@else}添加模块{@/if}</h3>',
                     '<a href="#" class="iconfont close">&#xf00b3;</a>',
                 '</div>',
                 '<div class="model_box_con">',
                     '<ul class="wm_form" data_id="${id}">',
                         '<li class="form_row">',
                             '<label class="row_key"><b class="form_must">*</b>模块名称：</label>',
                             '<input type="text" class="form_txt model_name" wmv="empty" wmvmsg="模块名称不能为空！" name="model_name_${m}" value="${model_name}"/>',
                             '<span class="model_name_error" for="model_name_${m}"></span>',
                         '</li>',
                         '<li class="form_row">',
                             '<label class="row_key">备注：</label>',
                             '<input type="text" class="form_txt model_remark" value="${remark}" />',
                         '</li>',
                         '<li class="form_row btns">',
                             '<label class="row_key">&nbsp;</label>',
                             '<a href="#" class="ui_btn ui_btn_h33gray15 submit"><span class="ui_btn_txt">确定</span></a>',
                             '<a href="#" class="ui_btn ui_btn_h33gray15 close"><span class="ui_btn_txt">取消</span></a>',
                         '</li>',
                     '</ul>',
                 '</div>',
             '</div>'
        ].join(''));
        var _createModelBox = function (data) {
            return box.invBox({
                boxCls: "model_box",
                content: _modelBox.render($.extend({
                    m: parseInt(Math.random() * 99999) + 9999
                }, data)),
                callback: function () {
                    var self = this,
                        $vform = this.wmBox.find(".wm_form");
                    this.close = this.hide;
                    verification.init($vform);
                    this.wmBox.find(".remark").on("focus", function () {
                        $(this).addClass("complete");
                        return false;
                    });
                    this.wmBox.find(".remark").on("blur", function () {
                        var $this = $(this);
                        setTimeout(function () {
                            $this.removeClass("complete");
                            $this.scrollTop(0);
                        }, 500);
                        return false;
                    });
                    this.wmBox.on("click", ".submit", function () {
                        var _id = $vform.attr("data_id");
                        if (verification.verify($vform)) {
                            if ($vform.attr("data_id")) {
                                api.editModel({
                                    id: _id,
                                    name: encodeURIComponent($.trim($vform.find(".model_name").val())),
                                    remark: encodeURIComponent($.trim($vform.find(".model_remark").val())),
                                    success: function (data) {
                                        if (data.success) {
                                            $form.find(".f5_tree").click();
                                            $form.find(".set_node.curr").click();
                                            $vform.find(".model_name").val('');
                                            $vform.find(".model_remark").val('');
                                        } else {
                                            alert(data.error || "编辑失败！");
                                        }
                                    },
                                    error: function () {
                                        alert("系统繁忙！");
                                    }
                                });
                            } else {
                                api.addModel({
                                    parent_id: g_data.nodeId,
                                    name: encodeURIComponent($.trim($vform.find(".model_name").val())),
                                    remark: encodeURIComponent($.trim($vform.find(".model_remark").val())),
                                    success: function (data) {
                                        if (data.success) {
                                            $form.find(".f5_tree").click();
                                            $form.find(".set_node.curr").click();
                                            $vform.find(".model_name").val('');
                                            $vform.find(".model_remark").val('');
                                        } else {
                                            alert(data.error || "添加失败！");
                                        }
                                    },
                                    error: function () {
                                        alert("系统繁忙！");
                                    }
                                });
                            }
                            self.close();
                        }
                        return false;
                    });
                    _onCMPBox.call(this.wmBox.find(".chk_model_page"));
                }
            });
        };
        var _onCMPBox = function () {
            this.on("click", function () {
                var $this = $(this),
                _cmpBox = $this.data("cmpBox"),
                $row = $this.closest(".form_row");
                if (!_cmpBox) {
                    _cmpBox = chk_model_page.create({
                        ispage: true,
                        callback: function () {
                            var self = this;
                            this.pageChk.on("change", function () {
                                var $this = $(this);
                                if ($this.attr("checked")) {
                                    self.pageChk.removeAttr("checked");
                                    $this.attr("checked", "checked");
                                }
                            });
                            this.chkPage($row.find(".page_id").val());
                        },
                        submitCallback: function (data) {
                            $row.find(".page_name").val('');
                            $row.find(".page_id").val('');
                            $row.find(".default_url").val('');
                            for (var i in data.pageList) {
                                $row.find(".page_name").val(data.pageList[i].name);
                                $row.find(".page_id").val(data.pageList[i].id);
                                $row.find(".default_url").val(data.pageList[i].url);
                            }
                        }
                    });
                    $this.data("cmpBox", _cmpBox);
                }
                _cmpBox.show();
                return false;
            });
        };
        //展看树
        $form.on("click", ".show_sub_btn", function () {
            var $this = $(this), $parentdd = $this.closest("dd");
            $parentdd.addClass("show_sub_dd");
            $this.attr("class", "iconfont hide_sub_btn").empty().append("&#xf0176;");
            return false
        });
        //缩起树
        $form.on("click", ".hide_sub_btn", function () {
            var $this = $(this), $parentdd = $this.closest("dd");
            $parentdd.removeClass("show_sub_dd");
            $this.attr("class", "iconfont show_sub_btn").empty().append("&#xf0175;");
            return false
        });
        //设置模块配置
        $form.on("click", ".set_node", function () {
            var $this = $(this);
            var _id = $this.attr("data_id"),
                _name = $this.attr("data_name"),
                _parent_id = $this.attr("data_parent_id"),
                _parent_name = $this.attr("data_parent_name");
            $form.find(".curr").removeClass("curr");
            $this.addClass("curr");
            $set_nav_tree.find("h3").empty().append($this.html() + "模块配置");
            api.getModelPageList({
                id: _id,
                success: function (data) {
                    if (data.success && data.success.length) {
                        $add_sub_model.css({
                            display: "none"
                        });
                    } else {
                        $add_sub_model.css({
                            display: "inline"
                        });
                    }
                    api.getModelDetail({
                        id: _id,
                        success: function (data) {
                            if (data.success) {
                                g_data.nodeId = _id;
                                g_data.nodeName = _name;
                                g_data.parentId = _parent_id;
                                g_data.parentName = _parent_name;
                                $this.attr("data_name", _name).empty().append(_name);
                                initSubModelList(data.success);
                                $form.find(".node_remark").empty().append('<i class="wm_ico bulb1"></i>' + data.success.remark);
                            }
                        },
                        error: function () {
                            alert("系统繁忙！");
                        }
                    });
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });
            
        });
        //添加模块
        $form.on("click", ".add_sub_model", function () {
            var $this = $(this), treeNodeBox = $this.data("treeNodeBox");
            if (!treeNodeBox) {
                treeNodeBox = _createModelBox({
                    parent_id: g_data.nodeId,
                    parent_name: g_data.nodeName
                });
                $this.data("treeNodeBox", treeNodeBox);
            }
            treeNodeBox.wmBox.find(".parent_name").empty().append(g_data.nodeName);
            treeNodeBox.wmBox.find(".parent_name").empty().append(g_data.nodeName);
            treeNodeBox.show();
            return false;
        });
        //编辑模块
        $form.on("click", ".node_btns .edit_model", function () {
            var $this = $(this), treeNodeBox = $this.data("treeNodeBox");
            if (!treeNodeBox) {
                treeNodeBox = _createModelBox({
                    id: g_data.nodeId,
                    model_name: g_data.nodeName,
                    remark: g_data.remark
                });
                $this.data("treeNodeBox", treeNodeBox);
            }

            treeNodeBox.wmBox.find(".model_name").val(g_data.nodeName);
            treeNodeBox.wmBox.find(".model_remark").val(g_data.remark);
            treeNodeBox.show();
            return false;
        });
        //编辑模块
        $form.on("click", ".model_list .edit_model", function () {
            var $this = $(this), treeNodeBox = $this.data("treeNodeBox");
            var $tr = $this.closest("tr");
            var _id = $tr.attr("data_id"),
                _name = $tr.attr("data_name"),
                _remark = $tr.attr("data_remark");
            if (!treeNodeBox) {
                treeNodeBox = _createModelBox({
                    id: _id,
                    model_name: _name,
                    remark: _remark
                });
                $this.data("treeNodeBox", treeNodeBox);
            }
            treeNodeBox.show();
            return false;
        });
        //删除模块
        $form.on("click", ".del_model", function () {
            var $this = $(this), $tr = $this.closest("tr");
            if (confirm("确定要删除该模块？删除后无法恢复")) {

                api.delModel({
                    id: $tr.length ? $tr.attr("data_id") : $form.find(".set_node.curr").attr("data_id"),
                    success: function (data) {
                        if (data.success) {
                            $form.find(".f5_tree").click();
                            $form.find(".set_node.curr").click();
                        } else {
                            alert(data.error || "删除失败！");
                        }
                    },
                    error: function () {
                        alert("系统繁忙！");
                    }
                })

            }
            return false;
        });
        //刷新导航树
        $form.on("click", ".f5_tree", function () {
            initNav();
            return false;
        });
    };
    init()
});
