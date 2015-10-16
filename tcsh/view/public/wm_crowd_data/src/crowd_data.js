/*
社团
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    require('../css/style.css#');
    var _g_data;

    var _join = function (op) {
        $.ajax({
            url: domains.commune + "/service/commune/join.json",
            data: {
                communeId: op.communeId
            },
            dataType: "jsonp",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //获取帮会数据
    var _getData = function (op) {
        $.ajax({
            url: "/",
            dataType: "jsonp",
            success: function (data) {
                var data = (function () {
                    return {
                        success: {
                            id: parseInt(Math.random() * 999999) + 100000,
                            ico: 'http://imgcache.mysodao.com/img3/M02/86/B0/CgAPEFHyIcyo6hQlAAAoqASk3LY717_900x0x1.JPG',
                            name: "帮社名称帮社名称帮社名称帮社名称",
                            introduction: '简介简介<br>简介<br>简介<br>简介简介简介简介简介简介简介简介简介简介简介<br>简介简介<br>简介<br>简介<br>简介简介简介简介简介简介简介简介简介简介简介',
                            tag: ['标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签'],
                            type_main: '童男童女',
                            type_minor: ['草根阶级', '土肥圆'],
                            people_con: parseInt(Math.random() * 99) + 100
                        }
                    }
                })();
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                var data = (function () {
                    return {
                        success: {
                            id: parseInt(Math.random() * 999999) + 100000,
                            ico: 'http://imgcache.mysodao.com/img3/M02/86/B0/CgAPEFHyIcyo6hQlAAAoqASk3LY717_900x0x1.JPG',
                            name: "帮社名称帮社名称帮社名称帮社名称帮社名称帮社名称帮社名称帮社名称帮社名称帮社名称帮社名称帮社名称帮社名称帮社名称帮社名称帮社名称",
                            introduction: '简介简介<br>简介<br>简介<br>简介简介简介简介简介简介简介简介简介简介简介<br>简介简介<br>简介<br>简介<br>简介简介简介简介简介简介简介简介简介简介简介',
                            tag: ['标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签', '标签'],
                            type_main: '童男童女',
                            type_minor: ['草根阶级', '土肥圆'],
                            people_con: parseInt(Math.random() * 99) + 100
                        }
                    }
                })();
                typeof op.error === "function" && op.error(data);
            }
        });
    };
    //获取入驻帮会的商家列表
    var _getBossList = function (op) {
        $.ajax({
            url: domains.commune + "/service/commune/sellers.json",
            data: {
                communeId: op.communeId,
                page: 1,
                size: 3
            },
            dataType: "jsonp",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    var _showBox = function (op) {
        return box.invBox({
            boxCls: 'crowd_box crowd_data_box',
            titleText: '帮社',
            content: '<div class="crowd_data_main"><a href="#" class="iconfont head_close close">&#xf00b3;</a><p class="crowd_title"></p></div>',
            btns: [],
            callback: function () {
                var self = this;
                this.close = this.hide;
                var $crowd_data_main = this.wmBox.find(".crowd_data_main");
                _getData({
                    success: function (data) {
                        if (data.success) {
                            $crowd_data_main.empty().append(juicer([
                                '<a href="#" class="iconfont head_close close">&#xf00b3;</a>',
                                '<img class="crowd_img" src="${ico}" />',
                                '<p class="crowd_title"><b class="crowd_name">${name}</b><span class="crowd_id">${id}</span></p>',
                                '<p class="types">${type_main},${type_minor}<span class="crowd_people_con"><span class="iconfont">&#xf00e4;</span>${people_con}</span></p>',
                                '<p class="tags">${tag}</p>',
                                '<div class="introduction_main">',
                                    '<b class="introduction_title">帮社简介：</b>',
                                    '<p class="introduction">$${introduction}</p>',
                                '</div>',
                                '<div class="boss">',
                                    '<b class="boss_title">入驻商家：</b>',
                                    '<ul class="boss_list"></ul>',
                                '</div>',
                                '<div class="btns">',
                                    '<a href="#" class="ui_btn ui_btn_h26blue2 chkin_cr" data_id="${id}"><span class="ui_btn_txt">加入帮社</span></a>',
                                    '<a href="#" class="ui_btn ui_btn_h26white6 return_list"><span class="ui_btn_txt">返回</span></a>',
                                '</div>'
                            ].join(''), data.success));
                            _getBossList({
                                success: function (data) {
                                    if (data.response) {
                                        $crowd_data_main.find(".boss_list").empty().append(juicer([
                                            '{@each data as item}',
                                            '<li class="boss_item">',
                                                '<a href="' + domains.item + '/merchant/list/${item.id}" target="_blank"><img src="${item.logo}" /></a>',
                                                '<a href="' + domains.item + '/merchant/list/${item.id}" target="_blank" class="boss_name">${item.sellerName}</a>',
                                            '</li>',
                                            '{@/each}'
                                        ].join(''), data.response));
                                    }
                                },
                                error: function (data) {

                                }
                            });
                        }
                    },
                    error: function (data) {
                    }
                });
                typeof op.callback === "function" && op.callback.call(this);
            }
        });
    };
    exports.showBox = function (op) {
        return _showBox($.extend({}, op));
    };
    exports.getData = function (op) {
        _getData($.extend({}, op));
    };
    exports.getBossList = function (op) {
        _getBossList($.extend({}, op));
    };
    exports.join = function (op) {
        lib.verificationLogin(function () {
            _join(op);
        });
    };
});