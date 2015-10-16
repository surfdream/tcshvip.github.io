define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        tips = require("wmtips"),
        showartwork = require('wmshowartwork'),
        box = require("wmbox");
    var init = function () {
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $window = $(window),
        _windowW = $window.width(),
        _windowH = $window.height();
        $page.on("click", ".refund", function () {
            var $this = $(this), _key = $this.closest(".refund_data").attr("orderid");
            var errorTips;
            $.ajax({
                url: domains.sell+"/order/JudgeRejection/pass",
                type: "get",
                data: {
                    orderid: _key
                },
                dataType: "json",
                success: function () {
                    window.opener._reload();
                    window.close();
                    //window.location.href = domains.sell+'/order/list';
                },
                error: function () {
                    errorTips = $this.data("errorTips");
                    if (!errorTips) {
                        errorTips = new tips({
                            ele: $this,
                            con: '<p>服务器繁忙，请稍候再试！<br>@码农，赶紧解决问题！</p>',
                            close: 2000,
                            direction: 'tc',
                            offset: {
                                top: -5
                            }
                        });
                        $this.data("errorTips", errorTips);
                    }
                    errorTips.show();
                }
            });
            return false;
        });
        $page.on("click", ".not_refund", function () {
            var $this = $(this);
            box.invBox({
                boxCls: "refuse_reason_box",
                content: [
                    '<div class="refuse_reason">',
                        '<h3>请说明原因：</h3>',
                        '<textarea class="reason"></textarea>',
                        '<div class="btns">',
                            '<a href="#" class="ui_btn ui_btn_h27gray8 confirm_not_refund"><span class="ui_btn_txt">确定</span></a>',
                            '<a href="#" class="ui_btn ui_btn_h27gray8 close"><span class="ui_btn_txt">取消</span></a>',
                        '</div>',
                    '</div>'
                ].join(''),
                callback: function () {
                    var self = this;
                    this.wmBox.on("click", ".confirm_not_refund", function () {
                        var _key = $this.closest(".refund_data").attr("orderid"), _v = $.trim(self.wmBox.find(".reason").val());
                        if (_v.length >= 100) {
                            alert("字数过长！");
                            return false;
                        }
                        var errorTips;
                        $.ajax({
                            url: domains.sell+"/order/JudgeRejection/fail",
                            type: "post",
                            data: {
                                orderid: _key,
                                reason: encodeURIComponent(self.wmBox.find(".reason").val())
                            },
                            dataType: "json",
                            success: function () {
                                window.opener._reload();
                                window.close();
                            },
                            error: function () {
                                errorTips = $this.data("errorTips");
                                if (!errorTips) {
                                    errorTips = new tips({
                                        ele: $this.closest('.btn_list'),
                                        con: '<p>服务器繁忙，请稍候再试！<br>@码农，赶紧解决问题！</p>',
                                        close: 2000,
                                        direction: 'rt',
                                        offset: {
                                            left: 15
                                        }
                                    });
                                    $this.data("errorTips", errorTips);
                                }
                                errorTips.show();
                            }
                        });
                        return false;
                    });
                }
            });
            return false;
        });
        $page.on("click", ".show_artwork", function () {
            var $this = $(this), _showartwork;
            _showartwork = $this.data("showartwork");
            if (!_showartwork) {
                _showartwork = showartwork.create($this.find("img").attr("src"));
                $this.data("showartwork", _showartwork);
            }
            _showartwork.show();
            return false;

        });
    };
    init();
});
