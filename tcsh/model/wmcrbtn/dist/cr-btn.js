define(function(require,exports,module){var f=require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),e=require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js");var c='<div class="cr-btn"><ul class="sliding-range"></ul></div>',i=e('<li _value="${itemvalue}"><a href="#" class="text ${isactive} ${isdisabled}" title=${itemtext}>${itemtext}</a></li>'),h='<li class="block"><a href="#"></a></li>';var b={radio:function(){return this.find(".active").closest("li").attr("_value")},checkbox:function(){var k=[];this.find(".active").each(function(){k.push(f(this).closest("li").attr("_value"))});return{stringVal:k.join(","),arrayVal:k}},radiotext:function(){return f.trim(this.find(".active").closest("li").text())},checkboxtext:function(){var k=[];this.find(".active").each(function(){k.push(f.trim(f(this).closest("li").text()))});return{stringVal:k.join(","),arrayVal:k}}};var d=function(l){var k={radio:function(){return new g(l.element)},checkbox:function(){return new g(l.element)},tworadio:function(){return new j(l.element)}};return k[l.type]()};var a=function(){this.setSkin=function(k){if(!this.hasClass(k)){this.addClass(k)}};this.setDom=function(k){this.each(function(){var l=f(this);k.append(i.render({itemvalue:l.val(),itemtext:l.attr("title"),isactive:l.attr("checked")?"active":"",isdisabled:l.attr("disabled")?"noactive":"",}))})};this.show=function(k){this.show(0,k)};this.hide=function(k){this.hide(0,k)};this.remove=function(k){this.container.remove();if(k){this.$.remove()}}};var j=function(t){var o,s=this,n,r,p,l,k=false,q;n=t;o=n.constructor==jQuery?n:f(n);r=o.eq(0);p=o.length;q=new a();var m=function(u){s.container.attr("title",u)};this.$=o;this.container;this.init=function(u){var v;l=u;if(!r.prev(".cr-btn").length){r.before(c)}s.container=r.prev(".cr-btn");v=s.container.find(".sliding-range");v.html("");q.setDom.call(o,v);v.append(h);s.container.addClass(u.delaultVal?"yes":"no");s.container.addClass(u.appendClass||"");m(u.delaultVal?(u.trueTitle||""):(u.flaseTitle||""));s.container.click(function(w){$this=f(this);$this.toggleClass("yes");$this.toggleClass("no")});s.container.click(function(w){$this=f(this);if($this.hasClass("yes")){m(u.trueTitle||"");if(typeof u.trueCallback==="function"){u.trueCallback.call(s)}}else{m(u.falseTitle||"");if(typeof u.falseCallback==="function"){u.falseCallback.call(s)}}});o.css("display","none");q.setSkin.call(s.container,u.skinName);s.init=null};this.setFalse=this.setfalse=function(){if(k){return}s.container.removeClass("yes").addClass("no");m(l.falseTitle||"");if(typeof l.falseCallback==="function"){l.falseCallback.apply(s,arguments)}};this.setTrue=this.settrue=function(){if(k){return}s.container.removeClass("no").addClass("yes");m(l.trueTitle||"");if(typeof l.trueCallback==="function"){l.trueCallback.apply(s,arguments)}};this.remove=function(u){q.remove.call(s,u);k=true};this.hide=function(u){if(k){return}q.hide.call(s.container,u)};this.show=function(u){if(k){return}q.show.call(s.container,u)};this.reset=function(){}};var g=function(s){var n,r=this,l,m,q,o,k=false,p;l=s;n=l.constructor==jQuery?l:f(l);q=n.eq(0);m=n.attr("type");o=n.length;p=new a();this.$=n;this.init=function(t){var u;if(!q.prev(".cr-btn").length){q.before(c)}r.container=q.prev(".cr-btn");r.container.addClass(t.appendClass||"");u=r.container.find(".sliding-range");p.setDom.call(n,u);t.skinName=(t.type+"")[0]+"-"+t.skinName;if(t.type==="radio"){r.container.delegate(".text:not(.noactive)","click",function(v){var w=f(this);u.find(".active").removeClass("active");w.toggleClass("active");v.preventDefault()});r.container.delegate(".text:not(.noactive)","click",function(){if(typeof t.callBack==="function"){t.callBack.call(r)}})}else{r.container.delegate(".text:not(.noactive)","click",function(v){var w=f(this);w.toggleClass("active");v.preventDefault()});r.container.delegate(".text:not(.noactive)","click",function(){if(typeof t.callBack==="function"){t.callBack.call(r)}})}r.container.delegate(".text.noactive","click",function(v){if(typeof t.disabledCallback==="function"){t.disabledCallback.call(r)}v.preventDefault()});n.css("display","none");u.find("li:first").addClass("cr-first");u.find("li:last").addClass("cr-last");p.setSkin.call(r.container,t.skinName);r.init=null};this.val=function(t,u){var w="string|number|boolean",v;if(u===true){r.container.find("li[_value] .text").removeClass("active")}if(w.indexOf(typeof t)>=0){r.container.find("li[_value='"+(t+"")+"'] .text").click();return this}if(t&&t.constructor==Array){if(m=="checkbox"){v=t.length;while(v--){(function(x){setTimeout(function(){if(w.indexOf(typeof t[x])>=0){r.container.find("li[_value='"+(t[x]+"")+"'] .text:not(.noactive)").removeClass("active").addClass("active")}},10)})(v)}}if(m=="radio"){r.container.find("li[_value='"+(t[t.length-1]+"")+"'] .text").click()}return this}if(t&&t.constructor==Object&&t.val&&t.text){r.container.find("li[_value='"+(t.val+"")+"'] .text").html(t.text).attr("title",t.text).click()}return b[m].call(r.container)};this.getText=function(){return b[m+"text"].call(r.container)};this.remove=function(t){p.remove.call(r,t);k=true};this.hide=function(t){if(k){return}p.hide.call(r.container,t)};this.show=function(t){if(k){return}p.show.call(r.container,t)};this.reset=function(){}};exports.init=function(p,o){var n,l,k={type:"radio",skinName:"delault"};k=f.extend(k,o);if(typeof p==="string"||p.constructor==jQuery){k.element=p;k=f.extend(k,o)}else{k=f.extend(k,p)}var m=d(k);m.init(k);return m}});