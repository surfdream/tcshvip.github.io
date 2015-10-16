define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        juicer = require('http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js'),
        wmds = require('http://s.tcsh.me/tcsh/model/wmds/dist/wmds.js');
    require('../css/style.css#');
    var init = function () {
        var $body = $("body");
        var _boxHtml = juicer([
            '<div class="wmmessage_box" id="wmmessage_box">',
                '<div class="wmmessage_main">',
                    '<div class="message_user_data">',
                        '<a href="' + domains.member + '/userdata/Profile" class="border" title="${nick_name}">',
                            '<span class="img_bg">',
                                '<img src="${user_img}" />',
                                '<span href="#" class="hover">点击修改</span>',
                            '</span>',
                        '</a>',
                        '<p><b class="user_name" title="${nick_name}">${nick_name}</b>小伙伴</p>',
                        '<p><span class="total_val">总积分:${total_val}</span><span class="val_rank">排名:${val_rank}</span></p>',
                    '</div>',
                    '<ul class="msg_list">',
                        '<li><a href="#" class="more_msg">查看全部</a></li>',
                    '</ul>',
                    '<a href="#" class="iconfont colse">&#xf0155;</a>',
                '</div>',
                '<a href="#" class="box_base"></a>',
            '</div>'
        ].join('')),
        _itemHtml = juicer([
            '<li class="msg_item">',
                '<b class="mr10">${get_type}</b>获得<b>${get_val}</b>积分',
                '<span class="get_date">${get_date}</span>',
            '</li>'
        ].join(''));
        var _userData = {
            nick_name: "小菜菜菜菜菜菜菜菜菜菜菜菜菜",
            user_img: "http://img.wumeiwang.com/M00/00/5E/rBAA_lMaxi-AEC-cAAERb82lsO0129.jpg",
            total_val: "999",
            val_rank: "NO.999"
        };
        var $wmmessage_box, $msg_list;
        //$.ajax({
        //    url: "",
        //    type: "get",
        //    dataType: "jsonp",
        //    success: function (data) {
        //        $body.append([
        //        '<div class="wmmessage_box">',
        //            '<div class="wmmessage_main">',
        //                '<div class="message_user_data">',
        //                    '<a href="#" class="border">',
        //                        '<span class="img_bg">',
        //                            '<img src="http://img.wumeiwang.com/M00/00/5E/rBAA_lMaxi-AEC-cAAERb82lsO0129.jpg" />',
        //                            '<span href="#" class="hover">点击修改</span>',
        //                        '</span>',
        //                    '</a>',
        //                    '<p><b class="user_name">小菜</b>小伙伴</p>',
        //                    '<p><span class="total_val">总积分:999</span><span class="val_rank">排名:NO.999</span></p>',
        //                '</div>',
        //                '<ul class="msg_list">',
        //                    '<li><a href="#" class="more_msg">查看全部</a></li>',
        //                '</ul>',
        //                '<a href="#" class="iconfont colse">&#xf0155;</a>',
        //            '</div>',
        //            '<a href="#" class="box_base"></a>',
        //        '</div>'
        //        ]);
        //    }
        //});
        $body.append(_boxHtml.render(_userData));
        $wmmessage_box = $("#wmmessage_box"), $msg_list = $wmmessage_box.find(".msg_list");
        wmds.newDataClaaback(function (data) {
            $msg_list.prepend(_itemHtml.render({
                get_type: data.get_type,
                get_val: data.get_val,
                get_date: data.get_date
            }));
        });
        bind();
    };
    var bind = function () { };

    exports.Create = function () {
        init();
    };
});
