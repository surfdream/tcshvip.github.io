/*
此文件随便玩
*/
define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js');
    var data = require('src/area_data.js');
    var _print = [], _item = [], _item2 = [];
    _print.push('var _data = {</br>');
    _print.push('</br>//省</br>');
    _print.push('data_province: (function () {</br>');
    _print.push('return {</br>');
    for (var i in data.data_province) {
        _item.push('"' + i + '0000":' + '"' + data.data_province[i] + '"');
    }
    _print.push(_item.join(',</br>'));
    _print.push('}');
    _print.push('</br>})(),');
    _print.push('</br>//市</br>');
    _print.push('data_city: (function () {</br>');
    _print.push('return {</br>');
    for (i in data.data_city) {
        _item = [];
        _item2 = [];
        _item2.push('"' + i + '0000": [');
        var __data = data.data_city[i];
        for (var j in __data) {
            
            __data[j].value && _item.push('{value:"' + __data[j].value + '00",name:"' + __data[j].name + '"' + '}');
        }
        _item2.push(_item.join(',') + "],</br>");
        _print.push(_item2.join(''));
    }
    _print.push('</br>};');
    _print.push('</br>})(),');
    _print.push('</br>//区/县</br>');

    _print.push('data_districts: (function () {</br>');
    _print.push('return {</br>');
    for (i in data.data_districts) {
        _item = [];
        _item2 = [];
        _item2.push('"' + i + '00": [');
        var __data = data.data_districts[i];
        for (var j in __data) {
            __data[j].value && _item.push('{value:"' + __data[j].value + '",name:"' + __data[j].name + '"}');
        }
        _item2.push(_item.join(',') + "],</br>");
        _print.push(_item2.join(''));
    }

    _print.push('</br>};');
    _print.push('</br>})(),');
    _print.push('</br>};');
    $("body").empty().append(_print.join(''));
});
