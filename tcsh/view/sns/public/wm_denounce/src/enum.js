/*
*	举报类型
*	每一级从10开始  依次递增
*/
define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; 
	
	var level1 = {
		total : "10"  // 全站	
	}
	var level2 = {
		sns : "10"	// SNS
	}
	var level3 = {
		shopping : "10", // 购物经
		ask : "11",		// 问答
		user : "12",	// 用户
	}
	var level4 = {
		comment : "10", 	// 评论
		reply : "11",	// 回复
	}
	

	// 全站
	exports.tcsh = "10";
	
	
	// sns
	exports.sns = "10";
	
	
	// 购物经
	exports.shopping = "10";
	// 问答
	exports.ask = "11";
	// 用户
	exports.user = "12";
	
	
	//SNS-评论
	exports.comment = "10";
	//SNS-回复
	exports.reply = "11";


})