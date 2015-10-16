define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        lib = require("http://s.tcsh.me/tcsh/model/lib/dist/lib.js"),
        tips = require("http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js");
    require('http://s.tcsh.me/tcsh/view/public/font-face/css/font-face.css#')
    require('../css/style.css#');
    return function () {
        var $page = $("#page");
        var role = lib.getRole() || { key: "0" },//角色，1 = 买家，2 = 卖家，3 = 买家+卖家(测试用，正常数据不会有)，4 = 管理员， 8 = 运营
            tracknick = lib.cookie("wm.user.username"),
            $head_top = $page.find(".head_top");
        var getUserData = function (callback, error) {
            $.ajax({
                url:domains.i+ "/asyn/user/profile",
                dataType: "jsonp",
                type: "get",
                success: function (data) {
                    if (data.response) {
                        typeof callback === "function" && callback(data);
                    }
                },
                error: function () {
                    typeof error === "function" && error();
                }
            });
        };
        var _replaceWith0 = function (data) {
            $head_top.replaceWith([
                    '<div class="head_top"><div class="head_top_bb1f"><div class="sub_head_top">',
                        '<div class="user_login">',
                            '<span>欢迎加入同城生活：</span>',
                            '<a href="' + domains.account + '/login">登录</a>',
                            '<em>|</em>',
                            '<a href="'+domains.account+'/register">免费注册</a>',
                        '</div>',
                        '<div class="pull_btns w115 followwm">',
                            '<a href="#" class="idea w115"><i class="wm_ico heart1"></i>关注同城生活<span class="pull_arrow "><em>◆</em><span>◆</span></span></a>',
                            '<ul class="pull_list w115">',
                                '<li><a href="#" class="pull_link"><i class="wm_ico heart1"></i>关注同城生活</a><span class="pull_arrow "><em>◆</em><span>◆</span></span></li>',
                                '<li><a  href="http://weibo.com/2358731552/profile?topnav=1&wvr=5&from=company&user=1" target="_blank" class="pull_link"><i class="social_icon sina_wb"></i>新浪微博</a></li>',
                                '<li><a href="http://t.qq.com/wum2429503881?pgv_ref=im.perinfo.perinfo.icon" target="_blank" class="pull_link"><i class="social_icon tx_wb"></i>腾讯微博</a></li>',
                                '<li><a href="http://t.163.com/8522205239" target="_blank" class="pull_link"><i class="social_icon netease"></i>网易微博</a></li>',
                                '<li><a href="#" class="pull_link"><i class="social_icon wumeibang"></i>同城生活帮</a></li>',
                            '</ul>',
                        '</div>',
                        '<div class="pull_btns theme_marketplace">',
                            '<a href="#" class="idea">专场推荐<span class="pull_arrow "><em>◆</em><span>◆</span></span></a>',
                            '<ul class="pull_list">',
                                '<li><a href="#" class="pull_link">专场推荐</a><span class="pull_arrow "><em>◆</em><span>◆</span></span></li>',
                                '<li><a href="#" class="pull_link">家纺专场</a></li>',
                                '<li><a href="#" class="pull_link">户外专场</a></li>',
                                '<li><a href="#" class="pull_link">成人专场</a></li>',
                                '<li><a href="#" class="pull_link">母婴专场</a></li>',
                                '<li><a href="#" class="pull_link">婚庆专场</a></li>',
                            '</ul>',
                        '</div>',
                        '<div class="link_list">',
                            '<a href="http://s.tcsh.me/wmactivity/merchants_v1/index.html" target="_blank">招商启事</a><em>|</em><a href="#" class="add_favorite">收藏本站</a><em>|</em><a href="http://help.wumeiwang.com/wmmode.html">帮助中心</a>',
                        '</div>',
                    '</div></div></div>'
            ].join(''));
        };
        var _replaceWith1 = function (data) {
            $head_top.replaceWith([
                    '<div class="head_top">',
                        '<div class="head_top_bb1f">',
                            '<div class="sub_head_top">',
                                '<div class="user_data">',
                                    '<a href="' + domains.member + '" class="user_data_name">' + data.response.UserName + '<span class="iconfont">&#xf0005;</span></a>',
                                    '<div class="user_data_ka">',
                                        '<!--<a href="' + domains.member + '" class="user_data_name">' + data.response.UserName + '<span class="iconfont">&#xf0004;</span></a>-->',
                                        '<a href="' + domains.member + '/userdata/Profile" class="udk_user_img" title="' + data.response.UserName + '"><span class="udk_user_img_bg">',
                                            '<img src="' + data.response.Avatar + '" class="user_img"></span></a>',
                                        '<ul class="user_data_list">',
                                            '<li class="ka_op"><a href="' + domains.member + '/userdata/Profile">账号管理</a><a href="' + domains.account + '/logout">退出</a></li>',
                                            '<li>注册于：' + data.response.RegTime + '</li>',
                                            '<li>本月积分：<b>' + data.response.Point.MonthPoint + '</b></li>',
                                            '<li>累积积分：<b>' + data.response.Point.TotalPoint + '</b></li>',
                                        '</ul>',
                                    '</div>',
                                '</div>',
                                '<div class="pull_btns user_msg">',
                                    '<a href="#" class="idea">消息树</a><span class="iconfont">&#xf0005;</span>',
                                    '<ul class="pull_list">',
                                        '<li><a href="#" class="pull_link">消息树</a><span class="iconfont">&#xf0004;</span></li>',
                                        '<li><a href="#" class="pull_link">比价提醒</a></li>',
                                        '<li><a href="#" class="pull_link">物流变化</a></li>',
                                        '<li><a href="#" class="pull_link">站内信</a></li>',
                                    '</ul>',
                                '</div>',
                                '<a href="#" class="top_data_item">积分<b href="#">' + data.response.Point.TotalPoint + '</b></a>',
                                '<a href="#" class="top_data_item">' + (data.response.Point.PointRank ? 'No.<b href="#">' + data.response.Point.PointRank + '</b>' : 'No.<b href="#">1000以外</b>') + '</a>',
                                '<a href="#" class="top_data_item registration"><b class="iconfont">&#xf01f9;</b>今日签到</a>',
                                '<div class="class_list">',
                                    '<a href="#" class="idea">分类导航<span class="iconfont">&#xf0005;</span></a>',
                                    '<ul class="class_list_main">',
                                    //    '<li>',
                                    //        '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
                                    //    '<li>',
                                    //        '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
                                    //    '<li>',
                                    //        '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
                                    //    '<li>',
                                    //        '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
                                    //    '<li>',
                                    //        '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
                                    //    '<li>',
                                    //        '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
                                    //    '<li>',
                                    //        '<img src="http://img.wumeiwang.com/M00/00/5D/rBAA_lMNTyeALkn6AAAI0kqtW8g217.jpg" /><a href="#">服饰箱包</a></li>',
                                    //'</ul>',
                                '</div>',
                                '<div class="pull_btns">',
                                    '<a href="'+domains.www+'/sell/favorite/page0" class="idea" target="_blank">收藏夹<span class="pull_arrow "><em>◆</em><span>◆</span></span></a>',
                                    '<ul class="pull_list">',
                                        '<li>',
                                            '<a href="' + domains.www + '/sell/favorite/page0" class="pull_link" target="_blank">收藏夹</a><span class="pull_arrow "><em>◆</em><span>◆</span></span>',
                                        '</li>',
                                        '<li>',
                                            '<a href="' + domains.www + '/sell/favorite/page1" class="pull_link" target="_blank">收藏的店铺</a>',
                                        '</li>',
                                        '<li>',
                                            '<a href="' + domains.www + '/sell/favorite/page0" class="pull_link" target="_blank">收藏的商品</a>',
                                        '</li>',
                                    '</ul>',
                                '</div>',
                                '<div class="pull_btns">',
                                    '<a href="#" class="idea">我的同城生活<span class="pull_arrow "><em>◆</em><span>◆</span></span></a>',
                                    '<ul class="pull_list">',
                                        '<li>',
                                            '<a href="#" class="pull_link">我的同城生活</a><span class="pull_arrow "><em>◆</em><span>◆</span></span>',
                                        '</li>',
                                        '<li>',
                                            '<a href="' + domains.order + '/orders/myorders" class="pull_link">已买到的商品</a>',
                                        '</li>',
                                        '<li>',
                                            '<a href="#" class="pull_link">我的足迹</a>',
                                        '</li>',
                                        '<li>',
                                            '<a href="#" class="pull_link">店铺新品</a>',
                                        '</li>',
                                        '<li>',
                                            '<a href="#" class="pull_link">优惠提示</a>',
                                        '</li>',
                                    '</ul>',
                                '</div>',
                                '<div class="link_list">',
                                    '<a href="' + domains.www + '">同城生活首页</a><em>|</em>',
                                    '<a href="' + domains.cart + '/cart/list" class="shopping_cart_entrance">购物车</a><b>' + (lib.cookie("wm.user.cart_count") || 0) + '</b>',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>'
            ].join(''));
        };
        //卖家title
        var busLvTitle = {
            '0': "初级商家",
            '1': "1级商家",
            '2': "2级商家",
            '3': "3级商家"
        },
        //买家title
         buyLvTitle = {
             '0': "初级买手",
             '1': "1级买手",
             '2': "2级买手",
             '3': "3级买手"
         };
        switch (role.key) {
            case "0":
                lib.removeCookie("user_top_data");
                _replaceWith0();
                break;
            case "1":
                getUserData(function (data) {
                    lib.cookie("user_top_data", JSON.stringify(data));
                    _replaceWith1(data);
                    $.ajax({
                        url: domains.api+"/category",
                        type: "get",
                        dataType: "jsonp",
                        success: function (data) {
                            var _arr = [];
                            for (var i in data.data_list) {
                                _arr.push('<li><img src="' + data.data_list[i].ico + '" /><a href="#">' + data.data_list[i].name + '</a></li><li>');
                            }
                            $page.find(".class_list_main").empty().append(_arr.join(''));
                        }, error: function () {

                        }
                    });
                }, function () {
                    if (lib.cookie("user_top_data")) {
                        _replaceWith1(JSON.parse(lib.cookie("user_top_data")));
                    }
                    else {
                        _replaceWith0();
                    }
                });
                break;
            case "2":
                lib.removeCookie("user_top_data");
                $head_top.replaceWith([
                   '<div class="head_top"><div class="head_top_bb1f"><div class="sub_head_top">',
                       '<div class="user_data">',
                           '<span>欢迎加入同城生活：</span>',
                           '<a href="' + domains.sell + '">' + tracknick + '</a>',
                           '<a href="' + domains.account + '/logout" style=" margin-left: 10px;font-family:SimSun">[退出]</a>',
                       '</div>',
                       '<div class="pull_btns w115 followwm">',
                           '<a href="#" class="idea w115"><i class="wm_ico heart1"></i>关注同城生活<span class="pull_arrow "><em>◆</em><span>◆</span></span></a>',
                           '<ul class="pull_list w115">',
                               '<li><a href="#" class="pull_link"><i class="wm_ico heart1"></i>关注同城生活</a><span class="pull_arrow "><em>◆</em><span>◆</span></span></li>',
                               '<li><a  href="http://weibo.com/2358731552/profile?topnav=1&wvr=5&from=company&user=1" target="_blank" class="pull_link"><i class="social_icon sina_wb"></i>新浪微博</a></li>',
                               '<li><a href="http://t.qq.com/wum2429503881?pgv_ref=im.perinfo.perinfo.icon" target="_blank" class="pull_link"><i class="social_icon tx_wb"></i>腾讯微博</a></li>',
                               '<li><a href="http://t.163.com/8522205239" target="_blank" class="pull_link"><i class="social_icon netease"></i>网易微博</a></li>',
                               '<li><a href="#" class="pull_link"><i class="social_icon wumeibang"></i>同城生活帮</a></li>',
                           '</ul>',
                       '</div>',
                       '<div class="link_list">',
                           '<a href="' + domains.sell + '">商家首页</a><em>|</em><a href="' + domains.item + '/merchant/list/' + lib.cookie("wm.user.id") + '">我的店铺</a><em>|</em><a href="http://s.tcsh.me/wmactivity/merchants_v1/index.html" target="_blank">招商启事</a><em>|</em><a href="' + domains.sell + '/order/list" title="待发货订单">订单管理</a><b></b><em>|</em><a href="' + domains.sell + '/order/list" title="退款申请">退款申请</a><b></b><em>|</em><a href="' + domains.item + '/product">商品上架</a>',
                       '</div>',
                   '</div></div></div>'
                ].join(''));
                getUserData(function (data) {
                    var $user_data = $page.find(".head_top .user_data");
                    $user_data.append('<img src="http://s.tcsh.me/tcsh/view/public/img/LVIMGV1/lv' + data.response.Level + '.png" title="' + busLvTitle[data.response.Level] + '" style="vertical-align: middle; margin: 0 10px" />');
                    $user_data.append('<a href="#"  class="station_letters_link bus_letter" style="margin-left: 10px;">站内信</a><b>' + data.response.NotificationCount + '</b>')
                });
                break;
            default:
                lib.removeCookie("user_top_data");
                $head_top.replaceWith([
                    '<div class="head_top"><div class="head_top_bb1f"><div class="sub_head_top">',
                        '<div class="user_data">',
                            '<span>欢迎加入同城生活：</span>',
                            '<a href="' + lib.getUserNameLinkURL() + '">' + tracknick + '</a>',
                            '<a href="' + domains.account + '/logout" style=" margin-left: 10px;font-family:SimSun">[退出]</a>',
                        '</div>',
                        '<div class="pull_btns theme_marketplace">',
                            '<a href="#" class="idea">专场推荐<span class="pull_arrow "><em>◆</em><span>◆</span></span></a>',
                            '<ul class="pull_list">',
                                '<li><a href="#" class="pull_link">专场推荐</a><span class="pull_arrow "><em>◆</em><span>◆</span></span></li>',
                                '<li><a href="#" class="pull_link">家纺专场</a></li>',
                                '<li><a href="#" class="pull_link">户外专场</a></li>',
                                '<li><a href="#" class="pull_link">成人专场</a></li>',
                                '<li><a href="#" class="pull_link">母婴专场</a></li>',
                                '<li><a href="#" class="pull_link">婚庆专场</a></li>',
                            '</ul>',
                        '</div>',
                        '<div class="link_list">',
                           '<a href="' + lib.getUserNameLinkURL() + '">我的工作台</a>',
                       '</div>',
                    '</div></div></div>'
                ].join(''));
                break;
        }
        if ($.browser.msie && $.browser.version === "6.0") {
            $page.find(".pull_btns").hover(function () {
                $(this).addClass("pull_btns_hover");
            }, function () {
                $(this).removeClass("pull_btns_hover");
            });
        }
    }
});
