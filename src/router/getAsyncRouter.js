// 用于处理动态菜单数据，将其转为 route 形式
export function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  // 用于保存普通路由数据
  let temp = []
  // 用于保存存在子路由的路由数据
  let route = []
  // 遍历数据
  for (let i = 0; i < menuList.length; i++) {
    // 存在子路由，则递归遍历，并返回数据作为 children 保存
    if (menuList[i].listMenu && menuList[i].listMenu.length > 0) {
      // 获取路由的基本格式
      route = getRoute(menuList[i], true)
      // 递归处理子路由数据，并返回，将其作为路由的 children 保存
      route.children = fnAddDynamicMenuRoutes(menuList[i].listMenu)
      // 保存存在子路由的路由
      routes.push(route)
    } else {
      // 保存普通路由
      temp.push(getRoute(menuList[i], false))
    }
  }
  // 返回路由结果
  return routes.concat(temp)
}

// 返回路由的基本格式
function getRoute (item, type) {
  // 路由基本格式
  let route = {
      // 路由的路径
      path: item.menuName,
      // 路由名
      name: item.tabName,
      // 做连级菜单
      alwaysShow: type,
      // 路由所在组件
      component: (resolve) => require([`@/views${item.menuUrl}`], resolve),
      meta: {
        id: item.ids,
        title: item.tabName,
        icon: item.icon
      },
      // 路由的子路由
      children: []
  }
  // 返回 route
  return route
}
