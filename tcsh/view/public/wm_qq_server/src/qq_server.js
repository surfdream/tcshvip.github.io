/*
联系商家
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        juicer = require('http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    require('../css/style.css');
    var _data;
    var $body = $("body");
    var _getData = function (callback) {
        if (global_setting && global_setting.qqServer && global_setting.qqServer.sellerid) {
            if (!_data) {
                $.ajax({
                    url: domains.api2 + "/user/qq.json",
                    type: "get",
                    dataType: "jsonp",
                    data: {
                        sellerid: global_setting.qqServer.sellerid
                    },
                    success: function (data) {
                        //data = {};
                        //data.linkQQ = ["45456464", "7874545456", "215646465"];
                        //data.linkPhone = ["123123123", "123123123"]
                        typeof callback === "function" && callback(data);
                    },
                    error: function () {
                        //data = {};
                        //data.linkQQ = ["45456464", "7874545456", "215646465"];
                        //data.linkPhone = ["123123123", "123123123"]
                        //typeof callback === "function" && callback(data);
                    }
                });
            } else {
                typeof callback === "function" && callback(data);
            }
        }
    };
    var init = function () {
        _getData();
    };
    var qq_srever_box = juicer([
        '<div class="qq_srever_box">',
            '<div class="qq_srever_head">',
                '<h3>在线客服</h3>',
            '</div>',
            '<div class="qq_server_con">',
                '<ul class="qq_list">',
                    '{@each linkQQ as item,index}',
                    '<li>',
                        '<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=${linkQQ[index]}&site=qq&menu=yes">',
                            '<img border="0" src="http://wpa.qq.com/pa?p=2:${linkQQ[index]}:51" alt="点击这里给我发消息" title="点击这里给我发消息" /></a>',
                    '</li>',
                    '{@/each}',
                '</ul>',
                '{@if linkPhone}',
                '<ul class="link_phone">',
                    '<li class="title">',
                        '<h3>咨询热线：</h3>',
                    '</li>',
                    '{@each linkPhone as item,index}',
                    '<li>${linkPhone[index]}</li>',
                    '{@/each}',
                '</ul>',
                '{@/if}',
            '</div>',
        '</div>'
    ].join(''));
    var _createBox = function () {
        _getData(function (data) {
            //data.linkQQ = JSON.parse(data.linkQQ);
            if (data.linkQQ.length) {
                $body.append(qq_srever_box.render(data));
            }
        });
    }
    init();
    exports.Create = function () {
        _createBox();
    };
    exports.getData = function (op) {
        _getData(op);
    };
});


