define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');

    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        juicer = require('http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js'),
        tips = require('http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js'),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js');
    require("../css/style.css#");
    require("http://s.tcsh.me/tcsh/view/ago/public/css/schedule.css#");

    //评价分数（展示数据和后端数据转化）
    var _setSchedule = function (_w, callback) {
        var callbackData = {};
        if (_w <= 8) {
            _w = 8;
            callbackData.msg = "（0.5 分）";
            callbackData.index = 1;
        }
        else if (_w <= 21) {
            _w = 21;
            callbackData.msg = "（1.0分）";
            callbackData.index = 2;
        }
        else if (_w <= 29) {
            _w = 29
            callbackData.msg = "（1.5分）";
            callbackData.index = 3;
        }
        else if (_w <= 42) {
            _w = 42
            callbackData.msg = "（2.0分）";
            callbackData.index = 4;
        }
        else if (_w <= 51) {
            _w = 51;
            callbackData.msg = "（2.5分）";
            callbackData.index = 5;
        }
        else if (_w <= 62) {
            _w = 62
            callbackData.msg = "（3.0分）";
            callbackData.index = 6;
        }
        else if (_w <= 72) {
            _w = 72
            callbackData.msg = "（3.5分）";
            callbackData.index = 7;
        }
        else if (_w <= 80) {
            _w = 80
            callbackData.msg = "（4.0分）";
            callbackData.index = 8;
        }
        else if (_w <= 94) {
            _w = 94
            callbackData.msg = "（4.5分）";
            callbackData.index = 9;
        } else {
            _w = 100
            callbackData.msg = "（5.0分）";
            callbackData.index = 10;
        }
        callbackData.w = _w;
        callback.call(callbackData);
    };
    var show = function (op) {
        var _evaluate_box_html = juicer($("#comment_model").html()).render({
            EvaluateKeyValue: global_setting.EvaluateKeyValue,
            orderid: op.orderid,
            productid: op.productid,
            itemid: op.itemid
        });
        var isAjax = false || op.isAjax;
        return box.alert({
            boxCls: "evaluate_box",
            titleText: "商品评价",
            content: _evaluate_box_html,
            btns: [
                { cls: "ui_btn_h46red8 save_comment", res: "close", text: "确定" },
                { cls: "alink", res: "close", text: "取消" }
            ],
            callback: function () {
                var self = this;
                var $page = this.wmBox;
                /*评论打分效果*/
                $page.on("mousemove", ".inset_comment .schedule", function (e) {
                    var $this = $(this), offset = $this.offset(), _thisW = $this.outerWidth(), $quality_remark = $this.closest("li").find(".quality_remark");
                    var _w = parseInt((e.pageX - offset.left) / _thisW * 100);
                    _setSchedule(_w, function () {
                        $this.find("em").css("width", this.w + "%");
                        $quality_remark.empty().append(this.msg);
                        $this.closest(".evaluate_item").attr("post_score", this.index);
                    });
                });
                $page.on("click", ".inset_comment .schedule", function (e) {
                    var $this = $(this), $length = $this.find("em");
                    $this.data("length", $length.css("width"));
                    $this.data("number", $this.closest("li").find(".quality_remark").html());
                    $this.data("post_score", $this.closest(".evaluate_item").attr("post_score") - 0);
                    $this.addClass("notmousemove");
                });
                $page.on("mouseout", ".inset_comment .schedule", function (e) {
                    var $this = $(this), $quality_remark = $this.closest("li").find(".quality_remark");
                    $this.find("em").css("width", $this.data("length") || "0px");
                    $quality_remark.empty().append($this.data("number") || "（0分）");
                });
                $page.on("click", ".close_comment", function () {
                    $(this).closest(".inset_comment").slideUp(300, function () {
                        $(this).remove();
                    });
                    return false;
                });
                $page.find(".save_comment").on("click", function () {
                    var $this = $(this), errTips, $form, _postkey, _postData;
                    var _v = $.trim($page.find("textarea").val());
                    $(".evaluate_item").each(function () {
                        var $this = $(this), _value = $this.find(".schedule").data("post_score");
                        $this.find(":hidden").val(_value || 1);
                    });
                    if (!_v) {
                        errTips = $page.data("errTips");
                        if (!errTips) {
                            errTips = new tips({
                                ele: $this,
                                con: "亲，您还没填评语哦~",
                                skin: "red2",
                                direction: "tc",
                                minIndex: $page.css("z-index") - 0 + 1,
                                close: 3000,
                                offset: { top: -10 }
                            });
                            $page.data("errTips", errTips);
                        }
                        errTips.setCon("亲，您还没填评语哦~");
                        errTips.show();
                        $page.find("textarea").val('').focus();
                        return false;
                    }
                    if (_v.length > 300) {
                        errTips = $page.data("errTips");
                        if (!errTips) {
                            errTips = new tips({
                                ele: $this,
                                con: "感谢您的评价，但请不要“贪杯”~（字数不能大于300）",
                                skin: "red2",
                                direction: "tc",
                                minIndex: $page.css("z-index") - 0 + 1,
                                close: 3000,
                                offset: { top: -10 }
                            });
                            $page.data("errTips", errTips);
                        }
                        errTips.setCon("感谢您的评价，但请不要“贪杯”~（字数不能大于300）");
                        errTips.show();
                        return false;
                    }
                    if (isAjax) {
                        $form = $page.find("form");
                        _postkey = $form.attr("data_postkey").split(',');
                        _postData = {};
                        for (var i in _postkey) {
                            _postData[_postkey[i]] = $form.find("[name='" + _postkey[i] + "']").val();
                        }
                        for (i in global_setting.EvaluateKeyValue) {
                            _postData[global_setting.EvaluateKeyValue[i].key] = $form.find("[name='" + global_setting.EvaluateKeyValue[i].key + "']").val();
                        }
                        _postData.content = encodeURIComponent(_v);
                        _postData.ajax = true;
                        $.ajax({
                            url: $form.attr("action"),
                            type: "post",
                            data: _postData,
                            dataType: "json",
                            success: function (data) {
                                typeof op.ajaxSuccess === "function" && op.ajaxSuccess.call(self, data);
                            },
                            error: function () {
                                typeof op.ajaxError === "function" && op.ajaxError.call(self);
                            }
                        })

                    } else {
                        $page.find("form").submit();
                    }
                    return false;
                });
                $page.find(".close:not(.save_comment)").on("click", function () {
                    $page.data("errTips") && $page.data("errTips").close();
                });
                /******************************************************/
            }
        });
    };
    exports.show = function (op) {
        return show(op);
    };
    exports.setSchedule = _setSchedule;

});
