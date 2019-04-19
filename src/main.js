import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css



import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control

import '@/components/_global.js'

import * as filters from './filters' // global filters
import '@/assets/css/common.scss'

// 引入UE所需
import '../static/ueditor/ueditor.config.js'
import '../static/ueditor/ueditor.all.js'
import '../static/ueditor/lang/zh-cn/zh-cn.js'
import '../static/ueditor/jquery-2.2.3.min.js'

require("babel-polyfill");

Vue.use(Element, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
})

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})


Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})

if (module.hot) {
    module.hot.accept();
}