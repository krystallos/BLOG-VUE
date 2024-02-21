import request from '@/utils/request'

// 获取文档列表
export function rstOpenPostList(data) {
  return request({
    url: '/open/rstPostList.act',
    method: 'post',
    data
  })
}

// 获取文档详情
export function getOpenRstPostApi(data) {
  return request({
    url: '/open/getRstPost.act',
    method: 'post',
    data
  })
}

// 获取文档列表详情
export function getOpenRstPostListApi(data) {
  return request({
    url: '/open/getRstPostList.act',
    method: 'post',
    data
  })
}

// 获取API详情
export function getOpenRstApiDetialApi(data) {
  return request({
    url: '/open/getRstApiDetial.act',
    method: 'post',
    data
  })
}
