define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
		box = require("wmbox"),
		juicer = require("juicer"),
		lib = require("lib"),
        friend = require("friend")
    ;

    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            $all_chk = $page.find(".all_chk");
        //黑名单
        var _blacklist = function (userIds) {
            var $this = this;
            $.ajax({
                url: domains.commune + "/commune/add/blacklist.json",
                data: {
                    communeId: global_setting.communeId,
                    userIds: userIds
                },
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        $this.fadeOut(function () {
                            $this.remove();
                        });
                    } else {
                        alert(dta.error || "系统繁忙！");
                    }
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });
        };
        //踢出
        var _remove = function (userIds) {
            var $this = this;
            $.ajax({
                url: domains.commune + "/commune/remove/member.json",
                data: {
                    communeId: global_setting.communeId,
                    userIds: userIds
                },
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        $this.fadeOut(function () {
                            $this.remove();
                        });
                    } else {
                        alert(dta.error || "踢出失败！");
                    }
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });
        };
        //屏蔽
        var _shield = function (userIds, shieldTime) {
            var $this = this;
            $.ajax({
                url: domains.commune + "/commune/shield/user.json",
                data: {
                    communeId: global_setting.communeId,
                    userIds: userIds,
                    shieldTime: shieldTime
                },
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        $this.addClass("is_shield");
                        $this.find(".shield").replaceWith([
                            '<div class="btn_list shield">',
                                '<a href="#" class="portal lift_shield">解除屏蔽</a>',
                            '</div>'
                        ].join(''));
                    } else {
                        alert(dta.error || "系统繁忙！");
                    }
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });
        };
        //取消屏蔽
        var _lift_shield = function (userIds) {
            var $this = this;
            $.ajax({
                url: domains.commune + "/commune/remove/shield/user.json",
                data: {
                    communeId: global_setting.communeId,
                    userIds: userIds
                },
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        $this.removeClass("is_shield");
                        $this.find(".shield").replaceWith([
                           '<div class="btn_list shield">',
                                '<a href="#" class="portal shield_btn" data_time="36">屏蔽<span class="wm_ico arrow9down"></span></a>',
                                '<ul>',
                                    '<li class="btn_list_last">',
                                        '<a href="#" class="shield_btn" data_time="24">24小时</a>',
                                    '</li>',
                                    '<li>',
                                        '<a href="#" class="shield_btn" data_time="36">36小时</a>',
                                    '</li>',
                                    '<li class="btn_list_end">',
                                        '<a href="#" class="shield_btn" data_time="72">72小时</a>',
                                    '</li>',
                                '</ul>',
                            '</div>'
                        ].join(''));
                    } else {
                        alert(dta.error || "踢出失败！");
                    }
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });           
        };
        //邀请
        $page.on("click", ".invite_btn", function () {
            box.alert({
                boxCls: "crowd_box invite_box",
                titleText: "邀请好友加入",
                content: [
                    '<div class="invite">',
                        '<ul class="wm_form">',
                            '<li class="form_row">',
                                '<label class="row_key">受邀人员：</label>',
                                '<a href="#" class="ui_btn ui_btn_h22white7 add_friend"><span class="ui_btn_txt">邀请好友</span></a>',
                                '<div class="invite_user_box">',
                                    '<ul class="invite_user_list">',
                                        '<li class="stranger"><input type="text" class="form_txt stranger_val"><a href="#" class="ui_btn ui_btn_h22white7 add_stranger"><span class="ui_btn_txt">添加</span></a><span class="form_remark">输入用户名，添加非好友用户</span></li>',
                                    '</ul>',
                                '</div>',
                            '</li>',
                            '<li class="form_row">',
                                '<label class="row_key">邀请内容：</label>',
                                '<textarea class="form_textarea" style="width: 470px;height: 100px;"></textarea>',
                            '</li>',
                            '<li class="form_row">',
                                '<label class="row_key">&nbsp;</label>',
                                '<a href="#" class="ui_btn ui_btn_h26blue2"><span class="ui_btn_txt">邀请</span></a>   ',
                                '<a href="#" class="ui_btn ui_btn_h26white6 close"><span class="ui_btn_txt">取消</span></a>',
                            '</li>',
                        '</ul>',
                    '</div>',
                ].join(''),
                callback: function () {
                    var self = this;
                    this.close = this.hide;
                    var $invite_user_list = this.wmBox.find(".invite_user_list");
                    var addUser = function (data) {
                        var _html = [];
                        for (var i in data) {
                            if (!this.find(".friend_item[data_id='" + data[i].id + "']").length) {
                                _html.push('<li class="friend_item" data_id="' + data[i].id + '" data_name="' + data[i].name + '">' + data[i].name + '<a class="wm_ico fork2  remove_friend" href="#"></a></li>');
                            }
                        }
                        this.prepend(_html.join(''));
                    };
                    this.wmBox.on("click", ".add_friend", function () {
                        var $this = $(this),
                            friend_box = $this.data("friend_box");
                        if (!friend_box) {
                            friend_box = friend.userFriendBox({
                                boxCls: "crowd_box",
                                sure: function (data) {
                                    this.close();
                                    addUser.call($invite_user_list, data.dataList);
                                    self.position();
                                }
                            });
                            $this.data("friend_box", friend_box);
                        }
                        friend_box.show();
                        return false;
                    });
                    this.wmBox.on("click", ".add_stranger", function () {
                        var $txt_name = self.wmBox.find(".stranger_val"),
                            _v = $.trim($txt_name.val());
                        if (_v) {
                            $txt_name.val('');
                            //debug
                            addUser.call($invite_user_list, [{
                                name: _v,
                                id: parseInt(Math.random() * 999) + 999
                            }]);
                            return false;
                            /////////////////
                            friend.getFriendData({
                                success: function (data) {
                                    if (data.success) {
                                        addUser.call($invite_user_list, [{
                                            name: data.success.userName,
                                            id: data.success.userId
                                        }]);
                                    } else {
                                        alert(data.error || "未找到该用户！");
                                    }
                                },
                                error: function () {
                                    alert("服务器繁忙！");
                                }
                            });
                        } else {
                            lib.BGShine({
                                ele: $txt_name,
                                original_color: "#fff",
                                change_color: "#ff6363",
                                frequency: 3
                            });
                        }
                        return false;
                    });
                },
                btns: []
            });
            return false;
        });
        //选择
        $page.on("click", ".member_item", function () {
            $(this).toggleClass("curr");
            if ($page.find(".member_item").length === $page.find(".member_item.curr").length) {
                $all_chk.addClass("curr");
            } else {
                $all_chk.removeClass("curr");
            }
            return false;
        });
        //全选
        $page.on("click", ".all_chk", function () {
            var $this = $(this);
            $this.toggleClass("curr");

            if ($this.hasClass("curr")) {
                $page.find(".member_item").addClass("curr");
            } else {
                $page.find(".member_item").removeClass("curr");
            }
            return false;
        });

        //黑名单
        $page.on("click", ".to_blacklist", function () {
            var $this = $(this).closest(".member_item");
            _blacklist.call($this, $this.attr("data_id"));
            return false;
        });
        //踢出
        $page.on("click", ".remove", function () {
            var $this = $(this).closest(".member_item");
            _remove.call($this, $this.attr("data_id"));
            return false;
        });
        //屏蔽
        $page.on("click", ".shield_btn", function () {
            var $this=$(this),
                $member_item=  $this.closest(".member_item");
            _shield.call($member_item, $member_item.attr("data_id"), $this.attr("data_time"));
            return false;
        });
        //取消屏蔽
        $page.on("click", ".lift_shield", function () {
            var $this = $(this).closest(".member_item");
            _lift_shield.call($this, $this.attr("data_id"));
            return false;
        });
        //批量踢出
        $page.on("click", ".batch_remove", function () {
            var $curr = $page.find(".member_item.curr"),
                userIds = [];
            $curr.each(function () {
                userIds.push($(this).attr("data_id"));
            });
            _remove.call($curr, userIds.join(','));
            return false;
        });
        //批量屏蔽
        $page.on("click", ".batch_shield", function () {        
            var $this=$(this),
                $curr = $page.find(".member_item.curr"),
                userIds = [];
            $curr.each(function () {
                userIds.push($(this).attr("data_id"));
            });
            _shield.call($curr, userIds.join(','), $this.attr("data_time"));
            return false;
        });
        //批量黑名单
        $page.on("click", ".batch_blacklist", function () {
            var $curr = $page.find(".member_item.curr"),
                userIds = [];
            $curr.each(function () {
                userIds.push($(this).attr("data_id"));
            });
            _blacklist.call($curr, userIds.join(','));
            return false;
        });
    };
    init();
});