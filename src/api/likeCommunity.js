import request from '@/utils/request'

// 加入社区列表(卡片)
export function innerJoinLikeApi(data) {
  return request({
    url: '/api/innerJoinLike.act',
    method: 'post',
    data
  })
}

// 获取社区列表(卡片)
export function likeMenuTabPageApi(data) {
  return request({
    url: '/api/likeMenuTabPage.act',
    method: 'post',
    data
  })
}

// 添加社区
export function addLikeMenuApi(data) {
  return request({
    url: '/api/addLikeMenu.act',
    method: 'post',
    data
  })
}

// 删除社区
export function delLikeMenuApi(data) {
  return request({
    url: '/api/delLikeMenu.act',
    method: 'post',
    data
  })
}

// 修改社区
export function editLikeMenuApi(data) {
  return request({
    url: '/api/editLikeMenu.act',
    method: 'post',
    data
  })
}

// 获取单个社区信息
export function getLikeMenuApi(data) {
  return request({
    url: '/api/getLikeMenu.act',
    method: 'post',
    data
  })
}
