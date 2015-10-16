define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		box = require("wmbox"),
		verification = require("wmverification")
	;
	
	var init = function(){
		var $page = $("#page"),
			$set_form = $page.find(".set_form")
		;
		
		verification.addRule([
			{
				key:"samePsd",
				fun:function(){
					return !!this.val() == this.closest(".set_form").find(".new_psd").val();
					
				}	
			}
		]);
		
		verification.init($set_form,function(){
			this.setTipSkin("white1").setDirection("tr").setOffSet({
				right:20
			})	
		});
		
		bind();	
	};
	
	var bind = function(){
		var $page = $("#page"),
			$set_form = $page.find(".set_form")
		;
		
		$set_form.on("click",".set_sub",function(){
			verification.verify($set_form);
			return false;	
		});
		
	};
	
	init();
})