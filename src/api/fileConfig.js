import request from '@/utils/request'

// 获取文件路径列表
export function fileUtilListApi(data) {
  return request({
    url: '/api/fileUtilList.act',
    method: 'post',
    data
  })
}

// 删除文件路径
export function delFileUtilApi(data) {
  return request({
    url: '/api/delFileUtil.act',
    method: 'post',
    data
  })
}

// 更新文件路径
export function fileUtilUpdateApi(data) {
  return request({
    url: '/api/fileUtilUpdate.act',
    method: 'post',
    data
  })
}

// 新增文件路径
export function fileUtilInsertApi(data) {
  return request({
    url: '/api/fileUtilInsert.act',
    method: 'post',
    data
  })
}

// 获取文件路径详情
export function fileUtilInfoApi(data) {
  return request({
    url: '/api/fileUtilInfo.act',
    method: 'post',
    data
  })
}
