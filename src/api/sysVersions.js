import request from '@/utils/request'

// 获取WEB版本详情
export function sysVersionsWebTabApi(data) {
  return request({
    url: '/api/sysVersionsWebTab.act',
    method: 'post',
    data
  })
}

// 获取APP版本详情
export function sysVersionsAppTabApi(data) {
  return request({
    url: '/api/sysUpdateVersionsApp.act',
    method: 'post',
    data
  })
}

// 提交版本信息
export function upVersionTextApi(data) {
  return request({
    url: '/api/upVersionText.act',
    method: 'post',
    data
  })
}

// 获取APP版本信息
export function sysAppUpdateVersionsApi(data) {
  return request({
    url: '/open/sysAppUpdateVersions.act',
    method: 'post',
    data
  })
}

// 获取首条公告
export function selectOneAndOneSysVersionsApi(data) {
  return request({
    url: '/api/selectOneAndOneSysVersions.act',
    method: 'post',
    data
  })
}

// 使用session获取公告
export function selectSessionSysVersionsApi(data) {
  return request({
    url: '/open/selectSessionSysVersions.act',
    method: 'post',
    data
  })
}

// 确认通告
export function sysVersionsWebIssApi(data) {
  return request({
    url: '/api/sysVersionsWebIss.act',
    method: 'post',
    data
  })
}
