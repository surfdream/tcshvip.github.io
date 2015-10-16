define(function(require,exports,module){var k=require("domains");var c=require("jquery"),i=require("lib"),e=require("wmbox"),b=require("juicer"),h=require("api");var a=function(){var l=this;h.getModelTree({success:function(o){if(o.success){var m=c('<dl><dt><a href="#" class="iconfont f5_tree">&#xf015c;</a><a href="#" class="nav_nide" data_id="'+o.id+'" data_name="'+o.title+'">根目录</a></dt></dl>');var n=l.wmBox.find(".nav_tree");g(m,o.success.subList,o.success.id,o.success.name);n.empty().append(m);l.wmBox.find(".nav_nide:eq(0)").click();l.position()}},error:function(){alert("模块树初始化失败，请稍后再试！")}})};var g=function(r,q,p,o){var m,l;if(q&&q.length){for(var n in q){if(q[n].subList&&q[n].subList.length){m=c("<dd><dl></dl></dd>"),l=m.find("dl");l.append('<dt><a href="#" class="iconfont show_sub_btn">&#xf0175;</a><a href="#" class="nav_nide " data_id="'+q[n].id+'" data_name="'+q[n].name+'" data_parent_id="'+p+'" data_parent_name="'+o+'">'+q[n].name+"</a></dt>");if(g(l,q[n].subList,q[n].id,q[n].name)){m.find(".nav_nide").addClass("get_sub_model");m.find(".show_sub_btn").removeClass("show_sub_btn").css({"font-size":18,"padding-right":2,"padding-left":4}).empty().append("&#xf01b9;")}r.append(m)}else{return true}}}};var d=['<div class="ids_main">','<div class="ids_head">',"<h3>选择模块页面</h3>",'<a href="#" class="iconfont close">&#xf00b3;</a>',"</div>",'<div class="ids_con">','<div class="nav_tree"></div>','<div class="cmp_submodel_list_box">',"<h3></h3>","<ul>","</ul>","</div>",'<div class="btns">','<a href="#" class="ui_btn ui_btn_h26blue2 submit"><span class="ui_btn_txt">确定</span></a>','<a href="#" class="ui_btn ui_btn_h26white6 close"><span class="ui_btn_txt">取消</span></a>',"</div>","</div>","</div>"].join("");var f=b(["{@each sub_model_list as item}","<li>",'<a href="#" class="sub_model_item" data_id="${item.id}" data_name="${item.name}">${item.name}</a>',"</li>","{@/each}"].join(""));var j=function(l){return e.invBox({boxCls:"inv_default_skin chk_model_page",content:d,callback:function(){var n=this,m=n.wmBox.find(".nav_tree"),o=n.wmBox.find(".cmp_submodel_list_box"),p=o.find("ul");this.close=this.hide;this.wmBox.on("click",".show_sub_btn",function(){var r=c(this),q=r.closest("dd");q.addClass("show_sub_dd");r.attr("class","iconfont hide_sub_btn").empty().append("&#xf0176;");return false});this.wmBox.on("click",".hide_sub_btn",function(){var r=c(this),q=r.closest("dd");q.removeClass("show_sub_dd");r.attr("class","iconfont show_sub_btn").empty().append("&#xf0175;");return false});this.wmBox.on("click",".f5_tree",function(){a();return false});this.wmBox.on("click",".nav_nide",function(){var q=c(this);m.find(".curr").removeClass("curr");q.addClass("curr");return false});this.wmBox.on("click",".get_sub_model",function(){var r=c(this);var q=r.attr("data_id");h.getModelDetail({id:q,success:function(s){if(s.success){o.find("h3").empty().append(r.attr("data_name"));p.empty().append(f.render(s.success))}},error:function(){}});return false});this.wmBox.on("click",".sub_model_item",function(){var q=c(this);p.find(".curr").removeClass("curr");q.addClass("curr");return false});this.wmBox.on("dblclick",".sub_model_item",function(){n.wmBox.find(".submit").click();return false});this.wmBox.on("click",".submit",function(){var r=n.wmBox.find(".cmp_submodel_list_box"),t=r.find(".curr"),s=t.attr("data_id"),q=t.attr("data_name");var u={id:s,name:q};typeof l.submitCallback==="function"&&l.submitCallback.call(n,u);n.close();return false});a.call(this)}})};exports.create=function(l){return j(c.extend({},l))}});