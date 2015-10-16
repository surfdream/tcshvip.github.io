define(function (require, exports, module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js')
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
		module = require('http://s.tcsh.me/tcsh/view/sns/public/wm_sns_juicer/dist/module.js')	
	;
	// 提问
	var Iask = [
		'<div class="alert_box">',
			'<div class="askTitle"><label for="write_title">标题：</label><input type="text" id="write_title" class="title" /></div>',
			'<div id="myEditor" class="myEditor"></div>',
			'<div class="wmBox_btns">',
				'<a href="#" class="sure_btn">提问</a><a href="#" class="close">取消</a>',
			'</div>',
		'</div>'
	].join('');
	var IaskBox = function(op){
		op=$.extend({},op);
		return	box.alert({
			boxCls:"Iask_box",
			titleText:"我要提问",
			content:Iask,
			basezIndex:901,
			callback:function(){
				var editor = new UE.ui.Editor(),
					 _id="myEditor" + parseInt(Math.random()*333+1),
					 self = this
				;
				this.close = this.hide;
				this.wmBox.find(".wmBox-botton").remove();
				this.wmBox.find("#myEditor").attr("id",_id);
				this.wmBox.find(".sure_btn").on("click",function(){
					var _this = $(this),
						_title = _this.closest(".alert_box").find(".title")
					;
					if(_title.val() && editor.getContent()){
						module.Iask({
							id:op.id,
							title:"",
							question:"",
							success:function(){},
							error:function(){
								alert("系统繁忙，请稍后再试！");	
							}	
						});	
					}else{
						alert("请完善填写！");	
					}
					return false;	
				});	
				
				editor.render(_id);
				editor.ready(function(){
					 editor.setHeight(200);
					 typeof op.callback === "function" && op.callback.call(self,editor);
					 self.position();
				});
			}	
		});	
	};
	
	exports.AskBox = function(op){
		return IaskBox(op);	
	};
});