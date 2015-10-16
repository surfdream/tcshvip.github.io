seajs.config({
    'alias': {
        'domains': 'http://s.tcsh.me/tcsh/model/domains/dist/domains.js',
        'public': 'http://s.tcsh.me/tcsh/view/public/dist/public.js',
        'operationsPublic': 'http://s.tcsh.me/tcsh/view/operations/public/dist/public.js',
        'jquery': 'http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js',
        'lib': 'http://s.tcsh.me/tcsh/model/lib/dist/lib.js',
        'juicer': 'http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js',
        'wmbox': 'http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js',
        'verification': 'http://s.tcsh.me/tcsh/model/wmverification/dist/wmverification.js',
        'classbox': 'http://s.tcsh.me/tcsh/model/wmclassbox/dist/classbox.js',
        'inputdown': 'http://s.tcsh.me/tcsh/model/wminputdown/dist/wminputdown.js',
        'wmpage': 'http://s.tcsh.me/tcsh/model/wmpage/dist/wmpage.js'
    },
    'map': [
       [/^(.*\.(?:css|js))(.*)$/i, '$1?t=2014052202']
    ]
});
(function () {
    var dev = false, //上线时，修改为false
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
            seajs.use('operationsPublic');
            if (boot) {
                seajs.use(dir + boot);
            }
        });
    });
})();
