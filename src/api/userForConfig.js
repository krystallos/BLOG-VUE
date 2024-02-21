import request from '@/utils/request'

// 获取用户列表
export function userSelectApi(data) {
  return request({
    url: '/api/userSelect.act',
    method: 'post',
    data
  })
}

// 修改用户状态
export function userUpdateStateApi(data) {
  return request({
    url: '/api/userUpdateState.act',
    method: 'post',
    data
  })
}

// 修改用户信息
export function userUpdateApi(data) {
  return request({
    url: '/api/userUpdate.act',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserApi(data) {
  return request({
    url: '/api/getUser.act',
    method: 'post',
    data
  })
}

// 获取人员信息
export function selectPersonEnityApi(data) {
  return request({
    url: '/api/selectPersonEnity.act',
    method: 'post',
    data
  })
}

// 修改用户密码
export function userPassBackApi(data) {
  return request({
    url: '/api/userPassBack.act',
    method: 'post',
    data
  })
}