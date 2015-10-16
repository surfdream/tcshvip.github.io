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
				typeof op.success === "function" && op.error();	
			}
		});	
	};
	
	// 我要提问
	_Iask = function(op){
		$.ajax({
			url:"",
			type:"post",
			dataType:"json",
			data:{
				id:op.id,
				title:op.title,
				question:op.question	
			},
			success:function(data){
				typeof op.success === "function" && op.success(data);
			},
			error:function(){
				typeof op.success === "function" && op.error();	
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
	
	// 编写购物经
	_write = function(op){
		$.ajax({
			url:"",
			type:"post",
			dataType:"json",
			data:{
				title:op.title,
				content:op.writeCon	
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
		return lib.verificationLogin(_ask(op));	
	};
	
	// 我要提问
	exports.Iask = function(op){
		return lib.verificationLogin(_Iask(op));	
	};
	
	// 私信
	exports.letter = function(op){
		return lib.verificationLogin(_letter(op));	
	};
	
	// 编写购物经
	exports.Iwrite = function(op){
		return lib.verificationLogin(_write(op));	
	};
	
	// 发现
	exports.discover = function(op){
		return lib.verificationLogin(_discover(op));	
	};
	
	// 精选图片滚动
	exports.imgSlide = function(op){
		return lib.verificationLogin(_imgSlide(op));	
	};
	
	// 最近访客
	exports.visitor = function(op){
		return lib.verificationLogin(_visitor(op));	
	};	
	
})