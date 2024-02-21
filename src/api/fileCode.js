import request from '@/utils/request'

// 获取二维码列表
export function fileCodeLookListApi(data) {
  return request({
    url: '/api/fileCodeLook.act',
    method: 'post',
    data
  })
}
