define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        tips = require('wmtips'),
        box = require('wmbox'),
        page = require('wmpage');
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);
    var init = function () {
        var _page = page.Create({
            url: global_setting.PageInfo.url || domains.sell+'/product/list',
            element: ".wm_page",
            index: global_setting.PageInfo.Index,
            sum: global_setting.PageInfo.TotalItems,
            size: global_setting.PageInfo.Size,
            front: true,
            pagekey: global_setting.PageInfo.pageKey,
            param: global_setting.PageInfo.WhereDic,
            across:true
        });
        bind();
    };
    var bind = function () {
        var $page = $("#page"), errorUnShelve, errorShelve;
        $page.find(".ui_show_date").datepicker();
        errorUnShelve = function () {
            var $this = this, errorTips;
            errorTips = $this.data("errorTips");
            if (!errorTips) {
                errorTips = new tips({
                    ele: $this.closest(".btn_list"),
                    con: '<p><i class="wm_ico sigh1" style="margin-right:5px"></i>下架失败！</p><p style="padding-left:18px">@码农赶紧解决！</p>',
                    close: 2000,
                    skin: "red2",
                    direction: 'rt'
                });
                $this.data("errorTips", errorTips);
            }
            errorTips.show();
        };
        errorShelve = function () {
            var $this = this, errorTips;
            errorTips = $this.data("errorTips");
            if (!errorTips) {
                errorTips = new tips({
                    ele: $this.closest(".btn_list"),
                    con: '<p><i class="wm_ico sigh1" style="margin-right:5px"></i>上架失败！</p><p style="padding-left:18px">@码农赶紧解决！</p>',
                    close: 2000,
                    skin: "red2",
                    direction: 'rt'
                });
                $this.data("errorTips", errorTips);
            }
            errorTips.show();
        };
        errorFake = function () {
            var $this = this, errorTips;
            errorTips = $this.data("errorTips");
            if (!errorTips) {
                errorTips = new tips({
                    ele: $this.closest(".btn_list"),
                    con: '<p><i class="wm_ico sigh1" style="margin-right:5px"></i>删除失败！</p><p style="padding-left:18px">@码农赶紧解决！</p>',
                    close: 2000,
                    skin: "red2",
                    direction: 'rt'
                });
                $this.data("errorTips", errorTips);
            }
            errorTips.show();
        };
        errorStopActive = function () {
            var $this = this, errorTips;
            errorTips = $this.data("errorTips");
            if (!errorTips) {
                errorTips = new tips({
                    ele: $this,
                    con: '<p><i class="wm_ico sigh1" style="margin-right:5px"></i>促销取消失败！</p><p style="padding-left:18px">@码农赶紧解决！</p>',
                    close: 2000,
                    skin: "red2",
                    direction: 'rt',
                    offset: {
                        left: 15
                    }
                });
                $this.data("errorTips", errorTips);
            }
            errorTips.show();
        };
        errorDel = function () {
            var $this = this, errorTips;
            errorTips = $this.data("errorTips");
            if (!errorTips) {
                errorTips = new tips({
                    ele: $this,
                    con: '<p><i class="wm_ico sigh1" style="margin-right:5px"></i>删除失败！</p><p style="padding-left:18px">@码农赶紧解决！</p>',
                    close: 2000,
                    skin: "red2",
                    direction: 'rt',
                    offset: {
                        left: 15
                    }
                });
                $this.data("errorTips", errorTips);
            }
            errorTips.show();
        }
        $page.on("click", ".un_shelve", function () {
            var $this = $(this), _id = $this.closest("tr").attr("data_id"), errorTips;
            $.ajax({
                url: domains.api+"/product/unshelve/" + _id,
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    if (data.success) {
                        window.location.reload();
                    } else {
                        errorUnShelve.call($this);
                    }
                },
                error: function () {
                    errorUnShelve.call($this);
                }
            });
            return false;
        });
        $page.on("click", ".shelve", function () {
            var $this = $(this), _id = $this.closest("tr").attr("data_id"), errorTips;
            $.ajax({
                url: domains.api+"/product/shelve/" + _id,
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    if (data.success) {
                        window.location.reload();
                    } else {
                        errorShelve.call($this);
                    }
                },
                error: function () {
                    errorShelve.call($this);
                }
            });
            return false;
        });
        $page.on("click", ".fake", function () {
            var $this = $(this), _id = $this.closest("tr").attr("data_id"), errorTips;
            $.ajax({
                url: domains.api+"/product/fake/" + _id,
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    if (data.success) {
                        window.location.reload();
                    } else {
                        errorFake.call($this);
                    }
                },
                error: function () {
                    errorFake.call($this);
                }
            });
            return false;
        });
        $page.on("click", ".stop_active", function () {
            var $this = $(this), errorTips;
            $.ajax({
                url: domains.api+"/product/stop",
                type: "get",
                dataType: "jsonp",
                data: {
                    id: $this.closest("tr").attr("data_id")
                },
                success: function (data) {
                    if (data.success) {
                        (new tips({
                            ele: $this.closest('.btn_list'),
                            con: '<p><i class="wm_ico hook2" style="margin-right:5px"></i>促销取消成功！</p>',
                            close: 2000,
                            direction: 'rt',
                            offset: {
                                left: 15
                            }
                        })).show();
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    } else {
                        errorStopActive.call($this);
                    }
                },
                error: function () {
                    errorStopActive.call($this);
                }
            });
            return false;
        });
        $page.on("click", ".del_link:not(.del_in)", function () {
            var $this = $(this), _confirmBox = $this.data("confirmBox"), _content;
            if (!_confirmBox) {
                _content = $('<div class="confirm_main"><p class="msg"><i class="wm_ico ask1" style="margin: -5px 10px 0 0;"></i>确定要删除该商品吗？</p><span class="remark">删除后将无法恢复哦~</span></div>');
                _confirmBox = box.alert({
                    content: _content,
                    boxCls: "confirm_box",
                    btns: [
                        {
                            cls: "ui_btn_h37red16",
                            res: "close",
                            text: "确定",
                            callback: function () {
                                $this.empty().append("删除中").addClass("del_in");
                                $.ajax({
                                    url: domains.api+"/product/fake/" + $this.closest("tr").attr("data_id"),
                                    type: "get",
                                    dataType: "jsonp",
                                    success: function (data) {
                                        $this.removeClass("del_in");
                                        if (data.success) {
                                            (new tips({
                                                ele: $this.closest('.btn_list'),
                                                con: '<p><i class="wm_ico hook2" style="margin-right:5px"></i>删除成功！</p>',
                                                close: 2000,
                                                direction: 'rt',
                                                offset: {
                                                    left: 15
                                                }
                                            })).show();
                                            setTimeout(function () {
                                                window.location.reload();
                                            }, 2000);
                                        } else {
                                            errorDel.call($this);
                                        }
                                    },
                                    error: function () {
                                        $this.removeClass("del_in");
                                        errorDel.call($this);
                                    }
                                });
                            }
                        },
                        {
                            cls: "ui_btn_h37gray19",
                            res: "close",
                            text: "取消",
                            callback: function () { }
                        }
                    ],
                    callback: function () {
                        this.close = this.hide;
                    }
                });
                $this.data("confirmBox", _confirmBox);
            }
            _confirmBox.show()
            return false;
        });
        $page.on("click", ".cx_del_link:not(.del_in)", function () {
            var $this = $(this), _confirmBox = $this.data("confirmBox"), _content;
            if (!_confirmBox) {
                _content = $('<div class="confirm_main"><p class="msg"><i class="wm_ico ask1" style="margin: -5px 10px 0 0;"></i>确定要删除该促销吗？</p></div>');
                _confirmBox = box.alert({
                    content: _content,
                    boxCls: "confirm_box",
                    btns: [
                        {
                            cls: "ui_btn_h37red16",
                            res: "close",
                            text: "确定",
                            callback: function () {
                                $this.empty().append("删除中").addClass("del_in");
                                $.ajax({
                                    url: domains.api+"/productsale/fake/" + $this.closest("tr").attr("data_id"),
                                    type: "get",
                                    dataType: "jsonp",
                                    success: function (data) {
                                        $this.removeClass("del_in");
                                        if (data.success) {
                                            (new tips({
                                                ele: $this.closest('.btn_list'),
                                                con: '<p><i class="wm_ico hook2" style="margin-right:5px"></i>删除成功！</p>',
                                                close: 2000,
                                                direction: 'rt',
                                                offset: {
                                                    left: 15
                                                }
                                            })).show();
                                            setTimeout(function () {
                                                window.location.reload();
                                            }, 2000);
                                        } else {
                                            errorDel.call($this);
                                        }
                                    },
                                    error: function () {
                                        $this.removeClass("del_in");
                                        errorDel.call($this);
                                    }
                                });
                            }
                        },
                        {
                            cls: "ui_btn_h37gray19",
                            res: "close",
                            text: "取消",
                            callback: function () { }
                        }
                    ],
                    callback: function () {
                        this.close = this.hide;
                    }
                });
                $this.data("confirmBox", _confirmBox);
            }
            _confirmBox.show()
            return false;
        });
        $page.on("click", ".del_in", function () {
            alert("商品正在删除，请稍等！");
            return false;
        });
    };
    init();
});
