define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		box = require("wmbox"),
		upload = require("wmupload"),
		showartwork = require("wmshowartwork")
		page = require("wmpage")
	;
	require('core-css');
	require('theme-css');
	require('datepicker-css');
	require('jquery.ui.core')($);
	require('jquery.ui.widget')($);
	require('jquery.ui.datepicker')($);
	require('datepicker-zh-CN')($);
	
	var init = function(){
		var $page = $("#page");
		
		if (global_setting && global_setting.totalcount) {
			var _page = page.Create({
				url: global_setting.pageURL,
				element: ".order_page",
				size: global_setting.pageSize,
				index: global_setting.pageIndex,
				sum: global_setting.totalcount,
				pagekey: global_setting.pageKey,
				front: true
			});
		};
		
		bind();	
	};
	
	var bind = function(){
		var $page = $("#page")
		;
		
		/* 放大图片 */
		$page.find(".photo_infor a").hover(function(){
			var $this = $(this);
			$this.find(".big_photo").addClass("big_photo_hover");	
		},function(){
			var $this = $(this);
			$this.find(".big_photo").removeClass("big_photo_hover");	
		});
		$page.find(".photo_infor").on("click","a",function(){
			var $this = $(this),
				_showartwork = $this.data("showartwork")
			;
			if(!_showartwork){
				_showartwork = showartwork.create($this.find("img").attr("src"));
				$this.data("showartwork",_showartwork);	
			};
			_showartwork.show();
			
			return false;
		});
		
		/* 审核通过 */
		$page.on("click",".pass",function(){
			var $this = $(this)
				_status = $this.attr("data_status"),
				_id = $page.find(".account_infor").attr("data_id")
			;
			$.ajax({
			    url:domains.api2+"/user/checkcard.json",
				type:"get",
				dataType:"jsonp",
				data:{
					status:_status,
					id:_id	
				},
				success:function(){
					alert("审核通过！");
					window.location.reload();	
				},
				error:function(){
					alert("系统繁忙，请稍后再试！");	
				}	
			});
			return false;	
		});
		
		/* 审核不通过 */
		$page.on("click",".nopass",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox"),
				_status = $this.attr("data_status"),
				_id = $page.find(".account_infor").attr("data_id")
			;
			if(!_thisBox){
				_thisBox = box.invBox({
					boxCls:"nopass_box",
					content:'<div class="nopass_reason"><h3>审核未通过原因</h3><textarea name="" id="" cols="30" rows="10" class="reason_con"></textarea><p><a href="#" class="sure_btn">确定</a><a href="#" class="close">取消</a></p><a href="#" class="wm_ico fork7 close"></a></div>',
					callback:function(){
						var self = this;
						this.close = this.hide;
						this.wmBox.find(".sure_btn").on("click",function(){
							var $this = $(this),
								vreason = encodeURIComponent($this.closest(".nopass_reason").find(".reason_con").val())
								
							;
							if(vreason){
								$.ajax({
								    url:domains.api2+"/user/checkcard.json",
									type:"get",
									dataType:"jsonp",
									data:{
										reason:vreason,
										status:_status,
										id:_id
									},
									success:function(data){
										if(data.success){
											self.close();
											window.location.reload();	
										}else{
											alert(data.erroe||"提交失败！")	
										}
									},
									error:function(){
										alert("系统繁忙，请稍后再试！")	
									}
								});	
							}else{
								alert("请填写未通过原因！")	
							}
							
							return false;	
						});
					}	
				});
				$this.data("thisBox",_thisBox);	
			};
			_thisBox.show();
			return false;	
		});
		
		/* 日历插件  */
		$page.find(".time_date").datepicker({
            onClose: function (data, e) { if (!(/\d{4}-\d{2}-\d{2}/.test(data))) { e.input.val(''); } }
        });
			
	};
	
	init();
})