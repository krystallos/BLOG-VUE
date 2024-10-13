import request from '@/utils/request'

// 获取字典列表
export function sysConfigListApi(data) {
  return request({
    url: '/api/sysConfigList.act',
    method: 'post',
    data
  })
}

// 获取字典详情
export function getSysConfigApi(data) {
  return request({
    url: '/api/getSysConfig.act',
    method: 'post',
    data
  })
}

// 删除字典详情
export function delSysConfigApi(data) {
  return request({
    url: '/api/delSysConfig.act',
    method: 'post',
    data
  })
}

// 操作字典
export function editSysConfigApi(data) {
  return request({
    url: '/api/editSysConfig.act',
    method: 'post',
    data
  })
}