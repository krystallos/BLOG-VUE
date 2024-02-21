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