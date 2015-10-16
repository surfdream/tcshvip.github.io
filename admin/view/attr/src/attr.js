define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        juicer = require('juicer');

    var _init,/*私有初始化*/
        $page,/*页面内容全局*/
        maxSequence,/*排序*/
        _showResulthtml,/*各类型html模板*/
        _attrVals,/*每项html模版*/
        postJson,/*数据提交前端集合*/
        showResult,/*取数据*/
        showResultType,/*选项行*/
        _disabledInset,/*禁用创建*/
        _retstInst,/*重置创建*/
        _showList,/*显示属性列表*/
        _createPubAttr,
        _adminConfig = {};
    $page = $("#page");
    maxSequence = 0;
    _showResulthtml = {
        "sel": juicer('<option value=${value}>${name}</option>'),
        "chk": juicer('<span class="attr_item"><input type="checkbox" name="${name}" id="${value}" value=${value}><label class="chk_key" for="${value}">${name}</label></span>'),
        "rid": juicer('<span class="attr_item"><input type="radio"  name="${name}" id="${value}" value=${value}><label class="rad_key" for="${value}">${name}</label></span>'),
        "txt": '<input type="text" id="">'
    };
    _attrVals = juicer([
            '<li class="form_row sel_item">',
               '<label class="row_key w150"><b>${attrName}</b>的选择项：</label>',
               '<input type="text" class="form_txt item_text" placeholder="选择项名称"> <input type="text" class="form_txt w50 txt_sequence"  placeholder="排序" value=${sequence}> ',
               '<a href="#" class="btn25_25 add_item">+</a> <a href="#" class="btn25_25 remove_item">-</a> ',
            '</li>'].join(''));
    postJson = {};
    postJson.itemList = [];
    showResult = function () {
        postJson.itemList = [];
        $(".sel_item:not(.other)").each(function (i) {
            var $this = $(this), _item_text = $this.find(".item_text").val();
            if (_item_text) {
                postJson.itemList.push({ code: _item_text, sort: $this.find(".txt_sequence").val(), type: _adminConfig.select[$this.attr("key")], id: $this.attr("data-id") });
            }
        });
        postJson.otherAttr = [];
        $(".other").each(function () {
            var $this = $(this), _item_text = $this.find(".item_text").val();
            if (!_item_text && !$this.find(".item_text").length) {
                _item_text = $this.find(":checkbox:checked").length + "";
            }
            if (_item_text) {
                postJson.otherAttr.push({ code: _item_text, type: _adminConfig.select[$this.attr("key")], id: $this.attr("data-id") });
            }
        });
    };
    showResultType = {
        "sel": function (attrName) {
            return '<li class="form_row" data-key="' + attrName + '" data-type="sel"><a href="#" class="ui_btn ui_btn_h19gray3 del"><span class="ui_btn_txt">删除</span></a><a href="#" class="ui_btn ui_btn_h19gray3 update"><span class="ui_btn_txt">修改</span></a><label class="row_key">' + attrName + '：</label><select class="form_sel showEle"></select></li>';
        },
        "chk": function (attrName) {
            return '<li class="form_row showEle"  data-key="' + attrName + '"  data-type="chk"><a href="#" class="ui_btn ui_btn_h19gray3 del"><span class="ui_btn_txt">删除</span></a><a href="#" class="ui_btn ui_btn_h19gray3 update"><span class="ui_btn_txt">修改</span></a><label class="row_key">' + attrName + '：</label><div class="item_list"></div></li>';
        },
        "rid": function (attrName) {
            return '<li class="form_row showEle"  data-key="' + attrName + '"  data-type="rid"><a href="#" class="ui_btn ui_btn_h19gray3 del"><span class="ui_btn_txt">删除</span></a><a href="#" class="ui_btn ui_btn_h19gray3 update"><span class="ui_btn_txt">修改</span></a><label class="row_key">' + attrName + '：</label><div class="item_list"></div></li>';
        },
        "txt": function (attrName) {
            return '<li class="form_row showEle"  data-key="' + attrName + '"  data-type="txt"><a href="#" class="ui_btn ui_btn_h19gray3 del"><span class="ui_btn_txt">删除</span></a><a href="#" class="ui_btn ui_btn_h19gray3 update"><span class="ui_btn_txt">修改</span></a><label class="row_key">' + attrName + '：</label></li>';
        }
    };
    _disabledInset = function () {
        var $form_row = $(this),
            $confirm_attr_name = $form_row.find(".confirm_attr_name"),
            $attr_name = $form_row.find(".attr_name"),
            $attr_show_type = $form_row.find(".attr_show_type");
        $attr_name.attr("disabled", "disabled");
        $attr_show_type.attr("disabled", "disabled");
        $confirm_attr_name.attr("class", "confirm_attr_name_disabled").css({ visibility: "hidden" });
    };
    _retstInst = function () {
        var $form_row = $(this),
            $confirm_attr_name = $form_row.find(".confirm_attr_name_disabled"),
            $attr_name = $form_row.find(".attr_name"),
            $attr_show_type = $form_row.find(".attr_show_type");
        $attr_name.removeAttr("disabled").val('');
        $attr_show_type.removeAttr("disabled");
        $confirm_attr_name.attr("class", "ui_btn ui_btn_h23yellow8 confirm_attr_name").css({ visibility: "visible" });
    };
    _showList = function (data) {
        var $listBox = $("#listBox"), _data, _html;
        $listBox.empty();
        for (var i in data) {
            var $append = $(showResultType[data[i].type](data[i].name));
            $append.data("itemList", data[i].itemList);
            $append.data("otherAttr", data[i].otherAttr);
            $append.attr("data-id", data[i].id)
            if (data[i].type == "txt") {
                _html = $(_showResulthtml['txt']);
                _data = data[i].itemList;
                for (var j in _data) {
                    _html.attr(_adminConfig.select[_data[j].type], _data[j].name)
                }
                $append.append(_html);
            } else {
                if (data[i].type == "sel") {
                    for (var _i in data[i].itemList) {
                        $append.find(".form_sel").append(_showResulthtml[data[i].type].render(data[i].itemList[_i]));
                    }
                } else {
                    var crname = Math.random() * 1000;
                    for (var _i in data[i].itemList) {
                        $append.find(".item_list").append(_showResulthtml[data[i].type].render($.extend({ crname: crname, _id: "id_" + Math.random() * 1000 }, data[i].itemList[_i])));
                    }
                }
            }
            $listBox.append($append);
        }
    };
    _init = function (data) {
        if (!_adminConfig) {
            _adminConfig = {}
        }
        for (var i in adminConfig) {
            _adminConfig[i] = adminConfig[i];
            for (var j in adminConfig[i]) {
                adminConfig[i][adminConfig[i][j]] = j;
            }
        }
        $.ajax({
            url:domains.api+ "/select/get",
            type: "get",
            dataType: "jsonp",
            timeout: 5000,
            success: function (data) {
                _showList(data);
            }, error: function () {
                alert("getAttrList  Error ! The data goes false data");
            }
        });
    };
    _createPubAttr = function () {
        return [
            '<li class="form_row sel_item other" key="wmv">',
                '<label class="row_key w150">验证配置：</label>',
                '<input type="text" class="form_txt item_text wmv_text" placeholder="验证类型，特殊验证类型需要与程序员沟通，不用验证，可不填！">',
            '</li>',
            '<li class="form_row sel_item other" key="wmvmsg">',
                '<label class="row_key w150">验证提示配置：</label>',
                '<input type="text" class="form_txt item_text wmvmsg_text" placeholder="上述验证失败后的提示文案！，没有可不填">',
            '</li>'
        ].join('');
    };
    _createPrivateAttr = {
        'txt': [
            '<li class="form_row sel_item other" key="placeholder">',
                '<label class="row_key w150">placeholder配置：</label>',
                '<input type="text" class="form_txt item_text placeholder_text" placeholder="placeholder配置">',
            '</li>'
        ].join(''),
        'chk': [
            '<li class="form_row sel_item other" key="upimg">',
                '<label class="row_key w150">是否上传：</label>',
                '<input type="checkbox"><label class="chk_key">是</label>',
            '</li>'
        ].join(''),
        'sel': '',
        'rid': ''
    };
    $page.on("click", ".confirm_attr_name", function () {
        var $this = $(this);
        var _data = {}, $attr_name = $this.closest(".form_row").find(".attr_name"),
            $attr_show_type = $this.closest(".form_row").find(".attr_show_type"),
            $ul;
        _data.attrName = postJson.name = $.trim($attr_name.val());
        if (_data.attrName) {
            _data.sequence = ++maxSequence;
            postJson.type = $attr_show_type.val();
            _disabledInset.call($this.closest(".form_row"));
            $ul = $this.closest("ul");
            $ul.append(_createPubAttr());
            if (postJson.type == "txt") {
                $ul.append(_createPrivateAttr['txt']);
                return false;
            } else {
                $ul.append(_createPrivateAttr[postJson.type]);
                $ul.append(_attrVals.render(_data));
                return false;
            }
        } else {
            alert("属性名不能为空!")
        }
    });
    $page.on("click", ".add_item", function () {
        var $this = $(this), $append = $this.closest(".form_row").clone(), $txt_sequence = $(".txt_sequence");
        $append.removeAttr("data-id");
        $txt_sequence.each(function () {
            maxSequence = Math.max(maxSequence, $(this).val() - 0)
        });
        $append.find(".form_txt").val('');
        $append.find(".txt_sequence").val(maxSequence + 1);
        $this.closest("ul").append($append);
        return false;
    });
    $page.on("click", ".remove_item", function () {
        var $this = $(this);
        $this.closest(".form_row").slideUp(function () {
            $(this).remove();
        });
        return false;
    });
    $page.on("click", ".submit", function () {
        var $this = $(this);
        showResult();
        postJson.name = $(".attr_name").val();
        postJson.type = $(".attr_show_type").val();
        if (postJson.type != "txt" && !postJson.itemList.length || !postJson.name) { return; }
        $.ajax({
            url:domains.z+ "/api/select/" + (postJson.id ? "update" : "add"),
            data: {
                id: postJson.id,
                name: postJson.name,
                type: postJson.type,
                itemList: JSON.stringify(postJson.itemList),
                otherAttr: JSON.stringify(postJson.otherAttr)
            },
            type: "post",
            dataType: "json",
            success: function (data) {
                window.location.href = window.location.href
            }, error: function () {
                alert("getAttrList  Error !");
            }
        });
        maxSequence = 0;
        $(".addattr .sel_item").remove();
        _retstInst.call($(".form_row:eq(0)"));
        return false;
    });
    $page.on("click", ".update", function () {
        var $this = $(this),
            $row = $this.closest('.form_row'),
            $instbox = $(".form_row:eq(0)"),
            $name = $instbox.find(".attr_name"),
            $sel = $instbox.find(".attr_show_type"),
            $confirm_attr_name = $instbox.find(".confirm_attr_name"),
            $setattr = $("#setattr"),
            $other,
            _html,
            data = {};
        if (!$confirm_attr_name.length) {
            $confirm_attr_name = $instbox.find(".confirm_attr_name_disabled");
        }
        data.name = $row.attr("data-key");
        data.type = $row.attr("data-type");
        data.itemList = $row.data("itemList");
        data.otherAttr = $row.data("otherAttr");
        postJson.id = $row.attr("data-id");
        maxSequence = 0;
        $(".addattr .sel_item").remove();
        _retstInst.call($instbox);
        $name.val(postJson.name = data.name);
        $sel.val(postJson.type = data.type);
        $confirm_attr_name.attr("class", "confirm_attr_name_disabled").css({ visibility: "hidden" });
        $setattr.append(_createPubAttr());
        if (data.type == "txt") {
            $setattr.append(_createPrivateAttr['txt']);
            for (var i in data.itemList) {
                _html.find("." + _adminConfig.select[data.itemList[i].type] + "_text").val(data.itemList[i].name);
            }
            $setattr.append(_html);
            $sel.attr("disabled", "disabled");
        } else {
            $setattr.append(_createPrivateAttr[data.type]);
            for (i in data.itemList) {
                var $append = $(_attrVals.render({ attrName: data.name }));
                $append.attr("data-id", data.itemList[i].value);
                $append.find('.item_text').val(data.itemList[i].name);
                $append.find('.txt_sequence').val(data.itemList[i].sequence);
                $setattr.append($append);
            }
            $sel.find("[value='txt']").attr("disabled", "disabled");
        }
        for (var i in data.otherAttr) {
            $other = $setattr.find(".other[key='" + adminConfig.select[data.otherAttr[i].type] + "']");
            if ($other.find(".item_text").length) {
                $other.find(".item_text").val(data.otherAttr[i].name);
            } else if ($other.find(":checkbox").length) {
                if (data.otherAttr[i].name - 0) {
                    $other.find(":checkbox").attr("checked", "checked");
                }
            }
          
        }
        return false;
    });
    $page.on("click", ".del", function () {
        var $this = $(this), key = $this.closest(".form_row").attr("data-id");
        if (confirm("确定要删除吗？")) {
            $.ajax({
                url: domains.api+"/select/delete/" + key,
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    _init();
                }, error: function () {
                    alert("getAttrList  Error !");
                }
            });
        }
        return false;
    });
    $page.on("click", ".cancel", function () {
        window.location.href = window.location.href;
        return false;
    });
    _init();

});


