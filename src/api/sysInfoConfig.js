import request from '@/utils/request'

// 获取系统信息列表(当天)
export function selectSysInfoApi(data) {
  return request({
    url: '/api/selectSysInfo.act',
    method: 'post',
    data
  })
}

// 获取支付统计图
export function echartFindListApi(data) {
  return request({
    url: '/api/echartFindList.act',
    method: 'post',
    data
  })
}
