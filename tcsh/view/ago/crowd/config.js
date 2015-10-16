seajs.config({
    'base': '/',
    'alias': {
        'domains': 'http://s.tcsh.me/tcsh/model/domains/dist/domains.js',
        'public': 'http://s.tcsh.me/tcsh/view/public/dist/public.js',
        'crowdAgoPublic': 'http://s.tcsh.me/tcsh/view/crowd/ago/public/dist/public.js',
        'jquery': 'http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js',
        'forimg': 'http://s.tcsh.me/tcsh/model/wmforimg/dist/forimg.js',
        'lib': 'http://s.tcsh.me/tcsh/model/lib/dist/lib.js',
        'friend': 'http://s.tcsh.me/tcsh/view/public/wm_user_relationship/dist/friend.js',
        'crowd_type': 'http://s.tcsh.me/tcsh/view/public/wm_crowd_type/dist/crowd_type.js',
        'crowd_data': 'http://s.tcsh.me/tcsh/view/public/wm_crowd_data/dist/crowd_data.js',
        'wmverification': 'http://s.tcsh.me/tcsh/model/wmverification/dist/wmverification.js',
        'wmupload': 'http://s.tcsh.me/tcsh/model/wmupload/dist/wmupload.js',
        'wmbox': 'http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js',
        'friend': 'http://s.tcsh.me/tcsh/view/public/wm_user_relationship/dist/friend.js',
        'search_crowd': 'http://s.tcsh.me/tcsh/view/crowd/public/search_crowd/dist/search_crowd.js',
        'lazyload': 'http://s.tcsh.me/tcsh/model/wmlazyload/dist/wmlazyload.js'
    },
    'map': [
       [/^(.*\.(?:css|js))(.*)$/i, '$1?t=2014102301']
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
            seajs.use('crowdAgoPublic');
            if (boot) {
                seajs.use(dir + boot);
            }
        });
    });
})();