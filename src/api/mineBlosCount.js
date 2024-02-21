import request from '@/utils/request'

// 获取个人信息
export function mineBlosTabApi(data) {
  return request({
    url: '/api/mineBlosTab.act',
    method: 'post',
    data
  })
}