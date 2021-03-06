﻿seajs.config({
    'base': '/',
    'alias': {
        'domains': 'http://s.tcsh.me/tcsh/model/domains/dist/domains.js',
        'public': 'http://s.tcsh.me/tcsh/view/public/dist/public.js',
        'buyersPublic': 'http://s.tcsh.me/tcsh/view/buyers/public/dist/public.js',
        'jquery': 'http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js',
        'wmtips': 'http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js',
        'wmpage': 'http://s.tcsh.me/tcsh/model/wmpage/dist/wmpage.js'
    },
    'map': [
       [/^(.*\.(?:css|js))(.*)$/i, '$1?t=2014011101']
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
            seajs.use('buyersPublic');
            if (boot) {
                seajs.use(dir + boot);
            }
        });
    });
})();
