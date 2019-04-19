// //用户相关api
import API from '@/utils/API'
export default {
    exportUser: params => {
        return API.POST('/syx/user/downloadexcel', params)
    },
    // 修改个人信息
    updateUserInfo: params => {
        return API.PUT('/user/' + params.id, params)
    },
    // 重置密码，接口和修改用户信息接口一致，只是重新定义一个变量在页面做判断，所有也重新定义了一个接口变量
    resetPass: params => {
        return API.PUT('/user/' + params.id, params)
    },
    findAllUser: params => {
        return API.GET('/user', params)
    },
    findUserList: params => {
        return API.POST('/user/search/' + params.page + '/' + params.size, params)
    },
    // 添加用户
    addUser: params => {
        return API.POST('/user', params)
    },
    getUserType: params => { //获取系统所有角色类型
        return API.GET('/role?rolename=' + "")
    },
    // 删除用户
    delUser: params => {
        return API.DELETE('/user/' + params.id)
    },
    userStatus: params => { //0解禁  1禁言
        return API.PUT('/wechatUserinfo/' + params.openid, params);
    },
    // 微信用户查新/粉丝
    findFansList: params => {
        return API.POST('/wechatUserinfo/search/' + params.page + '/' + params.size, params)
    },
    // 班级相关接口
    findClassList: params => {
        params.page = !!params.page ? params.page - 1 : 0;
        return API.POST('/classes/getresultforclasses', params)
    },
    addTheClass: params => {
        if (!!params.id) {
            return API.PUT(`/classes/` + params.id, params)
        } else {
            return API.POST('/classes', params)
        }
    },
    delTheClass: params => {
        return API.DELETE('/classes/' + params.id, params);
    }
}