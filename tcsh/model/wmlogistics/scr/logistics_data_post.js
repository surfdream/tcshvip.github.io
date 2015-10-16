define(function (require, exports, module) {
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js');
    var data = require('http://s.tcsh.me/tcsh/model/wmlogistics/scr/logistics_data.js');
    data = data.list;

    var _data = {}, i, k, j, postData = {};
    postData.list = []
    for (i in data) {
        j = data[i].list;
        for (k in j) {
            if (!_data[j[k].key]) {
                _data[j[k].key] = {
                    LogisticsCode: j[k].key,
                    LogisticsName: encodeURIComponent(j[k].name),
                    DataKey: data[i].key
                }
            }
        }
    }
    for (i in _data) {
        postData.list.push(_data[i]);
    }
    postData.list = JSON.stringify(postData.list);
    $.ajax({
        url: "http://z.tcsh.me/api/area/add1 ",
        data: postData,
        type: "post",
        success: function () {
            alert("正常返回！")
        },
        error: function () {
            alert("异常返回！")
        }
    })
    console.log(postData)
});
