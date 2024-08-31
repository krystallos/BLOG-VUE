import request from '@/utils/request'

// 获取追番信息
export function dramaListTabApi(data) {
  return request({
    url: '/api/dramaListTab.act',
    method: 'post',
    data
  })
}

// 获取追番详情
export function getDetialdramaApi(data) {
  return request({
    url: '/api/getDetialdrama.act',
    method: 'post',
    data
  })
}

// 删除追番记录
export function delDramaApi(data) {
  return request({
    url: '/api/delDrama.act',
    method: 'post',
    data
  })
}

// 修改追番记录
export function editDramaApi(data) {
  return request({
    url: '/api/editDrama.act',
    method: 'post',
    data
  })
}

// 新增追番记录
export function insertDramaApi(data) {
  return request({
    url: '/api/insertDrama.act',
    method: 'post',
    data
  })
}
