define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
		lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js')
	;
	
	var $page = $("#page");
	
	// 向他提问
	_ask = function(op){
		$.ajax({
			url:"",
			type:"post",
			dataType:"json",
			data:{
				name:op.name,
				title:op.title,
				question:op.question	
			},
			success:function(data){
				typeof op.success === "function" && op.success(data);
			},
			error:function(){
				typeof op.error === "function" && op.error();	
			}
		});	
	};
	
	// 我要提问     提问，编辑提问   2个接口
	_Iask = function(op){
		$.ajax({
			url:domains.sns+"/answer_question/question/add",
			type:"post",
			dataType:"json",
			data:{
				hostId:op.hostId,
				title:op.title,
				content:op.content,
				integration:op.integration
			},
			success:function(data){
				typeof op.success === "function" && op.success(data);
			},
			error:function(){
				typeof op.error === "function" && op.error();	
			}
		});	
	};
	// 编辑提问
	_EditorIask = function(op){
		$.ajax({
			url:domains.sns+"/answer_question/question/edit",
			type:"post",
			dataType:"json",
			data:{
				questionId:op.questionId,
				hostId:op.hostId,
				title:op.title,
				content:op.content,
				integration:op.integration
			},
			success:function(data){
				typeof op.success === "function" && op.success(data);
			},
			error:function(){
				typeof op.error === "function" && op.error();	
			}
		});	
	};
	
	// 私信
	_letter = function(op){
		$.ajax({
			url:"",
			type:"post",
			dataType:"json",
			data:{
				name:op.name,
				talkContent:op.talkContent	
			},
			success:function(data){
				typeof op.success === "function" && op.success(data);	
			},
			error:function(){
				typeof op.error === "function" && op.error();	
			}	
		});	
	};
	
	// 编写购物经     编写，编辑 同一个接口
	_write = function(op){
		$.ajax({
			url:domains.sns+"/shop/sns/editshoppingdetail",
			type:"post",
			dataType:"json",
			data:{
				shopId:op.shopId,
				hostId:op.hostId,
				title:op.title,
				content:op.content,
				firstImg:op.img	
			},
			success:function(data){
				typeof op.success === "function" && op.success(data);	
			},
			error:function(){
				typeof op.error === "function" && op.error();	
			}
		});	
	};
	
	// 发现
	_discover = function(op){
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
	
	// 精选图片滚动
	_imgSlide = function(op){
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
	
	// 最近访客
	_visitor = function(op){
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
	
	
	
	
	// 向他提问
	exports.ask = function(op){
		lib.verificationLogin(function(){
			_ask(op);	
		});	
	};
	
	// 我要提问
	exports.Iask = function(op){
		lib.verificationLogin(function(){
			_Iask(op);	
		});	
	};
	
	// 编辑提问
	exports.EditorIask = function(op){
		lib.verificationLogin(function(){
			_EditorIask(op);	
		});	
	};
		
	// 编写购物经
	exports.Iwrite = function(op){
		lib.verificationLogin(function(){
			_write(op);
		});	
	};
	
	// 发现
	exports.discover = function(op){
		lib.verificationLogin(function(){
			_discover(op);	
		});	
	};
	
	// 精选图片滚动
	exports.imgSlide = function(op){
		lib.verificationLogin(function(){
			_imgSlide(op);	
		});	
	};
	
	// 最近访客
	exports.visitor = function(op){
		lib.verificationLogin(function(){
			_visitor(op);	
		});	
	};	
	
})