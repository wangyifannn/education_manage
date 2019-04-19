import API from '@/utils/API'


export default {
    addAPI: params => {
        if (!!params.id) {
            return API.PUT(`/invitation/` + params.id, params)
        } else {
            return API.POST(`/invitation/`, params)
        }
    },
    //单个删除book
    delAPI: params => {
        return API.DELETE('/invitation/' + params.id, params);
    },
    findData: params => {
        params.page = !!params.page ? params.page : 1;
        params.size = !!params.size ? params.size : 10;
        return API.POST('/invitation/search/' + params.page + '/' + params.size, params)
    },
    // 活动统计
    getCountTableData: params => {
        return API.POST('/invitationLog/getallInvition', params)
    },
    // 上传图片
    uploadImg: params => {
        return API.POST('/file/multipleUpload', params)
    }
}