define(function(require,exports,module){var a=require("domains");var c=require("jquery"),b=require("wmpage");require("core-css");require("theme-css");require("datepicker-css");require("jquery.ui.core")(c);require("jquery.ui.widget")(c);require("jquery.ui.datepicker")(c);require("datepicker-zh-CN")(c);var d=function(){var f=b.Create({url:global_setting.pageURL,element:".wm_page",size:global_setting.pageSize,index:global_setting.pageIndex,sum:global_setting.totalcount,pagekey:global_setting.pageKey,param:global_setting.param,front:true});e()};var e=function(){var h=true;var f=c("#page"),g=f.find(".sel_location");f.find(".show_sdate,.show_edate,.submit_sdate,.submit_edate").datepicker({onClose:function(i,j){if(!(/\d{4}-\d{2}-\d{2}/.test(i))){j.input.val("")}}});f.find(".sel_channel").on("change",function(){var k=c(this);_url=k.find("option:selected").attr("page_url");_data=global_setting.urlList[_url].data,_arr=['<option value="0">-全部-</option>'];for(var j in _data){_arr.push('<option value="'+_data[j].id+'">'+_data[j].adName+"</option>")}g.empty().append(_arr.join(""));h&&global_setting&&global_setting.param&&global_setting.param.locationName&&g.val(global_setting.param.locationName);h=false});f.find(".sel_channel").change()};d()});