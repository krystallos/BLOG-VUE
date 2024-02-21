import request from '@/utils/request'

// 获取词库信息
export function apiSelectTabApi(data) {
  return request({
    url: '/api/apiSelectTab.act',
    method: 'post',
    data
  })
}

// 获取词库顶级列表
export function aiFixedDicInfoNameApi(data) {
  return request({
    url: '/api/aiFixedDicInfoName.act',
    method: 'post',
    data
  })
}

// 获取词库二级列表
export function aiSecondDicInfoNameApi(data) {
  return request({
    url: '/api/aiSecondDicInfoName.act',
    method: 'post',
    data
  })
}

// 删除词汇
export function delWordsAiApi(data) {
  return request({
    url: '/api/delWordsAi.act',
    method: 'post',
    data
  })
}
