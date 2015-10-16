define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');

    //SpecificationData = {}
    //SpecificationData.relation = [];
    ////SpecificationData.relation[1] = { itemList: [{ name: '绿色', src: 'http://img02.taobaocdn.com/bao/uploaded/i2/762878195/T2EWvCXXJbXXXXXXXX_!!762878195.jpg_30x30.jpg' }, { name: '巧克力色', src: 'http://img02.taobaocdn.com/bao/uploaded/i2/762878195/T2EWvCXXJbXXXXXXXX_!!762878195.jpg_30x30.jpg' }, { name: '深紫色', src: '' }], key: "颜色" };
    ////SpecificationData.relation[2] = { itemList: [{ name: 'XL' }, { name: 'M' }], key: "尺码1" };
    ////SpecificationData.relation[3] = { itemList: [{ name: '2XL' }, { name: '2M' }], key: "尺码2" };
    //SpecificationData.dataList = {};
    ////SpecificationData.dataList["[data_颜色='巧克力色'][data_尺码1='M'][data_尺码2='2M']"] = { price: "1", quantity: "1" };
    ////SpecificationData.dataList["[data_颜色='巧克力色'][data_尺码1='M'][data_尺码2='2XL']"] = { price: "2", quantity: "1" };
    ////SpecificationData.dataList["[data_颜色='巧克力色'][data_尺码1='XL'][data_尺码2='2M']"] = { price: "3", quantity: "1" };
    ////SpecificationData.dataList["[data_颜色='巧克力色'][data_尺码1='XL'][data_尺码2='2XL']"] = { price: "4", quantity: "10" };
    ////SpecificationData.dataList["[data_颜色='深紫色'][data_尺码1='M'][data_尺码2='2M']"] = { price: "5", quantity: "1000" };
    ////SpecificationData.dataList["[data_颜色='深紫色'][data_尺码1='M'][data_尺码2='2XL']"] = { price: "6", quantity: "1" };
    ////SpecificationData.dataList["[data_颜色='深紫色'][data_尺码1='XL'][data_尺码2='2M']"] = { price: "7", quantity: "10" };
    ////SpecificationData.dataList["[data_颜色='深紫色'][data_尺码1='XL'][data_尺码2='2XL']"] = { price: "8", quantity: "0" };
    ////SpecificationData.dataList["[data_颜色='绿色'][data_尺码1='M'][data_尺码2='2M']"] = { price: "9", quantity: "1000" };
    ////SpecificationData.dataList["[data_颜色='绿色'][data_尺码1='M'][data_尺码2='2XL']"] = { price: "10", quantity: "0" };
    ////SpecificationData.dataList["[data_颜色='绿色'][data_尺码1='XL'][data_尺码2='2M']"] = { price: "100", quantity: "0" };
    ////SpecificationData.dataList["[data_颜色='绿色'][data_尺码1='XL'][data_尺码2='2XL']"] = { price: "1000", quantity: "1000" };
    //SpecificationData.compareList = [];
    ////SpecificationData.compareList[0] = { name: '天 猫 价', val: '1555', url: 'http://www.tmall.com' }
    ////SpecificationData.compareList[1] = { name: '淘 宝 价', val: '1555', url: 'http://www.taobao.com' }
    ////SpecificationData.compareList[2] = { name: '京 东 价', val: '1555', url: 'http://www.jd.com' }
    var SpecificationData;
    var $ = require('jquery'),
        juicer = require('juicer'),
        box = require('wmbox'),
        verification = require('wmverification'),
        tips = require('wmtips'),
        sharebox = require('sharebox'),
        move = require('wmmove'),
        page = require('wmpage'),
        lib = require('lib'),
        showartwork = require('wmshowartwork'),
        evaluate = require('wmevaluate'),
        loginBox = require('loginBox'),
        lazyload = require('wmlazyload'),
        qq_server = require("qq_server"),
        areaData = require('areaData'),
		collect = require('collect')
    ;
    var maxMoney,
        minMoney,
        quantityCon = 0,
        role = lib.getRole(),//角色，1 = 买家，2 = 卖家，3 = 买家+卖家(测试用，正常数据不会有)，4 = 管理员， 8 = 运营
        _Eq0Src;

    var _evaluateItem = juicer([
        '{@each list as item}',
        '<li class="comment_item">',
            '<div class="item_data comment_msg">',
                '<p>${item.Content}</p>',
                '<span class="comment_msg_date">${item.CreateTime}</span>',
            '</div>',
            '<div class="item_data commodity_data">',
                '<ul>',
                '{@each item.ProductModel as _attrlist}',
                    '<li><label>${_attrlist.name}：</label>${_attrlist.valuetxt}</li>',
                '{@/each}',
                '</ul>',
            '</div>',
            '<div class="item_data user_data">',
                '<span class="user_name">${item.NickName}</span>',
                '<span class="user_ico">',
                   '<img title="VIP${item.Level}" src="http://s.tcsh.me/tcsh/view/public/img/LVIMGV1/vip${item.Level}.png">',
                '</span>',
            '</div>',
        '</li>',
        '{@/each}'
    ].join(''));
    var _singleItem = juicer([
        '{@each List as item}',
        '<ul class="single_sun_itme" sun_id="${item.SunId}">',
            '<li class="tab_single_sun_userdata">',
                '<span class="user_img"><img src="${item.UserPic}" title="${item.NickName}" /></span>',
                '<span class="user_name">${item.NickName}</span>',
            '</li>',
            '<li class="form_row">',
                '<a href="' + domains.item + '/productsun/index/${item.SunId}" class="show_single_sun" target="_blank">查看晒单</a>',
                '<h3>${item.SunTitle}</h3>',
            '</li>',
            '{@each item.SunTag as SunTag}',
            '<li class="form_row">',
                '<label class="row_key">${SunTag.k}：</label>',
                '<span>${SunTag.v}</span>',
            '</li>',
            '{@/each}',
            '<li class="form_row">',
                '<label class="row_key">晒单帅照</label>',
                '<ul class="floatleft single_sun_img_list">',
                '{@each item.SunPic as imgs}',
                    '<li><a href="#" class="show_artwork"><img src="${imgs}" title="晒单帅照"></a></li>',
                '{@/each}',
                '</ul>',
            '</li>',
            '<li class="form_row btns">',
                '<a href="#" class="ui_btn ui_btn_h21gray9 praise"><span class="ui_btn_txt">有用(${item.SunUse})</span></a>',
                '<a href="#" class="ui_btn ui_btn_h21gray9 add_call_btn"><span class="ui_btn_txt">回复</span></a>',
                '<div class="add_call_msg clearfix">',
                    '<div class="arrow ">',
                        '<em>◆</em>',
                        '<span>◆</span>',
                    '</div>',
                    '<p class="call_user">回复：${item.SunTitle}</p>',
                    '<textarea class="form_textarea add_call_msg_txt"></textarea>',
                    '<a href="#" class="ui_btn ui_btn_h27gray8 submit"><span class="ui_btn_txt">提交</span></a>',
                '</div>',
            '</li>',
        '</ul>',
        '{@/each}'
    ].join(''));
    //计算价格范围
    var _defineRange = function (data) {
        maxMoney = -1, minMoney = Number.MAX_VALUE
        var _data = data || SpecificationData.dataList;
        for (var i in _data) {
            maxMoney = Math.max(maxMoney, _data[i].price - 0);
            minMoney = Math.min(minMoney, _data[i].price - 0);
        }
    };
    //计算货存
    var _quantitySum = function (data) {
        quantityCon = 0;
        var _data = data || SpecificationData.dataList;
        for (var i in _data) {
            quantityCon += (data[i].amount - 0) || 0;
        }
    };
    //禁用属性
    var _disabledAttr = function () {
        if (global_setting.SpecificationData.relation.length > 1) {
            var $curr = $(".buy_attr.curr");
            var _data = SpecificationData.dataList;
            $(".options_list .disabled").removeClass('disabled');
            $curr.each(function () {
                var $this = $(this);
                var thiskey = $this.attr("data_key"), thisvalue = $this.attr("data_value")
                var currKeys = "[data_" + thiskey + "='" + thisvalue + "']", _disableds = [], _length;
                for (var i in _data) {
                    if (i.indexOf(currKeys) >= 0 && _data[i].amount - 0 <= 0) {
                        _disableds.push((i.replace(currKeys, "")).split(']['));
                    }
                }
                for (i in _disableds) {
                    for (var k in _disableds[i]) {
                        _disableds[i][k] = _disableds[i][k].replace(/\[|\]/g, "");
                        var x = true;
                        for (var j in _data) {
                            if (j.indexOf(currKeys) >= 0 && j.indexOf(_disableds[i][k]) >= 0 && _data[j].amount - 0 > 0) {
                                x = false;
                            }
                        }
                        if (x) {
                            _disableds[i][k] = _disableds[i][k].replace(/data_|\'/g, "");
                            var keyArr = _disableds[i][k].split('=');
                            $(".buy_attr" + '[data_key="' + keyArr[0] + '"][data_value="' + keyArr[1] + '"]').addClass("disabled");
                        }
                    }
                }
            });
        }

    };
    //初始化商品详细
    var _initDetailed = function () {
        var $this = this;
        $this.empty().append($.trim($("#product_info").html()));
    };
    var init = function () {
        var $body = $("body"), $page = $('#page'), $options_box, $introduction_detailed = $body.find(".introduction_detailed"), _dataList;
        SpecificationData = global_setting.SpecificationData;
        var _initBuyAttr = function () {
            $options_box = $page.find(".options_box");
            var _buyAttr = juicer([
                  '{@each relation as item}',
                  '<li class="" >',
                      '<label>${item.key}：</label>',
                      '<ul class="options_list">',
                          '{@each item.itemList as list}',
                          '<li>',
                              '<a href="#" hidefocus="true" style="{@if list.src}padding:0;{@/if}" title="${list.name}" data_key="${item.key}" data_value="${list.name}" data_id="${list.id}" class="buy_attr">{@if list.src}<img src="${list.src}" class="showbigimg" /><i class="disabled_mask wm_ico mask1"></i>{@else}${list.name}{@/if}<i class="wm_ico hook3"></i></a>',
                          '</li>',
                          '{@/each}',
                      '</ul>',
                  '</li>',
                  '{@/each}'
            ].join(''));
            $options_box.prepend(_buyAttr.render(SpecificationData));
            if (global_setting.SpecificationData.relation.length === 1) {
                _dataList = global_setting.SpecificationData.dataList;
                for (var i in _dataList) {
                    if (!(_dataList[i].amount - 0)) {
                        var x = i.replace(/data_|\[|\]|\'/g, "").split('=');
                        $(".buy_attr" + '[data_key="' + x[0] + '"][data_value="' + x[1] + '"]').addClass("disabled");
                    }
                }
            }
        };
        var _initCompare = function () {
            var _compare = juicer([
            '{@each compareList as item}',
            '<li>',
                '<label>${item.name}：</label><a href="${item.url}">￥${item.val}</a>',
                //'<a href="${item.url}" class="ui_btn ui_btn_h21gray9"><span class="ui_btn_txt">Go</span></a>',
                '<span class="pl10">(此处为网站对比价)</span>',
            '</li>',
            '{@/each}'
            ].join(''));
            $(".compare_box").append(_compare.render(SpecificationData));
        };
        var pdt_ids, i, cookieMax = 8, cooids = [];
        pdt_ids = lib.cookie("pdt_ids");
        pdt_ids = pdt_ids ? pdt_ids.split("|") : [];
        //i = pdt_ids.length;
        cooids.push(global_setting.pdt_id);
        for (i = 0; i <= pdt_ids.length && cookieMax; i++) {
            if (pdt_ids[i] && pdt_ids[i] != global_setting.pdt_id) {
                cooids.push(pdt_ids[i]);
                cookieMax--;
            }
        }
        lib.cookie("pdt_ids", cooids.join('|'));
        _quantitySum(SpecificationData.dataList);
        $(".quantity").html("（库存" + quantityCon + "件）");
        $(".txt_quantity").data("maxQuantity", quantityCon);
        _initBuyAttr();
        _defineRange();
        if (minMoney != maxMoney) {
            //恶心的处理掉这个BUG
            minMoney >= 0 && maxMoney >= 0 && (minMoney + "").length < 10 && (maxMoney + "").length <= 10 && $(".wm_price").empty().append('￥' + minMoney + "-￥" + maxMoney);
        } else {
            $(".wm_price").empty().append('￥' + minMoney);
        }
        verification.addRule([
            {
                key: 'buy', fun: function () {
                    var isT = true;
                    this.find(".options_list").each(function () {
                        isT = isT && $(this).find(".curr").length === 1
                    });
                    return isT;
                }
            }
        ]);
        verification.strikingSuccess = false;
        verification.strikingError = false;
        $body.append('<div id="big_move" style="display: none;width: 200px;height: 200px;position: absolute;top:0;left:0;cursor: move;background: url(http://s.tcsh.me/tcsh/view/public/img/mask1.png) 0 0 repeat;"></div>');
        $page.find(".buy_con .commodity_data").append('<div id="maxbig_img" style="position: absolute;top:0;left:20px;width:415px;height:415px;background: #fff;visibility:hidden;overflow:hidden"><img /></div>');
        //商家快捷操作
        if (global_setting.mer_id == lib.cookie("wm.user.id")) {
            $page.find(".content_main").append('<ul class="bus_shortcuts"><li><a href="' + domains.item + '/product?id=' + global_setting.pdt_id + '" target="_blank">编辑</a></li></ul>')
        }
        bind();
        $(".comment_list").empty();
        var $quality_box = $(".quality_box").empty();
        for (var i in global_setting.EvaluateKeyValue) {
            $quality_box.append('<li data_key="' + global_setting.EvaluateKeyValue[i].key + '"><label>' + global_setting.EvaluateKeyValue[i].value + '：</label><span class="schedule quality_bg"><em></em></span><span class="quality_remark"></span></li>');
        }
        $options_box.find(".options_list").each(function () {
            var $this = $(this), $buy_attr = $this.find(".buy_attr");
            if ($buy_attr.length === 1) {
                $buy_attr.click();
            }
        });
        //_initDetailed.call($introduction_detailed);
        //ie下面img元素src为空的时候，隐藏img元素
        $page.find(".tab_commodity_img img[src='']:not(.big_img)").css({ visibility: 'hidden' });
        lazyload.init();
        $(".showbigimg").each(function () {
            var $this = $(this);
            if ($this.attr("src")) {
                _Eq0Src = $this.attr("src");
                $this.click();
                return false;
            }
        });
        //$(".big_img").attr("src", _Eq0Src);
        if (lib.queryString("to_Tab_comment")) {
            $page.find(".tab_box .comment a").click();
            $("body,html").animate({ scrollTop: 500 });
        }
        qq_server.Create();
    };
    var bind = function () {
        var $page = $('#page'), $body = $("body");
        var areaTips;
        var $quantity = $page.find(".txt_quantity"),
            $arrowdown = $page.find(".arrowdown"),
            $big_link = $page.find(".big_link"),
            $bigimg = $big_link.find("img"),
            $maxbig_img = $("#maxbig_img"),

            $big_move = $("#big_move"),
            $bus_shortcuts = $page.find(".bus_shortcuts"),
            $buy_attr_box = $page.find(".buy_attr_box");

        var logisticsKV = {
            "mail": "平邮",
            "express": "快递",
            "ems": "EMS"
        };
        var _sharebox, _img;
        var _initArea = function () {
            var $this = $(this);
            var areaHtml = [];
            areaHtml.push('<ul class="province_list">');
            for (var i in areaData.data_province) {
                areaHtml.push('<li><a href="#" class="province_item" value="' + i + '">' + areaData.data_province[i] + '</a></li>');
            }
            areaHtml.push('</ul>');
            areaHtml.push('<ul class="city_list">');
            areaHtml.push('</ul>');
            areaTips = box.relyBox({
                rely: $this,
                boxCls: 'change_city_box',
                content: areaHtml.join(''),
                btns: [],
                callback: function () {
                    var _this = this;
                    this.wmBox.on("click", ".province_item", function () {
                        var $this = $(this);
                        _this.wmBox.find(".province_list .curr").removeClass('curr');
                        $this.addClass("curr");
                        var areaHtml = [], _data = areaData.data_city[$this.attr("value")];
                        for (var i in _data) {
                            areaHtml.push('<li><a href="#" class="city_item" value="' + _data[i].value + '">' + _data[i].name + '</a></li>');
                        }
                        _this.wmBox.find(".city_list").empty().append(areaHtml.join(''));
                        return false
                    });
                    this.wmBox.on("click", ".city_item", function () {
                        var $this = $(this);
                        var $change_city = $(".change_city"),
                            //心情不好的时候加的class，哪天心情好了 改掉
                            $wocao = $(".wocao");
                        var _v = $this.attr("value");
                        _this.wmBox.find(".city_list .curr").removeClass('curr');
                        $this.addClass("curr");
                        $change_city.empty().append($this.html() + '<i class="wm_ico arrow4down"></i>').attr("value", _v);
                        if (global_setting.freight.type == "1") {
                            $.ajax({
                                url: domains.api+'/product/getfreight',
                                type: "get",
                                dataType: "jsonp",
                                data: {
                                    productid: global_setting.pdt_id,
                                    areacode: _v
                                },
                                success: function (data) {
                                    if (data.success) {
                                        $change_city.nextAll().remove();
                                        for (var i in data.success) {
                                            $wocao.append('<span class="c5f">' + logisticsKV[i] + '：' + (data.success[i] - 0 ? (data.success[i] + '元') : ('免运费')) + '</span>');
                                        }
                                    }
                                }
                            });
                        }
                        _this.hide();
                        return false
                    });
                }
            });
        };
        var _getPostData = function () {
            var postData = {};
            var _cont = ($(".txt_quantity").val() - 0);
            postData.ProductId = global_setting.pdt_id;
            var patternArr = [];
            $(".buy_attr.curr").each(function () {
                patternArr.push($(this).attr("data_id"));
            });
            postData.patternStr = patternArr.join(',');
            postData.areaId = $(".change_city").attr("value");
            postData.Count = _cont <= 0 ? 1 : _cont;
            return postData;
        };
        var _getEvaluateList = function () {
            var $comment_list = $page.find(".comment_list").empty();
            var $quality_box = $page.find(".quality_box");
            global_setting.EvaluatePage = {};
            global_setting.EvaluatePage.pagesize = 10;
            $.ajax({
                url: domains.api+"/productcomment/GetStat/" + global_setting.pdt_id,
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    $quality_box.find("[data_key]").each(function () {
                        var $this = $(this);
                        evaluate.setSchedule(data[$this.attr("data_key")] * 10, function () {
                            $this.find('em').css("width", this.w + "%");
                            $this.find('.quality_remark').empty().append(this.msg);
                        });
                    });
                }
            });
            $.ajax({
                url:domains.api+ '/productcomment/pagecomment/' + global_setting.pdt_id,
                type: 'get',
                data: {
                    total: 0,
                    size: global_setting.EvaluatePage.pagesize,
                    p: 1
                },
                dataType: "jsonp",
                success: function (data) {
                    global_setting.EvaluatePage.total = data.PageInfo.TotalItems;
                    if (!data.list.length) {
                        $comment_list.append('<li style="height: 70px; background: #fff;text-align: center;line-height: 70px;">暂无评论！</li>');
                        return false
                    }
                    $comment_list.append(_evaluateItem.render(data));
                    $comment_list.append('<li style="float: right;margin-bottom: 25px;"><div class="wm_page evaluatepage"></div></li>');
                    var _page = page.Create({
                        url: domains.api+'/productcomment/pagecomment/' + global_setting.pdt_id,
                        element: ".evaluatepage",
                        param: {
                            total: global_setting.EvaluatePage.total,
                            size: global_setting.EvaluatePage.pagesize
                        },
                        pagekey: "p",
                        async: true,
                        index: 1,
                        size: global_setting.EvaluatePage.pagesize,
                        sum: global_setting.EvaluatePage.total,
                        front: true,
                        dataType: "jsonp",
                        success: function (data) {
                            $comment_list.find(".comment_item").remove();
                            $comment_list.prepend(_evaluateItem.render(data));
                            _page.setIndex(this.index);
                        },
                        error: function () {
                            $comment_list.find(".comment_item").fadeOut(function () {
                                $(this).remove();
                            });
                            _page.setIndex(this.index);
                        }
                    });

                },
                error: function () {
                }
            });
        };
        var _getSingle = function () {
            var $tab_single_sun_main = $page.find(".tab_single_sun_main").empty();
            global_setting.SinglePage = {};
            global_setting.SinglePage.pagesize = 10;
            $.ajax({
                url: domains.api+'/productsun/pagelist',
                type: 'get',
                data: {
                    id: global_setting.pdt_id,
                    total: 0,
                    size: global_setting.SinglePage.pagesize,
                    p: 1
                },
                dataType: "jsonp",
                success: function (data) {
                    if (data.PageInfo.TotalItems) {
                        global_setting.SinglePage.total = data.PageInfo.TotalItems;
                        $tab_single_sun_main.append(_singleItem.render(data));
                        $tab_single_sun_main.append('<div class="wm_page singlepage"></div>');
                        var _page = page.Create({
                            url: domains.api+'/productsun/pagelist',
                            element: ".singlepage",
                            param: {
                                total: global_setting.SinglePage.total,
                                size: global_setting.SinglePage.pagesize,
                                id: global_setting.pdt_id
                            },
                            pagekey: "p",
                            async: true,
                            index: 1,
                            size: global_setting.SinglePage.pagesize,
                            sum: global_setting.SinglePage.total,
                            front: true,
                            dataType: "jsonp",
                            success: function (data) {
                                $tab_single_sun_main.find("ul").remove();
                                $tab_single_sun_main.prepend(_singleItem.render(data));
                                _page.setIndex(this.index);
                            },
                            error: function () {
                                $tab_single_sun_main.find("ul").fadeOut(function () {
                                    $(this).remove();
                                });
                                _page.setIndex(this.index);
                            }
                        });
                    } else {
                        $tab_single_sun_main.append('<div style="height: 70px; background: #fff;text-align: center;line-height: 70px;font-size:12px;color:#00">暂无晒单！</li>');
                        return false
                    }

                },
                error: function () {
                }
            });
        };
        $page.on("change.changeQuantity", ".txt_quantity", function () {
            var $this = $(this), _v, maxQuantity = $this.data("maxQuantity") - 0, thisTips = $this.data("thisTips");
            $this.val(parseInt($this.val()) || 1);
            _v = $this.val() - 0;
            if (_v <= 0) {
                $this.val(1);
                return false
            }
            if (_v > maxQuantity) {
                $this.val(maxQuantity);
                if (!thisTips) {
                    thisTips = new tips({
                        ele: $this,
                        con: '<p>超过存货数量！</p>',
                        close: 2000,
                        skin: "red2",
                        direction: 'tc'
                    });
                    $this.data("thisTips", thisTips);
                }
                thisTips.show();
                _v = maxQuantity;
            }
        });
        //选择购买属性
        $page.on("click.setBuyAttr", ".buy_attr", function () {
            var $this = $(this); $options_list = $this.closest(".options_list"), _quantity = $quantity.val() - 0 || 1;
            if ($this.hasClass("curr") || $this.hasClass("disabled")) { return false }

            str = '', _data = SpecificationData.dataList, _o1 = {}, _o2 = {};
            $options_list.find(".curr").removeClass("curr");
            $this.addClass("curr");
            $buy_attr_box.find(".options_list").each(function () {
                var $this = $(this).find(".curr");
                if ($this.length) {
                    str += "[data_" + $this.attr("data_key") + "='" + $this.attr("data_value") + "']";
                }
            });
            //有BUG
            for (var i in _data) {
                if (i.indexOf(str) >= 0) {
                    _o1[i] = _data[i];
                    if (!(_data[i].amount - 0)) {
                        _o2[i.replace(str, "")] = _data[i];
                    }
                }
            }
            //计算价格范围
            _defineRange(_o1);
            //计算货存
            _quantitySum(_o1);
            //禁用
            _disabledAttr();
            //检测购买数量与货存
            if (_quantity > quantityCon) {
                _quantity = quantityCon;
                $quantity.val(_quantity);
            }
            if (minMoney != maxMoney) {
                //恶心的处理掉这个BUG
                minMoney >= 0 && maxMoney >= 0 && (minMoney + "").length < 10 && (maxMoney + "").length <= 10 && $(".wm_price").empty().append('￥' + minMoney + "-￥" + maxMoney);
            } else {
                $(".wm_price").empty().append('￥' + minMoney);
            }
            //设置
            $quantity.data("maxQuantity", quantityCon);
            $(".quantity").html("（库存" + quantityCon + "件）");
            return false;
        });
        //商品介绍，商品评论tab切换
        $page.on("click.tab", ".tab_box .tab_item a", function () {
            var $this = $(this),
                $tab_item = $this.closest(".tab_item"),
                $tab = $tab_item.closest(".tab_box");
            $tab.attr("class", "tab_box " + $tab_item.attr("tab_key"));
            if ($tab_item.attr("tab_key") === "comment" && !$(".comment_list .comment_item").length) {
                _getEvaluateList();
            }
            if ($tab_item.attr("tab_key") === "tab_single_sun" && !$(".tab_single_sun_main ul").length) {
                _getSingle();
            }
            return false;
        });
        //物流城市改变
        $page.on("click.changeCity", ".change_city", function () {
            var $this = $(this), _val = $this.attr("value");
            if (!areaTips) {
                _initArea.call(this);
                areaTips.wmBox.find("[value='" + _val.substr(0, 2) + "0000']").addClass("curr").click();
                areaTips.wmBox.find("[value='" + _val + "']").addClass("curr");
            }
            areaTips.show();
            return false;
        });
        //任意区域单击隐藏城市改变tips
        $page.on("click.hideCityTips", function () {
            areaTips && areaTips.hide();
        });
        //改变购买数量
        $page.on("click.changeQuantity", ".changequantity", function () {
            var _v = $quantity.val() - 0 || 1;
            var $this = $(this);
            if ($this.hasClass("arrowup")) {
                $quantity.val(++_v);
            } else {
                $quantity.val((--_v || 1));
            }
            _v = $quantity.val() - 0;
            if (_v > 1) {
                $arrowdown.attr("class", "wm_ico arrowdown arrow2down changequantity");
            } else {
                $arrowdown.attr("class", "wm_ico arrowdown arrow2down_disabled changequantity");
            }
            $quantity.change();
            return false;
        });
        //购买
        $page.on("click.buy", ".buy_btn", function () {
            var $this = $(this), postData, roleTips;
            if (!verification.verify(".commodity_data")) {
                $buy_attr_box.attr("class", "buy_attr_box buy_attr_box_err");
            } else {
                lib.verificationLogin(function () {
                    if (role.key === "1") {
                        $buy_attr_box.attr("class", "buy_attr_box");
                        postData = _getPostData();
                        window.location.href = domains.cart+"/buy_now?" + $.param(postData);
                    } else {
                        roleTips = $this.data("roleTips");
                        if (!roleTips) {
                            roleTips = new tips({
                                ele: $this,
                                con: '<p>' + role.value + '账号不能进行购买操作！<br><a href="#" class="login" style="color: #4fa2d6;">重新登录</a></p>',
                                direction: 'tc',
                                offset: {
                                    top: -5
                                },
                                callBack: function () {
                                    this.$tipsBox.on("click", ".login", function () {
                                        loginBox();
                                        return false;
                                    });
                                }
                            });
                            $this.data("roleTips", roleTips);
                        }
                        roleTips.show();
                    }
                });
            }

            return false;
        });
        //购物车
        $page.on("click.shopping_cart", ".shopping_cart", function () {
            var $this = $(this), _offset, $wizard, roleTips;
            //不存在角色信息和角色为买家，可以进行购物车操作
            if (!verification.verify(".commodity_data")) {
                $buy_attr_box.attr("class", "buy_attr_box buy_attr_box_err");
            } else {
                lib.verificationLogin(function () {
                    if (role.key === "1") {
                        _offset = $this.offset();
                        $wizard = $('<div class="wizard"><img src="' + _Eq0Src + '"></div>');
                        $wizard.css({
                            top: _offset.top - 52,
                            left: _offset.left
                        });
                        $body.append($wizard);
                        $wizard.animate({
                            top: 80,
                            left: $(".shopping_cart_entrance").offset().left + 10
                        }, 500, function () {
                            $wizard.animate({
                                top: -100
                            }, 800);
                        });
                        $buy_attr_box.attr("class", "buy_attr_box");
                        var postData = _getPostData();
                        $.ajax({
                            url: domains.cart+"/cart/add",
                            type: "get",
                            data: postData,
                            dataType: "jsonp",
                            success: function (data) {
                                if (data.response) {
                                    $(".shopping_cart_entrance b").empty().append(lib.cookie("wm.user.cart_count") || 0);
                                }
                            }
                        })

                    } else {
                        roleTips = $this.data("roleTips");
                        if (!roleTips) {
                            roleTips = new tips({
                                ele: $this,
                                con: '<p>' + role.value + '账号不能进行购物车操作！<br><a href="#" class="login" style="color: #4fa2d6;">重新登录</a></p>',
                                direction: 'tc',
                                offset: {
                                    top: -5
                                },
                                callBack: function () {
                                    this.$tipsBox.on("click", ".login", function () {
                                        loginBox();
                                        return false;
                                    });
                                }
                            });
                            $this.data("roleTips", roleTips);
                        }
                        roleTips.show();
                    }
                });

            }
            return false;
        });
        //关闭验证信息
        $page.on("click.hideV", ".buy_attr_box .close", function () {
            $buy_attr_box.attr("class", "buy_attr_box");
            return false;
        });
        //分享
        $page.on("click", ".share", function () {
            _sharebox = sharebox.show($(this));
            return false;
        });

        // 收藏宝贝
        $page.on("click", ".collect", function () {
            var $this = $(this),
				thisTips, roleTips;
            ;
            if (!role || (role && role.key == "1")) {
                collect.collectCommodity({
                    id: global_setting.pdt_id,
                    success: function (data) {
                        if (data.success) {
                            thisTips = $this.data("thisTips");
                            if (!thisTips) {
                                thisTips = new tips({
                                    ele: $this,
                                    con: "收藏成功！",
                                    close: 2000,
                                    direction: "bc"
                                });
                                $this.data("thisTips", thisTips);
                            }
                            thisTips.setCon('收藏成功！');
                            thisTips.show();
                        } else {
                            thisTips = $this.data("thisTips");
                            if (!thisTips) {
                                thisTips = new tips({
                                    ele: $this,
                                    con: data.error,
                                    close: 2000,
                                    direction: "bc"
                                });
                                $this.data("thisTips", thisTips);
                            }
                            thisTips.setCon(data.error);
                            thisTips.show();
                        }
                    },
                    error: function () {
                        thisTips = $this.data("thisTips");
                        if (!thisTips) {
                            thisTips = new tips({
                                ele: $this,
                                con: "收藏失败！",
                                close: 2000,
                                direction: "rc"
                            });
                            $this.data("thisTips", thisTips);
                        }
                        thisTips.setCon('收藏失败！');
                        thisTips.show();
                    }
                })
            } else {
                roleTips = $this.data("roleTips");
                if (!roleTips) {
                    roleTips = new tips({
                        ele: $this,
                        con: '<p>' + role.value + '账号不能进行收藏操作！<br><a href="#" class="login" style="color: #4fa2d6;">重新登录</a></p>',
                        direction: 'tc',
                        offset: {
                            top: -5
                        },
                        callBack: function () {
                            this.$tipsBox.on("click", ".login", function () {
                                loginBox();
                                return false;
                            });
                        }
                    });
                    $this.data("roleTips", roleTips);
                }
                roleTips.show();
            }
            return false;
        });

        //隐藏分享弹窗
        $page.on("click.hideShareBox", function () {
            _sharebox && _sharebox.hide();
        });
        //显示大图
        $page.on("click", ".showbigimg", function () {
            var $this = $(this), _src = $this.attr("src");
            $bigimg.attr("src", _src);
            $maxbig_img.find("img").attr("src", _src);
            lib.imgLoad(_src, function () {
                $maxbig_img.find("img").css({
                    "min-width": $bigimg.width() * 2,
                    "min-height": $bigimg.height() * 2,
                    "width": $bigimg.width() * 2,
                    "height": $bigimg.height() * 2
                });
            });
        });
        $maxbig_img.find("img").attr("src", $bigimg.attr("src"));
        //放大镜
        move.create({
            moveEle: '#big_move',
            event: "move",
            parentEle: '.big_link',
            mousemoveCallback: function (page) {
                var _offset = this.$moveBox.position(),
                    $big_img = $big_link.find(".big_img");
                var big_imgH = $big_img.outerHeight(),
                    big_imgW = $big_img.outerWidth(),
                    moveMinY = $big_img.offset().top,
                    moveMaxY = moveMinY + big_imgH,
                    moveMinX = $big_img.offset().left,
                    moveMaxX = moveMinX + big_imgW;
                //鼠标在允许放大范围内以及允许放大
                if (page.pageX < moveMinX || page.pageX > moveMaxX || page.pageY < moveMinY || page.pageY > moveMaxY || Math.min(big_imgH, big_imgW) < 200) {
                    this.$moveBox.css("visibility", "hidden");
                    $maxbig_img.css("visibility", "hidden");
                } else {
                    areaTips && areaTips.hide();
                    this.$moveBox.css("visibility", "visible");
                    $maxbig_img.css("visibility", "visible");
                    //大图与放大图的 比例
                    var b1 = big_imgW / $maxbig_img.find("img").outerWidth(), b2 = big_imgH / $maxbig_img.find("img").outerHeight();
                    var c1 = $maxbig_img.find("img").outerWidth() / big_imgW, c2 = $maxbig_img.find("img").outerHeight() / big_imgH;
                    $maxbig_img.find("img").css({
                        "margin-top": -((_offset.top - moveMinY) / b2),
                        "margin-left": -((_offset.left - moveMinX) / b1)
                    });
                }
            }
        });
        $(".big_img").hover(function () {
            $big_move.css("display", "block");
        }, function () {
            //$big_move.css("display", "none");
        });
        //晒单图片显示原图
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
        //回复晒单
        $page.on("click", ".add_call_btn", function () {
            var $this = $(this), $tab_single_sun_main = $this.closest(".tab_single_sun_main");
            $tab_single_sun_main.find(".add_call_msg").css("display", "none");
            $tab_single_sun_main.find(".hide_call_btn").removeClass("hide_call_btn").addClass("add_call_btn");
            $this.closest(".btns").find(".add_call_msg").css("display", "block");
            $this.removeClass("add_call_btn").addClass("hide_call_btn");
            return false;
        });
        //隐藏回复
        $page.on("click", ".hide_call_btn", function () {
            var $this = $(this);
            $this.closest(".tab_single_sun_main").find(".add_call_msg").css("display", "none");
            $this.removeClass("hide_call_btn").addClass("add_call_btn");
            return false;
        });
        $page.on("focus", ".add_call_msg_txt", function () {
            var $this = $(this);
            $this.css({ overflow: 'visible' }).animate({ height: "100px" }, 400);
        });
        $page.on("blur", ".add_call_msg_txt", function () {
            var $this = $(this);
            $this.scrollTop(0).css({ overflow: 'hidden' }).animate({ height: "16px" }, 300);
        });
        $page.on("click", ".single_sun_itme .submit", function () {
            var $this = $(this),
                $single_sun_itme = $this.closest(".single_sun_itme"),
                successTips,
                errorTips,
                roleTips,
                verificationTips, _v;
            _v = $single_sun_itme.find(".add_call_msg_txt").val();
            //回复内容检测
            if (_v) {
                //登录检测
                lib.verificationLogin(function () {
                    //权限检测
                    if (role.key === "1") {
                        $.ajax({
                            url: domains.api+"/productsun/Reply",
                            type: "get",
                            dataType: "jsonp",
                            data: {
                                sun_id: $single_sun_itme.attr("sun_id"),
                                sun_reply_content: encodeURIComponent(_v)
                            },
                            success: function (data) {
                                if (data.success) {
                                    $single_sun_itme.find(".add_call_msg_txt").val('');
                                    successTips = $this.data("successTips");
                                    if (!successTips) {
                                        successTips = new tips({
                                            ele: $this,
                                            con: '<p><i class="wm_ico hook2" style="margin-right:10px"></i>回复成功！</p>',
                                            close: 2000,
                                            direction: 'tc',
                                            offset: {
                                                top: -5
                                            }
                                        });
                                        $this.data("successTips", successTips);
                                    }
                                    successTips.show();
                                }
                                else {
                                    errorTips = $this.data("errorTips");
                                    if (!errorTips) {
                                        errorTips = new tips({
                                            ele: $this,
                                            con: '<p>系统繁忙请稍后再试！</p>',
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
                            },
                            error: function () {
                                errorTips = $this.data("errorTips");
                                if (!errorTips) {
                                    errorTips = new tips({
                                        ele: $this,
                                        con: '<p>系统繁忙请稍后再试！</p>',
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

                    } else {
                        roleTips = $this.data("roleTips");
                        if (!roleTips) {
                            roleTips = new tips({
                                ele: $this,
                                con: '<p>' + role.value + '账号不能进行晒单回复操作！<br><a href="#" class="login" style="color: #4fa2d6;">重新登录</a></p>',
                                direction: 'tc',
                                offset: {
                                    top: -5
                                },
                                callBack: function () {
                                    this.$tipsBox.on("click", ".login", function () {
                                        loginBox();
                                        return false;
                                    });
                                }
                            });
                            $this.data("roleTips", roleTips);
                        }
                        roleTips.show();
                    }
                });
            } else {
                $single_sun_itme.find(".add_call_msg_txt").focus();
                verificationTips = $this.data("verificationTips");
                if (!verificationTips) {
                    verificationTips = new tips({
                        ele: $this,
                        con: '<p>请输入回复信息！</p>',
                        close: 2000,
                        skin: "red2",
                        direction: 'tc',
                        offset: {
                            top: -5
                        }
                    });
                    $this.data("verificationTips", verificationTips);
                }
                verificationTips.show();
            }

            return false;
        });
        $page.on("click", ".praise", function () {
            var $this = $(this), errorTips, roleTips;
            lib.verificationLogin(function () {
                //权限检测
                if (role.key === "1") {
                    $.ajax({
                        url: domains.api+"/productsun/sunuse/" + $this.closest("ul").attr("sun_id"),
                        type: "get",
                        dataType: "jsonp",
                        success: function (data) {
                            if (data.success) {
                                $this.find(".ui_btn_txt").empty().append('有用(' + data.success + ')');
                            } else {
                                errorTips = $this.data("errorTips");
                                if (!errorTips) {
                                    errorTips = new tips({
                                        ele: $this,
                                        con: '<p>只能点一次哦~</p>',
                                        direction: "tc",
                                        close: 2000,
                                        offset: { left: 5, top: -5 }
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
                                    con: '<p>只能点一次哦~</p>',
                                    direction: "tc",
                                    close: 2000,
                                    offset: { left: 5, top: -5 }
                                });
                            }
                            errorTips.show();
                        }
                    });
                } else {
                    roleTips = $this.data("roleTips");
                    if (!roleTips) {
                        roleTips = new tips({
                            ele: $this,
                            con: '<p>' + role.value + '账号不能点这个哦！<br><a href="#" class="login" style="color: #4fa2d6;">重新登录</a></p>',
                            direction: 'tc',
                            offset: {
                                top: -5
                            },
                            callBack: function () {
                                this.$tipsBox.on("click", ".login", function () {
                                    loginBox();
                                    return false;
                                });
                            }
                        });
                        $this.data("roleTips", roleTips);
                    }
                    roleTips.show();
                }
            });
            return false;
        });
        if ($bus_shortcuts.length) {
            $bus_shortcuts.attr("data_width", $bus_shortcuts.outerWidth()).css({ visibility: "visible" }).width(0);
            $page.find(".content_main").hover(function () {
                $bus_shortcuts.stop(true, true).animate({ width: $bus_shortcuts.attr("data_width") }, 200);
            }, function () {
                $bus_shortcuts.stop(true, true).animate({ width: 0 }, 100);
            });
        }
    };
    init();
});
