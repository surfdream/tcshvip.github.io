define(function(require,exports,module){var a=require("domains");var b=require("jquery");var c=function(){d()};var d=function(){var f=b("#page"),e=f.find(".categories_list");var h=['<li class="sub_item clearfix">','<div class="body_name">','<span class="sub_ico">┣</span> ','<input type="text" class="name_txt" placeholder="分类名称" />',"</div>",'<span class="body_date">&nbsp;</span>','<div class="btn_list">','<a href="#" class="link remove_sub_item">删除</a>',"</div>","</li>"].join("");var g=['<li class="categories_item clearfix">','<div class="body_name">','<span class="iconfont">&#xf0131;</span> ','<input type="text" class="name_txt" placeholder="分类名称" />',"</div>",'<span class="body_date">&nbsp;</span>','<div class="btn_list">','<a href="#" class="link add_sub">添加下级<span class="wm_ico arrow7down"></span></a>',"<ul>",'<li class="btn_list_last">','<a href="#" class="add_sub">添加下级</a>',"</li>",'<li class="btn_list_end">','<a href="#" class="remove_categories_item" >删除</a>',"</li>","</ul>","</div>",'<ul class="sub_list"></ul>',"</li>"].join("");f.on("click",".zoom_btn",function(){var j=b(this),i=j.closest(".categories_item");if(i.hasClass("show_sub")){if(!i.find(".remove2").length){i.removeClass("show_sub");j.empty().append("&#xe607;")}}else{i.addClass("show_sub");j.empty().append("&#xe623;")}return false});f.on("click",".add_categories_item",function(){e.append(g);return false});f.on("click",".add_sub",function(){var k=b(this),i=k.closest(".categories_item"),j=i.find(".sub_list");if(!i.hasClass("show_sub")){i.find(".zoom_btn").empty().append("&#xe623;");i.addClass("show_sub")}j.append(h);return false});f.on("click",".remove_categories_item",function(){b(this).closest(".categories_item").remove();return false});f.on("click",".remove_sub_item",function(){b(this).closest(".sub_item").remove();return false});f.on("click",".del_categories_item",function(){var j=b(this),i=j.closest(".categories_item");if(i.hasClass("show_sub")){i.find(".zoom_btn").empty().append("&#xe607;");i.removeClass("show_sub")}i.append('<div class="mask remove1"><p class="msg">保存后彻底删除，删除后将无法恢复！<a href="#" class="revocation revocation1">撤销删除</a></p></div>');i.addClass("oh");setTimeout(function(){i.removeClass("oh")},200);return false});f.on("click",".revocation1",function(){var j=b(this),i=j.closest(".categories_item");i.find(".remove1").remove();if(i.find(".remove2").length){i.find(".zoom_btn").empty().append("&#xe623;");i.addClass("show_sub")}return false});f.on("click",".del_sub_item",function(){var j=b(this),i=j.closest(".sub_item");i.append('<div class="mask remove2"><p class="msg">保存后彻底删除，删除后将无法恢复！<a href="#" class="revocation revocation2">撤销删除</a></p></div>');return false});f.on("click",".revocation2",function(){var j=b(this),i=j.closest(".sub_item");i.find(".remove2").remove();return false});f.on("click",".submit",function(){var i={};i.addData={};i.editData={};i.removeData=[];f.find(".categories_item").each(function(){var l=b(this);var k=l.attr("data_id"),j=encodeURIComponent(l.find(".name_txt:eq(0)").val());if(k){if(l.find(".remove1").length){i.removeData.push(k)}else{i.editData[k]={id:k,name:j,sub_list:[]};l.find(".sub_item").each(function(){var o=b(this);var n=o.attr("data_id"),p=o.closest(".categories_item").attr("data_id"),m=encodeURIComponent(o.find(".name_txt:eq(0)").val());if(n){if(o.find(".remove2").length){i.removeData.push(n)}else{i.editData[p]&&i.editData[p].sub_list.push({id:n,name:m})}}else{i.editData[p]&&i.editData[p].sub_list.push({name:m})}})}}else{i.addData[j]={name:j,sub_list:[]};l.find(".sub_item").each(function(){var o=b(this);var m=o.find(".name_txt:eq(0)").val(),n=o.closest(".categories_item").find(".name_txt:eq(0)").val();i.addData[n]&&i.addData[n].sub_list.push({name:m})})}});b.ajax({url:a.operator+"/commune/category/update.json",data:{addData:JSON.stringify(i.addData),editData:JSON.stringify(i.editData),removeData:JSON.stringify(i.removeData)},dataType:"json",success:function(j){if(j.success){window.location.reload()}else{alert(j.error||"添加失败！")}},error:function(){alert("系统繁忙！")}});return false})};c()});