define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		points_promotion = require("points_promotion"),
		box = require("wmbox"),
		juicer = require("juicer"),
		site_in_message= require("site_in_message"),
		friend= require("friend"),
		tips = require("wmtips"),
		page = require("wmpage")
	;
	
	var init = function(){
		var $page=$("#page"),
			$now_num = $page.find(".now_num"),
			$word_content = $page.find(".word_content"),
			$friends_list = $page.find(".friends_list"),
			$space_user_con = $page.find(".space_user_con")
		;
		
		
		/*字数计算*/
		$word_content.keyup(check);
		
		function check(){
			var con = $word_content.val().length,
				i = 300
			;
			if(con<=i){
				$now_num.empty().append(con);
			}
			else{
				var maxnum = $word_content.val().substr(0,i);
				$word_content.val(maxnum);
			}
		};
		
		/*分页*/
		if (global_setting && global_setting.page && global_setting.page.totalcount) {
			var _page = page.Create({
			    url: global_setting.current.page.url || domains.member+"/collect/markets",
				index: (global_setting.current.page.pageindex) || 1,
				size: (global_setting.current.page.pagesize) || 10,
				sum: (global_setting.current.page.totalcount) || 0,
				pagekey: "pageindex",
				front: true
			});
		}
		
		
		
		/*获取用户基础数据*/
		if($space_user_con.length){
			friend.getBaseData({
				success:function(){},
				error:function(){
					var data =
						{
							name:"蔡依林",
							msg:"(6)",
							sex:"女",
							cons:"双鱼座",
							tag:["90后","漫友"]	
						};
								
						var _arr = [],
							_arrTag = []
						;
					
					_arr.push('<div class="space_user_img"><a href="#"><img src="img/user_img.jpg" /></a></div><div class="space_user_infor"><ul><li class="infor_item"><a href="#" class="user_name">'+data.name+'</a><span>'+data.msg+'</span></li><li class="infor_item"><span class="sex">性别：<em>'+data.sex+'</em></span><span class="cons">星座：<em>'+data.cons+'</em></span></li><li class="infor_item"><span class="Mytag">我的标签：</span></li></ul></div>');
					
					for(var i in data.tag){
						_arrTag.push('<em>'+data.tag[i]+'</em>');	
					}
					$space_user_con.empty().append(_arr.join(''));
					
					$space_user_con.find(".Mytag").append(_arrTag.join(''));
				}	
			});	
		}
		
		
		/*获取好友列表*/
		if($friends_list.length){
			$.ajax({
				url:"",
				type:"get",
				dataType:"jsonp",
				success:function(){
						
				},
				error:function(){ 
				var data=[
					{
						id:"0",
						name:"sdfsdf"
					},
					{
						id:"0",
						name:"sdfsdf"
					},
					{
						id:"0",
						name:"sdfsdf"
					},
					{
						id:"0",
						name:"sdfsdf"
					}
				];
				var arr=[];
				for(var i in data){
					arr.push('<li class="friends_list_item"><a href="#" class="friends_infor"><img src="img/user_img.jpg">'+data[i].name+'</a></li>')
				}
					
					$friends_list.find("ul").empty().append(arr.join(''));	
				}
			});	
		}
		
		
		
		
		
		bind();	
		
		/*好友列表*/
		$(window).scroll();
	}
	var bind = function(){
		var $page = $("#page"),
			$friends_list = $page.find(".friends_list"),
			$win=$(window)
		;
		
		
		/*发送站内信*/
		$page.on("click",".send_msg",function(){
			site_in_message.send({
				success:function(){},
				error:function(){
					alert("请重新发送！")	
				}	
			});	
			return false;
		});
		
		/*屏蔽*/
		$page.on("click",".infor_item_con",function(){
			var $this = $(this);
			if($this.hasClass("infor_item_conCur")){
				$this.removeClass("infor_item_conCur");
				$this.find(".shield_txt").text("屏蔽此人");
				friend.shieldSIM({
					success:function(){
							
					},
					error:function(){
						alert("已取消屏蔽")	
					}	
				});	
			}else{
				$this.addClass("infor_item_conCur");
				$this.find(".shield_txt").text("取消屏蔽");	
				friend.shieldSIM({
					success:function(){
							
					},
					error:function(){
						alert("已屏蔽")	
					}	
				});	
			}
			
		});
		
		$win.scroll(function(){
			var $friends_list = $page.find(".friends_list"),
				$letter = $page.find(".letter"),
				$body = $("body"),
				_leftWidth = $letter.offset().left,
				_width = $letter.outerWidth(true),
				_top = $letter.offset().top,
				scrollTop = $body[0].scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0
			;
			
			if(scrollTop<_top){
				$friends_list.css({
					"left":_leftWidth+_width,
					"top":_top-scrollTop,
					"display":"block"
				});	
			}else{
				$friends_list.css({
					"left":_leftWidth+_width,
					"top":"33px",
					"display":"block"
				});	
			}
		});
		$win.resize(function(){
			$win.scroll()
		});
		/*删除某人聊天记录*/
		$page.on("click",".delete",function(){
			site_in_message.delAll({
				success:function(){},
				error:function(){
					alert("删除成功！")	
				}	
			});
			return false;
		});
		
		var chatBgHtml = juicer([
			'<div class="bg_content">',
				'{@each data_list as item}',
				'<div class="bg_content_item">',
					'<p class="bg_name" data_themeId="${item.id}">${item.name}</p>',
					'{@each item.subList as list}',
					'<a href="#" data_id="${list.id}" class="{@if list.id===currId}a_current {@/if}"><img src="${list.imgurl}" /></a>',
					'{@/each}',
				'</div>',
				'{@/each}',
			'</div>'
		].join(''));
		/*设置背景图片*/
		var _Box = function(data){
			box.alert({
			titleText:'选择背景图片',	
			content:chatBgHtml.render(data),
			callback:function(){
				var self = this;
				this.wmBox.find(".bg_content").on("click","a",function(){
					var $this = $(this);
					self.wmBox.find(".bg_content a").removeClass("a_current");
					$this.addClass("a_current");	
				});
				this.wmBox.find(".bg_content").on("dblclick","a",function change(){
					var $this = $(this),
						_src = $this.find("img").attr("src")
					;
					$this.addClass("a_current");
					$page.find(".space_user").css({
						"background":"url("+_src+")"
					});
					self.close();
					return false;	
				});	

			},
			btns:[
				{
					cls:"ui_btn_h27red9",
					text:"确定",
					callback:function(){
						var self = this,
							$a_current = self.wmBox.find(".a_current"),
							$this = self.wmBox.find(".ui_btn_h27red9"),
							_thisTips = $this.data("thisTips")
						;
						if($a_current.length){
							var _src = $a_current.find("img").attr("src");
							$page.find(".space_user").css({
								"background":"url("+_src+")"
							});		
						}else{
							if(!_thisTips){
								_thisTips = new tips({
									ele:$this,
									con:"请先选择",
									skin: 'white1',
									direction:"rc",
									close:2000,
									minIndex:10003
								});	
								$this.data("thisTips",_thisTips);
							}
							_thisTips.show();
							return false;
						}
						this.close();
					}	
				}
				
			]
		});	
		}
		$page.on("click",".set_bg",function(){
			
			$.ajax({
				url:"",
				dataType:"json",
				data:{},
				success:function(data){},
				error:function(){
					var data={
						currId:"012",
						data_list:[
							{
								id:"1",							
								name:"可爱风",
								subList:[
									{
										imgurl:"http://s.tcsh.me/tcsh/view/buyers/message_tree/img/bg1.jpg",
										id:"12"
									},
									{
										imgurl:"http://s.tcsh.me/tcsh/view/buyers/message_tree/img/title-bg-female.jpg",
										id:"012"
									},
									{
										imgurl:"http://s.tcsh.me/tcsh/view/buyers/message_tree/img/bg1.jpg",
										id:"12"
									},
									{
										imgurl:"http://s.tcsh.me/tcsh/view/buyers/message_tree/img/title-bg-female.jpg",
										id:"112"
									}
								]
							},
							{
								id:"2",							
								name:"可爱风",
								subList:[
									{
										imgurl:"http://s.tcsh.me/tcsh/view/buyers/message_tree/img/bg2.jpg",
										id:"12"
									},
									{
										imgurl:"http://s.tcsh.me/tcsh/view/buyers/message_tree/img/bg1.jpg",
										id:"13"
									}
								]
							},
							{
								id:"3",							
								name:"可爱风",
								subList:[
									{
										imgurl:"http://s.tcsh.me/tcsh/view/buyers/message_tree/img/bg2.jpg",
										id:"12"
									},
									{
										imgurl:"http://s.tcsh.me/tcsh/view/buyers/message_tree/img/bg2.jpg",
										id:"23"
									}
								]
							}
						]
					};
					_Box(data);
				}
					
			});
			
		});
	}
	
	init();
})