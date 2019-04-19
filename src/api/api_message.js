import API from '@/utils/API'

export default {
    findAPI: params => {
        if (params.type === "eventRing") { //获取活动圈
            delete params["type"]
            return API.POST('/commentHdq/search/' + params.page + "/" + params.size, params);
        } else if (params.type === "classInfo") { //班级通知
            delete params["type"]
            return API.POST('/commentBjtz/search/' + params.page + "/" + params.size, params);
        } else if (params.type === "classCourse") { //获取班级课程
            delete params["type"]
            return API.POST('/commentBjkc/search/' + params.page + "/" + params.size, params);
        } else if (params.type === "classRing") { //获取班级圈
            delete params["type"]
            return API.POST('/commentBjq/search/' + params.page + "/" + params.size, params);
        } else { //获取体验区留言
            delete params["type"]
            return API.POST('/commentTyq/search/' + params.page + "/" + params.size, params);
        }
    },
    delAPI: params => {
        if (params.type === "eventRing") {
            delete params["type"]
            return API.DELETE('/commentHdq/' + params.id)
        } else if (params.type === "classInfo") {
            delete params["type"]
            return API.DELETE('/commentBjtz/' + params.id)
        } else if (params.type === "classCourse") {
            delete params["type"]
            return API.DELETE('/commentBjkc/' + params.id)
        } else if (params.type === "classRing") {
            delete params["type"]
            return API.DELETE('/commentBjq/' + params.id)
        } else {
            delete params["type"]
            return API.DELETE('/commentTyq/' + params.id)
        }
    },
    userStatus: params => { //0解禁  1禁言
        return API.PUT('/wechatUserinfo/' + params.openid, params);
    }
}