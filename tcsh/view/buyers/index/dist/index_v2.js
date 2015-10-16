define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		points_promotion = require("points_promotion"),
		box = require("wmbox")
		juicer = require("juicer"),
		wmtips = require("wmtips")
	;
	
	var init = function(){
		var $buyer_box = $(".buyer_box"),
			$page = $("#page"),
			$already_buy=$page.find(".already_buy"),
			$buy_car = $page.find(".buy_car"),
			$mymoney = $page.find(".MyMoney")
		;
		
		$buyer_box.append(points_promotion.getHtml());
		points_promotion.bind($buyer_box);
		
		$mymoney.on("click",".take_out",function(){
			var $this=$(this),
				thistips=$this.data("thistips")
			;
			if(!thistips){
				thistips=new wmtips({
					ele:$this,
					con:"该功能正在开发中，请稍候！",
					close:2000,
					direction:"rt"
				});
				$this.data("thistips",thistips);
			}
			thistips.show();
			return false;
		})
		
		
		var _domHtml = juicer([
            	'<div class="already_buy_title">',
                	'<b>已买到的商品</b>',
                    '<a href="http://order.tcsh.me/orders/myorders?SelectOrderStatus=UnPay">待付款 <span>${payCount}</span></a><a href="http://order.tcsh.me/orders/myorders?SelectOrderStatus=Sent">待确认收货<span>${receGoodsCount}</span></a><a href="http://order.tcsh.me/orders/myorders?SelectOrderStatus=Success">待评价<span>${commentCount}</span></a>',
                '</div>',
                '<div class="already_buy_con">',
					'{@if order.length>=1}',
					'{@each order as item }',
                	'<div class="already_detail clearfix">',
                    	'<a href="#" class="goods_img"><img src="${item.pic}" /></a>',
                        '<div class="goods_detail">',
                        	'<ul>',
                            	'<li class="goods_status"><b>已发货</b><span class="buy_time">${item.createTime}</span></li>',
                            	'<li class="go_address">${item.address} ${item.recever} ${item.mobilephone}</li>',
                            '</ul>',
                        '</div>',
                        '<div class="dobuyer">',
							'<a href="http://order.tcsh.me/order/payment?orderid=${item.id}" class="buyer_btn">确认收货</a>',
                         '</div>',
                    '</div>',
					'{@/each}',
					'{@else}',
					'<div class="already_buy_con noContent_mt">',
						'<img src="img/joke_img1.jpg" />',
						'<div class="joke">',
							'<p>昨天在公园长凳子上坐着，隔壁一对夫妻闹别扭，男人刚开始一直不说话突然开始说话了：</p>',
							'<p>第一，我们是夫妻！</p>',
							'<p>第二，我们接受过高等教育的，有知识有文化有素养的人！</p>',
							'<p>第三，今天说出来逛街的人是你，说不想逛的人也是你！为什么要跟我闹气呢？</p>',
							'<p>女的一抬头：我高兴……</p>',
						'</div>',
                	'</div>',
					'{@/if}',
               '</div>'
		].join(''));
		
		if($already_buy.length){
			$.ajax({
				url:"http://adver.wumeiwang.com/wmAdver/buyer/orderHavePayGoods",
				type:"get",
				dataType:"json",
				success:function(data){
					$already_buy.empty().append(_domHtml.render(data));
				},
				error:function(){
					var data= {"order":[{"id":"1053673","createTime":"2013-12-21 22:19:37","mobilephone":"13683161529","address":"时间国际","pic":"http://img.wumeiwang.com/M00/00/1A/rBAA_FKddK-ALxrAAAHeR3mv24w713.jpg","recever":"牛"},{"id":"1053674","createTime":"2013-12-21 22:19:59","mobilephone":"13683161529","address":"时间国际","pic":"http://img.wumeiwang.com/M00/00/1A/rBAA_FKddK-ALxrAAAHeR3mv24w713.jpg","recever":"牛"},{"id":"1053675","createTime":"2013-12-21 22:20:34","mobilephone":"13683161529","address":"时间国际","pic":"http://img.wumeiwang.com/M00/00/1A/rBAA_FKddK-ALxrAAAHeR3mv24w713.jpg","recever":"牛"}],"payCount":0,"commentCount":0,"receGoodsCount":0};
					$already_buy.empty().append(_domHtml.render(data));
				}
			})	
		}
		
		var _carHtml = juicer([
			'<div class="already_buy_title">',
				'<b>购物车</b>',
				'<span>近期<a href="#" class="cheap_num">5</a>个宝贝降价</span>',
				'<a href="#" class="look_buy_car">查看购物车</a>',
			'</div>',
			'<div class="buy_car_con">',
				'{@if cartitem.length>=1}',
				'{@each cartitem as data_list}',
				'<div class="buy_car_detail clearfix">',
					'<a href="#" class="goods_img"><img src="${data_list.imgurl}" /></a>',
					'<div class="buy_car_goods">',
						'<ul>',
							'<li class="car_goods_name"><a href="${data_list.productlink}" title="${data_list.name}">${data_list.name}</a></li>',
							'<li class="goods_price">￥${data_list.price}</li>',
						'</ul>',
					'</div>',
					<!--'<div class="cheaper_price"></div>',-->
				'</div>',
				'{@/each}',
				'{@else}',
				'<div class="buy_car_con noContent_mt">',
                	'<img src="img/joke_img2.jpg" />',
                    '<div class="joke joke1">',
                    	'<p>医生问病人是怎么骨折的，病人说，我觉得鞋里有沙子，就扶着电线杆抖鞋，突然有个混蛋经过那里以为我触电了，便抄起木棍给了我两棍子！</p>',
                    '</div>',
                '</div>',
				'{@/if}',
			'</div>'
		].join(''));
		
		if($buy_car.length){
			$.ajax({
				ulr:"http://cart.tcsh.me/async/cart/items",
				type:"get",
				dataType:"json",
				success:function(data){
					$buy_car.empty().append(_carHtml.render(data));
				},
				error:function(){
					var data = {"cartitem":[{"name":"圣晶 乌拉圭特级天然紫水晶手链 时尚送女友圣诞节礼物爱的守护石","price":869.00,"productlink":"http://item.tcsh.me/230169.html","imgurl":"http://img.wumeiwang.com/m00/00/17/rbaa_vkcdjmayohuaapllc2_o0q586.jpg"},{"name":"圣晶 天然水晶手链女 青金石手串珠子手链单圈 韩版时尚首饰品","price":189.00,"productlink":"http://item.tcsh.me/229936.html","imgurl":"http://img.wumeiwang.com/m00/00/0f/rbaa_fkyr4-atskyaammwvgu1qe425.jpg"},{"name":"圣晶 天然水晶手链女 青金石手串珠子手链单圈 韩版时尚首饰品","price":189.00,"productlink":"http://item.tcsh.me/229936.html","imgurl":"http://img.wumeiwang.com/m00/00/0f/rbaa_fkyr4-atskyaammwvgu1qe425.jpg"}]};
					$buy_car.empty().append(_carHtml.render(data));
				}
			});	
		}
		
		bind();	
	};
	
	var bind = function(){
		
		var $page = $("#page"),
			$show_money = $page.find(".show_money")
		;
		
		$show_money.toggle(function(){
			
			var $this = $(this);
			$this.siblings(".real_money").fadeIn();
			$this.text("隐藏余额");	
			
		},function(){
			
			var $this = $(this);
			$this.siblings(".real_money").fadeOut(0);
			$this.text("显示余额");
			
		});
		
		
		
		//提醒发货
        $page.on("click", ".remind", function () {
            var $this = $(this),
            	remindSuccess, remindError, remindTimeout;
            //alert("ajaxToRevocation");
            $.ajax({
                url: "",
                type: "get",
                dataType: "json",
                success: function (data) {
                    if (data.response) {
                        remindSuccess = $this.data("remindSuccess");
                        if (!remindSuccess) {
                            remindSuccess = box.alert({
                                boxCls: "orderErrbox",
                                titleText: "系统提示",
                                content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">成功发送提醒！</p>',
                                btns: [
                                       { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                                ],
                                callback: function () {
                                    this.wmBox.find(".close").removeClass("close").addClass("hide");
                                }
                            });
                            $this.data('remindSuccess', remindSuccess);
                        }
                        remindSuccess.show();
                    } else {
                        remindError = $this.data("remindError");
                        if (!remindError) {
                            if (!remindError) {
                                remindError = box.alert({
                                    boxCls: "orderErrbox",
                                    titleText: "系统提示",
                                    content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">提醒发送失败，请稍后再试！</p>',
                                    btns: [
                                           { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                                    ],
                                    callback: function () {
                                        this.wmBox.find(".close").removeClass("close").addClass("hide");
                                    }
                                });
                                $this.data('remindError', remindError);
                            }
                            remindError.show();
                        }
                    }
                },
                error: function () {
                    remindTimeout = $this.data("remindTimeout");
                    if (!remindTimeout) {
                        remindTimeout = box.alert({
                            boxCls: "orderErrbox",
                            titleText: "系统提示",
                            content: '<p style="text-align: center;width: 300px;font-size: 16px;padding-top: 20px;">提醒发送失败，请稍后再试！</p>',
                            btns: [
                                   { cls: "ui_btn_h40red2", res: "hide", text: "确    定" }
                            ],
                            callback: function () {
                                this.wmBox.find(".close").removeClass("close").addClass("hide");
                            }
                        });
                        $this.data('remindTimeout', remindTimeout);
                    }
                    remindTimeout.show();
                }
            });
            return false;
        });
	};
	
	init();
})