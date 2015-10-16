define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js'),
        juicer = require('http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js'),
        tips = require('http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js')
    ;
    require("http://s.tcsh.me/tcsh/view/public/font-face/css/font-face.css#");
    require('../css/style.css#');
    var _boxHtml = [
        '<div id="left_lib">',
            '<div class="left_lib_ico">',
                '<a href="javascript:void(0);" class="iconfont ">&#xf0008;</a>',
                '<div class="ewm_list">',
                    '<ul>',
                        '<li>',
                            '<a href="#" class="follow_wx" rel="nofollow">',
                                '<img class="ewm_img" src="http://s.tcsh.me/tcsh/view/public/img/dimensional_code.jpg" width="100" height="100"></a>',
                        '</li>',
                        '<li>',
                            '<a href="http://weibo.com/2358731552/profile?topnav=1&amp;wvr=5&amp;from=company&amp;user=1" class="follow_sina" target="_blank" rel="nofollow">',
                                '<img class="ewm_img" src="http://s.tcsh.me/tcsh/view/public/img/sina_dimensional_code.png" width="100" height="100"></a>',
                        '</li>',
                    '</ul>',
                    '<span class="ll_arrow "><em>◆</em><span>◆</span></span>',
                '</div>',
            '</div>',
            '<ul class="left_lib_list">',
                '<li class="left_lib_item ll_user_data">',
                    '<a href="javascript:void(0);" title="我的信息"><span class="iconfont">&#xf00bb;</span>My</a>',
                    '<div class="ll_user_data_box">',
                    '</div>',
                '</li>',
                '<li class="left_lib_item">',
                    '<a href="#" class="show_data" title="我的积分明细" data_mian_key="int_details"><span class="iconfont">&#xf0101;</span>积分</a>',
                '</li>',
                '<li class="left_lib_item">',
                    '<a href="#" class="show_data" title="全站积分排名" data_mian_key="ranking"><span class="iconfont">&#xf00eb;</span>排名</a>',
                '</li>',
            '</ul>',
            '<a href="#" class="iconfont ll_chang_btn left_lib_closebtn">&#xf00b3;</a>',
            '<a href="#" class="iconfont ll_chang_btn left_lib_showbtn">&#xf00e9;</a>',
            '<ul class="llm_list"></ul>',
        '</div>'
    ].join(''),
    _userDataBoxHtml = juicer([
        '{@if type==1}',
        '<div class="ll_user_data_box">',
            '<div class="ll_user_data_con">',
                '<a href="' + domains.member + '/userdata/Profile" class="ll_user_img" title="${user_name}"><span class="ll_user_img_bg">',
                    '<img src="${user_img}"><span href="#" class="ll_user_img_hover">点击修改</span></span></a>',
                '<ul>',
                    '<li class="ll_user_data_name" title="${user_name}">Hi,${user_name}</li>',
                    '<li>您有：<b>${integration}</b>积分</li>',
                    '<li>排名：<b>${rank}</b></li>',
                    '<li class="shopping_statistics">您在同城生活上花掉<b>${spend}</b>元，总共收了<b>${parcel_sun}</b>个包裹</li>',
                '</ul>',
                '<a href="' + domains.account + '/logout" class="ll_logout">退出</a>',
            '</div>',
            '<span class="ll_arrow"><em>◆</em><span>◆</span></span>',
        '</div>',
        '{@else if type==2}',
        '<div class="ll_user_data_box seller">',
            '<div class="ll_user_data_con ">',
                '<a href="${name_link}" class="ll_user_img" title="${user_name}"><span class="ll_user_img_bg">',
                    '<img src="${user_img}"></span></a>',
                '<ul>',
                    '<li class="ll_user_data_name" title="${user_name}">Hi,${user_name}</li>',
                    '<li>有<b>${follow}</b>人关注了您</li>',
                    '<li><a href="#" class="ll_spreadbtn in_spread">站内推广</a><a href="#" class="ll_spreadbtn out_spread">站外推广</a></li>',
                    '<li class="shopping_statistics">您在同城生活上赚了<b>${profit}</b>元，总共发出<b>${parcel_sun}</b>个包裹</li>',
                '</ul>',
                '<a href="' + domains.account + '/logout" class="ll_logout">退出</a>',
            '</div>',
            '<span class="ll_arrow "><em>◆</em><span>◆</span></span>',
        '</div>',
        '{@else}',
        '<div class="ll_user_data_box">',
            '<div class="ll_user_data_con">',
                '<a href="javascript:void(0);" class="ll_user_img" title="${user_name}"><span class="ll_user_img_bg">',
                    '<img src="http://s.tcsh.me/tcsh/view/public/img/man_default.jpg"></span></a>',
                '<ul>',
                    '<li class="ll_user_data_name" title="${user_name}">Hi,${user_name}</li>',
                '</ul>',
                '<a href="' + domains.account + '/logout" class="ll_logout">退出</a>',
            '</div>',
            '<span class="ll_arrow"><em>◆</em><span>◆</span></span>',
        '</div>',
        '{@/if}'
    ].join('')),
    llmListModel = {
        int_details: juicer([
            '<li class="llm_item int_details">',
                '<div class="llm_title_box">',
                    '<a href="#" class="llm_title">我的积分明细</a>',
                    '<a href="#" class="iconfont hide_llm">&#xf016e;</a>',
                '</div>',
                '<div class="user_int">',
                    '<a href="' + domains.member + '/userdata/Profile" class="ll_user_img" title="${user_name}">',
                        '<span class="ll_user_img_bg">',
                            '<img src="${user_img}">',
                        '</span>',
                    '</a>',
                    '同城生活积分<b>${integration}</b>',
                '<span class="user_rank">${rank}</span>',
            '</div>',
            '<ul class="llm_sub_list">',
                '{@each itemList as item}',
                '<li class="llm_sub_item">',
                    '<div class="llm_sub_item_border">',
                        '<p class="sub_title_box"><span class="sub_title">${item.title}</span><span class="get_date">${item.get_date}</span></p>',
                        '<p>$${item.msg}</p>',
                    '</div>',
                '</li>',
                '{@/each}',
            '</ul>',
            '<a href="#" class="ll_item_more">查看全部>></a>',
        '</li>'
        ].join('')),
        ranking: juicer([
            '<li class="llm_item ranking">',
                '<div class="llm_title_box">',
                    '<a href="#" class="llm_title">全站积分排名</a>',
                    '<a href="#" class="iconfont hide_llm">&#xf016e;</a>',
                '</div>',
                '<ul class="llm_sub_list">',
                    '{@each itemList as item}',
                    '<li class="llm_sub_item">',
                        '<div class="llm_sub_item_border">',
                            '<span class="ll_user_img" title="${item.user_name}">',
                                '<span class="ll_user_img_bg">',
                                    '<img src="${item.user_img}">',
                                '</span>',
                            '</span>',
                            '<span class="ranking_user_name">${item.user_name}</span>',
                            '<p>积分：<b>${item.integration}</b></p>',
                            '<p class="red">${item.msg}</p>',
                        '</div>',
                    '</li>',
                    '{@/each}',
                '</ul>',
            '</li>'
        ].join(''))
    };
    var _global_data = {};
    var $left_lib, $left_lib_showbtn;
    var init = function () {
        window.document.domain = 'wumeiwang.com';
        var $body = $("body"), $ll_user_data_box;
        $body.append(_boxHtml);
        $ll_user_data_box = $body.find(".ll_user_data_box");
        lib.verificationLogin(function () {
            $.ajax({
                url: "",
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    data = {};
                    data.success = {
                        /*买家数据*/
                        user_name: '校草草草草草草草草草草草草草草草',
                        user_img: 'http://img.wumeiwang.com/M00/00/5E/rBAA_lMaxi-AEC-cAAERb82lsO0129.jpg',
                        integration: 9999,
                        rank: '万里之外',
                        spend: 15555.44,
                        parcel_sun: 999,
                        /*商家数据*/
                        follow: 9999,
                        profit: 11111111.99
                    }
                    if (data.success) {
                        _global_data.type = lib.getRole(true).key;
                        _global_data.name_link = lib.getUserNameLinkURL();
                        _global_data.user_name = data.success.user_name;
                        _global_data.user_img = data.success.user_img;
                        _global_data.integration = data.success.integration;
                        _global_data.rank = data.success.rank;
                        _global_data.spend = data.success.spend;
                        _global_data.parcel_sun = data.success.parcel_sun;
                        _global_data.follow = data.success.follow;
                        _global_data.profit = data.success.profit;
                        $ll_user_data_box.replaceWith(_userDataBoxHtml.render(_global_data));
                    }
                },
                error: function () {
                    //debug
                    data = {};
                    data.success = {
                        /*买家数据*/
                        user_name: '校草草草草草草草草草草草草草草草',
                        user_img: 'http://img.wumeiwang.com/M00/00/5E/rBAA_lMaxi-AEC-cAAERb82lsO0129.jpg',
                        integration: 9999,
                        rank: '万里之外',
                        spend: 15555.44,
                        parcel_sun: 999,
                        /*商家数据*/
                        follow: 9999,
                        profit: 11111111.99
                    }
                    if (data.success) {
                        _global_data.type = lib.getRole(true).key;
                        _global_data.name_link = lib.getUserNameLinkURL();
                        _global_data.user_name = data.success.user_name;
                        _global_data.user_img = data.success.user_img;
                        _global_data.integration = data.success.integration;
                        _global_data.rank = data.success.rank;
                        _global_data.spend = data.success.spend;
                        _global_data.parcel_sun = data.success.parcel_sun;
                        _global_data.follow = data.success.follow;
                        _global_data.profit = data.success.profit;
                        $ll_user_data_box.replaceWith(_userDataBoxHtml.render(_global_data));
                    }
                }
            });
        }, function () {
            $ll_user_data_box.replaceWith([
                '<div class="ll_user_data_box no_login">',
                    '<div class="ll_user_data_con ">',
                        '<iframe src="' + domains.account + '/tools/loginbox" width="520" height="320" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>',
                    '</div>',
                    '<span class="ll_arrow "><em>◆</em><span>◆</span></span>',
                '</div>'
            ].join(''))
        });
        bind();
    };
    var bind = function () {
        $left_lib = $("#left_lib"), $left_lib_showbtn = $left_lib.find(".left_lib_showbtn")
        var $llm_list = $left_lib.find(".llm_list");
        var llmListItemGetData = {
            int_details: function (callback) {
                $.ajax({
                    url: "",
                    type: "get",
                    dataType: "jsonp",
                    data: {},
                    success: function () { },
                    error: function () {
                        var data = {
                            itemList: [
                                {
                                    title: '闪亮登场',
                                    get_date: '1989-06-06',
                                    msg: '注册成功，获得<b>30</b>积分！'
                                },
                                {
                                    title: '晒单达人',
                                    get_date: '1989-06-06',
                                    msg: '成功晒单<a href="#">垃圾商品</a>，获得<b>30</b>积分！'
                                },
                                {
                                    title: '天生购物狂',
                                    get_date: '1989-06-06',
                                    msg: '购得<a href="#">杜蕾斯</a>，获得<b>30</b>积分！'
                                },
                                {
                                    title: '甜蜜教唆者',
                                    get_date: '1989-06-06',
                                    msg: '您的好友<a href="#">xxx</a>，购物成功，获得<b>30</b>积分！'
                                },
                                {
                                    title: '生日大蛋糕',
                                    get_date: '1989-06-06',
                                    msg: '生日当天消费<b>300</b>元，获得<b>600</b>积分！'
                                },
                                {
                                    title: '我爱同城生活',
                                    get_date: '1989-06-06',
                                    msg: '在同城生活浏览<b>10分钟</b>，获得<b>30</b>积分！'
                                },
                                {
                                    title: '风雨弄潮儿',
                                    get_date: '1989-06-06',
                                    msg: '每日签到，获得<b>30</b>积分！'
                                },
                                {
                                    title: '21世纪雷锋奖',
                                    get_date: '1989-06-06',
                                    msg: '对<a href="#">杜蕾斯</a>进行评价，获得<b>30</b>积分！'
                                },
                                {
                                    title: '同城生活传教士',
                                    get_date: '1989-06-06',
                                    msg: '成功邀请<b>xxx</b>成为同城生活会员，获得<b>30</b>积分！'
                                }
                            ]
                        };
                        data.user_name = _global_data.user_name;
                        data.user_img = _global_data.user_img;
                        data.integration = _global_data.integration;
                        data.rank = _global_data.rank;
                        $llm_list.append(llmListModel['int_details'].render(data));
                        typeof callback === "function" && callback();
                    }
                });
            },
            ranking: function (callback) {
                $.ajax({
                    url: "",
                    type: "get",
                    dataType: "jsonp",
                    data: {},
                    success: function () { },
                    error: function () {
                        var data = {
                            itemList: [
                                {
                                    user_name: '用户名1',
                                    integration: '999999',
                                    user_img: 'http://img.wumeiwang.com/M00/00/5E/rBAA_lMaxi-AEC-cAAERb82lsO0129.jpg',
                                    msg: 'No.1'
                                },
                                {
                                    user_name: '用户名2',
                                    integration: '9999',
                                    user_img: 'http://img.wumeiwang.com/M00/00/5E/rBAA_lMaxi-AEC-cAAERb82lsO0129.jpg',
                                    msg: 'No.2'
                                },
                                {
                                    user_name: '用户名3',
                                    integration: '999',
                                    user_img: 'http://img.wumeiwang.com/M00/00/5E/rBAA_lMaxi-AEC-cAAERb82lsO0129.jpg',
                                    msg: 'No.3'
                                },
                                {
                                    user_name: '用户名4',
                                    integration: '99',
                                    user_img: 'http://img.wumeiwang.com/M00/00/5E/rBAA_lMaxi-AEC-cAAERb82lsO0129.jpg',
                                    msg: 'No.4'
                                }
                                ,
                                {
                                    user_name: '用户名5',
                                    integration: '9',
                                    user_img: 'http://img.wumeiwang.com/M00/00/5E/rBAA_lMaxi-AEC-cAAERb82lsO0129.jpg',
                                    msg: 'No.5'
                                }
                                ,
                                {
                                    user_name: '用户名6',
                                    integration: '8',
                                    user_img: 'http://img.wumeiwang.com/M00/00/5E/rBAA_lMaxi-AEC-cAAERb82lsO0129.jpg',
                                    msg: 'No.6'
                                }
                                ,
                                {
                                    user_name: '用户名7',
                                    integration: '7',
                                    user_img: 'http://img.wumeiwang.com/M00/00/5E/rBAA_lMaxi-AEC-cAAERb82lsO0129.jpg',
                                    msg: 'No.7'
                                }
                                ,
                                {
                                    user_name: '用户名8',
                                    integration: '6',
                                    user_img: 'http://img.wumeiwang.com/M00/00/5E/rBAA_lMaxi-AEC-cAAERb82lsO0129.jpg',
                                    msg: 'No.8'
                                }
                            ]
                        };
                        $llm_list.append(llmListModel['ranking'].render(data));
                        typeof callback === "function" && callback();
                    }
                });
            }
        }
        $left_lib.on("click", ".show_data:not(.curr)", function () {
            var $this = $(this), no_login_tips,
                _data_mian_key = $this.attr("data_mian_key"),
                $data_mian_key = $llm_list.find("." + _data_mian_key);
            lib.verificationLogin(function () {
                $left_lib.find(".curr").removeClass("curr");
                $this.addClass("curr");
                $left_lib.addClass("show_mian");
                if ($data_mian_key.length) {
                    $llm_list.find(".llm_item").css({
                        display: 'none'
                    });
                    $data_mian_key.css({
                        display: 'block'
                    });
                } else {
                    llmListItemGetData[_data_mian_key](function () {
                        $data_mian_key = $llm_list.find("." + _data_mian_key);
                        $llm_list.find(".llm_item").css({
                            display: 'none'
                        });
                        $data_mian_key.css({
                            display: 'block'
                        });
                    });
                }
            }, function () {
                var $no_login = $left_lib.find(".ll_user_data");
                if ($no_login.length) {
                    $no_login.addClass('ll_user_data_hover');
                }
                setTimeout(function () {
                    $no_login.removeClass('ll_user_data_hover');
                }, 1000);
            });
            return false;
        });
        $left_lib.on("click", ".show_data.curr", function () {
            var $this = $(this);
            $left_lib.find(".curr").removeClass("curr");
            $left_lib.removeClass("show_mian");
            return false;
        });
        $left_lib.on("click", ".hide_llm", function () {
            _hide_left_lib_sub();
            return false;
        });
        $left_lib.on("click", ".left_lib_closebtn", function () {
            _hide_left_lib();
            return false;
        });
        $left_lib.on("click", ".left_lib_showbtn", function () {
            _show_left_lib();
            return false;
        });
    };
    var _hide_left_lib_sub = function () {
        $left_lib.removeClass('show_mian');
        $left_lib.find(".curr").removeClass("curr");
    };
    var _show_left_lib = function () {
        $left_lib_showbtn.animate({
            left: 0
        }, 200, function () {
            $left_lib_showbtn.css({
                display: 'none'
            });
            $left_lib.animate({
                left: 0
            }, 300);
        });
    };
    var _hide_left_lib = function () {
        _hide_left_lib_sub();
        $left_lib.animate({
            left: -50
        }, 300, function () {
            $left_lib_showbtn.css({
                display: 'block'
            })
            $left_lib_showbtn.animate({
                left: 50
            });
        });
    };
    init();
    exports.hideLeftLibSub = function () {
        _hide_left_lib_sub();
    };
    exports.showLeftLib = function () {
        _show_left_lib();
    };
    exports.hideLeftLib = function () {
        _hide_left_lib();
    };
});
