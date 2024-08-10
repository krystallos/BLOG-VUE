import request from '@/utils/request'

// 获取文档列表
export function rstPostList(data) {
  return request({
    url: '/api/rstPostList.act',
    method: 'post',
    data
  })
}

// 删除文档
export function rstPostDeleteApi(data) {
  return request({
    url: '/api/rstPostDelete.act',
    method: 'post',
    data
  })
}

// 获取文档下拉框
export function getRstPostChiListApi(data) {
  return request({
    url: '/api/getRstPostChiList.act',
    method: 'post',
    data
  })
}

// 获取文档详情
export function getRstPostApi(data) {
  return request({
    url: '/api/getRstPost.act',
    method: 'post',
    data
  })
}

// 获取文档列表详情
export function getRstPostListApi(data) {
  return request({
    url: '/api/getRstPostList.act',
    method: 'post',
    data
  })
}

// 删除API接口
export function rstDeleteApi(data) {
  return request({
    url: '/api/rstDelete.act',
    method: 'post',
    data
  })
}

// 获取API详情
export function getRstApiDetialApi(data) {
  return request({
    url: '/api/getRstApiDetial.act',
    method: 'post',
    data
  })
}

// 保存API详情
export function saveRstApiDetialApi(data) {
  return request({
    url: '/api/saveRstApiDetial.act',
    method: 'post',
    data
  })
}

// 修改文档详情
export function editRstPostApi(data) {
  return request({
    url: '/api/editRstPost.act',
    method: 'post',
    data
  })
}

// 保存文档
export function saveRstPostApi(data) {
  return request({
    url: '/api/saveRstPost.act',
    method: 'post',
    data
  })
}

// 生成Key
export function insertRstKeyApi(data) {
  return request({
    url: '/api/insertRstKey.act',
    method: 'post',
    data
  })
}

// 获取Key列表
export function getRstPostKeyListApi(data) {
  return request({
    url: '/api/getRstPostKeyList.act',
    method: 'post',
    data
  })
}

// 删除Key
export function delRstApiKeyApi(data) {
  return request({
    url: '/api/delRstApiKey.act',
    method: 'post',
    data
  })
}
