import API from '@/utils/API'

export default {
    // 查询角色列表
    findRoleList: params => {
        return API.GET('/role?rolename=' + params.rolename)
    },
    // 添加权限菜单
    addAPI: params => { //分配权限，提交接口
        return API.POST('/user/insertRole', params);
    },
    findPermissionList: params => { //查询所有操作权限菜单
        return API.POST('/user/selectRole/' + params.roleId)
    },
    findPermissionAll: params => { //分页查询后台权限和角色
        return API.POST('/syx/user/permission/alluser', params)
    },
    updateAPI: params => {
        return API.PUT('/role/' + params.id, params)
    }
}