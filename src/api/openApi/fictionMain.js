import request from '@/utils/request'

// 获取小说列表
export function fictionFileNoPageApi(data) {
  return request({
    url: '/open/fictionFileNoPage.act',
    method: 'post',
    data
  })
}

// 获取小说详情
export function fictionDetialApi(data) {
  return request({
    url: '/open/fictionDetial.act',
    method: 'post',
    data
  })
}

//获取小说URL
export function fictionUrlForEpubApi(data) {
  return request({
    url: '/open/fictionUrlForEpub.act',
    method: 'post',
    data
  })
}