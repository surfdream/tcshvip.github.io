define(function(require,exports,module){var j=require("http://s.tcsh.me/tcsh/model/domains/dist/domains.js");var e=require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),d=require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),g=require("http://s.tcsh.me/tcsh/model/lib/dist/lib.js");require("../css/style.css");var a;var c=e("body");var f=function(k){if(global_setting&&global_setting.qqServer&&global_setting.qqServer.sellerid){if(!a){e.ajax({url:j.api2+"/user/qq.json",type:"get",dataType:"jsonp",data:{sellerid:global_setting.qqServer.sellerid},success:function(l){typeof k==="function"&&k(l)},error:function(){}})}else{typeof k==="function"&&k(data)}}};var h=function(){f()};var b=d(['<div class="qq_srever_box">','<div class="qq_srever_head">',"<h3>在线客服</h3>","</div>",'<div class="qq_server_con">','<ul class="qq_list">',"{@each linkQQ as item,index}","<li>",'<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=${linkQQ[index]}&site=qq&menu=yes">','<img border="0" src="http://wpa.qq.com/pa?p=2:${linkQQ[index]}:51" alt="点击这里给我发消息" title="点击这里给我发消息" /></a>',"</li>","{@/each}","</ul>","{@if linkPhone}",'<ul class="link_phone">','<li class="title">',"<h3>咨询热线：</h3>","</li>","{@each linkPhone as item,index}","<li>${linkPhone[index]}</li>","{@/each}","</ul>","{@/if}","</div>","</div>"].join(""));var i=function(){f(function(k){if(k.linkQQ.length){c.append(b.render(k))}})};h();exports.Create=function(){i()};exports.getData=function(k){f(k)}});