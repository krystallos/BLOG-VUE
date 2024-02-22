import request from '@/utils/request'

// 获取博客标签
export function goNewMineBlosTopApi(data) {
  return request({
    url: '/api/goNewMineBlosTop.act',
    method: 'post',
    data
  })
}

// 获取博客标签
export function writeMineBlosApi(data) {
  return request({
    url: '/api/writeMineBlos.act',
    method: 'post',
    data
  })
}

// 获取博客详情
export function getWriteMineBlosApi(data) {
  return request({
    url: '/api/getWriteMineBlos.act',
    method: 'post',
    data
  })
}

//保存博客
export function updateWriteMineBlosApi(data) {
  return request({
    url: '/api/updateWriteMineBlos.act',
    method: 'post',
    data
  })
}