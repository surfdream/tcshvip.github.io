/*
商品数据
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        juicer = require('http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js'),
        tips = require('http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    require('http://s.tcsh.me/tcsh/view/public/wm_commodity_data/css/style.css#');
    require('http://s.tcsh.me/tcsh/view/public/font-face/css/font-face.css#');
    var quantityCon;
    var _buyAttr = juicer([
        '{@each relation as item}',
        '<li class="" >',
            '<label>${item.key}：</label>',
            '<ul class="options_list">',
                '{@each item.itemList as list}',
                '<li>',
                    '<a href="#" hidefocus="true" style="{@if list.src}padding:0;{@/if}" title="${list.name}" data_key="${item.key}" data_value="${list.name}" data_id="${list.id}" class="buy_attr">{@if list.src}<img src="${list.src}" class="showbigimg" /><i class="disabled_mask wm_ico mask1"></i>{@else}${list.name}{@/if}<i class="wm_ico hook3"></i></a>',
                '</li>',
                '{@/each}',
            '</ul>',
        '</li>',
        '{@/each}'
    ].join(''));
    var _quantitySum = function (_data) {
        quantityCon = 0;
        for (var i in _data) {
            quantityCon += (_data[i].amount - 0) || 0;
        }
    };
    //禁用属性
    var _disabledAttr = function (_data) {
        var self = this;
        var $curr = this.find(".buy_attr.curr");
        this.find(".options_list .disabled").removeClass('disabled');
        $curr.each(function () {
            var $this = $(this);
            var thiskey = $this.attr("data_key"), thisvalue = $this.attr("data_value");
            var currKeys = "[data_" + thiskey + "='" + thisvalue + "']", _disableds = [], _length;
            for (var i in _data) {
                if (i.indexOf(currKeys) >= 0 && _data[i].amount - 0 <= 0) {
                    _disableds.push((i.replace(currKeys, "")).split(']['));
                }
            }
            for (i in _disableds) {
                for (var k in _disableds[i]) {
                    _disableds[i][k] = _disableds[i][k].replace(/\[|\]/g, "");
                    var x = true;
                    for (var j in _data) {
                        if (j.indexOf(currKeys) >= 0 && j.indexOf(_disableds[i][k]) >= 0 && _data[j].amount - 0 > 0) {
                            x = false;
                        }
                    }
                    if (x) {
                        _disableds[i][k] = _disableds[i][k].replace(/data_|\'/g, "");
                        var keyArr = _disableds[i][k].split('=');
                        self.find(".buy_attr" + '[data_key="' + keyArr[0] + '"][data_value="' + keyArr[1] + '"]').addClass("disabled");
                    }
                }
            }
        });


    };
    var _bind = function () {
        var self = this,
            $buy_attr_box = this,
            str,
            $quantity = this.find(".quantity"),
            SpecificationData = this.data("SpecificationData");
        //选择购买属性
        this.on("click.setBuyAttr", ".buy_attr", function () {
            var $this = $(this),
                $options_list = $this.closest(".options_list"),
                $currdisabled,
                _quantity = $quantity.val() - 0 || 1;
            if ($this.hasClass("curr") || $this.hasClass("disabled")) { return false }
            str = "",
            _data = SpecificationData.dataList, _o1 = {}, _o2 = {};
            $options_list.find(".curr").removeClass("curr");
            $this.addClass("curr");
            $buy_attr_box.find(".options_list").each(function () {
                var $this = $(this).find(".curr");
                if ($this.length) {
                    str += "[data_" + $this.attr("data_key") + "='" + $this.attr("data_value") + "']";
                }
            });
            //有BUG
            for (var i in _data) {
                if (i.indexOf(str) >= 0) {
                    _o1[i] = _data[i];
                    if (!(_data[i].amount - 0)) {
                        _o2[i] = _data[i];
                    }
                }
            }
            //计算价格范围
            //_defineRange(_o1);
            //计算货存
            _quantitySum(_o1 || SpecificationData.dataList);
            //禁用
            $options_list.addClass("noteach");
            _disabledAttr.call(self, _o1 || SpecificationData);
            $options_list.removeClass("noteach");
            //检测购买数量与货存
            if (_quantity > quantityCon) {
                _quantity = quantityCon;
                $quantity.val(_quantity);
            }
            //设置
            $quantity.data("maxQuantity", quantityCon);
            $quantity.html("（库存" + quantityCon + "件）");
            $currdisabled = self.find(".curr.disabled");
            if ($this.hasClass('curr') && $this.hasClass('disabled')) {
                errTips = $quantity.data('errTips');
                if (!errTips) {
                    errTips = new tips({
                        ele: $quantity,
                        con: '<p style="font-size: 12px;"><i class="iconfont" style="line-height: 12px;font-size:18px;color: #e13436;margin-right: 10px; vertical-align: bottom;">&#xf0155;</i>库存为0，换个规格购买吧！</p>',
                        close: 2000,
                        direction: 'rt'
                    });
                    $quantity.data('errTips', errTips);
                }
                errTips.show();
                $this.removeClass("curr");
                self.find(".curr.disabled").removeClass("disabled");
                setTimeout(function () {
                    $this.removeClass("disabled");
                }, 2000);

            }
            return false;
        });
    }
    var _getSpecification = function (op) {
        var _op = {};
        if (typeof op === "function") {
            _op.success = op;
        } else {
            _op = $.extend({}, op);
        }
        $.ajax({
            url: _op.url || "",
            type: _op.type || "get",
            dataType: _op.dataType || "jsonp",
            data: {},
            success: function (data) {
                if (data) {
                    var callObject = {}, _dataList, i;
                    callObject.$buy_attr_box = $('<div class="buy_attr_box"><ul class="mb10 options_box"></ul></div>');
                    callObject.$buy_attr_box.data("SpecificationData", data);
                    callObject.$options_box = callObject.$buy_attr_box.find(".options_box");
                    if (data.relation.length === 1) {
                        _dataList = data.dataList;
                        for (i in _dataList) {
                            if (!(_dataList[i].amount - 0)) {
                                var x = i.replace(/data_|\[|\]|\'/g, "").split('=');
                                callObject.$options_box.find(".buy_attr" + '[data_key="' + x[0] + '"][data_value="' + x[1] + '"]').addClass("disabled");
                            }
                        }
                    }
                    callObject.$options_box.prepend(_buyAttr.render(data));
                    callObject.$options_box.append([
                        '<li class="options_ipt_item">',
                            '<label>数量：</label>',
                            '<div class="ipt_box ipt_num">',
                                '<input type="text" class="ipt_txt txt_quantity" value="1">',
                                '<a href="#" class="wm_ico arrowup arrow2up changequantity"></a>',
                                '<a href="#" class="wm_ico arrowdown arrow2down_disabled changequantity"></a>',
                                '<span class="ipt_num_units">件</span>',
                            '</div>',
                            '<span class="ipt_remark quantity"></span>',
                        '</li>'
                    ].join(''));
                    _bind.call(callObject.$options_box);
                    typeof _op.success === "function" && _op.success.call(callObject, data);
                } else {
                    typeof _op.error === "function" && _op.error();
                }
            },
            error: function () {
                var data = {};
                data.relation = [];
                data.relation[0] = { itemList: [{ name: '粉红色', id: '69' }, { name: '白色', id: '70' }, { name: '褐色', id: '71' }], key: "颜色" };
                data.relation[1] = { itemList: [{ name: '防水', id: '127' }, { name: '防风', id: '128' }, { name: '防紫外线', id: '129' }], key: "功能特征" };
                data.relation[2] = { itemList: [{ name: '绗缝', id: '234' }, { name: '其他', id: '235' }, { name: '蕾丝边', id: '236' }], key: "床品工艺" };
                data.relation[3] = { itemList: [{ name: '郊游', id: '354' }, { name: '野营', id: '355' }, { name: '登山', id: '356' }], key: "适应项目" };
                data.dataList = {};
                data.dataList["[data_颜色='粉红色'][data_功能特征='防水'][data_床品工艺='绗缝'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防水'][data_床品工艺='绗缝'][data_适应项目='野营']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防水'][data_床品工艺='绗缝'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防水'][data_床品工艺='其他'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防水'][data_床品工艺='其他'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防水'][data_床品工艺='其他'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防水'][data_床品工艺='蕾丝边'][data_适应项目='郊游']"] = { price: "10", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防水'][data_床品工艺='蕾丝边'][data_适应项目='野营']"] = { price: "1", amount: "10" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防水'][data_床品工艺='蕾丝边'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防风'][data_床品工艺='绗缝'][data_适应项目='郊游']"] = { price: "1", amount: "10" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防风'][data_床品工艺='绗缝'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防风'][data_床品工艺='绗缝'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防风'][data_床品工艺='其他'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防风'][data_床品工艺='其他'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防风'][data_床品工艺='其他'][data_适应项目='登山']"] = { price: "1", amount: "10" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防风'][data_床品工艺='蕾丝边'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防风'][data_床品工艺='蕾丝边'][data_适应项目='野营']"] = { price: "1", amount: "10" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防风'][data_床品工艺='蕾丝边'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防紫外线'][data_床品工艺='绗缝'][data_适应项目='郊游']"] = { price: "1", amount: "10" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防紫外线'][data_床品工艺='绗缝'][data_适应项目='野营']"] = { price: "1", amount: "10" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防紫外线'][data_床品工艺='绗缝'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防紫外线'][data_床品工艺='其他'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防紫外线'][data_床品工艺='其他'][data_适应项目='野营']"] = { price: "1", amount: "10" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防紫外线'][data_床品工艺='其他'][data_适应项目='登山']"] = { price: "1", amount: "10" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防紫外线'][data_床品工艺='蕾丝边'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防紫外线'][data_床品工艺='蕾丝边'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='粉红色'][data_功能特征='防紫外线'][data_床品工艺='蕾丝边'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防水'][data_床品工艺='绗缝'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防水'][data_床品工艺='绗缝'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防水'][data_床品工艺='绗缝'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防水'][data_床品工艺='其他'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防水'][data_床品工艺='其他'][data_适应项目='野营']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='白色'][data_功能特征='防水'][data_床品工艺='其他'][data_适应项目='登山']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='白色'][data_功能特征='防水'][data_床品工艺='蕾丝边'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防水'][data_床品工艺='蕾丝边'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防水'][data_床品工艺='蕾丝边'][data_适应项目='登山']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='白色'][data_功能特征='防风'][data_床品工艺='绗缝'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防风'][data_床品工艺='绗缝'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防风'][data_床品工艺='绗缝'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防风'][data_床品工艺='其他'][data_适应项目='郊游']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='白色'][data_功能特征='防风'][data_床品工艺='其他'][data_适应项目='野营']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='白色'][data_功能特征='防风'][data_床品工艺='其他'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防风'][data_床品工艺='蕾丝边'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防风'][data_床品工艺='蕾丝边'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防风'][data_床品工艺='蕾丝边'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防紫外线'][data_床品工艺='绗缝'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防紫外线'][data_床品工艺='绗缝'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防紫外线'][data_床品工艺='绗缝'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防紫外线'][data_床品工艺='其他'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防紫外线'][data_床品工艺='其他'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防紫外线'][data_床品工艺='其他'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防紫外线'][data_床品工艺='蕾丝边'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='白色'][data_功能特征='防紫外线'][data_床品工艺='蕾丝边'][data_适应项目='野营']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='白色'][data_功能特征='防紫外线'][data_床品工艺='蕾丝边'][data_适应项目='登山']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防水'][data_床品工艺='绗缝'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防水'][data_床品工艺='绗缝'][data_适应项目='野营']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防水'][data_床品工艺='绗缝'][data_适应项目='登山']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防水'][data_床品工艺='其他'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防水'][data_床品工艺='其他'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防水'][data_床品工艺='其他'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防水'][data_床品工艺='蕾丝边'][data_适应项目='郊游']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防水'][data_床品工艺='蕾丝边'][data_适应项目='野营']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防水'][data_床品工艺='蕾丝边'][data_适应项目='登山']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防风'][data_床品工艺='绗缝'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防风'][data_床品工艺='绗缝'][data_适应项目='野营']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防风'][data_床品工艺='绗缝'][data_适应项目='登山']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防风'][data_床品工艺='其他'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防风'][data_床品工艺='其他'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防风'][data_床品工艺='其他'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防风'][data_床品工艺='蕾丝边'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防风'][data_床品工艺='蕾丝边'][data_适应项目='野营']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防风'][data_床品工艺='蕾丝边'][data_适应项目='登山']"] = { price: "1", amount: "0" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防紫外线'][data_床品工艺='绗缝'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防紫外线'][data_床品工艺='绗缝'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防紫外线'][data_床品工艺='绗缝'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防紫外线'][data_床品工艺='其他'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防紫外线'][data_床品工艺='其他'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防紫外线'][data_床品工艺='其他'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防紫外线'][data_床品工艺='蕾丝边'][data_适应项目='郊游']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防紫外线'][data_床品工艺='蕾丝边'][data_适应项目='野营']"] = { price: "1", amount: "1" };
                data.dataList["[data_颜色='褐色'][data_功能特征='防紫外线'][data_床品工艺='蕾丝边'][data_适应项目='登山']"] = { price: "1", amount: "1" };
                if (data) {
                    var callObject = {}, _dataList, i;
                    callObject.$buy_attr_box = $('<div class="buy_attr_box"><ul class="mb10 options_box"></ul></div>');
                    callObject.$buy_attr_box.data("SpecificationData", data);
                    callObject.$options_box = callObject.$buy_attr_box.find(".options_box");
                    if (data.relation.length === 1) {
                        _dataList = data.dataList;
                        for (i in _dataList) {
                            if (!(_dataList[i].amount - 0)) {
                                var x = i.replace(/data_|\[|\]|\'/g, "").split('=');
                                callObject.$options_box.find(".buy_attr" + '[data_key="' + x[0] + '"][data_value="' + x[1] + '"]').addClass("disabled");
                            }
                        }
                    }
                    callObject.$options_box.prepend(_buyAttr.render(data));
                    callObject.$options_box.append([
                        '<li class="options_ipt_item">',
                            '<label>数量：</label>',
                            '<div class="ipt_box ipt_num">',
                                '<input type="text" class="ipt_txt txt_quantity" value="1">',
                                '<a href="#" class="wm_ico arrowup arrow2up changequantity"></a>',
                                '<a href="#" class="wm_ico arrowdown arrow2down_disabled changequantity"></a>',
                                '<span class="ipt_num_units">件</span>',
                            '</div>',
                            '<span class="ipt_remark quantity"></span>',
                        '</li>'
                    ].join(''));
                    _bind.call(callObject.$buy_attr_box);
                    typeof _op.success === "function" && _op.success.call(callObject, data);
                }
                return false;
                typeof _op.error === "function" && _op.error();
            }
        })
    };
    exports.getSpecification = function (op) {
        _getSpecification(op)
    };
});