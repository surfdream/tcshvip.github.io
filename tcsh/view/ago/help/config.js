seajs.config({
    'base': '/',
    'alias': {
        'domains': 'http://s.tcsh.me/tcsh/model/domains/dist/domains.js',
        'public': 'http://s.tcsh.me/tcsh/view/public/dist/public.js',
        'agoPublic': 'http://s.tcsh.me/tcsh/view/ago/public/dist/public.js',
        'jquery': 'http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js',
        'juicer': 'http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js',
        'lib': 'http://s.tcsh.me/tcsh/model/lib/dist/lib.js',
        'wmupload': 'http://s.tcsh.me/tcsh/model/wmupload/dist/wmupload.js',
        'wmbox': 'http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js',
        'wmverification': 'http://s.tcsh.me/tcsh/model/wmverification/dist/wmverification.js',
        'wmtips': 'http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js',
        'area': 'http://s.tcsh.me/tcsh/model/wmarea/dist/wmarea.js',
        'wmpage': 'http://s.tcsh.me/tcsh/model/wmpage/dist/wmpage.js',
        'bankbox': 'http://s.tcsh.me/tcsh/model/wmbank/dist/wmbank_box.js',
        'wmshowartwork': 'http://s.tcsh.me/tcsh/model/wmshowartwork/dist/wmshowartwork.js',
        'top_data': 'http://s.tcsh.me/tcsh/view/ago/public/wm_top_data/dist/top_data.js',
        'brand_box': 'http://s.tcsh.me/tcsh/view/public/wm_brand_box/dist/brand_box.js'
    },
    'map': [
       [/^(.*\.(?:css|js))(.*)$/i, '$1?t=2014032001']
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
            try {
                global_setting && seajs.use('agoPublic');
            } catch (e) {

            }
            if (boot) {
                seajs.use(dir + boot);
            }
        });
    });
})();
