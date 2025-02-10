import request from '@/utils/request'

// 判断登入信息
export function selectUserApi(data) {
  return request({
    url: '/open/selectUser.act',
    method: 'post',
    data
  })
}

// 获取相册时间轴
export function selectImageGroupTimeApi(data) {
  return request({
    url: '/open/selectImageGroupTime.act',
    method: 'post',
    data
  })
}

// 获取对应时间轴的相片
export function selectImageGroupAlbumApi(data) {
  return request({
    url: '/open/selectImageGroupAlbum.act',
    method: 'post',
    data
  })
}
