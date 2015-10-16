define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
		box = require("http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js"),
		juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
		tips = require("http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js"),
		verification = require("http://s.tcsh.me/tcsh/model/wmverification/dist/wmverification.js"
)
	;
	
		// 举报
		var jbHtml = [
			'<div class="denounce_con">',
				'<ul>',
					'<li class="denounce_item"><b>举报证据：</b></li>',
					'<li class="denounce_item denounce_evidence"></li>',
					'<li class="denounce_item"><b>举报对象：</b><span class="denounce_who"></span></li>',
					'<li class="denounce_item"><b>举报类型：</b></li>',
					'<li class="denounce_item">',
						'<input type="radio" name="radio" class="denounce_reason" /><label for="">色情淫秽</label>',
						'<input type="radio" name="radio" class="denounce_reason" /><label for="">骚扰谩骂</label>',
						'<input type="radio" name="radio" class="denounce_reason" /><label for="">广告欺诈</label>',
						'<input type="radio" name="radio" class="denounce_reason" /><label for="">反动</label>',
						'<input type="radio" name="radio" class="denounce_reason" checked /><label for="">其他</label>',
					'</li>',
					'<li class="denounce_item denounce_intr"><b>举报说明（可选）：</b></li>',
					'<li class="denounce_item"><input type="text" class="denounce_txt" placeholder="描述你要举报的其他理由" /></li>',
					'<li class="denounce_item denounce_btns"><a href="#" class="denounce_sure">确定</a><a href="#" class="close">取消</a></li>',
				'</ul>',
			'</div>'
		].join('');
		
		var denounceBox = function(op){
			return box.alert({
				boxCls:"denounce_box",
				titleText:"举报",
				content:jbHtml,
				callback:function(){
					var self = this
						$denounce_con = this.wmBox.find(".denounce_con")
					;
					this.close = this.hide;
					this.wmBox.find(".wmBox-botton").remove();
					
					this.Odenounce = function(name){
						$denounce_con.find(".denounce_who").append(name);	
					};	
					this.article = function(content){
						self.wmBox.find(".denounce_evidence").append(content);	
					};
					
					$denounce_con.find(".denounce_sure").on("click",function(){
						var $this = $(this),
							_arr = {}
						;
						_arr.denounce = encodeURIComponent($denounce_con.find(".denounce_evidence").html());
						_arr.name = encodeURIComponent($denounce_con.find(".denounce_who").html());
						_arr.style =  encodeURIComponent($denounce_con.find("input[checked]").next("label").html());
						_arr.explain = encodeURIComponent($denounce_con.find(".denounce_txt").val());
						$.ajax({
							url:"",
							type:"post",
							dataType:"json",
							data:_arr,
							success:function(){},
							error:function(){
								alert("系统繁忙，请稍后再试！")	
							}	
						});
						return false;	
					});
					typeof op.callback === "function" && op.callback.call(self);
				}		
			});	
		};
	
	exports.DenounceBox = function(op){
		return denounceBox(op);	
	}	
})