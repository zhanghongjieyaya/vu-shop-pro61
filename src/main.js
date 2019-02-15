import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
// 引入element-ui
import ElementUI from 'element-ui'
// 引入字体图标文件
import './assets/fonts/iconfont.css'
// 引入axios
import axios from 'axios'
// 给axios做配置 （访问根地址 Vue 之$http成员
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios

Vue.config.productionTip = false

// 给Vue注册全部的element-ui的标签组件 和 事件方法组件
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
