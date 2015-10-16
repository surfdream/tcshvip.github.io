define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        box = require('wmbox'),
        verification = require('wmverification'),
        juicer = require('juicer'),
        page = require('wmpage');

    var init = function () {
        verification.addRule([
            {
                key: "sel_empty",
                fun: function () {
                    return !!this.val();
                }
            }
        ]);
        if (global_setting && global_setting.PageInfo && global_setting.PageInfo.totalcount) {
            var _page = page.Create({
                url: domains.sell + '/order/list?' + $(".seleft_box .wm_form").serialize(),
                element: ".wm_page",
                size: global_setting.PageInfo.pagesize,
                index: global_setting.PageInfo.pageindex,
                sum: global_setting.PageInfo.totalcount,
                pagekey: global_setting.PageInfo.pagekey,
                front: true
            });
        };

        bind();

    };
    var bind = function () {
        var $page = $("#page");
        var _delivery_box = juicer([
            '<div class="delivery_head">',
                '<h3>物流编号</h3>',
                '<a href="#" class="iconfont close">&#xf00b3;</a>',
            '</div>',
            '<div class="delivery_main">',
                '<form action="http://api2.tcsh.me/all_rules">',
                '<ul class="wm_form">',
                    '<li class="form_row">',
                        '<label class="row_key">收货信息：</label>',
                        '<div class="floatleft">',
                            '<p>${receiver} ${mobilephone}</p>',
                            '<p>${address}</p>',
                        '</div>',
                    '</li>',
                    '<li class="form_row">',
                        '<label class="row_key"><b class="form_must">*</b>常用物流公司：</label>',
                        '<select class="form_sel logistics" wmv="sel_empty" wmvmsg="请选择物流公司！">',
                            '<option value="">-请选择-</option>',
                            '{@each common_logistics as item}',
                                '<option value="${item.id}">${item.name}</option>',
                            '{@/each}',
                        '</select>',
                        '<a target="_blank" href="' + domains.sell + '/commonlogistics" style="margin-left:10px;color:#55a2fb;">设置常用物流公司</a>',
                    '</li>',
                    '<li class="form_row">',
                        '<label class="row_key"><b class="form_must">*</b>物流编号：</label>',
                        '<input type="text" class="form_txt express_number" wmv="empty" wmvmsg="无效的物流编号！" />',
                    '</li>',
                '</ul>',
                '<div class="btns">',
                    '<a href="#" class="close">取消</a><input type="submit" class="submit" value="确定">',
                '</div>',
                '</form>',
            '</div>'
        ].join(''))
        $page.on("click", ".delivery", function () {
            var $this = $(this), $tr = $this.closest("tr"), insetbox = $this.data("insetbox");
            if (!insetbox) {
                insetbox = box.invBox({
                    boxCls: "delivery_box",
                    content: _delivery_box.render({
                        common_logistics: global_setting.logistics,
                        receiver: $tr.attr("data_receiver"),
                        mobilephone: $tr.attr("data_mobilephone"),
                        address: $tr.attr("data_address")
                    }),
                    callback: function () {
                        verification.minZIndex = this.wmBox.css("z-index") - 0 + 100;
                        var self = this;
                        this.close = this.hide;
                        this.wmBox.on("click", ".submit", function () {
                            if (verification.verify(self.wmBox)) {
                                $.ajax({
                                    url: domains.sell + "/asyn/present/send.json",
                                    dataType:"json",
                                    data: {
                                        order_id: $tr.attr("data_orderid"),
                                        logistics_id: self.wmBox.find(".logistics").val(),
                                        logistics_name: self.wmBox.find(".logistics option:selected").html(),
                                        express_number: self.wmBox.find(".express_number").val()
                                    },
                                    success: function (data) {
                                        if (data.response) {
                                            window.location.reload();
                                        } else {
                                            alert("服务器繁忙，请稍后再试！");
                                            window.location.reload();
                                        }
                                        
                                    },
                                    error: function () {
                                        alert("服务器繁忙，请稍后再试！");
                                        window.location.reload();
                                    }
                                });
                            }
                            return false;
                        });
                        this.wmBox.on("click", ".close", function () {
                            verification.hideTips(self.wmBox);
                        });
                    }
                });
                $this.data("insetbox", insetbox);
            }
            insetbox.show();
            return false;
        });
    };
    init();
});
