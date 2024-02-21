import request from '@/utils/request'

// 获取菜单列表
export function menuAddTabApi(data) {
  return request({
    url: '/api/menuAddTab.act',
    method: 'post',
    data
  })
}

// 新增菜单
export function addNewMenuApi(data) {
  return request({
    url: '/api/addNewMenu.act',
    method: 'post',
    data
  })
}

// 获取顶级菜单列表
export function getTopMenuApi(data) {
  return request({
    url: '/api/getTopMenu.act',
    method: 'post',
    data
  })
}
