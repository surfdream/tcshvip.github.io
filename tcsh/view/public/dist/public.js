define(function(require,exports,module){var j=require("http://s.tcsh.me/tcsh/model/domains/dist/domains.js");var e=require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),h=require("http://s.tcsh.me/tcsh/model/lib/dist/lib.js");require("http://s.tcsh.me/tcsh/model/wmprt/dist/wmprt.js");var d=e.browser.msie&&e.browser.version==="6.0";var a=e(window),c=e("body"),f=c.get(0);var b=function(l){var m,k;if(d){k=a.height();m=c.find(".go_top");m.length&&a.on("scroll.fixed"+(l||Math.random()*9999),function(){var o=e(this),n=Math.random()*99999;o.data("fixed_t",n);(function(p){setTimeout(function(){if(p==o.data("fixed_t")){var q=f.scrollTop||document.documentElement.scrollTop||window.pageYOffset||0;m.animate({top:q+600})}},500)})(n)})}};var i=function(){c.append('<a href="#" class="go_top" title="回到顶部" style="display: none;"></a>');b("go_top");g();try{var m=(("https:"==document.location.protocol)?" https://":" http://");c.append("<span id='cnzz_stat_icon_1252994918'></span>");var l=document.createElement("script");l.type="text/javascript";l.async=true;l.src=m+"s22.cnzz.com/z_stat.php?id=1252994918";var k=document.getElementsByTagName("script")[0];k.parentNode.insertBefore(l,k)}catch(n){}};var g=function(){var k=e("body,html"),l=c.find(".go_top");a.on("scroll.showGoTop",function(){var m=f.scrollTop||document.documentElement.scrollTop||window.pageYOffset||0;if(m>=1500){l.fadeIn(500)}if(m<=500){l.fadeOut(300)}});c.on("click",".go_top",function(){k.animate({scrollTop:0});return false})};i()});