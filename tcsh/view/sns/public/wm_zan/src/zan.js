define(function (require, exports, module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js')
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
		lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js'
)	
	;
	// 赞
	var Zan = function(op){
		var $this = $(op.cls) || op.cls,
			$iconfont = $this.find(".iconfont"),
			_vnum = $this.find(".zan_num").text(),
			$zan_people = $this.closest(".zan_people"),
			$zp_name = $zan_people.find(".zan_people_name"),
			user_name
		;
		user_name = op.user_name;
		$iconfont.toggleClass("already_zan");
		if($iconfont.hasClass("already_zan")){
			_vnum++;
			$this.find(".zan_num").text(_vnum);
			$zp_name.prepend('<a href="#" class="zan_people_item" data_id="'+op.user_id+'">'+user_name+'</a>');
			$.ajax({
				url:domains.sns+"/answer_question/praise/click",
				type:"get",
				dataType:"jsonp",
				data:{
					answerId:op.answer_id,
					userId:op.user_id,
					remark:1    // 赞 
				},
				success:function(){},
				error:function(){
					alert("系统繁忙，请稍后再试！");	
				}	
			});
		}else{
			_vnum--;
			$this.find(".zan_num").text(_vnum);
			$zp_name.find(".zan_people_item[data_id="+op.user_id+"]").remove();
			$.ajax({
				url:domains.sns+"/answer_question/praise/click",
				type:"get",
				dataType:"jsonp",
				data:{
					answerId:op.answer_id,
					userId:op.user_id,
					remark:0   // 取消赞
				},
				success:function(){},
				error:function(){
					alert("系统繁忙，请稍后再试！");	
				}	
			});
		}
	};
	
	exports.Zan = function(op){
		lib.verificationLogin(function(){
			Zan(op);
		});	
	};
});