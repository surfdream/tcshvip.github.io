define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        lib = require("lib"),
        logistics_data = require("wmlogistics_data"),
        box = require('wmbox');
    require('http://s.tcsh.me/tcsh/model/wmcrbtn/css/style.css#');
    var chkedData = [];
    var init = function () {
        var $page = $("#page");
        $page.find(".user_lc_item").each(function () {
            chkedData.push($(this).attr("data_id"));
        });
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        var initBoxList = function () {
            var _html = juicer([
                '{@each list as item}',
                '<li class="item" data_key="${item.key}" data_selectstr="',
                '{@each item.list as subItem}',
                '${subItem.name}',
                '{@/each}',
                '">',
                    '<h4>${item.key}</h4>',
                    '<ul class="item_list">',
                        '{@each item.list as subItem}',
                        '<li class="sub_item">',
                            '<div class="wmcrbtn_box">',
                                '<div class="wmcrbtn white1" data_id="${subItem.key}" data_name="${subItem.name}">',
                                    '<div class="wmcrbtn_txt" data_name="${subItem.name}">',
                                        '<span class="changeblock"></span>${subItem.name}',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</li>',
                        '{@/each}',
                    '</ul>',
                '</li>',
                '{@/each}'
            ].join(''));
            this.wmBox.find(".logistics_list").empty().append(_html.render(logistics_data));
            for (var i in chkedData) {
                this.wmBox.find(".wmcrbtn[data_id='" + chkedData[i] + "']").attr("class", "wmcrbtn green3 logistics_chked");
            }
            this.wmBox.on("click", ".wmcrbtn", function () {
                var $this = $(this);
                if ($this.hasClass("white1")) {
                    $this.attr("class", "wmcrbtn green3 logistics_chked");
                } else {
                    $this.attr("class", "wmcrbtn white1");
                }
            });
        };
        $page.on("click", ".add_user_lc", function () {
            var $this = $(this), chkBox = $this.data('chkBox');
            if (!chkBox) {
                chkBox = box.invBox({
                    boxId: "chk_box",
                    content: [
                        '<div class="chk_main">',
                            '<div class="main_head"><h3>选择常用的物流公司</h3></div>',
                            '<div class="select_box">',
                            '检索：<input type="text" id="select_txt">',
                            '</div>',
                            '<ul class="logistics_list">',
                            '</ul>',
                            '<div class="btns"><a href="#" class="ui_btn ui_btn_h47yellow14 submit hide"><span class="ui_btn_txt">确定</span></a><a href="#" class="hide">关闭</a></div>',
                        '</div>'].join(''),
                    callback: function () {
                        var $logistics_list = this.wmBox.find(".logistics_list"), _i = "abcdefghijklmnopqistuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", $selectEle;
                        var chkedStr = function (_v) {
                            $selectEle = $logistics_list.find(".item[data_selectstr*='" + _v + "'],.item[data_selectstr*='" + _v.toLowerCase() + "'],.item[data_selectstr*='" + _v.toUpperCase() + "']");
                            $selectEle.css("display", "block");
                            $selectEle.each(function () {
                                var $this = $(this);
                                $this.find("[data_name*='" + _v + "'],[data_name*='" + _v.toLowerCase() + "'],[data_name*='" + _v.toUpperCase() + "']").each(function () {
                                    var $this = $(this);
                                    $this.find(".wmcrbtn_txt").empty().append('<span class="changeblock"></span>' + $this.attr("data_name").replace(new RegExp(_v + "|" + _v.toLowerCase() + "|" + _v.toUpperCase(), "g"), '<b style="color: red;">' + _v + '</b>'));
                                })
                            });
                        };
                        this.wmBox.find("#select_txt").on("keyup", function () {
                            var $this = $(this), _v = $this.val();
                            $logistics_list.find("b").css({
                                "color": "#333",
                                "font-weight": "500"
                            });
                            if (_v) {
                                if (_v.length > 1) {
                                    $logistics_list.find(".item").css("display", "none");
                                    chkedStr(_v);
                                } else {
                                    if (_i.indexOf(_v) > -1 || _i.indexOf(_v.toLowerCase()) > -1 || _i.indexOf(_v.toUpperCase()) > -1) {
                                        $logistics_list.find(".item").css("display", "none");
                                        $logistics_list.find('.item[data_key="' + _v.toUpperCase() + '"]').css("display", "inline-block");
                                    } else {
                                        chkedStr(_v);
                                    }
                                }
                            } else {
                                $logistics_list.find(".item").css("display", "inline-block");
                            }
                        });
                    }
                });
                /*代码结构不好，有空改*/
                initBoxList.call(chkBox);
                chkBox.wmBox.on("click", ".submit", function () {
                    var postData = {};
                    postData.list = [];
                    chkBox.wmBox.find(".logistics_chked").each(function () {
                        var $this = $(this);
                        postData.list.push({ id: $this.attr("data_id"), name: encodeURIComponent($this.attr("data_name")) });
                    });
                    postData.list = JSON.stringify(postData.list);
                    $.ajax({
                        url: domains.sell+"/api/logistics/add",
                        type: "post",
                        dataTypa: "json",
                        data: postData,
                        success: function (data) {
                            if (data.success) {
                                alert("保存成功！");
                                window.location.href = domains.sell+"/commonlogistics";
                            } else {
                                data.error && alert(data.error);
                            }
                        }
                    });
                    return false;
                });
                $this.data('chkBox', chkBox);
            }
            chkBox.show();
            return false;
        });
        $page.on("click", ".del", function () {
            var $this = $(this), $user_lc_item, thisconfirm = $this.data("thisconfirm");
            if (!thisconfirm) {
                thisconfirm = box.relyBox({
                    rely: $this,
                    content: '<p>确定要去掉该物流？</p>',
                    btns: [
                           {
                               cls: "ui_btn_h22red10", res: "close", text: "确定", callback: function () {
                                   this.hide();
                                   $user_lc_item = $this.closest(".user_lc_item");
                                   $.ajax({
                                       url: domains.sell+"/api/logistics/del",
                                       type: "post",
                                       dataType: "json",
                                       data: {
                                           id: $user_lc_item.attr("data_id"),
                                           name: encodeURIComponent($user_lc_item.attr("data_name"))
                                       },
                                       success: function (data) {
                                           if (data.success) {
                                               setTimeout(function () {
                                                   alert("删除成功！");
                                                   window.location.href = domains.sell+"/commonlogistics";
                                               }, 800);
                                           } else {
                                               data.error && alert(data.error);
                                           }
                                       }
                                   });

                                   $user_lc_item.addClass('hide_item');
                                   setTimeout(function () {
                                       $user_lc_item.remove();
                                   }, 400);
                               }
                           },
                           { cls: "ui_btn_h22gray6", res: "close", text: "取消", callback: function () { } }
                    ],
                    callback: function () {
                        this.close = this.hide;
                    }

                });
                $this.data("thisconfirm", thisconfirm);
            }
            thisconfirm.show();
            return false;
        });
    };
    init();
});

