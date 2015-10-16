/*
社团分类
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    require('../css/style.css#');
    var _g_data;
    var _crowd_type = juicer([
        '<div class="crowd_type_main">',
            '<ul class="wm_form">',
                '<li class="form_row">',
                    '<label class="row_key">主要类型：</label>',
                    '<div class="floatleft">',
                        '<select class="form_sel type1">',
                            '<option value="0">-请选择-</option>',
                        '</select>',
                        '<select class="form_sel type2">',
                            '<option value="0">-请选择-</option>',
                        '</select>',
                    '</div>',
                '</li>',
            '</ul>',
            '<fieldset>',
                '<legend>次要类型<span class="remark">可以选择2个次要类型</span></legend>',
                '<div class="sub_type">',
                    '<ul class="wm_form">',
                        '{@each data as item}',
                        '<li class="form_row" data_id="${item.id}" data_name="${item.categoryName}">',
                            '<label class="row_key">${item.categoryName}：</label>',
                            '<ul class="floatleft sub_list">',
                                '{@each item.childs as subitem}',
                                    '<li class="type_item" data_id="${subitem.id}" data_name="${subitem.categoryName}"><span class="iconfont">&#xe62a;</span><span class="type_name">${subitem.categoryName}</span></li>',
                                '{@/each}',
                            '</ul>',
                        '</li>',
                        '{@/each}',
                    '</ul>',
                '</div>',
            '</fieldset>',
            '<div class="btns">',
                '<a href="#" class="ui_btn ui_btn_h26blue2 submit"><span class="ui_btn_txt">确定</span></a>',
                '<a href="#" class="ui_btn ui_btn_h26white6 close"><span class="ui_btn_txt">取消</span></a>',
            '</div>',
        '</div>'
    ].join(''));
    var _getData = function (op) {
        if (_g_data) {
            typeof op.success === "function" && op.success(_g_data);
            return false;
        }
        $.ajax({
            url: domains.commune + "/asyn/commune/all_category.json",
            dataType: "jsonp",
            success: function (data) {
                _g_data = data;
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };

    var _showBox = function (op) {
        return box.alert({
            boxCls: 'crowd_box crowd_type',
            titleText: '帮社类型',
            content: '',
            btns: [],
            callback: function () {
                var self = this;
                this.close = this.hide;
                var $sub_type;
                _getData({
                    success: function (data) {
                        var $op, $type1, $type2;
                        if (data.response) {
                            self.setCon(_crowd_type.render(data.response));
                            self.position();
                            //下拉框联动，后端语言限制比较恶心，用了恶心的方式联动
                            $type1 = self.wmBox.find(".type1");
                            for (var i in data.response.data) {
                                $op = $('<option value="' + data.response.data[i].id + '">' + data.response.data[i].categoryName + '</option>');
                                $op.data("data_subdata", data.response.data[i].childs);
                                $type1.append($op);
                            }
                        } else {
                            alert("系统繁忙！");
                        }                       
                        $type1.on("change", function () {
                            _append = ['<option>-请选择-</option>'];
                            var $this = $(this), _v = $this.val(), _data = $this.find(":selected").data("data_subdata");
                            for (i in _data) {
                                _append.push('<option value="' + _data[i].id + '">' + _data[i].categoryName + '</option>');
                            }
                            if (!$type2) {
                                $type2 = self.wmBox.find(".type2");
                            }
                            $type2.empty().append(_append.join(''));
                        });
                        self.selSelect = function (id) {
                            $type1.val((id + "").substr(0, 2) + "000").change();
                            setTimeout(function () {
                                $type2.val(id);
                            }, 100)
                        };
                        self.chkSubType = function (ids) {
                            if (!$sub_type) {
                                $sub_type = self.wmBox.find(".sub_type");
                            }
                            for (var i in ids) {
                                $sub_type.find(".type_item[data_id='" + ids[i] + "']").addClass("curr");
                            }
                        };
                        typeof op.success === "function" && op.success.call(self, data);
                    },
                    error: function () { }
                });
                this.wmBox.on("click", ".type_item", function () {
                    var $this = $(this);
                    $this.toggleClass("curr");
                    return false;
                });
                this.wmBox.on("click", ".submit", function () {
                    var postData = {}, $type2 = self.wmBox.find(".type2");
                    postData.protagonist = {
                        id: $type2.val(),
                        name: $.trim($type2.find("option:selected").html())
                    }
                    postData.supporting = [];
                    postData.supportingNames = [];
                    postData.supportingIds = [];
                    if (!$sub_type) {
                        $sub_type = self.wmBox.find(".sub_type");
                    }
                    $sub_type.find(".type_item.curr").each(function () {
                        var $this = $(this);
                        postData.supporting.push({
                            id: $this.attr("data_id"),
                            name: $this.attr("data_name")
                        });
                        postData.supportingNames.push($this.attr("data_name"));
                        postData.supportingIds.push($this.attr("data_id"));
                    });
                    postData.supporting.length > 2 && alert("选择的次要类型大于2项");
                    typeof op.submit === "function" && op.submit.call(self, postData);
                    return false;
                });
                typeof op.callback === "function" && op.callback.call(this);
            }
        });
    };
    exports.showBox = function (op) {
        return _showBox($.extend({}, op));
    };
    exports.getData = function (op) {
        _getData($.extend({}, op));
    };
});