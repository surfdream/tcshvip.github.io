define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		box = require("wmbox"),
		juicer = require("juicer"),
		tips = require("wmtips"),
		inquire = require("inquire"),
		denounce = require("denounce"),
		page = require("wmpage"),
		comment = require("comment")
	;
	
	var init = function(){
		var $page = $("#page");
		
		// 分页
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
		var $page = $("#page");
		
		$page.find(".fav").on("click",function(){
			var $this = $(this),
				$likeCon = $page.find(".likeCon")
			;
			$likeCon.removeClass("dis_none").siblings().addClass("dis_none");
			event.preventDefault();
		});
		$page.find(".comments").on("click",function(){
			var $this = $(this),
				$comment = $page.find(".comment")
			;
			$comment.removeClass("dis_none").siblings().addClass("dis_none");
			event.preventDefault();
		});
		
		// 评论
		$page.on("click",".comments",function(){
			var $this = $(this),
				$sdi_btns_sub = $this.closest(".sdi_btns_sub"),
				$sns_data_box = $this.closest(".sns_data_box")
			;
			if($sdi_btns_sub.hasClass("sdi_btns_sub_cur")){
				$sdi_btns_sub.removeClass("sdi_btns_sub_cur");
				$sns_data_box.find(".sdi_btns_subCon").removeClass("dis_none");
				if(!$sns_data_box.find(".comment_list").length && !$sns_data_box.find(".more_btns").length){
					comment.creatCommHtml({
						appendBox:$sns_data_box.find(".comment")
					});
				};
			}else{
				$sdi_btns_sub.addClass("sdi_btns_sub_cur");
				$this.closest(".sns_data_box").find(".sdi_btns_subCon").addClass("dis_none");		
			}
			return false;	
		});
		
		// 选中/取消
		$page.on("click",".setting_chk",function(){
			var $this = $(this),
				_length = $page.find(".sns_data_item").length,
				_checked_len
			;
			if(!$this.hasClass("setting_chk_click")){
				$this.addClass("setting_chk_click");	
			}else{
				$this.removeClass("setting_chk_click");	
			};
			_checked_len = $page.find(".setting_chk_click").length;
			if(_checked_len == _length){
				$page.find(".chk_all").html("取消全选").addClass("cancel_chk_all");
			}else{
				$page.find(".chk_all").html("全选").removeClass("cancel_chk_all");	
			}
		});
		
		$page.on("click",".setting",function(){
			return false;	
		});
		// 全选
		$page.on("click",".chk_all",function(){
			var $this = $(this),
				$setting_chk = $page.find(".setting_chk")
			;
			if(!$this.hasClass("cancel_chk_all")){
				$setting_chk.addClass("setting_chk_click");
				$this.html("取消全选").addClass("cancel_chk_all");	
			}else{
				$setting_chk.removeClass("setting_chk_click");
				$this.html("全选").removeClass("cancel_chk_all");	
			}
			
			return false;	
		});
		
		// 购物经列表 删除
		$page.on("click",".delete",function(){
			var $this = $(this),
				_checked = $page.find(".setting_chk_click"),
				_id = _checked.closest(".sns_data_item").attr("data_id")
			;
			if(_checked.length){
				$.ajax({
					url:"",
					type:"post",
					data:{
						id:_id	
					},
					dataType:"json",
					success:function(){},
					error:function(){
						_checked.closest(".sns_data_item").fadeOut();	
					}	
				});
			}else{
				alert("请先选择！");		
			};
			return false;	
		});
		
		// 编辑购物经
		$page.on("click",".editor",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = inquire.AskBox({
					id:"",
					callback:function(edit){
						var $left = $this.closest(".main_left"),
							_title = $left.find(".mlh_title").html(),
							_content = $left.find(".shoppingCon").html()
						;
						edit.setContent(_content);
						this.wmBox.find(".title").val(_title);	
					}	
				});		
			};
			_thisBox.show();
			return false;	
		});
		
		// 删除某一购物经
		$page.on("click",".del_btn",function(){
			var $this = $(this),
				$head = $this.closest(".main_left_head"),
				_thisBox = $this.data("thisBox"),
				_data_id
			;
			if(!_thisBox){
				_thisBox = box.invBox({
					boxCls:"del_box",
					content:'<div class="del_box_con"><p class="del_box_content">确定删除该购物经？</p><p class="del_box_btns"><a href="#" class="del_sure">确定</a><a href="#" class="close">取消</a></p><a href="#" class="close wm_ico hook10"></a></div>',
					callback:function(){
						var self = this;
						this.close = this.hide;	
						this.wmBox.find(".del_sure").on("click",function(){
							var _this = $(this);
							_data_id = $head.find(".mlh_title").attr("data_id");
							$.ajax({
								url:"",
								type:"get",
								dataType:"json",
								data:{
									id:_data_id	
								},
								success:function(){},
								error:function(){
									alert("删除成功！");
									self.close();	
								}	
							});
							return false;	
						});
					}	
				});
				$this.data("thisBox",_thisBox);	
			};
			_thisBox.show();
			return false;	
		});
		
		// 举报
		$page.on("click",".denounce",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = 	denounce.DenounceBox({
					callback:function(){
						var self = this,
							$sns_data_con = $this.closest(".sns_data_con"),
							name,
							title,
							article_con 
						;
						name = $sns_data_con.find(".user_name").html();
						title = $sns_data_con.find(".sns_data_title").text();
						
						this.Odenounce(name);
						this.article('<h3>'+title+'</h3>');
						$sns_data_con.find(".article_main p").each(function(){
							var _this = $(this),
								_txt = _this.text()
							;
							self.article('<p>'+_txt+'</p>');	
						});
						$sns_data_con.find("img").each(function(){
							var _this = $(this);
							self.article('<p>'+'[图片]'+'</p>')	
						});
					}	
				});
				
				$this.data("thisBox",_thisBox);	
			};
			_thisBox.show();
			
			return false;	
		});
			
	};
	
	init();
	
})