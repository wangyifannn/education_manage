import API from '@/utils/API'

export default {
    // 查询角色列表
    findList: params => {
        return API.POST('/subjectType/search/' + params.page + '/' + params.size, params)
    },
    // 添加权限菜单
    addAPI: params => { //分配权限，提交接口
        return API.POST('/subjectType', params);
    },
    // 删除用户
    delAPI: params => {
        return API.DELETE('/subjectType/' + params.id, params)
    },
    updateAPI: params => {
        return API.PUT('/subjectType/' + params.id, params)
    }
}