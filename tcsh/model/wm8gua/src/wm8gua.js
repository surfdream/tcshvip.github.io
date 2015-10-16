/*
八卦信息，星座生肖
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js");
    var _getConstellation = function (month, day) {
        //id对应 http://api.uihoo.com/demo/astro_day.shtml#body_top
        var _data = [
            {   //12.22--1.20
                id: 9,
                name: '魔羯座',//又名山羊座
                ico: "&#xf0048;"
            },
            {   //1.21--2.19
                id: 10,
                name: '水瓶座',
                ico: "&#xf004c;"
            },
            {   //2.20--3.20
                id: 11,
                name: '双鱼座',
                ico: "&#xf004a;"
            },
            {
                id: 0,
                name: '白羊座',//又名牡羊座
                ico: "&#xf0040;"
            },
            {
                id: 1,
                name: '金牛座',
                ico: "&#xf0042;"
            },
            {
                id: 2,
                name: '双子座',
                ico: "&#xf004b;"
            },
            {
                id: 3,
                name: '巨蟹座',
                ico: "&#xf0047;"
            },
            {
                id: 4,
                name: '狮子座',
                ico: "&#xf004f;"
            },
            {
                id: 5,
                name: '处女座',
                ico: "&#xf0041;"
            },
            {
                id: 6,
                name: '天秤座',
                ico: "&#xf004d;"
            },
            {
                id: 7,
                name: '天蝎座',
                ico: "&#xf004e;"
            },
            {
                id: 8,
                name: '射手座',
                ico: "&#xf0049;"
            }
        ];
        var _dayarr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
        return _data[month - (day < _dayarr[month - 1] ? 1 : 0)] || _data[0];
    },
    _getZodiac = function (year) {
        var zodiac = [{
            id: 9,
            name: '猴',
            ico: '&#xf0059;'
        }, {
            id: 10,
            name: '鸡',
            ico: '&#xf005b;'
        }, {
            id: 11,
            name: '狗',
            ico: '&#xf0058;'
        }, {
            id: 12,
            name: '猪',
            ico: '&#xf0065;'
        }, {
            id: 1,
            name: '鼠',
            ico: '&#xf0061;'
        }, {
            id: 2,
            name: '牛',
            ico: '&#xf005e;'
        }, {
            id: 3,
            name: '虎',
            ico: '&#xf005a;'
        }, {
            id: 4,
            name: '兔',
            ico: '&#xf0062;'
        }, {
            id: 5,
            name: '龙',
            ico: '&#xf005c;'
        }, {
            id: 6,
            name: '蛇',
            ico: '&#xf005f;'
        }, {
            id: 7,
            name: '马',
            ico: '&#xf005d;'
        }, {
            id: 8,
            name: '羊',
            ico: '&#xf0063;'
        }];
        return zodiac[year % 12];
    },
    /*
        type:day,tomorrow,week,month,year,love
        id:星座id
    */
    _getConstellation8gua = function (type, id, success) {
        $.ajax({
            url: "http://api.uihoo.com/astro/astro.http.php",
            data: {
                fun: type,
                id: id,
                format: "jsonp"
            },
            type: "get",
            dataType: "jsonp",
            success: function (arr) {
                typeof success === "function" && success(arr);
            },
            error: function () {
                typeof success === "function" && success();
            }
        })
    }
    ;
    exports.getConstellation = function (m, d) {
        return _getConstellation(m, d);
    };
    exports.getZodiac = function (y) {
        return _getZodiac(y)
    };
    exports.getConstellation8gua = function (type, id, success) {
        _getConstellation8gua(type, id, success)
    };
});
