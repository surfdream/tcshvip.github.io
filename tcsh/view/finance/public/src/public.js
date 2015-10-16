define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        nav = require("http://s.tcsh.me/tcsh/view/ago/public/wm_nav_v1.0/dist/nav.js"),
        lib = require("http://s.tcsh.me/tcsh/model/lib/dist/lib.js"),
        tips = require("http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js"),
        compatible = require('http://s.tcsh.me/tcsh/model/wmcompatible/dist/wmcompatible.js')
	;
	
	var init = function(){
        bind();
        compatible.placeholder();
	};
	
	var bind = function(){
		
		var $page = $("#page");
		
		$page.on("click",".derive_btn",function(){
			var $this = $(this),
				$fina_form = $page.find(".fina_form"),
				_action = $fina_form.attr("action"),
				_formtarget = $this.attr("formtarget"),
				_daction = $this.attr("data_form_action")
			;
			
			/*if(_formtarget){
				$fina_form.attr("target",_formtarget);	
			}*/
			
			_formtarget&&$fina_form.attr("target",_formtarget)
			
			$fina_form.attr("action",_daction);
			$page.find(".cash_sub1").click();
			
			if(_formtarget){
				$fina_form.attr("action",_action);
				$fina_form.removeAttr("target");
			}
			
		});	
		
	};
	
	init();
	
})
