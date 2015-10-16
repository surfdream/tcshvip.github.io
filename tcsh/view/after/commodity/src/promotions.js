define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    //var SpecificationData = {}
    //SpecificationData.relation = [];
    //SpecificationData.relation[0] = { itemList: [{ name: '绿色', key: "用于关联" }, { name: '巧克力色', key: "用于关联" }, { name: '深紫色', key: "用于关联" }], key: "颜色" };
    //SpecificationData.relation[1] = { itemList: [{ name: 'XL', key: "用于关联" }, { name: 'M', key: "用于关联" }], key: "尺码1" };
    //SpecificationData.relation[2] = { itemList: [{ name: '2XL', key: "用于关联" }, { name: '2M', key: "用于关联" }], key: "尺码2" };
    //SpecificationData.dataList = {};
    //SpecificationData.dataList["[data_颜色='巧克力色'][data_尺码1='M'][data_尺码2='2M']"] = { price: "1000", amount: "1000" };
    //SpecificationData.dataList["[data_颜色='巧克力色'][data_尺码1='M'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='巧克力色'][data_尺码1='XL'][data_尺码2='2M']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='巧克力色'][data_尺码1='XL'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='深紫色'][data_尺码1='M'][data_尺码2='2M']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='深紫色'][data_尺码1='M'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='深紫色'][data_尺码1='XL'][data_尺码2='2M']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='深紫色'][data_尺码1='XL'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='绿色'][data_尺码1='M'][data_尺码2='2M']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='绿色'][data_尺码1='M'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='绿色'][data_尺码1='XL'][data_尺码2='2M']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.dataList["[data_颜色='绿色'][data_尺码1='XL'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    var SpecificationData;
    var $ = require("jquery"),
      juicer = require("juicer"),
      verification = require('wmverification'),//验证模块
      tips = require('wmtips'),//泡泡
      initSpecificationMain = require('initSpecificationMain');
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);
    var $page = $("#page");
    var init = function () {
        var _relation;
        SpecificationData = global_setting.SpecificationData;
        for (var i in SpecificationData.dataList) {
            SpecificationData.dataList[i].quantity = SpecificationData.dataList[i].amount
        }
        verification.addRule([
            {
                key: "limit_date", fun: function () {
                    return !!($(".limit_date").val() && $(".scene").val() - 0);
                }
            },
            {
                key: "personPrice", fun: function () {
                    var _arr = [];
                    $(".person_price").each(function () {
                        var $this = $(this);
                        var _person = $this.find(".person").val(),
                            _price = $this.find(".price").val();
                        if (/^[0-9]*[1-9][0-9]*$/.test(_person) && /^[0-9]*([1-9]*\.)?\d+$/.test(_price)) {
                            _arr.push({
                                person: $this.find(".person").val(),
                                price: $this.find(".price").val()
                            });
                        } else {
                            return false;
                        }
                    });
                    return !!_arr.length;
                }
            }
        ]);
        bind();
        _relation = SpecificationData.relation;
        $page.find(".tab_item").each(function () {
            var $this = $(this);
            (function ($this, money_row, thead, tbody) {
                var _arr = [];
                var _setData;
                for (var i in _relation) {
                    _setData = {};
                    _setData.name = _relation[i].key;
                    _arr.push(_setData);
                }
                _arr.push({
                    name: money_row,
                    sign: "*"
                });
                _arr.push({
                    name: "数量",
                    sign: "*"
                }); _arr.push({
                    name: "批量操作"
                });
                //这里因为是每个tab页同时生成，使用setTimeout减少压力
                setTimeout(function () {
                    initSpecificationMain.initSpecificationMainThead({
                        setData: _arr,
                        thead: thead
                    });
                    initSpecificationMain.initSpecificationMain({
                        setData: SpecificationData,
                        tbody: tbody,
                        callback: function () {
                            $this.data("priceList", this.find(".price"));
                            //价格列是否能够修改看具体需求通过页面配置
                            if (!this.closest(".tab_item").attr("priceedit")) {
                                this.find(".price").attr("disabled", "disabled");
                            }
                            this.find("tr").each(function () {
                                var $this = $(this);
                                $this.find("td:last").remove();
                                $this.find(".quantity").attr("max_quantity", $this.find(".quantity").val());
                            });
                            this.closest("table").find("thead th:last").remove();
                        }
                    });
                }, 1);
            })($this, $this.attr("data_table_money_row"), $this.find(".specification_main thead"), $this.find(".specification_main tbody"));
        });
        verification.init();
    };
    var bind = function () {
        var $promotions_tab = $page.find(".promotions_tab");
        var _d = new Date(), s = "";
        $page.on("click.tab", ".tab_key", function () {
            var $this = $(this);
            verification.hideTips();
            $(".wm_tips").css("display", "none");
            $promotions_tab.find(".ui_btn").attr("class", "tab_key");
            $this.attr("class", "tab_key ui_btn ui_btn_h36white3");
            $this.closest(".promotions_con").attr("class", "promotions_con " + $this.attr("data_key"));
            $page.find(".tab_item:visible").find(".err").each(function () {
                $(this).data("quantityErrMsg").show();
            });
            return false;
        });
        $page.on('change.relevancePrice', '.relevance_price', function () {
            var $this = $(this); $tab = $this.closest(".tab_item");
            if ($this.val() - 0 >= 0) {
                $tab.data("priceList").val($this.val() || 0);
            }
        });
        s += _d.getFullYear() + "-";
        s += (_d.getMonth() + 1) + "-";
        s += _d.getDate();
        $page.find(".limit_date").datepicker({
            minDate: new Date(),
            maxDate: new Date(new Date(s).getTime() + 86400000 * 7),
            onClose: function (data, e) { if (!(/\d{4}-\d{2}-\d{2}/.test(data))) { e.input.val(''); } }
        });
        $page.on("focus", ".quantity", function () {
            var $this = $(this), msg = $this.data("msg"), quantityErrMsg = $this.data("quantityErrMsg");
            if (!msg) {
                msg = new tips({
                    ele: $this,
                    con: '<p>商品数量不能超过上架时填写的库存！<br>该规格的库存为：' + $this.attr("max_quantity") + ' 件</p>',
                    close: 2000,
                    direction: 'rt',
                    offset: {
                        left: 12
                    }
                });
                $this.data("msg", msg);
            }
            quantityErrMsg && quantityErrMsg.hide();
            msg.show();
            //msg.$tipsBox.addClass("red2");
        });
        $page.on("blur", ".quantity", function () {
            var $this = $(this), quantityErrMsg = $this.data("quantityErrMsg"), _v = $this.val() - 0, msg;
            if (_v > $this.attr("max_quantity")) {
                $this.addClass("err");
                msg = $this.data("msg");
                if (!quantityErrMsg) {
                    quantityErrMsg = new tips({
                        ele: $this,
                        skin: "red2",
                        con: '<p>商品数量不能超过上架时填写的库存！<br>该规格的库存为：' + $this.attr("max_quantity") + ' 件</p>',
                        direction: 'rt',
                        offset: {
                            left: 12
                        }
                    });
                    $this.data("quantityErrMsg", quantityErrMsg);
                }
                msg && msg.hide();
                quantityErrMsg.show();

            }
            else {
                quantityErrMsg && quantityErrMsg.hide();
                $this.removeClass("err");
            }

        });
        $page.on("click", ":submit", function () {
            var $this = $(this).closest(".wm_form"), initTableData, initPostData, postData = {};
            if (verification.verify($this) && !$this.find(".err").length) {
                initTableData = function (i, arr, selctStr) {
                    var _arr = arr, _data, _selctStr, _key, _v;
                    for (var j in SpecificationData.relation[i].itemList) {
                        _data = {};
                        _selctStr = "";
                        _selctStr = (selctStr || "");
                        _key = SpecificationData.relation[i].key;
                        _v = SpecificationData.relation[i].itemList[j].name;
                        _selctStr += '[data_' + _key + '="' + _v + '"]';
                        _data["kv"] = {};
                        _data["kv"][_key] = _v;
                        _data["kv"]["id"] = SpecificationData.relation[i].itemList[j].id;
                        _data["itemList"] = [];

                        if (i === SpecificationData.relation.length - 1) {
                            _data["itemList"] = [
                               {
                                   "kv": {
                                       price: $page.find(".tab_item:visible " + _selctStr).find(".price").val(),
                                       amount: $page.find(".tab_item:visible " + _selctStr).find(".quantity").val()
                                   },
                                   "itemList": []
                               }
                            ]
                        } else {
                            initTableData(i + 1, _data["itemList"], _selctStr);
                        }
                        _arr.push(_data);
                    }
                };
                initPostData = function () {
                    var $visibleTab = $page.find(".tab_item:visible");
                    var _arr;
                    switch ($visibleTab.attr("data_value")) {
                        case "1":
                            var limit_date_s = $visibleTab.find(".limit_date_s").val(),
                                limit_date_e = $visibleTab.find(".limit_date_e").val();
                            var sDate = new Date(limit_date_s).getTime(),
                                eDate = new Date(limit_date_e).getTime();
                            if (Math.min(sDate, eDate) !== sDate) {
                                limit_date_s = $visibleTab.find(".limit_date_e").val();
                                limit_date_e = $visibleTab.find(".limit_date_s").val();
                            }
                            return {
                                sale_time_s: limit_date_s,
                                sale_time_e: limit_date_e,
                                times: $visibleTab.find(".scene").val(),
                                limit_price: $visibleTab.find(".relevance_price").val()
                            }
                        case "2":
                            _arr = [];
                            $visibleTab.find(".person_price").each(function () {
                                var $this = $(this),_person=$this.find(".person").val(),_price=$this.find(".price").val();
                                if (_person && _price) {
                                    _arr.push({
                                        person: $this.find(".person").val(),
                                        price: $this.find(".price").val()
                                    });
                                }
                            });
                            return {
                                start_price: $visibleTab.find(".relevance_price").val(),
                                person_price: _arr
                            }
                        case "3":
                            return {
                                rate: $visibleTab.find(".rate").val(),
                                rate_type: $visibleTab.find(".rate_type").val()
                            }
                        case "6":
                            return {
                                coin: $visibleTab.find(".relevance_price").val()
                            }
                    }

                };
                postData.sale_norm = [];
                initTableData(0, postData.sale_norm);
                postData.sale_norm = JSON.stringify(postData.sale_norm);
                postData.sale_type = $page.find(".tab_item:visible").attr("data_value");
                postData.sale_msg = JSON.stringify(initPostData());
                postData.product_id = global_setting.pdt_id;
                postData.merchant_id = global_setting.mer_id;
                $.ajax({
                    url: domains.item+'/api/productsale/add',
                    type: 'post',
                    dataType: 'json',
                    data: postData,
                    success: function (data) {
                        if (data.success) {
                            window.location.href = domains.sell+'/product/list';
                        } else {
                            alert('服务器忙，请稍后再试！');
                        }
                    },
                    error: function () {
                        alert('服务器忙，请稍后再试！');
                    }
                });
            } else {
                $this.find(".err:eq(0)").focus();
            }
            return false;
        });
    };
    init();
});
