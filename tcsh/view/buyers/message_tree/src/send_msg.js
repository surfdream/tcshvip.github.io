define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        juicer = require("juicer"),
        box = require("wmbox"),
        friend = require("friend"),
        site_in_message = require("site_in_message"),
        verification = require("wmverification")
    ;
    var _friendItemHtml = juicer([
        '<li class="friend_item" data_id="${userId}" data_name="${userName}" data_signature="${signature}">',
            '<a href="#" title="${userName}">',
                '<img class="friend_img" src="${avatar}" />',
                '<span class="friend_name">${userName}</span>',
                '<span class="signature">这家伙很懒，什么都没留下~</span>',
                '<span class="curr_key iconfont">&#xf00b2;</span>',
            '</a>',
        '</li>'
    ].join(''));
    var initFriend = function (data) {
        var $friend_list_box = $(".friend_list_box");
        friend.getUserFriend({
            page: 1,
            size: 50,
            success: function (data) {
                var _arr = [];
                for (var i in data.success.users) {
                    _arr.push(_friendItemHtml.render(data.success.users[i]));
                }
                $friend_list_box.find(".friend_list").empty().append(_arr.join(''));
            },
            error: function () {
                alert("服务器繁忙，还有列表获取失败！");
            }
        });
    };
    var init = function () {
        verification.addRule([
            {
                key: "sendUserEmpty",
                fun: function () {
                    return !!this.find(".send_user_item").length;
                }
            }, {
                key: "sendConEmpty",
                fun: function () {
                    return !!this.find(".send_msg_con").val().length;
                }
            }, {
                key: "sendConMax",
                fun: function (obj, key) {
                    return lib.getStrLength(obj.find(".send_msg_con").val()) <= (key - 0);
                }
            }
        ]);
        verification.setTipSkin('white1').setOffSet({
            top: 5,
            left: 10
        });
        initFriend();
        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            $curr_list = $page.find(".curr_list"),
            $friend_list = $page.find(".friend_list"), _countdown,
            $count = $page.find(".send_msg_con_box .count");
        var addUser = function (op) {
            verification.hideTips($curr_list.closest(".form_row"));
            $curr_list.append('<li class="send_user_item" data_id="' + op.userId + '" data_name="' + op.userName + '" data_img="' + (op.userImg || "") + '" data_signature="' + (op.userSignature || "") + '"><span class="ui_btn ui_btn_h22white7 receive_user_item" title="' + op.userName + '"><span class="ui_btn_txt">' + op.userName + '</span></span><a href="#" class="iconfont remove_user" data_id="' + op.userId + '">&#xf00b3;</a></li>');
        };
        $page.on("click", ".add_user_name", function () {
            var $this = $(this), thisRelyBox = $this.data("thisRelyBox");
            if (!thisRelyBox) {
                thisRelyBox = box.relyBox({
                    rely: $this,
                    boxId: "add_send_name",
                    content: '<div class="add_user_con" style="width: 196px;"><input style="padding: 5px;width: 180px;margin-bottom: 10px;clear: both;" id="txt_name"><span style="display: block;color: #333;float: left;">输入完毕，回车添加</span><a href="#" class="confirm" style="float: right;">确定</a></div>',
                    offset: {
                        top: -30
                    },
                    btns: [],
                    callback: function () {
                        var self = this,
                            $txt_name = self.wmBox.find("#txt_name");
                        this.close = this.hide;
                        $txt_name.focus();
                        this.wmBox.hover(function () { }, function () {
                            self.hide();
                        });
                        this.wmBox.on("click", ".confirm", function () {
                            var $txt_name = self.wmBox.find("#txt_name"),
                                _v = $.trim($txt_name.val());
                            if (_v) {
                                $txt_name.val('');
                                $txt_name.blur();
                                friend.getFriendData({
                                    data: {
                                        userName: _v
                                    },
                                    success: function (data) {
                                        if (data.success) {
                                            addUser({
                                                userName: data.success.userName,
                                                userId: data.success.userId
                                            });
                                        } else {
                                            var $err = $('<div class="error_mask">未查到用户！<a href="#" class="reinput">0秒后重新输入</a></div>');
                                            self.wmBox.find(".add_user_con").append($err);
                                            _countdown = lib.countdown({
                                                parent: $err,
                                                ele: ".reinput",
                                                countdownModel: '<a href="#" class="reinput">${i}秒后重新输入</a>',
                                                start: 5,
                                                endCallBack: function () {
                                                    self.wmBox.find(".error_mask").remove();
                                                    _countdown = null;
                                                    $txt_name.focus();
                                                }
                                            });
                                        }
                                    },
                                    error: function () {
                                        var $err = $('<div class="error_mask">未查到用户！<a href="#" class="reinput">0秒后重新输入</a></div>');
                                        self.wmBox.find(".add_user_con").append($err);
                                        _countdown = lib.countdown({
                                            parent: $err,
                                            ele: ".reinput",
                                            countdownModel: '<a href="#" class="reinput">${i}秒后重新输入</a>',
                                            start: 5,
                                            endCallBack: function () {
                                                self.wmBox.find(".error_mask").remove();
                                                _countdown = null;
                                                $txt_name.focus();
                                            }
                                        });
                                    }
                                });
                            }
                            return false;
                        });
                        this.wmBox.on("click", ".reinput", function () {
                            self.wmBox.find(".error_mask").remove();
                            clearInterval(_countdown);
                            _countdown = null;
                            $txt_name.focus();
                            return false;
                        });
                        $txt_name.on("keydown", function (e) {
                            if (e.keyCode === 13) {
                                self.wmBox.find(".confirm").click();
                            }
                        });
                    }
                });
                $this.data("thisRelyBox", thisRelyBox);
            }

            thisRelyBox.show();

            !thisRelyBox.wmBox.find(".error_mask").length && thisRelyBox.wmBox.find("#txt_name").focus();
            return false;
        });
        $page.on("click", ".friend_item:not(.curr)", function () {
            var $this = $(this),
                $clone;
            $this.addClass("curr");
            $clone = $this.clone();
            $clone.find("span").remove();
            $clone.css({
                position: 'absolute',
                top: $this.position().top + $this.outerHeight(),
                left: 0
            });
            $friend_list.after($clone);
            $clone.animate({
                top: -4,
                left: -90
            }, function () {
                $clone.fadeOut(function () {
                    $clone.remove();
                    $this.fadeOut(function () {
                        $this.remove();
                    });
                });
                addUser({
                    userId: $this.attr("data_id"),
                    userName: $this.attr("data_name"),
                    userImg: $this.find("img").attr("src"),
                    userSignature: $this.attr("data_signature")
                });
            });
            $clone.find("a").animate({
                width: 30,
                height: 30
            });
            return false;
        });
        $page.on("click", ".remove_user:not(.animate_in)", function () {
            var $this = $(this), $send_user_item = $this.closest(".send_user_item"),
                $friendItem, $clone;
            $this.addClass("animate_in");
            if ($send_user_item.attr("data_img")) {
                $friendItem = $(_friendItemHtml.render({
                    userId: $send_user_item.attr("data_id"),
                    userName: $send_user_item.attr("data_name"),
                    avatar: $send_user_item.attr("data_img"),
                    signature: $send_user_item.attr("data_signature")
                }));
                $clone = $friendItem.clone().css({
                    position: 'absolute',
                    top: -4,
                    left: -90
                });
                $clone.find("span").remove();
                $clone.animate({
                    top: 45,
                    left: 0
                }, function () {
                    $clone.remove();
                    $friendItem.css("visibility", "visible");
                });
                $friend_list.after($clone);
                $friendItem.css("visibility", "hidden");
                $friend_list.prepend($friendItem);
            }
            $send_user_item.fadeOut(function () {
                $send_user_item.remove();
            });
            return false;
        });
        $page.on("keyup", ".send_msg_con", function () {
            var $this = $(this), _length = lib.getStrLength($.trim($this.val()));
            verification.hideTips($this.closest(".form_row"));
            $count.empty().append(_length + "/300");
            if (_length < 300) {
                $count.css({
                    'color': '#666',
                    'font-weight': 500
                });
            } else {
                $count.css({
                    'color': '#e13436',
                    'font-weight': 700
                });
            }
        });
        $page.on("keydown", ".send_msg_con", function (e) {
            e.ctrlKey && e.keyCode === 13 && $page.find(".sned_btn").click();
        });
        $page.on("click", ".sned_btn:not(.send_in)", function () {
            var $this = $(this),
                $form_row = $this.closest(".form_row"),
                send_in, postData = {};
            if (verification.verify($this.closest(".sned_msg_box"))) {
                $this.replaceWith('<span class="sned_in_btn" title="快捷键 ctrl + Enter"><i class="iconfont">&#xf0165;</i>发送中......</span>');
                send_in = $form_row.data("send_in");
                if (!send_in) {
                    send_in = box.invBox({
                        boxId: "send_in_box",
                        content: '<div><p class="send_in_msg"><i class="iconfont">&#xf0165;</i>发送中......</p></div>'
                    });
                    $form_row.data("send_in", send_in);
                }
                send_in.setCon('<div><p class="send_in_msg"><i class="iconfont">&#xf0165;</i>发送中......</p></div>');
                send_in.show();
                postData.ids = [];
                $curr_list.find(".send_user_item").each(function () {
                    postData.ids.push($(this).attr("data_id"))
                });
                site_in_message.sends({
                    ids: postData.ids.join(''),
                    message: $page.find(".send_msg_con").val(),
                    success: function (data) {
                        send_in.setCon('<div class="countdown_parent" style="padding: 0 20px;"><p class="send_in_msg"><i class="iconfont" style="color: #0d9802;">&#xf00b2;</i>发送成功！<span class="countdown_link">0秒后关闭，<a href="#">跳转站内信列表</a></span></p></div>');
                        send_in.position();
                        lib.countdown({
                            parent: send_in.wmBox.find(".countdown_parent"),
                            ele: "#send_in_box .countdown_link",
                            countdownModel: '<span class="countdown_link">${i}秒后关闭，<a href="#">跳转站内信列表</a></span>',
                            start: 3,
                            endCallBack: function () {
                                window.location.reload();
                                //send_in.hide();
                                //$form_row.find(".sned_in_btn").replaceWith('<a href="#" class="sned_btn" title="快捷键 ctrl + Enter"><i class="iconfont">&#xf0165;</i>发送消息</a>');
                            }
                        });
                    },
                    error: function () {
                        send_in.setCon('<div class="countdown_parent"><p class="send_in_msg"><i class="iconfont">&#xf018c;</i>系统繁忙，请稍后再试！</p><a href="#" class="reload" style="margin: 0 0 0 60px;color: #999;">0秒后关闭</a></div>');
                        send_in.position();
                        lib.countdown({
                            parent: send_in.wmBox.find(".countdown_parent"),
                            ele: "#send_in_box .reload",
                            countdownModel: '<a href="#" class="reload" style="margin: 0 0 0 60px;color: #999;">${i}秒后关闭</a>',
                            start: 3,
                            endCallBack: function () {
                                send_in.hide();
                                $form_row.find(".sned_in_btn").replaceWith('<a href="#" class="sned_btn" title="快捷键 ctrl + Enter"><i class="iconfont">&#xf0165;</i>发送消息</a>');
                            }
                        });
                    }
                });
            }
            return false;
        });
        $page.on("click", ".curr,.animate_in,.send_in", function () {
            return false;
        });
    };
    init();
});