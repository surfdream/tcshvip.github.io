define(function(require,exports,module){var j=require("domains");var c=require("jquery"),h=require("lib"),d=require("wmbox"),a=require("verification"),b=require("juicer"),g=require("wmpage"),e=require("api");var i=function(){a.strikingSuccess=false;if(global_setting&&global_setting.PageInfo){var k=g.Create({url:global_setting.PageInfo.url,element:".wm_page",index:global_setting.PageInfo.Index,sum:global_setting.PageInfo.TotalItems,size:global_setting.PageInfo.Size,front:true,param:global_setting.PageInfo.param,pagekey:global_setting.PageInfo.pageKey})}f()};var f=function(){var n=c(".user"),l=n.find(".user_list").find("tbody");var p=b(['<div class="ids_main">','<div class="ids_head">',"<h3>添加账号</h3>",'<a href="#" class="iconfont close">&#xf00b3;</a>',"</div>",'<div class="ids_con">','<ul class="wm_form">','<li class="form_row">','<label class="row_key"><b class="form_must">*</b>账号：</label>','<input type="text" class="form_txt account" wmv="empty" wmvmsg="账号不能为空！" name="account_${m}" />','<span for="account_${m}"></span>',"</li>",'<li class="form_row">','<label class="row_key">姓名：</label>','<input type="text" class="form_txt user_name" />',"</li>",'<li class="form_row">','<label class="row_key">默认密码：</label>',"888888","</li>",'<li class="form_row">','<label class="row_key">&nbsp;</label>','<a href="#" class="ui_btn ui_btn_h33gray15 submit"><span class="ui_btn_txt">确定</span></a>','<a href="#" class="ui_btn ui_btn_h33gray15 close"><span class="ui_btn_txt">取消</span></a>',"</li>","</ul>","</div>","</div>"].join(""));var k=b(['<div class="ids_main">','<div class="ids_head">',"<h3>${accountName}-分配用户组</h3>",'<a href="#" class="iconfont close">&#xf00b3;</a>',"</div>",'<div class="ids_con">','<div class="group_list_box">','<ul class="box_head">','<li class="w50">选择</li>','<li class="w100">组</li>',"<li>用户组说明</li>","</ul>",'<div class="group_list" data_account_id="${accountId}"></div>','<div class="btns">','<a href="#" class="ui_btn ui_btn_h33gray15 submit"><span class="ui_btn_txt">确定</span></a>','<a href="#" class="ui_btn ui_btn_h33gray15 close"><span class="ui_btn_txt">取消</span></a>',"</div>","</div>","</div>","</div>"].join(""));var m=b(["{@each roleList as item}",'<ul data_account_id="${item.id}" class="group_row">','<li class="w50"><span class="chkbox iconfont">&#xf00b2;</span></li>','<li class="w100">${item.name}</li>',"<li>${item.remark}</li>","</ul>","{@/each}",].join(""));var o=function(q){return d.invBox({boxCls:"inv_default_skin",content:p.render(c.extend({m:parseInt(Math.random()*99999)+9999},q)),callback:function(){var r=this,t=this.wmBox.find(".wm_form"),s=t.attr("data_account_id");this.close=this.hide;a.init(t);this.wmBox.on("click",".submit",function(){var u=t.find(".account").val(),v=t.find(".user_name").val();if(a.verify(t)){e.addAcc({account:encodeURIComponent(u),name:encodeURIComponent(v),success:function(w){if(w.success){alert("添加成功！")}else{alert(w.error||"添加失败！")}},error:function(){alert("系统繁忙！")}})}return false})}})};n.on("click",".add_user",function(){var r=c(this),q=r.data("accountBox");if(!q){q=o();r.data("accountBox",q)}q.show();return false});n.on("click","tr",function(){c(this).toggleClass("curr");if(l.find("tr").length!==l.find(".curr").length){n.find(".chkall").closest("tr").removeClass("curr")}else{n.find(".chkall").closest("tr").addClass("curr")}});n.on("click",".chkall",function(){var q=c(this);if(q.closest("tr").toggleClass("curr").hasClass("curr")){l.find("tr").addClass("curr")}else{l.find("tr").removeClass("curr")}return false});n.on("click",".del_account",function(){var r=c(this),q=r.closest("tr");if(confirm("确定要删除账号？删除后无法恢复")){e.delAcc({id:q.attr("data_account_id"),success:function(s){if(s.success){window.location.reload()}else{alert(s.error||"删除失败！")}},error:function(){alert("系统繁忙！")}})}return false});n.on("click",".group_to_account",function(){var r=c(this),q=r.closest("tr"),u=q.attr("data_account_id"),t=q.attr("data_account_name"),s=r.data("gtaBox");if(!s){s=d.invBox({boxCls:"inv_default_skin group_to_acc",content:k.render({accountId:u,accountName:t}),callback:function(){var w=this;this.close=this.hide;var v=w.wmBox.find(".group_list");this.wmBox.on("click",".submit",function(){var x=[];v.find(".curr").each(function(){x.push(c(this).attr("data_account_id"))});e.groupToAcc({accId:u,groupIds:JSON.stringify(x),success:function(y){if(y.success){alert("分配成功！");window.location.reload()}else{alert(y.error||"分配失败！")}},error:function(){alert("系统繁忙！")}});return false});this.wmBox.on("click",".group_row",function(){c(this).toggleClass("curr");return false});e.getGroupList({success:function(){},error:function(){var x={};x.roleList=[{id:1,name:"管理员",remark:"分组备注"},{id:2,name:"运营",remark:"分组备注"},{id:3,name:"程序员",remark:"分组备注"},{id:1,name:"管理员",remark:"分组备注"},{id:2,name:"运营",remark:"分组备注"},{id:3,name:"程序员"},{id:1,name:"管理员",remark:"分组备注"},{id:2,name:"运营"},{id:3,name:"程序员",remark:"分组备注"},{id:1,name:"管理员"},{id:2,name:"运营",remark:"分组备注"},{id:3,name:"程序员"},{id:1,name:"管理员",remark:"分组备注"},{id:2,name:"运营",remark:"分组备注"},{id:3,name:"程序员"},{id:1,name:"管理员",remark:"分组备注"},{id:2,name:"运营",remark:"分组备注"},{id:3,name:"程序员",remark:"分组备注"}];v.empty().append(m.render(x));w.position()}})}});r.data("gtaBox",s)}s.show();return false});n.on("click",".re_password",function(){var r=c(this),q=r.closest("tr");e.rePassWord({id:q.attr("data_account_id"),success:function(s){if(s.success){alert("账号："+q.attr("data_account_name")+",密码重置成功！")}else{alert(s.error||"重置失败！")}},error:function(){alert("系统繁忙！")}});return false});n.on("click",".disabled_account",function(){var r=c(this),q=r.closest("tr");e.disabledAcc({id:q.attr("data_account_id"),success:function(s){if(s.success){alert("账号："+q.attr("data_account_name")+",已禁用！");window.location.reload()}else{alert(s.error||"禁用失败！")}},error:function(){alert("系统繁忙！")}});return false});n.on("click",".open_account",function(){var r=c(this),q=r.closest("tr");e.openAcc({id:q.attr("data_account_id"),success:function(s){if(s.success){alert("账号："+q.attr("data_account_name")+",已启用！");window.location.reload()}else{alert(s.error||"启用失败！")}},error:function(){alert("系统繁忙！")}});return false})};i()});