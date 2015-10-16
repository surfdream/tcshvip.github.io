define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		box = require("wmbox"),
		juicer = require("juicer"),
		tips = require("wmtips"),
		page = require("wmpage")
	;
	
	var init = function(){
		var $page = $("#page");
		bind();	
	};
	
	var bind = function(){
		var $page = $("#page")
		;
		
		$page.on("click",".hook11",function(){
			var $this = $(this),
				_hook12_len,
				_item_len
			;
			$this.toggleClass("hook12");
			_hook12_len = $page.find(".hook12").length;
			_item_len = $page.find(".personal_item").length;
			if(_hook12_len == _item_len){
				$page.find(".chk_all").html("取消全选").addClass("cancel_chk_all");
			}else{
				$page.find(".chk_all").html("全选").removeClass("cancel_chk_all");	
			}
			return false;	
		});
		
		
		$page.on("click",".setting",function(){
			return false;	
		});
		// 全选
		$page.on("click",".chk_all",function(){
			var $this = $(this),
				$hook = $page.find(".hook11")
			;
			if(!$this.hasClass("cancel_chk_all")){
				$hook.addClass("hook12");
				$this.html("取消全选").addClass("cancel_chk_all");	
			}else{
				$hook.removeClass("hook12");
				$this.html("全选").removeClass("cancel_chk_all");	
			}
			return false;	
		});
		
		
		// 删除
		$page.on("click",".delete",function(){
			var $this = $(this),
				$left = $this.closest(".main_left"),
				_checked = $left.find(".hook12"),
				_id = _checked.closest(".personal_item").attr("data_id")
			;
			if(_checked.length){
				$.ajax({
					url:"",
					type:"post",
					data:{
						id:_id	
					},
					dataType:"json",
					success:function(){},
					error:function(){
						_checked.closest(".personal_item").fadeOut();	
					}	
				});
			}else{
				alert("请先选择！");		
			};
			return false;	
		});
			
	};
	
	init();
	
})