define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    var _cacheData = {};
    _cacheData.index = lib.cookie('wmpushmsgindex') - 0 || 0;
    _cacheData.statu = lib.cookie('wmpushmsgstatu') - 0 || 1;
    var _getData, _monitorStatu;
    var statuFun = {
        //关闭状态
        "-1": function () {
            clearInterval(_monitorStatu);
            clearInterval(_getData);
        },
        //开启获取数据状态，并开启状态监听
        "1": function () {
            _getData = setInterval(function () {
                $.ajax({
                    url: "http://localhost:9999/pushmsg",
                    type: "get",
                    dataType: "jsonp",
                    success: function (data) {
                        if (data.newmsg) {
                            _cacheData.index = lib.cookie('wmpushmsgindex') - 0 || 0;
                            ++_cacheData.index;
                            lib.cookie('wmpushmsgindex', _cacheData.index);
                            lib.cookie('wmpushmsg', data.newmsg);
                        }
                    }
                });
            }, 10000);
            _monitorStatu = setInterval(function () {
                _cacheData.statu = lib.cookie('wmpushmsgstatu');
                typeof statuFun[_cacheData.statu] === "function" && statuFun[_cacheData.statu]();
            }, 5000);
        }
    };
    var init = function () {
        window.document.domain = "tcsh.me";
        typeof statuFun[_cacheData.statu != "-1" ? "1" : "null"] === "function" && statuFun[_cacheData.statu]();
        bind();
    };
    var bind = function () {        
       
    };
    init();
    window.closeGet = function () {
        clearInterval(_getData);
        lib.cookie('wmpushmsgstatu', -1);
    };
});
