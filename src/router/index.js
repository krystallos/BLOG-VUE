import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // 注册
  {
    path: '/regiest',
    component: () => import('@/views/login/loginReg/regiest'),
    hidden: true
  },
  //找回密码
  {
    path: '/getBackPw',
    component: () => import('@/views/login/loginReg/getBackPassWord'),
    hidden: true
  },
  // 首页
  {
    path: '/blosMain',
    alwaysShow: true,
    component: () => import('@/views/blosMain/index'),
    name: '首页'
  },
  //随机瑟图
  {
    path: '/setu',
    alwaysShow: true,
    component: () => import('@/views/openApi/imageRandom/imageRandom'),
    name: '随机瑟图'
  },
  //API文档
  {
    path: '/openApiDoc',
    alwaysShow: true,
    component: () => import('@/views/openApi/sysOpenRstHttp/sysOpenRstHttp'),
    name: 'API文档'
  },
  //博客
  {
    path: '/mineBlos',
    alwaysShow: true,
    component: () => import('@/views/openApi/mineBlos/mineBlosMain'),
    name: '个人博客'
  },
  //博客内容
  {
    path: '/mineBlosArticle',
    alwaysShow: true,
    component: () => import('@/views/openApi/mineBlos/mineBlosArticle.vue'),
    name: '博客文章'
  },
  //博客归档
  {
    path: '/mineBlosTimeGroup',
    alwaysShow: true,
    component: () => import('@/views/openApi/mineBlos/mineBlosTimeGroup.vue'),
    name: '博客归档'
  },
  //博客介绍
  {
    path: '/mineBlosDescription',
    alwaysShow: true,
    component: () => import('@/views/openApi/mineBlos/mineBlosDescription.vue'),
    name: '博客介绍'
  },
  //我的追番
  {
    path: '/mineBlosDrama',
    alwaysShow: true,
    component: () => import('@/views/openApi/mineBlos/mineBlosDrama.vue'),
    name: '我的追番'
  },
  //小说主页
  {
    path: '/fictionMain',
    alwaysShow: true,
    component: () => import('@/views/openApi/fictionMain/fictionMain.vue'),
    name: '小说主页'
  },
  //小说详情
  {
    path: '/fictionDetial',
    alwaysShow: true,
    component: () => import('@/views/openApi/fictionMain/fictionDetial.vue'),
    name: '小说详情'
  },
  //看小说
  {
    path: '/book',
    alwaysShow: true,
    component: () => import('@/views/openApi/fictionMain/book.vue'),
    name: '看小说'
  },
  //搜图引擎
  {
    path: '/selectImage',
    alwaysShow: true,
    component: () => import('@/views/openApi/selectImage/selectImage.vue'),
    name: '搜图引擎'
  },
  //仿Pixiv看图页
  {
    path: '/imageShare',
    alwaysShow: true,
    component: () => import('@/views/openApi/imageShare/imageShare.vue'),
    name: '分享图片'
  },
  //404
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  //201
  {
    path: '/201',
    component: () => import('@/views/201'),
    hidden: true,
  },
  // 除此外跳转首页
  {
    path: '*',
    component: () => import('@/views/blosMain/index'),
    hidden: true,
  },
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
