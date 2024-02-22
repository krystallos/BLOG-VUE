import request from '@/utils/request'

// 获取个人信息
export function mineBlosTabApi(data) {
  return request({
    url: '/api/mineBlosTab.act',
    method: 'post',
    data
  })
}

// 获取博客列表
export function mineBlosArticleApi(data) {
  return request({
    url: '/api/mineBlosArticle.act',
    method: 'post',
    data
  })
}

// 删除博客
export function delMineBlosArticleApi(data) {
  return request({
    url: '/api/delMineBlosArticle.act',
    method: 'post',
    data
  })
}
