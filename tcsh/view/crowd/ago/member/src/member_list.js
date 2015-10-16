define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
		box = require("wmbox"),
		juicer = require("juicer"),
		lib = require("lib"),
        friend = require("friend"),
        search_crowd = require('search_crowd')
    ;

    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            $all_chk = $page.find(".all_chk");
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
                            friend.getFriendData({
                                data: {
                                    userName: _v
                                },
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
                        $txt_name.focus();
                        return false;
                    });
                    this.wmBox.find(".stranger_val").on("keydown", function (e) {
                        if (e.keyCode === 13) {
                            self.wmBox.find(".add_stranger").click();
                        }
                    });
                },
                btns: []
            });
            return false;
        });
        //关注
        $page.on("click", ".follow", function () {
            var $this = $(this), $member_item = $this.closest(".member_item");
            $this.replaceWith('<a href="#" class="ui_btn ui_btn_h22white7 not_follow"><span class="ui_btn_txt"><span class="iconfont">&#xf00ea;</span>取消关注</span></a>');
            //friend.focusFriend({
            //    focus_id: $member_item.attr("data_id"),
            //    success: function (data) {

            //    },
            //    error: function () {
            //        alert("服务器繁忙！");
            //    }
            //});
            return false;
        });
        //取消关注
        $page.on("click", ".not_follow", function () {
            var $this = $(this), $member_item = $this.closest(".member_item");
            $this.replaceWith('<a href="#" class="ui_btn ui_btn_h22white7 follow"><span class="ui_btn_txt"><span class="iconfont">&#xf00e9;</span>关注</span></a>');
            //friend.delFocusFriend({
            //    ids: [$member_item.attr("data_id")],
            //    success: function (data) {

            //    },
            //    error: function () {
            //        alert("服务器繁忙！");
            //    }
            //});
            return false;
        });
        
        $page.on("click", ".search_crowd", function () {
            search_crowd.createBox();
            return false;
        });
    };
    init();
});