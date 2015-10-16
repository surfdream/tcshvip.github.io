/*
社团分类
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
        page = require('http://s.tcsh.me/tcsh/model/wmpage/dist/wmpage.js'),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
        crowd_type = require('http://s.tcsh.me/tcsh/view/public/wm_crowd_type/dist/crowd_type.js'),
        crowd_data = require('http://s.tcsh.me/tcsh/view/public/wm_crowd_data/dist/crowd_data.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    require('http://s.tcsh.me/tcsh/view/public/wm_form/css/style.css#');
    require('../css/style.css#');
    var g_CrowdData = {};
    var _getCrowd = function (op) {
        $.ajax({
            url: domains.commune + "/service/commune/list.json",
            data: {
                size: op.size || 20,
                key: op.key || "",
                category: op.category || "",
                orderByMemberCount: op.orderByMemberCount || ""
            },
            dataType: "jsonp",
            success: function (data) {
                for (var i in data.response.data) {
                    g_CrowdData[data.response.data[i].id] = data.response.data[i];
                }
                //for (i in data.success.top_list) {
                //    g_CrowdData[data.success.top_list[i].id] = data.success.top_list[i];
                //}
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    var _search_crowd_item = juicer([
        '{@each data as item}',
        '<li class="crowd_item" data_id="${item.id}">',
            '<div href="#" class="chk_crowd_item">',
                '<img src="${item.icon}">',
                '<a href="#" class="crowd_name show_crdata" data_id="${item.id}" title="${item.name}">${item.name}</a>',
                '<span class="crowd_people_con"><i class="iconfont">&#xf00e4;</i>${item.memberCount}</span>',
                '<p class="crowd_tag">${item.tags}</p>',
                '<p class="introduction">${item.introduction}</p>',
                '<div class="btns">',
                    '<a href="#" class="ui_btn ui_btn_h22white7 show_crdata" data_id="${item.id}"><span class="ui_btn_txt">帮社资料</span></a>',
                    '<a href="#" class="ui_btn ui_btn_h22white7 chkin_cr" data_id="${item.id}"><span class="ui_btn_txt">加入帮社</span></a>',
                '</div>',
            '</div>',
        '</li>',
        '{@/each}'
    ].join(''));
    var _crowd_data_main = juicer([
        '<div class="crowd_data_main">',
            '<img class="crowd_img" src="${icon}" />',
            '<p class="crowd_title"><b class="crowd_name">${name}</b><span class="crowd_id">${id}</span></p>',
            '<p class="types">${mainCategoryName},${minorCategoryNames}<span class="crowd_people_con"><span class="iconfont">&#xf00e4;</span>${memberCount}</span></p>',
            '<p class="tags">${tags}</p>',
            '<div class="introduction_main">',
                '<b class="introduction_title">帮社简介：</b>',
                '<p class="introduction">$${introduction}</p>',
            '</div>',
            '<div class="boss">',
                '<b class="boss_title">入驻商家：</b>',
                '<ul class="boss_list"></ul>',
            '</div>',
            '<div class="btns">',
                '<a href="#" class="ui_btn ui_btn_h26blue2 chkin_cr" data_id="${id}"><span class="ui_btn_txt">加入帮社</span></a>',
                '<a href="#" class="ui_btn ui_btn_h26white6 return_list"><span class="ui_btn_txt">返回</span></a>',
            '</div>',
        '</div>'
    ].join(''));
    var _boss_list = juicer([
        '{@each data as item}',
        '<li class="boss_item">',
            '<a href="' + domains.item + '/merchant/list/${item.id.sellerId}" target="_blank"><img src="${item.logo}" /></a>',
            '<a href="' + domains.item + '/merchant/list/${item.id.sellerId}" target="_blank" class="boss_name">${item.sellerName}</a>',
        '</li>',
        '{@/each}'
    ].join(''))
    var _createBox = function (op) {
        return box.alert({
            boxCls: "crowd_box search_crowd_box",
            titleText: "帮社列表",
            content: [
                '<div class="search_crowd_main">',
                    '<ul class="search_form wm_form clearfix">',
                        '<li class="form_row no_wrap">',
                            '<label class="row_key">关键字：</label>',
                            '<input type="text" class="form_txt key_txt" placeholder="名称" />',
                        '</li>',
                        '<li class="form_row no_wrap">',
                            '<label class="row_key">类型：</label>',
                            '<select class="form_sel crowd_type">',
                                '<option value="0">-请选择-</option>',
                            '</select>',
                        '</li>',
                        '<li class="form_row no_wrap">',
                            '<label class="row_key">&nbsp;</label>',
                            '<a href="#" class="ui_btn ui_btn_h24green4 search_submit"><span class="ui_btn_txt">查询</span></a>',
                        '</li>',
                    '</ul>',
                    '<div class="crowd_head">',
                        '<p class="top">热门帮社：</p>',
                        '<p class="sort"><a href="#" class="sort_btn curr">默认</a><a href="#" class="sort_btn">人数<span class="wm_ico arrow9down"></span></a></p>',
                    '</div>',
                    '<ul class="crowd_list"></ul>',
                    '<div class="wm_page"></div>',
                    '<div class="crowd_data"></div>',
                '</div>',
            ].join(''),
            btns: [],
            callback: function () {
                var self = this, _page;
                this.close = this.hide;
                var $crowd_data = this.wmBox.find(".crowd_data"),
                    $search_form = this.wmBox.find(".search_form"),
                    $top = this.wmBox.find(".top"),
                    $crowd_type = this.wmBox.find(".crowd_type"),
                    $crowd_list = this.wmBox.find(".crowd_list");
                var initPage = function (data) {
                    _page = page.Create({
                        url: domains.commune + "/service/commune/list.json",
                        async: true,
                        size: 20,
                        index: 1,
                        sum: data.response.paging.total,
                        pagekey: "page",
                        dataType: "jsonp",
                        front: true,
                        param: {
                            size: 20,
                            key: "",
                            category: "",
                            orderByMemberCount: ""
                        },
                        success: function (data) {
                            _page.setIndex(this.index);
                            $crowd_list.empty().append(_search_crowd_item.render(data.response));
                        },
                        error: function (data) {
                            alert("系统繁忙！");
                        }
                    });
                };
                var initCRD = function (id) {
                    var $crowd_data_main = $(_crowd_data_main.render(g_CrowdData[id]))
                    $crowd_data.empty().append($crowd_data_main);
                    $crowd_data.animate({
                        left: 0
                    });
                    crowd_data.getBossList({
                        communeId: id,
                        success: function (data) {
                            if (data.response) {
                                $crowd_data_main.find(".boss_list").empty().append(_boss_list.render(data.response));
                            }
                        },
                        error: function (data) {

                        }
                    });
                };
                var hideCRD = function () {
                    $crowd_data.animate({
                        left: 800
                    });
                };

                crowd_type.getData({
                    success: function (data) {
                        var _html = [];
                        if (data.response) {
                            for (var i in data.response.data) {
                                _html.push('<optgroup value="' + data.response.data[i].id + '" label="' + data.response.data[i].categoryName + '">');
                                for (var j in data.response.data[i].childs) {
                                    _html.push('<option vlaue="' + data.response.data[i].childs[j].id + '">' + data.response.data[i].childs[j].categoryName + '</option>');
                                }
                                _html.push('</optgroup>');
                            }
                            $crowd_type.append(_html.join(''));
                        }
                    }
                });

                this.wmBox.on("click", ".show_crdata", function () {
                    initCRD($(this).attr("data_id"));
                    return false;
                });
                this.wmBox.on("click", ".return_list", function () {
                    hideCRD();
                    return false;
                });
                //详细数据里面的加入
                this.wmBox.on("click", ".crowd_data .chkin_cr", function () {
                    var $this = $(this), _id = $this.attr("data_id"),
                    $crowd_item = $crowd_list.find(".crowd_item[data_id='" + _id + "']");
                    crowd_data.join({
                        communeId: _id,
                        success: function (data) {
                            if (data.response.data) {
                                hideCRD();
                                $crowd_item.find(".chkin_cr").replaceWith('<a href="#" class="ui_btn ui_btn_h22red21" target="_blank"><span class="ui_btn_txt">进入帮社</span></a>');
                            } else {
                                alert("您已加入该公社，请不要重复加入！");
                                $this.replaceWith('<a href="#" class="ui_btn ui_btn_h22red21" target="_blank"><span class="ui_btn_txt">进入帮社</span></a>');
                            }
                        },
                        error: function () {
                            alert("系统繁忙！");
                        }
                    });
                    return false
                });
                //列表上的加入
                this.wmBox.on("click", ".crowd_list .chkin_cr", function () {
                    var $this = $(this),
                        $crowd_item = $this.closest(".crowd_item"),
                        _id = $crowd_item.attr("data_id");
                    crowd_data.join({
                        communeId: _id,
                        success: function (data) {
                            if (data.response.data) {
                                $this.replaceWith('<a href="#" class="ui_btn ui_btn_h22red21" target="_blank"><span class="ui_btn_txt">进入帮社</span></a>');
                            } else {
                                alert("您已加入该公社，请不要重复加入！");
                                $this.replaceWith('<a href="#" class="ui_btn ui_btn_h22red21" target="_blank"><span class="ui_btn_txt">进入帮社</span></a>');
                            }
                        },
                        error: function () {
                            alert("系统繁忙！");
                        }
                    });

                    return false
                });
                //搜索
                this.wmBox.on("click", ".search_submit", function () {
                    _getCrowd({
                        key: $search_form.find(".key_txt").val(),
                        category: $crowd_type.val() - 0,
                        success: function (data) {
                            $crowd_list.empty().append(_search_crowd_item.render(data.response));
                            initPage(data);
                        },
                        error: function (data) {

                        }
                    });
                    return false;
                });
                this.wmBox.find(".search_submit").click();
            }
        });
    };
    exports.createBox = function (op) {
        if ($.browser.msie && $.browser.version === "6.0") {
            alert("浏览器版本过低，无法使用该功能！");
            return false;
        }
        return _createBox(op);
    };
});