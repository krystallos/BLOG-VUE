import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'

//axios基础配置
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  //baseURL: '/blosBoot', // url = base url + request url
  timeout: 20000 // 请求超时时间
})

// request interceptor
service.interceptors.request.use(
  config => {
    let person = sessionStorage.getItem("person")
    config.headers['assessToken'] = getToken()
    config.headers['personId'] = person == null?'':JSON.parse(person).personId;
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200 && res.code !== 'Success') {
      if (res.code === 508 || res.code === 514 || res.code === 230001) {
        Message({
          message: '错误信息【'+res.reslutMsg+'】,错误来源【'+res.textMsg+'】' || 'Error',
          type: 'error',
          duration: 2 * 1000,
          onClose:()=>{
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          }
        })
        return Promise.reject(new Error(res.textMsg || 'Error'))
      }else{
        Message({
          message: res.textMsg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return res
    } else {
      let token = response.headers.assesstoken;
      if(token != null && typeof token != undefined){
        setToken(token)
      }
      return res
    }
  },
  error => {
    //console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
