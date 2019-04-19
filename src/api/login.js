import request from '@/utils/request'

export function loginByUsername(params) {
    return request({
        url: '/user/userlogin/1',
        method: 'post',
        data: params
    });
}


export function logout(params) {
    return request({
        url: '/user/logout/' + params,
        method: 'post'
    })
}

export function getUserInfo(params) {
    params = params.toString();
    return request({
        url: '/user/userInfo',
        params: {
            "sessionid": params
        },
        method: 'get'
    });
}