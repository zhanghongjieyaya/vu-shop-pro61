import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{ path: '/welcome', component: Welcome }]
    }
  ]
})
// 路由导航守卫，检测token如果不存在，就跳转到login登录组件去
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }

  //  访问非login，判断token
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next() // 如果token存在，继续。。。。。。
})

export default router
