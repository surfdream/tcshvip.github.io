define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		points_promotion = require("points_promotion"),
		box = require("wmbox"),
		juicer = require("juicer"),
		forimg = require("forimg"),
		site_in_message= require("site_in_message"),
		friend= require("friend")
	;
	
	var init = function(){
		
		bind();	
		
	}
	var bind = function(){
		var $page = $("#page"),
			$car_cheaper = $page.find(".car_cheaper"),
			$message_tree_item = $(".message_tree_item"),
			$order_goods_detail = $page.find(".order_goods_detail")
		;
		
		/*商品滚动*/
		$page.find(".order_detail").each(function(){
			var $this=$(this),
				i = 5
			;
			if($this.find(".goods_list").length>i){
				new forimg.Slide({
					forImgBoxEle: $this,
					forImgBoxListEle:".order_goods_con",
					forImgItemEle:".goods_list",
					callback: function () {
						var that = this
						;
						this.forImgBox.find(".right_icon").click(function () {
							that.next();
							return false;
						});
						this.forImgBox.find(".left_icon").click(function () {
							that.prev();
							return false;
						});	
					}
				});
			}else{
				$this.find(".order_icon").css({
					"visibility":"hidden"
				});
			}
			
		});
		
		/*有内容时 上移边框字体变色*/
		$page.find(".cheaper_con").hover(function(){
			var $this = $(this);
			$this.find(".goods_img").addClass("goods_img_hover");	
			$this.find(".goods_intr a").addClass("a_hover");
			
		},function(){
			var $this = $(this);
			$this.find(".goods_img").removeClass("goods_img_hover");
			$this.find(".goods_intr a").removeClass("a_hover");	
		});
		
		/*无内容时 上移背景字体变色*/
		$car_cheaper.hover(function(){
			var $this = $(this);
			$this.find(".cheaper_nocon1").addClass("cheaper_nocon1_hover");
			
			$this.find(".cheaper_nocon").addClass("cheaper_nocon_hover");
				
		},function(){
			var $this = $(this);
			
			$this.find(".cheaper_nocon1").removeClass("cheaper_nocon1_hover");
			
			$this.find(".cheaper_nocon").removeClass("cheaper_nocon_hover");
			
		});
		
		/*$order_goods_detail.each(function(){
			var $this = $(this),
				$order_goods_con = $this.find(".order_goods_con"),
				slideWidth = $order_goods_con.find("img").outerWidth(true),
				imgLength = $order_goods_con.find("img").length,
				index = 0
			;
			$this.on("click",".left_icon",function(){
				if(index<imgLength-5){
					$order_goods_con.animate({
						left:'-='+slideWidth
					},300);
					index++;	
				}
				return false;	
			});
			$this.on("click",".right_icon",function(){
				if(index>0){
					$order_goods_con.animate({
						left:'+='+slideWidth
					},300);
					index--;	
				}
				
				return false;	
			});	
		});*/
		
	}
	
	init();
})