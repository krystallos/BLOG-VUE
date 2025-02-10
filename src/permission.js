import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条本体
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // token验证
import getPageTitle from '@/utils/get-page-title'
import { fnAddDynamicMenuRoutes } from '@/router/getAsyncRouter' // 动态路由

NProgress.configure({ showSpinner: false }) // 进度配置

// 免登入白名单
const whiteList = [
 '/login', '/regiest','/getBackPw','/setu', '/mineBlos',
 '/mineBlosArticle', '/fictionMain', '/fictionDetial', '/book',
 '/selectImage', '/openApiDoc', '/imageShare', '/mineBlosTimeGroup', '/mineBlosDescription' ,
 '/mineBlosDrama', '/openImageAlbum',
 '/404', '/201'
]

router.beforeEach(async(to, from, next) => {
  // 进度条
  NProgress.start()
  // 页面标题
  document.title = getPageTitle(to.meta.title)

  // 获取token
  const hasToken = getToken();
  // 如果有token
  if (hasToken) {
    // 发现在登入页，先去主页，后端会有安全进程验证token
    if (to.path === '/login') {
      next({ path: '/blosMain' })
      NProgress.done()
    // 除了登入页的
    }else {
      const hasMenu = store.getters.menu;
      // 判断store中是否存在menu菜单
      // 有的就直接进去
      if(hasMenu != null && hasMenu.length != 0){
        next();
      // 没有就去获取菜单,这边做了storage验证
      }else {
        const hasGetUserInfo = sessionStorage.getItem("person")
        if (hasGetUserInfo) {
          await store.dispatch('user/getMenu').then(() => {
            router.addRoutes(store.getters.menu)
            next()
          })
        } else {
          try {
            await store.dispatch('user/getInfo').then(() => {
              router.addRoutes(store.getters.menu)
              next()
            })
          } catch (error) {
            // 删除token，回到主页面
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    }
  // 没有token
  }else {
    // 访问路径白名单
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      //除此之外的全部重定向到登入页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
