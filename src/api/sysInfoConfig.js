import request from '@/utils/request'

// 获取系统信息
export function getSystemConfigApi(data) {
  return request({
    url: '/api/getSystemConfig.act',
    method: 'post',
    data
  })
}

// 获取内存信息
export function getSystemMeronyApi(data) {
  return request({
    url: '/api/getSystemMerony.act',
    method: 'post',
    data
  })
}

// 获取磁盘列表
export function selectDicApi(data) {
  return request({
    url: '/api/selectDic.act',
    method: 'post',
    data
  })
}

// 获取内存统计图
export function echartFindListApi(data) {
  return request({
    url: '/api/echartFindList.act',
    method: 'post',
    data
  })
}

// 获取网络统计图
export function echartNetWorkListApi(data) {
  return request({
    url: '/api/echartNetWorkList.act',
    method: 'post',
    data
  })
}