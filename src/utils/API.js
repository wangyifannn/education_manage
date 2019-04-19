import axios from 'axios'
import store from '@/store/index.js'
import {
    getToken
} from '@/utils/auth' // getToken from cookie

import {
    Message
} from 'element-ui'
const http = {}

var instance = axios.create({
    timeout: 20000,
    baseURL: 'http://www.shengdongyushang.com'
})
axios.defaults.withCredentials = false;

// 添加请求拦截器
instance.interceptors.request.use(
    function(config) {
        // 请求头添加token
        if (getToken()) {
            config.headers.token = getToken()
        }
        const responseType = sessionStorage.getItem('responseType');
        if (responseType == 'form') {
            config.headers = {
                'Content-Type': 'application/x-www-form-urlencoded', //设置跨域头部
                'token': getToken()
            };
        } else if (responseType == 'file') {
            config.headers = {
                'Content-Type': 'multipart/form-data', //设置跨域头部
                'token': getToken()
            };
        } else if (responseType == 'excel') {
            config.headers = {
                'Content-Type': 'application/vnd.ms-excel', //设置跨域头部
                'token': getToken()
            };
        } else {
            config.headers = {
                'Content-Type': 'application/json', //设置跨域头部
                'token': getToken()
            };
        }
        return config
    },
    function(error) {
        return Promise.reject(error)
    }
)

// 响应拦截器即异常处理
instance.interceptors.response.use(
    response => {
        if (response.status === 200 && typeof(response.data) !== Object) {
            var val = response.data;
            response.data = {};
            response.data.data = val;
            response.data.code = 20000;
        }
        response.data.code = !!response.data.code && response.data.code === 20000 ? 0 : response.data.code;
        return response.data
    },
    err => {
        alert(err.response);
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = '请求出错'
                    break
                case 20011:
                    Message.warning({
                        message: '授权失败，请重新登录'
                    })
                    store.commit('LOGIN_OUT')
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                    return
                case 403:
                    err.message = '拒绝访问'
                    break
                case 404:
                    err.message = '请求错误,未找到该资源'
                    break
                case 500:
                    err.message = '服务器端出错'
                    break
            }
        } else {
            err.message = '连接服务器失败'
        }
        Message.error({
            message: err.message
        })
        return Promise.reject(err.response)
    }
)

http.GET = function(url, options) {
    return new Promise((resolve, reject) => {
        instance
            .get(url, options)
            .then(response => {
                if (response.code === 0) {
                    resolve(response.data)
                } else {
                    Message.error({
                        message: response.message
                    })
                    reject(response.message)
                }
            })
            .catch(e => {
                console.log(e)
            })
    })
}

http.POST = function(url, data, options) {
    return new Promise((resolve, reject) => {
        instance
            .post(url, data, options)
            .then(response => {
                if (response.code === 0) {
                    resolve(response.data)
                } else {
                    Message.error({
                        message: response.message
                    })
                    reject(response.message)
                }
            })
            .catch(e => {
                console.log(e)
            })
    })
}
http.DELETE = function(url, params) {
    return new Promise((resolve, reject) => {
        instance.delete(`${url}`, {
                params: params
            }).then(response => {
                if (response.code === 0) {
                    resolve(response.data)
                } else {
                    Message.error({
                        message: response.message
                    })
                    reject(response.message)
                }
            })
            .catch(e => {
                console.log(e)
            })
    })
}
http.PUT = function(url, params) {
    return new Promise((resolve, reject) => {
        instance
            .put(url, params)
            .then(response => {
                if (response.code === 0) {
                    resolve(response.data)
                } else {
                    Message.error({
                        message: response.message
                    })
                    reject(response.message)
                }
            })
            .catch(e => {
                console.log(e)
            })
    })
}
export default http