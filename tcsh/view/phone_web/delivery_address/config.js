seajs.config({
    'base': '/',
    'alias': {
        'domains': 'http://s.tcsh.me/tcsh/model/domains/dist/domains.js',
        'phonePublic': 'http://s.tcsh.me/tcsh/view/phone_web/public/dist/public.js',
        'zepto': 'http://s.tcsh.me/tcsh/model/lib/zepto/seajs-zepto-min.js',
        'touchjs': 'http://s.tcsh.me/tcsh/model/lib/zepto/seajs-touch-min.js',
        'jquery': 'http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js',
        'jquerymobile': 'http://s.tcsh.me/tcsh/model/lib/jquery/jquery.mobile.custom.min.js',
        'wmarea': 'http://s.tcsh.me/tcsh/model/wmarea/dist/wmarea.js',
        'wmverification': 'http://s.tcsh.me/tcsh/model/wmverification/dist/wmverification.js'
    },
    'map': [
       [/^(.*\.(?:css|js))(.*)$/i, '$1?t=2014011101']
    ]
});
(function () {
    var scripts = document.scripts,
       script = scripts[scripts.length - 1],
       boot = script.getAttribute('data-init'),
       dir = script.getAttribute('src');
    dir = dir.slice(0, dir.lastIndexOf('/') + 1);
    seajs.use('zepto', function ($) {
        $(function () {
            seajs.use('phonePublic');
            if (boot) {
                seajs.use(dir + "dist/" + boot);
            }
        });
    });
})();
