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
			'<p class="comment_detail">',
				'<textarea name="" id="" cols="30" rows="10" class="comment_con"></textarea>',
				'<a href="#" class="comment_btn" data_id="${id}">发布</a>',
			'</p>',
			'<div class="commentCon" data_id="${id}">',
				'<ul class="comment_list">',
					'<li class="comment_item" data_id="a">',
						'<a href="#"><img src="../public/img/head_40_40.jpg" /></a><a href="#" class="comment_man" data_id="1">小皮时光机</a>回复了<a href="#">一只小郭</a><span class="comm_con">谢谢哈</span><a href="#" class="reply">回复</a>',
					'</li>',
					'<li class="comment_item" data_id="s">',
						'<a href="#"><img src="../public/img/head_img.jpg" /></a><a href="#" class="comment_man" data_id="2">一只小郭</a><span class="comm_con">看上去真不错!</span><a href="#" class="reply">回复</a>',
					'</li>',
					'<li class="comment_item" data_id="k">',
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
			var self=this;
			var $page = $("#page");
			// 查看更多
			$page.on("click",".look_more:not(.enable)",function(){
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
			// 回复
			$page.on("click",".reply",function(){
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
			
			// 发布评论
			$page.on("click",".comment_btn",function(){
				var $this = $(this),
					_vtxt = $this.find(".comment_con").val()
				;
				if(_vtxt){
					$.ajax({
						url:domains.sns+"/sns/onereplyshoppingdetail",
						type:"post",
						dataType:"json",
						data:{
							shopId:$this.attr("data_id"),
							content:_vtxt	
						},
						success:function(){},
						error:function(){}
					});	
				}else{
					alert("请先输入内容！");		
				};
				return false;	
			});
			
			// 回复评论
			$page.on("click",".reply_send_btn",function(){
				var $this = $(this),
					$comment_item = $this.closest(".comment_item"),
					Vtxt = $comment_item.find(".reply_txt").val(),
					_txt
				;
				_txt = encodeURIComponent(Vtxt);
				_id = $comment_item.attr("data_id");
				if(Vtxt){
					$.ajax({
						url:domains.sns+"/sns/tworeplyshoppingdetai",
						type:"post",
						dataType:"json",
						data:{
							content:_txt,
							onereplyId:_id		
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
			$page.on("click",".pack_up",function(){
				var $this = $(this),
					$sns_data_box = $this.closest(".sns_data_box")
				;
				$this.closest(".sdi_btns_subCon").addClass("dis_none");
				$sns_data_box.find(".comments").closest(".sdi_btns_sub").addClass("sdi_btns_sub_cur");
				return false;	
			});	
			_bind=null;
		};
		var _getData=function(op){
			var self=this;
			$.ajax({
				url:"",
				data:{
					shopId:self.shopId	
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
			this.shopId=op.shopId;
			_getData.call(this,$.extend({
				success:function(){
					if(op.appendBox && (op.appendBox.constructor == $||op.appendBox.constructor == jQuery)){
						op.appendBox.empty().append(_commHtml.render({id:self.shopId}));
					}
				},
				error:function(){
					if(op.appendBox && (op.appendBox.constructor == $||op.appendBox.constructor == jQuery)){
						op.appendBox.empty().append(_commHtml.render({id:self.shopId}));
					}
				}	
			},op));	
			typeof _bind==="function"&&	_bind.call(this);
		};
		
		exports.getData=function(op){
			_getData(op);
		};
		exports.creatCommHtml=function(op){ 
			var _comm = new _creatCommHtml(op);
			return _comm;
		};
}); 