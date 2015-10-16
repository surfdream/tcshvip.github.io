define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        box = require("wmbox"),
        verification = require("verification"),
        juicer = require("juicer"),
        api = require("api")
    ;

    var init = function () {
        verification.strikingSuccess = false;
        bind();
    };
    var bind = function () {
        var $form = $(".user_group");
        var _groupBox = juicer([
            '<div class="ids_main">',
                '<div class="ids_head">',
                    '<h3>{@if id }修改分组{@else}添加分组{@/if}</h3>',
                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                '</div>',
                '<div class="ids_con">',
                    '<ul class="wm_form" data_id="${id}">',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>分组名称：</label>',
                            '<input type="text" class="form_txt group_name" wmv="empty" wmvmsg="分组名称不能为空！" name="group_name_${m}" value="${group_name}" />',
                            '<span for="group_name_${m}"></span>',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key">分组描述</label>',
                            '<input type="text" class="form_txt remark" value="${remark}" />',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key">&nbsp;</label>',
                            '<a href="#" class="ui_btn ui_btn_h33gray15 submit"><span class="ui_btn_txt">确定</span></a>',
                            '<a href="#" class="ui_btn ui_btn_h33gray15 close"><span class="ui_btn_txt">取消</span></a>',
                        '</li>',
                    '</ul>',
                '</div>',
            '</div>'
        ].join(''));
        var _roleHtml = juicer([
            '<div class="ids_main">',
                '<div class="ids_head">',
                    '<h3>${groupName}-分配角色</h3>',
                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                '</div>',
                '<div class="ids_con">',
                    '<div class="role_list_box">',
                        '<ul class="box_head">',
                            '<li class="w50">选择</li>',
                            '<li class="w100">角色</li>',
                            '<li>角色说明</li>',
                        '</ul>',
                        '<div class="role_list" data_group_id="${groupId}"></div>',
                        '<div class="btns">',
                            '<a href="#" class="ui_btn ui_btn_h33gray15 submit"><span class="ui_btn_txt">确定</span></a>',
                            '<a href="#" class="ui_btn ui_btn_h33gray15 close"><span class="ui_btn_txt">取消</span></a>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join(''));
        var _roleItem = juicer([
            '{@each success as item}',
                '<ul data_id="${item.id}" class="role_row">',
                    '<li class="w50"><span class="chkbox iconfont">&#xf00b2;</span></li>',
                    '<li class="w100">${item.name}</li>',
                    '<li>${item.remark}</li>',
                '</ul>',
            '{@/each}',
        ].join(''));
        //分组弹窗
        var _createGroupBox = function (data) {
            return box.invBox({
                boxCls: "inv_default_skin",
                content: _groupBox.render($.extend({
                    m: parseInt(Math.random() * 99999) + 9999
                }, data)),
                callback: function () {
                    var self = this,
                        $vform = this.wmBox.find(".wm_form"),
                        _id = $vform.attr("data_id");
                    this.close = this.hide;
                    verification.init($vform);
                    this.wmBox.on("click", ".submit", function () {
                        var _group_name = $vform.find(".group_name").val(),
                            _group_remark = $vform.find(".remark").val()
                        if (verification.verify($vform)) {
                            if (_id) {
                                api.editGroup({
                                    group_id: _id,
                                    group_name: _group_name,
                                    group_remark: _group_remark,
                                    success: function (data) {
                                        if (data.success) {
                                            alert("修改成功");
                                            window.location.reload();
                                        } else {
                                            alert(data.error || "修改失败！");
                                        }

                                    },
                                    error: function () {
                                        alert("系统繁忙！");
                                    }
                                });
                            } else {
                                api.addGroup({
                                    group_name: _group_name,
                                    group_remark: _group_remark,
                                    success: function (data) {
                                        if (data.success) {
                                            alert("添加成功");
                                            window.location.reload();
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
                }
            });
        };
        //添加分组
        $form.on("click", ".add_user_group", function () {
            var $this = $(this),
                _groupBox = $this.data("groupBox");
            if (!_groupBox) {
                _groupBox = _createGroupBox();
                $this.data("groupBox", _groupBox);
            }
            _groupBox.show();
            return false;
        });
        //编辑分组
        $form.on("click", ".edit_user_group", function () {
            var $this = $(this),
                _groupBox = $this.data("groupBox"),
                $tr = $this.closest("tr"),
                _id = $tr.attr("data_id"),
                _name = $tr.attr("data_name"),
                _remark = $tr.attr("data_remark");
            if (!_groupBox) {
                _groupBox = _createGroupBox({
                    id: _id,
                    group_name: _name,
                    remark: _remark
                });
                $this.data("groupBox", _groupBox);
            }
            _groupBox.show();
            return false;
        });
        //删除分组
        $form.on("click", ".del_group", function () {
            var $this = $(this), $tr = $this.closest("tr");
            if (confirm("确定要删除角色？删除后无法恢复")) {
                api.delGroup({
                    id: $tr.attr("data_id"),
                    success: function (data) {
                        if (data.success) {
                            alert("删除成功！");
                            window.location.reload();
                        } else {
                            alert(data.error);
                        }
                    },
                    error: function () {
                        alert("服务器繁忙！");
                    }
                });
            }
            return false;
        });
        //分配角色
        $form.on("click", ".set_role", function () {
            var $this = $(this),
                $tr = $this.closest("tr"),
                roleIds = $tr.attr("data_chk_r_id").split(','),
                _groupId = $tr.attr("data_id"),
                _groupName = $tr.attr("data_name"),
                group_set_role = $this.data("group_set_role")
            ;
            if (!group_set_role) {
                group_set_role = box.invBox({
                    boxCls: "inv_default_skin group_set_role",
                    content: _roleHtml.render({
                        groupId: _groupId,
                        groupName: _groupName
                    }),
                    callback: function () {
                        var self = this;
                        var $role_list = this.wmBox.find(".role_list");
                        this.close = this.hide;
                        this.wmBox.on("click", ".submit", function () {
                            var $form = self.wmBox.find(".role_list"),
                                _roleIds = [];

                            $form.find(".curr").each(function () {
                                _roleIds.push($(this).attr("data_id"));
                            });
                            api.roleToGroup({
                                groupId: $form.attr("data_group_id"),
                                roleIds: JSON.stringify(_roleIds),
                                success: function (data) {
                                    if (data.success) {
                                        window.location.reload();
                                    } else {
                                        alert(data.error || "分配失败！");
                                    }
                                },
                                error: function () {
                                    alert("系统繁忙！");
                                }
                            });
                            return false;
                        });
                        this.wmBox.on("click", ".role_row", function () {
                            $(this).toggleClass("curr");
                            return false;
                        });
                        api.getRoleList({
                            success: function (data) {
                                if (data.success) {
                                    $role_list.empty().append(_roleItem.render(data));
                                    self.position();
                                    for (var i in roleIds) {
                                        $role_list.find(".role_row[data_id='" + roleIds[i] + "']").addClass("curr");
                                    }
                                }
                            },
                            error: function () {
                                alert("系统繁忙！");
                            }
                        })
                    }
                });
                $this.data("group_set_role", group_set_role);
            }
            group_set_role.show();
            return false;
        });
    };
    init();
});
