import request from '@/utils/request'

// 向邮箱发送验证码
export function sendGoBackEmailApi(data) {
  return request({
    url: '/open/sendGoBackEmail.act',
    method: 'post',
    data
  })
}

// 验证验证码
export function goBackCodeVerifyApi(data) {
  return request({
    url: '/open/goBackCodeVerify.act',
    method: 'post',
    data
  })
}

// 修改密码
export function changePassWordApi(data) {
  return request({
    url: '/open/changePassWord.act',
    method: 'post',
    data
  })
}
