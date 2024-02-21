import request from '@/utils/request'

// 获取轮播列表
export function nachrichtenListApi(data) {
  return request({
    url: '/api/nachrichtenList.act',
    method: 'post',
    data
  })
}

// 删除轮播列表
export function delNachrichtenApi(data) {
  return request({
    url: '/api/delNachrichten.act',
    method: 'post',
    data
  })
}

// 提交轮播信息
export function insertNachrichtenApi(data) {
  return request({
    url: '/api/insertNachrichten.act',
    method: 'post',
    data
  })
}

// 更新轮播信息
export function updateNachrichtenApi(data) {
  return request({
    url: '/api/updateNachrichten.act',
    method: 'post',
    data
  })
}

// 获取详细轮播信息
export function getNachrichtenApi(data) {
  return request({
    url: '/api/getNachrichten.act',
    method: 'post',
    data
  })
}
