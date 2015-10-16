define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
		box = require("http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js"),
		juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
		tips = require("http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js"),
		page = require("http://s.tcsh.me/tcsh/model/wmpage/dist/wmpage.js")
	;
	
	var $page = $("#page");
	
	// 用户信息
	 _ownerHtml = juicer([
		'<div class="owner_bang">',
			'<img src="../public/img/head_img.jpg" />',
			'<div class="owner_bang_con">',
				'<h3 class="owner_name" data_id="${user_id}"><span class="owner_name_con">${user_name}</span><span class="wm_ico bang_ico">帮</span></h3>',
				'<ul class="owner_bang_list">',
					'{@each bang as bangList}',
					'<li class="owner_bang_item" data_id="${bangList.bang_id}"><a href="#"><em>●</em>${bangList.bang_name}</a><span class="wm_ico shield_red"></span><span class="shield_time">00:00</span></li>',
					'{@/each}',
				'</ul>',
			'</div>',
		'</div>',
		'<ul class="owner_infor">',
			'{@each list as item}',
			'<li class="owner_infor_item" data_id="${item.list_id}"><a href="#">${item.con}<span class="owner_infor_num">${item.number}</span></a></li>',
			'{@/each}',
		'</ul>'
	].join(''));
	var getOwnerData=function(callback){
		$.ajax({
			url:"",
			type:"get",
			dataType:"json",
			success:function(data){},
			error:function(){
				var _data = {
					user_id:"1",
					user_name:"利威尔兵长",
					bang:[
						{
							bang_id:"11",
							bang_name:"调查兵团",
							
						},
						{
							bang_id:"12",
							bang_name:"驻扎兵团",
						},
						{
							bang_id:"13",
							bang_name:"宪兵团",
						}
					],
					list:[
						{
							list_id:"21",
							con:"转载",
							number:"160"	
						},
						{
							list_id:"22",
							con:"好友",
							number:"1120"	
						},
						{
							list_id:"23",
							con:"购物经",
							number:"1230"	
						},
						{
							list_id:"24",
							con:"问答",
							number:"1314"	
						},
						{
							list_id:"25",
							con:"推荐",
							number:"2450"	
						},
						{
							list_id:"26",
							con:"MARK",
							number:"789"	
						}
					]
				
				};
				typeof callback === "function" &&	callback(_ownerHtml.render(_data)); 
			}	
		})
	};
	
	
	// 发现
	 _discoverHtml = juicer([
	 	'<div class="main_right_sub mr_border_top discover">',
			'<h3 class="mrs_title">发现<a href="#" class="change_dis"><span class="iconfont">&#xf015c;</span>换一组</a></h3>',
			'<ul class="discover_list">',
				'{@each lists as list}',
				'<li class="discover_item">',
					'<a href="#"><img src="${list.avatar}" /></a>',
					'<div class="discover_infor">',
						'<a href="#" class="discover_name" data_id="${list.userId}">${list.userName}</a><a href="#" class="focus">+ 关注</a>',
						'<span class="discover_bang">',
						'{@each list.bang as item}',
						'<a href="#" data_id="${item.bang_id}">${item.bang_name}</a>',
						'{@/each}',
						'</span>',
					'</div>',
				'</li>',
				'{@/each}',
			'</ul>',
		'</div>'
	].join(''));
	var getDiscoverData = function(callback){
		$.ajax({
			url:"",
			type:"get",
			dataType:"json",
			success:function(data){
				typeof callback === "function" && callback(_discoverHtml.render(data.success));	
			},
			error:function(){
				/*var data = {
					lists:[
						{
							user_id:"1",
							user_name:"艾伦·耶格尔",
							bang:[
								{
									bang_id:"11",
									bang_name:"调查兵团"	
								},
								{
									bang_id:"12",
									bang_name:"进击的巨人"	
								},
								{
									bang_id:"13",
									bang_name:"巨人"	
								}
							]
						},
						{
							user_id:"2",
							user_name:"莱纳·布朗",
							bang:[
								{
									bang_id:"22",
									bang_name:"调查兵团"	
								},
								{
									bang_id:"23",
									bang_name:"铠之巨人"	
								},
								{
									bang_id:"24",
									bang_name:"故乡"	
								}
							]
						},
						{
							user_id:"3",
							user_name:"贝特霍尔德·胡佛",
							bang:[
								{
									bang_id:"33",
									bang_name:"调查兵团"	
								},
								{
									bang_id:"34",
									bang_name:"超大型巨人"	
								},
								{
									bang_id:"35",
									bang_name:"故乡"	
								}
							]
						}
					]	
				}	*/
			}	
		});	
	};
	
	
	// 精选图片滚动
	 _handpickHtml = juicer([
		 '<div class="main_right_sub mr_border_top handpick">',
			'<h3 class="mrs_title">精选<span class="handpick_btn"><em class="now">1</em>/<em class="img_num">4</em><a href="#" class="iconfont left">&#xf0007;</a><a href="#" class="iconfont right">&#xf0006;</a></span></h3>',
			'<div class="slide">',
				'<div class="slideCon">',
					'<a href="#" class="slide_item"><img src="../public/img/head_img.jpg" /></a>',
					'<a href="#" class="slide_item"><img src="img/img_200_160.jpg" /></a>',
					'<a href="#" class="slide_item"><img src="../public/img/head_40_40.jpg" /></a>',
				'</div>',
			'</div>',
		'</div>'
	].join(''));
	var getHandpickData = function(callback){
		$.ajax({
			url:"",
			type:"get",
			dataType:"json",
			success:function(){},
			error:function(){
				typeof callback === "function" && callback(_handpickHtml.render());	
			}	
		});	
	};
	
	
	// 最近访客
	 _visitorHtml = juicer([
	 	'<div class="main_right_sub visitor">',
			'<h3 class="mrs_title"><span>最近访客</span></h3>',
			'<div class="visitor_con">',
				'{@each lists as item}',
				'<a href="#" data_id="${item.visitor_id}"><img src="../public/img/head_40_40.jpg" />${item.visitor_name}</a>',
				'{@/each}',
			'</div>',
		'</div>'
	].join(''));
	var getVisitorData = function(callback){
		$.ajax({
			url:"",
			type:"get",
			dataType:"json",
			success:function(){},
			error:function(){
				var data = {
					lists:[
						{
							visitor_id:"v1",
							visitor_name:"林亚泉"	
						},
						{
							visitor_id:"v2",
							visitor_name:"菜小菜"	
						},
						{
							visitor_id:"v3",
							visitor_name:"纪委"	
						},
						{
							visitor_id:"v4",
							visitor_name:"刘佳"	
						},
						{
							visitor_id:"v5",
							visitor_name:"怪叔叔"	
						},
						{
							visitor_id:"v6",
							visitor_name:"张三"	
						},
						{
							visitor_id:"v7",
							visitor_name:"李四"	
						},
						{
							visitor_id:"v8",
							visitor_name:"王五"	
						},
						{
							visitor_id:"v9",
							visitor_name:"小六"	
						}
					]	
				};
				typeof callback === "function" && callback(_visitorHtml.render(data));	
			}	
		});	
	};
	
	// 分享的其他东西
	_otherShare = juicer([
		'<div class="main_right_sub mr_border_top other_share">',
			'<h3 class="mrs_title">其他分享</h3>',
			'<div class="other_share_con">',
				'{@each lists as item}',
				'<div class="other_share_item">',
					'<a href="#"><img src="../public/img/head_img.jpg" /></a>',
					'<div href="#" class="other_share_con_infor">',
						'<a href="#" class="osc_infor_con">${item.title}</a>',
						'<span class="like_num">6人喜欢</span>',
					'</div>',
				'</div>',
				'{@/each}',
			'</div>',
		'</div>'
	].join(''));
	var getOtherShare = function(callback){
		$.ajax({
			url:"",
			type:"get",
			dataType:"json",
			success:function(){},
			error:function(){
				var data = {
					lists : [
						{
							title:"【满50包邮】卡通小黄鸭小黄人大眼仔怪兽大学吸盘手机ipad支架..."		
						},
						{
							title:"【满50包邮】卡通小黄鸭小黄人大眼仔怪兽"		
						},
						{
							title:"【满50包邮】卡通小黄鸭小黄人大眼仔怪兽大学吸盘手机ipad支架..."		
						}
					]	
				};
				typeof callback === "function" && callback(_otherShare.render(data));	
			}	
		});	
	};
	
	exports.ownerHtml = function(callback){
		getOwnerData(callback);
	};
	exports.discoverHtml = function(callback){
		getDiscoverData(callback);	
	};
	exports.handpickHtml = function(callback){
		getHandpickData(callback);
	};
	exports.visitorHtml = function(callback){
		getVisitorData(callback);	
	};
	exports.othershareHtml = function(callback){
		getOtherShare(callback);	
	}
	
})