define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js");
    var area_data = require('http://s.tcsh.me/tcsh/model/wmarea/dist/area_data.js');
    var area = function (op) {
        var _$, initEle, provincesEleChange, provincesEleInit, bind;
        _$ = function (ele) {
            return ele.constructor == $ ? ele : $(ele);
        };
        var _op = {
            parent: $("body"),
            provincesEle: "#selProvince_rent",
            provincesVal: "0",
            cityEle: "#selCity_rent",
            cityVal: "0",
            districtsEle: "#selDistricts_rent",
            districtsVal: "0",
            provincesDataSource: area_data.data_province,
            provincesDataSourceAjaxData: {},
            provincesDataSourceDataValCode: '',
            cityDataSource: area_data.data_city,
            cityDataSourceAjaxData: {},
            cityDataSourceDataValCode: '',
            districtsDataSource: area_data.data_districts,
            districtsDataSourceAjaxData: {},
            districtsDataSourceDataValCode: '',
            defaultItem: { val: 0, txt: "请选择" }
        };
        _op = $.extend(_op, op);
        _op.parent = _$(_op.parent);
        _op.provincesEle = _op.parent.find(_op.provincesEle);
        _op.cityEle = _op.parent.find(_op.cityEle);
        _op.districtsEle = _op.parent.find(_op.districtsEle)
        initEle = function (ele/*初始化的原素*/, data/*绑定到原素的数据*/, valCode/*数据源的属性名*/, txtCode/*数据源的属性名*/, callBack/*绑定完了，之后的回调*/) {
            var _ele, _html = [], callBackCallObject;
            if (!data || (data.constructor != Array && data.constructor != Object)) {
                return
            }
            _ele = _$(ele);
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    if (!valCode || !txtCode) {
                        _html.push('<option value="' + i + '">' + data[i] + '</option>');
                    } else {
                        _html.push('<option value="' + data[i][valCode] + '">' + data[i][txtCode] + '</option>');
                    }
                }
            }
            _ele.empty().append('<option value="' + _op.defaultItem.val + '">' + _op.defaultItem.txt + '</option>');
            _ele.append(_html.join('')).css("zoom", "1");//zoom,每次设置  主要是解决IE67
            callBackCallObject = {
                $this: _ele
            };
            typeof callBack === "function" && callBack.call(callBackCallObject);
        };
        cityEleInit = function () {
            var $this = _$(this), _val = $this.val();
            if (typeof _op.cityDataSource === "string") {
                $.ajax({
                    url: _op.cityDataSource,
                    cache: false,
                    data: typeof _op.cityDataSourceAjaxData == "function" ? _op.cityDataSourceAjaxData.call({ $this: $this, val: _val }) : _op.cityDataSourceAjaxData,
                    dataType: 'json',
                    success: function (data) {
                        initEle(_op.cityEle, data, _op.cityDataSourceDataValCode, _op.cityDataSourceDataTxtCode, function () {
                            _op.districtsEle.empty().append('<option value="' + _op.defaultItem.val + '">' + _op.defaultItem.txt + '</option>');
                        });
                    }
                });
            }
            else {
                //静态数据匹配逻辑
                initEle(_op.cityEle, _op.cityDataSource[_val], "value", "name", function () {
                    _op.districtsEle.empty().append('<option value="' + _op.defaultItem.val + '">' + _op.defaultItem.txt + '</option>');
                });
            }
        };
        districtsEleInit = function () {
            var $this = _$(this), _val = $this.val();
            if (typeof _op.districtsDataSource === "string") {
                $.ajax({
                    url: _op.cityDataSource,
                    cache: false,
                    data: typeof _op.cityDataSourceAjaxData == "function" ? _op.cityDataSourceAjaxData.call({ $this: $this, val: _val }) : _op.cityDataSourceAjaxData,
                    dataType: 'json',
                    success: function (data) {
                        initEle(_op.cityEle, data, _op.cityDataSourceDataValCode, _op.cityDataSourceDataTxtCode);
                    }
                });
            }
            else {
                //静态数据匹配逻辑
                initEle(_op.districtsEle, _op.districtsDataSource[_val], "value", "name", function () {
                    !_op.districtsDataSource[_val].length && _op.districtsEle.find("option").attr("value", _val);
                });
            }
        };
        provincesEleInit = function () {
            if (typeof _op.provincesDataSource === "string") {
                $.ajax({
                    url: _op.provincesDataSource,
                    cache: false,
                    data: typeof _op.provincesDataSourceAjaxData == "function" ? _op.provincesDataSourceAjaxData() : _op.provincesDataSourceAjaxData,
                    dataType: 'json',
                    success: function (data) {
                        initEle(_op.provincesEle, data, _op.provincesDataSourceDataValCode, _op.provincesDataSourceDataTxtCode);
                    }
                });
            }
            else {
                initEle(_op.provincesEle, _op.provincesDataSource, _op.provincesDataSourceDataValCode, _op.provincesDataSourceDataTxtCode);
            }
        };
        _op.provincesEle.length && _op.provincesEle.change(cityEleInit);
        _op.cityEle.length && _op.cityEle.change(districtsEleInit);
        provincesEleInit();
        initEle(_op.cityEle, []);
        initEle(_op.districtsEle, []);
    };
    return area;
});
