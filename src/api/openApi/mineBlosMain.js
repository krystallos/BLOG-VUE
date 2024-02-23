import request from '@/utils/request'

// 获取基本信息
export function hisBlosMainApi(data) {
  return request({
    url: '/open/hisBlosMain.act',
    method: 'post',
    data
  })
}

// 获取文章类型
export function hisBlosMineTypeApi(data) {
  return request({
    url: '/open/hisBlosMineType.act',
    method: 'post',
    data
  })
}

// 获取详细信息
export function hisBlosApi(data) {
  return request({
    url: '/open/hisBlos.act',
    method: 'post',
    data
  })
}

// 获取随机博客
export function hisBlosTypeApi(data) {
  return request({
    url: '/open/hisBlosType.act',
    method: 'post',
    data
  })
}

// 获取时间轴
export function getTimeGroupByApi(data) {
  return request({
    url: '/open/getTimeGroupBy.act',
    method: 'post',
    data
  })
}

// 获取随笔
export function hisNoteMineTypeApi(data) {
  return request({
    url: '/open/hisNoteMineType.act',
    method: 'post',
    data
  })
}