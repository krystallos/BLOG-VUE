import request from '@/utils/request'

// 获取文件路径列表
export function selectImageAlbumApi(data) {
  return request({
    url: '/api/selectImageAlbum.act',
    method: 'post',
    data
  })
}

// 删除文件路径
export function delImageAlbumApi(data) {
  return request({
    url: '/api/delImageAlbum.act',
    method: 'post',
    data
  })
}

// 更新文件路径
export function fileUtilUpdateApi(data) {
  return request({
    url: '/api/fileUtilUpdate.act',
    method: 'post',
    data
  })
}

// 收藏文件
export function likeImageAlbumApi(data) {
  return request({
    url: '/api/likeImageAlbum.act',
    method: 'post',
    data
  })
}

// 获取文件路径详情
export function editImageAlbumApi(data) {
  return request({
    url: '/api/editImageAlbum.act',
    method: 'post',
    data
  })
}