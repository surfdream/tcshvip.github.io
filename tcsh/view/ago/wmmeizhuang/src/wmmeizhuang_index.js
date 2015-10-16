define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		forimg = require("wmforimg"),
		wmas = require("wmas")
	;
	
	var init = function(){
		var $page = $("#page");
		wmas.init({
			callback:[],
			endCallback:function(){
				if($page.find(".SlideBox").length){
					m = parseInt(Math.random()*2000)+3000;
					new forimg.Slide({
						forImgBoxEle:".SlideBox",
						forImgBoxListEle:".Slide_list",
						forImgItemEle:".slide_item",
						interval:m,
						callback:function(){
							this.automatic(true);
							var self = this,
								i = this.forImgItem.length,
								$slide_nav = this.forImgBox.find(".slide_nav"),
								indexItem = []
							;
							while(i--){
								indexItem[i] = '<span class="now"></span>';
							}
							$slide_nav.empty().append(indexItem.join(''));
							this.indexs = $slide_nav.find(".now");
							this.indexs.click(function(){
								self.setIndex(this);	
							});
								
						}
					});	
				};
						
				$(".floor").each(function(){
					var $this=$(this);	
					
					m = parseInt(Math.random()*2000)+3000;
					new forimg.Fade({
						forImgBoxEle: $this.find(".SlideBox1"),
						forImgBoxListEle:".Slide_list1",
						forImgItemEle:".slide_item1",
						interval:m,
						callback:function(){
							this.automatic(true);
							var self = this,
								i = this.forImgItem.length,
								$slide_nav = this.forImgBox.find(".slide_nav"),
								indexItem = []
							;
							while(i--){
								indexItem[i] = '<span class="now">'+(i+1)+'</span>';	
							};
							$slide_nav.empty().append(indexItem.join(''));
							this.indexs = $slide_nav.find(".now");
							this.indexs.click(function(){
								self.setIndex(this);	
							});
								
						}
					});
				});	
			}
		});
		bind();	
	};
	
	var bind = function(){
		
		var $page = $("#page"),
			m
		;
		// 左边导航选择
		$page.find(".meizhuang_kinds_item").each(function(index){
			
			var $this = $(this);
			
			$this.hover(function(){
				$this.closest(".meizhuang_kinds_list").addClass("meizhuang_kinds_list_hover");
				$this.find(".meizhuang_kinds_panel").css("display","block");
			},function(){
				$this.closest(".meizhuang_kinds_list").removeClass("meizhuang_kinds_list_hover");	
				$this.find(".meizhuang_kinds_panel").css("display","none");
			});
				
		});
		
		
		
		
		
		
		
		
	};
	
	init();
		
})