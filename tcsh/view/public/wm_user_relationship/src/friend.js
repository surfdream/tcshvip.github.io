//用户交互
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
        juicer = require('http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js'),
        page = require('http://s.tcsh.me/tcsh/model/wmpage/dist/wmpage.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    require('../css/style.css#');
    // 好友弹窗HTML
    var friendsHtml = [
        '<div class="friends_box_main">',
            '<div class="friends_list"></div>',
            '<div class="wm_page"></div>',
            '<div class="save_btns"><a href="#" class="sure_btn">确定</a></div>',
        '</div>'
    ].join('');
    var bufferHtml = juicer([
        '{@each success.users as list}',
        '<a href="#" class="friends_item" data_id="${list.userId}" data_name="${list.userName}"><img src="${list.avatar}" /><span class="user_name">${list.userName}</span><span class="wm_ico hook12 dis_none"></span></a>',
        '{@/each}',
    ].join(''));
	
	// 关注
	_focus = function(op){ 
		$.ajax({
			url:domains.sns+"/friends/friend/attention",
			type:"get",
			dataType:"jsonp",
			data:{
				attentionId:op.focus_id,
				groupId:0
			},
			success:function(data){
				typeof op.success === "function" && op.success(data);
			},
			error:function(){
				typeof op.error === "function" && op.error();
			}
		});
	};
	
	// 取消关注
	_delFocus = function(op){
		$.ajax({
			url:domains.sns+"/friends/friend/cancel",
			type:"get",
			dataType:"jsonp",
			data:{
				ids:JSON.stringify(op.ids)   // 数组
			},
			success:function(data){
				typeof op.success === "function" && op.success(data);
			},
			error:function(){
				typeof op.error === "function" && op.error();
			}
		});	
	};
	
    //获取用户基础数据
    var _getBaseData = function (op) {
        $.ajax({
            url: domains.api2 + '/dialogue/firends/info.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                userId: op.userid
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //屏蔽用户的站内信
    _shieldSIM = function (op) {
        $.ajax({
            url: domains.api2 + '/my/shield/add.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                friendId: op.friendId
            },
            timeout: 5000,
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
	//取消屏蔽用户的站内信
    _cancelShieldSIM = function (op) {
        $.ajax({
            url: domains.api2 + '/my/shield/cancel.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                friendId: op.friendId
            },
            timeout: 5000,
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //获取用户好友
    _getUserFriend = function (op) {
        $.ajax({
            url: domains.api2 + "/friends/invite.json",
            type: "get",
            dataType: "jsonp",
            data: {
                page: op.page || 1,
                size: op.size || 50
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //好友弹窗功能模块
    _userFriendBox = function (op) {
        var blist = {}, click_list = {}
        ;
        return box.alert({
            boxCls: op.boxCls + " wm_friends_box",
            titleText: op.titleText || "好友列表",
            content: friendsHtml,
            btns: [],
            callback: function () {
                var self = this,
                    $friendsBox = this.wmBox.find(".friends_box_main"),
                    $friends_list = $friendsBox.find(".friends_list")
                ;
                _getUserFriend({
                    data: {
                        size: 5,
                        page: "1"
                    },
                    success: function (data) {
                        if (data.success && data.success.totalcount) {

                            blist["1"] = data;
                            // 插入内容
                            $friends_list.empty().append(bufferHtml.render(data));
                            self.position(); // 插入内容后重新定位

                            // 异步分页
                            var _page = page.Create({
                                url: domains.api2 + "/friends/invite.json",
                                async: true,
                                size: 5,
                                index: data.success.page,
                                sum: data.success.totalcount,
                                pagekey: "page",
                                dataType: "jsonp",
                                front: true,
                                param: {
                                    size: 5,
                                    totalcount: data.success.totalcount
                                },
                                ajaxAgo: function (data) {
                                    if (blist[data.index]) {
                                        $friends_list.empty().append(bufferHtml.render(blist[data.index]));
                                        $friends_list.find(".friends_item").each(function () {
                                            var _this = $(this);
                                            if (click_list[_this.attr("data_id")]) {
                                                _this.addClass("friends_item_click");
                                            };
                                        });
                                        _page.setIndex(data.index);
                                        return false;
                                    } else {
                                        return true;
                                    };
                                },
                                success: function (data) {
                                    $friends_list.empty().append(bufferHtml.render(data));
                                    _page.setIndex(this.index);
                                    blist[data.success.page] = data;
                                },
                                error: function () {
                                    alert("系统繁忙，请稍后再试！");
                                }
                            });
                        }
                    },
                    error: function () {
                        alert("系统繁忙，请稍后再试！");
                    }
                });
                this.close = this.hide;
                // 选择好友 并 储存
                this.wmBox.on("click", ".friends_item", function () {
                    var $this = $(this);
                    $this.toggleClass("friends_item_click");

                    if ($this.hasClass("friends_item_click")) {
                        click_list[$this.attr("data_id")] = {
                            id: $this.attr("data_id"),
                            name: $this.attr("data_name")
                        };
                    } else {
                        click_list[$this.attr("data_id")] = 0;
                    }
                    return false;
                });
                // 确定
                this.wmBox.on("click", ".sure_btn", function () {
                    var $this = $(this),
                        $item = $friendsBox.find(".friends_item"),
                        friendsData = {
                            dataList: [],
                            ids: [],
                            names: []
                        }
                    ;
                    // 遍历获取userid
                    for (var i in click_list) {
                        if (click_list[i]) {
                            friendsData.dataList.push({
                                id: click_list[i].id,
                                name: click_list[i].name
                            });
                            friendsData.ids.push(click_list[i].id);
                            friendsData.names.push(click_list[i].name);
                        }
                    };
                    typeof op.sure === "function" && op.sure.call(self, friendsData);
                    return false;
                });
            }
        });
    },
    //获取推荐用户
    _getNBUser = function (op) {
        $.ajax({
            url: "",
            type: "get",
            dataType: "jsonp",
            data: {},
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //获取用户数据
    _getFriendData = function (op) {
        $.ajax({
            url: domains.api2 + "/get/user_by_name.json",
            type: "get",
            dataType: "jsonp",
            data: op.data,
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //发送心情
    _sendMood = function (op) {
        $.ajax({
            url: domains.profile + "/user/mood/add",
            type: "get",
            dataType: "jsonp",
            data: {
                mood: encodeURIComponent(op.mood)
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //获取用户心情列表
    _getUserMoodList = function (op) {
        $.ajax({
            url: domains.profile + "/user/mood/get",
            type: "get",
            dataType: "jsonp",
            data: {},
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //获取所有用户心情列表
    _getAllMoodList = function (op) {
        $.ajax({
            url: "",
            type: "get",
            dataType: "jsonp",
            data: {},
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    }
    ;
    /*************** 以下都是API  ***********************/
	// 关注好友
	exports.focusFriend = function(op){
		lib.verificationLogin(function(){
			_focus(op);
		});	
	};
	// 取消关注好友
	exports.delFocusFriend = function(op){
		lib.verificationLogin(function(){
			_delFocus(op);
		});	
	};
    //获取基础数据
    exports.getBaseData = function (op) {
        lib.verificationLogin(function () {
            _getBaseData(op);
        });
    };
    //屏蔽用户的站内信
    exports.shieldSIM = function (op) {
        lib.verificationLogin(function () {
            _shieldSIM(op);
        });
    };
    //取消屏蔽用户的站内信
    exports.cancelShieldSIM = function (op) {
        lib.verificationLogin(function () {
            _cancelShieldSIM(op);
        });
    };
    //获取好友列表
    exports.getUserFriend = function (op) {
        lib.verificationLogin(function () {
            _getUserFriend(op);
        });
    };
    //获取推荐用户
    exports.getNBUser = function (op) {
        _getNBUser(op);
    };
    //获取用户信息
    exports.getFriendData = function (op) {
        lib.verificationLogin(function () {
            _getFriendData(op);
        });
    };
    //发送心情
    exports.sendMood = function (op) {
        lib.verificationLogin(function () {
            _sendMood(op);
        });
    };
    //获取用户心情列表
    exports.getUserMoodList = function (op) {
        lib.verificationLogin(function () {
            _getUserMoodList(op);
        });
    };
	
    /****************** 以下都是功能模块 ***************************/

    exports.userFriendBox = function (op) {
        return _userFriendBox(op);
    };
});
