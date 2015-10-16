define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        box = require('wmbox'),
        classbox = require('classbox'),
        verification = require("verification");
    gData = {};

    var init = function () {
        var $form = $(".set_collect");
        verification.init(".set_collect");
        verification.addRule([
            {
                key: "tmEmpty",
                fun: function () {
                    if (!this.closest(".type_item").find(".remove_mask").length) {
                        return !!$.trim(this.val()).length
                    }
                    return true;
                }
            }
        ]);
        $form.append('<div class="fixed_box" style="left:' + ($form.offset().left + $form.outerWidth() + 10) + 'px"><a href="#" class="add_type">+</a></div>');
        bind();

    };
    var bind = function () {
        var $form = $(".set_collect"),
            $type_list = $form.find(".type_list"),
            $save_btns = $form.find(".save_btns");
        var type_item_html = [
            '<li class="form_row type_item">',
                '<div>',
                    '<label class="row_key">分类ico：</label>',
                    '<input type="text" class="form_txt type_ico w80"/><span class="iconfont"></span>',
                '</div>',
                '<div>',
                    '<label class="row_key">分类名称：</label>',
                    '<input type="text" class="type_name form_txt" wmv="tmEmpty" wmvmsg="分类名称不能为空！" />',
                '</div>',
                '<div class="floatleft">',
                    '<p class="contain">暂无分类</p>',
                    '<a href="#" class="edit">编辑</a>',
                '</div>',
                '<a href="#" class="iconfont remove" title="删除分类">&#xf00b3;</a>',
            '</li>'
        ].join('');
        $form.on("click", ".edit", function () {
            var $this = $(this),
                thisBox = $this.data("thisBox");
            if (!thisBox) {
                thisBox = classbox.createBox({
                    ischkNo3: false,
                    callback: function () {
                        var $type_item = $this.closest(".type_item"),
                            $siblings = $type_item.siblings(".type_item[data_ids]"),
                            data_ids = [];
                        this.chked($type_item.attr("data_ids"));
                        if ($siblings.length) {
                            $siblings.each(function () {
                                var ids = $(this).attr("data_ids")
                                ids && data_ids.push(ids);
                            });
                            data_ids = data_ids.join(',');
                            data_ids.split(',');
                            this.disabled(data_ids);
                            
                        }
                    },
                    submitCallback: function () {
                        var $type_item = $this.closest(".type_item"),
                         _data = this.getVal().data,
                         _ids = [], _names = [], $names = [];
                        for (var i in _data) {
                            _ids.push(i);
                            $names.push('<span>' + _data[i].name + '</span>');
                            _names.push(_data[i].name);
                        }
                        $type_item.attr("data_ids", _ids.join(','));
                        $type_item.attr("data_names", _names.join(','));
                        $type_item.find(".contain").empty().append($names.join(''));
                    }
                });
                $this.data("thisBox", thisBox);
            }
            thisBox.show();
            return false;
        });
        $form.on("click", ".save", function () {
            var postData = {};
            if (verification.verify($form)) {
                postData.typeList = [];
                postData.removeList = [];
                $form.find(".type_item:not(.save_btns)").each(function () {
                    var $this = $(this);
                    if ($this.find(".remove_mask").length) {
                        postData.removeList.push({
                            id: $this.attr("data_id") || "",
                            icon: encodeURIComponent($this.find(".type_ico").val()),
                            name: encodeURIComponent($this.find(".type_name").val()),
                            classNames: $this.attr("data_names") || "",
                            classIds: $this.attr("data_ids") || ""
                        });
                    } else {
                        postData.typeList.push({
                            id: $this.attr("data_id") || "",
                            icon: encodeURIComponent($this.find(".type_ico").val()),
                            name: encodeURIComponent($this.find(".type_name").val()),
                            classNames: $this.attr("data_names") || "",
                            classIds: $this.attr("data_ids") || ""
                        });
                    }
                    
                });
                postData.typeList = JSON.stringify(postData.typeList);
                postData.removeList = JSON.stringify(postData.removeList);
                $.ajax({
                    url: domains.api2 + "/base/defalut/favorite.json",
                    type: "get",
                    dataType: "jsonp",
                    data: postData,
                    success: function (data) {
                        if (data.success) {
                            alert("保存成功！")
                            window.location.reload();
                        }
                    },
                    error: function () {

                    }
                });
            }
            return false;
        });
        $form.on("click", ".add_type", function () {
            $save_btns.before(type_item_html);
            return false;
        });
        $form.on("click", ".remove", function () {
            var $this = $(this), $type_item = $this.closest(".type_item");
            if ($type_item.attr("data_id")) {
                $this.after('<div class="remove_mask" style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;background: #000;opacity: 0.7;"><p style="color: #fff;text-align: center;font-size: 20px;line-height:' + $type_item.outerHeight() + 'px">保存后彻底删除，<a href="#" class="cancel_remove" style="color: #ff4400;font-size: 14px;font-weight: 700;">取消删除</a></p></div>');
            } else {
                $type_item.fadeOut(function () {
                    $(this).remove();
                });
            }
            return false;
        });
        $form.on("click", ".cancel_remove", function () {
            $(this).closest(".remove_mask").remove();
            return false;
        });
    };
    init();
});
