import request from '@/utils/request'

// 获取博客类型列表
export function mineBlosTypeTabApi(data) {
  return request({
    url: '/api/mineBlosTypeTab.act',
    method: 'post',
    data
  })
}

// 删除博客类型
export function deleteBlosTypeApi(data) {
  return request({
    url: '/api/deleteBlosType.act',
    method: 'post',
    data
  })
}

// 新增/修改博客类型
export function insertBlosTypeApi(data) {
  return request({
    url: '/api/insertBlosType.act',
    method: 'post',
    data
  })
}

// 获取博客类型
export function getMineBlosTypeApi(data) {
  return request({
    url: '/api/getMineBlosType.act',
    method: 'post',
    data
  })
}
