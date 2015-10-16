define(function (require, exports, module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js')
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js')
	;
	require("http://s.tcsh.me/tcsh/view/sns/public/wm_reshipment/css/style.css");
	
	
	// 转载
	_reshipment = function(op){
		op=$.extend({},op);
		var _box= box.invBox({
			boxCls:"reship_box",
			content:'<div class="reship_con"><span class="wm_ico loading32_32_1"></span>转载中......</div>',
			callback:function(){}	
		});
		$.ajax({
			url:domains.sns+"/shop/sns/replyshoppingdetail",
			type:"get",
			data:{
				shopId:op.dataShopId,
				title:op.dataTitle,
				content:op.dataContent	
			},
			dataType:"json",
			success:function(data){
				var $con = $('<div class="reship_con"><p class="reship_tip"><span class="wm_ico hook8"></span>转载成功！</p><div class="reship_btns"><a href="#" class="stay">继续浏览</a><a href="http://sns.tcsh.me/sns/shoppingdetaillist?hostId='+global_setting.hostId+'" class="view" target="_blank">查看详情</a></div><a href="#" class="wm_ico fork7 close"></a></div>');
				_box.setCon($con);
				_box.close = _box.hide;
				$con.on("click",".stay",function(){
					var $this = $(this);
					_box.close();
					return false;	
				});
				$con.on("click",".view",function(){
					var $this = $(this);
					
					return false;	
				})
			},
			error:function(){
				$(".reship_con").replaceWith('<div class="reship_con"><span class="iconfont">&#xe609;</span>系统繁忙，请稍后再试！</div>');
			}	
		});
	};
	
	
	// 转载
	exports.Reshipment = function(op){
		lib.verificationLogin(function(){
			return _reshipment(op);	
		});		
	};
});