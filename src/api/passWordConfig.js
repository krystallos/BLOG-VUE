import request from '@/utils/request'

// 获取列表
export function passWordMineListApi(data) {
  return request({
    url: '/api/passWordMine.act',
    method: 'post',
    data
  })
}

// 新增修改删除
export function updatePassWordUtilApi(data) {
  return request({
    url: '/api/updatePassWordUtil.act',
    method: 'post',
    data
  })
}

// 新增修改删除
export function passWordUtilInfoApi(data) {
  return request({
    url: '/api/passWordUtilInfo.act',
    method: 'post',
    data
  })
}