define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        box = require("wmbox"),
        verification = require("verification"),
        juicer = require("juicer"),
        inputdown = require("inputdown"),
        page = require("wmpage")
    ;
    var init = function () {
        var $form = $(".set_tag_box");
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
        verification.strikingSuccess = false;
        $form.append('<div class="fixed_box" style="left:' + ($form.offset().left + $form.outerWidth() + 10) + 'px"><a href="#" class="add_group">+</a></div>');
        bind();

    };
    var bind = function () {
        var $form = $(".set_tag_box");
        var _groupBox = juicer([
            '<div class="group_box_main">',
                '<div class="group_box_head">',
                    '<h3>{@if id }修改分组{@else}添加分组{@/if}</h3>',
                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                '</div>',
                '<div class="group_box_con">',
                    '<ul class="wm_form" data_id="${id}">',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>分组名称：</label>',
                            '<input type="text" class="form_txt w300 group_name" wmv="empty" wmvmsg="分组名称不能为空！" name="group_name_${m}" value="${name}" />',
                            '<span class="group_name_error" for="group_name_${m}"></span>',
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
        var _tagItem = juicer([
            '{@each success as item}',
            '<div class="tag_item" data_id="${item.tagId}"><a target="_blank" href="http://s.wumeiwang.com/search?q=${item.tagName}">${item.tagName}</a><a href="#" class="wm_ico fork2  remove_tag"></a></div>',
            '{@/each}',
        ].join(''));
        var _createGroupBox = function (data) {
            var m = parseInt(Math.random() * 99999) + 9999;
            return box.invBox({
                boxCls: "group_box",
                content: _groupBox.render($.extend({
                    m: m
                }, data)),
                callback: function () {
                    var self = this,
                        $vform = this.wmBox.find(".wm_form");
                    this.close = this.hide;

                    this.wmBox.on("click", ".submit", function () {
                        var $this = $(this), _id = $vform.attr("data_id");
                        if (verification.verify($vform)) {
                            if (_id) {
                                $.ajax({
                                    url:domains.api2+ "/sns/modifytagclass.json",
                                    data: {
                                        id: _id,
                                        className: encodeURIComponent($.trim($vform.find(".group_name").val()))
                                    },
                                    type: "get",
                                    dataType: "jsonp",
                                    success: function (data) {
                                        if (data.success) {
                                            alert("修改成功！");
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
                                $.ajax({
                                    url:domains.api2+ "/sns/addtagclass.json",
                                    data: {
                                        className: encodeURIComponent($.trim($vform.find(".group_name").val()))
                                    },
                                    type: "get",
                                    dataType: "jsonp",
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
                        }
                        return false;
                    });
                }
            });
        };
        var _initTagList = function (id, box) {
            $.ajax({
                url:domains.api2+ "/sns/selecttag.json",
                type: "get",
                data: {
                    id: id
                },
                dataType: "jsonp",
                success: function (data) {
                    if (data.success) {
                        box.empty().append(_tagItem.render(data));
                    }
                }
            });
        };
        //添加分组
        $form.on("click", ".add_group", function () {
            var $this = $(this),
                groupBox = $this.data("groupBox");
            if (!groupBox) {
                groupBox = _createGroupBox();
                $this.data("groupBox", groupBox);
            }
            groupBox.wmBox.find(".group_name").val('');
            groupBox.show();
            return false;
        });
        //修改分组
        $form.on("click", ".edit_group", function () {
            var $this = $(this),
                $tr = $this.closest("tr"),
                _id = $tr.attr("data_id"),
                _name = $tr.attr("data_name"),
                groupBox = $this.data("groupBox");
            if (!groupBox) {
                groupBox = _createGroupBox({
                    id: _id,
                    name: _name
                });
                $this.data("groupBox", groupBox);
            }
            groupBox.show();
            return false;
        });
        //删除分组
        $form.on("click", ".del_group", function () {
            var $this = $(this),
                $tr = $this.closest("tr");
            if (confirm("确定删除该分组？删除后无法恢复")) {
                $.ajax({
                    url: domains.api2+"/sns/deletetagclass.json",
                    data: {
                        id: $tr.attr("data_id")
                    },
                    type: "get",
                    dataType: "jsonp",
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
                });
            }
            return false;
        });
        //将标签从分组移除
        $form.on("click", ".remove_tag", function () {
            var $this = $(this),
                $tag_item = $this.closest(".tag_item");
            $.ajax({
                url:domains.api2+ "/sns/deletetag.json",
                data: {
                    id: $tag_item.attr("data_id")
                },
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    if (data.success) {
                        $tag_item.fadeOut(function () {
                            $tag_item.remove();
                        });
                    } else {
                        alert(data.error || "删除失败！");
                    }
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });

            return false;
        });
        //添加标签进分组
        $form.on("click", ".add_tag", function () {
            var $this = $(this),
                addTagBox = $this.data("addTagBox"),
                $tr = $this.closest("tr"),
                $tag_list = $tr.find(".tag_list"),
                _id = $tr.attr("data_id");
            if (!addTagBox) {
                addTagBox = box.invBox({
                    boxCls: "gat_box",
                    content: [
                        '<div class="gat_main">',
                            '<div class="gat_head">',
                                '<h3>添加标签</h3>',
                                '<a href="#" class="iconfont close">&#xf00b3;</a></div>',
                            '<div class="gat_con">',
                                '<ul class="wm_form" data_id="">',
                                    '<li class="form_row">',
                                        '<label class="row_key"><b class="form_must">*</b>标签名称：</label><input type="text" class="form_txt w300 tag_name"><a href="#" class="ui_btn ui_btn_h26white6 confirm_add_tag"><span class="ui_btn_txt">添加</span></a>',
                                        '<input type="hidden" class="tag_id" />',
                                    '</li>',
                                    '<li class="form_row">',
                                        '<label class="row_key">已有：</label><div class="floatleft new_tag_list"></div>',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</div>'
                    ].join(''),
                    callback: function () {
                        var that = this,
                            $vform = this.wmBox.find(".wm_form"),
                            _inputdown,
                            $new_tag_list = this.wmBox.find(".new_tag_list"),
                            $tag_name = this.wmBox.find(".tag_name");
                        this.close = function () {
                            that.hide();
                            _inputdown.hideDownList();
                        };

                        this.wmBox.on("click", ".submit", function () {
                            var $this = $(this);
                            if (verification.verify($vform)) {
                                that.close();
                            }
                            return false;
                        });
                        setTimeout(function () {
                            _inputdown = inputdown.Create({
                                input: that.wmBox.find(".tag_name"),
                                position: "fixed",
                                zIndex: that.wmBox.css("z-index"),
                                listItemModel: [
                                   '<ul>',
                                   '{@each success as item}',
                                       '<li class="input_downitem" data_text="${item.tagName}">',
                                          '<span>${item.tagName}</span>',
                                       '</li>',
                                   '{@/each}',
                                   '</ul>'].join(''),
                                updownCallback: function (curr) {
                                    this.val(curr.attr("data_text"));
                                },
                                callback: function () {
                                    var self = this;
                                    this.$input.on("focus", function () {
                                        if ($(this).val()) {
                                            self.showDownList();
                                        }
                                    });
                                    this.$input.on("blur", function () {
                                        setTimeout(function () {
                                            self.hideDownList();
                                        }, 100);
                                    });
                                    this.$input.on("keydown", function () {
                                        var $this = $(this);
                                        $this.attr("old_val", $this.val());
                                    });
                                    this.$input.on("keyup", function () {
                                        var $this = $(this), old_val = $this.attr("old_val"), val = $this.val();
                                        if (old_val != val) {
                                            $.ajax({
                                                url:domains.api2+ "/sns/findtag.json",
                                                type: "get",
                                                dataType: "jsonp",
                                                data: {
                                                    tagName: encodeURIComponent(val)
                                                },
                                                success: function (data) {
                                                    if (data.success) {
                                                        self.empty().append(data, function () { self.showDownList(); });
                                                    }
                                                },
                                                error: function () { }
                                            });
                                        }
                                    });
                                    this.$downBox.on("click", ".input_downitem", function () {
                                        var $this = $(this);
                                        self.$input.val($this.attr("data_text"));
                                        self.hideDownList();
                                        return false;
                                    });
                                }
                            });
                        }, 500);
                        this.wmBox.on("click", ".confirm_add_tag", function () {
                            var _v = $.trim($tag_name.val()), _append;
                            if (_v) {
                                $.ajax({
                                    url:domains.api2+ "/sns/addtag.json",
                                    type: "get",
                                    dataType: "jsonp",
                                    data: {
                                        tagName: encodeURIComponent(_v),
                                        classid: _id
                                    },
                                    success: function (data) {
                                        var $curr;
                                        if (data.success) {
                                            $curr = $new_tag_list.find(".tag_item[data_id='" + data.success.tagId + "']")
                                            if ($curr.length) {
                                                lib.BGShine({
                                                    ele: $curr,
                                                    original_color: '#d1ebfe',
                                                    change_color: '#09c',
                                                    frequency: 3,
                                                    callback: function () {
                                                        $curr.removeAttr("style");
                                                    }
                                                });
                                            } else {
                                                _append = '<div class="tag_item" data_id="' + data.success.tagId + '"><a target="_blank" href="http://s.wumeiwang.com/search?q=' + _v + '">' + _v + '</a><a href="#" class="wm_ico fork2  remove_tag"></a></div>';
                                                $new_tag_list.prepend(_append);
                                                $tag_list.prepend(_append);
                                                $tag_name.val('');
                                            }

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
                                    ele: $tag_name,
                                    original_color: "#fff",
                                    change_color: "#ff6363",
                                    frequency: 3
                                });
                            }
                            return false;
                        });

                    }
                });
                $this.data("addTagBox", addTagBox);
            }
            _initTagList(_id, addTagBox.wmBox.find(".new_tag_list"));
            addTagBox.show();
            return false;
        });
    };
    init();
});
