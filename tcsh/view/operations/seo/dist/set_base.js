define(function(require,exports,module){var j=require("domains");var e=parseInt(Math.random()*10000)+1,h={},c;while(e--){var g=parseInt(Math.random()*10000)+1;if(!h[(g+"").length]){h[(g+"").length]=[]}h[(g+"").length].push(g)}c=h.length;console.log(h);e=parseInt(Math.random()*10000)+1+"";console.log(e);var g=e.length;var f=","+h[g].sort().join(",");console.log("/////////////////////////");var b=function(m,l,n){var k=l.substr(0,n);if(m.indexOf(","+k)>-1){return b(m,l,++n)}else{console.log(","+k);return","+k}};var a=b(f,e,1);a=e==a?a:((a.substr(1,a.length-2)+"9"))-0;if(e==a){alert(a)}else{e=e-0;console.log(e);console.log(a);var d=e;while(a-e){if(f.indexOf(((++a)+""))>-1){console.log("入口："+e);console.log("返回："+a);return false}}}});