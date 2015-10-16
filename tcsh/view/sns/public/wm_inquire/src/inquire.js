define(function (require, exports, module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js')
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js')
	;
	require("http://s.tcsh.me/tcsh/view/sns/public/wm_inquire/css/style.css");
	// 提问 && 购物经
	var _askHtml = [
		'<div class="alert_box">',
			'<div class="askTitle"><span class="tit_box"><label for="write_title">标题：</label><input type="text" id="write_title" class="title" /></span><span class="inte_box"><label>积分：</label><input type="text" class="integral" value="0" /></span></div>',
			'<div id="myEditor" class="myEditor"></div>',
			'<div class="wmBox_btns">',
				'<a href="#" class="sure_btn">提问</a><a href="#" class="close">取消</a>',
			'</div>',
		'</div>'
	].join('');
	_askBox = function(op){
		op=$.extend({},op);
		return	box.alert({
			boxCls:"Iask_box",
			titleText:op.titleText,
			content:_askHtml,
			basezIndex:901,
			callback:function(){
				var editor = new UE.ui.Editor(),
					 _id="myEditor" + parseInt(Math.random()*333+1),
					 self = this
				;
				this.close = this.hide;
				this.wmBox.find(".wmBox-botton").remove();
				this.wmBox.find("#myEditor").attr("id",_id);
				
				editor.render(_id);
				editor.ready(function(){
					 editor.setHeight(380);
					 typeof op.callback === "function" && op.callback.call(self,editor);
					 self.position();
				});
			}	
		});	
	};
	
	
	var _shoppingHtml = [
		'<div class="alert_box">',
			'<div class="shoppingTitle"><span class="tit_box"><label for="write_title">标题：</label><input type="text" id="write_title" class="title" /></span></div>',
			'<div id="myEditor" class="myEditor"></div>',
			'<div class="wmBox_btns">',
				'<a href="#" class="sure_btn">确定</a><a href="#" class="close">取消</a>',
			'</div>',
		'</div>'
	].join('');
	_shoppingBox = function(op){
		op=$.extend({},op);
		return	box.alert({
			boxCls:"Iask_box",
			titleText:op.titleText,
			content:_shoppingHtml,
			basezIndex:901,
			callback:function(){
				var editor = new UE.ui.Editor(),
					 _id="myEditor" + parseInt(Math.random()*333+1),
					 self = this
				;
				this.close = this.hide;
				this.wmBox.find(".wmBox-botton").remove();
				this.wmBox.find("#myEditor").attr("id",_id);
				
				editor.render(_id);
				editor.ready(function(){
					 editor.setHeight(380);
					 typeof op.callback === "function" && op.callback.call(self,editor);
					 self.position();
				});
			}	
		});	
	};
	
	// 提问
	exports.EditAsk = function(op){
		return _askBox(op);	
	};
	
	// 购物经
	exports.EditShopping = function(op){
		return _shoppingBox(op);	
	};
});