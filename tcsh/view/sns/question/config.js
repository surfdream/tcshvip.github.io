seajs.config({
    'base': '/',
    'alias': {
        'domains': 'http://s.tcsh.me/tcsh/model/domains/dist/domains.js',
        'public': 'http://s.tcsh.me/tcsh/view/public/dist/public.js',
        'snsPublic': 'http://s.tcsh.me/tcsh/view/sns/public/dist/public.js',
        'jquery': 'http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js',
        'juicer': 'http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js',
        'wmbox': 'http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js',
        'forimg': 'http://s.tcsh.me/tcsh/model/wmforimg/dist/forimg.js',
        'wmtips': 'http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js',
        'wmpage': 'http://s.tcsh.me/tcsh/model/wmpage/dist/wmpage.js',
        'inquire': 'http://s.tcsh.me/tcsh/view/sns/public/wm_inquire/dist/inquire.js',
		'lib':'http://s.tcsh.me/tcsh/model/lib/dist/lib.js',
		'zan':'http://s.tcsh.me/tcsh/view/sns/public/wm_zan/dist/zan.js',
		'modules':'http://s.tcsh.me/tcsh/view/sns/public/wm_sns_juicer/dist/modules.js',
		'lazyload' : 'http://s.tcsh.me/tcsh/model/wmlazyload/dist/wmlazyload.js',
		'friends': 'http://s.tcsh.me/tcsh/view/public/wm_user_relationship/dist/friend.js'
    },
    'map': [
       [/^(.*\.(?:css|js))(.*)$/i, '$1?t=2014071401']
    ]
});
(function () {
    var dev = false,  //上线时，修改为false
		scripts = document.scripts,
		script = scripts[scripts.length - 1],
		boot = script.getAttribute('data-init'),
		dir = script.getAttribute('src')
    ;
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
            seajs.use('snsPublic');
            if (boot) {
                seajs.use(dir + boot);
            }
        });
    });
})();