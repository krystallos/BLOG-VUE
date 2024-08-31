import request from '@/utils/request'

// 获取支付列表
export function consumptionListApi(data) {
  return request({
    url: '/api/consumptionList.act',
    method: 'post',
    data
  })
}

// 获取支付列表
export function consumptionDescriptionsApi(data) {
  return request({
    url: '/api/consumptionDescriptions.act',
    method: 'post',
    data
  })
}

// 获取支付统计图
export function echartConsumptionLeftApi(data) {
  return request({
    url: '/api/echartConsumptionLeft.act',
    method: 'post',
    data
  })
}