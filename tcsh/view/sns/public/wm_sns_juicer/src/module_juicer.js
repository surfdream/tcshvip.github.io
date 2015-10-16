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
			'<img src="${headImg}" />',
			'<div class="owner_bang_con">',
				'<h3 class="owner_name" data_id="${user_id}"><span class="owner_name_con">${user_name}</span><span class="wm_ico bang_ico">帮</span></h3>',
				'<ul class="owner_bang_list">',
					'{@each bang as bangList}',
					'<li class="owner_bang_item" data_id="${bangList.bang_id}"><a href="#"><em>●</em>${bangList.bang_name}</a>{@if bangList.shield == 1}<span class="wm_ico shield_red"></span><span class="shield_time">00:00</span>{@/if}</li>',
					'{@/each}',
				'</ul>',
			'</div>',
		'</div>',
		'<ul class="owner_infor">',	
			'<li class="owner_infor_item" data_count_url="http://sns.tcsh.me/shop/sns/reshoppinglistnum"><a href="#" data_hostid="${hostId}">转载<span class="owner_infor_num">0</span></a></li>',
			'<li class="owner_infor_item" data_count_url="http://sns.tcsh.me/friends/friend/t"><a href="http://sns.tcsh.me/friends/friend/fd?hostId=${hostId}">好友<span class="owner_infor_num">0</span></a></li>',
			'<li class="owner_infor_item" data_count_url="http://sns.tcsh.me/shop/sns/shoppinglistnum"><a href="http://sns.tcsh.me/shop/sns/shoppingdetaillist?hostId=${hostId}">购物经<span class="owner_infor_num">0</span></a></li>',
			'<li class="owner_infor_item" data_count_url="http://sns.tcsh.me/answer_question/question/t"><a href="http://sns.tcsh.me/answer_question/question/getallquestion?hostId=${hostId}">问答<span class="owner_infor_num">0</span></a></li>',
			'<li class="owner_infor_item" data_count_url="1"><a href="#" data_hostid="${hostId}">推荐<span class="owner_infor_num">0</span></a></li>',
			'<li class="owner_infor_item" data_count_url="http://sns.tcsh.me/answer_question/mark/t"><a href="http://sns.tcsh.me/answer_question/mark/list?hostId=${hostId}">MARK<span class="owner_infor_num">0</span></a></li>',
		'</ul>'
	].join(''));
	var getOwnerData=function(callback){
		$.ajax({
			url:domains.sns+"/friends/friend/h",
			type:"get",
			dataType:"jsonp",
			data:{
				hostId:global_setting.hostId
			},
			success:function(data){
				var $owner;
				$owner = $(_ownerHtml.render($.extend({hostId:global_setting.hostId},data.success)));
				$owner.find(".owner_infor_item").each(function(){
					var $this=$(this),
						_num_url=$this.attr("data_count_url")
					;
					if(_num_url){
						$.ajax({
							url:_num_url,
							type:"get",
							dataType:"jsonp",
							data:{
								hostId:global_setting.hostId
							},
							success:function(data){
								if(data.success){
									$this.find(".owner_infor_num").empty().append(data.success.count);	
								}	
							},
							error:function(){
								//$this.find(".owner_infor_num").empty().append(parseInt( Math.random()*999)+100);
								//alert("系统繁忙，请稍后再试！")
							}
						});
					}
				});
				typeof callback === "function" && callback($owner); 	
			},
			error:function(){
				var $owner;
				/*var _data = {
					headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_img.jpg",
					user_id:"1",
					user_name:"利威尔兵长",
					bang:[
						{
							bang_id:"11",
							bang_name:"调查兵团",
							shield:1
						},
						{
							bang_id:"12",
							bang_name:"驻扎兵团",
						},
						{
							bang_id:"13",
							bang_name:"宪兵团",
						}
					]
				};*/
				
			}	
		})
	};
	
	
	// 发现
	 _discoverHtml = [
	 	'<div class="main_right_sub mr_border_top discover">',
			'<h3 class="mrs_title">发现<a href="#" class="change_dis"><span class="iconfont">&#xf015c;</span>换一组</a></h3>',
			'<ul class="discover_list">',
				
			'</ul>',
		'</div>'
	].join('');
	_disList = juicer([
		'{@each success as list}',
			'<li class="discover_item friend" user_id="${list.userId}">',
				'<a href="#"><img src="${list.avatar}" /></a>',
				'<div class="discover_infor">',
					'<a href="#" class="discover_name">${list.userName}</a><a href="#" class="focus">+ 关注</a>',
					'<span class="discover_bang">',
					'{@each list.bang as item}',
					'<a href="#" data_id="${item.bang_id}">${item.bang_name}</a>',
					'{@/each}',
					'</span>',
				'</div>',
			'</li>',
		'{@/each}',
	].join(''));
	var addDiscoverHtml = function(callback){
		typeof callback === "function" && callback(_discoverHtml);	
	};
	var getDiscoverData = function(){
		var $discover = $(".discover");
		if($discover.length){
			$.ajax({
				url:domains.sns+"/friends/friend/c",			
				type:"get",
				dataType:"jsonp",
				data:{
					hostId:global_setting.hostId
				},
				success:function(data){
					$discover.find(".discover_list").empty().append(_disList.render(data));	
				},
				error:function(){
					/*var data = {
						lists:[
							{
								headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg",
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
								headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg",
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
								headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg",
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
					};*/	
					
				}	
			});	
		};
	};
	
	// 精选图片滚动
	 _handpickHtml = juicer([
		 '<div class="main_right_sub mr_border_top handpick">',
			'<h3 class="mrs_title">精选<span class="handpick_btn"><em class="now">1</em>/<em class="img_num">4</em><a href="#" class="iconfont left">&#xf0007;</a><a href="#" class="iconfont right">&#xf0006;</a></span></h3>',
			'<div class="slide">',
				'<div class="slideCon">',
					'{@each imglist as img}',
					'<a href="#" class="slide_item"><img src="${img.imgCon}" /></a>',
					'{@/each}',
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
				var data = {
					imglist:[
						{
							imgCon:"http://s.tcsh.me/tcsh/view/sns/public/img/head_img.jpg"	
						},
						{
							imgCon:"http://s.tcsh.me/tcsh/view/sns/index/img/img_200_160.jpg"	
						},
						{
							imgCon:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg"	
						}
					]	
				};
				typeof callback === "function" && callback(_handpickHtml.render(data));	
			}	
		});	
	};
	
	
	// 最近访客
	 _visitorHtml = juicer([
	 	'<div class="main_right_sub visitor">',
			'<h3 class="mrs_title"><span>最近访客</span></h3>',
			'<div class="visitor_con">',
				'{@if lists.length}',
				'{@each lists as item}',
				'<a href="#" data_id="${item.userId}"><img src="${item.avatar}" />${item.userName}</a>',
				'{@/each}',
				'{@else}',
				'<p class="no_vis">没有最近访客</p>',
				'{@/if}',
			'</div>',
		'</div>'
	].join(''));
	var getVisitorData = function(callback){
		$.ajax({
			url:domains.sns+"/friends/visitor/g",
			type:"get",
			dataType:"jsonp",
			data:{
				hostId:global_setting.hostId
			},
			success:function(data){
				typeof callback === "function" && callback(_visitorHtml.render(data.success));	
			},
			error:function(){
				/*var data = {
					lists:[
						{
							headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg",
							visitor_id:"v1",
							visitor_name:"林亚泉"	
						},
						{
							headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg",
							visitor_id:"v2",
							visitor_name:"菜小菜"	
						},
						{
							headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg",
							visitor_id:"v3",
							visitor_name:"纪委"	
						},
						{
							headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg",
							visitor_id:"v4",
							visitor_name:"刘佳"	
						},
						{
							headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg",
							visitor_id:"v5",
							visitor_name:"怪叔叔"	
						},
						{
							headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg",
							visitor_id:"v6",
							visitor_name:"张三"	
						},
						{
							headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg",
							visitor_id:"v7",
							visitor_name:"李四"	
						},
						{
							headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg",
							visitor_id:"v8",
							visitor_name:"王五"	
						},
						{
							headImg:"http://s.tcsh.me/tcsh/view/sns/public/img/head_40_40.jpg",
							visitor_id:"v9",
							visitor_name:"小六"	
						}
					]	
				};*/
				//typeof callback === "function" && callback(_visitorHtml.render(data));	
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
	
	
	// 用户信息
	exports.ownerHtml = function(callback){
		getOwnerData(callback);
	};
	
	// 发现 html
	exports.discoverHtml = function(callback){
		addDiscoverHtml(callback);	
	};
	
	// 发现 data
	exports.discoverData = function(){
		getDiscoverData();	
	};
	
	// 图片轮播
	exports.handpickHtml = function(callback){
		getHandpickData(callback);
	};
	
	// 访客
	exports.visitorHtml = function(callback){
		getVisitorData(callback);	
	};
	
	//  其他分享
	exports.othershareHtml = function(callback){
		getOtherShare(callback);	
	}
	
})