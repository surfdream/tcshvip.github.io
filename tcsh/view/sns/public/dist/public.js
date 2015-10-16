define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
		box = require("http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js"),
		juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
		tips = require("http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js"),
		page = require("http://s.tcsh.me/tcsh/model/wmpage/dist/wmpage.js"),
		forimg = require("http://s.tcsh.me/tcsh/model/wmforimg/dist/forimg.js"),
		verification = require("http://s.tcsh.me/tcsh/model/wmverification/dist/wmverification.js"
),
		top_data = require('http://s.tcsh.me/tcsh/view/ago/public/wm_top_data/dist/top_data.js'),
		module_juicer = require("http://s.tcsh.me/tcsh/view/sns/public/wm_sns_juicer/dist/module_juicer.js"),
		module = require("http://s.tcsh.me/tcsh/view/sns/public/wm_sns_juicer/dist/module.js"),
		inquire = require('http://s.tcsh.me/tcsh/view/sns/public/wm_inquire/dist/inquire.js')
	;
	var editor = new UE.ui.Editor();
	var init = function(){
		var $page = $("#page"),
			$main_right = $page.find(".main_right")
		;
		
		top_data();
		
		module_juicer.ownerHtml(function(_html){
			$page.find(".owner_content").empty().append(_html);
		});
		
		global_setting.isOtherShare && module_juicer.othershareHtml(function(_html){
			$main_right.append(_html);		
		})
		global_setting.isDiscover && module_juicer.discoverHtml(function(_html){

			$main_right.append(_html);
			
		});
		module_juicer.handpickHtml(function(_html){
			$main_right.append(_html);
			// 精选图片滚动
			if($page.find(".slide").length){
				new forimg.Slide({
					forImgBoxEle:'.handpick',
					forImgBoxListEle:".slideCon",
					forImgItemEle:".slide_item",
					callback:function(){
						var _this = this,
							i = this.forImgItem.length,
							$handpick = this.forImgBox.closest(".handpick"),
							$now = $handpick.find(".handpick_btn .now")
						;
						$handpick.find(".img_num").empty().append(i);
						if(i <= 1){
							$handpick.find(".iconfont").css("visibility","hidden");	 
						}else{
							$handpick.find(".left").on("click",function(){
								_this.next(function(){
									var j=	$now.html()-0+1;
									$now.html(j>i?1:j);
								});
								return false;	
							});	
							$handpick.find(".right").on("click",function(){
								_this.prev(function(){
									var j=	$now.html()-0-1;
									$now.html(j<1?3:j);	
								});
								return false;	
							});	
							_this.automatic(true,function(){
								var j=	$now.html()-0+1;
								$now.html(j>i?1:j);
							});
						};
						
					}
				});
			};	
		});
		
		global_setting.isVisitor && module_juicer.visitorHtml(function(_html){
			$main_right.append(_html);	
		});
		
		// 发现
		if($page.find(".discover").length){
			module.discover({
				success:function(){},
				error:function(){
						
				}
			});	
		};	

		// 最近访客
		if($page.find(".visitor").length){
			module.visitor({
				success:function(){},
				error:function(){}	
			});
		};
		
		
		bind();	
		
	};
	
	var bind = function(){
		var $page = $("#page")
		;
		
		// for IE6-7
		if($.browser.msie&&($.browser.version == '6.0' || $.browser.version == '7.0')){
			//  头部导航下拉
			$page.find(".sns_head_item").hover(function(){
				var $this = $(this);
				$this.siblings(".sns_head_nav").addClass("sns_head_nav_hover");	
			},function(){
				var $this = $(this);	
				$this.siblings(".sns_head_nav").removeClass("sns_head_nav_hover");	
			});	
			
			// 我喜欢 下拉
			$page.find(".answer_Ilike").hover(function(){
				var $this = $(this);
				$this.find(".anl_con").addClass("anl_con_hover");
			},function(){
				var $this = $(this);	
				$this.find(".anl_con").removeClass("anl_con_hover");
			});
		};
		
		// 关注
		$page.on("click",".focus",function(){
			var $this = $(this);
			if(!$this.hasClass("del_focus")){
				$this.addClass("del_focus").text("取消关注");	
			}else{
				$this.removeClass("del_focus").text("+ 关注");	
			}
			return false;	
		});
		
		
			
		
		
				
		// 向他提问
		var _askHtml = [
			'<div class="alert_box">',
				'<h3 class="alert_box_title">向<span class="session_name">愤怒的屌死</span>提问</h3>',
				'<div class="askTitle"><label for="write_title">标题：</label><input type="text" id="write_title" class="title" /></div>',
				'<div id="myEditor" class="myEditor"></div>',
				'<div class="wmBox_btns">',
					'<a href="#" class="sure_btn">提问</a><a href="#" class="close">取消</a>',
				'</div>',
			'</div>'
		].join('');
		$page.on("click",".ask_btn",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = box.alert({
					boxCls:"ask_box",
					titleText:"提问",
					content:_askHtml,
					callback:function(){
						var self = this,
							_name = $this.closest(".owner").find(".owner_name_con").html()
						;
						this.close = this.hide;
						this.wmBox.find(".wmBox-botton").remove();
						this.wmBox.find(".session_name").empty().append(_name);
						editor.render("myEditor");	
						editor.ready(function(){
							 editor.setHeight(200);
						});	
						
						// 提问按钮
						this.wmBox.find(".sure_btn").on("click",function(){
							var $this = $(this),
								_title = $this.closest(".alert_box").find(".title")
							;
							if(_title.val() && editor.getContent()){
								module.ask({
									name:"",
									title:"",
									question:"",
									success:function(){},
									error:function(){
										alert("系统繁忙，请稍后再试！");
									}	
								});	
							}else{
								alert("请完善填写！");
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
		
		// 编写购物经
		var _writeHtml = [
			'<div class="alert_box">',
				'<div class="askTitle"><label for="write_title">标题：</label><input type="text" id="write_title" class="title" /></div>',
				'<div id="writeEditor" class="myEditor"></div>',
				'<div class="wmBox_btns">',
					'<a href="#" class="sure_btn">确定</a><a href="#" class="close">取消</a>',
				'</div>',
			'</div>'
		].join('');
		$page.on("click",".write_shop",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = box.alert({
					boxCls:"write_box",
					titleText:"编写购物经",
					content:_writeHtml,
					callback:function(){
						var self = this;
						this.close = this.hide;
						this.wmBox.find(".wmBox-botton").remove();
						editor.render("writeEditor");	
						editor.ready(function(){
							 editor.setHeight(400);
						});	
						this.wmBox.find(".sure_btn").on("click",function(){
							var _this = $(this),
								_title = _this.closest(".alert_box").find(".title")
							;
							if(_title.val() && editor.getContent()){
								module.Iwrite({
									title:"",
									writeCon:"",
									success:function(){},
									error:function(){
										alert("系统繁忙，请稍后再试！")	
									}	
								});	
							}else{
								alert("请完善填写！");		
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
		
		// 我要提问
		$page.on("click",".Iask",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = inquire.AskBox();
				$this.data("thisBox",_thisBox);	
			}
			_thisBox.show();
			return false;	
		});
		
		// 私信
		/*var _letterHtml = [
			'<div class="alert_box letterCon">',
				'<h3 class="alert_box_title letter_title">我和<span class="session_name">愤怒的屌死</span>的对话</h3>',
				'<div id="myEditor1" class="myEditor"></div>',
				'<div class="wmBox_btns">',
					'<a href="#" class="sure_btn">发送</a><a href="#" class="close">取消</a>',
				'</div>',
			'</div>'
		].join('');
		$page.on("click",".letter_btn",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = box.alert({
					boxCls:"letter_box",
					titleText:"编写站内信",
					content:_letterHtml,
					callback:function(){
						var self = this;
						this.close = this.hide;	
						this.wmBox.find(".wmBox-botton").remove();
						editor.render("myEditor1");	
						_baidu();
						this.wmBox.find(".sure_btn").on("click",function(){
							if(editor.getContent()){
								module.letter({
									name:"",
									talkContent:"",
									success:function(){},
									error:function(){
										alert("系统繁忙，请稍后再试！");	
									}	
								});	
							}else{
								alert("请输入想要说的话！");	
							};
							
							return false;	
						});
					}	
				});
				$this.data("thisBox",_thisBox);	
			};
			_thisBox.show();
			return false;	
		});*/
		
		// 发现
		$page.on("click",".change_dis",function(){
			module.discover({
				success:function(){},
				error:function(){
					alert("加载中……请稍后！");	
				}
			});	
			
			return false;	
		});
		
		
		
		
		
		// 喜欢
		$page.on("click",".like",function(){
			var $this = $(this);
			if($this.attr("class").indexOf("like_click") > 0){
				$this.removeClass("like_click");
			}else{
				$this.addClass("like_click");	
			};
			return false;	
		});
		
		// 赞
		$page.on("click",".zan",function(){
			var $this = $(this),
				$iconfont = $this.find(".iconfont"),
				_id = $this.closest(".sns_data_con").find(".question_title").attr("data_id")
			;
			$iconfont.toggleClass("already_zan");
			if($iconfont.hasClass("already_zan")){
				$.ajax({
					url:"",
					type:"get",
					dataType:"json",
					data:{
						id:_id	
					},
					success:function(){},
					error:function(){
						alert("系统繁忙，请稍后再试！");	
					}	
				});	
			};
			return false;	
		});
		
		// 回复
		$page.find(".reply_comm").on("click",function(){
			var $this = $(this)
				$comment_item = $this.closest(".comment_item"),
				_commenter = $comment_item.find(".commenter").text()
			;
			$comment_item.find(".reply_con").toggleClass("dis_none");
			$comment_item.find(".reply_txt").val("回复"+_commenter+":");
			return false;	
		});
		$page.find(".reply_send a").on("click",function(){
			var $this = $(this),
				_vreply
			;
			_vreply = encodeURIComponent($this.closest(".reply_con").find(".reply_txt").val());
			$.ajax({
				url:"",
				type:"post",
				dataType:"json",
				data:_vreply,
				success:function(){},
				error:function(){
					alert("系统繁忙，请稍后再试！");	
				}	
			});
			return false;	
		});
		
		
		
	};
	
	init();
		
})