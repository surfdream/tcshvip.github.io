define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
       juicer = require("juicer"),
       verification = require('wmverification'),
       areaBox = require('area_box'),
       areaData = require('areaData'),
       area = require("area"),
       lib = require("lib"),
       box = require('wmbox'),
       tips = require("wmtips");
    var modelItemHtml = juicer([
         '<li data_id="${id}">',
         '<div class="thead">',
            '<table class="model_table" border="0" cellspacing="0">',
                '<thead>',
                    '<tr class="model_name">',
                        '<td colspan="6">',
                            '<div class="btns">',
                                '<a href="#" class="update_model">修改</a>',
                                '<a href="#" class="del_model">删除</a>',
                            '</div>',
                            '<b>${modelName}</b>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<th class="w99">运送方式</th>',
                        '<th class="w310">运送到</th>',
                        '<th class="w69">首件(个)</th>',
                        '<th class="w69">运费(元)</th>',
                        '<th class="w69">续件(个)</th>',
                        '<th>运费(元)</th>',
                    '</tr>',
                '</thead>',
            '</table>',
         '</div>',
         '<div class="tbody">',
             '<table class="model_table" border="0" cellspacing="0">',
                 '<tbody>',
                     '{@each shipType as types}',
                     '{@each types.itemList as itemlist,index}',

                     '<tr>',
                        '<td class="w99">${types.typeTxt}</td>',
                        '<td class="w310">${itemlist.showtxt}</td>',
                        '<td class="w69">${itemlist.base_sum}</td>',
                        '<td class="w69">${itemlist.base_price}</td>',
                        '<td class="w69">${itemlist.incremental_sum}</td>',
                        '<td>${itemlist.incremental_price}</td>',
                     '</tr>',

                     '{@/each}',
                     '{@/each}',
                 '</tbody>',
             '</table>',
         '</div>',
         '<div class="tfoot">',
            '<table class="model_table" border="0" cellspacing="0">',
            '{@if isparentopen}',
                '<tbody>',
                    '<tr>',
                        '<td class="textright">',
                            '<a href="#" class="ui_btn ui_btn_h27gray8 selected"><span class="ui_btn_txt">使用此模版</span></a>',
                        '</td>',
                    '</tr>',
                '</tbody>',
            '{@/if}',
            '</table>',
        '</div>',
        '</li>'].join(''));

    var editHtml = juicer([
        '<ul class="logistics_item wm_form logistics_form" style="display:none">',
            '<li class="form_row">',
                '<h3>新增运费模版</h3>',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key"><b class="form_must">*</b>模板名称：</label>',
                '<input type="text" class="form_txt model_name" wmv="empty" wmvmsg="请输入模版名称！" value="${modelName}">',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key"><b class="form_must">*</b>宝贝地址：</label>',
                '<select class="form_sel" id="selProvince_rent"></select>',
                '<select class="form_sel" id="selCity_rent"></select>',
                '<select class="form_sel" id="selDistricts_rent" wmv="selEmpty" wmvmsg="所在地请精确到市级！"></select>',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key">是否包邮：</label>',
                '<input type="radio" name="shipping_type" id="shipping_type1" value="1"{@if shippingType!=2} checked="checked"{@/if}><label class="rad_key" for="shipping_type1">买家承担运费</label>',
                '<input type="radio" name="shipping_type" id="shipping_type2" value="2"{@if shippingType==2} checked="checked"{@/if}><label class="rad_key" for="shipping_type2">卖家承担运费</label>',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key"><b class="form_must">*</b>运送方式</label>',
                '<ul class="floatleft"  wmv="chkEmpty" wmvmsg="请选择运送方式！">',
                    '<li class="model_item">',
                        '<input type="checkbox" name="ship_type" id="express_delivery" value="1" data_txt="快递公司" class="showbox"><label class="chk_key" for="express_delivery">快递</label>',
                    '</li>',
                    '<li class="model_item">',
                        '<input type="checkbox" name="ship_type" id="EMS" value="2" data_txt="EMS" class="showbox"><label class="chk_key" for="EMS">EMS</label>',
                    '</li>',
                    '<li class="model_item">',
                        '<input type="checkbox" name="ship_type" id="surface" value="3" data_txt="平邮" class="showbox"><label class="chk_key" for="surface">平邮</label>',
                    '</li>',
                '</ul>',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key">&nbsp;</label>',
                '<a href="#" class="ui_btn ui_btn_h27gray8 save_btn"><span class="ui_btn_txt">保存并返回</span></a>',
                '<a href="#" class="ui_btn ui_btn_h27gray8 ret_btn"><span class="ui_btn_txt">返回</span></a>',
            '</li>',
        '</ul>'
    ].join(''));
    var init = function () {
        //取消公共脚本检测登录状态
        global_setting.no_v_login = 1;
        window.document.domain = "tcsh.me";
        var $page = $(".main_con"),
            $logistics_model_list = $page.find(".logistics_model_list");
        $logistics_model_list.after(editHtml.render({}));
        area();
        verification.addRule([
                {
                    key: "selEmpty", fun: function () {
                        return !!(this.val() - 0);
                    }
                },
                {
                    key: "chkEmpty", fun: function () {
                        return !!(this.find(":checkbox:checked")).length;
                    }
                }
        ]);
        bind();
    };
    var bind = function () {
        var $page = $(".main_con"),
            $logistics_form = $(".logistics_form"),
            $logistics_model_list = $page.find(".logistics_model_list"),
            _loginBox,
            _createModelItem;
        var updateId;
        var showErrTips = function ($ele, msg) {
            var errtips = $ele.data("errtips");
            if (!errtips) {
                errtips = new tips({
                    ele: $ele,
                    con: msg,
                    skin: "red2",
                    direction: "tr"
                });
                $ele.data("errtips", errtips);
            }
            errtips.show();
        }
        var verificationTableData = function (value, $ele, msg, otherV) {
            if (!otherV) {
                $ele.addClass("errortxt_hook");
                if (!value) {
                    $ele.addClass("errortxt");
                } else {
                    showErrTips($ele, msg);
                }
            }

        };
        var _submit = function () {
            var $logistics_form = $(".logistics_form");
            var postData = {},
                _base_sum, _base_price, _incremental_sum, _incremental_price,
                $base_sum, $base_price, $incremental_sum, $incremental_price;
            if (verification.verify($logistics_form)) {
                if (updateId) {
                    postData.id = updateId;
                }
                postData.modelName = $logistics_form.find(".model_name").val();
                postData.districts = $logistics_form.find("#selDistricts_rent").val();
                postData.shippingType = $logistics_form.find('[name="shipping_type"]:checked').val();
                postData.shipType = [];
                $logistics_form.find('[name="ship_type"]:checked').each(function () {
                    var $this = $(this),
                        $model_item = $this.closest(".model_item"),
                        $default_shipping = $model_item.find(".default_shipping"),
                        $model_table = $model_item.find(".model_table tbody");
                    var _data = {};
                    _data.id = $this.val();
                    _data.typeTxt = $this.attr("data_txt");
                    _data.itemList = [];
                    $base_sum = $default_shipping.find(".base_sum");
                    _base_sum = $base_sum.val() - 0;
                    $base_price = $default_shipping.find(".base_price");
                    _base_price = $base_price.val() - 0;
                    $incremental_sum = $default_shipping.find(".incremental_sum");
                    _incremental_sum = $incremental_sum.val() - 0;
                    $incremental_price = $default_shipping.find(".incremental_price");
                    _incremental_price = $incremental_price.val() - 0;
                    verificationTableData(_base_sum, $base_sum, "请输入正确的基础数量！", _base_sum === parseInt(_base_sum) && _base_sum > 0);
                    verificationTableData(_base_price, $base_price, "请输入正确的基础价格！", _base_price === parseFloat(_base_price) && _base_price >= 0);
                    verificationTableData(_incremental_sum, $incremental_sum, "请输入正确的增加数量！", _incremental_sum === parseInt(_incremental_sum) && _incremental_sum > 0);
                    verificationTableData(_incremental_price, $incremental_price, "请输入正确的增加价格！", _incremental_price === parseFloat(_incremental_price) && _incremental_price >= 0);
                    _data.itemList.push({
                        cityids: '0',
                        citytxts: '',
                        showtxt: "默认",
                        base_sum: _base_sum,
                        base_price: _base_price,
                        incremental_sum: _incremental_sum,
                        incremental_price: _incremental_price
                    });
                    $model_table.find("tr").each(function () {
                        var $this = $(this);
                        $base_sum = $this.find(".base_sum");
                        _base_sum = $base_sum.val() - 0;
                        $base_price = $this.find(".base_price");
                        _base_price = $base_price.val() - 0;
                        $incremental_sum = $this.find(".incremental_sum");
                        _incremental_sum = $incremental_sum.val() - 0;
                        $incremental_price = $this.find(".incremental_price");
                        _incremental_price = $incremental_price.val() - 0;
                        verificationTableData(_base_sum, $base_sum, "请输入正确的基础数量！", _base_sum === parseInt(_base_sum) && _base_sum > 0);
                        verificationTableData(_base_price, $base_price, "请输入正确的基础价格！", _base_price === parseFloat(_base_price) && _base_price >= 0);
                        verificationTableData(_incremental_sum, $incremental_sum, "请输入正确的增加数量！", _incremental_sum === parseInt(_incremental_sum) && _incremental_sum > 0);
                        verificationTableData(_incremental_price, $incremental_price, "请输入正确的增加价格！", _incremental_price === parseFloat(_incremental_price) && _incremental_price >= 0);
                        if ($this.data("cityList")) {
                            _data.itemList.push({
                                cityids: $this.data("cityList"),
                                citytxts: $this.data("cityListTxt"),
                                showtxt: $this.data("tableTxt"),
                                base_sum: _base_sum,
                                base_price: _base_price,
                                incremental_sum: _incremental_sum,
                                incremental_price: _incremental_price
                            });
                        }
                    });
                    postData.shipType.push(_data);
                });
                postData.shipType = JSON.stringify(postData.shipType);
                if ($(".errortxt").length || $(".errortxt_hook").length) {
                    return false;
                }
                $.ajax({
                    url: domains.item+'/api/logisticstemplate/add',
                    type: "post",
                    dataType: "json",
                    data: postData,
                    success: function (data) {
                        var $after;
                        if (data.success) {
                            postData.shipType = JSON.parse(postData.shipType);
                            if (postData.id) {
                                $page.find("li[data_id='" + postData.id + "']").remove();
                            }
                            postData.isparentopen = !!lib.queryString('isparentopen');
                            $after = $(modelItemHtml.render(postData));
                            $after.attr("data_id", data.id);
                            $page.find(".init_edit_model").closest("li").after($after);
                            $logistics_model_list.css({ "display": "block" });
                            $logistics_form.css({ "display": "none" });
                            verification.hideTips($logistics_form);
                            $page.find(".point").closest("li").remove();
                            $page.find(".modeldemo").closest("li").remove();
                        }
                    }
                });
                //console.log(postData);
            }
        };
        //显示登录弹窗
        var showLoginBox = function (msg) {
            var _content;
            if (!_loginBox) {
                _content = $('<div class="nologin_box"><p class="msg"><i class="wm_ico sigh2" style="margin: -5px 10px 0 0;"></i>' + (msg || '操作时间过长，请在<b>新页面重新登录</b>后再提交！') + '</p><a href="' + domains.account + '/Login?loginend=t" target="_blank" class="go_login">新页面登录</a></div>');
                _loginBox = box.alert({
                    content: _content,
                    btns: [],
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        this.wmBox.on("click", ".go_login", function () {
                            self.hide();
                        });
                    }
                });
            }
            if (msg) {
                _loginBox.setCon('<div class="nologin_box"><p class="msg"><i class="wm_ico sigh2" style="margin: -5px 10px 0 0;"></i>' + (msg || '操作时间过长，请在<b>新页面重新登录</b>后再提交！') + '</p><a href="' + domains.account + '/Login?loginend=t" target="_blank" class="go_login">新页面登录</a></div>');
            }
            _loginBox.show();
        };
        $page.on("click", ".init_edit_model", function () {
            $logistics_form.replaceWith(editHtml.render({}));
            $logistics_form = $(".logistics_form");
            area();
            verification.init();
            $logistics_model_list.css({ "display": "none" });
            $logistics_form.css({ "display": "block" });
            return false;
        });
        _createModelItem = function (isshow) {
            if ($page.find("[name='shipping_type']:checked").val() == "2") { return false; }
            var $this = $(this), $modelItem = $this.closest(".model_item"), $shipping_box = $modelItem.find(".shipping_box"), $tbody = $shipping_box.find("tbody");
            if (!$shipping_box.length) {
                $shipping_box = $([
                    '<div class="shipping_box">',
                        '<div class="default_shipping">',
                            '默认运费：<input type="text" class="form_txt w50 base_sum"/>件内，<input type="text" class="form_txt w50 base_price" />元，每增加<input type="text" class="form_txt w50  incremental_sum" />件，增加<input type="text" class="form_txt w50 incremental_price" />元',
                            //'默认运费：<input type="text" class="form_txt w50 base_sum" wmv="empty|positiveInteger" wmvmsg="基础数量不能为空！|基础数量格式不正确，请输入正整数！"/>件内，<input type="text" class="form_txt w50 base_price"  wmv="empty|positiveNumber" wmvmsg="基础价格不能为空！|基础价格格式不正确，请输入正数！"/>元，每增加<input type="text" class="form_txt w50  incremental_sum" wmv="empty|positiveInteger" wmvmsg="增加数量不能为空！|增加数量格式不正确，请输入正整数！"/>件，增加<input type="text" class="form_txt w50 incremental_price" wmvmsg="增加价格不能为空！|增加价格格式不正确，请输入正数！"/>元',
                        '</div>',
                        '<a href="#" class="addrow">为指定区域设置运费</a>',
                    '</div>'
                ].join(''));
                $tbody = $shipping_box.find("tbody");
                $shipping_box.on("click", ".addrow", function () {
                    var $this = $(this), $modelItem = $this.closest(".model_item"), $model_table = $modelItem.find(".model_table"), $tbody = $model_table.find("tbody");
                    if (!$model_table.length) {
                        $model_table = $([
                            '<table class="model_table" border="0" cellspacing="0">',
                                '<thead>',
                                    '<tr>',
                                        '<th class="w200">运送到</th>',
                                        '<th>首件(个)</th>',
                                        '<th>运费(元)</th>',
                                        '<th>续件(个)</th>',
                                        '<th>运费(元)</th>',
                                        '<th>操作</th>',
                                    '</tr>',
                                '</thead>',
                                '<tbody>',
                                '</tbody>',
                            '</table>'
                        ].join(''));
                        $tbody = $model_table.find("tbody");
                        $this.before($model_table);
                    }
                    $tbody.append([
                        '<tr>',
                            '<td><a href="#" class="editarea">编辑</a><p class="shipping_arealist">未添加地区</p></td>',
                            '<td><input type="text" class="form_txt w50 base_sum" /></td>',
                            '<td><input type="text" class="form_txt w50 base_price" /></td>',
                            '<td><input type="text" class="form_txt w50 incremental_sum" /></td>',
                            '<td><input type="text" class="form_txt w50 incremental_price" /></td>',
                            '<td><a href="#" class="del_row">删除</a></td>',
                        '</tr>'
                    ].join(''));
                    return false;
                });
                $modelItem.append($shipping_box);
            }
            if (isshow) {
                $shipping_box.show();
            } else {
                $shipping_box.hide();
            }
        };
        $page.on("change", "#express_delivery", function () {
            var $this = $(this);
            _createModelItem.call(this, $this.attr("checked"));
        });
        $page.on("change", "#EMS", function () {
            var $this = $(this);
            _createModelItem.call(this, $this.attr("checked"));
        });
        $page.on("change", "#surface", function () {
            var $this = $(this);
            _createModelItem.call(this, $this.attr("checked"));
        });
        $page.on("change", ".showbox", function () {
            verification.hideTips($(this).closest(".form_row"));
        });
        $page.on("click", ".editarea", function () {
            var $this = $(this), _areaBox = $this.data("areaBox"), $model_table = $this.closest(".model_table");
            if (!_areaBox) {
                _areaBox = new areaBox({
                    submitCallback: function () {
                        var txt = [], _submitData = [], _txtData = [], _provinceList = [], _province, _str = "", $tr;
                        var _data = this.getVal();
                        _province = _data.provinceList;
                        _data = _data.cityList;
                        for (var i in _province) {
                            _str += _province[i].id + ",";
                            _provinceList.push(_province[i].name);
                        }
                        for (i in _data) {
                            _submitData.push(_data[i].id);
                            _txtData.push(_data[i].name);
                            if (_str.indexOf(_data[i].id) < 0 && _str.indexOf(_data[i].id.substr(0, 2) + "00") < 0) {
                                _provinceList.push(_data[i].name);
                            }
                            txt.push('<span>' + _data[i].name + '</span>');
                        }
                        $tr = $this.closest("tr");
                        $this.closest("td").find(".shipping_arealist").empty().append(txt.join(','));
                        $tr.data("cityList", _submitData.join(','));
                        $tr.data("cityListTxt", _txtData.join(','));
                        $tr.data("tableTxt", _provinceList.join(','));
                    }
                });
                $this.data("areaBox", _areaBox);
            }
            _areaBox.show(function () {
                var _this = this;
                this.Box.find(".city_item:disabled").removeAttr("disabled");
                var $thisCitys = $this.closest("tr").data("cityList");
                if ($thisCitys) {
                    $thisCitys = $thisCitys.split(',');
                    for (var i in $thisCitys) {
                        _this.Box.find(".city_item[data_id='" + $thisCitys[i] + "']").attr("checked", "checked");
                    }
                }
                $model_table.find("tr").each(function () {
                    var $this = $(this);
                    var _data = ($this.data("cityList") || "").split(",");
                    for (var i in _data) {
                        _this.Box.find(".city_item[data_id='" + _data[i] + "']:not(:checked)").attr("disabled", "disabled");
                    }
                });
                this.provinceList.each(function () {
                    var $this = $(this),
                        city_itemLength = $this.find('.city_item').length,
                        checkedLength = $this.find('.city_item:checked').length;
                    //市级别全禁用，那么省也禁用
                    city_itemLength === $this.find('.city_item:disabled').length && $this.find(".province_item:not(:checked)").attr("disabled", "disabled");
                    //市级别全中，那么省也选中
                    city_itemLength === checkedLength && $this.find(".province_item").attr("checked", "checked").change();
                    //市级别没有全中，仅仅选中个数
                    checkedLength && $this.find(".sum").empty().append("("+checkedLength+")");
                });
                this.areaBoxList.each(function () {
                    var $this = $(this);
                    $this.find('.province_item').length === $this.find('.province_item:disabled').length && $this.find(".chkedsub:not(:checked)").attr("disabled", "disabled");
                    $this.find('.province_item').length === $this.find('.province_item:checked').length && $this.find(".chkedsub").attr("checked", "checked").change();
                });
            });
            return false;
        });
        $page.on("click", ".del_row", function () {
            var $this = $(this), $tr = $this.closest("tr"), $table = $tr.closest("table");
            var areaBox = $tr.find(".editarea").data("areaBox");
            areaBox && areaBox.empty();
            $tr.remove();
            $table.find("tr").length <= 1 && $table.remove();
            return false;
        });
        $page.on("click", ".save_btn", function () {
            lib.verificationLogin(function () {
                //判断权限
                var _role = lib.getRole(1);
                if (_role.key == 2) {
                    _submit();
                } else {
                    showLoginBox("登录账号为买家账号，<b>请重新登录</b>！");
                }
            }, showLoginBox);
            return false;
        });
        $page.on("click", ".ret_btn", function () {
            var $logistics_form = $(".logistics_form");
            $logistics_model_list.css({ "display": "block" });
            $logistics_form.css({ "display": "none" });
            verification.hideTips($logistics_form);
            return false;
        });
        $page.on("focus", ".errortxt_hook", function () {
            var $this = $(this);
            $this.removeClass("errortxt").removeClass("errortxt_hook");
            var errtips = $this.data("errtips");
            errtips && errtips.hide();
        });
        $page.on("click", "[name='shipping_type']", function (e) {
            if (confirm("变更运费承担者会导致下方运费信息重置，确定继续变更？")) {
                if ($page.find("[name='shipping_type']:checked").val() == "2") {
                    $page.find(".shipping_box").remove();
                }
                $page.find(".showbox").removeAttr("checked");
            } else {
                return false;
            }
            e.stopPropagation();
        });
        $page.on("click", ".selected", function () {
            var $this = $(this).closest("li");
            window.opener.setShipping($this.attr("data_id"), $this.find("b:eq(0)").html());
            window.close();
        });
        $page.on("click", ".update_model", function () {
            var $this = $(this);
            if ($.browser.msie && $.browser.version - 0 <= 7) {
                alert("IE7以下版本不支持修改运费模版！");
                return false;
            }
            updateId = $this.closest("li").attr("data_id");
            $.ajax({
                url: domains.api+'/logisticstemplate/get/' + updateId,
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    var $editHtml, _v, _i, _itemList, $ship_type, $model_item, $model_table, $lasttr, _txt = [], _showtxt;
                    if (data.id) {
                        $editHtml = $(editHtml.render(data));
                        area({ parent: $editHtml });
                        _v = data.districts;
                        $editHtml.find("#selProvince_rent").val(_v.substr(0, 2) + "0000").change();
                        $editHtml.find("#selCity_rent").val(_v.substr(0, 4) + "00").change();
                        $editHtml.find("#selDistricts_rent").val(_v).change();
                        $logistics_form.replaceWith($editHtml);
                        _v = data.shipType;
                        _i = _v.length;
                        while (_i--) {
                            $ship_type = $editHtml.find('[name="ship_type"][value="' + _v[_i].id + '"]');
                            $ship_type.click().change();
                            _itemList = _v[_i].itemList;
                            $model_item = $ship_type.closest(".model_item");
                            $model_table = $model_item.find(".model_table");
                            for (var i in _itemList) {
                                if (_itemList[i].cityids == "0") {
                                    $lasttr = $model_item.find(".default_shipping")
                                } else {
                                    $model_item.find(".addrow").click();
                                    if (!$model_table.length) {
                                        $model_table = $model_item.find(".model_table");
                                    }
                                    $lasttr = $model_table.find("tr:last");
                                    $lasttr.data("cityList", _itemList[i].cityids);
                                    $lasttr.data("cityListTxt", _itemList[i].citytxts);
                                    $lasttr.data("tableTxt", _itemList[i].showtxt);
                                }
                                $lasttr.find(".base_sum").val(_itemList[i].base_sum);
                                $lasttr.find(".base_price").val(_itemList[i].base_price);
                                $lasttr.find(".incremental_sum").val(_itemList[i].incremental_sum);
                                $lasttr.find(".incremental_price").val(_itemList[i].incremental_price);
                                _txt = [];
                                _showtxt = _itemList[i].showtxt.split(",");
                                for (var j in _showtxt) {
                                    _txt.push('<span>' + _showtxt[j] + '</span>');
                                }
                                $lasttr.find(".shipping_arealist").empty().append(_txt.join(","));
                            }
                        }
                        $logistics_form = $(".logistics_form");
                        verification.init();
                        $logistics_model_list.css({ "display": "none" });
                        $logistics_form.css({ "display": "block" });
                    }
                }
            });
            return false;
        });
        $page.on("click", ".del_model", function () {
            var $this = $(this), $box = $this.closest("li"), errorTips, confirm_del;
            confirm_del = $this.data("confirm_del");
            if (!confirm_del) {
                confirm_del = box.relyBox({
                    rely: $this,
                    boxCls: "confirm_del",
                    content: '<p class="relymsg">你确定要删除此运费模版？</p><p style="color:#b0b0b0">删除后将无法恢复！</p>',
                    btns: [
                       {
                           cls: "ui_btn_h22red10", res: "hide", text: "确定", callback: function () {
                               $.ajax({
                                   url: domains.api+"/LogisticsTemplate/mv/" + $box.attr("data_id"),
                                   type: "get",
                                   dataType: "jsonp",
                                   success: function (data) {
                                       if (data.success) {
                                           $box.remove();
                                       } else {
                                           errorTips = $this.data("errorTips");
                                           if (!errorTips) {
                                               errorTips = new tips({
                                                   ele: $this,
                                                   con: '<p>删除失败！</p><p>' + data.error + '</p>',
                                                   close: 5000,
                                                   offset: { left: 15 }
                                               });
                                               $this.data("errorTips", errorTips);
                                           }
                                           errorTips.show();
                                       }
                                   },
                                   error: function () {
                                       errorTips = $this.data("errorTips");
                                       if (!errorTips) {
                                           errorTips = new tips({
                                               ele: $this,
                                               con: '<p>删除失败！@码农赶紧处理！</p>',
                                               close: 5000,
                                               offset: { left: 15 }
                                           });
                                           $this.data("errorTips", errorTips);
                                       }
                                       errorTips.show();
                                   }
                               });

                           }
                       },
                       {
                           cls: "ui_btn_h22gray6", res: "hide", text: "取消", callback: function () { }
                       }
                    ]
                });
                $this.data("confirm_del", confirm_del);
            }
            confirm_del.show();
            return false;
        });
    };
    init();
});

