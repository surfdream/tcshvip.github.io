define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        box = require("wmbox"),
        juicer = require("juicer"),
        verification = require("verification"),
        chk_model = require("chk_model"),
        page = require("wmpage"),
        api = require("api")
    ;
    var init = function () {
        var $form = $(".set_page_box");
        $form.append('<div class="fixed_box" style="left:' + ( $form.outerWidth()  -100) + 'px;position: absolute;top: 78px;"><a href="#" class="add_page">+</a></div>');
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
        var $form = $(".set_page_box"),
            $search = $(".search"),
            $search_model_name = $search.find(".search_model_name"),
            $search_model_id = $search.find("#search_model_id");
        var _pageBox = juicer([
            '<div class="page_box_main">',
                '<div class="page_box_head">',
                    '<h3>{@if id }修改页面{@else}添加页面{@/if}</h3>',
                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                '</div>',
                '<div class="page_box_con">',
                    '<ul class="wm_form" data_id="${id}">',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>模块名称：</label>',
                            '{@if id }',
                                '<input type="text" class="form_txt page_model" style="width: 230px;" name="page_model_${m}" value="${model_name}" readonly="readonly" />',
                            '{@else}',
                                '<input type="text" class="form_txt page_model" wmv="empty" wmvmsg="请选择模块！" style="width: 230px;" name="page_model_${m}" value="${model_name}" readonly="readonly" />',
                                '<a href="#" class="ui_btn ui_btn_h22red21 chk_model"><span class="ui_btn_txt">选择</span></a>',
                                '<span class="page_name_error" for="page_model_${m}"></span>',
                                '<input type="hidden" class="page_model_id" value="${model_id}" />',
                            '{@/if}',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>页面名称：</label>',
                            '<input type="text" class="form_txt page_name" wmv="empty" wmvmsg="页面名称不能为空！" name="page_name_${m}" value="${name}" />',
                            '<span class="page_name_error" for="page_name_${m}"></span>',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>页面URL：</label>',
                            '<input type="text" class="form_txt page_url" wmv="empty" wmvmsg="页面URL不能为空！" name="page_url_${m}" value="${url}" />',
                            '<span class="page_url_error" for="page_url_${m}"></span>',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key">备注：</label>',
                            '<input type="text" class="form_txt page_remark" value="${remark}" />',
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
        var _competenceBox = juicer([
            '<div class="competence_box_main">',
                '<div class="competence_box_head">',
                    '<h3>${name} - 权限维护</h3>',
                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                '</div>',
                '<div class="competence_box_con">',
                    '<ul class="wm_form" data_id="${id}">',
                        '<li class="form_row"><label class="row_key"><b class="form_must">*</b>权限名称：</label><input type="text" class="form_txt add_name"></li>',
                        '<li class="form_row"><label class="row_key">备注：</label><input type="text" class="form_txt w300 add_remark"></li>',
                        '<li class="form_row"><label class="row_key">&nbsp;</label><a href="#" class="ui_btn ui_btn_h22white7 add_competence"><span class="ui_btn_txt">添加</span></a></li>',
                        '<li class="" style="margin-top:10px">',
                            '<table cellpadding="0" cellspacing="0" class="table_list competence_list">',
                                '<thead>',
                                    '<tr>',
                                        '<th style="width:70px">权限Code</th>',
                                        '<th style="width:100px">权限名称</th>',
                                        '<th>备注</th>',
                                        '<th style="width: 70px;text-align: left; padding-left: 15px;">操作</th>',
                                    '</tr>',
                                '</thead>',
                            '</table>',
                        '</li>',
                        '<li class="competence_list_box">',
                            '<table cellpadding="0" cellspacing="0" class="table_list competence_list">',
                                '<tbody>',

                                '</tbody>',
                            '</table>',
                        '</li>',
                    '</ul>',
                '</div>',
            '</div>'
        ].join(''));
        var _competenceItem = juicer([
            '{@each success as item}',
            '<tr data_id="${item.id}" data_name="${item.name}" data_remark="${item.remark}">',
                '<td style="width:70px">${item.code}</td>',
                '<td><input type="text" class="form_txt edit_text c_name" value="${item.name}" readonly="readonly" /></td>',
                '<td><input type="text" class="form_txt edit_text c_remark" value="${item.remark}" readonly="readonly" /></td>',
                '<td>',
                    '<div class="btn_list ">',
                        '<a href="#" class=" portal del_competence"><span class="ui_btn_txt">删除<span class="wm_ico arrow8down"></span></span></a>',
                        '<ul>',
                            '<li class="btn_list_last">',
                                '<a href="#" class="del_competence">删除</a>',
                            '</li>',
                            '<li class="btn_list_end">',
                                '<a href="#" class="edit_competence">修改</a>',
                            '</li>',
                        '</ul>',
                    '</div>',
                    '<div class="btn_list edit_btns">',
                        '<a href="#" class="ui_btn ui_btn_h23yellow8 portal save"><span class="ui_btn_txt">保存<span class="wm_ico arrow6down"></span></span></a>',
                        '<ul>',
                            '<li class="btn_list_last">',
                                '<a href="#" class="save">保存</a>',
                            '</li>',
                            '<li class="btn_list_end">',
                                '<a href="#" class="close_change">取消</a>',
                            '</li>',
                        '</ul>',
                    '</div>',
                '</td>',
            '</tr>',
            '{@/each}'
        ].join(''))
        var _getCompetenceList = function (id, box) {
            api.getPageCompetenceList({
                id: id,
                success: function (data) {
                    box.wmBox.find(".competence_list_box tbody").empty().append(_competenceItem.render(data));
                    box.position();
                },
                error: function () {
                    throw "api.getPageCompetenceList Error！"
                }
            });
        };
        var _createpageBox = function (data) {
            return box.invBox({
                boxCls: "page_box",
                content: _pageBox.render($.extend({
                    m: parseInt(Math.random() * 99999) + 9999
                }, data)),
                callback: function () {
                    var self = this,
                        $vform = this.wmBox.find(".wm_form"),
                        $page_model = $vform.find(".page_model"),
                        $page_model_id = $vform.find(".page_model_id");
                    this.close = this.hide;
                    verification.init($vform);
                    this.wmBox.on("click", ".submit", function () {
                        var $this = $(this),
                            _id = $vform.attr("data_id"),
                            _modelId = $vform.find(".page_model_id").val(),
                            _name = encodeURIComponent($.trim($vform.find(".page_name").val())),
                            _remark = encodeURIComponent($.trim($vform.find(".page_remark").val())),
                            _url = encodeURIComponent($.trim($vform.find(".page_url").val()));
                        if (verification.verify($vform)) {
                            if (_id) {
                                api.editPage({
                                    id: _id,
                                    modelId: _modelId,
                                    name: _name,
                                    remark:_remark,
                                    url: _url,
                                    success: function (data) {
                                        if (data.success) {
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
                                api.addPage({
                                    modelId: _modelId,
                                    name: _name,
                                    url: _url,
                                    remark: _remark,
                                    success: function (data) {
                                        if (data.success) {
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
                            self.close();
                        }
                        return false;
                    });
                    //选择模块
                    this.wmBox.on("click", ".chk_model", function () {
                        var $this = $(this),
                            chkBox = $this.data("chkBox");
                        if (!chkBox) {
                            chkBox = chk_model.create({
                                callback: function () {
                                    this.chk($page_model_id.val());
                                },
                                submitCallback: function (data) {
                                    $page_model.val(data.name);
                                    $page_model_id.val(data.id);
                                    verification.verify($this.closest(".form_row"));
                                }
                            });
                            $this.data("chkBox", chkBox);
                        }
                        chkBox.show();
                        return false;
                    });
                    this.wmBox.on("click", ".page_model", function () {
                        self.wmBox.find(".chk_model").click();
                        return false;
                    });
                }
            });
        };
        //创建页面
        $form.on("click", ".add_page", function () {
            var $this = $(this),
                add_page = $this.data("add_page");
            if (!add_page) {
                add_page = _createpageBox();
                $this.data("add_page", add_page);
            }
            add_page.show();
            return false;
        });
        //修改页面
        $form.on("click", ".edit_page", function () {
            var $this = $(this),
                $tr = $this.closest("tr"),
                edit_page = $this.data("edit_page"),
                _name = $tr.attr("data_name"),
                _parent_name=$tr.attr("data_parent_name"),
                _url = $tr.attr("data_url"),
                _id = $tr.attr("data_id");
            if (!edit_page) {
                edit_page = _createpageBox({
                    id: _id,
                    name: _name,
                    url: _url,
                    model_name: _parent_name,
                    model_id: _id
                })
                $this.data("edit_page", edit_page);
            }
            edit_page.show();
            return false;
        });
        //删除页面
        $form.on("click", ".del_page", function () {
            var $this = $(this),
                $tr = $this.closest("tr");
            if (confirm("确定删除该模块？删除后无法恢复")) {
                api.delPage({
                    id: $tr.attr("data_id"),
                    success: function (data) {
                        if (data.success) {
                            $tr.fadeOut(function () {
                                $tr.remove();
                            });
                        } else {
                            alert(data.error || "删除失败！");
                        }
                    },
                    error: function () {
                        alert("系统繁忙！")
                    }
                })

            }
            return false;
        });
        //权限设置
        $form.on("click", ".set_competence", function () {
            var $this = $(this),
                $tr = $this.closest("tr"),
                _name = $tr.attr("data_name"),
                _pageid = $tr.attr("data_id"),
                _competence_box = $tr.data("competence_box");
            if (!_competence_box) {
                _competence_box = box.invBox({
                    boxCls: "competence_box",
                    content: _competenceBox.render({
                        id: _pageid,
                        name: _name
                    }),
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        //编辑权限
                        this.wmBox.on("click", ".edit_competence", function () {
                            var $this = $(this),
                                $tr = $this.closest("tr");
                            if (!$tr.hasClass("edit")) {
                                $tr.addClass("edit");
                                $tr.find(".edit_text").removeAttr("readonly");
                            }
                            return false;
                        });
                        //取消编辑
                        this.wmBox.on("click", ".close_change", function () {
                            var $this = $(this),
                                $tr = $this.closest("tr");
                            $tr.removeClass("edit");
                            $tr.find(".edit_text").attr("readonly", "readonly");
                            $tr.find(".c_name").val($tr.attr("data_name"));
                            $tr.find(".c_remark").val($tr.attr("data_remark"));
                            return false;
                        });
                        //保存
                        this.wmBox.on("click", ".save", function () {
                            var $this = $(this),
                               $tr = $this.closest("tr"),
                                _id = $tr.attr("data_id"),
                                _name = $.trim($tr.find(".c_name").val()),
                                _remark = $.trim($tr.find(".c_remark").val());
                            if (_name) {
                                api.pageEditCompetence({
                                    id: _id,
                                    name: encodeURIComponent(_name),
                                    remark: encodeURIComponent(_remark),
                                    success: function (data) {
                                        if (data.success) {
                                            $tr.removeClass("edit");
                                            $tr.find(".edit_text").attr("readonly", "readonly");
                                        } else {
                                            alert(data.error || "修改失败！");
                                        }
                                    },
                                    error: function () {
                                        var data = {};
                                        data.success = 1;
                                        if (data.success) {
                                            $tr.removeClass("edit");
                                            $tr.find(".edit_text").attr("readonly", "readonly");
                                        } else {
                                            alert(data.error || "修改失败！");
                                        }
                                        //alert("系统繁忙！");
                                    }
                                });
                            }
                            else {
                                lib.BGShine({
                                    ele: $tr.find(".c_name"),
                                    original_color: "#fff",
                                    change_color: "#ff6363",
                                    frequency: 3
                                });
                            }

                            return false;
                        });
                        //删除权限
                        this.wmBox.on("click", ".del_competence", function () {
                            var $this = $(this),
                               $tr = $this.closest("tr"),
                               $wm_form = $tr.closest(".wm_form");
                            if (confirm("确定删除该权限？删除后将无法恢复")) {
                                api.pageDelCompetence({
                                    moduelid: $wm_form.attr("data_id"),
                                    id: $tr.attr("data_id"),
                                    success: function (data) {
                                        if (data.success) {
                                            $tr.fadeOut(function () {
                                                $tr.remove();
                                            });
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
                        //添加权限
                        this.wmBox.on("click", ".add_competence", function () {
                            var $name = self.wmBox.find(".add_name"),
                                $remark = self.wmBox.find(".add_remark"),
                                _name = $.trim($name.val()),
                                _add_remark = $.trim($remark.val());
                            if (_name) {
                                $name.val("");
                                $remark.val("");
                                api.pageAddCompetence({
                                    pageId: _pageid,
                                    name: encodeURIComponent(_name),
                                    remark: encodeURIComponent(_add_remark),
                                    success: function (data) {
                                        if (data.success) {
                                            self.wmBox.find(".competence_list_box tbody").prepend(_competenceItem.render({
                                                success: [
                                                    {
                                                        id: data.success.id,
                                                        code: data.success.code,
                                                        name: _name,
                                                        remark: _add_remark
                                                    }
                                                ]
                                            }))
                                        } else {
                                            alert(data.error || "添加失败！");
                                        }
                                    },
                                    error: function () {                                       
                                        alert("系统繁忙！");
                                    }
                                });

                            } else {
                                lib.BGShine({
                                    ele: $name,
                                    original_color: "#fff",
                                    change_color: "#ff6363",
                                    frequency: 3
                                });
                            }
                            return false;
                        });
                    }
                });
                $tr.data("competence_box", _competence_box);
            }
            _getCompetenceList(_pageid, _competence_box);
            _competence_box.show();
            return false;
        });
        //搜索-选择模块
        $search.on("click", ".chk_model", function () {
            var $this = $(this),
                chkBox = $this.data("chkBox");
            if (!chkBox) {
                chkBox = chk_model.create({
                    callback: function () {
                        this.chk($search_model_id.val())
                    },
                    submitCallback: function (data) {
                        $search_model_name.val(data.name);
                        $search_model_id.val(data.id);
                    }
                });
                $this.data("chkBox", chkBox);
            }
            chkBox.show();
            return false;
        });
        $search_model_name.on("click", function () {
            $search.find(".chk_model").click();
            return false;
        });
    };
    init();
});


