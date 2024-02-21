import request from '@/utils/request'

// 获取角色列表
export function roleTypeListApi(data) {
  return request({
    url: '/api/roleTypeList.act',
    method: 'post',
    data
  })
}

// 删除角色
export function delRoleApi(data) {
  return request({
    url: '/api/delRole.act',
    method: 'post',
    data
  })
}

// 获取角色信息
export function roleInfoApi(data) {
  return request({
    url: '/api/roleInfo.act',
    method: 'post',
    data
  })
}

// 更新角色信息
export function updateRoleApi(data) {
  return request({
    url: '/api/updateRole.act',
    method: 'post',
    data
  })
}

// 新增角色信息
export function addRoleApi(data) {
  return request({
    url: '/api/addRole.act',
    method: 'post',
    data
  })
}

// 角色拥有的菜单
export function roleMenuTabApi(data) {
  return request({
    url: '/api/roleMenuTab.act',
    method: 'post',
    data
  })
}

// 角色菜单<穿梭框>
export function funcRoleMenuApi(data) {
  return request({
    url: '/api/funcRoleMenu.act',
    method: 'post',
    data
  })
}

// 角色菜单新增删除
export function updateResMenuApi(data) {
  return request({
    url: '/api/updateResMenu.act',
    method: 'post',
    data
  })
}

//角色用户查询<穿梭框>
export function funcRolePersonApi(data) {
  return request({
    url: '/api/funcRolePerson.act',
    method: 'post',
    data
  })
}

// 角色用户新增删除
export function updateResPersonApi(data) {
  return request({
    url: '/api/updateResPerson.act',
    method: 'post',
    data
  })
}