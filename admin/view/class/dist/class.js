define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        juicer = require('juicer'),
        wmBox = require('wmbox');
    var $page,
        gData,
        gGroup,
        gRelationship,
        gCurrobj = {},
        _init,
        _initGroup,
        _initTop,
        _initSubordinate,
        _initClassList,
        _initShowAttr,
        _initUpdate,
        _confirmBox,
        _confirmDelBox;
    $page = $("#page");
    _init = function () {
        $(".class_name").val('');
        _initSubordinate();
        _initGroup();
    };
    _initGroup = function () {
        $.ajax({
            url: domains.api+"/group",
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                gGroup = data;
                //console.log(gGroup);
                var groupList1 = [], groupList2 = [], _name, _id, $groupListType11 = $(".type_11"), $groupListType22 = $(".type_22");
                for (var i in data) {
                    _id = data[i].id || Math.random() * 999;
                    _name = data[i].name;
                    if (data[i].type == "11") {
                        groupList1.push('<span style="display: inline-block;"><input type="radio" class="grouplist" name="grouplisttype11" id="id_' + _id + '" data-id="' + _id + '" value="' + _name + '" disabled="disabled"><label class="chk_key" for="id_' + _id + '">' + _name + '</label></span>');
                    } else {
                        groupList2.push('<span style="display: inline-block;"><input type="radio" class="grouplist" name="grouplisttype22"  id="id_' + _id + '" data-id="' + _id + '" value="' + _name + '" disabled="disabled"><label class="chk_key" for="id_' + _id + '">' + _name + '</label></span>');
                    }
                }
                $groupListType11.empty().append('<label class="row_key w150" for="">属性：</label><div class="group_list" style="float:left;width:600px"></div>');
                $groupListType11.find(".group_list").append(groupList1.join(''));
                $groupListType22.empty().append('<label class="row_key w150" for="">规格：</label><div class="group_list" style="float:left;width:600px"></div>');
                $groupListType22.find(".group_list").append(groupList2.join(''));
            },
            error: function () {
                alert("getGroup Error！")
            }
        });
        $.ajax({
            url: domains.api+"/rulecategory",
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                gRelationship = data;
                //console.log(gRelationship);
            },
            error: function () {

            }
        });
    };
    _initClassList = function () {
        var $class_box = $(".class_box"), _htmlarr = [];
        $class_box.empty();
        for (var i in gData) {
            _htmlarr.push('<ul  data-key="' + i + '">');
            _htmlarr.push('<li class="class_name"><input value="' + gData[i].name + '" /></h3></li>');
            _htmlarr.push('</ul>');
        }
        $class_box.append(_htmlarr.join(''));
        $class_box = $(".class_box");
        $class_box.find("ul[data-key]").each(function () {
            _htmlarr = [];
            var $this = $(this), key = $this.attr("data-key");
            var _list = gData[key].itemList;
            for (var i in _list) {
                t = true;
                $this.append('<li class="form_row showEle" data-key="' + i + '"><label class="row_key class_name"><input value="' + _list[i].name + '"/>：</label>');
            }
        });
        $class_box = $(".class_box");
        $class_box.find(".showEle[data-key]").each(function () {
            _htmlarr = [];
            var t = false;
            var $this = $(this), key = $this.attr("data-key");
            $this.append('<div class="floatleft w550"></div>');
            $this = $this.find(".floatleft");
            var _list = gData[key.substr(0, 2) + "0000"].itemList[key].itemList;
            for (var i in _list) {
                t = true;
                $this.append('<span class="listitem" data-key="' + i + '">' + _list[i].name + '</span>');
            }
            if (!t) {

            }
        });
    };
    _initTop = function () {
        var topClass = $(".topclass");
        var subClass = $(".subclass");
        var $listBox = $("#listBox")
        topClass.empty().append('<option value="0">顶级</option>');
        for (var i in gData) {
            topClass.append('<option value="' + i + '">' + gData[i].name + '</option>');
        }
        topClass.change(function () {
            var $this = $(this), _val = $this.val();
            subClass.empty().append('<option value="' + _val + '">无</option>');
            var itemList = gData[_val].itemList;
            if (itemList) {
                for (var i in itemList) {
                    subClass.append('<option value="' + i + '">' + itemList[i].name + '</option>');
                }
            }

        });
        subClass.change(function () {
            if (topClass.val() != subClass.val()) {
                $(".grouplist").removeAttr('disabled', 'disabled');
            } else {
                $(".grouplist").removeAttr('checked', 'checked');
                $(".grouplist").attr('disabled', 'disabled');
            }
        });
        gCurrobj.top - 0 && topClass.val(gCurrobj.top).change();
        gCurrobj.sub - 0 && subClass.val(gCurrobj.sub);
    };
    _initSubordinate = function () {
        $.ajax({
            url:domains.api+ "/category",
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                gData = data
                //console.log(gData)
                _initTop();
                _initClassList();
            }, error: function () {
                alert("getSubordinateList  Error !")
            }
        });
    };
    _initUpdate = function (key) {
        var $classname = $('#class_name');
        var $topclass = $('.topclass');
        var $subclass = $('.subclass');
        var s2 = key.substr(0, 2);
        var s4 = key.substr(0, 4);
        var _relationship;
        $classname.data("_id", key);
        _thisdata = gData[s2 + "0000"].itemList[s4 + "00"].itemList[key];
        $classname.val(_thisdata.name);
        $topclass.val(s2 + "0000");
        $topclass.change();
        $subclass.val(s4 + "00");
        $subclass.change();
        $topclass.attr("disabled", "disabled");
        $subclass.attr("disabled", "disabled");
        $(".grouplist").removeAttr('checked');
        if (gRelationship[key]) {
            _relationship = gRelationship[key];
            _relationship = _relationship.split(',');
            for (var i in _relationship) {
                $(".grouplist[data-id='" + _relationship[i] + "']").attr("checked", "checked");
            }
        }
    };
    _initShowAttr = function (key) {
        var s2 = key.substr(0, 2);
        var s4 = key.substr(0, 4);
        alText = []
        var _relationship;
        _thisdata = gData[s2 + "0000"].itemList[s4 + "00"].itemList[key];
        if (gRelationship[key]) {
            _relationship = gRelationship[key];
            _relationship = _relationship.split(',');
            for (var i in _relationship) {
                var _list = gGroup[_relationship[i]].itemList;
                alText.push('<b>' + gGroup[_relationship[i]].name + ':</b>')
                for (var j in _list) {
                    alText.push(_list[j].name);
                }
            }
            wmBox.alert({
                "boxId": "showAttrList",
                "titleText": _thisdata.name + "所有属性",
                "content": '<p class="msg" style="width: 500px;padding-left: 25px;line-height: 25px;">' + alText.join('<br/>') + '</p>',
                "btns": [
                   {
                       cls: "ui_btn_h29red5", text: "确定", res: "close", callback: function () { }
                   },
                    {
                        cls: "ui_btn_h29red5", text: "编辑", callback: function ($this) {
                            _initUpdate(key);
                            this.close();
                        }
                    }
                ]
            });
        }
    };
    $page.on("click", ".submit", function () {
        var $class_name = $("#class_name");
        var $top = $(".topclass");
        var $sub = $(".subclass");
        var $groupListType11 = $(".type_11"), $groupListType22 = $(".type_22");
        var _groupstype11 = [], _groupstype22 = [];
        var _id = $class_name.data("_id");
        gCurrobj.top = $top.val();
        gCurrobj.sub = $sub.val();
        $groupListType11.find(":checked").each(function () {
            _groupstype11.push($(this).attr("data-id"));
        });
        $groupListType22.find(":checked").each(function () {
            _groupstype22.push($(this).attr("data-id"));
        });
        if (!(gCurrobj.sub - 0) || (gCurrobj.sub.substr(2, 4) === "0000") || (_groupstype11.length && _groupstype22.length)) {
            $.ajax({
                url:domains.api+ "/category/" + (_id ? "update" : "add"),
                data: {
                    name: $class_name.val(),
                    parent: gCurrobj.sub,
                    type11: _groupstype11.join(),
                    type22: _groupstype22.join(),
                    id: _id
                },
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    window.location.href = window.location.href;
                }, error: function () {
                    alert("addClass  Error !")
                }
            });
        } else {
            alert("请配置属性和规格！");
        }
        return false;
    });

    $page.on("click", ".cancel", function () {
        window.location.href = window.location.href;
    });
    $page.on("click", ".listitem", function () {
        var $this = $(this);
        if (_confirmBox) {
            _confirmBox.close();
            _confirmBox = undefined;
        }
        _confirmBox = wmBox.relyBox({
            rely: $this,
            content: '<p class="relymsg" style="width:280px">确定你所处理的事务！</p>',
            "btns": [
                        {
                            cls: "ui_btn_h22red10", res: "close", text: "查看属性组", callback: function () {
                                _initShowAttr($this.attr("data-key"))

                            }
                        },
                        {
                            cls: "ui_btn_h22red10", res: "close", text: "编辑", callback: function () {
                                _initUpdate($this.attr("data-key"));
                            }
                        },
                        {
                            cls: "ui_btn_h22red10", res: "close", text: "删除", callback: function () {
                                $.ajax({
                                    url:domains.api+ "/category/delete",
                                    type: "get",
                                    data: { id: $this.attr("data-key") },
                                    dataType: "jsonp",
                                    success: function (data) {
                                        _init();
                                        //window.location.href=window.location.href
                                    }, error: function () {
                                        alert("getAttrList  Error !");
                                    }
                                });
                            }
                        },
                        {
                            cls: "ui_btn_h22gray6", res: "close", text: "取消", callback: function () {

                            }
                        }
                    ]
        });
    });
    $page.on("focus", ".class_box .class_name input", function () {
        var $this = $(this);
        $this.addClass("ac");
    });
    $page.on("blur", ".class_box .class_name input", function () {
        var $this = $(this);
        $this.removeClass("ac");
    });
    $page.on("change", ".class_box .class_name input", function () {
        var $this = $(this);
        var _v = $this.val(), _id = $this.closest("[data-key]").attr("data-key");
        if (_v) {
            $.ajax({
                url:domains.api+ "/category/update",
                data: {
                    id: _id,
                    name: _v,
                    parent: (_id.indexOf("0000") >= 0 ? 0 : (_id.substr(0, 2) + "0000"))
                },
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    window.location.href = window.location.href;
                }, error: function () {
                    alert("addClass  Error !")
                }
            });
        }
        else {
            if (_confirmDelBox) {
                _confirmDelBox.close();
            }
            _confirmDelBox = wmBox.relyBox({
                rely: $this,
                content: '<p class="relymsg">当前类名为空，确定需要删除？<br/>如存在下级删除将会失败！</p>',
                "btns": [
                    {
                        cls: "ui_btn_h22red10", res: "sure", text: "确定", callback: function () {
                            $.ajax({
                                url:domains.api+ "/category/delete",
                                type: "get",
                                data: { id: _id },
                                dataType: "jsonp",
                                success: function (data) {
                                    _init();
                                    // window.location.href=window.location.href
                                }, error: function () {
                                    alert("getAttrList  Error !");
                                }
                            });
                        }
                    },
                    { cls: "ui_btn_h22gray6", res: "close", text: "取消" }
                ]
            });
        }
        return false;
    });






    _init();
});