define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		box = require("wmbox"),
		juicer = require("juicer"),
		tips = require("wmtips"),
		page = require("wmpage"),
		friends = require("friends")
	;
	
	var init = function(){
		var $page = $("#page");
		
		// 分页
		if (global_setting && global_setting.totalcount) {
			var _page = page.Create({
				url: global_setting.pageURL,
				element: ".wm_page",
				size: global_setting.pageSize,
				index: global_setting.pageIndex,
				sum: global_setting.totalcount,
				pagekey: global_setting.pageKey,
				param:{
					hostId:global_setting.hostId	
				},
				front: true
			});
		};
		
		bind();	
	};
	
	var bind = function(){
		var $page = $("#page"),
			$friends_con_sub = $page.find(".friends_con_sub")
		;
		$friends_con_sub.hover(function(){
			var $this = $(this);
			$this.addClass("friends_con_sub_hover");
			$this.find(".iconfont").removeClass("dis_none");
		},function(){
			var $this = $(this);
			$this.removeClass("friends_con_sub_hover");
			$this.find(".iconfont").addClass("dis_none");
		});
		
		// 选择
		$friends_con_sub.on("click",".ele",function(){
			var $this = $(this),
				_friends_con_sub = $this.closest(".friends_con_sub")
			;
			_friends_con_sub.toggleClass("friends_con_sub_hover1");
			$this.toggleClass("iconfont_click");
		});
		
		
		// 管理 - 取消关注
		$page.on("click",".setting",function(){
			return false;	
		});
		$page.on("click",".cancel",function(){
			var $this = $(this),
				_hover1 = $page.find(".friends_con_sub_hover1"),
				_id,
				postData = []
			;
			if(_hover1.length){
				_hover1.each(function(){
					_id = $(this).attr("user_id");
					postData.push(_id);	
				});
				friends.delFocus({
					ids:postData,
					success:function(){
						_hover1.fadeOut();	
					},
					error:function(){
						alert("系统繁忙，请稍后再试！");	
					}	
				});	
			}else{
				alert("请先选择！");	
			}
			return false;
		});
		
		// 切换关注好友
		$page.on("click",".change_data a",function(){
			window.location.reload();
			return false;	
		});
			
	};
	
	init();
	
})