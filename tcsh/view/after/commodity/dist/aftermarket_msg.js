define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        juicer = require("juicer"),
        box = require('wmbox'),
        tips = require('wmtips'),
        verification = require('wmverification');
    window.document.domain = "tcsh.me";
    var init = function () {
        window.document.domain = "tcsh.me"
        verification.init($("#aftermarket_ps"));
        bind();
    };
    var bind = function () {
        var $page = $("#aftermarket_ps"), $list = $page.find(".aftermarket_ps_list"),
            _itemHtml = [
                '<li class="aftermarket_ps_item add_model">',
                    '<div class="aftermarket_ps_item_head">',
                        '<a href="#" class="aftermarket_btn del_aftermarket_btn">删除</a>',
                        '<a href="#" class="aftermarket_btn edit_aftermarket_btn">修改</a>',
                        '<input type="text" class="aftermarket_ps_name" placeholder="售后说明模版名称" wmv="empty" wmvmsg="请输入售后说明模版名称！" />',
                        '<h3></h3>',
                    '</div>',
                    '<div class="aftermarket_ps_item_mian">',
                        '<p></p>',
                        '<textarea wmv="empty|max:300" wmvmsg="请输入售后说明详细内容！|售后说明不宜太多，请控制在300字内！"></textarea>',
                    '</div>',
                    '<div class="aftermarket_ps_item_btns">',
                        '<a href="#" class="ui_btn ui_btn_h27gray8 use"><span class="ui_btn_txt">使用此模版</span></a>',
                        '<a href="#" class="ui_btn ui_btn_h27gray8 save"><span class="ui_btn_txt">保存</span></a>',
                        '<a href="#" class="ui_btn ui_btn_h27gray8 close"><span class="ui_btn_txt">取消</span></a>',
                    '</div>',
                '</li>',
            '</ul>'
            ].join('');
        $page.on("click", ".add_aftermarket_ps", function () {
            $list.prepend(_itemHtml);
            return false;
        });
        $page.on("click", ".save", function () {
            var $this = $(this), $box = $this.closest(".aftermarket_ps_item");
            var _name, _txt, _id;
            var postData = {};
            if (verification.verify($box)) {
                verification.hideTips($box);
                _name = $box.find(".aftermarket_ps_name").val();
                _txt = $box.find("textarea").val().replace(/\n/g, '<br />');
                postData.name = _name;
                postData.txt = _txt;
                _id = $this.closest(".aftermarket_ps_item").attr("data_id");
                if (_id) {
                    postData.id = _id;
                }
                $.ajax({
                    url: domains.item+"/api/aftersale/add",
                    type: "post",
                    dataType: "json",
                    data: postData,
                    success: function (data) {
                        if (data.success) {
                            $box.find("p").empty().append(_txt);
                            $box.find("h3").empty().append(_name);
                            $box.removeClass("add_model");
                            $this.closest(".aftermarket_ps_item").attr("data_id", data.id);
                        }
                    }
                })
            }
            return false;
        });
        $page.on("click", ".close", function () {
            var $this = $(this), $box = $this.closest(".aftermarket_ps_item");
            
            if ($box.attr("data_id")) {
                $box.removeClass("add_model");
            } else {
                $box.remove();
            }
            var _boxlength = $(".aftermarket_ps_item").length;
            //_boxlength > 1 && $box.remove();
            return false;
        });
        $page.on("click", ".edit_aftermarket_btn", function () {
            var $this = $(this), $box = $this.closest(".aftermarket_ps_item");
            $box.addClass("add_model");
            $box.find("textarea").val($box.find("textarea").val().replace(/<br \/>/g, '\n'));
            return false;
        });
        $page.on("click", ".del_aftermarket_btn", function () {
            var $this = $(this), $box = $this.closest(".aftermarket_ps_item"), errorTips, confirm_del;
            confirm_del = $this.data("confirm_del");
            if (!confirm_del) {
                confirm_del = box.relyBox({
                    rely: $this,
                    boxCls: "confirm_del",
                    content: '<p class="relymsg">你确定要删除此售后说明模版？</p><p style="color:#b0b0b0">删除后将无法恢复！</p>',
                    btns: [
                       {
                           cls: "ui_btn_h22red10", res: "hide", text: "确定", callback: function () {
                               $.ajax({
                                   url: domains.api+"/AfterSale/mv/" + $box.attr("data_id"),
                                   type: "get",
                                   dataType: "jsonp",
                                   success: function (data) {
                                       if (data.success) {
                                           var _boxlength = $(".aftermarket_ps_item").length;
                                           if (_boxlength > 1) {
                                               $box.remove();
                                           } else {
                                               $box.find(".aftermarket_ps_name").val('');
                                               $box.find("textarea").val('');
                                               $box.addClass("add_model");
                                               $box.removeAttr("data_id");
                                           }
                                       } else {
                                           errorTips = $this.data("errorTips");
                                           if (!errorTips) {
                                               errorTips = new tips({
                                                   ele: $this,
                                                   con: '<p>删除失败！@码农赶紧处理！</p>',
                                                   close: 2000,
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
                                               close: 2000,
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
                           cls: "ui_btn_h22gray6", res: "hide", text: "取消", callback: function () {

                           }
                       }
                    ]
                });
                $this.data("confirm_del", confirm_del);
            }
            confirm_del.show();
            return false;
        });
        $page.on("click", ".use", function () {
            var $this = $(this);
            window.opener.setAftermarketMsg(999, $this.closest(".aftermarket_ps_item").find("p").html());
            window.close();
        });
    };
    init();
});
