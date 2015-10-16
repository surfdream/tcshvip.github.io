seajs.config({
    'alias': {
        'domains': 'http://s.tcsh.me/tcsh/model/domains/dist/domains.js',
        'public': 'http://s.tcsh.me/tcsh/view/public/dist/public.js',
        'agoPublic': 'http://s.tcsh.me/tcsh/view/ago/public/dist/public.js',
        'jquery': 'http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js',
        'juicer': 'http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js',
        'wmbox': 'http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js',
        'fwxy': 'http://s.tcsh.me/tcsh/view/ago/public/wm_dsxy/dist/fwxy.js',
        'dsxy': 'http://s.tcsh.me/tcsh/view/ago/public/wm_dsxy/dist/dsxy.js',
        'wmupload': 'http://s.tcsh.me/tcsh/model/wmupload/dist/wmupload.js',
        'wmverification': 'http://s.tcsh.me/tcsh/model/wmverification/dist/wmverification.js',
        'bankbox': 'http://s.tcsh.me/tcsh/model/wmbank/dist/wmbank_box.js',
        'brand_box': 'http://s.tcsh.me/tcsh/view/public/wm_brand_box/dist/brand_box.js',
        'wmpage': 'http://s.tcsh.me/tcsh/model/wmpage/dist/wmpage.js',
        'wmtips': 'http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js',
        'bank_data': 'http://s.tcsh.me/tcsh/model/wmbank/dist/bank_data.js'
    },
    'map': [
       [/^(.*\.(?:css|js))(.*)$/i, '$1?t=2014042101']
    ]
});
(function () {
    var dev = false, //上线时，修改为false
       scripts = document.scripts,
       script = scripts[scripts.length - 1],
       boot = script.getAttribute('data-init'),
       dir = script.getAttribute("src");

    dir = dir.slice(0, dir.lastIndexOf('/') + 1);
    //dev 
    if (dev) {
        if (location.href.indexOf('debug') === -1) {
            seajs.config({
                'map': [
                   [/^(.*\.(?:css|js))(.*)$/i, '$1?t=' + (+new Date())]
                ]
            });
        }
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
                seajs.use('agoPublic');
            }
            catch (e) {

            }
            finally {
                if (boot) {
                    seajs.use(dir + boot);
                }
            }
        });
    });
})();