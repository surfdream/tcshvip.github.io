define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        box = require('wmbox'),
        classbox = require('classbox'),
        verification = require("verification");
    var init = function () {
        var $form = $(".set_shopping_view");
        verification.addRule([
            {
                key: "srtnEmpty",
                fun: function () {
                    if (!this.closest(".sub_recommend").find(".remove_mask").length) {
                        return !!$.trim(this.val()).length
                    }
                    return true;
                }
            }
        ]);
        verification.init(".set_shopping_view");
        $form.append('<div class="fixed_box" style="left:' + ($form.offset().left + $form.outerWidth() + 10) + 'px"><a href="#" class="add_type">+</a></div>');
        bind();

    };
    var bind = function () {
        var $form = $(".set_shopping_view"),
            $type_list = $form.find(".type_list"),
            $save_btns = $form.find(".save_btns");
        var type_item_html = [
            '<li class="form_row type_item">',
                '<div>',
                    '<label class="row_key">ico：</label>',
                    '<input type="text" class="type_ico form_txt" wmv="empty" wmvmsg="ico不能为空！" />',
                '</div>',
                '<div>',
                    '<label class="row_key">分类名称：</label>',
                    '<input type="text" class="type_name form_txt" wmv="empty" wmvmsg="分类名称不能为空！" />',
                    '<div class="type_item_btns">',
                        '<a href="#" class="iconfont save" title="保存分类">&#xf0131;</a>',
                        '<a href="#" class="iconfont show_sub_recommend" title="显示下级推荐">&#xf00e9;</a>',
                        '<a href="#" class="iconfont del_type_item" title="删除分类">&#xf00b3;</a>',
                    '</div>',
                '</div>',
                //data-postdata=[{"id":"150701","name":"火腿肠"},{"id":"150702","name":"方便饭"},{"id":"150703","name":"罐头"}]
                '<div class="strong_recommend">',
                    '<label class="row_key">强推类目：</label>',
                    '<p class="contain">暂无强推类目</p>',
                    '<a href="#" class="edit_contain">编辑</a>',
                '</div>',
                '<div style="clear: both;padding:10px 0 10px 130px;"><a href="#" class="add_sub_recommend">添加下级推荐</a></div>',
            '</li>'
        ].join('');
        var _sub_recommend_html = [
            '<div class="sub_recommend">',
                '<label class="row_key">下级推荐：</label>',
                '<input type="text" class="sr_type_name form_txt" wmv="srtnEmpty" wmvmsg="推荐名称不能为空！" />',
                '<div class="floatleft">',
                    '<p class="sub_contain">暂无分类</p>',
                    '<div class="sub_contain_btns">',
                        //'<a href="#" class="save_sub_recommend">保存</a>',
                        '<a href="#" class="edit_sub_contain">编辑</a>',
                        '<a href="#" class="del_sub_contain">删除</a>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('');
        //编辑推荐分类
        $form.on("click", ".edit_sub_contain", function () {
            var $this = $(this),
                thisBox = $this.data("thisBox");
            if (!thisBox) {
                thisBox = classbox.createBox({
                    callback: function () {
                        var self = this, _arr = [];
                        var $sub_recommend = $this.closest(".sub_recommend");
                        $sub_recommend.attr("no_each", "1");
                        $form.find(".sub_recommend:not([no_each])").each(function () {
                            var $this = $(this);
                            if (!$this.find(".remove_mask").length) {
                                _arr.push($this.attr("data_ids"));
                            }
                        });
                        $sub_recommend.removeAttr("no_each");
                        self.disabled(_arr.join(','));
                        self.chked($sub_recommend.attr("data_ids"));
                    },
                    submitCallback: function () {
                        var $sub_recommend = $this.closest(".sub_recommend"),
                            $type_item = $sub_recommend.closest(".type_item"),
                            _data3 = this.getVal(3).data,
                            _ids = [], _names = [], $names = [];
                        for (var i in _data3) {
                            _ids.push(i);
                            $names.push('<span>' + _data3[i].name + '</span>');
                            _names.push(_data3[i].name);
                        }
                        $sub_recommend.attr("data_ids", _ids.join(','));
                        $sub_recommend.attr("data_names", _names.join(','));
                        $sub_recommend.find(".sub_contain").empty().append($names.join(''));

                    }
                });
                $this.data("thisBox", thisBox);
            }
            thisBox.show();
            return false;
        });
        //设置强推类别
        $form.on("click", ".edit_contain", function () {
            var $this = $(this),
                thisBox = $this.data("thisBox");
            if (!thisBox) {
                thisBox = classbox.createBox({
                    callback: function () {
                        var $strong_recommend = $this.closest(".strong_recommend"),
                            data = $strong_recommend.data("postdata"),
                            chkedIds = [];
                        if (data) {
                            for (var i in data) {
                                chkedIds.push(data[i].id);
                            }
                            this.chked(chkedIds);
                        }
                    },
                    submitCallback: function () {
                        var $strong_recommend = $this.closest(".strong_recommend"),
                            $contain = $strong_recommend.find(".contain"),
                            _data3 = this.getVal(3).data,
                            _arr = [],
                            $names = [];
                        for (var i in _data3) {
                            _arr.push(_data3[i]);
                            $names.push('<a href="http://s.wumeiwang.com/list/' + _data3[i].id + '.html"  target="_blank">' + _data3[i].name + '</a>');
                        }
                        $strong_recommend.data("postdata", _arr);
                        $contain.empty().append($names.join(''));

                    }
                });
                $this.data("thisBox", thisBox);
            }
            thisBox.show();
            return false;
        });
        //添加推荐分类
        $form.on("click", ".add_sub_recommend", function () {
            var $this = $(this),
                $type_item = $this.closest(".type_item"),
                $sub_recommend_html;
            $type_item.find(".show_sub_recommend").click();
            //所有个数 - 已删除个数
            if ($type_item.find(".sub_recommend").length - $type_item.find(".remove_mask").length < 6) {
                $sub_recommend_html = $(_sub_recommend_html)
                if ($type_item.attr("data_id")) {
                    $sub_recommend_html.find(".sub_contain_btns").prepend('<a href="#" class="save_sub_recommend">保存</a>');
                }
                $this.parent().before($sub_recommend_html);
            } else {
                alert("最多只能添加6个推荐！");
            }
            return false;
        });
        //保存三观分类
        $form.on("click", ".save", function () {
            var postData = {},
                $this = $(this),
                $vform = $this.closest(".type_item"),
                _type_itemId;
            if (verification.verify($vform)) {
                postData.ico = $vform.find(".type_ico").val();
                postData.name = $vform.find(".type_name").val();
                postData.strong_recommend = $vform.find(".strong_recommend").data("postdata") || "";
                _type_itemId = $vform.attr("data_id");
                if (_type_itemId) {
                    postData.id = _type_itemId;
                }
                postData.recommendList = [];
                postData.removeList = [];
                $vform.find(".sub_recommend").each(function () {
                    var $this = $(this);
                    if ($this.find(".remove_mask").length) {
                        //删除列表
                        postData.removeList.push({
                            name: $this.find(".sr_type_name").val(),
                            id: $this.attr("data_id") || "",
                            classIds: $this.attr("data_ids") || "",
                            classNames: $this.attr("data_names") || ""
                        });
                    } else {
                        //变更列表
                        postData.recommendList.push({
                            name: $this.find(".sr_type_name").val(),
                            id: $this.attr("data_id") || "",
                            classIds: $this.attr("data_ids") || "",
                            classNames: $this.attr("data_names") || ""
                        });
                    }
                });
                postData.strong_recommend = JSON.stringify(postData.strong_recommend);
                postData.recommendList = JSON.stringify(postData.recommendList);
                postData.removeList = JSON.stringify(postData.removeList);
                $.ajax({
                    url: domains.api2 + "/base/defalut/mypicture.json",
                    data: postData,
                    type: "post",
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            alert("保存成功！");
                            $vform.find(".hide_sub_recommend").click();
                        } else {
                            alert(data.error);
                        }
                    },
                    error: function () {
                        alert("服务器繁忙，请稍后再试！");
                    }
                });

            }
            return false;
        });
        //保存推荐分类
        $form.on("click", ".save_sub_recommend", function () {
            var postData = {},
                $this = $(this),
                $sub_recommend = $this.closest(".sub_recommend");
            if (verification.verify($sub_recommend)) {
                postData.parentId = $sub_recommend.closest(".type_item").attr("data_id");
                postData.id = $sub_recommend.attr("data_id")||"";
                postData.name = $sub_recommend.find(".sr_type_name").val();
                postData.classIds = $sub_recommend.attr("data_ids");
                postData.classNames = $sub_recommend.attr("data_names");
                $.ajax({
                    url:domains.api2+ "/base/defalut/recommend.json",
                    data: postData,
                    type: "get",
                    dataType: "jsonp",
                    success: function (data) {
                        if (data.success) {
                            alert("保存成功！");
                            window.location.reload();
                        } else {
                            alert(data.error);
                        }
                    },
                    error: function () {
                        alert("系统繁忙，请稍后再试！")
                    }
                })
            }
            return false;
        });
        //添加三观分类
        $form.on("click", ".add_type", function () {
            $type_list.append(type_item_html);
            return false;
        });
        //显示推荐分类
        $form.on("click", ".show_sub_recommend", function () {
            var $this = $(this), $type_item = $this.closest(".type_item");
            $this.replaceWith('<a href="#" class="iconfont hide_sub_recommend" title="隐藏下级推荐">&#xf00ea;</a>');
            $type_item.find(".sub_recommend").css({
                "display": "block"
            });
            return false;
        });
        //隐藏推荐分类
        $form.on("click", ".hide_sub_recommend", function () {
            var $this = $(this), $type_item = $this.closest(".type_item");
            $this.replaceWith('<a href="#" class="iconfont show_sub_recommend" title="显示下级推荐">&#xf00e9;</a>');

            $type_item.find(".sub_recommend").css({
                "display": "none"
            });
            return false;
        });
        //删除推荐分类
        $form.on("click", ".del_sub_contain", function () {
            var $this = $(this), $sub_recommend = $this.closest(".sub_recommend");
            if ($sub_recommend.attr("data_id")) {
                $sub_recommend.append('<div class="remove_mask" style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;background: #000;opacity: 0.7;"><p style="color: #fff;text-align: center;font-size: 20px;line-height:' + $sub_recommend.outerHeight() + 'px">保存后彻底删除，<a href="#" class="cancel_remove" style="color: #ff4400;font-size: 14px;font-weight: 700;">取消删除</a></p></div>');
            } else {
                $sub_recommend.fadeOut(function () {
                    $(this).remove();
                });
            }
            verification.hideTips($sub_recommend);
            return false;
        });
        //删除三观分类
        $form.on("click", ".del_type_item", function () {
            var $this = $(this), $type_item = $this.closest(".type_item");
            $type_item.find(".hide_sub_recommend").click();
            if ($type_item.attr("data_id")) {
                $type_item.find(".hide_sub_recommend").click();
                $type_item.append('<div class="remove_mask" style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;background: #000;opacity: 0.7;"><p style="color: #fff;text-align: center;font-size: 20px;line-height:' + $type_item.outerHeight() + 'px">确认删除？<span style="font-size:14px;">删除后无法恢复</span><p style="line-height: 12px;margin-top: -40px;padding-left: 312px;"><a href="#" class="confirm_remove" style="color: #ff4400;font-size: 14px;font-weight: 700;margin-right: 10px;">确认</a><a href="#" class="cancel_remove" style="color: #ff4400;font-size: 14px;font-weight: 700;">取消</a></p></p></div>');
            } else {
                $type_item.fadeOut(function () {
                    $(this).remove();
                });
            }
            return false;
        });
        //取消删除三观分类
        $form.on("click", ".cancel_remove", function () {
            var $this = $(this),
                $sub_recommend = $this.closest(".sub_recommend"),
                $type_item = $this.closest(".type_item");
            if ($sub_recommend.length) {
                if ($type_item.find(".sub_recommend").length - $type_item.find(".remove_mask").length < 6) {
                    $this.closest(".remove_mask").remove();
                } else {
                    alert("取消后推荐类目将超过6个，请先删除一个再进行取消删除！")
                }
            } else {
                $this.closest(".remove_mask").remove();
            }
            return false;
        });
        //确认删除三观分类
        $form.on("click", ".confirm_remove", function () {
            var $this = $(this).closest(".type_item");
            $.ajax({
                url:domains.api2+ "/base/defalut/deletemypicture.json",
                dataType: "jsonp",
                data: {
                    id: $this.attr("data_id")
                },
                type: "get",
                success: function (data) {
                    if (data.success) {
                        $this.fadeOut(function () {
                            $this.remove();
                        });
                    } else {
                        alert(data.error);
                    }
                },
                error: function () {
                    alert("系统繁忙，请稍后再试！");
                }
            });
            return false;
        });
    };
    init();
});
