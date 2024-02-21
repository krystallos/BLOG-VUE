import request from '@/utils/request'

// 查询自己的维护信息
export function mineSysMsgGetApi(data) {
  return request({
    url: '/api/mineSysMsgGet.act',
    method: 'post',
    data
  })
}

// 查询BUG记录
export function sysMsgErrorApi(data) {
  return request({
    url: '/api/sysMsgError.act',
    method: 'post',
    data
  })
}

// 查询BUG详情
export function getErrBugApi(data) {
  return request({
    url: '/api/getErrBug.act',
    method: 'post',
    data
  })
}

// 提交BUG评论
export function sayErrFromBugApi(data) {
  return request({
    url: '/api/sayErrFromBug.act',
    method: 'post',
    data
  })
}

// 获取BUG评论
export function getSayErrFromBugApi(data) {
  return request({
    url: '/api/getSayErrFromBug.act',
    method: 'post',
    data
  })
}

// 撤回BUG
export function backErrFromAddApi(data) {
  return request({
    url: '/api/backErrFromAdd.act',
    method: 'post',
    data
  })
}

// 提交BUG
export function upErrFromBugApi(data) {
  return request({
    url: '/api/upErrFromBug.act',
    method: 'post',
    data
  })
}
