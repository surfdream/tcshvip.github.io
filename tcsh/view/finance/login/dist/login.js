define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		verification = require("wmverification"),
		page = require("wmpage"),
		compatible = require('http://s.tcsh.me/tcsh/model/wmcompatible/dist/wmcompatible.js')
	;	

	
	var init = function(){
		var $fina_login_form=$(".fina_login_form")
			;
			
			/*
			 * 验证提示信息
			 */	
			verification.init($fina_login_form,function(){
				this.setTipSkin("white1").setDirection("rt").setOffSet({
					left:15,
					top:10	
				});		
			})
			
			verification.addRule([
				{
					key:"yzm",
					fun:function(){
						return !!$.trim( this.find("#fina_login_yzm").val()).length;	
					}
				}
			]);
			
		
		bind();	
	};
	var bind = function(){
		var $fina_login_form=$(".fina_login_form"),
			$page = $("#page")
		;
		$fina_login_form.on("click",":submit",function(){
			
			return verification.verify($fina_login_form);
		});
		
	};
	init();
})