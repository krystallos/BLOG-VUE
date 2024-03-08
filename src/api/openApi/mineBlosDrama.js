import request from '@/utils/request'

// 获取追番信息
export function dramaListApi(data) {
  return request({
    url: '/open/dramaList.act',
    method: 'post',
    data
  })
}