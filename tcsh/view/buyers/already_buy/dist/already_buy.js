define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		juicer = require("juicer")
	;
	
	
	var $page = $("#page"),
		$footmark_data = $page.find("#footmark_data")
	;
	
	var _footmarkHtml = juicer([
		'<div class="already_head footmark_head">',
			'<span class="buyer_photo">',
				'<a href="#"><img src="${photo}" /></a>',
			'</span>',
			'<span class="already_head_title">以下是您最近30天浏览的商品</span>',
			'<a href="#" class="prompt_num">${down_num}件商品已降价</a>',
		'</div>',
		'<div class="new_goods_con">',
		'{@if data_list.length>=1}',
		'{@each data_list as item}',
		'<div class="footmark_list">',
			'<div class="footmark_time">${item.day}</div>',
			'<div class="footmark_con">',
				'<span class="footmark_date">${item.time}</span>',
				'<span class="footmark_num">浏览了${item.num}件商品</span>',
				'<div class="footmark_detail">',
					'<a href="#" class="footmark_detail_item">',
						'<img src="${item.imgUrl}" />',
						'<span class="sell_num">月销量：${item.sell}</span>',
						'<span class="goods_price">￥${item.price}</span>',
					'</a>',
					'<a href="#" class="footmark_detail_item">',
						'<img src="${item.imgUrl}" />',
						'<span class="sell_num">月销量：${item.sell}</span>',
						'<span class="goods_price">￥${item.price}</span>',
					'</a>',
					'<a href="#" class="footmark_detail_item">',
						'<img src="${item.imgUrl}" />',
						'<span class="sell_num">月销量：${item.sell}</span>',
						'<span class="goods_price">￥${item.price}</span>',
					'</a>',
					'<a href="#" class="footmark_detail_item">',
						'<img src="${item.imgUrl}" />',
						'<span class="sell_num">月销量：${item.sell}</span>',
						'<span class="goods_price">￥${item.price}</span>',
					'</a>',
					'<a href="#" class="footmark_detail_item">',
						'<img src="${item.imgUrl}" />',
						'<span class="sell_num">月销量：${item.sell}</span>',
						'<span class="goods_price">￥${item.price}</span>',
					'</a>',
				'</div>',
			'</div>',
			'{@/each}',
			'{@else}',
			'<div class="cheaper_goods_nocontent"></div>',
			'{@/if}',
			'</div>',
		'</div>'
	].join(''));
	
	if($footmark_data.length){
		$.ajax({
			url:"",
			type:"get",
			dataType:"jsonp",
			data:{
					
			},
			success:function(data){
				$footmark_data.empty().append(_footmarkHtml.render(data));
			},
			error:function(){
				/*var data = {"data_list":[]};
				$footmark_data.empty().append(_footmarkHtml.render(data));*/
			}
		})	
	}
	
})