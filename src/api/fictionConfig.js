import request from '@/utils/request'

// 获取标签列表
export function fictionUtilListApi(data) {
  return request({
    url: '/api/fictionUtilList.act',
    method: 'post',
    data
  })
}

// 删除标签
export function delFictionUtilApi(data) {
  return request({
    url: '/api/delFictionUtil.act',
    method: 'post',
    data
  })
}

// 新增标签
export function insertFictionUtilApi(data) {
  return request({
    url: '/api/insertFictionUtil.act',
    method: 'post',
    data
  })
}

// 修改标签
export function updateFictionUtilApi(data) {
  return request({
    url: '/api/updateFictionUtil.act',
    method: 'post',
    data
  })
}

// 获取标签详情
export function fictionUtilTabInfoApi(data) {
  return request({
    url: '/api/fictionUtilTabInfo.act',
    method: 'post',
    data
  })
}
