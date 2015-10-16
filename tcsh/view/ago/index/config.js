seajs.config({
    'base': '/',
    'alias': {
        'domains': 'http://s.tcsh.me/tcsh/model/domains/dist/domains.js',
        'public': 'http://s.tcsh.me/tcsh/view/public/dist/public.js',
        'agoPublic': 'http://s.tcsh.me/tcsh/view/ago/public/dist/public.js',
        'jquery': 'http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js',
        'juicer': 'http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js',
        'lib': 'http://s.tcsh.me/tcsh/model/lib/dist/lib.js',
        'wmtips': 'http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js',
        'wmforimg': 'http://s.tcsh.me/tcsh/model/wmforimg/dist/forimg.js',
        'wmlazyload': 'http://s.tcsh.me/tcsh/model/wmlazyload/dist/wmlazyload.js',
        'loginBox': 'http://s.tcsh.me/tcsh/model/wmloginbox/dist/wmloginbox.js',
        'dsxy': 'http://s.tcsh.me/tcsh/view/ago/public/wm_dsxy/dist/dsxy.js',
        "wmas": 'http://s.tcsh.me/tcsh/view/ago/public/wm_as/dist/as.js'
    },
    'map': [
       [/^(.*\.(?:css|js))(.*)$/i, '$1?t=2014091601']
    ]
});
(function () {
    var dev = true, //上线时，修改为false
       scripts = document.scripts,
       script = scripts[scripts.length - 1],
       boot = script.getAttribute('data-init'),
       dir = script.getAttribute('src');

    dir = dir.slice(0, dir.lastIndexOf('/') + 1);
    //dev 
    if (dev) {
        dir = dir + 'src/';
    } else {
        dir = dir + 'dist/';
    }
    /*
     * 上面获取路径脚本需要立刻执行
     * 将加载脚本放到domReady后执行，避免ie浏览器终止操作错误
     */
    seajs.use('jquery', function ($) {        
        $(function () {
            seajs.use('public');
            seajs.use('agoPublic');
            if (boot) {
                seajs.use(dir + boot);
            }
        });
    });
})();
