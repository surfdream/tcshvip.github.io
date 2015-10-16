define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
		box = require("http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js"),
		juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
		tips = require("http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js"),
		verification = require("http://s.tcsh.me/tcsh/model/wmverification/dist/wmverification.js"),
		lib = require("http://s.tcsh.me/tcsh/model/lib/dist/lib.js")
	;
		require("http://s.tcsh.me/tcsh/view/sns/public/wm_comment/css/style.css#");
		// 评论
		var _commHtml = [
			'<div class="onbox">',
				'<p class="comment_detail">',
					'<textarea name="" id="" cols="30" rows="10" class="comment_con"></textarea>',
					'<a href="#" class="comment_btn" title="快捷键 Ctrl+Enter">发布</a>',
				'</p>',
				'<div class="commentCon"><p class="loading"><span class="wm_ico loading18_18_1"></span>加载中......</p></div>',
			'</div>'
		].join('');
		
		var comment_list_html=juicer([
		'<ul class="comment_list">',
			'{@each comment_data as item}',
			'<li class="comment_item self_id" data_id="${item.id}">',
				'<span class="comm_row"><a href="#"><img src="${item.headUrl}" /></a><a href="#" class="comment_man" data_id="${item.userId}">${item.username}</a><span class="comm_con">${item.commentContent}</span><a href="#" class="comm_den">举报 |</a><span class="date">${item.time}</span><a href="#" class="reply iconfont">&#xf0132;</a></span>',
				'<ul class="rep_list">',
					'{@each item.reply_msg as msg}',
					'<li class="rep_item self_id comm_row" data_id="${msg.id}">',
						'<a href="#"><img src="${msg.headUrl}" /></a><a href="#" class="comment_man" data_id="${msg.userId2}">${msg.username2}</a>回复<a href="#" data_id="${msg.userId1}">${msg.username1}</a><span class="comm_con">${msg.commentContent}</span><a href="#" class="comm_den">举报 |</a><span class="date">${msg.time}</span><a href="#" class="reply iconfont">&#xf0132;</a>',
					'</li>',
					'{@/each}',
				'</ul>',
			'</li>',
			'{@/each}',
		'</ul>',
		'<p class="more_btns">',
			/*'{@if comment_data.length >= 3}',
			'<a href="#" class="look_more"><span class="iconfont">&#xe614;</span>查看更多</a>',
			'{@/if}',*/
			'<a href="#" class="pack_up">收起<span class="iconfont">&#xf0004;</span></a>',
		'</p>'].join(''));
		
		// 回复
		var _reply = [
			'<div class="reply_con">',
				'<p class="Oreply"></p>',
				'<textarea name="" id="" cols="30" rows="10" class="reply_txt"></textarea>',
				'<span class="reply_send"><a href="#" class="reply_send_btn" title="快捷键 Ctrl+Enter">评论</a></span>',
				'<a href="#" class="iconfont close">&#xf00b3;</a>',
			'</div>'
		].join('');
		
		
		var _bind = function(onbox,op){
			var self=this;
			
			// 查看更多
			onbox.on("click",".look_more",function(){
				var $this = $(this);
				$this.closest(".commentCon").find(".comment_list").removeClass("max_height");
				$this.remove();
				return false;	
			});
			// 回复
			onbox.on("click",".reply",function(){
				var $this = $(this),
					$comment_item = $this.closest(".comment_item"),
					_name = $this.siblings(".comment_man").text(),
					_data_id
				;
				_data_id = $this.closest(".self_id").attr("data_id");
				$comment_item.find(".reply_con").remove();
				$comment_item.append(_reply);
				$comment_item.find(".Oreply").attr("data_id",_data_id);
				$comment_item.find(".Oreply").empty().append('回复'+_name+':');
				$comment_item.find(".reply_txt").focus();
				return false;	
			});
			
			// 关闭回复框
			onbox.on("click",".close",function(){
				var $this = $(this);
				$this.closest(".reply_con").slideUp(300);
				return false;	
			});
			
			// 发布评论
			onbox.on("keydown",".comment_con",function(e){
				e.ctrlKey && e.keyCode === 13 && onbox.find(".comment_btn").click();	
			});
			onbox.on("click",".comment_btn",function(){
				var $this = $(this),
					_vtxt = onbox.find(".comment_con").val()
				;
				if(_vtxt){
					$.ajax({
						url:domains.sns+"/shop/sns/onereplyshoppingdetail",
						type:"post",
						dataType:"json",
						data:{
							shopId:$this.closest(".onbox").attr("data_id"),
							content:encodeURIComponent(_vtxt)	
						},
						success:function(data){
							if(data.success){
								_getData($.extend({
									shopId:op.shopId,
									success:function(data){
										if(data.success){
											onbox.find(".commentCon").empty().append(comment_list_html.render({comment_data:data.success}));
										}else{
											onbox.find(".commentCon").empty().append('<p class="fail_loading"><span class="iconfont">&#xf00b3;</span>加载失败！</p>');
										}
									},
									error:function(){
										
									}	
								},op));	
								onbox.find(".comment_con").val("");
							}	
						},
						error:function(){
							alert("系统繁忙，请稍后再试！");	
						}
					});	
				}else{
					alert("请先输入内容！");		
				};
				return false;	
			});
			
			// 回复评论
			onbox.on("keydown",".reply_txt",function(e){
				e.ctrlKey && e.keyCode === 13 && onbox.find(".reply_send_btn").click();	
			});
			onbox.on("click",".reply_send_btn",function(){
				var $this = $(this),
					$comment_item = $this.closest(".comment_item"),
					Vtxt = $comment_item.find(".reply_txt").val(),
					_id
				;
				Vtxt = encodeURIComponent(Vtxt);
				_id = $comment_item.find(".Oreply").attr("data_id");
				if(Vtxt){
					$.ajax({
						url:domains.sns+"/shop/sns/tworeplyshoppingdetail",
						type:"post",
						dataType:"json",
						data:{
							shopId:$this.closest(".onbox").attr("data_id"),
							content:Vtxt,
							onereplyId:_id,
							replyId:$comment_item.attr("data_id")	
						},
						success:function(data){
							if(data.success){
								_getData($.extend({
									shopId:op.shopId,
									success:function(data){
										if(data.success){
											onbox.find(".commentCon").empty().append(comment_list_html.render({comment_data:data.success}));
										}else{
											onbox.find(".commentCon").empty().append('<p class="fail_loading"><span class="iconfont">&#xf00b3;</span>加载失败！</p>');
										}
									},
									error:function(){
										
									}	
								},op));	
							}
						},
						error:function(){
							alert("系统繁忙，请稍后再试！");
						}	
					});
				}else{
					alert("请先输入内容！");		
				}
				return false;	
			});
			
			// 收起
			onbox.on("click",".pack_up",function(){
				var $this = $(this),
					$sns_data_box = $this.closest(".sns_data_box")
				;
				$this.closest(".sdi_btns_subCon").addClass("dis_none");
				$sns_data_box.find(".comments").closest(".sdi_btns_sub").addClass("sdi_btns_sub_cur");
				return false;	
			});	
		};
		
		// 初始化数据
		var _getData=function(op){
			$.ajax({
				url:domains.sns+"/shop/sns/replyshoppingdetaillist",
				data:{
					shopId:op.shopId	
				},
				type:"get",
				dataType:"json",
				success:function(data){
					typeof op.success === "function" && op.success(data);
				},
				error:function(){
					typeof op.error === "function" && op.error();
				}	
			});
		};
		
		var _creatCommHtml = function(op){
			var onbox;
			if(op.appendBox && (op.appendBox.constructor == $||op.appendBox.constructor == jQuery)){
				if(!op.appendBox.find(".onbox").length){
					onbox=$(_commHtml);
					op.appendBox.empty().append(onbox);
					_bind(onbox,op);		
					onbox.attr("data_id",op.shopId);	
					_getData($.extend({
						shopId:op.shopId,
						success:function(data){
							if(data.success){
								onbox.find(".commentCon").empty().append(comment_list_html.render({comment_data:data.success}));
							}else{
								onbox.find(".commentCon").empty().append('<p class="fail_loading"><span class="iconfont">&#xf00b3;</span>加载失败！</p>');
							}
						},
						error:function(){
							var data = {
								success:[
									{
										commentContent:"ads",
										username:"dll",
										reply_msg:[
											{
												commentContent:"efc",
												username1:"dll",
												username2:"333"	
											},{
												commentContent:"efc",
												username1:"dll",
												username2:"333"	
											},{
												commentContent:"efc",
												username1:"dll",
												username2:"333"	
											},{
												commentContent:"efc",
												username1:"dll",
												username2:"333"	
											},{
												commentContent:"efc",
												username1:"dll",
												username2:"333"	
											},{
												commentContent:"efc",
												username1:"dll",
												username2:"333"	
											}
											
										]	
									},
									{
										commentContent:"ads",
										username:"dll",
										reply_msg:[
											{
												commentContent:"efc",
												username1:"dll",
												username2:"333"	
											},
										]	
									},
									{
										commentContent:"ads",
										username:"dll",
										reply_msg:[
											{
												commentContent:"efc",
												username1:"dll",
												username2:"333"	
											},
										]	
									}
								]	
							};
							onbox.find(".commentCon").empty().append(comment_list_html.render({comment_data:data.success}));
							//onbox.find(".commentCon").empty().append('<p class="fail_loading"><span class="iconfont">&#xf00b3;</span>加载失败！</p>');
						}	
					},op));	
				}
			}
		};
		exports.getData=function(op){
			_getData(op);
		};
		exports.creatCommHtml=function(op){ 
			/*lib.verificationLogin(function(){
				_creatCommHtml(op);	
			});*/
			_creatCommHtml(op);
		};
}); 