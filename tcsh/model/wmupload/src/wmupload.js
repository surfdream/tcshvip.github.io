﻿/*
setUploadUrl：设置提交url
upload：异步提交
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js");
    require('http://s.tcsh.me/tcsh/model/wmupload/css/style.css#');
    var wmupload = function () {
        var self = this;
        var $form = $("#wmuploadform"), $body = $("body"), $getDataIframe = $("#wmuploadiframe"), $wmuploadfile, _loadCallbak, _successCallback, _errorCallback;
        if (!$form.length) {
            $form = $('<form id="wmuploadform" enctype="multipart/form-data" method="post" action="' + domains.item + '/product/uploadpic" target="wmuploadiframe" style="display: none;"></form>');
            $body.append($form);
        }
        if (!$getDataIframe.length) {
            $getDataIframe = $('<iframe id="wmuploadiframe" name="wmuploadiframe" style="display: none;"></iframe>');
            $body.append($getDataIframe);
        }
        $getDataIframe.load(function () {
            var _data;
            try {
                var _iframedoc = $("#wmuploadiframe")[0].contentWindow.document;
                _data = eval("(" + $.trim($(_iframedoc).find("pre").html()) + ")");
                _data.upLoadSuccess = true;
                typeof _successCallback === "function" && _successCallback(_data);
            }
            catch (e) {
                _data = { "meta": { "code": 200 }, "response": { "name": "", "imgurl": "" } };
                _data.upLoadSuccess = false;
                typeof _errorCallback === "function" && _errorCallback(_data);
            }
            finally {
                typeof _loadCallbak === "function" && _loadCallbak(_data);
            }
        });

        this.setUploadUrl = function (url, data) {
            $form.attr('action', url + $.param(data || {}));
        };
        this.upload = function (file, callback) {
            var $up_loading, _setInterval;
            if (typeof callback !== "function") { return false; }
            var _v = file.val();
            if (_v) {
                $up_loading = $('<div class="up_loading"><img src="http://s.tcsh.me/tcsh/model/wmupload/img/up_loading.png" title="文件正在上传"></div>');
                $body.append($up_loading);
                $up_loading.css({ right: ($body.find(".up_loading").length - 1) * 80 + 20 }).animate({ bottom: 0 }, 1200);
                _setInterval = setInterval(function () {
                    $up_loading.find("img").css("bottom", -80).animate({ bottom: 80 }, 1000);
                }, 1200);
                _successCallback = function () {
                    clearInterval(_setInterval);
                    $up_loading.css("text-align", "center").empty().append("上传完成");
                    setTimeout(function () {
                        $up_loading.animate({ bottom: -80 }, function () { $(this).remove() });
                    }, 1500);
                };
                _errorCallback = function () {
                    clearInterval(_setInterval);
                    $up_loading.css({ "text-align": "center", "background": "#CC0000" }).empty().append("上传失败");
                    setTimeout(function () {
                        $up_loading.animate({ bottom: -80 }, function () { $(this).remove() });
                    }, 1500);
                };
            }
            var $clone = file.clone(true);
            _loadCallbak = function (data) {
                callback.call($clone, data);
            };
            file.after($clone);
            file.attr("name", "file_key");
            $form.empty().append(file);
            $form.append('<input type="hidden" name="suffix" value="' + _v.substr(_v.lastIndexOf(".") + 1).toLowerCase() + '" />');
            //setTimeout(function () {
            try {
                if (_v) {
                    $form[0].submit();
                } else {
                    _loadCallbak({ "meta": { "code": 200 }, "response": { "name": "", "imgurl": "" } });
                }
            }
            catch (e) {
                _errorCallback();
            }
            finally {
                $form.empty();
            }
            //}, 1);
        };
        this.queueUpLoad = function (files, callback, itemCallback) {
            var _queue = [], uploadCallback, retData = [];
            files.each(function () {
                _queue.push($(this));
            });
            uploadCallback = function () {
                if (_queue.length) {
                    self.upload(_queue.shift(), function (data) {
                        retData.push(data);
                        typeof itemCallback === "function" && itemCallback.call(this, data);
                        uploadCallback();
                    })
                } else {
                    callback(retData);
                }
            }
            uploadCallback();
        };
    };
    return new wmupload();
});