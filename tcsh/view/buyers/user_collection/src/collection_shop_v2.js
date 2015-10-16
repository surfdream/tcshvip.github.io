define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        page = require("wmpage"),
		tips = require("wmtips"),
		box = require("wmbox"),
        verification = require("wmverification"),
        commodity_data = require("commodity_data"),
        collect = require('wmcollect'),
        lazyload = require("wmlazyload")
    ;
    var _g_data = {};
    var create_kinds_box = juicer([
        '<div class="user_kinds">',
            '<h2>分类到</h2>',
            '<ul class="kind_list">',
                '{@each list as item }',
                '<li class="kind_item" data_id="${item.id}"><input type="checkbox" class="ci_chk" id="ci_${data_collectid}_${item.id}" /><label for="ci_${data_collectid}_${item.id}">${item.tagname}<span class="tag_con" data_con="${item.size}">(${item.size})</span></label></li>',
                '{@/each}',
            '</ul>',
            '<div class="create_do"><label class="create_btn" for="create_txt_${data_collectid}"><span class="iconfont">&#xf0175;</span>新建标签</label><div class="create_kinds_box"><input type="text" class="create_txt" wmv="empty|max:10" wmvmsg="分类名不能为空！|分类名过长！" id="create_txt_${data_collectid}" /><a href="#" class="create_submit">创建</a></div></div>',
        '</div>'
    ].join(''));
    var init = function () {
        var $page = $("#page")
        ;
        lazyload.init({
            lazyloadEle: "img"
        });
        //分页
        if (global_setting && global_setting.page && global_setting.page.totalcount) {
            var _page = page.Create({
                url: global_setting.current.page.url || domains.member+"/collect/markets",
                index: (global_setting.current.page.pageindex) || 1,
                size: (global_setting.current.page.pagesize) || 10,
                sum: (global_setting.current.page.totalcount) || 0,
                pagekey: "pageindex",
                front: true
            });
        };



        //获取所有标签列表
        collect.getBusinessTagList({
            success: function (data) {
                _g_data.userTag = data
            },
            error: function () { }
        });

        bind();
        //设置验证
        verification.init(function () {
            this.setTipSkin("white1").setDirection("br").setOffSet({
                top: 5,
                left: -100
            });
            this.minZIndex = 20000;
        });
    };
    var bind = function () {
        var $page = $("#page"),
            $chk_all = $page.find(".chk_all"),
            $favorite_goods_list = $page.find(".favorite_goods_list"),
			$kinds_more = $page.find(".kinds_more")
        ;
        var bindCiChk = function (_collectid) {
            this.find(".ci_chk").on("change", function () {
                var $this = $(this),
                    $kind_item = $this.closest(".kind_item"),
                    _tagId = $kind_item.attr("data_id");
                if ($this.attr("checked")) {
                    collect.businessToTag({
                        tagId: _tagId,
                        id: _collectid,
                        success: function (data) {
                            if (data.success) {
                                _g_data.userTag[_tagId].size = data.success.size;
                                $kind_item.find(".tag_con").empty().append('(' + _g_data.userTag[_tagId].size + ')');
                            } else {
                                alert('系统繁忙，请稍后再试！')
                            }
                        },
                        error: function () {

                        }
                    });
                } else {
                    collect.businessOutTag({
                        tagId: _tagId,
                        id: _collectid,
                        success: function (data) {
                            if (data.success) {
                                _g_data.userTag[_tagId].size = data.success.size;
                                $kind_item.find(".tag_con").empty().append('(' + _g_data.userTag[_tagId].size + ')');
                            } else {
                                alert('系统繁忙，请稍后再试！')
                            }
                        },
                        error: function () {

                        }
                    });

                }
            });
        };
        //分类更多
        $kinds_more.toggle(function () {
            var $this = $(this);
            $this.siblings(".kinds_detail").addClass("kinds_detail_height")
        }, function () {
            var $this = $(this);
            $this.siblings(".kinds_detail").removeClass("kinds_detail_height")
        });
        //全选
        $page.on("click", ".chk_all", function () {
            var $this = $(this),
				_checked = $this.attr("checked")
            ;
            if (_checked) {
                $favorite_goods_list.find(".shop_chk").attr("checked", "checked");
            }
            else {
                $favorite_goods_list.find(".shop_chk").removeAttr("checked");
            }
        });
        //监听全选
        $page.find(".shop_chk").on("click", function () {
            if ($favorite_goods_list.find(".shop_chk:checked").length !== $favorite_goods_list.find(".shop_chk").length) {
                $chk_all.removeAttr("checked");
            } else {
                $chk_all.attr("checked", "checked");
            }
        });

        /*删除店铺标签*/
        $page.on("click", ".editor_del", function () {
            var $this = $(this),
				_thisBox = $this.data("thisBox"),
				$parent = $this.closest(".actived")
            ;
            if (!_thisBox) {
                _thisBox = box.relyBox({
                    rely: $this,
                    content: '<p style="font-size: 14px;color: #666;line-height: 40px;"><i class="iconfont" style="color: #f37e15;font-size: 32px;line-height: 40px;vertical-align: bottom;margin-right: 10px;">&#xf0143;</i>确定掉删除该收藏吗？</p><span style="padding-left: 42px;color: #999;">删除后将无法恢复</span><div style="padding-left: 42px;margin: 10px 0 -10px 0;position:relative;z-index:100;"><a href="#" style="background: #f40;padding: 5px 10px;color: #fff;margin-right: 10px;" class="close">取消</a><a href="#" class="sure">确定</a></div>',
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        this.wmBox.hover(function () { }, function () {
                            self.close();
                        });
                    },
                    offset: {
                        top: -20
                    },
                    btns: [],
                    sureCallBack: function () {
                        collect.delBusinessTag({
                            tagId: $parent.attr("data_id"),
                            success: function (data) {
                                if (data.success) {
                                    window.location.href=domains.www+"/sell/favorite/page1";
                                } else {
                                    alert("系统繁忙，请稍后再试！");
                                }
                            },
                            error: function () {
                                alert("系统繁忙，请稍后再试！");
                            }
                        });
                    }
                });
                $this.data("thisBox", _thisBox);
            }
            _thisBox.show();
            return false;
        });

        /*编辑店铺标签*/
        $page.on("click", ".editor_mod", function () {
            var $this = $(this),
				_thisBox = $this.data("thisBox"),
                $parent = $this.closest("a"),
                _id = $parent.attr("data_id")
            ;
            if (!_thisBox) {
                _thisBox = box.invBox({
                    offset: { top: -20 },
                    boxId: "edit_tag",
                    content: '<div class="edit_tag_con"><h3>编辑标签</h3><p style="padding:20px 80px 10px 0;"><label for="">名称：</label><input type="text" class="editor_kinds" value="" wmv="max:10" wmvmsg="长度不能超过10！" /></p><a href="#" class="submit">保存修改</a><a href="#" class="iconfont close">&#xf00b3;</a></div>',
                    callback: function () {
                        var self = this;
						var $edit_tag_con = this.wmBox.find(".edit_tag_con");
						verification.init($edit_tag_con,function () {
							this.setTipSkin("white1").setDirection("tr").setOffSet({
								top:0
							});
							this.minZIndex = 20000;
						});
                        this.close = this.hide;
                        this.wmBox.find(".editor_kinds").on("keydown", function (e) {
                            if (e.keyCode === 13) {
                                $(this).closest(".wmBox").find(".ui_btn_h26yellow12").click();
                                return false;
                            }
                        });
                        this.wmBox.on("click", ".submit", function () {
							
							if(verification.verify($edit_tag_con)){
								var _v = $.trim(self.wmBox.find(".editor_kinds").val());
								if (_v) {
									collect.editBusinessTag({
										tagId: _id,
										tagName: encodeURIComponent(_v),
										success: function (data) {
											if (data.success) {
												$this.closest(".actived").find(".myKinds").empty().append(_v);
												_g_data.userTag[_id].tagname = _v;
												self.close();
											} else {
												alert("系统繁忙，请稍后再试！");
											}
										},
										error: function () {
											alert("系统繁忙，请稍后再试！");
										}
									});
								} else {
									lib.BGShine({
										ele: self.wmBox.find(".editor_kinds"),
										original_color: "#fff",
										change_color: "#ff6363",
										frequency: 3
									});
								}
							}
                            return false;
                        });
                    }
                });
                $this.data("thisBox", _thisBox);
            }
            _thisBox.show();
            return false;
        });




        //分类
        $page.on("click", ".select_kinds", function () {
            var $this = $(this),
                $parent = $this.closest(".favorite_shop_con"),
                data_collectid = $parent.attr("data_collectid")
            ;
            box.relyBox({
                rely: $this,
                boxCls: "user_kinds_box",
                content: create_kinds_box.render({ list: _g_data.userTag, data_collectid: data_collectid }),
                btns: [],
                offset: {
                    top: -20
                },
                callback: function () {
                    var self = this;
                    var $create_do = this.wmBox.find(".create_do"),
                        $create_kinds_box = this.wmBox.find(".create_kinds_box"),
                        $kind_list = this.wmBox.find(".kind_list");
                    //创建新标签
                    this.wmBox.on("click", ".create_btn", function () {
                        $create_do.addClass("show_create_txt");
                    });
                    this.wmBox.hover(function () { }, function () {
                        self.close();
                        $create_do.removeClass("show_create_txt");
                        verification.hideTips($create_kinds_box);
                    });
                    //保存新标签
                    this.wmBox.on("click", ".create_submit", function () {
                        var postData = {};
                        if (verification.verify($create_kinds_box)) {
                            postData.name = $create_kinds_box.find(".create_txt").val();
                            //postData.id = parseInt(Math.random() * 999);
                            collect.createBusinessTag({
                                tagName: postData.name,
                                success: function (data) {
                                    if (data.success) {
                                        $kind_list.scrollTop(0);
                                        var $append = $('<li class="kind_item" data_id="' + data.success.id + '"><input type="checkbox" checked="checked" class="ci_chk" id="ci_' + data_collectid + '_' + data.success.id + '" /><label for="ci_' + data_collectid + '_' + data.success.id + '">' + data.success.tagName + '<span class="tag_con" data_con="1">(1)</span></label></li>');
                                        $kind_list.prepend($append);
                                        $create_do.removeClass("show_create_txt");
                                        $create_kinds_box.find(".create_txt").val('');
                                        _g_data.userTag[data.success.id] = {
                                            id: data.success.id,
                                            tagname: data.success.tagName,
                                            size: 0
                                        };
                                        bindCiChk.call($append, data_collectid);
                                        $kind_list.find(".kind_item[data_id='" + data.success.id + "'] .ci_chk").attr("checked", "checked").change();
                                    } else {
                                        alert(data.error);
                                    }
                                },
                                error: function () {
                                    alert("服务器繁忙，请稍后再试！");
                                }
                            });
                        }
                        return false
                    });
                    //标签名称回车响应
                    this.wmBox.find(".create_txt").on("keydown", function (e) {
                        if (e.keyCode === 13) {
                            $(this).closest(".create_kinds_box").find(".create_submit").click();
                            return false;
                        }
                    });
                    //选中店铺已经归类的标签
                    collect.getBusinessItemTag({
                        id: data_collectid,
                        success: function (data) {
                            for (var i in data) {
                                //先勾选，再把勾选项移至顶端
                                $kind_list.prepend(self.wmBox.find(".kind_item[data_id='" + data[i] + "'] .ci_chk").attr("checked", "checked").closest(".kind_item"));
                            }
                        },
                        error: function () {
                        }
                    });
                    bindCiChk.call(this.wmBox, data_collectid);
                    //复选框
                    /*this.wmBox.find(".ci_chk").on("change", function () {
                        var $this = $(this),
                            $kind_item = $this.closest(".kind_item"),
                            $tag_con = $kind_item.find("")
                        _id = $kind_item.attr("data_id");
                        collect.businessToTag({
                            success: function () { },
                            error: function () {
                                if ($this.attr("checked")) {
                                    _g_data.userTag[_id].con++;
                                } else {
                                    _g_data.userTag[_id].con--;
                                }
                                $kind_item.find(".tag_con").empty().append('(' + _g_data.userTag[_id].con + ')');
                            }
                        });
                    });*/
                }
            });
            return false;
        });
        //批量分类
        $page.on("click", ".setkind_business_list", function () {
            var $this = $(this),
               $checked_item = $favorite_goods_list.find(".shop_chk:checked"),
               thisError = $this.data("thisError"),
               _arr = [],
               data_collectid
            ;
            if ($checked_item.length) {
                $checked_item.each(function () {
                    _arr.push($(this).closest(".favorite_shop_con").attr("data_collectid"))
                });
                data_collectid = _arr.join('_');
                box.relyBox({
                    rely: $this,
                    boxCls: "user_kinds_box",
                    content: create_kinds_box.render({ list: _g_data.userTag, data_collectid: data_collectid }),
                    btns: [],
                    offset: {
                        top: -20
                    },
                    callback: function () {
                        var self = this;
                        var $create_do = this.wmBox.find(".create_do"),
                            $create_kinds_box = this.wmBox.find(".create_kinds_box"),
                            $kind_list = this.wmBox.find(".kind_list");
                        //创建新标签
                        this.wmBox.on("click", ".create_btn", function () {
                            $create_do.addClass("show_create_txt");
                        });
                        this.wmBox.hover(function () { }, function () {
                            self.close();
                            $create_do.removeClass("show_create_txt");
                            verification.hideTips($create_kinds_box);
                        });
                        //保存新标签
                        this.wmBox.on("click", ".create_submit", function () {
                            var postData = {};
                            if (verification.verify($create_kinds_box)) {
                                postData.name = $create_kinds_box.find(".create_txt").val();
                                postData.id = parseInt(Math.random() * 999);
                                collect.createBusinessTag({
                                    tagName: postData.name,
                                    success: function (data) {
                                        if (data.success) {
                                            $kind_list.scrollTop(0);
                                            var $append = $('<li class="kind_item" data_id="' + data.success.id + '"><input type="checkbox" checked="checked" class="ci_chk" id="ci_' + data_collectid + '_' + data.success.id + '" /><label for="ci_' + data_collectid + '_' + data.success.id + '">' + data.success.tagName + '<span class="tag_con" data_con="1">(1)</span></label></li>');
                                            $kind_list.prepend($append);
                                            $create_do.removeClass("show_create_txt");
                                            $create_kinds_box.find(".create_txt").val('');
                                            _g_data.userTag[data.success.id] = {
                                                id: data.success.id,
                                                tagname: data.success.tagName,
                                                size: 0
                                            };
                                            bindCiChk.call($append, _arr.join(','));
                                            $kind_list.find(".kind_item[data_id='" + data.success.id + "'] .ci_chk").attr("checked", "checked").change();
                                        } else {
                                            alert(dara.error);
                                        }
                                    },
                                    error: function () {
                                        alert("服务器繁忙，请稍后再试！");
                                    }

                                });
                            }
                            return false
                        });
                        //标签名称回车响应
                        this.wmBox.find(".create_txt").on("keydown", function (e) {
                            if (e.keyCode === 13) {
                                $(this).closest(".create_kinds_box").find(".create_submit").click();
                                return false;
                            }
                        });
                        //选中店铺已经归类的标签
                        collect.getBusinessItemTag({
                            id: data_collectid,
                            success: function (data) {
                                for (var i in data) {
                                    //先勾选，再把勾选项移至顶端
                                    $kind_list.prepend(self.wmBox.find(".kind_item[data_id='" + data[i] + "'] .ci_chk").attr("checked", "checked").closest(".kind_item"));
                                }
                            },
                            error: function () { }
                        });
                        bindCiChk.call(this.wmBox, _arr.join(','));
                        /*//复选框
                        this.wmBox.find(".ci_chk").on("change", function () {
                            var $this = $(this),
                                $kind_item = $this.closest(".kind_item"),
                                $tag_con = $kind_item.find("")
                            _id = $kind_item.attr("data_id");
                            collect.businessToTag({
                                success: function () { },
                                error: function () {
                                    if ($this.attr("checked")) {
                                        _g_data.userTag[_id].con = _g_data.userTag[_id].con + _arr.length;
                                    } else {
                                        _g_data.userTag[_id].con = _g_data.userTag[_id].con - _arr.length;
                                    }
                                    $kind_item.find(".tag_con").empty().append('(' + _g_data.userTag[_id].con + ')');
                                }
                            });
                        });*/
                    }
                }).show();

            } else {
                if (!thisError) {
                    thisError = new tips({
                        ele: $this,
                        con: '请先勾选！',
                        skin: 'white1',
                        close: 2000,
                        direction: "rt",
                        offset: {
                            top: -2,
                            left: 20
                        }
                    });
                    $this.data("thisError", thisError);
                }
                thisError.show();
            }
            return false;
        });
        //删除
        $page.on("click", ".del_business", function () {
            var $this = $(this),
				 $parent = $this.closest(".favorite_shop_con"),
				 thisrelyBox = $this.data("thisrelyBox"),
				data_collectid = $parent.attr("data_collectid")
            ;
            if (!thisrelyBox) {
                thisrelyBox = box.relyBox({
                    rely: $this,
                    content: '<p style="font-size: 14px;color: #666;line-height: 40px;"><i class="iconfont" style="color: #f37e15;font-size: 32px;line-height: 40px;vertical-align: bottom;margin-right: 10px;">&#xf0143;</i>确定掉删除该收藏吗？</p><span style="padding-left: 42px;color: #999;">删除后将无法恢复</span><div style="padding-left: 42px;margin: 10px 0 -10px 0;position:relative;z-index:100;"><a href="#" style="background: #f40;padding: 5px 10px;color: #fff;margin-right: 10px;" class="close">取消</a><a href="#" class="sure">确定</a></div>',
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        this.wmBox.hover(function () { }, function () {
                            self.close();
                        });
                    },
                    btns: [],
                    offset: {
                        top: -20
                    },
                    sureCallBack: function () {
                        collect.delBusiness({
                            id: data_collectid,
                            success: function (data) {
                                if (data.success) {
                                    $parent.fadeOut(function () {
                                        $parent.remove();
                                    });
                                } else {
                                    alert(data.error);
                                }
                            },
                            error: function () { }
                        });
                    }
                });
                $this.data("thisrelyBox", thisrelyBox);
            }
            thisrelyBox.show();
            return false;
        });
        //批量删除
        $page.on("click", ".del_business_list", function () {
            var $this = $(this),
                $checked_item = $favorite_goods_list.find(".shop_chk:checked"),
                thisError = $this.data("thisError"),
                thisConfirm = $this.data("thisConfirm");
            if ($checked_item.length) {
                if (!thisConfirm) {
                    thisConfirm = box.relyBox({
                        rely: $this,
                        content: '<p style="font-size: 14px;color: #666;line-height: 40px;"><i class="iconfont" style="color: #f37e15;font-size: 32px;line-height: 40px;vertical-align: bottom;margin-right: 10px;">&#xf0143;</i>确定掉删除选中的收藏吗？</p><span style="padding-left: 42px;color: #999;">删除后将无法恢复</span><div style="padding-left: 42px;margin: 10px 0 -10px 0;position:relative;z-index:100;"><a href="#" style="background: #f40;padding: 5px 10px;color: #fff;margin-right: 10px;" class="close">取消</a><a href="#" class="sure">确定</a></div>',
                        callback: function () {
                            var self = this;
                            this.close = this.hide;
                            this.wmBox.hover(function () { }, function () {
                                self.close();
                            });
                        },
                        btns: [],
                        offset: {
                            top: -20
                        },
                        sureCallBack: function () {
                            var _ids = [];
                            $checked_item.each(function () {
                                _ids.push($(this).closest(".favorite_shop_con").attr("data_collectid"));
                            });
                            collect.delBusiness({
                                id: _ids.join(','),
                                success: function (data) {
                                    if (data.success) {
                                        $checked_item.each(function () {
                                            var $parent = $(this).closest(".favorite_shop_con");
                                            $parent.fadeOut(function () {
                                                $parent.remove();
                                            });
                                        });
                                    }
                                },
                                error: function () {
                                    alert("服务器繁忙，请稍后再试！");
                                }
                            });
                        }
                    });
                    $this.data("thisConfirm", thisConfirm);
                }
                thisConfirm.show();
            } else {
                if (!thisError) {
                    thisError = new tips({
                        ele: $this,
                        con: '请先勾选！',
                        skin: 'white1',
                        close: 2000,
                        direction: "rt",
                        offset: {
                            top: -2,
                            left: 20
                        }
                    });
                    $this.data("thisError", thisError);
                }
                thisError.show();
            }
            return false;
        });



    };
    init();
});