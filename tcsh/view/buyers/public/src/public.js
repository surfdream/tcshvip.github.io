define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        tips = require("http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js"),
        loginBox = require("http://s.tcsh.me/tcsh/model/wmloginbox/dist/wmloginbox.js"),
        top_data = require("http://s.tcsh.me/tcsh/view/ago/public/wm_top_data/dist/top_data.js"),
        lib = require("http://s.tcsh.me/tcsh/model/lib/dist/lib.js"),
		compatible = require('http://s.tcsh.me/tcsh/model/wmcompatible/dist/wmcompatible.js');
    require('http://s.tcsh.me/tcsh/view/ago/public/wm_top_data/css/style.css#');
    var init = function () {
        var $page = $("#page"), _setInterval;
        //var getUserData = function (callback) {
        //    $.ajax({
        //        url: domains.i+"/asyn/user/profile",
        //        dataType: "jsonp",
        //        timeout:1000,
        //        type: "get",
        //        success: function (data) {
        //            if (data.response) {
        //                typeof callback === "function" && callback(data);
        //            }
        //        },
        //        error: function () {
        //            typeof callback === "function" && callback();
        //        }
        //    });
        //};
        var tracknick = lib.cookie("wm.user.username");
        if (tracknick) {
            $(".head_top .user_data").replaceWith('<div class="user_data"><span>欢迎加入同城生活：</span><a href="' + domains.member + '" style="color: #b10000">' + tracknick + '</a><a href="' + domains.account + '/logout" style="color: #b10000; margin-left: 10px; font-family: SimSun">[退出]</a></div>');
        }
        $(".shopping_cart_entrance").next("b").empty().append(lib.cookie("wm.user.cart_count") || 0);
        //getUserData(function (data) {
        //    return false;
        //    var $head_top = $page.find(".head_top");
        //    $head_top.replaceWith([
        //        '<div class="head_top">',
        //            '<div class="head_top_bb1f">',
        //                '<div class="sub_head_top">',
        //                    '<div class="user_data">',
        //                        '<a href="'+domains.member+'" class="user_data_name">' + data.response.UserName + '<span class="iconfont">&#xf0005;</span></a>',
        //                        '<div class="user_data_ka">',
        //                            '<!--<a href="'+domains.member+'" class="user_data_name">' + data.response.UserName + '<span class="iconfont">&#xf0004;</span></a>-->',
        //                            '<a href="'+domains.member+'/userdata/Profile" class="udk_user_img" title="' + data.response.UserName + '"><span class="udk_user_img_bg">',
        //                                '<img src="' + data.response.Avatar + '" class="user_img"></span></a>',
        //                            '<ul class="user_data_list">',
        //                                '<li class="ka_op"><a href="#">账号管理</a><a href="#">退出</a></li>',
        //                                '<li>注册于：1989-06-06</li>',
        //                                '<li>本月积分：<b>999</b></li>',
        //                                '<li>累积积分：<b>99999999</b></li>',
        //                            '</ul>',
        //                        '</div>',
        //                    '</div>',
        //                    '<div class="pull_btns user_msg">',
        //                        '<a href="#" class="idea">消息树</a><span class="iconfont">&#xf0005;</span>',
        //                        '<ul class="pull_list">',
        //                            '<li><a href="#" class="pull_link">消息树</a><span class="iconfont">&#xf0004;</span></li>',
        //                            '<li><a href="#" class="pull_link">比价提醒</a></li>',
        //                            '<li><a href="#" class="pull_link">物流变化</a></li>',
        //                            '<li><a href="#" class="pull_link">站内信</a></li>',
        //                        '</ul>',
        //                    '</div>',
        //                    '<a href="#" class="top_data_item">积分<b href="#">999</b></a>',
        //                    '<a href="#" class="top_data_item">No.<b href="#">999</b></a>',
        //                    '<a href="#" class="top_data_item registration"><b class="iconfont">&#xf01f9;</b>今日签到</a>',
        //                    '<div class="class_list">',
        //                        '<a href="#" class="idea">分类导航<span class="iconfont">&#xf0005;</span></a>',
        //                        '<ul class="class_list_main">',
        //                            '<li>',
        //                                '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
        //                            '<li>',
        //                                '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
        //                            '<li>',
        //                                '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
        //                            '<li>',
        //                                '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
        //                            '<li>',
        //                                '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
        //                            '<li>',
        //                                '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
        //                            '<li>',
        //                                '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
        //                        '</ul>',
        //                    '</div>',
        //                    '<div class="pull_btns">',
        //                        '<a href="#" class="idea">收藏夹<span class="pull_arrow "><em>◆</em><span>◆</span></span></a>',
        //                        '<ul class="pull_list">',
        //                            '<li>',
        //                                '<a href="#" class="pull_link">收藏夹</a><span class="pull_arrow "><em>◆</em><span>◆</span></span>',
        //                            '</li>',
        //                            '<li>',
        //                                '<a href="#" class="pull_link">收藏的店铺</a>',
        //                            '</li>',
        //                            '<li>',
        //                                '<a href="#" class="pull_link">收藏的商品</a>',
        //                            '</li>',
        //                        '</ul>',
        //                    '</div>',
        //                    '<div class="pull_btns">',
        //                        '<a href="#" class="idea">我的同城生活<span class="pull_arrow "><em>◆</em><span>◆</span></span></a>',
        //                        '<ul class="pull_list">',
        //                            '<li>',
        //                                '<a href="#" class="pull_link">我的同城生活</a><span class="pull_arrow "><em>◆</em><span>◆</span></span>',
        //                            '</li>',
        //                            '<li>',
        //                                '<a href="#" class="pull_link">已买到的商品</a>',
        //                            '</li>',
        //                            '<li>',
        //                                '<a href="#" class="pull_link">我的足迹</a>',
        //                            '</li>',
        //                            '<li>',
        //                                '<a href="#" class="pull_link">店铺新品</a>',
        //                            '</li>',
        //                            '<li>',
        //                                '<a href="#" class="pull_link">优惠提示</a>',
        //                            '</li>',
        //                        '</ul>',
        //                    '</div>',
        //                    '<div class="link_list">',
        //                        '<a href='+domains.www+'>同城生活首页</a><em>|</em>',
        //                        '<a href="#">购物车</a><b>9</b>',
        //                    '</div>',
        //                '</div>',
        //            '</div>',
        //        '</div>'
        //    ].join(''));
        //    //买家title
        //    //var buyLvTitle = {
        //    //    '0': "初级买手",
        //    //    '1': "1级买手",
        //    //    '2': "2级买手",
        //    //    '3': "3级买手"
        //    //};
        //    //$user_data.append('<img src="http://s.tcsh.me/tcsh/view/public/img/LVIMGV1/vip' + data.response.Level + '.png" title="' + buyLvTitle[data.response.Level] + '" style="vertical-align: middle; margin: 0 10px" />');
        //    //$user_data.append('<a href="'+domains.i+'/letter/view" style="color:#535353;margin-left: 10px;">站内信</a><b style="font-weight: 500;color: #e13436;padding: 0 5px;font-family: SimSun;">' + data.response.NotificationCount + '</b>')
        //});
        top_data();
        bind();
        //每11分钟，检测登录,存在不检测登录的页面（做了特殊的登录检测）直接取消计时器
        _setInterval = setInterval(function () {
            if (global_setting && global_setting.no_v_login) {
                clearInterval(_setInterval);
                return false;
            }
            lib.verificationLogin(0, function () {
                clearInterval(_setInterval);
                loginBox(function () {
                    this.close = this.hide = function () {
                        window.document.location.href = window.document.location.href;
                    }
                });
            });
        }, 605000);
		compatible.placeholder();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ".registration", function () {
            var $this = $(this), errorTips = $this.data("errorTips");
            if (!errorTips) {
                errorTips = new tips({
                    ele: $this,
                    con: '<p>谢谢您的关注！<br>签到功能还在开发中，不要心急哦！</p>',
                    close: 2000,
                    direction: 'tc',
                    offset: {
                        top: -5
                    }
                });
            }
            errorTips.show();
            return false;
        });
		 /*下拉导航*/
		$page.find(".buyer_nav_list").hover(function(){
			
			var $this = $(this);
			
			$this.find(".buyer_nav_con").addClass("buyer_nav_con_hover");
				
		},function(){
			
			var $this = $(this);
			
			$this.find(".buyer_nav_con").removeClass("buyer_nav_con_hover");
			
		});
		
		/*店铺，宝贝  切换选择*/
		$page.find(".buyer_hover").hover(function(){
			var $this = $(this),
				$a_kinds_bg = $this.find(".a_kinds_bg")
			;	
			
			$this.addClass("search_kinds_show");
			
			$this.find(".search_kinds_list").addClass("search_kinds_list_bg");
			
			$a_kinds_bg.children("a").addClass("a_kinds_bg_hover");
			
			/*点击选择后，放置最前   显示*/
			$a_kinds_bg.on("click",function(){
				var $self = $(this);
				$(".search_kinds_list").prepend($self);
				
			});
		},function(){
			var $this = $(this),
				$a_kinds_bg = $this.find(".a_kinds_bg")
			;
			/*鼠标移开时*/
			
			/*选项父对象多余隐藏*/
			$this.removeClass("search_kinds_show");
			
			$this.find(".search_kinds_list").removeClass("search_kinds_list_bg");
			
			$a_kinds_bg.children("a").removeClass("a_kinds_bg_hover");
		});	
        if ($.browser.msie && $.browser.version === "6.0") {
            $page.find(".btn_list").hover(function () {
                $(this).addClass("btn_list_hover");
            }, function () {
                $(this).removeClass("btn_list_hover");
            });
            $page.find(".hover_show_down_list").hover(function () {
                $(this).addClass("hover_show_down_list_hover");
            }, function () {
                $(this).removeClass("hover_show_down_list_hover");
            });
        }
    };
    init();
    //lib.cookie("tracknick", "chaiyining007");

});
