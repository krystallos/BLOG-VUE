import request from '@/utils/request'

// 获取Api列表
export function postApiTabApi(data) {
  return request({
    url: '/api/postApiTab.act',
    method: 'post',
    data
  })
}

// 新增Api
export function postApiInsertApi(data) {
  return request({
    url: '/api/postApiInsert.act',
    method: 'post',
    data
  })
}

// 删除Api
export function postApiDeleteApi(data) {
  return request({
    url: '/api/postApiDelete.act',
    method: 'post',
    data
  })
}
