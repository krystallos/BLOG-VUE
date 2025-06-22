import request from '@/utils/request'

// 更新文件夹信息
export function updateEhentaiFileApi(data) {
  return request({
    url: '/api/updateEhentaiFile.act',
    method: 'post',
    data
  })
}

// 获取文件夹列表
export function selectEhentaiFileApi(data) {
  return request({
    url: '/api/selectEhentaiFile.act',
    method: 'post',
    data
  })
}

// 更新文件夹
export function editEhentaiFileApi(data) {
  return request({
    url: '/api/editEhentaiFile.act',
    method: 'post',
    data
  })
}

// 获取文件
export function openEhentaiFileApi(data) {
  return request({
    url: '/api/openEhentaiFile.act',
    method: 'post',
    data
  })
}