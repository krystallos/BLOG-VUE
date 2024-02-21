import request from '@/utils/request'

//登入
export function loginApi(data) {
  return request({
    url: '/open/login.act',
    method: 'post',
    data
  })
}

//登出
export function logoutApi() {
  return request({
    url: '/open/gouOut.act',
    method: 'post'
  })
}

//获取用户信息(内部包含token)
export function getInfoApi() {
  return request({
    url: '/api/getInfo.act',
    method: 'post'
  })
}

//获取用户菜单
export function getMenuApi() {
  return request({
    url: '/api/menuGet.act',
    method: 'post'
  })
}

//获取IP
export function getIpApi() {
  return request({
    url: 'https://qifu-api.baidubce.com/ip/local/geo/v1/district',
    method: 'get'
  })
}
