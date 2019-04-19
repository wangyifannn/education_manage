import API from '@/utils/API'


export default {
    addAPI: params => {
        if (!!params.article.id) {
            return API.PUT(`/article/` + params.article.id, params)
        } else {
            return API.POST(`/article/`, params)
        }
    },

    findUserList: params => {
        if (!!params.apiType) { //获取全部教师、学员等，不分页
            return API.POST('/user/search', params)
        } else {
            return API.POST('/user/search/' + params.page + '/' + params.size, params)
        }
    },
    findClassList: params => {
        params.page = !!params.page ? params.page : 1;
        params.size = !!params.size ? params.size : 10;
        return API.POST('/classes/search/' + params.page + '/' + params.size, params)
    },
    findSortList: params => {
        return API.POST('/subjectType/search/' + params.page + '/' + params.size, params)
    },
    delAPI: params => {
        return API.DELETE('/article/' + params.id, params);
    },
    findData: params => {
        return API.POST('/article/searchArticle', params)
    },
    uploadImg: params => {
        return API.POST('/file/multipleUpload', params)
    },
    findArticleDetail: params => {
        return API.GET('/articleContent/' + params.id, params)
    },
    sendInfo: params => { //微信消息推送接口
        return API.POST('/wechat/sendInfos', params)
    }
}