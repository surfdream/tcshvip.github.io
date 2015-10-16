define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        box = require("wmbox"),
        verification = require("verification"),
        juicer = require("juicer"),
        api = require("api"),
        chk_model_page = require("chk_model_page")
    ;
    var g_data = {}, nav_data = {};
    var _createNav = function ($ele, data, parent_id, parent_name) {
        var $append, $dl;
        if (data && data.length) {
            for (var i in data) {
                nav_data[data[i].id] = data[i];
                //console.log( data[i].title)
                if (data[i].subList && data[i].subList.length) {
                    $append = $('<dd><dl></dl></dd>'), $dl = $append.find("dl");
                    $dl.append('<dt><a href="#" class="iconfont show_sub_btn">&#xf0175;</a><a href="#' + data[i].id + '" class="set_node" data_id="' + data[i].id + '" data_name="' + data[i].name + '" data_parent_id="' + parent_id + '" data_parent_name="' + parent_name + '">' + data[i].name + '</a></dt>');
                    $dl.append(_createNav($dl, data[i].subList, data[i].id, data[i].name));
                }
                else {
                    $append = '<dd><a href="#' + data[i].id + '" class="set_node" data_isdelnode="true" data_issetmodel="true" data_id="' + data[i].id + '" data_name="' + data[i].name + '" data_parent_id="' + parent_id + '" data_parent_name="' + parent_name + '">' + data[i].name + '</a></dd>';;
                }
                $ele.append($append);
            }
        }
    };
    var initNav = function () {
        api.getNavList({
            success: function (data) {
                var _hash = window.window.location.hash;
                var $curr;
                if (data.success) {
                    var $nav_tree = $(".nav_list .nav_tree");
                    nav_data[data.success.id] = data.success;
                    var $nav = $('<dl><dt><a href="#" class="iconfont f5_tree">&#xf015c;</a><a href="#' + data.success.id + '" class="set_node" data_id="' + data.success.id + '" data_name="' + data.success.name + '">' + data.success.name + '</a></dt></dl>');
                    _createNav($nav, data.success.subList, data.success.id, data.success.name);
                    $nav_tree.empty().append($nav);
                    $curr = $nav_tree.find("[href='" + _hash + "']");
                    if (_hash.length > 1 && $curr.length) {
                        $nav_tree.find(".show_sub_btn").click();
                        $curr.click();
                    } else {
                        $(".set_node:eq(0)").click();
                    }

                }
            },
            error: function () {
                alert("导航树初始化失败，请稍后再试！");
            }
        });
    };
    var init = function () {
        verification.strikingSuccess = false;
        bind();
        initNav();
    };
    var bind = function () {
        var $form = $(".nav_list"),
            $node_remark = $form.find(".node_remark"),
            $nav_tree = $form.find(".nav_tree"),
            $set_model_row = $form.find(".set_model_row"),
            $set_nav_tree = $form.find(".set_nav_tree");
        var _treeNodeBox = juicer([
            '<div class="ids_main">',
                '<div class="ids_head">',
                    '<h3>{@if id }修改节点{@else}添加节点{@/if}</h3>',
                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                '</div>',
                '<div class="ids_con">',
                    '<ul class="wm_form" data_id="${id}">',
                        '<li class="form_row">',
                            '<label class="row_key">父级节点：</label>',
                            '<span class="parent_name">${parent_name}</span>',
                            '<input type="hidden" class="parent_id" value="${parent_id}">',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>节点名称：</label>',
                            '<input type="text" class="form_txt node_name" wmv="empty" wmvmsg="节点名称不能为空！" name="node_name_${m}" value="${node_name}" />',
                            '<span for="node_name_${m}"></span>',
                        '</li>',
                        '{@if isSetModel}',
                        '<li class="form_row set_model_box">',
                            '<label class="row_key">默认模块页面：</label>',
                            '<div class="floatleft" name="default_model_${m}">',
                                '<input type="text" class="form_txt page_name"  value="${page_name}" readonly="readonly"><a href="#" class="ui_btn ui_btn_h22red21 chk_model_page"><span class="ui_btn_txt">选择</span></a>',
                                '<input type="hidden" class="page_id" value="${page_id}">',
                            '</div>',
                            '<span for="default_model_${m}"></span>',
                        '</li>',
                        '{@/if}',
                        '<li class="form_row">',
                            '<label class="row_key">节点备注</label>',
                            '<textarea class="form_textarea remark" value="${remark}"></textarea>',
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
        var _createTreeNodeBox = function (data) {
            return box.invBox({
                boxCls: "inv_default_skin tree_node_box",
                content: _treeNodeBox.render($.extend({
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
                        if (verification.verify($vform)) {
                            if (data.id) {
                                api.editNavNode({
                                    id: g_data.nodeId,
                                    module_id: $vform.find(".page_id").val(),
                                    name: $vform.find(".node_name").val(),
                                    remark: $vform.find(".remark").val(),
                                    success: function (data) {
                                        if (data.success) {
                                            window.window.location.hash = g_data.nodeId;
                                            initNav();
                                            self.close();
                                        } else {
                                            alert(data.error || "修改失败！");
                                        }
                                    },
                                    error: function () {
                                        alert("系统繁忙！");
                                    }
                                });
                            } else {
                                api.addNavNode({
                                    parent_id: g_data.nodeId,
                                    name: $vform.find(".node_name").val(),
                                    remark: $vform.find(".remark").val(),
                                    success: function (data) {
                                        if (data.success) {
                                            window.window.location.hash = g_data.nodeId;
                                            initNav();
                                            self.close();
                                        } else {
                                            alert(data.error || "添加失败！");
                                        }
                                    },
                                    error: function () {
                                        alert("系统繁忙！");
                                    }
                                });

                            }

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
                            $row.find(".model_id").val('');
                            $row.find(".page_name").val(data.name);
                            $row.find(".page_id").val(data.id);
                            $row.find(".default_url").val(data.url);
                            $row.find(".model_id").val(data.model_id);
                            verification.verify($row);
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
        //设置节点配置
        $form.on("click", ".set_node", function () {
            var $this = $(this),
                _id = $this.attr("data_id"),
                _data = nav_data[_id];
            window.window.location.hash = _id;
            $form.find(".curr").removeClass("curr");
            $this.addClass("curr");
            $set_nav_tree.find("h3").empty().append($this.html() + "节点配置");
            $node_remark.empty().append('<i class="wm_ico bulb1"></i>' + _data.remark);
            g_data.nodeId = _id;
            g_data.nodeName = $this.attr("data_name");
            g_data.parentId = $this.attr("data_parent_id");
            g_data.parentName = $this.attr("data_parent_name");
            g_data.isSetModel = $this.attr("data_issetmodel");
            //最后一个节点才允许选择页面
            if (!g_data.isSetModel) {
                $set_model_row.css({
                    display: "none"
                });
            } else {
                $set_model_row.css({
                    display: "block"
                });
                $set_model_row.find(".page_name").val(_data.module_name);
                $set_model_row.find(".page_id").val(_data.module_id);
            }
            //最后一个节点才允许删除
            if (!g_data.isSetModel) {
                $form.find(".del_node").css({
                    display: "none"
                });
            } else {
                $form.find(".del_node").css({
                    display: "inline"
                });
            }
            //没有设置模块的才允许添加下级
            if (_data.module_id) {
                $form.find(".add_sub_node").css({
                    display: "none"
                });
            } else {
                $form.find(".add_sub_node").css({
                    display: "inline"
                });
            }
            return false;
        });
        //添加节点
        $form.on("click", ".add_sub_node", function () {
            var $this = $(this), treeNodeBox = $this.data("treeNodeBox");
            if (!treeNodeBox) {
                treeNodeBox = _createTreeNodeBox({
                    isSetModel: false,
                    parent_id: g_data.nodeId,
                    parent_name: g_data.nodeName
                });
                $this.data("treeNodeBox", treeNodeBox);
            }
            treeNodeBox.wmBox.find(".parent_name").empty().append(g_data.nodeName);
            treeNodeBox.wmBox.find(".node_name").val('');
            treeNodeBox.wmBox.find(".remark").val('');
            treeNodeBox.show();
            return false;
        });
        //编辑节点
        $form.on("click", ".edit_node_name", function () {
            var $this = $(this), treeNodeBox = $this.data("treeNodeBox"),
                _data = nav_data[g_data.nodeId];
            if (!treeNodeBox) {
                treeNodeBox = _createTreeNodeBox({
                    isSetModel: 1,
                    parent_id: g_data.parentId,
                    parent_name: g_data.parentName,
                    node_name: g_data.nodeName,
                    id: g_data.nodeId
                });
                $this.data("treeNodeBox", treeNodeBox);
            }
            treeNodeBox.wmBox.find(".parent_name").empty().append(g_data.parentName);
            treeNodeBox.wmBox.find(".node_name").val(g_data.nodeName);
            if (_data.subList.length) {
                treeNodeBox.wmBox.find(".set_model_box").css({
                    display: "none"
                });
            } else {
                treeNodeBox.wmBox.find(".set_model_box").css({
                    display: "block"
                });
            }
            //异步获取
            treeNodeBox.wmBox.find(".page_name").val(_data.module_name);
            treeNodeBox.wmBox.find(".page_id").val(_data.module_id);
            treeNodeBox.wmBox.find(".default_url").empty().append(domains.account + '/login?ReturnUrl=http%3a%2f%2fitem.wumeiwang.com%2flogisticstemplate');
            treeNodeBox.show();
            return false;
        });
        //选择模块页面
        _onCMPBox.call($form.find(".chk_model_page"));
        $form.on("click", ".page_name", function () {
            $form.find(".chk_model_page").click();
            return false;
        });
        //删除节点
        $form.on("click", ".del_node", function () {

            if (confirm("确定要删除该节点？删除后无法恢复")) {
                api.delNavNode({
                    id: g_data.nodeId,
                    success: function (data) {
                        if (data.success) {
                            alert("删除成功！");
                            window.window.location.hash = g_data.parentId;
                            initNav();
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
        //修改模块
        $form.on("click", ".save", function () {
            var data = nav_data[g_data.nodeId];
            api.editNavNode({
                id: g_data.nodeId,
                module_id: $set_model_row.find(".page_id").val(),
                name: data.name,
                remark: data.remark,
                success: function (data) {
                    if (data.success) {
                        alert("设置成功！");
                        window.window.location.hash = g_data.nodeId;
                        initNav();
                    } else {
                        alert(data.error || "设置失败！");
                    }
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });
            return false;
        });
    };
    init()
});
