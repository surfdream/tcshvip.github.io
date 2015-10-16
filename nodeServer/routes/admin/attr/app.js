var _attr = {
    "宝贝类型": {
        "name": "宝贝类型",
        "type": "rid",
        "itemList": [
            { "name": "全新", "value": 1, "sequence": 1 },
            { "name": "二手", "value": 2, "sequence": 2 }]
    },
    "材料": {
        "name": "材料",
        "type": "sel",
        "itemList": [
            { "name": "牛皮", "value": 1, "sequence": 1 },
            { "name": "狗毛", "value": 2, "sequence": 2 }]
    },
    "宝贝名称": {
        "name": "宝贝名称",
        "type": "txt",
        "itemList": [{ "placeholder": "宝贝名称", "value": 1, }]
    },
    "颜色": {
        "name": "颜色",
        "type": "chk",
        "itemList": [
            { "name": "红色", "value": 1, "sequence": "1" },
            { "name": "黄色", "value": 2, "sequence": "2" },
            { "name": "蓝色", "value": 3, "sequence": "3" },
            { "name": "绿色", "value": 4, "sequence": "4" },
            { "name": "紫色", "value": 5, "sequence": "5" }]
    }
};
var _group = {
    "组1": {
        "name": "组1",
        "itemList": [
            { "name": "宝贝类型", "sequence": "1" },
            { "name": "材料", "sequence": "3" },
            { "name": "颜色", "sequence": "2" }]
    },
    "组2": {
        "name": "组2",
        "itemList": [
            { "name": "宝贝类型", "sequence": "7" },
            { "name": "材料", "sequence": "4" },
            { "name": "宝贝名称", "sequence": "5" },
            { "name": "颜色", "sequence": "6" }]
    },
    "组3": {
        "name": "组3",
        "itemList": [
            { "name": "宝贝类型", "sequence": "1" },
            { "name": "宝贝名称", "sequence": "2" }]
    }
};
var urllib = require('url');
exports.default = function (req, res) {
    res.end("erp")
};
exports.addattr = function (req, res) {
    var params, attr_data = {};
    params = urllib.parse(req.url, true).query;
    attr_data.name = params.name;
    attr_data.type = params.type;
    attr_data.itemList = JSON.parse(params.itemList);
    _attr[attr_data.name] = attr_data;

    if (params.callback) {
        res.end(params.callback + '(' + JSON.stringify(_attr) + ')');
    } else {
        res.end(JSON.stringify(_attr));
    }
};
exports.getattr = function (req, res) {
    var params, retJson;
    params = urllib.parse(req.url, true).query;
    retJson = _attr[params.key] || _attr;
    if (params.callback) {
        res.end(params.callback + '(' + JSON.stringify(retJson) + ')');
    } else {
        res.end(JSON.stringify(retJson));
    }
};
exports.delattr = function (req, res) {
    var params;
    params = urllib.parse(req.url, true).query;
    if (params.key) {
        _attr[params.key] = undefined;
    }
    if (params.callback) {
        res.end(params.callback + '(' + JSON.stringify(_attr) + ')');
    } else {
        res.end(JSON.stringify(_attr));
    }
};
exports.addgroup = function (req, res) {
    var params, _data = {};
    params = urllib.parse(req.url, true).query;
    _data.name = params.name;
    _data.itemList = JSON.parse(params.itemList);
    _group[_data.name] = _data;
    if (params.callback) {
        res.end(params.callback + '(' + JSON.stringify(_group) + ')');
    } else {
        res.end(JSON.stringify(_group));
    }
};
exports.getgroup = function (req, res) {
    var params, retJson;
    params = urllib.parse(req.url, true).query;
    retJson = _group[params.key] || _group;
    if (params.callback) {
        res.end(params.callback + '(' + JSON.stringify(retJson) + ')');
    } else {
        res.end(JSON.stringify(retJson));
    }
};
exports.test = function (req, res) {
    var params;
    params = urllib.parse(req.url, true).query;

    res.end(JSON.stringify({ name: "x", value: "x", list: [{ name: "xxx", value: "xxxx" }, { name: "xxx", value: "xxxx" }, { name: "xxx", value: "xxxx" }, 2, 3, 4, 5] }));

}