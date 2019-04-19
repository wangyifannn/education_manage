import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: sub-menu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/
export const constantRouterMap = [{
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path*',
            component: () =>
                import ('@/views/redirect/index')
        }]
    },
    {
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: 'dashboard',
        children: [{
            path: 'dashboard',
            component: () =>
                import ('@/views/dashboard/index'),
            name: 'Dashboard',
            meta: {
                title: '首页',
                icon: 'home',
                noCache: true,
                affix: true
            }
        }]
    }
]

export default new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})

export const asyncRouterMap = [{
        path: '/affairs',
        component: Layout,
        redirect: '/affairs/index',
        meta: {
            roles: ['schoolMaster', 'admin']
        },
        children: [{
            path: 'index',
            component: () =>
                import ('@/views/affairs/index'),
            name: 'affairsList',
            meta: {
                title: '教务管理',
                icon: 'affairs',
                noCache: true
            }
        }]
    },
    {
        path: '/teacher',
        component: Layout,
        meta: {
            roles: ['schoolMaster', 'admin', 'affair']
        },
        children: [{
            path: 'index',
            component: () =>
                import ('@/views/teacher/index'),
            name: 'teacherList',
            meta: {
                title: '教师管理',
                icon: 'teacher'
            }
        }]
    }, {
        path: '/student',
        component: Layout,
        redirect: '/student/index',
        meta: {
            roles: ['schoolMaster', 'admin', 'affair', 'teacher']
        },
        children: [{
            path: 'index',
            component: () =>
                import ('@/views/student/index'),
            name: 'Student',
            meta: {
                title: '学员管理',
                icon: 'student',
                noCache: true
            }
        }]
    }, {
        path: '/sort',
        component: Layout,
        redirect: '/sort/index',
        // name: "sort",
        // alwaysShow: true, // will always show the root menu
        meta: {
            roles: ['schoolMaster', 'admin', 'affair'] // you can set roles in root nav
        },
        children: [{
            path: 'index',
            component: () =>
                import ('@/views/sort/courseSort'),
            name: 'courseSort',
            meta: {
                title: '科目管理',
                icon: 'coursetype',
                noCache: true
            }
        }]
    }, {
        path: '/class',
        component: Layout,
        meta: {
            roles: ['schoolMaster', 'admin', 'affair', 'teacher']
        },
        children: [{
            path: 'index',
            component: () =>
                import ('@/views/theClass/index'),
            name: 'classList',
            meta: {
                title: '班级管理',
                icon: 'class'
            }
        }]
    },

    {
        path: '/message',
        component: Layout,
        meta: {
            roles: ['schoolMaster', 'admin', 'affair']
        },
        children: [{
            path: 'index',
            component: () =>
                import ('@/views/message/messageList'),
            name: 'messageList',
            meta: {
                title: '评论管理',
                icon: 'teacher'
            }
        }]
    },
    {
        path: '/experience',
        component: Layout,
        redirect: '/experience/list',
        name: 'Experience',
        meta: {
            roles: ['schoolMaster', 'admin', 'teacher'],
            title: '体验区',
            icon: 'exprience'
        },
        children: [{
                path: 'create',
                component: () =>
                    import ('@/views/course/create'),
                name: 'experienceAdd',
                meta: {
                    title: '发布文章',
                    icon: 'edit'
                }
            },
            {
                path: 'editor',
                component: () =>
                    import ('@/views/course/create'),
                name: 'experienceUpdate',
                meta: {
                    title: '编辑文章',
                    icon: 'edit'
                },
                hidden: true
            },
            {
                path: 'list',
                component: () =>
                    import ('@/views/course/list'),
                name: 'ArticleList',
                meta: {
                    title: '文章列表',
                    icon: 'list'
                }
            }
        ]
    }, {
        path: '/course',
        component: Layout,
        redirect: '/course/list',
        name: 'Example',
        meta: {
            roles: ['schoolMaster', 'admin', 'teacher'],
            title: '课程管理',
            icon: 'course'
        },
        children: [{
                path: 'create',
                component: () =>
                    import ('@/views/course/create'),
                name: 'courseAdd',
                meta: {
                    title: '发布课程',
                    icon: 'edit'
                }
            },
            {
                path: 'editor',
                component: () =>
                    import ('@/views/course/create'),
                name: 'courseAdd',
                meta: {
                    title: '编辑课程',
                    icon: 'edit'
                },
                hidden: true
            },
            {
                path: 'list',
                component: () =>
                    import ('@/views/course/list'),
                name: 'courseList',
                meta: {
                    title: '课程列表',
                    icon: 'list'
                }
            }
        ]
    }, {
        path: '/event',
        component: Layout,
        name: 'Event',
        redirect: '/event/index',
        meta: {
            roles: ['schoolMaster', 'admin', 'affair', 'teacher'],
            title: '活动管理',
            icon: 'event'
        },
        children: [{
                path: 'index',
                component: () =>
                    import ('@/views/event/templateList'),
                name: 'templateList',
                meta: {
                    title: '邀请函',
                    icon: 'invite'
                }
            }, {
                path: 'templateAdd',
                component: () =>
                    import ('@/views/event/templateAdd'),
                name: 'templateAdd',
                meta: {
                    title: '活动管理-创建',
                    icon: 'event'
                },
                hidden: true
            }, {
                path: 'templateUpdate',
                component: () =>
                    import ('@/views/event/templateUpdate'),
                name: 'templateUpdate',
                meta: {
                    title: '活动管理-编辑',
                    icon: 'edit'
                },
                hidden: true
            }, {
                path: 'publish',
                component: () =>
                    import ('@/views/event/publish'),
                name: 'publish',
                meta: {
                    title: '活动管理-发布',
                    icon: 'edit'
                },
                hidden: true
            }, {
                path: 'count',
                component: () =>
                    import ('@/views/event/count'),
                name: 'count',
                meta: {
                    title: '活动管理-统计',
                    icon: 'event'
                },
                hidden: true
            }, {
                path: 'list',
                component: () =>
                    import ('@/views/course/eventList'),
                name: 'eventList',
                meta: {
                    title: '活动圈',
                    icon: 'list'
                }
            },
            {
                path: 'create',
                component: () =>
                    import ('@/views/course/create'),
                name: 'createEvent',
                meta: {
                    title: '添加活动',
                    icon: 'list'
                },
                hidden: true
            },
            {
                path: 'editor',
                component: () =>
                    import ('@/views/course/create'),
                name: 'editorEvent',
                meta: {
                    title: '编辑活动',
                    icon: 'list'
                },
                hidden: true
            }
        ]
    },
    {
        path: '/system',
        component: Layout,
        redirect: '/system/user',
        name: "permission",
        alwaysShow: true, // will always show the root menu
        meta: {
            title: '系统管理',
            icon: 'rights',
            roles: ['schoolMaster', 'admin', 'affair'] // you can set roles in root nav
        },
        children: [{
                path: '/user',
                component: () =>
                    import ('@/views/user/index'),
                name: 'User',
                meta: {
                    roles: ['schoolMaster', 'admin', 'affair'],
                    title: '用户管理',
                    icon: 'user'
                }
            }, {
                path: 'role',
                component: () =>
                    import ('@/views/system/role/index'),
                name: 'roleList',
                meta: {
                    roles: ['schoolMaster', 'admin', 'affair'],
                    title: '角色管理',
                    icon: 'role'
                }
            }, {
                path: '/fansUser',
                component: () =>
                    import ('@/views/user/fansList'),
                name: 'fansList',
                meta: {
                    roles: ['schoolMaster', 'admin', 'affair'],
                    title: '禁言管理',
                    icon: 'user'
                }
            },
            {
                path: 'directive',
                component: () =>
                    import ('@/views/permission/directive'),
                name: 'DirectivePermission',
                meta: {
                    title: '权限指令'
                },
                hidden: true
            }
        ]
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]