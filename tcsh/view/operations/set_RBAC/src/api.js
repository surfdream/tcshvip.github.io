define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib")
    ;
    //添加模块
    var _addModel = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/module/add",
            data: {
                parentid: op.parent_id || "",
                name: op.name,
                remark: op.remark
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //编辑模块
    var _editModel = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/module/modify",
            data: {
                id: op.id,
                name: op.name,
                remark: op.remark
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //删除模块
    var _delModel = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/module/delete",
            data: {
                id: op.id
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //添加导航节点
    var _addNavNode = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/privilege/addnode",
            data: {
                parentid: op.parent_id || "",
                name: op.name,
                remark: op.remark
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //编辑导航节点
    var _editNavNode = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/privilege/modifynode",
            data: {
                id: op.id,
                module_id: op.module_id,
                name: op.name,
                remark: op.remark
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //删除导航节点
    var _delNavNode = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/privilege/deletenode",
            data: {
                id: op.id
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //添加角色
    var _addRole = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/role/add",
            data: {
                name: op.role_name,
                remark: op.role_remark
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //编辑角色
    var _editRole = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/role/modify",
            data: {
                id: op.role_id,
                name: op.role_name,
                remark: op.role_remark
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //编辑角色的权限
    var _roleEditCompetence = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/role/privilege",
            data: {
                roleId: op.roleId,
                asList: op.asList
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //删除角色
    var _delRole = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/role/delete",
            data: {
                id: op.id
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //添加页面
    var _addPage = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/module/addpage",
            data: {
                classId: op.modelId || "",
                name: op.name,
                url: op.url,
                remark: op.remark
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //编辑页面
    var _editPage = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/module/modifypage",
            data: {
                id: op.id,
                classId: op.modelId,
                name: op.name,
                url: op.url,
                remark: op.remark
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //删除页面
    var _delPage = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/module/deletepage",
            data: {
                id: op.id
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //添加分组
    var _addGroup = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/group/add",
            data: {
                name: op.group_name,
                remark: op.group_remark
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //编辑分组
    var _editGroup = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/group/modify",
            data: {
                id: op.group_id,
                name: op.group_name,
                remark: op.group_remark
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //删除分组
    var _delGroup = function (op) {
        $.ajax({
            url: "",
            data: {
                id: op.id
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //将角色分配到分组
    var _roleToGroup = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/group/setrole",
            data: {
                groupId: op.groupId,
                roleIds: op.roleIds
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //将分组分配到账号
    var _groupToAcc = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/employee/setgroup",
            data: {
                accId: op.accId,
                groupIds: op.groupIds
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //添加-页面权限
    var _pageAddCompetence = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/privilege/add",
            data: {
                module_id: op.pageId,
                name: op.name,
                remark: op.remark
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //修改-页面权限
    var _pageEditCompetence = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/privilege/modify",
            data: {
                id: op.id,
                name: op.name,
                remark: op.remark
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //删除-页面权限
    var _pageDelCompetence = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/privilege/delete",
            data: {
                module_id: op.moduelid,
                id: op.id
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //获取-页面权限
    var _getPageCompetenceList = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/privilege/list",
            data: {
                module_id: op.id
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //重置密码
    var _rePassWord = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/employee/repassword",
            data: {
                id: op.id
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //添加账号
    var _addAcc = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/employee/add",
            data: {
                account: op.account,
                name: op.name
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //禁用账号
    var _disabledAcc = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/employee/forbid",
            data: {
                id: op.id
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //启用账号
    var _openAcc = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/employee/use",
            data: {
                id: op.id
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //删除账号
    var _delAcc = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/employee/delete",
            data: {
                id: op.id
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //获取模块详细
    var _getModelDetail = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/module/getchild",
            data: {
                id: op.id
            },
            dataType: "json",
            type: "get",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //获取模块下的页面列表
    var _getModelPageList = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/module/getpage",
            data: {
                id: op.id
            },
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //获取角色列表
    var _getRoleList = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/role/list",
            data: {},
            dataType: "json",
            type: "post",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //获取用户组列表
    var _getGroupList = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/group/list",
            data: {},
            dataType: "json",
            type: "get",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //获取模块树
    var _getModelTree = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/module/tree",
            data: {},
            dataType: "json",
            type: "get",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //获取导航树
    var _getNavTree = function (op) {
        $.ajax({
            url: "http://y.tcsh.me/privilege/tree",
            data: {},
            dataType: "json",
            type: "get",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    //获取导航树节点数据
    var _getNavNodeDetail = function (op) {
        $.ajax({
            url: "",
            data: {},
            dataType: "json",
            type: "get",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };

    //添加模块
    exports.addModel = function (op) {
        _addModel($.extend({}, op));
    };
    //编辑模块
    exports.editModel = function (op) {
        _editModel($.extend({}, op));
    };
    //删除模块
    exports.delModel = function (op) {
        _delModel($.extend({}, op));
    };
    //添加角色
    exports.addRole = function (op) {
        _addRole($.extend({}, op));
    };
    //编辑角色
    exports.editRole = function (op) {
        _editRole($.extend({}, op));
    };
    //编辑角色的权限
    exports.roleEditCompetence = function (op) {
        _roleEditCompetence($.extend({}, op));
    };

    exports.delRole = function (op) {
        _delRole($.extend({}, op));
    };
    //添加页面
    exports.addPage = function (op) {
        _addPage($.extend({}, op));
    };
    //编辑页面
    exports.editPage = function (op) {
        _editPage($.extend({}, op));
    };
    //删除页面
    exports.delPage = function (op) {
        _delPage($.extend({}, op));
    };
    //添加-页面权限
    exports.pageAddCompetence = function (op) {
        _pageAddCompetence($.extend({}, op));
    };
    //修改-页面权限
    exports.pageEditCompetence = function (op) {
        _pageEditCompetence($.extend({}, op));
    };
    //删除-页面权限
    exports.pageDelCompetence = function (op) {
        _pageDelCompetence($.extend({}, op));
    };
    //获取页面的权限列表
    exports.getPageCompetenceList = function (op) {
        _getPageCompetenceList($.extend({}, op));
    };
    //添加分组
    exports.addGroup = function (op) {
        _addGroup($.extend({}, op));
    };
    //编辑分组
    exports.editGroup = function (op) {
        _editGroup($.extend({}, op));
    };
    //删除分组
    exports.delGroup = function (op) {
        _delGroup($.extend({}, op));
    };
    //将角色分配到分组
    exports.roleToGroup = function (op) {
        _roleToGroup($.extend({}, op));
    };
    //将分组分配给账号
    exports.groupToAcc = function (op) {
        _groupToAcc($.extend({}, op));
    };
    //添加账号
    exports.addAcc = function (op) {
        _addAcc($.extend({}, op));
    };
    //重置密码
    exports.rePassWord = function (op) {
        _rePassWord($.extend({}, op));
    };
    //禁用账号
    exports.disabledAcc = function (op) {
        _disabledAcc($.extend({}, op));
    };
    //启用账号
    exports.openAcc = function (op) {
        _openAcc($.extend({}, op));
    };
    //删除账号
    exports.delAcc = function (op) {
        _delAcc($.extend({}, op));
    };

    //获取模块详细信息
    exports.getModelDetail = function (op) {
        _getModelDetail($.extend({}, op));
    };
    //获取模块下面的页面
    exports.getModelPageList = function (op) {
        _getModelPageList($.extend({}, op));
    };
    //获取模块树
    exports.getModelTree = function (op) {
        _getModelTree($.extend({}, op));
    };
    //获取角色列表
    exports.getRoleList = function (op) {
        _getRoleList($.extend({}, op));
    };
    //获取用户组列表
    exports.getGroupList = function (op) {
        _getGroupList($.extend({}, op));
    };
    //获取导航树
    exports.getNavList = function (op) {
        _getNavTree($.extend({}, op));
    };
    //获取导航节点详细信息
    exports.getNavNodeDetail = function (op) {
        _getNavNodeDetail($.extend({}, op));
    };
    //添加导航节点
    exports.addNavNode = function (op) {
        _addNavNode($.extend({}, op));
    };
    //编辑导航节点
    exports.editNavNode = function (op) {
        _editNavNode($.extend({}, op));
    };
    //删除导航节点
    exports.delNavNode = function (op) {
        _delNavNode($.extend({}, op));
    };
});