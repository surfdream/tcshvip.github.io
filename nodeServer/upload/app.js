var formidable = require('formidable'),
    http = require('http'),
    sys = require('sys');
exports.default = function (req, res) {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(
        '<form action="/uploadform" enctype="multipart/form-data" ' +
            'method="post">' +
            '<input type="text" name="title"><br>' +
            '<input type="file" name="upload" multiple="multiple"><br>' +
            '<input type="submit" value="Upload">' +
            '</form>'
    );
};
exports.upload = function (req, res) {
    // parse a file upload  
    var form = new formidable.IncomingForm();
    //这里formidable会对upload的对象进行解析和处理  
    form.parse(req, function (err, fields, files) {
        res.end(JSON.stringify({url:""}));
        res.end("上传成功");
    });
};