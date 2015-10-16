/*
此文件随便玩
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js');
    var data = require('src/area_data.js');
    var _data = [];
    for (var i in data.data_province) {
        _data.push({ id: i, name: data.data_province[i] });
    }
    for (i in data.data_city) {
        var __data = data.data_city[i];
        for (var j in __data) {
            _data.push({ id: __data[j].value, name: __data[j].name });
        }
    }
    for (i in data.data_districts) {
        var __data = data.data_districts[i];
        for (j in __data) {
            _data.push({ id: __data[j].value, name: __data[j].name });
        }
    }
    $.ajax({
        url: domains.click + '/api/area/add',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(_data),
        type: "post",
        dataType: 'json',
        success: function () {
            alert("正常返回");
        },
        error: function () {
            alert("异常返回");
        }
    })
});
