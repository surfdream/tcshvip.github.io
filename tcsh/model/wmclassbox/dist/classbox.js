define(function(require,exports,module){var f=require("http://s.tcsh.me/tcsh/model/domains/dist/domains.js");var b=require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js");juicer=require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),box=require("http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js");require("http://s.tcsh.me/tcsh/model/wmclassbox/css/style.css");var d;var a=function(h){var g=juicer(['<div class="chk_class_head">','<a href="#" class="close">×</a>',"<h3>选择分类</h3>","</div>",'<div class="wm_class">','<ul class="wm_class_list">',"{@each classList as list,index}",'<li class="class_item clearfix">','<span class="floatleft w110 class_no1_name">','<input type="checkbox" class="chk_item class_item_no1" id="class_${key}_${index}" data_name="${list.name}" data_id="${index}" /><label class="chk_key" for="class_${key}_${index}"><b>${list.name}</b></label>',"</span>",'<div class="floatleft w910 classlist" data_ids="{@each list.itemList as item,index}${index},{@/each}">',"{@each list.itemList as itemList,index}",'<div class="class_list_no2">',"<span>",'<input type="checkbox" class="chk_item class_item_no2" data_name="${itemList.name}" data_id="${index}" id="province_${key}_${index}" />','<label class="chk_key" for="province_${key}_${index}">${itemList.name}</label>','<b class="sum"></b>','<a href="#" class="wm_ico arrow9down showclass_no3"></a>',"</span>",'<div class="class_list_no3"><ul>',"{@each itemList.itemList as item3,index}","<li>","{@if ischkNo3}",'<input type="checkbox" class="chk_item class_item_no3" id="class_${key}_${index}" data_name="${item3.name}" data_id="${index}" />',"{@/if}",'<label for="class_${key}_${index}">${item3.name}</label></li>',"{@/each}",'</ul><a href="#" class="class_no3hide">×</a></div>',"</div>","{@/each}","</div>","</li>","{@/each}","</ul>","</div>",'<div class="btns">','<a href="#" class="ui_btn ui_btn_h27gray8 submit"><span class="ui_btn_txt">确定</span></a>',"</div>",].join(""));g=b(g.render(h));g.find();return g};var e=function(g){b.ajax({url:f.api+"/category",type:"get",dataType:"jsonp",success:function(h){d=h;typeof g==="function"&&g(d)},error:function(){}})};var c=function(j){var h=this;var i=box.invBox({boxCls:"chk_class_box",content:a({key:parseInt(Math.random()*999999),classList:d||{},ischkNo3:j.ischkNo3}),callback:function(){this.close=this.hide;this.wmBox.on("change",".class_item_no1",function(){var k=b(this),l=k.closest(".class_item");if(k.attr("checked")){l.find(".class_item_no2:enabled").attr("checked","checked").change()}else{l.find(".class_item_no2:enabled").removeAttr("checked").change()}});this.wmBox.on("click",".showclass_no3",function(){var k=b(this),l=k.closest(".wm_class");l.find(".class_list_no2_showclass_no3").removeClass("class_list_no2_showclass_no3");k.closest(".class_list_no2").addClass("class_list_no2_showclass_no3");return false});this.wmBox.on("change",".class_item_no2",function(){var m=b(this),k=m.closest(".class_list_no2"),l=k.closest(".class_item");if(m.attr("checked")){k.find(".class_item_no3:enabled").attr("checked","checked")}else{k.find(".class_item_no3:enabled").removeAttr("checked")}});this.wmBox.on("change",".class_item_no3",function(){var l=b(this),k=l.closest(".class_list_no2");if(k.find(".class_item_no3").length===k.find(".class_item_no3:checked").length){k.find(".class_item_no2").attr("checked","checked")}else{k.find(".class_item_no2").removeAttr("checked")}});this.wmBox.on("change",".class_item_no2,.class_item_no3",function(){var o=b(this),n=o.closest(".class_list_no2"),m=n.find(".sum"),k=n.find("label").length,l=n.find(".class_item_no3:checked").length;m.empty();if(j.ischkNo3){l&&m.append("("+l+")")}else{o.attr("checked")&&m.append("("+k+")")}});this.wmBox.on("click",".class_no3hide",function(){var k=b(this);k.closest(".class_list_no2_showclass_no3").removeClass("class_list_no2_showclass_no3");return false});this.wmBox.on("click",".submit",function(){var k=b(this);h.hide();typeof j.submitCallback==="function"&&j.submitCallback.call(h);return false})}});var g={"1":function(){var k={};h.wmBox.find(".class_item_no1").each(function(){var m=b(this),l=m.attr("data_id");if(m.closest(".class_item").find(".classlist :checked").length){k[l]={id:l,name:m.attr("data_name")}}});return k},"2":function(){var k={relevanceData:{},data:{}};h.wmBox.find(".class_item_no2:checked").each(function(){var n=b(this),l=n.attr("data_id"),o=n.closest(".class_item").find(".class_item_no1"),m=o.attr("data_id"),p=o.attr("data_name");if(!k.relevanceData[m]){k.relevanceData[m]={id:m,name:p,itemList:{}}}k.relevanceData[m].itemList[l]=k.data[l]={id:l,name:n.attr("data_name")}});return k},"3":function(){var k={relevanceData:{},data:{}};h.wmBox.find(".class_item_no3:checked").each(function(){var m=b(this),l=m.attr("data_id");k.data[l]={id:l,name:m.attr("data_name")}});return k}};this.hide=i.hide;this.close=i.close;this.wmBox=i.wmBox;this.getVal=function(k){return g[k||2]()};this.show=function(k){typeof j.callback==="function"&&j.callback.call(h);typeof k==="function"&&k.call(h);i.show()};this.chked=function(m,k){if(k){h.wmBox.find(".chk_item").removeAttr("checked");h.wmBox.find(".sum").empty()}if(typeof m==="string"){m=m.split(",")}for(var l in m){h.wmBox.find(".chk_item[data_id='"+m[l]+"']").attr("checked","checked").change()}};this.disabled=function(l){var m;if(l){if(typeof l==="string"){l=l.split(",")}h.wmBox.find(".chk_item").removeAttr("disabled");for(var k in l){m=h.wmBox.find(".chk_item[data_id='"+l[k]+"']");m.attr("disabled","disabled");m.hasClass("class_item_no1")&&m.closest(".class_item").find(".chk_item").attr("disabled","disabled");m.hasClass("class_item_no2")&&m.closest(".class_list_no2").find(".class_item_no3").attr("disabled","disabled")}h.wmBox.find(".class_list_no2").each(function(){var n=b(this);if(n.find(".class_item_no3").length&&n.find(".class_item_no3:disabled").length===n.find(".class_item_no3").length){n.find(".class_item_no2").attr("disabled","disabled")}});h.wmBox.find(".class_item").each(function(){var n=b(this);if(n.find(".class_item_no2").length&&n.find(".class_item_no2:disabled").length===n.find(".class_item_no2").length){n.find(".class_item_no1").attr("disabled","disabled")}})}};typeof j.callback==="function"&&j.callback.call(this)};e();exports.createBox=function(g){return new c(b.extend({ischkNo3:true},g))};exports.data=function(g){if(d){typeof g==="function"&&g(d)}else{e(g)}}});