define(function(c,e,a){var f=c("jquery"),d=c("juicer"),g=c("wmbox"),i=c("wmpage");var b=d(['<div class="shop_main">','<div class="shop_main">','<p class="msg">选中总数：<b>${currlist.length}</b>个</p>','<ul class="curr_list">',"{@each currlist as item}",'<li class="curr_item" title="${item.name}" data_id="${item.id}" data_name="${item.name}"><span class="shop_name">${item.name}</span><a href="#" class="wm_ico fork2 remove_item" title="移除该项"></a></li>',"{@/each}","</ul>","<hr />",'<ul class="shop_list">',"{@each alllist as item}",'<li class="shop_item" title="${item.name}" data_id="${item.id}" data_name="${item.name}"><span class="shop_name">${item.name}</span><i class="wm_ico hook3"></i></li>',"{@/each}","</ul>",'<div class="wm_page"></div>',"</div>","</div>"].join(""));var j=function(){h()};var h=function(){var l=f("#page");var k=[{id:"1",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店1"},{id:"2",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店2"},{id:"3",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店3"},{id:"11",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店11"},{id:"12",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店12"},{id:"13",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店13"},{id:"14",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店14"},{id:"21",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店21"},{id:"22",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店22"},{id:"23",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店23"},{id:"24",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店24"},{id:"50",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店50"},{id:"100",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店100"},{id:"200",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店200"},{id:"300",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店300"},{id:"500",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店500"},{id:"700",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店700"},{id:"900",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店900"},{id:"1000",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店1000"},{id:"10001",name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店10001"}];var n=[];var m=40;for(var o=0;o<m;o++){n.push({id:o,name:"怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店"+o})}l.on("click",".add",function(){var q=f(this),p=q.data("box");if(!p){p=g.alert({boxId:"shop_box",titleText:"优先展示店铺",content:b.render({currlist:k,alllist:n}),callback:function(){var r=this;this.close=this.hide;for(var s in k){this.wmBox.find(".shop_item[data_id='"+k[s].id+"']").addClass("curr")}this.wmBox.on("click",".shop_item",function(){var v=f(this),t,u;v.toggleClass("curr");if(!v.hasClass("curr")){r.wmBox.find(".curr_list .curr_item[data_id='"+v.attr("data_id")+"']").find(".remove_item").click()}else{t=v.attr("data_name");u=v.attr("data_id");r.wmBox.find(".curr_list").prepend('<li class="curr_item" title="'+t+'" data_id="'+u+'"><span class="shop_name">'+t+'</span><a href="#" class="wm_ico fork2 remove_item" title="移除该项"></a></li>')}return false});this.wmBox.on("click",".remove_item",function(){var t=f(this).closest(".curr_item");t.addClass("curr_item_remove");setTimeout(function(){t.remove()},300);return false})}});q.data("box",p)}p.show();return false})};j()});