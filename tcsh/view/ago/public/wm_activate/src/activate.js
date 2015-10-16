define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        lib = require("http://s.tcsh.me/tcsh/model/lib/dist/lib.js"),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
        juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
        area = require("http://s.tcsh.me/tcsh/model/wmarea/dist/wmarea.js"),
        verification = require("http://s.tcsh.me/tcsh/model/wmverification/dist/wmverification.js")
    ;
    require('../css/style.css#');
    var postData = {};
    var init = function () {
        var _active_phone = lib.queryString("active_phone"),
            _sign = lib.queryString("sign")
        ;
        var api = {
            //获取激活用户数据
            getUserData: function (op) {
                $.ajax({
                    url: domains.member + "/asyn/imported_data/pre_resister.json",
                    data: {
                        active_phone: op.active_phone,
                        sign: op.sign
                    },
                    dataType: "jsonp",
                    success: function (data) {
                        typeof op.success === "function" && op.success(data);
                    },
                    error: function () {
                        typeof op.error === "function" && op.error();
                    }
                });
            },
            //激活
            register: function (op) {
                $.ajax({
                    url: domains.member + "/asyn/imported_data/register.json",
                    data: {
                        password: op.password,
                        active_phone: op.active_phone,
                        sign: op.sign
                    },
                    dataType: "jsonp",
                    success: function (data) {
                        typeof op.success === "function" && op.success(data);
                    },
                    error: function () {
                        typeof op.error === "function" && op.error(data);
                    }
                });
            },
            //获取礼物列表
            getPresentList: function (op) {
                $.ajax({
                    url: domains.member + "/asyn/imported_data/present_list.json",
                    data: {},
                    dataType: "jsonp",
                    success: function (data) {
                        typeof op.success === "function" && op.success(data);
                    },
                    error: function () {
                        typeof op.error === "function" && op.error();
                    }
                });
            },
            //获取礼物属性
            getProductAttr: function (op) {
                $.ajax({
                    url: domains.member + "/asyn/imported_data/product_attr.json",
                    data: {
                        productId: op.productId
                    },
                    dataType: "jsonp",
                    success: function (data) {
                        typeof op.success === "function" && op.success(data);
                    },
                    error: function () {
                        typeof op.error === "function" && op.error();
                    }
                });
            },
            //提交订单
            postOrderPresent: function (op) {
                $.ajax({
                    url: domains.member + "/asyn/imported_data/order_present.json",
                    data: {
                        id: op.id,
                        patternStr: op.patternStr,
                        productId: op.productId,
                        receiver: op.receiver,
                        mobilephone: op.mobilephone,
                        address: op.address,
                        postcode: op.postcode,
                        remark: op.remark,
                        active_phone: op.active_phone,
                        sign: op.sign
                    },
                    dataType: "jsonp",
                    success: function (data) {
                        typeof op.success === "function" && op.success(data);
                    },
                    error: function () {
                        typeof op.error === "function" && op.error();
                    }
                });
            }
        };
        if (_active_phone) {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                window.location.href = "http://m.tcsh.me/ipt/reg?" + $.param({ active_phone: _active_phone, sign: _sign });
            }
            //if (lib.cookie("wm.user.username") && (lib.cookie("wm.user.username") !== ("tcsh_" + _active_phone))) {
            //    return false;
            //}
            verification.addRule([
                {
                    key: "districts",
                    fun: function () {
                        return !!(this.val() - 0);
                    }
                }
            ]);
            var _initBuyAttr = function (data) {
                return juicer([
                    '<form class="wm_form post_gifts_form" action="http://m.tcsh.me/present/pre_order">',
                       '<ul>',
                           '{@each relation as item}',
                           '<li class="form_row" >',
                               '<label class="row_key">${item.key}：</label>',
                               '<ul class="floatleft options_list">',
                                   '{@each item.itemList as list}',
                                   '<li class="options_item" data_id="${list.id}">',
                                       '<a href="#" hidefocus="true" style="{@if list.src}padding:0;{@/if}" title="${list.name}" data_key="${item.key}" data_value="${list.name}" data_id="${list.id}" class="buy_attr">{@if list.src}<img src="${list.src}" class="showbigimg" />{@else}${list.name}{@/if}<i class="wm_ico hook3"></i></a>',
                                   '</li>',
                                   '{@/each}',
                               '</ul>',
                           '</li>',
                           '{@/each}',
                       '</ul>',
                       '<div class="btns"><a href="#" class="ui_btn ui_btn_h28red17 go_ad"><span class="ui_btn_txt">填写地址，准备收货</span></a></div>',
                       '<input type="hidden" name="id" value="' + data.id + '"/>',
                       '<input type="hidden" name="productid" value="' + data.productId + '"/>',
                       '<input type="hidden" class="patternstr" name="PatternStr" value=""/>',
                     '</form>'
                ].join(''), data);
            };
            var _initGiftsList = function (data) {
                return juicer([
                    '<div class="puab_head">',
                        '<h3 title="同城生活" class="iconfont">&#xe624;</h3>',
                        '<div class="logo_msg"><em>同城生活</em><span>HU DONG GOU WU</span></div>',
                        '<p class="box_remark">礼物领取</p>',
                        '<a href="#" class="wm_ico fork7 close"></a>',
                    '</div>',
                    '<ul class="gifts_list">',
                        '{@each data as item}',
                        '<li class="gifts_item" data_gifts_id="${item.id}" data_product_id="${item.product_id}" data_gifts_name="${item.present_title}" data_comm_name="${item.product_title}">',
                            '<div class="show_gifts" target="_blank">',
                                '<img src="${item.default_image}">',
                                '<span class="gifts_name">${item.present_title}</span>',
                                '<span class="commodity_name">${item.product_title}</span>',
                                '<div class="gifts_btns">',
                                    '<a href="#" class="ui_btn ui_btn_h24green4 receive_btn"><span class="ui_btn_txt">立即领取</span></a>',
                                    '<a href="' + domains.item + '/${item.product_id}.html" class="gifts_details" target="_blank">查看商品</a>',
                                '</div>',
                            '</div>',
                        '</li>',
                        '{@/each}',
                    '</ul>',
                    '<div class="chk_attr_box"></div>',
                    '<div class="chk_ad_box"></div>'
                ].join(''), data);
            };
            api.getUserData({
                active_phone: _active_phone,
                sign: _sign,
                success: function (data) {
                    if (data.response.data && !data.response.data.present_count) {
                        box.invBox({
                            'boxCls': "puab",//promotion_user_activate_box
                            'content': [
                                '<div class="puab_head">',
                                    '<h3 title="同城生活" class="iconfont">&#xe624;</h3>',
                                    '<div class="logo_msg"><em>同城生活</em><span>HU DONG GOU WU</span></div>',
                                    '<p class="box_remark">账号激活</p>',
                                    '<a href="#" class="wm_ico fork7 close"></a>',
                                '</div>',
                                '<div class="puab_main">',
                                    '<p class="activate_msg"><i class="iconfont">&#xf00b6;</i>尊敬的用户：<b title="' + data.response.data.real_name + '">' + data.response.data.real_name + '</b>请确认下方的账号，密码完成账号激活.<span class="remark">完成激活后，能够领取免费礼物哦~</span></p>',
                                    '<ul class="wm_form act_form">',
                                        '<li class="form_row">',
                                            '<label class="row_key">账号：</label>' + data.response.data.mobile_phone + '',
                                        '</li>',
                                        '<li class="form_row">',
                                            '<label class="row_key">密码：</label><input type="password" class="form_txt w170 password" value="tcsh888888" wmv="loginpassword" wmvmsg="请输入6-16位，字符" />',
                                            '<span class="remark">默认：tcsh888888</span>',
                                        '</li>',
                                        '<li class="form_row btns">',
                                            '<a href="#" class="activate_btn"><i class="packs packs_130_130_1"></i><span class="ui_btn ui_btn_h47yellow14"><span class="ui_btn_txt">确认激活，领取礼物</span></span></a>',
                                        '</li>',
                                    '</ul>',
                                '</div>'
                            ].join(''),
                            callback: function () {
                                var self = this;
                                postData.userName = "18268067844";
                                var $chk_attr_box, $chk_ad_box;
                                verification.minZIndex = this.wmBox.css("z-index") - 0 + 100;
                                verification.init(self.wmBox);
                                //关闭处理的有点傻逼
                                this.close = function () {
                                    verification.hideTips(self.wmBox);
                                    self.hide();
                                };
                                //帐号激活，显示礼物列表
                                this.wmBox.on("click", ".activate_btn", function () {
                                    if (!verification.verify(self.wmBox)) {
                                        return false;
                                    }
                                    api.register({
                                        password: $.trim(self.wmBox.find(".password").val()),
                                        active_phone: _active_phone,
                                        sign: _sign,
                                        success: function (data) {
                                            if (data.response/*data.response.result*/) {
                                                api.getPresentList({
                                                    success: function (data) {
                                                        self.setCon(_initGiftsList(data.response));
                                                        self.position();
                                                    },
                                                    error: function () { }
                                                });
                                            } else {
                                                alert("系统繁忙，请稍后再试！");
                                            }
                                        },
                                        error: function () { }
                                    });
                                    return false;
                                });
                                //显示礼物属性选择
                                this.wmBox.on("click", ".receive_btn", function () {
                                    var $this = $(this),
                                        $gifts_item = $this.closest(".gifts_item"),
                                        _productid = $gifts_item.attr("data_product_id"),
                                        _giftsid = $gifts_item.attr("data_gifts_id");
                                    if (!$chk_attr_box) {
                                        $chk_attr_box = self.wmBox.find(".chk_attr_box");
                                    }
                                    $chk_attr_box.empty().append('<a href="#" class="return_gifts_list"><i class="iconfont">&#xf0007;</i>重新选择</a><p style="text-align: center;line-height: 300px;clear: both;"><i class="wm_ico loading18_18_1" style="margin-right: 10px;"></i>正在获取礼物属性</p>');
                                    $chk_attr_box.animate({
                                        left: 10
                                    });
                                    api.getProductAttr({
                                        productId: _productid,
                                        success: function (data) {
                                            $chk_attr_box.empty().append('<a href="#" class="return_btn return_gifts_list"><i class="iconfont">&#xf0007;</i>重新选择</a>');
                                            $chk_attr_box.append(_initBuyAttr(data));
                                            postData.productid = _productid;
                                            postData.giftsid = _giftsid;
                                            postData.giftsname = $gifts_item.attr("data_gifts_name");
                                            postData.commname = $gifts_item.attr("data_comm_name");
                                        },
                                        error: function () { }
                                    });
                                    return false;
                                });
                                //返回礼物列表
                                this.wmBox.on("click", ".return_gifts_list", function () {
                                    $chk_attr_box.animate({
                                        left: 680
                                    });
                                    return false;
                                });
                                //属性选择
                                this.wmBox.on("click", ".buy_attr", function () {
                                    var $this = $(this),
                                        $options_list = $this.closest(".options_list");
                                    $options_list.find(".buy_attr.curr").removeClass("curr");
                                    $this.addClass("curr");
                                    return false;
                                });
                                //返回属性选择
                                this.wmBox.on("click", ".return_attr", function () {
                                    $chk_ad_box.animate({
                                        left: 680
                                    });
                                    return false;
                                });
                                //填写收货地址
                                this.wmBox.on("click", ".go_ad", function () {
                                    var patternArr = [], attr_msg = [];
                                    $(".buy_attr.curr").each(function () {
                                        var $this = $(this);
                                        patternArr.push($this.attr("data_id"));
                                        attr_msg.push($this.closest(".form_row").find(".row_key").text() + $this.text());
                                    });
                                    if (self.wmBox.find(".options_list").length !== patternArr.length) {
                                        alert("请选择礼物属性！");
                                        return false;
                                    }
                                    postData.attrStr = patternArr.join(',');
                                    postData.attrMsg = attr_msg;
                                    if (!$chk_ad_box) {
                                        $chk_ad_box = self.wmBox.find(".chk_ad_box");
                                        $chk_ad_box.empty().append([
                                        '<a href="#" class="return_btn return_attr"><i class="iconfont">&#xf0007;</i>重新选择</a>',
                                        '<form class="wm_form post_ad_form">',
                                           '<ul>',
                                                '<li class="form_row">',
                                                    '<label class="row_key"><b class="form_must">*</b>联系人：</label>',
                                                    '<input type="text" class="form_txt w170 link_name" name="link_name" wmv="empty" wmvmsg="请填写联系人！">',
                                                    '<span class="wmv_msg" for="link_name"></span>',
                                                '</li>',
                                                '<li class="form_row">',
                                                    '<label class="row_key"><b class="form_must">*</b>联系电话：</label>',
                                                    '<input type="text" class="form_txt w170 link_phone" name="link_phone" wmv="empty|phone" wmvmsg="请填写联系电话！|异常的手机号！">',
                                                    '<span class="wmv_msg" for="link_phone"></span>',
                                                '</li>',
                                                '<li class="form_row" >',
                                                    '<label class="row_key"><b class="form_must">*</b>地区：</label>',
                                                    '<select id="selProvince_rent" class="form_sel" ></select>',
                                                    '<select id="selCity_rent" class="form_sel"></select>',
                                                    '<select id="selDistricts_rent" class="form_sel" name="districts" wmv="districts" wmvmsg="请选择地区！"></select>',
                                                    '<span class="wmv_msg" for="districts"></span>',
                                                '</li>',
                                                '<li class="form_row">',
                                                    '<label class="row_key"><b class="form_must">*</b>街道：</label>',
                                                    '<input type="text" class="form_txt w170 street" name="street" wmv="empty" wmvmsg="请填写街道信息！" />',
                                                    '<span class="wmv_msg" for="street"></span>',
                                                '</li>',
                                                '<li class="form_row">',
                                                    '<label class="row_key"><b class="form_must">*</b>邮编：</label>',
                                                    '<input type="text" class="form_txt w170 chinazip" name="zip" wmv="empty|chinaZip" wmvmsg="请填写邮编！|异常的邮编！" />',
                                                    '<span class="wmv_msg" for="zip"></span>',
                                                '</li>',
                                            '</ul>',
                                            '<div class="btns"><a href="#" class="ui_btn ui_btn_h28red17 go_success"><span class="ui_btn_txt">确定收货地址，领取礼物</span></a></div>',
                                        '</form>'
                                        ].join(''));
                                        new area({
                                            parent: $chk_ad_box
                                        });
                                        verification.init($chk_ad_box);
                                        verification.strikingSuccess = false;
                                        $chk_ad_box.find("#selDistricts_rent").on("change", function () {
                                            verification.verify($(this).closest(".form_row"));
                                        });
                                    }
                                    $chk_ad_box.animate({
                                        left: 10
                                    });
                                    return false;
                                });
                                //提交数据
                                this.wmBox.on("click", ".go_success", function () {
                                    var $selProvince,
                                        $selCity,
                                        $selDistricts,
                                        _remark,
                                        _link_name,
                                        _link_phone,
                                        _address;
                                    if (verification.verify($chk_ad_box)) {
                                        _link_name = $chk_ad_box.find(".link_name").val();
                                        _link_phone = $chk_ad_box.find(".link_phone").val();
                                        _address = $chk_ad_box.find(".street").val();
                                        $selProvince = $chk_ad_box.find("#selProvince_rent");
                                        $selCity = $chk_ad_box.find("#selCity_rent");
                                        $selDistricts = $chk_ad_box.find("#selDistricts_rent");
                                        _remark = $.trim(($selProvince.find(":selected").html() + " " + $selCity.find(":selected").html() + " " + $selDistricts.find(":selected").html()).replace(/请选择/g, ""));
                                        api.postOrderPresent({
                                            id: postData.giftsid,
                                            patternStr: postData.attrStr,
                                            productId: postData.productid,
                                            receiver: _link_name,
                                            mobilephone: _link_phone,
                                            address: _address,
                                            postcode: $chk_ad_box.find(".chinazip").val(),
                                            remark: _remark,
                                            active_phone: _active_phone,
                                            sign: _sign,
                                            success: function (data) {
                                                if (data.response.result) {
                                                    self.setCon(juicer([
                                                        '<div class="puab_head">',
                                                            '<h3 title="同城生活" class="iconfont">&#xe624;</h3>',
                                                            '<div class="logo_msg"><em>同城生活</em><span>HU DONG GOU WU</span></div>',
                                                            '<p class="box_remark">礼物领取</p>',
                                                            '<a href="#" class="wm_ico fork7 close"></a>',
                                                        '</div>',
                                                        '<div class="success_box">',
                                                            '<h3 class="success_title">${giftsname}</h3>',
                                                            '<p class="success_mark"><span class="iconfont">&#xf0156;</span>领取成功！</p>',
                                                            '<p>进入<a href="http://www.tcsh.me/">同城生活</a></p>',
                                                            '<p>${commname}</p>',
                                                            '{@each attrMsg as item}',
                                                            '<p>${item}</p>',
                                                            '{@/each}',
                                                            '<p>' + _link_name + '</p>',
                                                            '<p>' + _link_phone + '</p>',
                                                            '<p>' + (_remark + " " + _address) + '</p>',
                                                        '</div>'
                                                    ].join(''), postData));
                                                    
                                                } else {
                                                    self.setCon(juicer([
                                                       '<div class="puab_head">',
                                                           '<h3 title="同城生活" class="iconfont">&#xe624;</h3>',
                                                           '<div class="logo_msg"><em>同城生活</em><span>HU DONG GOU WU</span></div>',
                                                           '<p class="box_remark">礼物领取</p>',
                                                           '<a href="#" class="wm_ico fork7 close"></a>',
                                                       '</div>',
                                                       '<div class="success_box">',
                                                           '<h3 class="success_title">${giftsname}</h3>',
                                                           '<p class="success_mark"><span class="iconfont" style="color: #e13436;">&#xf018c;</span>' + (data.response.error.message || "服务器繁忙，请稍后再试！") + '</p>',
                                                           '<p>进入<a href="http://www.tcsh.me/">同城生活</a></p>',
                                                           '<p>${commname}</p>',
                                                           '{@each attrMsg as item}',
                                                           '<p>${item}</p>',
                                                           '{@/each}',
                                                           '<p>' + _link_name + '</p>',
                                                           '<p>' + _link_phone + '</p>',
                                                           '<p>' + (_remark + " " + _address) + '</p>',
                                                       '</div>'
                                                    ].join(''), postData));
                                                }

                                            },
                                            error: function () {
                                                self.setCon(juicer([
                                                    '<div class="puab_head">',
                                                        '<h3 title="同城生活" class="iconfont">&#xe624;</h3>',
                                                        '<div class="logo_msg"><em>同城生活</em><span>HU DONG GOU WU</span></div>',
                                                        '<p class="box_remark">礼物领取</p>',
                                                        '<a href="#" class="wm_ico fork7 close"></a>',
                                                    '</div>',
                                                    '<div class="success_box">',
                                                        '<h3 class="success_title">${giftsname}</h3>',
                                                        '<p class="success_mark"><span class="iconfont" style="color: #e13436;">&#xf018c;</span>服务器繁忙，请稍后再试！</p>',
                                                        '<p>进入<a href="http://www.tcsh.me/">同城生活</a></p>',
                                                        '<p>${commname}</p>',
                                                        '{@each attrMsg as item}',
                                                        '<p>${item}</p>',
                                                        '{@/each}',
                                                        '<p>' + _link_name + '</p>',
                                                        '<p>' + _link_phone + '</p>',
                                                        '<p>' + (_remark + " " + _address) + '</p>',
                                                    '</div>'
                                                ].join(''), postData));
                                            }
                                        });

                                    }
                                    return false;
                                });
                                //账号已经激活但是未领取礼物，直接展示礼物列表
                                if (data.response.data.present_count == 0) {
                                    api.getPresentList({
                                        success: function (data) {
                                            self.setCon(_initGiftsList(data.response));
                                            self.position();
                                        },
                                        error: function () { }
                                    });
                                }
                            }
                        });
                    } else {

                    }
                }
            });

        }
    };
    init();
});
