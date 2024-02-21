import request from '@/utils/request'

// 获取邮件详情
export function getEmail(data) {
  return request({
    url: '/api/getMineEmil.act',
    method: 'post',
    data
  })
}

// 获取邮件列表
export function getEmailListApi(data) {
  return request({
    url: '/api/mineEmilTab.act',
    method: 'post',
    data
  })
}

// 删除邮件
export function stateEmailListApi(data) {
  return request({
    url: '/api/typeFlagEmail.act',
    method: 'post',
    data
  })
}

// 发送邮件
export function sendEmailApi(data) {
  return request({
    url: '/api/sendEmail.act',
    method: 'post',
    data
  })
}