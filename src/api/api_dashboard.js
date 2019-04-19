import API from '@/utils/API'

export default {
    // 统计教师数量
    getCountByRoleId: params => {
        return API.POST('/user/usercount/' + params)
    },
    findClassSum: params => {
        return API.POST('/classes/classcount')
    },
    findCourseSum: params => {
        return API.POST('/article/article/count/2')
    },
    findFansSum: params => {
        return API.GET('/user/fencount')
    }
}