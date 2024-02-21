import request from '@/utils/request'

// 获取文档列表
export function codeFileLook(data) {
  return request({
    url: '/open/codeFileLook.act',
    method: 'post',
    data
  })
}
