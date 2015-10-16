define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		box = require("wmbox"),
		juicer = require("juicer"),
		tips = require("wmtips"),
		page = require("wmpage"),
		inquire = require("inquire")
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
		
		//  回答编辑器
		if($page.find("#answer_editor").length){
			var editor = new UE.ui.Editor();
			editor.render("answer_editor");
			editor.ready(function(){
				 editor.setHeight(200);
				 // 发布按纽
				$page.on("click",".send_ans",function(){
					var $this = $(this);
					if(editor.getContent()){
						$.ajax({
							url:"",
							type:"get",
							dataType:"json",
							data:{},
							success:function(){},
							error:function(){
								alert("系统繁忙，请稍后再试！");	
							}	
						});	
					}else{
						alert("请填写回答内容！");
					};
					return false;	
				});
			});	
		};
		
		// 查看更多问答
		var loadmore = ('<div class="loadmore"><a href="#" class="loadmore_sub">查看更多回答>></a></div>');
		$page.find(".question_detail").append(loadmore);
		
		bind();	
	};
	
	var bind = function(){
		var $page = $("#page"),
			$friends_con_sub = $page.find(".friends_con_sub")
		;
		
		// 查看更多问答
		$page.on("click",".loadmore_sub",function(){
			var $this = $(this);
			$.ajax({
				url:"",
				type:"get",
				dataType:"json",
				success:function(){},
				error:function(){
					alert("系统繁忙，请稍后再试！");	
				}	
			});
			return false;
		});
		
		// 问题选中/取消
		$page.on("click",".setting_chk",function(){
			var $this = $(this),
				_length = $page.find(".question").length,
				_chk_len
			;
			if(!$this.hasClass("setting_chk_click")){
				$this.addClass("setting_chk_click");	
			}else{
				$this.removeClass("setting_chk_click");	
			};
			_chk_len = $page.find(".setting_chk_click").length;
			if(_chk_len == _length){
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
		
		// 问答列表删除
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
		
		//  删除某一问答
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
		
		// 编辑购物经，问答
		$page.on("click",".editor",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = inquire.AskBox({
					id:"",
					callback:function(edit){
						var $left = $this.closest(".main_left"),
							_title = $left.find(".titleCon").html(),
							_content = $left.find(".ques_content").html()
						;
						edit.setContent(_content);
						this.wmBox.find(".title").val(_title);	
					}	
				});	
			}
			_thisBox.show();
			return false;	
		});
		
		// 邀请好友回答
		var friendsHtml = juicer([
			'<div class="friends_list">',
				'<a href="#" class="friends_item" data_id="1"><img src="../public/img/head_img.jpg" />林亚权<span class="wm_ico hook12 dis_none"></span></a>',
				'<a href="#" class="friends_item" data_id="2"><img src="../public/img/head_img.jpg" />林亚权<span class="wm_ico hook12 dis_none"></span></a>',
				'<a href="#" class="friends_item" data_id="3"><img src="../public/img/head_img.jpg" />林亚权<span class="wm_ico hook12 dis_none"></span></a>',
				'<a href="#" class="friends_item" data_id="4"><img src="../public/img/head_img.jpg" />林亚权<span class="wm_ico hook12 dis_none"></span></a>',
				'<a href="#" class="friends_item" data_id="5"><img src="../public/img/head_img.jpg" />林亚权<span class="wm_ico hook12 dis_none"></span></a>',
				'<a href="#" class="friends_item" data_id="6"><img src="../public/img/head_img.jpg" />林亚权<span class="wm_ico hook12 dis_none"></span></a>',
				'<a href="#" class="friends_item" data_id="7"><img src="../public/img/head_img.jpg" />林亚权<span class="wm_ico hook12 dis_none"></span></a>',
				'<a href="#" class="friends_item" data_id="8"><img src="../public/img/head_img.jpg" />林亚权<span class="wm_ico hook12 dis_none"></span></a>',
				'<div class="wm_page"><span>共25页</span><a href="#" class="page_before page_link"> < </a><b>1</b><a href="#" class="page_link">2</a><a href="#" class="page_link">3</a><a href="#" class="page_link">4</a><a href="#" class="page_link">5</a><span class="ellipsis">……</span><a href="#" class="page_before page_link"> > </a></div>',
				'<div class="invite_btns"><a href="#" class="sure_btn">确定</a></div>',
			'</div>'
		].join(''));
		$page.on("click",".invite_ans",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = box.alert({
					boxCls:"invite_box",
					titleText:"邀请好友回答",
					content:friendsHtml.render(),
					callback:function(){
						var self = this,
							$friends_list = this.wmBox.find(".friends_list"),
							friendsData = {}
						;
						if($friends_list.length){
							$.ajax({
								url:"",
								data:{
									size:15,
									page:"1"	
								},
								type:"get",
								dataType:"jsonp",
								success:function(data){
									if(data.success && data.success.totalcount){
										var _page = page.CreateStartPage({
											url: "",
											size: 15,
											index: 1,
											sum: data.success.totalcount,
											pagekey: "page",
											front: true,
											param:{
												size:15,
												totalcount:data.success.totalcount
											},
											success:function(data){
												friendsHtml.render(data);
											},
											error:function(){
												alert("系统繁忙，请稍后再试！");
											}
										});	
										friendsHtml.render(data);
									}
								},
								error:function(){
									alert("系统繁忙，请稍后再试！");	
								}	
							});	
						};
						this.close = this.hide;
						this.wmBox.find(".wmBox-botton").remove();
						this.wmBox.find(".friends_item").on("click",function(){
							var $this = $(this);
							$this.toggleClass("friends_item_click");
							return false;	
						});
						this.wmBox.find(".sure_btn").on("click",function(){
							var $this = $(this),
								$item = $friends_list.find(".friends_item"),
								_id = $item.attr("data_id")
							;
							if($item.hasClass("friends_item_click")){
								$.ajax({
									url:"",
									type:"post",
									dataType:"json",
									data:{
										id:_id
									},
									success:function(){},
									error:function(){
										alert("系统繁忙，请稍后再试！");	
									}
								});
							}else{
								alert("请先选择好友！");		
							}
							return false;	
						});
						
						// 分页
						if (global_setting && global_setting.totalcount) {
							var _page = page.Create({
								url: global_setting.pageURL,
								size: global_setting.pageSize,
								index: global_setting.pageIndex,
								sum: global_setting.totalcount,
								pagekey: global_setting.pageKey,
								front: true
							});
						};
					}	
				});
				$this.data("thisBox",_thisBox)	
			};
			_thisBox.show();
			return false;	
		});
		
		
		
		// 回答
		$page.on("click",".answer_btn",function(){
			var $this = $(this),
				$body = $("body"),
				$Ianswer = $page.find(".Ianswer"),
				_ansHeight
			;
			_ansHeight = $Ianswer.offset().top;
			$body.animate({
				scrollTop : _ansHeight-30
			},500);
			
			return false;	
		});
		
		// 推荐商品
		var _recommend = [
			'<ul class="recommend_list">',
				'<li class="recommend_item"><label for="">链接一：</label><input type="text" class="recommend_txt" /></li>',
				'<li class="recommend_item"><label for="">链接二：</label><input type="text" class="recommend_txt" /></li>',
				'<li class="recommend_item"><label for="">链接三：</label><input type="text" class="recommend_txt" /></li>',
				'<li class="recommend_item"><label for="">链接四：</label><input type="text" class="recommend_txt" /></li>',
				'<li class="recommend_item recommend_btns"><a href="#" class="sure_btn">确定</a><a href="#" class="close">取消</a></li>',
			'</ul>'
		].join('');
		$page.on("click",".recommend",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = box.relyBox({
					rely:$this,
					boxCls:"recommend_box",
					content:_recommend,
					callback:function(){
						var self = this;
						this.close = this.hide;	
						this.wmBox.find(".wmBox-botton").remove();
						
						// 确定
						this.wmBox.find(".sure_btn").on("click",function(){
							var $this = $(this),
								_vtxt = $this.closest(".recommend_list").find(".recommend_txt"),
								postData = []
							;
							if(_vtxt.val()){
								_vtxt.each(function(){
									var _this = $(this);
									postData.push(_this.val());	
								});
								$.ajax({
									url:"",
									type:"post",
									dataType:"json",
									data:postData,
									success:function(){},
									error:function(){
										alert("系统繁忙，请稍后再试！")	
									}
								});	
							}else{
								alert("请填写链接地址！");	
							};
							 return false;
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