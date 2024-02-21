import request from '@/utils/request'

// 获取小说列表
export function fictionFileListApi(data) {
  return request({
    url: '/api/fictionFileList.act',
    method: 'post',
    data
  })
}

// 获取小说信息
export function fictionFileTabInfoApi(data) {
  return request({
    url: '/api/fictionFileTabInfo.act',
    method: 'post',
    data
  })
}

// 获取全部的小说标签
export function selectFileUtilDicNoTabApi(data) {
  return request({
    url: '/api/selectFileUtilDicNoTab.act',
    method: 'post',
    data
  })
}

// 删除小说
export function delFictionFileApi(data) {
  return request({
    url: '/api/delFictionFile.act',
    method: 'post',
    data
  })
}

// 新增小说
export function insertFictionFileApi(data) {
  return request({
    url: '/api/insertFictionFile.act',
    method: 'post',
    data
  })
}

// 修改小说
export function updateFictionFileApi(data) {
  return request({
    url: '/api/updateFictionFile.act',
    method: 'post',
    data
  })
}

// 查询书籍列表
export function fictionFileMainListApi(data) {
  return request({
    url: '/api/fictionFileMainList.act',
    method: 'post',
    data
  })
}

// 删除书籍列表
export function delFictionMainApi(data) {
  return request({
    url: '/api/delFictionMain.act',
    method: 'post',
    data
  })
}

// 查询封面
export function lookBookMainCoverApi(data) {
  return request({
    url: '/api/lookBookMainCover.act',
    method: 'post',
    data
  })
}
