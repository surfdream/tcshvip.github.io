define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');

    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        juicer = require('http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js'),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
        verification = require('http://s.tcsh.me/tcsh/model/wmverification/dist/wmverification.js'),
        tips = require('http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js'),
        area = require('http://s.tcsh.me/tcsh/model/wmarea/dist/wmarea.js');
    require("../css/style.css#");
    var v_login = function (callback) {

    };
    verification.addRule([
            {
                key: "selEmpty", fun: function () {
                    return !!(this.val() - 0);
                }
            },
            {
                key: "landline", fun: function () {
                    return true;
                }
            }
    ]);
    var _addadBox, newAddressData, showCallBack, saveCallBack;
    var _add = function (op) {
        $.ajax({
            url: op.isSend ? (domains.sell+'/logistics/add') : (domains.member+'/action/addDelivery'),
            type: op.type || "get",
            dataType: op.dataType || "jsonp",
            data: op.data,
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function (e) {
                typeof op.error === "function" && op.error(e);
            }
        });
    };
    var _update = function (op) {
        $.ajax({
            url: op.isSend ?(domains.sell+ '/logistics/update' ):(domains.member+ '/action/updateDelivery'),
            type: op.type || "get",
            dataType: op.dataType || "jsonp",
            data: op.data,
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function (e) {
                typeof op.error === "function" && op.error(e);
            }
        });
    };
    var _del = function (op) {
        $.ajax({
            url: domains.member+'/action/deleteDelivery',
            type: "get",
            dataType: "jsonp",
            data: {
                id: op.id
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function (e) {
                typeof op.error === "function" && op.error(e);
            }
        });
    };
    var _setdefault = function (op) {
        $.ajax({
            url: domains.member+'/action/Delivery/setdefault',
            type: "get",
            dataType: "jsonp",
            cache: false,
            data: { id: op.id },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function (e) {
                typeof op.error === "function" && op.error(e);
            }
        });
    };
    var _setSendDefault = function (op) {
        $.ajax({
            url: domains.sell+'/logistics/defaultShipping',
            type: op.type || "get",
            dataType: op.dataType || "json",
            cache: false,
            data: { id: op.id },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function (e) {
                typeof op.error === "function" && op.error(e);
            }
        });
    };
    var _setReturnDefault = function (op) {
        $.ajax({
            url: domains.sell+'/logistics/defaultReturn',
            type: op.type || "get",
            dataType: op.dataType || "json",
            cache: false,
            data: { id: op.id },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function (e) {
                typeof op.error === "function" && op.error(e);
            }
        });
    };
    var _createAddadBoxCon = function (isSend) {
        var _html = [
                '<form class="wm_form">',
                    '<ul>',
                        (isSend ? '<li class="form_row"><label class="row_key">公司名称：</label><input type="text" name="CompanyName" class="form_txt company_name" wmv="max:20" wmvmsg="公司名称不得大于20！"></li>' : ''),
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>所在地区：</label>',
                            //'<label class="plr10">省</label>',
                            '<select class="form_sel" id="selProvince_rent"><option>-请选择-</option></select>',
                            //'<label class="plr10">市</label>',
                            '<select class="form_sel" id="selCity_rent"><option>-请选择-</option></select>',
                            //'<label class="plr10">区</label>',
                            '<select class="form_sel" id="selDistricts_rent" wmv="selEmpty" wmvmsg="所在地区请精确到地区！"><option>-请选择-</option></select>',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>街道地址：</label>',
                            '<textarea class="form_textarea w440 textarea_address" wmv="empty|max:20" wmvmsg="请填写详细地址！|只能输入20个字"></textarea>',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>邮编：</label>',
                            '<input type="text" class="form_txt w80 chinazip" wmv="empty|chinaZip" wmvmsg="邮编不能为空！|请输入正确的邮编！" />',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>' + (isSend ? "发货" : "收货") + '人姓名：</label>',
                            '<input type="text" class="form_txt consignee_name" wmv="empty" wmvmsg="请输入' + (isSend ? "发货" : "收货") + '人姓名！" />',
                        '</li>',
                         '<li class="form_row">',
                            '<label class="row_key"><b class="form_must">*</b>手机：</label>',
                            '<input type="text" class="form_txt phone" wmv="phone" wmvmsg="请输入正确的手机号！"/>',
                        '</li>',
                         '<li class="form_row">',
                            '<label class="row_key">电话：</label>',
                            '<input type="text" class="form_txt w30 landline_code1" placeholder="区号"/> - ',
                            '<input type="text" class="form_txt w80 landline_code2"  placeholder="号码" /> - ',
                            '<input type="text" class="form_txt w30 landline_code3"  placeholder="分号" wmv="landline" wmvmsg="正确的座机号，座机号格式：区号-号码"/>',
                        '</li>',
                        (isSend ? '' : ('<li class="form_row">',
                           '<label class="row_key">&nbsp;</label>',
                           '<input type="checkbox" name="isdefault" id="isdefault">',
                           '<label class="chk_key" for="isdefault">设为默认</label>',
                        '</li>')),
                        '<li class="form_row form_btns">',
                            '<label class="row_key">&nbsp;</label>',
                            '<span href="#" class="ui_btn ui_btn_h37red13">',
                                '<input type="submit" class="ui_btn_txt box_submit" value="确 定" /></span>',
                            '<a href="#" class="ui_btn ui_btn_h37gray12 close">',
                            '<span class="ui_btn_txt" >取 消</span></a>',
                        '</li>',
                    '</ul>',
                '</form>'].join('');
        _html = $(_html);
        var _r = parseInt(Math.random() * 999) + 100;
        _html.find("#isdefault").attr("id", "isdefault" + _r);
        _html.find("[for='isdefault']").attr("for", "isdefault" + _r);
        return _html;
    };
    var _getData = function () {
        var _id = this.attr("data_id");
        newAddressData = {};
        if (_id) {
            newAddressData.id = _id;
        }
        $selProvince = this.find("#selProvince_rent");
        $selCity = this.find("#selCity_rent");
        $selDistricts = this.find("#selDistricts_rent");
        newAddressData.ProvinceTxt = $selProvince.find(":selected").html();
        newAddressData.CityTxt = $selCity.find(":selected").html();
        newAddressData.DistrictsTxt = $selDistricts.find(":selected").html();
        newAddressData.areaCode = $selDistricts.val();
        newAddressData.address = this.find(".textarea_address").val();
        newAddressData.areaTxt = (newAddressData.ProvinceTxt + " " + newAddressData.CityTxt + " " + newAddressData.DistrictsTxt + newAddressData.address).replace(/请选择/g, "");
        newAddressData.chinaZip = this.find(".chinazip").val();
        newAddressData.consigneeName = this.find(".consignee_name").val();
        landline_code = this.find(".landline_code1").val();
        landline_code += ("-" + this.find(".landline_code2").val());
        landline_code += ("-" + this.find(".landline_code3").val());
        newAddressData.landlineCode = landline_code === "--" ? "" : landline_code;
        newAddressData.phone = this.find(".phone").val();
        newAddressData.isDefault = !!this.find("[name='isdefault']:checked").length;
        newAddressData.company_name = this.find(".company_name").val()
    };
    var _init = function (op) {
        var _op = $.extend({
            ele: null,
            titleText: '添加新地址',
            event: 'click',
            saveCallBack: function () { },
            showCallBack: function () { }
        }, op);
        if (typeof op === "string") {
            _op.ele = $(op);
        }
        if (op instanceof $) {
            _op.ele = op;
        }
        _bind(_op);
    };
    var _show = function (_op) {
        var _html;
        saveCallBack = typeof _op.saveCallBack === "function" ? _op.saveCallBack : null;
        showCallBack = typeof _op.showCallBack === "function" ? _op.showCallBack : null;
        if (!_addadBox) {
            _html = _createAddadBoxCon(_op.isSend);
            _addadBox = box.alert({
                boxCls: "ad_box addad_box",
                titleText: _op.titleText,
                content: _html,
                callback: function () {
                    var _this = this;
                    area({ parent: _html });
                    this.close = function () {
                        _this.hide();
                        _this.wmBox.find('[wmv]').each(function () {
                            var errTips = $(this).data("errTips");
                            errTips && errTips.hide();
                        });
                    };
                    verification.minZIndex = this.wmBox.css("zIndex");
                    verification.init();
                    $(window).on("scroll.rely", function () {
                        _this.wmBox.find("[wmv][iserr='t']").each(function () {
                            var errTips = $(this).data("errTips");
                            errTips && errTips.position();
                        });
                    });
                    this.wmBox.on("click.submit", ".box_submit", function () {
                        var $this = $(this);
                        var landline_code = "", $selProvince, $selCity, $selDistricts, postData, phoneErrorTips;
                        if (verification.verify(_html)) {
                            _getData.call(_this.wmBox);
                            //newAddressData.id = parseInt(Math.random() * 999) + 100;
                            postData = {
                                receiver: encodeURIComponent(newAddressData.consigneeName),
                                zone: newAddressData.areaCode,
                                address: encodeURIComponent(newAddressData.address),
                                postcode: newAddressData.chinaZip,
                                mobilephone: newAddressData.phone,
                                telphone: newAddressData.landlineCode,
                                remark: encodeURIComponent(newAddressData.ProvinceTxt + " " + newAddressData.CityTxt + " " + newAddressData.DistrictsTxt),
                                company_name: encodeURIComponent(newAddressData.company_name)
                            };
                            if (newAddressData.isDefault) {
                                postData.isdefault = true;
                            }
                            if (!postData.mobilephone && !postData.telphone) {
                                phoneErrorTips = $this.data("phoneErrorTips");
                                if (!phoneErrorTips) {
                                    phoneErrorTips = new tips({
                                        ele: _this.wmBox.find(".phone"),
                                        con: '手机和座机必选一个',
                                        skin: "red2",
                                        close: 2000,
                                        minIndex: _this.zIndex + 10,
                                        direction: "rt",
                                        offset: { left: 15 }
                                    });
                                    $this.data("phoneErrorTips", phoneErrorTips);
                                }
                                phoneErrorTips.show();
                                return false;
                            }
                            if (!newAddressData.id) {
                                _add({
                                    type: _op.type,
                                    isSend: _op.isSend,
                                    data: postData,
                                    dataType: _op.dataType,
                                    success: function (data) {
                                        if (data.response) {
                                            newAddressData.id = data.response.Id;
                                            typeof saveCallBack === "function" && saveCallBack(newAddressData);
                                        }
                                    }
                                });
                            } else {
                                postData.Id = newAddressData.id;
                                _update({
                                    type: _op.type,
                                    isSend: _op.isSend,
                                    data: postData,
                                    dataType:_op.dataType,
                                    success: function (data) {
                                        typeof saveCallBack === "function" && saveCallBack(newAddressData);
                                    }
                                });
                            }

                            _this.hide();
                        }
                        return false;
                    });
                },
                btns: []
            });
        }
        _addadBox.wmBox.find(".form_sel").val(0);
        _addadBox.wmBox.find(".form_txt").val('');
        _addadBox.wmBox.find(":checked").removeAttr("checked");
        _addadBox.wmBox.find(".form_textarea").val('');
        _addadBox.show();
        _addadBox.setTitle(_op.titleText);
        if (_op.id) {
            _addadBox.wmBox.attr("data_id", _op.id);
        } else {
            _addadBox.wmBox.removeAttr("data_id");
        }
        typeof showCallBack === "function" && showCallBack.call(_addadBox);
    };
    var _bind = function (_op) {
        _op.ele[_op.event](function () {
            _show(_op);
            return false;
        });
    };
    exports.init = function (op) {
        _init(op);
    };
    exports.show = function (op) {
        _show(op);
    };
    exports.ajaxAdd = function (op) {
        _add(op);
    };
    exports.ajaxUpdate = function (op) {
        _update(op);
    };
    exports.ajaxDel = function (op) {
        _del(op);
    };
    exports.ajaxSetDefault = function (op) {
        _setdefault(op);
    };
    exports.ajaxSetSendDefault = function (op) {
        _setSendDefault(op);
    };
    exports.ajaxSetReturnDefault = function (op) {
        _setReturnDefault(op);
    };
});
