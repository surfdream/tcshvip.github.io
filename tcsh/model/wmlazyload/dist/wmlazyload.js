define(function(require,exports,module){var f=require("http://s.tcsh.me/tcsh/model/domains/dist/domains.js");var d=require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js");var b=d(window);var a=function(k){var i=d.extend({lazyloadEle:".lazyload",lazyloadAttrKey:"lazyload_url"},k);var g=d("body").get(0);var h=d(i.lazyloadEle);h.each(function(){d(this).attr("lazyload","t")});var j=function(){var l=g.scrollTop||document.documentElement.scrollTop||window.pageYOffset||0;this.each(function(){var m=d(this),n=parseFloat(m.offset().top);if(n<=l+b.outerHeight()){m.attr("src",m.attr(i.lazyloadAttrKey));m.removeAttr("lazyload")}else{m.data("top",n)}})};h=d(i.lazyloadEle+"[lazyload]");j.call(h);b.on("scroll.lazyload",function(){j.call(d(i.lazyloadEle+"[lazyload]"))})};var c=function(h,i){var g;if(typeof h==="string"){g=d("<div>"+h+"</div>");g.find("img").each(function(){var j=d(this);j.attr("lazyload_url",j.attr("src"));j.attr("src",(i||"http://s.tcsh.me/tcsh/view/public/img/pit.png"));j.addClass("lazyload")});return g.html()}else{throw"lazyload argument exception , not the string parameter !"}};var e=function(h){var g;if(typeof h==="string"){g=d("<div>"+d.trim(h)+"</div>");g.find("img[lazyload_url]").each(function(){var i=d(this);i.attr("src",i.attr("lazyload_url"))});return g.html()}else{throw"lazyload argument exception , not the string parameter !"}};exports.init=function(g){return new a(g)};exports.coding=function(g,h){return c(g,h)};exports.decoding=function(g){return e(g)};exports.triggerLazyload=function(){b.trigger("scroll.lazyload")}});