import request from '@/utils/request'

// 获取访问日志
export function aspLogApi(data) {
  return request({
    url: '/api/aspLog.act',
    method: 'post',
    data
  })
}

// 获取TOKEN日志
export function aspTokenApi(data) {
  return request({
    url: '/api/aspToken.act',
    method: 'post',
    data
  })
}

// 获取搜图日志
export function aspImgApi(data) {
  return request({
    url: '/api/aspImg.act',
    method: 'post',
    data
  })
}
