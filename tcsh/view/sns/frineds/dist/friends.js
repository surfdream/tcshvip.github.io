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
		var $page = $("#page"),
			$friends_con_sub = $page.find(".friends_con_sub")
		;
		$friends_con_sub.hover(function(){
			var $this = $(this);
			$this.addClass("friends_con_sub_hover");
			$this.find(".iconfont").removeClass("dis_none");
		},function(){
			var $this = $(this);
			$this.removeClass("friends_con_sub_hover");
			$this.find(".iconfont").addClass("dis_none");
		});
		
		$friends_con_sub.on("click",function(){
			var $this = $(this);
			if(!$this.hasClass("friends_con_sub_hover1")){
				$this.addClass("friends_con_sub_hover1");
				$this.find(".iconfont").addClass("iconfont_click");
			}else{
				$this.removeClass("friends_con_sub_hover1");
				$this.find(".iconfont").removeClass("iconfont_click");	
			};
			return false;	
		});
		
		$page.on("click",".setting",function(){
			return false;	
		});
		$page.on("click",".cancel",function(){
			var $this = $(this),
				_hover1 = $page.find(".friends_con_sub_hover1"),
				_id,
				postData = []
			;
			if(_hover1.length){
				_hover1.each(function(){
					_id = $(this).attr("data_id");
					postData.push(_id);	
				});
				$.ajax({
					url:"",
					type:"post",
					dataType:"json",
					data:postData,
					success:function(){},
					error:function(){
						alert("系统繁忙，请稍后再试！");			
					}	
				});		
			}else{
				alert("请先选择！");	
			}
			return false;
		});
			
	};
	
	init();
	
})