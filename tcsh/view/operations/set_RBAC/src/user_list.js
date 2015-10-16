define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        box = require("wmbox"),
        verification = require("verification"),
        juicer = require("juicer"),
        page = require("wmpage"),
        api = require("api")
    ;

    var init = function () {
        verification.strikingSuccess = false;
        if (global_setting && global_setting.PageInfo) {
            var _page = page.Create({
                url: global_setting.PageInfo.url,
                element: ".wm_page",
                index: global_setting.PageInfo.Index,
                sum: global_setting.PageInfo.TotalItems,
                size: global_setting.PageInfo.Size,
                front: true,
                param: global_setting.PageInfo.param,
                pagekey: global_setting.PageInfo.pageKey
            });
        }
        bind();
    };
    var bind = function () {
        var $form = $(".user"), $tbody = $form.find(".user_list").find("tbody");
        var _userBox = juicer([
            '<div class="ids_main">',
                '<div class="ids_head">',
                    '<h3>添加账号</h3>',
                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                '</div>',
                '<div class="ids_con">',
                    '<ul class="wm_form">',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>账号：</label>',
                            '<input type="text" class="form_txt account" wmv="empty" wmvmsg="账号不能为空！" name="account_${m}" />',
                            '<span for="account_${m}"></span>',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key">姓名：</label>',
                            '<input type="text" class="form_txt user_name" />',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key">默认密码：</label>',
                            '888888',
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
        var _groupHtml = juicer([
            '<div class="ids_main">',
                '<div class="ids_head">',
                    '<h3>${accountName}-分配用户组</h3>',
                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                '</div>',
                '<div class="ids_con">',
                    '<div class="group_list_box">',
                        '<ul class="box_head">',
                            '<li class="w50">选择</li>',
                            '<li class="w100">组</li>',
                            '<li>用户组说明</li>',
                        '</ul>',
                        '<div class="group_list" data_account_id="${accountId}"></div>',
                        '<div class="btns">',
                            '<a href="#" class="ui_btn ui_btn_h33gray15 submit"><span class="ui_btn_txt">确定</span></a>',
                            '<a href="#" class="ui_btn ui_btn_h33gray15 close"><span class="ui_btn_txt">取消</span></a>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join(''));
        var _groupItem = juicer([
            '{@each success as item}',
                '<ul data_account_id="${item.id}" class="group_row">',
                    '<li class="w50"><span class="chkbox iconfont">&#xf00b2;</span></li>',
                    '<li class="w100">${item.name}</li>',
                    '<li>${item.remark}</li>',
                '</ul>',
            '{@/each}',
        ].join(''));
        //添加账号弹窗
        var _createAccountBox = function (data) {
            return box.invBox({
                boxCls: "inv_default_skin",
                content: _userBox.render($.extend({
                    m: parseInt(Math.random() * 99999) + 9999
                }, data)),
                callback: function () {
                    var self = this,
                        $vform = this.wmBox.find(".wm_form"),
                        _id = $vform.attr("data_account_id");
                    this.close = this.hide;
                    verification.init($vform);
                    this.wmBox.on("click", ".submit", function () {
                        var _account = $vform.find(".account").val(),
                            _user_name = $vform.find(".user_name").val()
                        if (verification.verify($vform)) {
                            api.addAcc({
                                account: encodeURIComponent(_account),
                                name: encodeURIComponent(_user_name),
                                success: function (data) {
                                    if (data.success) {
                                        alert("添加成功！");
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
                        return false;
                    });
                }
            });
        };
        //添加账号
        $form.on("click", ".add_user", function () {
            var $this = $(this),
                _accountBox = $this.data("accountBox");
            if (!_accountBox) {
                _accountBox = _createAccountBox();
                $this.data("accountBox", _accountBox);
            }
            _accountBox.show();
            return false;
        });
        //选择
        $form.on("click", "tr", function () {
            $(this).toggleClass("curr");
            if ($tbody.find("tr").length !== $tbody.find(".curr").length) {
                $form.find(".chkall").closest("tr").removeClass("curr");
            } else {
                $form.find(".chkall").closest("tr").addClass("curr");
            }
        });
        //选择
        $form.on("click", ".chkall", function () {
            var $this = $(this);
            if ($this.closest("tr").toggleClass("curr").hasClass("curr")) {
                $tbody.find("tr").addClass("curr");
            } else {
                $tbody.find("tr").removeClass("curr");
            }

            return false;
        });
        //删除账号
        $form.on("click", ".del_account", function () {
            var $this = $(this), $tr = $this.closest("tr");
            if (confirm("确定要删除账号？\n删除后无法恢复")) {
                api.delAcc({
                    id: $tr.attr("data_id"),
                    success: function (data) {
                        if (data.success) {
                            window.location.reload();
                        } else {
                            alert(data.error || "删除失败！");
                        }
                    },
                    error: function () {
                        alert("系统繁忙！");
                    }
                });
            }
            return false;
        });
        //分配用户组
        $form.on("click", ".edit_user_group", function () {
            var $this = $(this),
                $tr = $this.closest("tr"),
                _accountId = $tr.attr("data_account_id"),
                _accountName = $tr.attr("data_account_name"),
                gtaBox = $this.data("gtaBox")
            ;
            if (!gtaBox) {
                gtaBox = box.invBox({
                    boxCls: "inv_default_skin group_to_acc",
                    content: _groupHtml.render({
                        accountId: _accountId,
                        accountName: _accountName
                    }),
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        var $group_list = self.wmBox.find(".group_list");
                        this.wmBox.on("click", ".submit", function () {
                            var groupIds = [];
                            $group_list.find(".curr").each(function () {
                                groupIds.push($(this).attr("data_account_id"));
                            });
                            api.groupToAcc({
                                accId: _accountId,
                                groupIds: JSON.stringify(groupIds),
                                success: function (data) {
                                    if (data.success) {
                                        alert("分配成功！");
                                        window.location.reload();
                                    } else {
                                        alert(data.error || "分配失败！");
                                    }
                                },
                                error: function () {
                                    alert("系统繁忙！");
                                }
                            })
                            return false;
                        });
                        this.wmBox.on("click", ".group_row", function () {
                            $group_list.find(".group_row.curr").removeClass("curr");
                            $(this).addClass("curr");
                            return false;
                        });
                        api.getGroupList({
                            success: function (data) {
                                $group_list.empty().append(_groupItem.render(data));
                                self.position();
                            },
                            error: function () {
                                alert("系统繁忙！");
                            }
                        });
                    }
                });
                $this.data("gtaBox", gtaBox);
            }
            gtaBox.show();
            return false;
        });
        //重置密码
        $form.on("click", ".re_password", function () {
            var $this = $(this), $tr = $this.closest("tr");
            api.rePassWord({
                id: $tr.attr("data_account_id"),
                success: function (data) {
                    if (data.success) {
                        alert("账号：" + $tr.attr("data_account_name") + ",密码重置成功！");
                    } else {
                        alert(data.error || "重置失败！");
                    }
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });
            return false;
        });
        //禁用账号
        $form.on("click", ".disabled_account", function () {
            var $this = $(this), $tr = $this.closest("tr");
            api.disabledAcc({
                id: $tr.attr("data_account_id"),
                success: function (data) {
                    if (data.success) {
                        alert("账号：" + $tr.attr("data_account_name") + ",已禁用！");
                        window.location.reload();
                    } else {
                        alert(data.error || "禁用失败！");
                    }
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });
            return false;
        });
        //启用账号
        $form.on("click", ".open_account", function () {
            var $this = $(this), $tr = $this.closest("tr");
            api.openAcc({
                id: $tr.attr("data_account_id"),
                success: function (data) {
                    if (data.success) {
                        alert("账号：" + $tr.attr("data_account_name") + ",已启用！");
                        window.location.reload();
                    } else {
                        alert(data.error || "启用失败！");
                    }
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });
            return false;
        });
    };
    init();
});
