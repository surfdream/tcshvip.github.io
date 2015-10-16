define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var i = parseInt(Math.random() * 10000) + 1,
        _baseArr = {},
        l;
    while (i--) {
        var _x = parseInt(Math.random() * 10000) + 1;
        //_x = ((_x + "").length+"") + _x;
        if (!_baseArr[(_x + "").length]) {
            _baseArr[(_x + "").length] = [];
        }
        _baseArr[(_x + "").length].push(_x);
    }
    l = _baseArr.length;
    console.log(_baseArr);
    i = parseInt(Math.random() * 10000) + 1 + "";
    console.log(i);
    var _x = i.length
    var _subarr = ',' + _baseArr[_x].sort().join(',');
   
    console.log('/////////////////////////')
    var lll = function (v, b, i) {
        var x = b.substr(0, i);
        if (v.indexOf(',' + x) > -1) {
            return lll(v, b, ++i);
        } else {
            console.log(',' + x);
            return ',' + x;
        }
    }
    var nimei = lll(_subarr, i, 1);
    nimei = i == nimei ? nimei : ((nimei.substr(1, nimei.length - 2) + "9")) - 0;
    if (i == nimei) {
        alert(nimei);
    } else {
        i = i - 0;
        console.log(i);
        console.log(nimei);
        var nimei2 = i;
        while (nimei - i) {
            if (_subarr.indexOf(((++nimei) + "")) > -1) {
                console.log("入口："+i)
                console.log("返回："+nimei);
                return false
            }
        }
    }
});
