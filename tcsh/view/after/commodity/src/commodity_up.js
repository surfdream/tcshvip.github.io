/*
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var logisticsModel = {};
    var aftermarketMsg = {};
    var $ = require("jquery"),//jq
       lib = require('lib'),//工具模块
       juicer = require("juicer"),//模板引擎
       area = require('wmarea'),//地区模块
       verification = require('wmverification'),//验证模块
       upload = require('wmupload'),//上传模块
       tips = require('wmtips'),//泡泡
       lazyload = require('wmlazyload'),//懒加载
       box = require('wmbox'),//弹窗模块
       editor = new UE.ui.Editor(),//编辑器
       initSpecificationMain = require('initSpecificationMain'),//组装table模块
       _global_setting,//全局对象
       customAttr,//属性变量
       colorData = require('wmcolor');//颜色数据
    window.document.domain = "tcsh.me";
    //创建不能修改的属性配置内容
    var createNoSetAttrMain = {
        "sel": function ($ele, data) {
            var _sel = $($ele);
            _sel.empty().append('<option value="0">-请选择-</option>');
            var _ops = [], _list = data.itemList;
            for (var i in _list) {
                _ops.push('<option value="' + _list[i].value + '">' + _list[i].name + '</option>');
            }
            _sel.append(_ops.join(''));
        },
        "chk": function (form_row, data) {
            var _ops = [], _list = data.itemList, _i;
            for (var i in _list) {
                _i = parseInt(Math.random() * 99999) + 100;
                _ops.push('<li><input type="checkbox" name="chkattr_' + data.id + '" id="labfor_' + _i + '" value="' + _list[i].value + '" data_txt="' + _list[i].name + '"><label class="chk_key" title="' + _list[i].name + '" for="labfor_' + _i + '">' + _list[i].name + '</label></li>');
            }
            form_row.append(_ops.join(''));
        },
        "rid": function (form_row, data) {
            var _ops = [], _list = data.itemList, _i;
            for (var i in _list) {
                _i = parseInt(Math.random() * 99999) + 100;
                _ops.push('<li><input type="radio" name="ridattr_' + data.id + '" id="labfor_' + _i + '" value="' + _list[i].value + '" data_txt="' + _list[i].name + '"><label class="chk_key" title="' + _list[i].name + '" for="labfor_' + _i + '">' + _list[i].name + '</label></li>');
            }
            form_row.append(_ops.join(''));
        }
    };
    //获取不能修改的属性值
    var getNoSetAttrValue = {
        "sel": function (form_row) {
            var retArr = [], $item, _id;
            $item = form_row.find(".form_sel :selected");
            _id = $item.val() - 0;
            if (_id) {
                retArr.push({
                    id: _id,
                    value: $.trim($item.html())
                });
            }
            return retArr;
        },
        "chk": function (form_row) {
            var _name = form_row.find(":checkbox:eq(0)").attr("name");
            var retArr = []
            form_row.find('[name="' + _name + '"]:checked').each(function () {
                var $this = $(this), _data = {};
                _data.id = $this.val() - 0;
                _data.value = $.trim($this.attr("data_txt"));
                retArr.push(_data);
            });
            return retArr;
        },
        "rid": function (form_row) {
            var _name = form_row.find(":radio:eq(0)").attr("name");
            var retArr = []
            form_row.find('[name="' + _name + '"]:checked').each(function () {
                var $this = $(this), _data = {};
                _data.id = $this.val() - 0;
                _data.value = $.trim($this.attr("data_txt"));
                retArr.push(_data);
            });
            return retArr;
        },
        "txt": function (form_row) {
            var retArr = [], $item;
            $item = form_row.find(".form_txt");
            retArr.push({
                id: form_row.attr("data_id"),
                value: $.trim($item.val())
            });
            return retArr;
        }
    };
    //创建不能修改属性的行容器
    var createNoSetAttrBox = {
        "sel": function (data) {
            var $obj = $('<select class="form_sel"><option value="0">-请选择-</option></select>');
            var form_row = $('<li class="form_row" data_type="sel" data_id="' + data.id + '" data_name="' + data.name + '"><label class="row_key">' + ((data.required ? '<b class="form_must">*</b>' : "") + data.name) + '：</label></li>');

            createNoSetAttrMain["sel"]($obj, data);
            for (var i in data.otherAttr) {
                $obj.attr(data.otherAttr[i].value, data.otherAttr[i].name);
            }
            return form_row.append($obj);
        },
        "chk": function (data) {
            var form_row = $('<li class="form_row" data_type="chk" data_id="' + data.id + '" data_name="' + data.name + '"><label class="row_key">' + ((data.required ? '<b class="form_must">*</b>' : "") + data.name) + '：</label><ul class="floatleft w400"></ul>');
            var $ul = form_row.find("ul");
            createNoSetAttrMain["chk"]($ul, data);
            for (var i in data.otherAttr) {
                $ul.attr(data.otherAttr[i].value, data.otherAttr[i].name);
            }
            return form_row.append($ul);
        },
        "rid": function (data) {
            var form_row = $('<li class="form_row" data_type="rid" data_id="' + data.id + '" data_name="' + data.name + '"><label class="row_key">' + ((data.required ? '<b class="form_must">*</b>' : "") + data.name) + '：</label><ul class="floatleft w400"></ul>');
            var $ul = form_row.find("ul");
            createNoSetAttrMain["rid"]($ul, data);
            for (var i in data.otherAttr) {
                $ul.attr(data.otherAttr[i].value, data.otherAttr[i].name);
            }
            return form_row.append($ul);
        },
        "txt": function (data) {
            var $txt = $('<li class="form_row"  data_type="txt" data_id="' + data.id + '" data_name="' + data.name + '"><label class="row_key">' + ((data.required ? '<b class="form_must">*</b>' : "") + data.name) + '：</label><input type="text" class="form_txt w150"></li>');
            var $form_txt = $txt.find(".form_txt");
            for (var i in data.otherAttr) {
                $form_txt.attr(data.otherAttr[i].value, data.otherAttr[i].name);
            }
            return $txt;
        }
    };
    //创建可编辑属性（默认为统一形式）
    var createSetAttrMain = function (form_row, data) {
        var _ops = [], _list = data.itemList, _i;
        for (var i in _list) {
            _i = parseInt(Math.random() * 99999) + 100;
            _ops.push([
                '<li>',
                    '<input type="checkbox" relevance_key="' + _i + '" name="chkattr_' + data.id + '" id="labfor_' + _i + '" class="setattr" data_id="' + _list[i].value + '" data_name="' + _list[i].name + '" data_key="' + data.name + '">',
                    '<label class="chk_key" title="' + _list[i].name + '" input_key="' + _i + '" eachdata="' + _list[i].name + '" for="labfor_' + _i + '" data_id="' + _list[i].value + '">' + _list[i].name + '</label>',
                    '<input type="text" value="' + _list[i].name + '" class="attr_item" key="' + _i + '" />',
                '</li>'].join(''));
        }
        _list = data.otherAttr;
        for (i in _list) {
            form_row.attr(_list[i].value, _list[i].name)
        }
        form_row.append(_ops.join(''));
    };
    //创建可编辑属性容器
    var createSetAttrBox = function (data, i) {
        var _i = parseInt(Math.random() * 99999) + 100;
        var form_row = $('<li class="form_row" wmv="attrEmpty" wmvmsg="属性项必选一项"><label class="row_key">' + ((data.required ? '<b class="form_must">*</b>' : "") + data.name) + '：</label><ul class="floatleft set_attr_box w500" data_name="' + data.name + '" data_id="' + data.id + '"></ul>');
        var $ul = form_row.find("ul");
        $ul.attr("sequence", i);
        createSetAttrMain($ul, data);
        $ul.append('<li><input type="checkbox" name="chkattr_5" id="alllabfor_' + _i + '" class="setattrallchk"><label class="chk_key nohide" for="alllabfor_' + _i + '">全选</label></li>');
        return form_row.append($ul);
    };
    var initUpdate = function () {
        var _updateData = {}, itemList;
        _updateData.updateId = _global_setting.pdt_id;
        if (_updateData.updateId) {
            _updateData.category_id = _global_setting.category_id + "";
            $(".classparent").val(_updateData.category_id.substr(0, 4) + "00").change();
            $(".classthis").val(_updateData.category_id).change();
        }
    };
    //初始化类别
    var initClass = function () {
        $.ajax({
            url: domains.api + "/category/brand/" + global_setting.brand_id,
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                var _data = classList = data;
                var $classparent = $(".classparent").empty();
                var $class = $(".classthis").empty();
                $class.append('<option value="0">--请选择--</option>');
                $classparent.append('<option value="0">--请选择--</option>');
                for (var i in _data) {
                    $classparent.append('<optgroup value="' + i + '" label="' + _data[i].name + '"></optgroup>')
                }
                $classparent.find('optgroup').each(function () {
                    var $this = $(this), _val = $this.attr("value");
                    var list = _data[_val].itemList;
                    for (i in list) {
                        $this.append('<option value="' + i + '">' + list[i].name + '</option>');
                    }
                });
                $classparent.css("zoom", "1");
                initUpdate();
            }, error: function () {
                alert("getSubordinateList  Error !")
            }
        });
    };
    var initAttr = function (id) {
        if (id - 0) {
            $.ajax({
                url: domains.api + "/category/get/" + id,
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    customAttr = data;
                    var _nosetdata = data.attrList;
                    var _setData = data.setAttrList;
                    var _i = 1, _str, _list, _item, _type;
                    var $comm_attr_list = $("#comm_attr_list_main"), $set_attr_box = $("#set_attr"), $form_row;
                    $comm_attr_list.empty();
                    for (var i in _nosetdata) {
                        for (var j in _nosetdata[i].otherAttr) {
                            _str = _global_setting.select[_nosetdata[i].otherAttr[j].value];
                            _nosetdata[i].otherAttr[j].value = _str;
                            if (_str === "wmv") {
                                _nosetdata[i].required = true;
                            }
                        }
                        $form_row = createNoSetAttrBox[_nosetdata[i].type](_nosetdata[i]);
                        $comm_attr_list.append($form_row);
                    }
                    $set_attr_box.empty();
                    for (i in _setData) {
                        for (j in _setData[i].otherAttr) {
                            _str = _global_setting.select[_setData[i].otherAttr[j].value];
                            _setData[i].otherAttr[j].value = _str;
                            if (_str === "wmv") {
                                _setData[i].required = true;
                            }
                        }
                        $form_row = createSetAttrBox(_setData[i], i - 0 + 1);
                        $set_attr_box.append($form_row);
                    }
                    var $specification_main_box = $(".specification_main_box");
                    $(".specification_table").remove();
                    $("[upimg='1']").each(function () {
                        var $this = $(this);
                        var $table = $('<table class="s_table specification_table" border="0" cellspacing="0"><thead></thead><tbody></tbody></table>');
                        $table.attr("sequence", $this.attr("sequence"));
                        var _tbody = [], $tbody = $table.find("tbody");
                        $this.find("[eachdata]").each(function () {
                            var $this = $(this);
                            var _eachdata = $this.attr('eachdata');
                            var _color = colorData[_eachdata], _for = $this.attr('for');
                            if (_color) {
                                $this.before('<label class="colblock" style="background:' + _color + '" for="' + _for + '"></label>');
                                _tbody.push([
                                    '<tr forkey=' + $this.attr("for") + ' data_txt="' + $this.attr("eachdata") + '" data_id="' + $this.attr("data_id") + '">',
                                        '<td style="width:90px"><i class="colblock" style="background: ' + _color + '"></i><span input_key="' + $this.attr("input_key") + '">' + _eachdata + '</span></td>',
                                        '<td style="width:270px">',
                                            '<a href="#" class="wm_ico fork1 del_upimg_item" style="visibility: hidden;float:right;"></a><input type="file" class="setattr_file" /><img class="setattr_file_img">',
                                        '</td>',
                                    '</tr>'
                                ].join(''));
                            } else {
                                _tbody.push([
                                    '<tr forkey=' + $this.attr("for") + ' data_txt="' + $this.attr("eachdata") + '" data_id="' + $this.attr("data_id") + '">',
                                        '<td><span input_key="' + $this.attr("input_key") + '">' + _eachdata + '</span></td>',
                                        '<td>',
                                            '<a href="#" class="wm_ico fork1 del_upimg_item" style="visibility: hidden;float:right;"></a><input type="file" class="setattr_file" /><img class="setattr_file_img">',
                                        '</td>',
                                    '</tr>'
                                ].join(''));
                            }
                        });
                        $tbody.append(_tbody.join(''));
                        $specification_main_box.before($table);
                    });
                    _list = _global_setting.product_property;
                    if (_list) {
                        $comm_attr_list = $(".comm_attr_list");
                        for (var i in _list) {
                            _item = $comm_attr_list.find('[data_id="' + _list[i].select_id + '"]');
                            _type = _item.attr("data_type");
                            switch (_type) {
                                case "rid":
                                    _item.find("[value='" + _list[i].kv[0].id + "']").attr("checked", "checked");
                                    break;
                                case "chk":
                                    for (var j in _list[i].kv) {
                                        _item.find("[value='" + _list[i].kv[j].id + "']").attr("checked", "checked");
                                    }
                                    break;
                                case "txt":
                                    _item.find(".form_txt").val(_list[i].kv[0].value);
                                    break;
                                case "sel":
                                    _item.find(".form_sel").val(_list[i].kv[0].id);
                                    break;
                            }
                        }
                    }

                    var _updateData = {}, _src, i, $checkbox, _str, _str2;
                    if (global_setting.SpecificationData && global_setting.SpecificationData.relation) {
                        _updateData.relation = global_setting.SpecificationData.relation;
                        _updateData.dataList = global_setting.SpecificationData.dataList;
                        //复选框选中
                        for (i in _updateData.relation) {
                            itemList = _updateData.relation[i].itemList;
                            for (var j in itemList) {
                                $checkbox = $set_attr_box.find(":checkbox[data_id='" + itemList[j].id + "']");
                                $checkbox.attr("checked", "checked").change();
                                $checkbox.closest("li").find(".attr_item:visible").val(itemList[j].name).change();
                            }
                        }
                        //存在图片数据，进行src的赋值
                        for (i in _updateData.relation) {
                            itemList = _updateData.relation[i].itemList;
                            for (var j in itemList) {
                                _src = "";
                                _src = itemList[j].src;
                                if (_src) {
                                    var $tr = $(".specification_table [data_id='" + itemList[j].id + "']");
                                    $tr.find("img").attr("src", _src).css("display", "block");
                                    $tr.find(".wm_ico").css("visibility", "visible");
                                }
                            }
                        }
                        //改造数据
                        _str = [], _str2 = [];
                        for (i in _updateData.dataList) {
                            _str.push(i);
                            _str2.push(i);
                        }
                        _str = _str.join('!@#');
                        for (i in _updateData.relation) {
                            itemList = _updateData.relation[i].itemList;
                            for (var j in itemList) {
                                _str = _str.replace(new RegExp("'" + itemList[j].name + "'", "g"), "'" + itemList[j].id + "'");
                            }
                        }
                        _str = _str.split('!@#');
                        _updateData.dataList = {}
                        for (i in _str2) {
                            _updateData.dataList[_str[i]] = global_setting.SpecificationData.dataList[_str2[i]];
                        }
                        //////////////////////////////////////////
                        //$set_attr_box.find(":checked:eq(0)").change();
                        //_updateData.dataList = global_setting.SpecificationData.dataList;
                        for (var i in _updateData.dataList) {
                            $specification_main_box.find(i).find(".price").val(_updateData.dataList[i].price);
                            $specification_main_box.find(i).find(".quantity").val(_updateData.dataList[i].amount);
                        }
                        $(".quantity:eq(0)").change();
                    }
                    verification.position();
                },
                error: function () {
                    alert("getCategory  Error !")
                }
            });
        }
    };
    //初始化异常处理
    var initError = {
        //还没有设置店铺
        "1": function () {
            var _content;
            _content = $('<div class="noshop_box"><p class="msg"><i class="wm_ico sigh2" style="margin: -5px 10px 0 0;"></i>您还没有设置店铺！</p><p class="countdown">5秒后跳转！</p><a href="' + domains.sell + '/market" class="go_market">店铺设置</a></div>');
            box.alert({
                content: _content,
                btns: [],
                callback: function () {
                    lib.countdown({
                        parent: _content,
                        ele: ".countdown",
                        countdownModel: '<p class="countdown">${i}秒后跳转！</p>',
                        start: 5,
                        endCallBack: function () {
                            window.location.href = domains.sell + "/market";
                        }
                    });
                }
            });
            return true;
        },
        //促销商品不允许编辑
        "2": function () {
            var _content;
            _content = $('<div class="initerror_main"><p class="msg"><i class="wm_ico sigh2" style="margin: -5px 10px 0 0;"></i>' + global_setting.flag.txt + '</p></div>');
            box.alert({
                content: _content,
                boxCls: "initerror_box",
                btns: [
                        {
                            cls: "ui_btn_h40red2",
                            res: "close",
                            text: "确定",
                            callback: function () {

                            }
                        },
                        {
                            cls: "ui_btn_h40gray16",
                            res: "close",
                            text: "取消",
                            callback: function () { }
                        }
                ]
            });
            return false;
        }
    }
    var init = function () {
        //取消公共脚本检测登录状态
        global_setting.no_v_login = 1;
        if ($.browser.msie && $.browser.version === "6.0") {
            alert('发布商品页面，不支持IE6及以下版本！');
            return false
        }
        if ($.browser.msie && $.browser.version === "7.0") {
            alert('发布商品页面，在IE7内核下有瑕疵，只能满足基本功能，建议升级浏览器！');
        }
        if (global_setting.flag && global_setting.flag.code && initError[global_setting.flag.code]()) {
            return false;
        }
        var imgList = global_setting.product_img, i, _ttm;
        var $listing_year = $(".listing_year"), $listing_month = $(".listing_month"), yc = -2;
        if (!_global_setting) {
            _global_setting = {};
        }
        for (i in global_setting) {
            _global_setting[i] = global_setting[i];
            for (var j in global_setting[i]) {
                if (typeof global_setting[i][j] === "string" || typeof global_setting[i][j] === "number") {
                    global_setting[i][global_setting[i][j]] = j;
                }
            }
        }
        initClass();
        //初始化编辑器
        editor.render("myEditor");
        editor.ready(function () {
            editor.setContent(lazyload.decoding($("#product_info").html()));
            editor.setHeight(250);
            //IE67个垃圾
            setTimeout(function () {
                $("#myEditor").closest(".form_row").css("zoom", "0").next().css("zoom", "0");
            }, 1000)

        });
        //初始化 城市省份
        area({
            provincesEle: ".selProvince_rent",
            cityEle: ".selCity_rent"
        });
        //自定义验证
        verification.addRule([
           {
               key: "radioEmpty", fun: function (val) {
                   return this.find("[type='radio']:checked").length > 0;
               }
           },
           {
               key: "selEmpty", fun: function () {
                   return !!(this.val() - 0);
               }
           },
           {
               key: "up_img", fun: function (val) {
                   return this.find("img[src='']").length < 5;
               }
           },
           {
               key: "editorEmpty", fun: function () {
                   return editor.getContent();
               }
           },
          {
              key: 'bear_type', fun: function () {
                  return $('[name="shipping_type"]:checked').length > 0
              }
          },
          {
              key: "modelEmpty", fun: function () {
                  var shipping_type = $('[name="shipping_type"]:checked').val();
                  if (shipping_type == 2 && $("[name='seller_bear_type']:checked").val() == 1) {
                      return logisticsModel.id > 0;
                  }
                  return true;
              }
          },
          {
              key: "shipping_type", fun: function () {
                  return this.find('[name="seller_bear_type"]:checked').length > 0;
              }
          },
          {
              key: "setAttrEmpty", fun: function () {
                  return !!this.find(".setattr:checked").length;
              }
          },
          {
              key: "attrEmpty", fun: function () {
                  return !!this.find(".setattr:checked").length;
              }
          },
          {
              key: "required1", fun: function () {
                  //这代码写的垃圾 心情不好！
                  var _mail, _express, _ems, _nonNegativeRegExp;
                  if (!this.find("#seller_bear_type2:checked").length) {
                      return true;
                  } else {
                      _nonNegativeRegExp = /^[0-9]*([1-9]*\.)?\d+$/;
                      _mail = $.trim(this.find("#freight_mail").val());
                      _express = $.trim(this.find("#freight_express").val());
                      _ems = $.trim(this.find("#freight_ems").val());
                      if ((_mail === "" && _express === "" && _ems === "")) {
                          return false;
                      }
                      if ((_nonNegativeRegExp.test(_mail) || _mail === "") && (_nonNegativeRegExp.test(_express) || _express === "") && (_nonNegativeRegExp.test(_ems) || _ems === "")) {
                          return true;
                      }
                      return false;
                  }
              }
          },
          {
              key: "freight_model", fun: function () {
                  if (!this.find("#seller_bear_type1:checked").length) {
                      return true;
                  } else {
                      return logisticsModel.id - 0;
                  }
              }
          }
        ]);
        verification.init(function () {
            this.setDirection("rt");
        });
        bind();
        //初始化商品图片
        if (imgList) {
            i = imgList.length
            while (i--) {
                imgList[i] && $(".img_item:not(.img_main):eq(" + i + ")").find('img').attr("src", imgList[i]).closest(".img_bg").css("display", "block");
            }
            $(".img_main img").attr("src", $(".img_item:not(.img_main)").find("img[src!='']:eq(0)").attr("src")).closest(".img_bg").css("display", "block");
        }
        //初始化物流类型
        if (global_setting.freight && global_setting.freight.type) {
            $("#shipping_type2").attr("checked", "checked").change();
            if (global_setting.freight.type === 1) {
                $("#seller_bear_type1").attr("checked", "checked").change();
                setShipping(global_setting.freight.id, global_setting.freight.name);
            } else {
                $("#seller_bear_type2").attr("checked", "checked").change()
                $("#freight_mail").val(global_setting.freight.mail);
                $("#freight_express").val(global_setting.freight.express);
                $("#freight_ems").val(global_setting.freight.ems);
            }
        }
        //商品所在地
        if (global_setting.location_area) {
            var _location_area = global_setting.location_area + "";
            $(".selProvince_rent").val(_location_area.substr(0, 2) + "0000").change();
            $(".selCity_rent").val(_location_area);
        }
        //橱窗
        if (global_setting.shop_window_img) {
            $(".add_recommend_img_hook img").attr("src", global_setting.shop_window_img).css("display", "block");
            $("#recommend1").attr("checked", "checked").change();
        }
        $listing_year.empty().append('<option value="">-请选择-</option>');
        while (yc++ < 10) {
            $listing_year.append('<option value="' + (global_setting.year - yc) + '年">' + (global_setting.year - yc) + '</option>');
        }
        $listing_month.empty().append('<option value="">-请选择-</option><option>上半年</option><option>下半年</option><option>1月</option><option>2月</option><option>3月</option><option>4月</option><option>5月</option><option>6月</option><option>7月</option><option>8月</option><option>9月</option><option>10月</option><option>11月</option><option>12月</option>');
        _ttm = $.trim($(".ttm").attr("data_ttm"));
        if (_ttm) {
            _ttm = _ttm.split(' ');
            $listing_year.val(_ttm[0]);
            $listing_month.val(_ttm[1]);
        }
        $(".add_recommend_img_hook b").empty().append(global_setting.showWindow);
        aftermarketMsg.txt = global_setting.aftermarketMsgTxt || "";
        //if (global_setting.tag_list && global_setting.tag_list.length) {
        //    var _tag_list = [],
        //    $tag_list = $form.find(".tag_list");
        //    for (var i in global_setting.tag_list) {
        //        _tag_list.push('<li class="tag_item" data_name="' + global_setting.tag_list[i] + '">' + global_setting.tag_list[i] + '<a class="wm_ico fork2  remove_tag" href="#"></a></li>');
        //    }
        //    $tag_list.prepend(_tag_list.join(''));
        //}

    };
    var bind = function () {
        var $form = $(".comm_up_form"),
            $class = $(".classthis"),
            $tag_list = $form.find(".tag_list"),
            $custom_tag_val = $form.find(".custom_tag_val"),
            $limit,
            successBox,
            updateSuccess,
            errorBox,
            submitLoginBox,
            successFalseBox,
            batchBoxModel = juicer([
                  '<div class="batch_head">',
                     '<h3>批量设置</h3>',
                  '</div>',
                  '<ul class="batch_type wm_form" >',
                      '<li><b>特卖价</b></li>',
                      '{@each list as item,index}',
                          '<li><input type="radio" id="${random}_1_${index}"name="batchtype_1" data_name="${item.name}"/><label class="rad_key" for="${random}_1_${index}">相同${item.name}特卖价相同</label></li>',
                      '{@/each}',
                  '</ul>',
                  '<ul class="batch_type wm_form" >',
                      '<li><b>数量</b></li>',
                      '{@each list as item,index}',
                          '<li><input type="radio" id="${random}_2_${index}" name="batchtype_2" data_name="${item.name}" /><label class="rad_key" for="${random}_2_${index}">相同${item.name}数量相同</label></li>',
                      '{@/each}',
                  '</ul>'
            ].join('')),
            batchBoxModelTxtArr = [],
            $stock = $form.find(".stock"),
            $seller_bear_main = $form.find(".seller_bear_main"),//买家承担运费，下属列表
            $model_data = $form.find(".model_data"),//全国包邮模版容器
            $add_recommend_img = $form.find(".add_recommend_img_hook"),//添加橱窗推荐按钮
            $up_recommend_box = $form.find(".up_recommend_box"),
            imgtype = 'jpg,jpeg,gif,png',
            _loginBox;
        SpecificationData = {};
        var showAddSuccess = function (_id) {
            if (!successBox) {
                successBox = box.alert({
                    boxCls: "successmsg",
                    titleText: "上架成功",
                    content: '<p style="width: 500px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;"><b style="color:#e13436;font-weight: 500;">恭喜，您的商品已经成功上架！</b>您可以继续上架商品，或者进行其他操作在您发布10款商品后，同城生活将建立您的专属卖场</p>',
                    btns: [
                               //{
                               //    cls: "ui_btn_h46red8 mrl", text: "本品促销", res: "close", callback: function () {
                               //        window.location.href = domains.item+'/productsale/index/' + _id;
                               //    }
                               //},
                               {
                                   cls: "ui_btn_h46red8 mrl", text: "继续上架", res: "close", callback: function () {
                                       window.location.href = domains.item + '/product';
                                   }
                               }
                    ],
                    callback: function () {
                        this.close = function () { window.location.href = window.location.href; }
                    }
                });
            }
            successBox.show();
        };
        var showUpSuccess = function (_id) {
            //var $this = this;
            if (!updateSuccess) {
                updateSuccess = box.alert({
                    boxCls: "successmsg",
                    titleText: "修改成功",
                    content: '<p style="width:350px;text-align: center;font-size: 14px; padding: 50px;line-height: 30px; font-family: simsun;font-weight: 700;color: #535353;"><b style="color:#e13436;font-weight: 700;"><i class="wm_ico hook8" style="margin-right:10px;margin-top: -8px;"></i>恭喜您！</b>您的修改已经成功。</p>',
                    btns: [
                               {
                                   cls: "ui_btn_h46red8 mrl", text: "确定", res: "close", callback: function () {
                                       if (window.opener) { window.opener.location.href = window.opener.location.href; }
                                       window.location.href = domains.item + '/' + _id + ".html";
                                   }
                               }
                    ],
                    callback: function () {
                        this.close = function () { window.location.href = window.location.href; }
                    }
                });
            }
            updateSuccess.show();
        };
        var _initBatchBoxModelTxtArr = function () {
            var itme_con;
            if (!batchBoxModelTxtArr.length) {
                itme_con = $("#set_attr").find(".set_attr_box");
                itme_con.each(function () {
                    var $this = $(this);
                    batchBoxModelTxtArr.push({ name: $this.attr("data_name") });
                });
            }
        };
        //上传对应触发
        var _file = function (parent) {
            var $this = $(this); $parent = $this.closest(parent);
            $parent.find('.form_file').click();
        };
        //显示颜色配置行
        var _showSpecificationItem = function () {
            var $ul = $(this).closest(".set_attr_box");
            var $specification_table = $(".specification_table[sequence='" + $ul.attr("sequence") + "']"),
            $specification_tbody = $specification_table.find("tbody");
            var $ul = $(this).closest('ul');
            if ($ul.attr("upimg") - 0) {
                var $checkedlist = $ul.find(".setattr:checked");
                if ($checkedlist.length) {
                    $specification_table.css("display", "block");
                    $specification_tbody.find("tr").css("display", "none");
                    $checkedlist.each(function () {
                        $specification_tbody.find('[forkey="' + $(this).attr("id") + '"]').css("display", "block");
                    });
                } else {
                    $specification_table.css("display", "none");
                }
                verification.position();
            };
            return false;
        };
        //规格详细数据表初始化
        var _initSpecificationMain = function () {
            var $specificationMain_table = $(".specification_main"),
             $specificationMain_tbody = $specificationMain_table.find("tbody"),
             $specificationMain_thead = $specificationMain_table.find("thead");
            var $sequenceList = $("#set_attr").find('[sequence]'), i, _i, _relation, _itemList;
            var isnext = true, $before_key, $set_attr = $("#set_attr"), eachData = {}, $thbefore;
            var $specification_main_box = $(".specification_main_box");
            SpecificationData.relation = [];
            $("#set_attr").find(".set_attr_box").each(function () {
                var $this = $(this);
                var _o = {
                    key: $this.attr("data_name"),
                    id: $this.attr("data_id"),
                    itemList: []
                }
                $this.find(".setattr:checked").each(function () {
                    var $this = $(this);
                    _o.itemList.push({ id: $this.attr("data_id"), name: $this.closest("li").find(".attr_item").val(), key: 'input_key="' + $this.attr("relevance_key") + '"' });
                });
                SpecificationData.relation[$this.attr("sequence")] = _o;
            });
            //初始化表格头部
            var _initSpecificationMainThead = function () {
                var _arr = [], _setData;
                for (var i in customAttr.setAttrList) {
                    _setData = {};
                    _setData.name = customAttr.setAttrList[i].name;
                    _arr.push(_setData);
                }
                _arr.push({
                    name: "特卖价",
                    sign: "*"
                });
                _arr.push({
                    name: "数量",
                    sign: "*"
                }); _arr.push({
                    name: "批量操作"
                });
                initSpecificationMain.initSpecificationMainThead({
                    setData: _arr,
                    thead: $specificationMain_thead
                });
            }
            $specificationMain_tbody.empty();
            $sequenceList.each(function () {
                var $this = $(this);
                isnext = isnext && !!$this.find(":checked").length;
            });
            if (!isnext) {
                $specification_main_box.removeClass("h600scroll").css("display", "none");
                return
            }
            _initSpecificationMainThead();
            initSpecificationMain.initSpecificationMain({
                setData: SpecificationData,
                tbody: $specificationMain_tbody
            });
            $specificationMain_table.css("display", "block");
            if ($specification_main_box.outerHeight() >= 600) {
                $specification_main_box.addClass("h600scroll").css("display", "block");
            } else {
                $specification_main_box.css("display", "block");
            }
            return;
        };
        //创建批量操作
        var _createBatchMain = function () {
            var _random = parseInt(Math.random() * 999) + 100;
            _initBatchBoxModelTxtArr();
            return batchBoxModel.render({
                list: batchBoxModelTxtArr,
                random: _random
            });
        };
        //获取详细数据
        var _getSpecificationData = function (isempty) {
            var $specificationMain_table = $(".specification_main");
            if (isempty) { SpecificationData.dataList = {}; }
            _initBatchBoxModelTxtArr();
            var str;
            $specificationMain_table.find(".specification_dataitem").each(function () {
                var $this = $(this);
                str = [];
                for (var i in batchBoxModelTxtArr) {
                    str.push("[data_" + batchBoxModelTxtArr[i].name + "='" + $this.attr("data_" + batchBoxModelTxtArr[i].name) + "']");
                }
                SpecificationData.dataList[str.join('')] = {
                    price: $this.find(".price").val(),
                    quantity: $this.find(".quantity").val()
                };

            });
        };
        //提交数据
        var _submit = function (callback) {
            var $set_attr, min = 999, max = -1, initTableData, _shippingType, $specification_table, $specificationFiles, getNoSetAttr;
            $set_attr = $form.find("#set_attr");
            if (verification.verify()) {
                $set_attr.find(".set_attr_box").each(function () {
                    var $this = $(this);
                    var sequence = $this.attr("sequence") - 0
                    min = Math.min(min, sequence);
                    max = Math.max(max, sequence);
                });
                initTableData = function (i, arr, selctStr) {
                    var _arr = arr;
                    //向内递归
                    var $ul = $set_attr.find('.set_attr_box[sequence="' + i + '"]');
                    try {
                        $ul.find(".setattr:checked").each(function () {
                            var $this = $(this);
                            var _data = {};
                            var _selctStr = selctStr || "";
                            var _key = $ul.attr("data_name"), data_id = $this.attr("data_id");
                            _selctStr += '[data_' + _key + '="' + data_id + '"]';
                            _data["kv"] = {};
                            _data["kv"][_key] = $this.closest("li").find(".attr_item").val();
                            _data["kv"].id = data_id;
                            _data["itemList"] = [];
                            initTableData(i + 1, _data["itemList"], _selctStr);
                            if (i === max) {
                                _data["itemList"] = [
                                   {
                                       "kv": {
                                           price: $(_selctStr).find(".price").val() - 0,
                                           amount: $(_selctStr).find(".quantity").val() - 0
                                       },
                                       "itemList": []
                                   }
                                ]
                            }
                            _arr.push(_data);
                        });
                    }
                    catch (e) {
                        if (!confirm("发现异常数据，是否继续提交？提交后可修改")) {
                            throw "数据异常，提交被终止！";
                        }
                    }
                };
                //获取商品属性列表
                getNoSetAttr = function () {
                    var $comm_attr_list_main = $form.find("#comm_attr_list_main");
                    postData.product_property = [];
                    $comm_attr_list_main.find(".form_row").each(function () {
                        var $this = $(this), _data = {}, _thisdata;
                        _thisdata = getNoSetAttrValue[$this.attr("data_type")]($this);
                        if (_thisdata.length) {
                            _data.select_id = $this.attr("data_id");
                            _data.select_name = $this.attr("data_name");
                            _data.kv = _thisdata;
                            postData.product_property.push(_data);
                        }
                    });
                    postData.product_property = JSON.stringify(postData.product_property);
                };
                //_getSpecificationData(true);
                var postData = {};
                if (global_setting.pdt_id) {
                    postData.product_id = global_setting.pdt_id;
                }
                //商品类型id
                postData.category_id = $form.find(".classthis").val();
                //商品名称
                postData.product_name = $.trim($form.find(".comm_name").val());
                //市场价
                postData.market_price = $form.find(".price").val();
                //热卖价
                postData.sale_price = $form.find(".sale_price").val();
                //货号
                postData.goods_id = $.trim($form.find(".goods_id").val());
                //商品图片
                postData.product_img = [];
                $form.find(".img_item:not(.img_main)").each(function () {
                    var src = $(this).find("img").attr("src");
                    //过滤（此过滤会导致只上传2，4，2张图片展示成1，2，2张图片），消除此BUG只要删除过滤即可
                    postData.product_img.push(src);
                });
                postData.product_img = JSON.stringify(postData.product_img);
                //比价信息
                postData.compare_price = [];
                postData.bread = encodeURIComponent($form.find(".bread").val());
                $form.find(".compare_item").each(function () {
                    var $this = $(this);
                    var _name = $this.find("select").val() - 0, _v = $this.find(".compare_price").val() - 0, _url = $this.find(".compareurl").val();
                    if (_name && _v && _url) {
                        postData.compare_price.push({
                            name: _name,
                            price: _v,
                            url: _url
                        });
                    }
                });
                postData.compare_price = JSON.stringify(postData.compare_price);
                //详细信息
                postData.info = lazyload.coding(editor.getContent());
                //库存计数类型
                postData.stock_count_type = $form.find('[name="inventory_count"]:checked').val();
                //商品所在地
                postData.location_area = $form.find(".selCity_rent").val();
                //发票
                postData.invoice = $form.find("[name='invoice']:checked").val();
                //橱窗推荐
                postData.shop_window_img = {};
                if ($form.find("#recommend1:checked").length) {
                    if ($form.find('.add_recommend_img_hook img').attr("src")) {
                        postData.shop_window_img.type = 1
                        postData.shop_window_img.img = $form.find('.add_recommend_img_hook img').attr("src");
                    } else {
                        postData.shop_window_img.type = 0;
                    }
                } else if (global_setting.shop_window_img) {
                    postData.shop_window_img.type = -1;
                } else {
                    postData.shop_window_img.type = 0;
                }
                postData.shop_window_img = JSON.stringify(postData.shop_window_img);
                //运费
                postData.freight = {};
                $shippingType = $form.find("#shipping_type1:checked");
                _shippingType = $shippingType.val();
                if (!_shippingType) {
                    $shippingType = $form.find("[name='seller_bear_type']:checked");
                    _shippingType = $shippingType.val();
                    if ($shippingType.closest("li").find(".model_data").length) {
                        postData.freight.id = logisticsModel.id;
                        postData.freight.name = logisticsModel.name;
                    } else {
                        postData.freight.mail = $form.find("#freight_mail").val();
                        postData.freight.express = $form.find("#freight_express").val();
                        postData.freight.ems = $form.find("#freight_ems").val();
                    }
                }
                postData.freight.type = _shippingType;
                postData.after_sale = aftermarketMsg.txt || "";
                postData.freight = JSON.stringify(postData.freight);
                postData.product_norm = [];
                initTableData(min, postData.product_norm);
                postData.product_norm = JSON.stringify(postData.product_norm);
                postData.ttm = $form.find(".listing_year").val() + " " + $form.find(".listing_month").val();
                postData.tag_list = [];
                $tag_list.find(".tag_item").each(function () {
                    postData.tag_list.push(encodeURIComponent($(this).attr("data_name")));
                });
                postData.tag_list = JSON.stringify(postData.tag_list);
                getNoSetAttr();
                $.ajax({
                    url: domains.item + '/api/product/add',
                    type: 'post',
                    data: postData,
                    dataType: 'json',
                    success: function (data) {
                        typeof callback === "function" && callback();
                        var upimgData = {}, _id;
                        postData.product_norm = JSON.parse(postData.product_norm);
                        if (data.success) {
                            _id = data.id
                            $specification_table = $form.find(".specification_table");
                            var _content = [
                                    '<div class="loading_con">',
                                        '<i class="loadingbg loading18_18_1"></i><span class="loading_msg">商品上架成功，正在处理图片......</span>',
                                        '<ul class="loading_list">',
                                        '</ul>',
                                    '</div>'].join('');
                            _content = $(_content);
                            var $contentul = _content.find("ul");
                            $specification_table.find("tr:visible").each(function () {
                                var $this = $(this), $file = $this.find(":file");
                                //upimgData[$this.attr("data_txt")] = "";
                                if ($file.val()) {
                                    $contentul.append('<li class="loading_item" data="' + $this.closest(".specification_table").attr("sequence") + '">' + $(this).find("td:eq(0)").html() + '<div class="schedule_p"><p class="schedule_s"></p></div></li>');
                                }
                            });
                            submitLoginBox = box.invBox({
                                boxCls: "loadingBox",
                                content: _content,
                                btns: []
                            });
                            submitLoginBox.show();
                            $specification_table.find("tr:visible :file").each(function () {
                                var $this = $(this);
                                if ($this.val()) {
                                    $this.attr("isup", "t");
                                }
                            });
                            $specificationFiles = $specification_table.find("tr:visible :file");
                            submitLoginBox.wmBox.find(".loading_item:eq(0) .schedule_s").animate({ width: "30%" }, 1000);
                            upload.queueUpLoad($specificationFiles,
                                function () {
                                    _content.find(".loading_msg").empty().append("图片上传完毕！正在整合");
                                    var postImgData = [];
                                    for (var i in upimgData) {
                                        if (!upimgData[i].length) {
                                            delete upimgData[i];
                                        }
                                    }
                                    $.ajax({
                                        url: domains.item + "/api/product/AddColor",
                                        type: "post",
                                        data: {
                                            id: _id,
                                            files: JSON.stringify(upimgData)
                                        },
                                        dataType: "json",
                                        success: function (data) {
                                            if (data && data.success) {
                                                setTimeout(function () {
                                                    submitLoginBox.close();
                                                    if (global_setting.pdt_id) {
                                                        showUpSuccess(_id);
                                                    } else {
                                                        showAddSuccess(_id);
                                                    }
                                                }, 2000);
                                            } else {

                                            }
                                        }
                                    })
                                },
                                function (data) {
                                    var $tr = this.closest("tr");
                                    var $table = this.closest(".specification_table");
                                    var $set_attr_box = $(".set_attr_box[sequence='" + $table.attr("sequence") + "']");
                                    var _name = $set_attr_box.attr("data_name");
                                    upimgData[_name] = upimgData[_name] || [];
                                    var i = submitLoginBox.wmBox.find("[animate]").length;
                                    submitLoginBox.wmBox.find(".loading_item:eq(" + (i) + ") .schedule_s").attr("animate", "t").stop().animate({ width: "100%" }, 2000);
                                    var _src = data.response.imgurl || $tr.find("img").attr("src");
                                    if (_src) {
                                        upimgData[_name].push({ kv: $tr.attr("data_txt"), url: _src, id: $tr.attr("data_id") });
                                    }
                                });
                        } else {
                            if (!successFalseBox) {
                                successFalseBox = box.alert({
                                    boxCls: "err_box_msg",
                                    titleText: "上架失败",
                                    content: '<p style="width: 320px;text-align: center;font-size: 14px; padding: 40px 40px 15px 40px;line-height: 30px; font-family: simsun;">上架失败，请稍候再试！</p>',
                                    btns: [
                                            {
                                                cls: "ui_btn_h46red8 mrl", text: "确定", res: "close", callback: function () {
                                                }
                                            }
                                    ],
                                    callback: function () {
                                        this.close = this.hide;
                                    }
                                });
                            }
                            successFalseBox.show();
                        }
                    },
                    error: function () {
                        typeof callback === "function" && callback();
                        if (!errorBox) {
                            errorBox = box.alert({
                                boxCls: "err_box_msg",
                                titleText: "上架失败",
                                content: '<p style="width: 320px;text-align: center;font-size: 14px; padding: 40px 40px 15px 40px;line-height: 30px; font-family: simsun;">上架失败，请稍候再试！</p>',
                                btns: [
                                        {
                                            cls: "ui_btn_h46red8 mrl", text: "确定", res: "hide", callback: function () {
                                            }
                                        }
                                ],
                                callback: function () {
                                    this.close = this.hide;
                                }
                            });
                        }
                        errorBox.show();
                    }
                });
            } else {
                typeof callback === "function" && callback();
            }
        };
        //显示登录弹窗
        var showLoginBox = function (msg) {
            var _content, $submit = $form.find(':submit');
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
            $submit.closest('.ui_btn').removeClass("ui_btn_h40gray16");
            $submit.val("提交");
        };
        //商品类型联动
        $form.on("change.classType", ".classparent", function () {
            var $this = $(this), _val = $this.val();
            var _data = classList;
            var s2 = _val.substr(0, 2);
            var subData = _data[s2 + "0000"].itemList[_val].itemList;
            $class.empty().append('<option value="0">--请选择--</option>');
            for (var i in subData) {
                $class.append('<option value="' + i + '">' + subData[i].name + '</option>');
            }
            return false;
        });
        $form.on("change.initAttr", ".classthis", function () {
            initAttr($(this).val());
            return false;
        });
        //商品图片
        $form.on("click", ".up_img_btn_hook", function () {
            _file.call(this, ".img_item");
            return false;
        });
        //橱窗推荐
        $form.on("click", ".add_recommend_img_hook", function () {
            _file.call(this, ".up_recommend_box");
            return false;
        });
        //橱窗推荐预览
        $(".up_recommend_box .form_file").change(function () {
            var $this = $(this);
            upload.upload($this, function (data) {
                if (data.response) {
                    this.closest(".up_recommend_box").find(".add_recommend_img_hook img").attr("src", data.response.imgurl).css("display", "block");
                }
            });
            return false;
        });
        //商品图片预览
        $(".img_item .form_file").change(function () {
            var $this = $(this);
            var errtips;
            var _v = $this.val();
            _v = _v.substr(_v.lastIndexOf(".") + 1).toLowerCase();
            if (imgtype.indexOf(_v) >= 0) {
                upload.upload($this, function (data) {
                    var $img_item = this.closest(".img_item");
                    if (data.response) {
                        $img_item.find(".up_img_btn_hook img").attr("src", data.response.imgurl);
                        if ($img_item.hasClass("img_main")) {
                            $(".up_img_list .img_item:eq(1) img").attr("src", data.response.imgurl);

                        }
                        if ($img_item.index() == 1) {
                            $(".up_img_list .img_main img").attr("src", data.response.imgurl);
                            $(".up_img_list .img_main .img_bg").css({ "display": "block" });

                        }
                        $img_item.find(".img_bg").css({ "display": "block" });
                    }
                });
            } else {
                errtips = $this.data("errtips");
                if (!errtips) {
                    errtips = new tips({
                        ele: $this.closest('.img_item'),
                        con: '<p>请选择：' + imgtype + '格式的文件进行上传！</p>',
                        close: 2000,
                        direction: 'rc',
                        offset: {
                            top: -5
                        }
                    });
                    $this.data("errtips", errtips);
                }
                errtips.show();
            }
            return false;
        });
        //运费
        $form.on("change.shipping", "[name='shipping_type']", function () {
            var $this = $(this);
            if ($this.closest(".shipping_type_item").find(".seller_bear_main").length) {
                $seller_bear_main.css("display", "block");
            } else {
                $seller_bear_main.css("display", "none");
            }
        });
        //运费承担
        $form.on("change.seller_bear", "[name='seller_bear_type']", function () {
            var $this = $(this);
            //$model_data.stop(true, true);
            if ($this.closest("li").find(".model_data").length) {
                $model_data.css("display", "inline");
            } else {
                $model_data.css("display", "none");
            }
        });
        //是否橱窗推荐
        $form.on("change.recommend", "#recommend1", function () {
            var $this = $(this);
            if ($this.attr("checked")) {
                //IE67的问题  有木有好的解决方案？
                $up_recommend_box.addClass("show_add").closest(".form_row").next().css("zoom", "0").css("zoom", "1");
            } else {
                $up_recommend_box.removeClass("show_add").closest(".form_row").next().css("zoom", "0").css("zoom", "1");
            }
        });
        //可编辑属性(规格)效果
        $form.on("change.setAttr", ".setattr", function () {
            /*维护此代码记得维护全选功能*/
            var $this = $(this), $li = $this.closest("li"), $ul = $li.closest("ul"), errTips = $ul.data("errTips");
            errTips && errTips.hide();
            if ($this.attr("checked")) {
                $li.find(".attr_item").css("display", "inline-block");
                $li.find(".chk_key").css("display", "none");
            } else {
                $li.find(".attr_item").css("display", "none");
                $li.find(".chk_key").css("display", "inline-block");
            }
            _showSpecificationItem.call(this);
            _initSpecificationMain();
            verification.position();
            //return false;
        });
        //可编辑属性(规格)全选
        $form.on("change.setattrall", ".setattrallchk", function () {
            var $this = $(this), $box = $this.closest("ul");
            if ($this.attr("checked")) {
                /*
                下面的代码可以如此写，但是应为change使用了委托当n多委托冒泡到form的时候，会导致阻塞
                $box.find(".setattr").attr("checked", "checked").change();
                */
                $box.find(".setattr").attr("checked", "checked");
                $box.find(".attr_item").css("display", "inline-block");
                $box.find(".chk_key:not(.nohide)").css("display", "none");
            } else {
                /*
               下面的代码可以如此写，但是应为change使用了委托当n多委托冒泡到form的时候，会导致阻塞
                $box.find(".setattr").removeAttr("checked").change();
               */
                $box.find(".setattr").removeAttr("checked");
                $box.find(".attr_item").css("display", "none");
                $box.find(".chk_key:not(.nohide)").css("display", "inline-block");
            }
            _showSpecificationItem.call(this);
            _initSpecificationMain();
            return false;
        });
        $("body").on("click.hideBatch_box", function () {
            $(".batch_box").css("display", "none");
        });
        //批量操作
        $form.on("click.batchSet", ".batch_set", function () {
            var $this = $(this);
            $(".batch_box").css("display", "none");
            var _box = $this.data("box");
            if (!_box) {
                _box = box.relyBox({
                    rely: $this,
                    boxCls: 'batch_box',
                    content: _createBatchMain(),
                    btns: [
                           {
                               cls: "ui_btn_h22red10", res: "hide", text: "确定",
                               callback: function () {
                                   var $tr = $this.closest("tr");
                                   var $batchPrice = this.wmBox.find("[name='batchtype_1']:checked");
                                   var $batchQuantity = this.wmBox.find("[name='batchtype_2']:checked");
                                   var _batchPriceValue = $batchPrice.attr("data_name");
                                   var _batchQuantityValue = $batchQuantity.attr("data_name");
                                   var $specification_main_box = $(".specification_main_box");
                                   var _priceValue = $tr.find(".price").val();
                                   var _quantityValue = $tr.find(".quantity").val();
                                   $specification_main_box.find("tr[data_" + _batchPriceValue + "='" + $tr.attr("data_" + _batchPriceValue) + "']").each(function () {
                                       $(this).find(".price").val(_priceValue)
                                   });
                                   $specification_main_box.find("tr[data_" + _batchQuantityValue + "='" + $tr.attr("data_" + _batchQuantityValue) + "']").each(function () {
                                       $(this).find(".quantity").val(_quantityValue)
                                   });
                                   _getSpecificationData();
                                   this.hide();
                                   $specification_main_box.find(".quantity:eq(0)").change();
                                   return false;
                               }
                           },
                           {
                               cls: "ui_btn_h22gray6", res: "hide", text: "取消",
                               callback: function () {
                                   this.hide()
                               }
                           }
                    ]
                });
                $this.data("box", _box);
            }
            _box.show()
            return false;
        });
        //规格数据在文本框失去焦点的时候前端进行数据缓存
        $form.on("blur.cacheData", ".cache_data_hook", function () {
            var $this = $(this), $tr = $this.closest("tr"), str = [], _key;
            _initBatchBoxModelTxtArr();
            for (var i in batchBoxModelTxtArr) {
                str.push("[data_" + batchBoxModelTxtArr[i].name + "='" + $tr.attr("data_" + batchBoxModelTxtArr[i].name) + "']");
            }
            _key = 'tr' + str.join('');
            if (!SpecificationData.dataList) {
                SpecificationData.dataList = {};
            }
            SpecificationData.dataList[_key] = SpecificationData.dataList[_key] || {};
            if ($this.hasClass("price")) {
                SpecificationData.dataList[_key].price = $this.val()
            }
            if ($this.hasClass("quantity")) {
                SpecificationData.dataList[_key].quantity = $this.val()
            }
        });
        //可编辑属性文本修改联动
        $form.on("change.linkage", ".attr_item", function () {
            var $this = $(this),
                _key = $this.attr("key"),
                $ul = $this.closest(".set_attr_box"),
                _v = $.trim($this.val()),
                $inputKey,
                original_val,
                $specification_dataitem;
            if (!_key) { return; }
            $inputKey = $("[input_key='" + _key + "']");
            original_val = $inputKey.html();
            $inputKey.html(_v);
            $inputKey.closest("[data_txt]").attr("data_txt", _v);
            _key = $ul.attr("data_name");
            $specification_dataitem = $inputKey.closest(".specification_dataitem");
            //$form.find(".specification_main .specification_dataitem[data_" + _key + "='" + $specification_dataitem.attr("data_" + _key) + "']").attr("data_" + _key, _v);
            _getSpecificationData(true);
        });
        //计算库存
        $form.on("change.stockcon", ".specification_main .quantity", function () {
            var $quantityList = $(".specification_main").find(".quantity");
            var _con = 0;
            $quantityList.each(function () {
                _con += ($(this).val() - 0) || 0;
            });
            $stock.val(_con);
        });
        //选择运费模版
        $form.on("click.gotoShipping", ".choose_shipping_model", function () {
            window.open(domains.item + '/logisticstemplate?isparentopen=t');
            return false;
        });
        $form.on("click", ".choose_aftermarket_msg", function () {
            window.open(domains.item + '/aftersale');
            return false;
        });
        //提交
        $form.on("click.submit", ":submit", function () {
            var $this = $(this), $ui_btn = $this.closest(".ui_btn");
            if (global_setting.flag && global_setting.flag.code - 0) {
                initError[global_setting.flag.code]();
                return false;
            }
            if ($ui_btn.hasClass("ui_btn_h40gray16")) {
                return false;
            }
            $ui_btn.addClass("ui_btn_h40gray16");
            $this.val("验证数据中...");
            //判断登录，因为编辑页面有可能长时间，然后服务端已经登出，所以这里需要判断下
            lib.verificationLogin(function () {
                //判断权限
                var _role = lib.getRole(1);
                if (_role.key == 2) {
                    _submit(function () {
                        $ui_btn.removeClass("ui_btn_h40gray16");
                        $this.val("提交");
                    });
                } else {
                    showLoginBox("登录账号为买家账号，<b>请重新登录</b>！");
                }
            }, showLoginBox);
            return false;
        });
        //设置运费模版
        window.setShipping = function (id, name) {
            logisticsModel.id = id;
            logisticsModel.name = name;
            $form.find(".model_data span:eq(0)").empty().append(name);
            $form.find(".choose_shipping_model .ui_btn_txt").empty().append("重新选择");
            verification.verify($form.find(".shipping_type"));
        };
        //设置售后说明
        window.setAftermarketMsg = function (id, txt) {
            aftermarketMsg.id = id;
            aftermarketMsg.txt = txt;
            $form.find(".aftermarket_remark p").empty().append(txt);
            $form.find(".choose_aftermarket_msg .ui_btn_txt").empty().append("重新选择");
        };
        //删除已上传的图片项
        $form.on("click.delUpimgItem", ".del_upimg_item", function () {
            var $this = $(this);
            $this.closest("td").find("img").attr("src", "").css("display", "none");
            $this.css("visibility", "hidden");
            return false;
        });
        $form.on("change", ".setattr_file", function () {
            var $this = $(this).closest("td");
            $this.find("img").attr("src", "").css("display", "none");
            $this.find(".del_upimg_item").css("visibility", "hidden");
        });
        //商品标题计算字数
        $form.find(".comm_name").on("keyup", function () {
            var $this = $(this), _length;
            if ($limit && $limit.length) {
                _length = $.trim($this.val()).length;
                $limit.empty().append(_length + "/40");
                if (_length > 40) {
                    $limit.css({
                        color: "#e13436"
                    });
                } else {
                    $limit.css({
                        color: "#f47d15"
                    });
                }
            } else {
                $limit = $this.closest(".form_row").find(".form_remark b");
                $this.keyup();
            }
        });
        $form.find(".comm_name").keyup();
        //自动获取标签
        $form.on("click", ".create_tag", function () {
            var _tag_list = [], i, not_repeat = {};
            var $comm_attr_list_main = $form.find("#comm_attr_list_main");
            var _comm_name = $.trim($form.find(".comm_name").val()).split(' ');
            for (i in _comm_name) {
                //非空，长度2-8，已存在的标签里面没有，未存在的标签里面也没有
                if (_comm_name[i].length &&
                    _comm_name[i].length >= 2 &&
                    _comm_name[i].length <= 8 && !$tag_list.find(".tag_item[data_name='" + _comm_name[i] + "']").length&&
                    !not_repeat[_comm_name[i]]) {
                    _tag_list.push('<li class="tag_item" data_name="' + _comm_name[i] + '">' + _comm_name[i] + '<a class="wm_ico fork2  remove_tag" href="#"></a></li>');
                    not_repeat[_comm_name[i]] = 1;
                }
            }
            $comm_attr_list_main.find(".form_row").each(function () {
                var $this = $(this), _data = {}, _thisdata;
                _thisdata = getNoSetAttrValue[$this.attr("data_type")]($this);
                for (i in _thisdata) {
                    //非空，长度2-8，已存在的标签里面没有，未存在的标签里面也没有
                    if (_thisdata[i].value &&
                        _thisdata[i].value.length >= 2 &&
                        _thisdata[i].value.length <= 8 &&
                        !$tag_list.find(".tag_item[data_name='" + _thisdata[i].value + "']").length&&
                        !not_repeat[_thisdata[i].value]) {
                        _tag_list.push('<li class="tag_item" data_name="' + _thisdata[i].value + '">' + _thisdata[i].value + '<a class="wm_ico fork2  remove_tag" href="#"></a></li>');
                        not_repeat[_thisdata[i].value] = 1;
                    }
                }
            });
            $tag_list.find(".tag_item:not(.no_remove)").remove();
            $tag_list.prepend(_tag_list.join(''));
            return false;
        });
        //删除标签
        $form.on("click", ".remove_tag", function () {
            $(this).closest(".tag_item").fadeOut(function () {
                $(this).remove();
            });
            return false;
        });
        //添加自定义标签
        $form.on("click", ".add_custom_tag", function () {
            var _v = $.trim($custom_tag_val.val());
            if (_v && _v.length >= 2 && _v.length <= 8 && !$tag_list.find(".tag_item.no_remove[data_name='" + _v + "']").length) {
                $tag_list.prepend('<li class="tag_item no_remove" data_name="' + _v + '">' + _v + '<a class="wm_ico fork2  remove_tag" href="#"></a></li>');
                $custom_tag_val.val('');
            } else {
                lib.BGShine({
                    ele: $custom_tag_val,
                    original_color: "#fff",
                    change_color: "#ff6363",
                    frequency: 3
                });
            }
            return false;
        });
    };
    init();
});
