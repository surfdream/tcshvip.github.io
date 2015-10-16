define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        juicer = require('juicer');
    var _init,/*私有初始化*/
        $page,/*页面内容全局*/
        _showResulthtml,/*各类型html模板*/
        showResultType,/*选项行*/
        maxgroupIndex = 0,
        _groupHtml,/*组模版*/
        _groupItemHtml,/*组-项模版*/
        _showList,/*显示属性列表*/
        _showGroupList,/*显示分组列表*/
        getAttrList,/*获取属性列表*/
        getGroupList,/*或者分组列表*/
        _adminConfig = {};
    var _attrData;
    $page = $("#page");
    _showResulthtml = {
        "sel": juicer('<option value=${value}>${name}</option>'),
        "chk": juicer('<span class="attr_item"><input type="checkbox" name="${name}" id="${value}" value=${value}><label class="chk_key" for="${value}">${name}</label></span>'),
        "rid": juicer('<span class="attr_item"><input type="radio"  name="${name}" id="${value}" value=${value}><label class="rad_key" for="${value}">${name}</label></span>'),
        "txt": '<input type="text" id="">'
    };
    showResultType = {
        "sel": function (attrName) {
            return '<li class="form_row" data-key="' + attrName + '"><input type="checkbox" name=group  class="groupcheck"><input type="text"  class="groupindex" disabled="disabled"><label class="row_key">' + attrName + '：</label><select class="form_sel showEle"></select></li>';
        },
        "chk": function (attrName) {
            return '<li class="form_row showEle"  data-key="' + attrName + '"><input type="checkbox" name=group class="groupcheck"><input type="text"  class="groupindex" disabled="disabled"><label class="row_key">' + attrName + '：</label><div class="item_list"></div></li>';
        },
        "rid": function (attrName) {
            return '<li class="form_row showEle"  data-key="' + attrName + '"><input type="checkbox" name=group class="groupcheck"><input type="text"  class="groupindex" disabled="disabled"><label class="row_key">' + attrName + '：</label><div class="item_list"></div></li>';
        },
        "txt": function (attrName) {
            return '<li class="form_row showEle"  data-key="' + attrName + '"><input type="checkbox" name=group class="groupcheck"><input type="text"  class="groupindex" disabled="disabled"><label class="row_key">' + attrName + '：</label></li>';
        }
    };
    _groupItemHtml = {
        "sel": function (id, name) {
            return '<li class="form_row" data-key="' + id + '"><label class="row_key">' + name + '：</label><select class="form_sel showEle"></select></li>';
        },
        "chk": function (id, name) {
            return '<li class="form_row showEle"  data-key="' + id + '"><label class="row_key">' + name + '：</label><div class="appendbox"></div></li>';
        },
        "rid": function (id, name) {
            return '<li class="form_row showEle"  data-key="' + id + '"><label class="row_key">' + name + '：</label><div class="appendbox"></div></li>';
        },
        "txt": function (id, name) {
            return '<li class="form_row showEle"  data-key="' + id + '"><label class="row_key">' + name + '：</label><div class="appendbox"></div></li>';
        }
    };
    _groupHtml = juicer('<ul><li class="groupname"><h3>${type}-${name}</h3></li><li class="btns"><a href="#" class="ui_btn ui_btn_h27gray8 updatebtn"><span class="ui_btn_txt">Update</span></a><a href="#" class="ui_btn ui_btn_h27gray8 delbtn"><span class="ui_btn_txt">Del</span></a></li></ul>');
    _showGroupList = function (data) {
        var $group_box = $(".group_box");
        $group_box.empty();
        for (var i in data) {
            var $groupItem = $(_groupHtml.render({ name: data[i].name, type: _adminConfig.group[data[i].type] }));
            $groupItem.data("groupItemData", data[i]);
            for (var j in data[i].itemList) {
                //_showList(groupItemAttrBox, groupItemAttrData, _groupItemHtml, _showResulthtml);
                var groupItemAttrData = _attrData[data[i].itemList[j].value];
                if (groupItemAttrData) {
                    var groupItemAttrBox = $(_groupItemHtml[groupItemAttrData.type](data[i].itemList[j].value, data[i].itemList[j].name));
                    if (groupItemAttrData.itemList.length) {
                        for (var x in groupItemAttrData.itemList) {
                            if (groupItemAttrData.type == "sel") {
                                groupItemAttrBox.find(".form_sel").append(_showResulthtml[groupItemAttrData.type].render(groupItemAttrData.itemList[x]));
                            }
                            else {
                                groupItemAttrBox.find(".appendbox").append(_showResulthtml[groupItemAttrData.type].render(groupItemAttrData.itemList[x]));
                            }
                        }
                    } else {
                        groupItemAttrBox.find(".appendbox").html(_showResulthtml[groupItemAttrData.type]);
                    }
                    $groupItem.append(groupItemAttrBox);
                }
            }
            $group_box.append($groupItem)
        }
    };
    _showList = function ($listBox, data, liModel, itemModel) {
        //var $listBox = $("#listBox");
        var _html, _data;

        $listBox.empty();
        for (var i in data) {
            var $append = $(liModel[data[i].type](data[i].name));
            $append.data("itemList", data[i].itemList);
            $append.attr("data-select-id", data[i].id)
            if (data[i].type == "txt") {
                _html = $(_showResulthtml['txt']);
                _data = data[i].itemList;
                for (var j in _data) {
                    _html.attr(_adminConfig.select[_data[j].type], _data[j].name);
                }
                $append.append(_html);
            } else {
                if (data[i].type == "sel") {
                    for (var _i in data[i].itemList) {
                        $append.find(".form_sel").append(itemModel[data[i].type].render(data[i].itemList[_i]));
                    }
                } else {
                    var crname = Math.random() * 1000;
                    for (var _i in data[i].itemList) {
                        $append.find(".item_list").append(itemModel[data[i].type].render($.extend({ crname: crname, _id: "id_" + Math.random() * 1000 }, data[i].itemList[_i])));
                    }
                }
            }
            $listBox.append($append);
        }
    };
    getAttrList = function (callback) {
        $.ajax({
            url: domains.api+"/select/get",
            type: "get",
            dataType: "jsonp",
            timeout: 100000,
            success: function (data) {
                _attrData = data;
                _showList($("#listBox"), data, showResultType, _showResulthtml);
                typeof callback === "function" && callback();
            },
            error: function () {
                alert("getAttrList  Error ! The data goes false data");
            }
        });
    };
    getGroupList = function (callback) {
        $.ajax({
            url:domains.api+ "/group",
            type: "get",
            timeout: 100000,
            dataType: "jsonp",
            success: function (data) {
                _groupData = data;
                _showGroupList(data);
                typeof callback === "function" && callback();
            },
            error: function () {
                alert("getGroupList  Error ! The data goes false data");
            }
        });
    };
    _init = function () {
        var $body = $("body");
        if (!_adminConfig) {
            _adminConfig = {}
        }
        for (var i in adminConfig) {
            _adminConfig[i] = adminConfig[i];
            for (var j in adminConfig[i]) {
                adminConfig[i][adminConfig[i][j]] = j;
            }
        }
        getAttrList(getGroupList);
        $body.append('<div class="float" style="position: fixed;right: 10px;bottom: 10px;"><a href="#" class="totop" style="display:block;">回到顶部</a><a href="#" class="togroup" style="display:block">查看分组</a><a href="#" class="tosubmit" style="display:block">准备提交</a></div>');
        $body.append('<div class="float" style="position: fixed;right: 10px;bottom: 500px;"><input type="text" id="select_txt"><a href="#" class="select_attr" style="display:block;">查找属性</a></div>')
        $body.on("click", ".totop", function () {
            $("body,html").animate({ "scrollTop": 0 }, 500);
            return false;
        });
        $body.on("click", ".togroup", function () {
            $("body,html").animate({ "scrollTop": $(".group_box").offset().top - 200 }, 500);
            return false;
        });
        $body.on("click", ".tosubmit", function () {
            $("body,html").animate({ "scrollTop": $(".group_box").offset().top - 600 }, 500);
            return false;
        });
        $body.on("click", ".select_attr", function () {
            var $this = $(this), _v = $this.closest(".float").find("input").val(), _row = $("#listBox").find(".form_row[data-key*='" + _v + "']"), _index = $this.data("index") || 0;
            if (_v == $this.data("selkey")) {
                $this.data("index", ++_index);
            } else {
                $("#listBox").find(".bright").removeClass("bright");
                $this.data("index",0);
            }
            _row.find(".row_key").addClass("bright");
            if (_row.eq(_index).length) {
                $("body,html").animate({ "scrollTop": _row.eq(_index).offset().top - 200 }, 500);
                $this.data("selkey", _v);
            } else {
                $this.data("index", --_index);
            }
            return false;
        });
        $body.find("#select_txt").keypress(function () {
            $(this).closest(".float").find(".select_attr").click();
        });
    };
    $page.on("click", ".submit", function () {
        var $group_name = $("#group_name");
        var _data = {};
        _data.name = $.trim($group_name.val());
        if (_data.name) {
            _data.itemList = [];
            $(".groupcheck:checked").each(function () {
                var $row = $(this).closest(".form_row");
                _data.itemList.push({
                    selectid: $row.attr("data-select-id"),
                    sort: $row.find('.groupindex').val(),
                    id: $row.data("id")
                });
            });
            _data.itemList = JSON.stringify(_data.itemList);
            _data.id = $group_name.data("id");
            _data.type = $(".group_type").val();
            $.ajax({
                url: domains.api+"/group/" + (_data.id ? "update" : "add"),
                data: $.param(_data),
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    window.location.href = window.location.href;

                }, error: function () {
                    alert("addGroup  or updateGroup  Error !");
                }
            });
        } else {
            alert("组名不能为空！");
        }
        return false;
    });
    $page.on("change", ".groupcheck", function () {
        $this = $(this), $groupindex = $this.closest(".form_row").find(".groupindex");
        if ($this.attr("checked")) {
            $(".groupindex:not([disabled])").each(function () {
                var _val = $(this).val();
                maxgroupIndex = Math.max(maxgroupIndex, _val);
            });
            $groupindex.removeAttr("disabled");
            $groupindex.val(maxgroupIndex + 1);
        } else {
            $groupindex.attr("disabled", "disabled");
            $groupindex.val('');
        }

    });
    $page.on("click", ".cancel", function () {
        window.location.href = window.location.href;
        return false;
    });
    $page.on("click", ".updatebtn", function () {
        var $this = $(this), $ul = $this.closest("ul"), _data = $ul.data("groupItemData"), $group_name = $("#group_name"), $listBox = $("#listBox"), $item;

        $group_name.val(_data.name).data("id", _data.id);
        maxgroupIndex = 0;
        $listBox.find(".groupindex").val("").attr("disabled", "disabled");;
        $(".group_type").val(_data.type).attr("disabled", "disabled");
        for (var i in _data.itemList) {
            $item = $listBox.find("[data-select-id='" + _data.itemList[i].value + "']");
            $item.data("id", _data.itemList[i].id);
            $item.find(".groupcheck").attr("checked", "checked").change();
        }
        return false;
    });
    $page.on("click", ".delbtn", function () {
        var $this = $(this), $ul = $this.closest("ul"), _data = $ul.data("groupItemData");
        $.ajax({
            url: domains.api+"/group/delete/" + _data.id,
            type: "get",
            dataType: "jsonp",
            timeout: 100000,
            success: function (data) {
                _init();
            }, error: function () {
                alert("delGroup  Error !");
            }
        });
        return false;
    });
    _init();
});