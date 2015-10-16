define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    //数据模版
    //var SpecificationData = {}
    //SpecificationData.relation = [];
    //SpecificationData.relation[1] = { itemList: [{name:'绿色',key:"用于关联"}, {name:'巧克力色',key:"用于关联"}, {name:'深紫色',key:"用于关联"}], key: "颜色" };
    //SpecificationData.relation[2] = { itemList: [{name:'XL',key:"用于关联"}, {name:'M',key:"用于关联"}], key: "尺码1" };
    //SpecificationData.relation[3] = { itemList: [{name:'2XL',key:"用于关联"},{name: '2M',key:"用于关联"}], key: "尺码2" };
    //SpecificationData.dataList = {};
    //SpecificationData.dataList["[data_颜色='巧克力色'][data_尺码1='M'][data_尺码2='2M']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='巧克力色'][data_尺码1='M'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='巧克力色'][data_尺码1='XL'][data_尺码2='2M']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='巧克力色'][data_尺码1='XL'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='深紫色'][data_尺码1='M'][data_尺码2='2M']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='深紫色'][data_尺码1='M'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='深紫色'][data_尺码1='XL'][data_尺码2='2M']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='深紫色'][data_尺码1='XL'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='绿色'][data_尺码1='M'][data_尺码2='2M']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='绿色'][data_尺码1='M'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='绿色'][data_尺码1='XL'][data_尺码2='2M']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='绿色'][data_尺码1='XL'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    var $ = require("jquery"),
       juicer = require("juicer");
    var _initSpecificationMainThead = function (op) {
        var str = '', _setData = op.setData, $specificationMain_thead = $(op.thead);
        for (var i in _setData) {
            str += '<th>' + ((_setData[i].sign ? '<b class="form_must">' + _setData[i].sign + '</b>' : "") + _setData[i].name) + '</th>'
        }
        $specificationMain_thead.empty().append("<tr>" + str + "</tr>");
    };
    var _initSpecificationMain = function (op) {
        var _base = $("<tbody></tbody>");
        var i = op.setData.relation.length;
        var _dataList;
        while (i--) {
            _relation = op.setData.relation[i];
            if (_relation) {
                _itemList = _relation.itemList;
                _i = _itemList.length;
                if (_base.find("tr").length) {
                    var arr = []
                    var $cloneBase = _base.clone(true);
                    for (var j = 0; j < _i; j++) {
                        var $clone = $cloneBase.clone(true);
                        $clone.find("tr:eq(0)").prepend('<td ' + (_itemList[j].key || "") + ' rowspan="' + $clone.find("tr").length + '">' + _itemList[j].name + '</td>');
                        $clone.find("tr").attr("data_" + _relation.key, _itemList[j].id);
                        arr.push($clone.html());
                    }
                    _base.html(arr.join(''));
                } else {
                    for (var j = 0; j < _i; j++) {
                        _base.append([
                         '<tr class="specification_dataitem" data_' + _relation.key + '="' + _itemList[j].id + '">',
                            '<td ' + (_itemList[j].key || "") + '>' + _itemList[j].name + '</td>',
                            '<td class="">',
                                '<input type="text" class="form_txt w80 price cache_data_hook" wmv="empty|positiveNumber" wmvmsg="价格不能为空！|请输入正确的价格！" /></td>',
                            '<td>',
                                '<input type="text" class="form_txt w80 quantity cache_data_hook" wmv="empty|nonNegative" wmvmsg="数量不能为空！|数量只能是正整数或0！" /></td>',
                            '<td class="text_align_c"><a href="#" class="wm_ico pen2 batch_set"></a></td>',
                         '</tr>'].join(''));
                    }
                }
            }
        }
        op.tbody.empty().append(_base.html());
        op.tbody.find(".price").val($(".price_money").val());
        _dataList = op.setData.dataList;
        for (i in _dataList) {
            var _obj = _dataList[i];
            var $tr = op.tbody.find(i);
            if ($tr.length) {
                $tr.find(".price").val(_obj.price);
                $tr.find(".quantity").val(_obj.quantity);
            }
        }
        typeof op.callback === "function" && op.callback.call(op.tbody);
    };
    exports.initSpecificationMainThead = function (op) {
        var _op = $.extend({
            setData: null,
            thead: null
        }, op);
        if (_op.setData && _op.thead) {
            _initSpecificationMainThead(_op);
        }
    };
    exports.initSpecificationMain = function (op) {
        var _op = $.extend({
            setData: null,
            tbody: null
        }, op);
        if (_op.setData && _op.tbody) {
            _initSpecificationMain(_op);
        }
    }
});
