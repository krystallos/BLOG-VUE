import request from '@/utils/request'

// 注册用户
export function regiestApi(data) {
  return request({
    url: '/open/registUser.act',
    method: 'post',
    data
  })
}