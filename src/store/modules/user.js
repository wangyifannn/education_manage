import {
    loginByUsername,
    logout,
    getUserInfo
} from '@/api/login'
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'
import $ from 'jquery'
const user = {
    state: {
        user: '',
        status: '',
        code: '',
        token: getToken(),
        name: '',
        avatar: '',
        classesId: '',
        userId: "",
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: []
        }
    },

    mutations: {
        SET_CODE: (state, code) => {
            state.code = code
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction
        },
        SET_CLASSESID: (state, classesId) => {
            state.classesId = classesId
        },
        SET_USERID: (state, userId) => {
            state.userId = userId
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting
        },
        SET_STATUS: (state, status) => {
            state.status = status
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername({
            commit
        }, userInfo) {
            return new Promise((resolve, reject) => {
                loginByUsername(userInfo).then(response => {
                    var res = response.data;
                    if (!!res && res.code !== 20000) {
                        resolve(res)
                        return;
                    }
                    const resData = res.data;
                    sessionStorage.setItem("token", resData.token);
                    commit('SET_TOKEN', resData.token)
                    setToken(resData.token)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetUserInfo({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(response => {
                    // 由于mockjs 不支持自定义状态码只能这样hack
                    if (!response.data) {
                        reject('Verification failed, please login again.')
                    }
                    sessionStorage.setItem(
                        "access-user",
                        JSON.stringify(response.data.data)
                    );
                    const data = response.data;
                    var roleName = ["editor", "admin", "schoolMaster", "affair", "teacher", "student", "vip", "fans"]
                    data.roles = roleName[data.data.roleid].split(' ');
                    data.introduction = data.data.roleid;
                    data.classesId = data.data.classesId;
                    data.userId = data.data.id;
                    data.avatar = !!data.data.img ? data.data.img : require("../../../src/assets/img/noImg.png");
                    data.name = data.data.userName;
                    if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', data.roles)
                    } else {
                        reject('getInfo: roles must be a non-null array!')
                    }
                    commit('SET_NAME', data.name)
                    commit('SET_AVATAR', data.avatar)
                    commit('SET_INTRODUCTION', data.introduction)
                    commit('SET_CLASSESID', data.classesId)
                    commit('SET_USERID', data.userId)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 第三方验证登录
        // LoginByThirdparty({ commit, state }, code) {
        //   return new Promise((resolve, reject) => {
        //     commit('SET_CODE', code)
        //     loginByThirdparty(state.status, state.email, state.code).then(response => {
        //       commit('SET_TOKEN', response.data.token)
        //       setToken(response.data.token)
        //       resolve()
        //     }).catch(error => {
        //       reject(error)
        //     })
        //   })
        // },

        // 登出
        LogOut({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({
            commit
        }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        },
        // 动态修改权限
        ChangeRoles({
            commit,
            dispatch
        }, role) {
            return new Promise(resolve => {
                commit('SET_TOKEN', role)
                setToken(role)
                getUserInfo(role).then(response => {
                    const data = response.data;
                    var roleName = ["editor", "admin", "schoolMaster", "affair", "teacher", "student", "vip", "fans"]
                    data.roles = roleName[data.data.roleid].split(' ');
                    commit('SET_ROLES', data.roles)
                    commit('SET_NAME', data.data.userName)
                    commit('SET_AVATAR', data.data.img)
                    commit('SET_CLASSESID', data.data.classesId)
                    commit('SET_USERID', data.data.id)
                    commit('SET_INTRODUCTION', !!data.data.roleid ? data.data.roleid : "")
                    dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
                    resolve()
                })
            })
        }
    }
}

export default user