define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		box = require("wmbox"),
		juicer = require("juicer"),
		tips = require("wmtips"),
		inquire = require("inquire"),
		denounce = require("denounce"),
		modules = require("modules"),
		page = require("wmpage"),
		comment = require("comment"),
		reshipment = require("reshipment"),
		lazyload = require("lazyload"),
		enumType = require("enumType")
	;
	
	var init = function(){
		var $page = $("#page");
		
		if($page.find(".shopping_detail").length){
			lazyload.init();
		};
		
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
		$page.find(".shopping_comments").click();
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
		
		// 列表页评论
		$page.on("click",".comments",function(){
			var $this = $(this),
				$sdi_btns_sub = $this.closest(".sdi_btns_sub"),
				$sns_data_box = $this.closest(".sns_data_box"),
				$comment=$sns_data_box.find(".comment")
			;
			
			if($sdi_btns_sub.hasClass("sdi_btns_sub_cur")){
				$sdi_btns_sub.removeClass("sdi_btns_sub_cur");
				$sns_data_box.find(".sdi_btns_subCon").removeClass("dis_none");
				comment.creatCommHtml({
					shopId:$this.closest(".sns_data_item").attr("data_id"),
					appendBox:$comment	
				});
				
			}else{
				$sdi_btns_sub.addClass("sdi_btns_sub_cur");
				$this.closest(".sns_data_box").find(".sdi_btns_subCon").addClass("dis_none");		
			}
			return false;	
		});
		// 详情页评论
		$page.on("click",".shopping_comments",function(){
			var $this = $(this),
				$sdi_btns_sub = $this.closest(".sdi_btns_sub"),
				$main_left = $this.closest(".main_left"),
				$comment = $main_left.find(".comment")
			;
			$comment.removeClass("dis_none").siblings().addClass("dis_none");
			comment.creatCommHtml({
				shopId:global_setting.shopId,
				appendBox:$comment
			});
			$page.find(".more_btns").remove();
			return false;	
		});
		
		// 转载
		$page.on("click",".turn_article",function(){
			var $this = $(this),
				$sns_item = $this.closest(".sns_data_item")
			;
			reshipment.Reshipment({
				dataShopId:$sns_item.attr("data_id"),
				dataTitle:$sns_item.find(".sns_data_title a").text(),
				dataContent:$sns_item.find(".article_main").html()
			});
			return false;	
		});
		
		// 购物经举报
		$page.on("click",".denounce",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = 	denounce.DenounceBox({
					denouceId:$this.closest(".sns_data_item").attr("data_id"),
					userId:$this.closest(".sns_data_item").attr("user_id"),
					enumType:enumType.tcsh+enumType.sns+enumType.shopping,
					callback:function(){
						var self = this,
							$sns_data_item = $this.closest(".sns_data_item"),
							name,
							title,
							article_con 
						;
						name = $sns_data_item.find(".user_name").html();
						title = $sns_data_item.find(".sns_data_title").text();
						
						this.Odenounce(name);
						this.article('<h3>'+title+'</h3>');
						$sns_data_item.find(".article_main p").each(function(){
							var _this = $(this),
								_txt = _this.text()
							;
							self.article('<p>'+_txt+'</p>');	
						});
						$sns_data_item.find("img").each(function(){
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
		
		// 评论举报
		$page.on("click",".comm_den",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = 	denounce.DenounceBox({
					denouceId:$this.closest(".self_id").attr("data_id"),
					userId:$this.siblings(".comment_man").attr("data_id"),
					enumType:enumType.tcsh+enumType.sns+enumType.shopping+enumType.comment,
					callback:function(){
						var self = this,
							$comm_con = $this.siblings(".comm_con"),
							name,
							_txt 
						;
						name = $this.siblings(".comment_man").html();
						_txt = $this.siblings(".comm_con").text();
						this.Odenounce(name);
						this.article('<p>'+_txt+'</p>');	
					}	
				});
				
				$this.data("thisBox",_thisBox);	
			};
			_thisBox.show();
			
			return false;	
		});
		
		// 选中/取消
		/*$page.on("click",".setting_chk",function(){
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
		});*/
		
		// 购物经列表 删除
		$page.on("click",".delete",function(){
			var $this = $(this),
				$item = $this.closest(".sns_data_item"),
				_shopId
			;
			_shopId = $item.attr("data_id");
			$.ajax({
				url:domains.sns+"/shop/sns/deleteshoppingdetail",
				type:"get",
				data:{
					shopId:_shopId	
				},
				dataType:"json",
				success:function(data){
					$item.fadeOut();	
				},
				error:function(){
					alert("系统繁忙，请稍后再试！");	
				}	
			});
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
								url:domains.sns+"/shop/sns/deleteshoppingdetail ",
								type:"get",
								dataType:"json",
								data:{
									shopId:global_setting.shopId
								},
								success:function(){
									alert("删除成功！");
									self.close();	
								},
								error:function(){
									alert("系统繁忙，请稍后再试！");	
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
		
		// 编辑购物经
		$page.on("click",".editor",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = inquire.EditShopping({
					titleText:"编辑购物经",
					callback:function(editor){
						var $left = $this.closest(".main_left"),
							_title = $left.find(".mlh_title").html(),
							_content = $left.find(".shoppingCon").html(),
							self = this
						;
						editor.setContent(_content);
						this.wmBox.find(".title").val(_title);
						this.wmBox.find(".sure_btn").on("click",function(){
							var _this = $(this),
								_title = _this.closest(".alert_box").find(".title")
							;
							if(_title.val() && editor.getContent()){
								modules.Iwrite({
									shopId:global_setting.shopId,
									hostId:global_setting.hostId,
									content:lazyload.decoding(editor.getContent()),
									title:_title.val(),
									img:$(editor.getContent()).find("img:first").attr("src"),
									success:function(data){
										self.hide();
										window.location.reload();		
									},
									error:function(){
										alert("系统繁忙，请稍后再试！");	
									}	
								});	
							}else{
								alert("请完善填写！");	
							}
							return false;	
						});		
					}	
				});		
			};
			_thisBox.show();
			return false;	
		});
		
	};
	
	init();
	
})