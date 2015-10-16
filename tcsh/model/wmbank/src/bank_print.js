/*
此文件随便玩
*/
define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js');
    var returnArr = [];
    var xmlDoc;
    // code for IE
    if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    }
        // code for Mozilla, Firefox, Opera, etc.
    else if (document.implementation.createDocument) {
        xmlDoc = document.implementation.createDocument("", "", null);
    }
    else {
        alert('Your browser cannot handle this script');
    }
    xmlDoc.async = false;
    xmlDoc.load("xml/IbpsBankTypeInfoConf9.xml");

    var x = xmlDoc.getElementsByTagName("ibps");
    var _data = {};
    //returnArr.push('var x=[<br>');
    //for (var i in x) {
    //    var xxx = "{"
    //    if (x[i] && x[i].attributes) {
    //        xxx += "id:'" + x[i].attributes.getNamedItem("code").value + "',";
    //        xxx += "name:'" + x[i].getElementsByTagName("name")[0].attributes.getNamedItem("cn").value + "'},<br>";
    //        returnArr.push(xxx);
    //    } 
    //}
    //returnArr.push(']');
    returnArr.push('var x={<br>');
    for (var i in x) {
        var xxx = ""
        if (x[i] && x[i].attributes) {
            xxx += "'" + x[i].attributes.getNamedItem("code").value + "':";
            xxx += "'" + x[i].getElementsByTagName("name")[0].attributes.getNamedItem("cn").value + "',<br>";
            returnArr.push(xxx);
        }
    }
    returnArr.push('}');

    $("body").append(returnArr.join(''))
});
