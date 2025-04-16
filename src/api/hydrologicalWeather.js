import request from '@/utils/request'

// 获取水文信息
export function getHydrologicalListApi(data) {
  return request({
    url: '/api/getHydrologicalList.act',
    method: 'post',
    data
  })
}

// 获取天气信息
export function getWeatherListApi(data) {
  return request({
    url: '/api/getWeatherList.act',
    method: 'post',
    data
  })
}

// 获取鱼、潮汐信息
export function getHydrologicalTimeApi(data) {
  return request({
    url: '/api/getHydrologicalTime.act',
    method: 'post',
    data
  })
}
