define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
		box = require("http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js"),
		juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
		tips = require("http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js"),
		verification = require("http://s.tcsh.me/tcsh/model/wmverification/dist/wmverification.js")
	;
		require("http://s.tcsh.me/tcsh/view/sns/public/wm_comment/css/style.css#");
		// 评论
		var _commHtml = juicer([
			'<div class="commentCon">',
				'<ul class="comment_list">',
					'<li class="comment_item">',
						'<a href="#"><img src="../public/img/head_40_40.jpg" /></a><a href="#" class="comment_man" data_id="1">小皮时光机</a>回复了<a href="#">一只小郭</a><span class="comm_con">谢谢哈</span><a href="#" class="reply">回复</a>',
					'</li>',
					'<li class="comment_item">',
						'<a href="#"><img src="../public/img/head_img.jpg" /></a><a href="#" class="comment_man" data_id="2">一只小郭</a><span class="comm_con">看上去真不错!</span><a href="#" class="reply">回复</a>',
					'</li>',
					'<li class="comment_item">',
						'<a href="#"><img src="../public/img/head_40_40.jpg" /></a><a href="#" class="comment_man" data_id="3">胡一飞12138</a>回复了<a href="#">一只小郭</a><span class="comm_con">great!</span><a href="#" class="reply">回复</a>',
					'</li>',
				'</ul>',
				'<p class="more_btns">',
					'<a href="#" class="look_more"><span class="iconfont">&#xe614;</span>查看更多</a>',
					'<a href="#" class="pack_up">收起<span class="iconfont">&#xf0004;</span></a>',
				'</p>',
			'</div>'
		].join(''));
		
		// 回复
		var _reply = [
			'<div class="reply_con">',
				'<p class="Oreply"></p>',
				'<textarea name="" id="" cols="30" rows="10" class="reply_txt"></textarea>',
				'<span class="reply_send"><a href="#" class="reply_send_btn">评论</a></span>',
			'</div>'
		].join('');
		
		
		var _bind = function(){
			var $commentCon = $(".commentCon");
			// 查看更多
			$commentCon.on("click",".look_more:not(.enable)",function(){
				var $this = $(this);
				$this.html('<span class="loading">正在加载……</span>').addClass("enable");
				$.ajax({
					url:"",
					type:"get",
					dataType:"json",
					success:function(data){
						$this.replaceWith('<a href="#" class="look_more"><span class="iconfont">&#xe614;</span>查看更多</a>');	
					},
					error:function(){
						alert("系统繁忙，稍后再试！");
						$this.replaceWith('<a href="#" class="look_more"><span class="iconfont">&#xe614;</span>查看更多</a>');	
					}	
				});
				return false;	
			});
			
			$commentCon.on("click",".reply",function(){
				var $this = $(this),
					$comment_item = $this.closest(".comment_item"),
					_name = $comment_item.find(".comment_man").text()
				;
				if(!$comment_item.find(".reply_con").length){
					$comment_item.append(_reply);
				}else{
					$comment_item.find(".reply_con").toggleClass("dis_none");	
				};
				$comment_item.find(".Oreply").empty().append('回复'+_name+':');
				return false;	
			});
			$commentCon.on("click",".reply_send_btn",function(){
				var $this = $(this),
					$comment_item = $this.closest(".comment_item"),
					Vtxt = $comment_item.find(".reply_txt").val(),
					_txt,
					_name
				;
				_txt = encodeURIComponent(Vtxt);
				_name = encodeURIComponent($comment_item.find(".comment_man").text());
				_id = $comment_item.find(".comment_man").attr("data_id");
				if(Vtxt){
					$.ajax({
						url:"",
						type:"get",
						dataType:"json",
						data:{
							content:_txt,
							name:_name,
							id:_id		
						},
						success:function(){},
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
			$commentCon.on("click",".pack_up",function(){
				var $this = $(this),
					$sns_data_box = $this.closest(".sns_data_box")
				;
				$this.closest(".sdi_btns_subCon").addClass("dis_none");
				$sns_data_box.find(".comments").closest(".sdi_btns_sub").addClass("sdi_btns_sub_cur");
				return false;	
			});	
			
		};
		var _getData=function(op){
			$.ajax({
				url:"",
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
			_getData($.extend({
				error:function(){
					if(op.appendBox && (op.appendBox.constructor == $||op.appendBox.constructor == jQuery)){
						op.appendBox.append(_commHtml.render());
					}
					_bind();
				}	
			},op));	
		};
		
		exports.getData=function(op){
			_getData(op);
		};
		exports.creatCommHtml=function(op){
			_creatCommHtml(op);
		};
});