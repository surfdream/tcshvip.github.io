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
        var $form = $(".user_role");
        var initNav = function (callback) {
            var self = this;
            api.getModelTree({
                success: function (data) {
                    if (data.success) {
                        var $nav = $('<dl style="margin: 20px 24px 0 24px;background: #ccc;padding: 8px;font-size: 16px;border: 1px solid #999;"><dt><a href="#" class="iconfont f5_tree" style="font-size: 16px;margin: 0 4px;">&#xf015c;</a><span data_id="' + data.success.id + '" data_name="' + data.success.name + '">根目录</span></dt></dl>');
                        var $model_tree = self.wmBox.find(".nav_tree");
                        _createNav($model_tree, data.success.subList, data.success.id, data.success.name);
                        $model_tree.find(".get_page").click();
                        $model_tree.before($nav);
                        $model_tree.find(".show_sub_btn").click();
                        self.position();
                        typeof callback === "function" && callback.call(self);
                    }
                }
            });
        };
        var _createNav = function ($ele, data, parent_id, parent_name) {
            var $append, $dl;
            if (data && data.length) {
                for (var i in data) {
                    if (data[i].subList && data[i].subList.length) {
                        $append = $('<dd><dl data_id="' + data[i].id + '"></dl></dd>'), $dl = $append.find("dl");
                        $dl.append('<dt><a href="#" class="iconfont show_sub_btn">&#xf0175;</a><span class="chkbox iconfont">&#xf00b2;</span><a href="#" class="nav_nide" data_id="' + data[i].id + '" data_name="' + data[i].name + '" data_parent_id="' + parent_id + '" data_parent_name="' + parent_name + '">' + data[i].name + '</a></dt>');
                        _createNav($dl, data[i].subList, data[i].id, data[i].name);
                    }
                    else {
                        $append = $('<dd><dl data_id="' + data[i].id + '"></dl></dd>'),
                        $dl = $append.find("dl");
                        $dl.append('<dt><a href="#" class="iconfont show_sub_btn">&#xf0175;</a><span class="chkbox iconfont">&#xf00b2;</span><a href="#" class="nav_nide get_page" data_id="' + data[i].id + '" data_name="' + data[i].name + '" data_parent_id="' + parent_id + '" data_parent_name="' + parent_name + '">' + data[i].name + '</a></dt>');
                    }
                    $ele.append($append);
                }
            }
        };
        var _roleBox = juicer([
            '<div class="ids_main">',
                '<div class="ids_head">',
                    '<h3>{@if id }修改角色{@else}添加角色{@/if}</h3>',
                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                '</div>',
                '<div class="ids_con">',
                    '<ul class="wm_form" data_id="${id}">',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>角色名称：</label>',
                            '<input type="text" class="form_txt role_name" wmv="empty" wmvmsg="角色名称不能为空！" name="role_name_${m}" value="${role_name}" />',
                            '<span for="role_name_${m}"></span>',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key">角色表述</label>',
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
        var _setCompetenceBox = juicer([
            '<div class="ids_main">',
                '<div class="ids_head">',
                    '<h3>${role_name}-权限分配</h3>',
                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                '</div>',
                '<div class="ids_con">',
                    '<div class="wm_form" data_id="${role_id}">',
                        '<p class="role_remark"><i class="wm_ico bulb1"></i>${role_remark}</p>',
                        '<div class="nav_tree"></div>',
                        '<div class="btns">',
                            '<a href="#" class="ui_btn ui_btn_h33gray15 submit"><span class="ui_btn_txt">确定</span></a>',
                            '<a href="#" class="ui_btn ui_btn_h33gray15 close"><span class="ui_btn_txt">取消</span></a>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join(''));
        //角色弹窗
        var _createRoleBox = function (data) {
            return box.invBox({
                boxCls: "inv_default_skin",
                content: _roleBox.render($.extend({
                    m: parseInt(Math.random() * 99999) + 9999
                }, data)),
                callback: function () {
                    var self = this,
                        $vform = this.wmBox.find(".wm_form"),
                        _id = $vform.attr("data_id"),
                        $nav_tree = this.wmBox.find(".nav_tree");
                    this.close = this.hide;
                    verification.init($vform);
                    this.wmBox.on("click", ".submit", function () {
                        var _role_name = $vform.find(".role_name").val(),
                          _role_remark = $vform.find(".remark").val()
                        if (verification.verify($vform)) {
                            if (_id) {
                                api.editRole({
                                    role_id: _id,
                                    role_name: _role_name,
                                    role_remark: _role_remark,
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
                                api.addRole({
                                    role_name: _role_name,
                                    role_remark: _role_remark,
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
        //权限分配弹窗
        var _createSetCompetenceBox = function (data) {
            var thatdata = data;
            return box.invBox({
                boxCls: "inv_default_skin role_to_competence_box",
                content: _setCompetenceBox.render($.extend({
                    m: parseInt(Math.random() * 99999) + 9999
                }, data)),
                callback: function () {
                    var self = this,
                        $vform = this.wmBox.find(".wm_form"),
                        $nav_tree = this.wmBox.find(".nav_tree");
                    this.close = this.hide;
                    verification.init($vform);
                    this.wmBox.on("click", ".submit", function () {
                        var _roleId = $vform.attr("data_id"),
                            _asList = [];
                        $nav_tree.find(".competence_item.allchkbox").each(function () {
                            var $this = $(this), _pageId = $this.closest("dl").attr("data_id");
                            _asList.push({
                                moduleId: _pageId,
                                privilegeId: $this.attr("data_id")
                            });
                        });
                        _asList = JSON.stringify(_asList);
                        api.roleEditCompetence({
                            roleId: _roleId,
                            asList: _asList,
                            success: function (data) {
                                if (data.success) {
                                    alert("设置成功！");
                                    //window.location.reload();
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
                        initNav(self);
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
                    //获取权限,原则上只获取一次，执行后清除本身class
                    this.wmBox.on("click", ".get_competence", function () {
                        var $this = $(this),
                            $dl = $this.closest("dl")
                        ;
                        (function ($this, $dl) {
                            api.getPageCompetenceList({
                                id: $this.attr("data_id"),
                                success: function (data) {
                                    if (data.success && data.success.length) {
                                        for (var i in data.success) {
                                            _arr.push('<dd class="competence_item ' + (thatdata.chk_rid[data.success[i].id] ? "allchkbox" : "") + '" data_id="' + data.success[i].id + '" data_name="' + data.success[i].name + '"><span class="chkbox iconfont competence_chk">&#xf00b2;</span><span class="competence_name">' + data.success[i].name + '</span><span class="competence_remark">' + data.success[i].remark + '</span></dd>');
                                        }
                                        $dl.append(_arr.join(''));
                                        $this.removeClass("get_competence");
                                    }
                                },
                                error: function () { }
                            });
                            var _arr = [];
                        })($this, $dl)
                        return false;
                    });
                    //常规复选框
                    this.wmBox.on("click", ".chkbox", function () {
                        var $this = $(this),
                            $dt = $this.closest("dt"),
                            $dl = $dl = $dt.closest("dl"),
                            $competence_item = $this.closest(".competence_item");
                        $dt.toggleClass("allchkbox");
                        $competence_item.toggleClass("allchkbox");
                        if ($dt.hasClass("allchkbox")) {
                            $dl.find("dt,.competence_item").addClass("allchkbox").removeClass("sectionchkbox").find(".chkbox").empty().append("&#xf00b2;");
                        } else {
                            $dl.find("dt,.competence_item").removeClass("allchkbox");
                        }
                        //全选的下属判定
                        $nav_tree.find(".allchkbox:not(.competence_item)").each(function () {
                            var $this = $(this).closest("dd");
                            if ($this.find("dd:not(.competence_item)").length + 1 > $this.find(".allchkbox:not(.competence_item)").length) {
                                $this.find(".allchkbox:not(.competence_item):eq(0)").attr("class", "sectionchkbox").find(".chkbox").empty().append("&#xf015d;");
                            } else {
                                $this.find(".sectionchkbox:eq(0)").attr("class", "allchkbox").find(".chkbox").empty().append("&#xf00b2;");
                            }
                        });
                        //部分选中下属判定
                        $nav_tree.find(".sectionchkbox").each(function () {
                            var $this = $(this).closest("dd");
                            if ($this.find("dd:not(.competence_item)").length === $this.find(".allchkbox:not(.competence_item)").length) {
                                $this.find(".sectionchkbox:not(.competence_item):eq(0)").attr("class", "allchkbox").find(".chkbox").empty().append("&#xf00b2;");
                            }
                        });
                        //全部取消
                        $nav_tree.find(".sectionchkbox").each(function () {
                            var $this = $(this).closest("dd");
                            if (!$this.find(".allchkbox:not(.competence_item)").length) {
                                $this.find(".sectionchkbox").removeClass("sectionchkbox");
                            }
                        });

                    });
                    //权限复选框
                    this.wmBox.on("click", ".competence_chk", function () {
                        var $dl = $(this).closest("dl"), caaLength = $dl.find(".competence_item.allchkbox").length;
                        if (caaLength !== $dl.find(".competence_item").length) {
                            $dl.find("dt").attr("class", "sectionchkbox").find(".chkbox").empty().append("&#xf015d;")
                        } else {
                            $dl.find("dt").attr("class", "allchkbox").find(".chkbox").empty().append("&#xf00b2;")
                        }
                        if (!caaLength) {
                            $dl.find("dt").attr("class", "").find(".chkbox").empty().append("&#xf00b2;");
                        }
                        return false;
                    });
                    //获取下级页面,执行后清除本身class
                    this.wmBox.on("click", ".get_page", function () {
                        var $this = $(this),
                            _id = $this.attr("data_id"),
                            _name = $this.attr("data_name");
                        api.getModelPageList({
                            id: _id,
                            success: function (data) {
                                var $append, $dl;
                                if (data.success) {
                                    for (var i in data.success) {
                                        $append = $('<dd><dl data_id="' + data.success[i].id + '"></dl></dd>');
                                        $dl = $append.find("dl");
                                        $dl.append('<dt><a href="#" class="iconfont show_sub_btn get_competence"  data_id="' + data.success[i].id + '">&#xf0175;</a><span class="chkbox iconfont">&#xf00b2;</span><a href="#" class="nav_nide" data_id="' + data.success[i].id + '" data_name="' + data.success[i].name + '" data_parent_id="' + _id + '" data_parent_name="' + _name + '">' + data.success[i].name + '</a></dt>');
                                        $this.closest("dl").append($append);
                                    }
                                    $nav_tree.find(".get_competence").click();
                                    $this.removeClass("get_page");
                                }
                            }
                        });
                        return false;
                    });
                    initNav.call(this, function () {
                        this.wmBox.find(".competence_item[data_id='1'] .chkbox").click();
                        self.position();
                    });
                }
            });
        };
        //添加角色
        $form.on("click", ".add_user_role", function () {
            var $this = $(this),
                _roleBox = $this.data("roleBox");
            if (!_roleBox) {
                _roleBox = _createRoleBox();
                $this.data("roleBox", _roleBox);
            }
            _roleBox.show();
            return false;
        });
        //编辑角色
        $form.on("click", ".edit_user_role", function () {
            var $this = $(this),
                _roleBox = $this.data("roleBox"),
                $tr = $this.closest("tr"),
                _id = $tr.attr("data_id"),
                _name = $tr.attr("data_name"),
                _remark = $tr.attr("data_remark");
            if (!_roleBox) {
                _roleBox = _createRoleBox({
                    id: _id,
                    role_name: _name,
                    remark: _remark
                });
                $this.data("roleBox", _roleBox);
            }
            _roleBox.show();
            return false;
        });
        //设置权限
        $form.on("click", ".set_competence", function () {
            var $this = $(this),
                chk_rid = {},
                set_competence_box = $this.data("set_competence_box"),
                $tr = $this.closest("tr"),
                _id = $tr.attr("data_id"),
                _role_name = $tr.attr("data_name"),
                _chkrid = $tr.attr("data_chkrid").split(','),
                _role_remark = $tr.attr("data_remark");
            for (var i in _chkrid) {
                chk_rid[_chkrid[i]] = 1;
            }
            if (!set_competence_box) {
                set_competence_box = _createSetCompetenceBox({
                    role_id: _id,
                    role_name: _role_name,
                    role_remark: _role_remark,
                    chk_rid: chk_rid
                });
                $this.data("set_competence_box", set_competence_box);
            }
            set_competence_box.show();
            return false;
        });
        //删除角色
        $form.on("click", ".deit_role", function () {
            var $this = $(this), $tr = $this.closest("tr");
            if (confirm("确定要删除角色？\n删除后无法恢复")) {
                api.delRole({
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
    };
    init();
});
