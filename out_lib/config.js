;
/*body标签结束之前，不要放在head中*/
(function (url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    }
    else { //Others: Firefox, Safari, Chrome, and Opera
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    document.body.appendChild(script);
})('http://s.tcsh.me/out_lib/dist/sea.js', function () {
    seajs.config({
        map: [
            [ /^(.*\.(?:css|js))(.*)$/i, '$1?t=20130410']
        ]
    })
    seajs.use('http://s.tcsh.me/out_lib/dist/forGet.js', function (info) {
        info.init();
    });
});