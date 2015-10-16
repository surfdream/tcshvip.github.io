define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		juicer = require("juicer")
    ;
    //初始化足迹分类
	//var initSubCommType = function () { };
	var isload=true;
	var _footmarkHtml = juicer([
		'{@if success.length>=1}',
		'{@each success as item}',
		'<div class="footmark_list" data_date="${item.sendDate}">',
			'<div class="footmark_time">${item.text}</div>',
			'<div class="footmark_con">',
				'<span class="footmark_date">${item.date}</span>',
				'<span class="footmark_num">浏览了<em class="browse_number">${item.lists.length}</em>件商品</span>',
				'<div class="footmark_detail">',
					'{@each item.lists as list}',
					'<a href="#" class="footmark_detail_item" data_id="${list.id}">',
						'<img src="${list.product_img}" title="${list.product_name}" />',
						'<span class="sell_num">月销量：${list.sales}</span>',
						'<span class="goods_price">￥${list.sale_price}</span>',
					'</a>',
					'{@/each}',
				'</div>',
			'</div>',
		'</div>',
		'{@/each}',
		'{@else if index===1}',
		'<div class="footmark_nocontent"></div>',
		'{@/if}'
	].join(''));
	
	/*var data = {
		success: [
			{
				text: "今天",//时间标识
				date: "2014-06-27",//当条时间
				commList: [
					{
						id: "1",//商品Id
						product_name: "",//商品标题
						product_img:"",
						sales: 555,//销量
						sale_price: 55
					},
					{
						id: "1",//商品Id
						product_name: "",//商品标题
						product_img:"",
						sales: 555,//销量
						sale_price: 55
					},
					{
						id: "1",//商品Id
						product_name: "",//商品标题
						product_img:"",
						sales: 555,//销量
						sale_price: 55
					}
				]
			},
			{
				text: "昨天",//时间标识
				date:  "2014-06-27",//当条时间
				commList: [
					{
						id: "1",//商品Id
						product_name: "",//商品标题
						product_img:"",
						sales: 555,//销量
						sale_price: 55
					},
					{
						id: "1",//商品Id
						product_name: "",//商品标题
						product_img:"",
						sales: 555,//销量
						sale_price: 55
					},
					{
						id: "1",//商品Id
						product_name: "",//商品标题
						product_img:"",
						sales: 555,//销量
						sale_price: 55
					}
				]
			},
			{
				text: "前天",//时间标识
				date: "2014-06-27",//当条时间
				commList: [
					{
						id: "1",//商品Id
						product_name: "",//商品标题
						product_img:"",
						sales: 555,//销量
						sale_price: 55
					},
					{
						id: "1",//商品Id
						product_name: "",//商品标题
						product_img:"",
						sales: 555,//销量
						sale_price: 55
					},
					{
						id: "1",//商品Id
						product_name: "",//商品标题
						product_img:"",
						sales: 555,//销量
						sale_price: 55
					}
				]
			},
			{
				text: "20",//时间标识
				date: "2014-06-20",//当条时间
				commList: [
					{
						id: "1",//商品Id
						product_name: "",//商品标题
						product_img:"",
						sales: 555,//销量
						sale_price: 55
					},
					{
						id: "1",//商品Id
						product_name: "",//商品标题
						product_img:"",
						sales: 555,//销量
						sale_price: 55
					},
					{
						id: "1",//商品Id
						product_name: "",//商品标题
						product_img:"",
						sales: 555,//销量
						sale_price: 55
					}
				]
			}
		]
	};*/

	
    //初始化
	var init = function () {
	    var $page = $("#page"),
	    	 _h = window.location.hash.substr(1),
			 $footmark_head = $page.find(".footmark_head"),
			 $new_goods_con = $page.find(".new_goods_con")
		;
	    //initSubCommType();
		
		/*var _headHtml = [
			'<span class="buyer_photo">',
				'<a href="#"><img src="${photo}" /></a>',
			'</span>',
			'<span class="already_head_title">以下是您最近30天浏览的商品</span>',
			'<a href="#" class="prompt_num">${down_num}件商品已降价</a>'
		].join('');*/
		
		// 头部
		/*if($footmark_head.length){
			$.ajax({
				url:"",
				type:"get",
				dataType:"json",
				success:function(data){
					$footmark_head.empty().append(_headHtml);
				},
				error:function(){
					$footmark_head.empty().append(_headHtml);
				}	
			});	
		};*/
		
		
		
	    bind();
		
	    if (_h.length) {
	        $page.find(".sub_comm_type[href='#" + _h + "']").click();
	    }else{
			// 初始化的足迹
			$page.find(".sub_comm_type:eq(0)").click();
		}
	};
	
    //绑定
	var bind = function () {
	    var $page = $("#page"),
			$body = $("body"),
			$window = $(window),
			$new_goods_con = $page.find(".new_goods_con"),
			_index=0,
			isGet=false
		;
        //获取足迹数据
	    var getFoot = function (startDate) {
			var _data_name = encodeURIComponent($page.find(".already_look_itemCur .sub_comm_type").attr("data_name"))
			;
			if(!isGet){
				if(startDate){
					isGet=true
					$.ajax({
					    url:domains.api+"/behavior/footmark",
						type:"get",
						data:{
							date_id:startDate,
							data_name:_data_name
						},
						dataType:"json",
						success:function(data){
							isGet=false;
							_index++;
							for(var i in data.success){
								data.success[i].sendDate=data.success[i].date.replace(/\-/g,"");
							}
							$new_goods_con.append(_footmarkHtml.render($.extend({
								index:_index	
							},data)));	
							isload=data.success.length;
						},
						error:function(){
							alert("系统繁忙，请稍后再试！");
						}
					});
				}else{
					throw "startDate不能为空！";
				}
			}
	    };
        //足迹分类单击
	    $page.on("click", ".sub_comm_type", function () {
			var $this = $(this),
				_cur = $this.closest(".already_look_itemCur")
				_left_nav = $this.closest(".left_nav_skin2_item")
			;
			if(!_cur.length){
				$page.find(".already_look_itemCur").removeClass("already_look_itemCur");
				_left_nav.addClass("already_look_itemCur");
				isload=true;
				_index=0;
				$page.find(".new_goods_con").empty();
				getFoot(global_setting.todayDate);
			}
	    });
        //滚动加载足迹
		
		$window.on("scroll.getFoot",function(){
			if(isload){
				var scrollTop = $body[0].scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0,
				_height = $window.height()
				;
				if(scrollTop>_height){
					var _start = $page.find(".footmark_list:last").attr("data_date");
					getFoot(_start);	
				}	
			}
		});
		
	};
	init();
	
})