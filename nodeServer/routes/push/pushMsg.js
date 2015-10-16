var urllib = require('url');
var x = 2;
exports.pushMsg = function (req, res) {
    var params, retData = {};
    params = urllib.parse(req.url, true).query;
    if (parseInt(Math.random() * 5) === x) {
        retData.newmsg = "新消息！";
    }
    if (params.isnew) {
        retData.newmsg = "必须有新消息！";
    }
    if (params.callback) {
        res.end(params.callback + '(' + JSON.stringify(retData) + ')');
    } else {
        res.end(JSON.stringify(retData));
    }

};
