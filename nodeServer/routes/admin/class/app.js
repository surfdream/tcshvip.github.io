var urllib = require('url');
exports.default = function (req, res) {
    res.end("erp")
};
/*var classObj = {
    '100000': {
        name: "服装",
        itemList: {
            '100100': {
                name: '男装',
                itemList: {
                    '100101': {
                        name: 'T桖',
                        itemList: {}
                    },
                    '100102': {
                        name: 'Polo',
                        itemList: {}
                    },
                    '100103': {
                        name: '针织衫',
                        itemList: {}
                    },
                    '100104': {
                        name: '衬衫',
                        itemList: {}
                    }
                }
            },
            '100200': {
                name: '女装',
                itemList: []
            },
            '100300': {
                name: '童装',
                itemList: []
            }
        }

    }
};*/
var classObj = {
    '100000': '服饰',
    '110000': '鞋子',
    '120000': '箱包',
    '130000': '家纺',
    '100100': '男装',
    '100200': '女装',
    '110100': '男鞋',
    '110200': '女鞋',
    '120100': '男包',
    '100101': 'T恤',
    '100102': '针织衫',
    '100103': '衬衫',
    '100104': '卫衣',
    '100105': '外套',
    '100106': '休闲裤'
};
var relationship = {
    "100101": "组1",
    "100102": "组1,组2"
};
var base = 90000;
var getMaxKey = function () {
    var retKey = base / 10000;
    for (var i in classObj) {
        var _i = i / 10000;
        if (_i === parseInt(_i)) {
            retKey = Math.max(_i, retKey);
        }
    }
    return retKey * 10000;
};

exports.addclass = function (req, res) {
    var params, attr_data = {}, _k;
    params = urllib.parse(req.url, true).query;

    var _parent = params.parent - 0;
    console.log(_parent)
    if (!_parent) {
        console.log("添加顶级")
        console.log(getMaxKey())
        console.log(params.name)
        classObj[(getMaxKey() + 10000) + ""] = params.name;
    } else {
        _parent = _parent + ""
        console.log("添加非顶级")
        var sub02 = _parent.substr(0, 2), sub02Obj = {};
        for (var i in classObj) {
            if (i.substr(0, 2) == sub02) {
                sub02Obj[i] = classObj[i];
            }
        }
        var sub22 = _parent.substr(2, 2), sub22Obj = {};
        if (sub22 === "00") {
            var max00 = 0;
            for (i in sub02Obj) {
                max00 = Math.max(max00, i.substr(2, 2) - 0);
            }
            max00++;
            console.log(max00);
            classObj[sub02 + (("" + (max00)).length === 1 ? ("0" + max00) : max00) + "00"] = params.name;
        } else {
            var max00 = 0;
            for (i in sub02Obj) {
                max00 = Math.max(max00, i.substr(4, 2) - 0);
            }
            max00++;
            console.log(max00);
            _k = sub02 + sub22 + ((max00 + "").length === 1 ? ("0" + max00) : (max00 + ""))
            classObj[_k] = params.name;
        }
    }
    if (params.group && _k) {
        relationship[_k] = params.group;
    }
    if (params.callback) {
        res.end(params.callback + '(' + JSON.stringify(classObj) + ')');
    } else {
        res.end(JSON.stringify(classObj));
    }

};
exports.getrelationship = function (req, res) {
    var params;
    params = urllib.parse(req.url, true).query;
    if (params.callback) {
        res.end(params.callback + '(' + JSON.stringify(relationship) + ')');
    } else {
        res.end(JSON.stringify(relationship));
    }
};
exports.getclass = function (req, res) {
    var params, retJson;
    params = urllib.parse(req.url, true).query;
    var retJson = {};

    for (var i in classObj) {
        var end4 = i.substr(2, 4);
        if (end4 === "0000") {
            retJson[i] = {
                name: classObj[i],
                itemList: {}
            };
        }

    }

    for (var i in classObj) {
        var end4 = i.substr(2, 4);
        var end2 = i.substr(4, 2);
        var s2 = i.substr(0, 2);
        var s4 = i.substr(0, 4);
        if (end4 !== "0000" && end2 === "00") {
            retJson[s2 + "0000"].itemList[s4 + "00"] = {
                name: classObj[i],
                itemList: {}
            };
        }

    }

    for (i in classObj) {
        var end2 = i.substr(4, 2);
        var s2 = i.substr(0, 2);
        var s4 = i.substr(0, 4);
        if (end2 != "00") {
            retJson[s2 + "0000"].itemList[s4 + "00"].itemList[i] = {
                name: classObj[i],
                itemList: {}
            }
        }
    }

    if (params.callback) {
        res.end(params.callback + '(' + JSON.stringify(retJson) + ')');
    } else {
        res.end(JSON.stringify(retJson));
    }
};
exports.delclass = function (req, res) {
    var params, key, retJson = {};
    retJson.success = true;
    params = urllib.parse(req.url, true).query;
    key = params.key;
    var s2 = key.substr(0, 2);
    var s4 = key.substr(0, 4);
    try {
        delete classObj[key];
    } catch (e) {
        retJson.success = false;
    }
    finally {
        if (params.callback) {
            res.end(params.callback + '(' + JSON.stringify(retJson) + ')');
        } else {
            res.end(JSON.stringify(retJson));
        }
    }
};
exports.test = function (req, res) {
    var params;
    params = urllib.parse(req.url, true).query;

    res.end(JSON.stringify({ name: "x", value: "x", list: [{ name: "xxx", value: "xxxx" }, { name: "xxx", value: "xxxx" }, { name: "xxx", value: "xxxx" }, 2, 3, 4, 5] }));

}