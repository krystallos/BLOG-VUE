import request from '@/utils/request'

// 获取图片列表
export function fileImageTabListApi(data) {
  return request({
    url: '/api/fileImageTab.act',
    method: 'post',
    data
  })
}

//获取外置录入图片缓存
export function getWorkImageTempApi(data) {
  return request({
    url: '/api/getWorkImageTemp.act',
    method: 'post',
    data
  })
}

//新增外置录入图片
export function fileGetHandWorkSaveFileApi(data) {
  return request({
    url: '/api/fileGetHandWorkSaveFile.act',
    method: 'post',
    data
  })
}

//同步文件
export function fileReadyApi(data) {
  return request({
    url: '/api/fileReady.act',
    method: 'post',
    data
  })
}

//获取文件上传缓存
export function uploadImageItemApi(data) {
  return request({
    url: '/api/uploadImageItem.act',
    method: 'post',
    data
  })
}

//删除文件
export function fileDelOkApi(data) {
  return request({
    url: '/api/fileDelOk.act',
    method: 'post',
    data
  })
}

//同步标签
export function fileTagThreadApi(data) {
  return request({
    url: '/api/fileTagThread.act',
    method: 'post',
    data
  })
}

//分享图片生成二维码
export function codeFileApi(data) {
  return request({
    url: '/api/codeFile.act',
    method: 'post',
    data
  })
}

export function getImageDetial(data){
  return request({
    url: '/api/getfileImageDetial.act',
    method: 'post',
    data
  })
}