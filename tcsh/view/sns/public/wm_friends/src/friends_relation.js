define(function (require, exports, module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js')
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
		modules = require('http://s.tcsh.me/tcsh/view/sns/public/wm_sns_juicer/dist/modules.js'),
		lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js'
)	
	;
	require("http://s.tcsh.me/tcsh/view/sns/public/wm_friends/css/style.css");
	// 关注
	_focus = function(op){ 
		$.ajax({
			url:domains.sns+"/friends/friend/attention",
			type:"get",
			dataType:"json",
			data:{
				attentionId:op.focus_id,
				groupId:0
			},
			success:function(data){
				typeof op.success === "function" && op.success(data);
			},
			error:function(){
				typeof op.error === "function" && op.error();
			}
		});
	};
	
	// 取消关注
	_delFocus = function(op){
		$.ajax({
			url:domains.sns+"/friends/friend/cancel",
			type:"get",
			dataType:"json",
			data:{
				ids:JSON.stringify(op.ids)   // 数组
			},
			success:function(data){
				typeof op.success === "function" && op.success(data);
			},
			error:function(){
				typeof op.error === "function" && op.error();
			}
		});	
	};
	
	// 邀请好友回答
	_invite = function(op){
		$.ajax({
			url:domains.api2+"/friends/invite.json",
			type:"get",
			data:op.data,
			dataType:"jsonp",
			success:function(data){
				typeof op.success === "function" && op.success(data);	
			},
			error:function(){
				typeof op.error === "function" && op.error();	
			}
		});
	};
			
		
	// 关注
	exports.Focus = function(op){
		lib.verificationLogin(function(){
			_focus(op);
		});	
	};
	
	// 取消关注
	exports.delFocus = function(op){
		lib.verificationLogin(function(){
			_delFocus(op);
		});	
	};
	
	// 邀请好友回答
	exports.Invite = function(op){
		lib.verificationLogin(function(){
			_invite(op);	
		});	
	};
	
});