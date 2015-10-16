// JavaScript Document

define(function (require, exports, module) {
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
		var $ = require("jquery"),
			box=require("wmbox"),
			fwxy=require("fwxy"),
			dsxy=require("dsxy")
		;
		
		var $open_shop=$(".open_shop");
		$open_shop.on("click",function(){
			var $this=$(this),
				_thisbox=$this.data("thisbox");
				
			if(!_thisbox){
				_thisbox=fwxy.show();
				$this.data("thisbox",_thisbox);
			}
			_thisbox.show();
			return false;
		})
		
		var $sever_xy=$(".sever_xy");
		$sever_xy.on("click",function(){
			var $this=$(this),
				_thisbox=$this.data("thisbox");
				
			if(!_thisbox){
				_thisbox=dsxy.show(function (){
					_thisbox.hide();
				});
				$this.data("thisbox",_thisbox);
			}
			_thisbox.show();
			return false;
		})
})