import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // 图标
import '@/permission' // 页面守卫

// 中文版
Vue.use(ElementUI)
//设置映射到资源服务器的路径
//Vue.prototype.$hostURL = 'http://192.168.0.201:51663/blosBoot'
Vue.prototype.$hostURL = '/blosBoot'
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
