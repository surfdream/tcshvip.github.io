define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
		points_promotion = require("points_promotion"),
		box = require("wmbox"),
		juicer = require("juicer"),
		site_in_message = require("site_in_message"),
		friend = require("friend"),
		tips = require("wmtips"),
		page = require("wmpage"),
        lib = require("lib")
    ;

    var init = function () {
        var $page = $("#page"),
			$now_num = $page.find(".now_num"),
			$word_content = $page.find(".word_content"),
			$friends_list = $page.find(".friends_list"),
			$space_user_con = $page.find(".space_user_con")
        ;

        /*字数计算*/
        $word_content.keyup(check);

        function check() {
            var con = $word_content.val().length,
				i = 300
            ;
            if (con <= i) {
                $now_num.empty().append(con);
            }
            else {
                var maxnum = $word_content.val().substr(0, i);
                $word_content.val(maxnum);
            }
        };

        /*分页*/
        if (global_setting && global_setting.page && global_setting.page.totalcount) {
            var _page = page.Create({
                url: global_setting.page.url || domains.member + "/collect/markets",
                index: (global_setting.page.pageindex) || 1,
                size: (global_setting.page.pagesize) || 10,
                sum: (global_setting.page.totalcount) || 0,
                pagekey: "pageindex",
                front: true
            });
        }

        /*获取用户基础数据*/
        if ($space_user_con.length) {
            friend.getBaseData({
                userid: global_setting.friendid,
                success: function (data) {
                    var _arr = [], _arrTag = [];
                    if (data.success) {
                        _arr.push('<div class="space_user_img"><a href="#"><img src="' + data.success.img + '" /></a></div><div class="space_user_infor"><ul><li class="infor_item"><a href="#" class="user_name">' + data.success.name + '</a><span>' + data.success.msg + '</span></li><li class="infor_item"><span class="sex">性别：<em>' + data.success.sex + '</em></span><span class="cons">星座：<em>' + data.success.cons + '</em></span></li><li class="infor_item"><span class="Mytag">我的标签：</span></li></ul></div>');
                        for (var i in data.success.tag) {
                            _arrTag.push('<em>' + data.tag[i] + '</em>');
                        }
                        $space_user_con.empty().append(_arr.join(''));

                        $space_user_con.find(".Mytag").append(_arrTag.join(''));
                    }
                },
                error: function () {
                }
            });
        }

        /*获取好友列表*/
        if ($friends_list.length) {
            friend.getUserFriend({
                page: 1,
                size: 50,
                success: function (data) {
                    var arr = [];
                    for (var i in data.success.users) {
                        arr.push('<li class="friends_list_item"><a href="http://sns.tcsh.me/message/dialogue/cath?receiverId=' + data.success.users[i].userId + '" class="friends_infor"><img src="' + (data.success.users[i].avatar || "http://s.tcsh.me/tcsh/view/public/img/man_default.jpg") + '">' + data.success.users[i].userName + '</a></li>')
                    }

                    $friends_list.find("ul").empty().append(arr.join(''));
                },
                error: function () {
                    alert("服务器繁忙，好友列表获取失败！")
                }
            });
        }
        bind();
        /*好友列表*/
        $(window).scroll();
    }
    var bind = function () {
        var $page = $("#page"),
			$friends_list = $page.find(".friends_list"),
			$win = $(window),
            $word_content = $page.find(".word_content"),
            $msg_append_list = $page.find(".append_box")
        ;

        var save_bg = function (src) {
            $.ajax({
                url: domains.api2 + "/dialogue/set/sceneimg.json",
                dataType: "jsonp",
                data: {
                    img: encodeURIComponent(src)
                },
                success: function (data) {
                    if (data.success) {
                        alert("设置成功！");
                        window.location.reload();
                    } else {
                        alert(data.error || "服务器繁忙！请稍候再试");
                    }
                },
                error: function () {
                    alert("服务器繁忙！请稍候再试")
                }

            });
        };
        /*发送站内信*/
		$page.on("keydown",".word_content",function(e){
			e.ctrlKey && e.keyCode === 13 && $page.find(".send_msg").click(); 	
		});
        $page.on("click", ".send_msg", function () {
            var _word_content = $.trim($word_content.val());
            if (_word_content) {
                site_in_message.send({
                    sceneId: global_setting.sceneId,
                    message: encodeURIComponent(_word_content),
                    success: function (data) {
                        if (data.success) {
                            $msg_append_list.prepend([
                            '<li class="talkitme talk_list_right clearfix" data_id="' + data.success + '">',
                                '<div class="user_img">',
                                    '<a href="#"><img src="' + global_setting.avatar + '" /></a>',
                                '</div>',
                                '<div class="talk_box">',
                                    '<span class="arrow allow1"></span>',
                                    '<a href="#" class="talk_del wm_ico fork9"></a>',
                                    '<div class="talk_box1">',
                                        '<div class="talk_box2">',
                                            '<div class="talk_box3">',
                                                '<div class="talk_box4">' + _word_content + '</div>',
                                            '</div>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</li>'
                            ].join(''));
                            $word_content.val('');
                        } else {
                            alert(data.error || "系统繁忙，请稍后再试")
                        }
                    },
                    error: function () {
                        alert("系统繁忙，请稍后再试");
                    }
                });
            } else {
                lib.BGShine({
                    ele: $word_content,
                    original_color: "#fff",
                    change_color: "#ff6363",
                    frequency: 3
                });
            }
            return false;
        });

        /*屏蔽*/
        $page.on("click", ".infor_item_con", function () {
            var $this = $(this);
            if ($this.hasClass("infor_item_conCur")) {
                friend.cancelShieldSIM({
					friendId:global_setting.friendid,
                    success: function () {
						$this.removeClass("infor_item_conCur");
                		$this.find(".shield_txt").text("屏蔽此人");
                    },
                    error: function () {
                        alert("系统繁忙，请稍后再试！");
                    }
                });
            } else {
                friend.shieldSIM({
					friendId:global_setting.friendid,
                    success: function () {
						$this.addClass("infor_item_conCur");
						$this.find(".shield_txt").text("取消屏蔽");
                    },
                    error: function () {
                        alert("系统繁忙，请稍后再试！");
                    }
                });
            }

        });

        $win.scroll(function () {
            var $friends_list = $page.find(".friends_list"),
				$letter = $page.find(".letter"),
				$body = $("body"),
				_leftWidth = $letter.offset().left,
				_width = $letter.outerWidth(true),
				_top = $letter.offset().top,
				scrollTop = $body[0].scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0
            ;

            if (scrollTop < _top) {
                $friends_list.css({
                    "left": _leftWidth + _width,
                    "top": _top - scrollTop,
                    "display": "block"
                });
            } else {
                $friends_list.css({
                    "left": _leftWidth + _width,
                    "top": "33px",
                    "display": "block"
                });
            }
        });
        $win.resize(function () {
            $win.scroll()
        });
        /*删除某人聊天记录*/
        $page.on("click", ".delete", function () {
            site_in_message.delAll({
                sceneId: global_setting.sceneId,
                success: function (data) {
                    if (data.success) {
                        alert("删除成功！");
                        window.location.reload();
                    } else {
                        alert(data.error || "服务器繁忙！请稍后再试");
                    }
                },
                error: function () {
                    alert("服务器繁忙！请稍后再试");
                }
            });
            return false;
        });
        //删除单挑信息
        $page.on("click", ".talk_del", function () {
            var $this = $(this), $talkitem = $this.closest(".talkitme");
            site_in_message.delSingle({
                id: $talkitem.attr("data_id"),
                success: function (data) {
                    if (data.success) {
                        $talkitem.fadeOut(function () {
                            $talkitem.remove();
                        });
                    } else {
                        alert(data.error || "服务器繁忙，请稍后再试");
                    }
                },
                error: function () {
                    alert("服务器繁忙，请稍后再试");
                }
            });
            return false;
        });
        var chatBgHtml = juicer([
			'<div class="bg_content">',
				'{@each data_list as item}',
				'<div class="bg_content_item">',
					'<p class="bg_name" data_themeId="${item.id}">${item.name}</p>',
					'{@each item.subList as list}',
					'<a href="#" data_id="${list.id}" class="{@if list.id===currId}a_current {@/if}"><img src="${list.imgurl}" /></a>',
					'{@/each}',
				'</div>',
				'{@/each}',
			'</div>'
        ].join(''));
        /*设置背景图片*/
        var _Box = function (data) {
            box.alert({
                titleText: '选择背景图片',
                content: chatBgHtml.render(data),
                callback: function () {
                    var self = this;
                    this.wmBox.find(".bg_content").on("click", "a", function () {
                        var $this = $(this);
                        self.wmBox.find(".bg_content a").removeClass("a_current");
                        $this.addClass("a_current");
                    });
                    this.wmBox.find(".bg_content").on("dblclick", "a", function change() {
                        var $this = $(this),
                            _src = $this.find("img").attr("src")
                        ;
                        $this.addClass("a_current");
                        save_bg(encodeURIComponent(_src));
                        self.close();
                        return false;
                    });

                },
                btns: [
                    {
                        cls: "ui_btn_h27red9",
                        text: "确定",
                        callback: function () {
                            var self = this,
                                $a_current = self.wmBox.find(".a_current"),
                                $this = self.wmBox.find(".ui_btn_h27red9"),
                                _thisTips = $this.data("thisTips")
                            ;
                            if ($a_current.length) {
                                var _src = $a_current.find("img").attr("src");
                                save_bg(encodeURIComponent(_src));
                            } else {
                                if (!_thisTips) {
                                    _thisTips = new tips({
                                        ele: $this,
                                        con: "请先选择",
                                        skin: 'white1',
                                        direction: "rc",
                                        close: 2000,
                                        minIndex: 10003
                                    });
                                    $this.data("thisTips", _thisTips);
                                }
                                _thisTips.show();
                                return false;
                            }
                            this.close();
                        }
                    }

                ]
            });
        }
        $page.on("click", ".set_bg", function () {

            $.ajax({
                url: domains.api2 + "/dialogue/sceneimg.json",
                dataType: "jsonp",
                success: function (data) {

                    _Box(data);

                },
                error: function () {
                    var data = {
                        currId: "012",
                        data_list: [
							{
							    id: "1",
							    name: "可爱风",
							    subList: [
									{
									    imgurl: "http://s.tcsh.me/tcsh/view/buyers/message_tree/img/bg1.jpg",
									    id: "12"
									},
									{
									    imgurl: "http://s.tcsh.me/tcsh/view/buyers/message_tree/img/title-bg-female.jpg",
									    id: "012"
									},
									{
									    imgurl: "http://s.tcsh.me/tcsh/view/buyers/message_tree/img/bg1.jpg",
									    id: "12"
									},
									{
									    imgurl: "http://s.tcsh.me/tcsh/view/buyers/message_tree/img/title-bg-female.jpg",
									    id: "112"
									}
							    ]
							},
							{
							    id: "2",
							    name: "可爱风",
							    subList: [
									{
									    imgurl: "http://s.tcsh.me/tcsh/view/buyers/message_tree/img/bg2.jpg",
									    id: "12"
									},
									{
									    imgurl: "http://s.tcsh.me/tcsh/view/buyers/message_tree/img/bg1.jpg",
									    id: "13"
									}
							    ]
							},
							{
							    id: "3",
							    name: "可爱风",
							    subList: [
									{
									    imgurl: "http://s.tcsh.me/tcsh/view/buyers/message_tree/img/bg2.jpg",
									    id: "12"
									},
									{
									    imgurl: "http://s.tcsh.me/tcsh/view/buyers/message_tree/img/bg2.jpg",
									    id: "23"
									}
							    ]
							}
                        ]
                    };
                }

            });

        });
    }
    init();
});