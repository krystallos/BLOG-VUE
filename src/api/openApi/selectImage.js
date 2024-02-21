import request from '@/utils/request'

// 获取小说列表
export function selectSaucenaoImgsApi(data) {
  return request({
    url: '/open/selectSaucenaoImgs.act',
    method: 'post',
    data
  })
}