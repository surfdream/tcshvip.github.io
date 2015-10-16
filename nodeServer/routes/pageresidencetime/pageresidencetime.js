var urllib = require('url');
var naemKv = {
    webkit: 'webkit',
    safari: 'safari',
    opera: 'opera',
    msie: 'IE',
    mozilla: 'mozilla'
};
exports.pageresidencetime = function (req, res) {
    var params, retData = {};
    params = urllib.parse(req.url, true).query;
    var _name = naemKv[params.browser],
        _version = params.version;

    console.log('');
    console.log('');
    console.log('');
    console.log(params.url);
    console.log(((_name + _version) || params.browser));
    console.log(decodeURIComponent(params.type));
    console.log(decodeURIComponent(params.client_side));
    if (params.des_url) {
        console.log("目标URL：" + params.des_url);
    }
    console.log("进入时间为：" + decodeURIComponent(params.time_start));
    console.log("离开时间为：" + decodeURIComponent(params.time_end));
    console.log("停留了：" + decodeURIComponent(params.time_seconds+"毫秒"));
    console.log("在页面上活动了：" + params.activ_time + "秒！");
    console.log(params.address_code + "：" + params.address_name);
    console.log("分辨率：" + params.resolution);
    console.log('///////////////////////////////////');
    console.log('');
    console.log('');
    console.log('');
};