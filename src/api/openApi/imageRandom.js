import request from '@/utils/request'

// 获取瑟图集
export function fileRandomApi(data) {
  return request({
    url: '/open/fileRandom.act',
    method: 'post',
    data
  })
}

// 图片评分
export function scoreImageApi(data) {
  return request({
    url: '/open/scoreImage.act',
    method: 'post',
    data
  })
}

// 图片tag添加
export function saveImageTagApi(data) {
  return request({
    url: '/open/saveImageTag.act',
    method: 'post',
    data
  })
}
