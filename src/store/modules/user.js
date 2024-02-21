import { loginApi, logoutApi, getInfoApi, getMenuApi } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { fnAddDynamicMenuRoutes } from '@/router/getAsyncRouter' // 动态路由
import store from '..'

const getDefaultState = () => {
  return {
    token: getToken(),
    menu: [],
  }
}

const state = getDefaultState()

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
}

const actions = {
  //登入
  login({ commit }, userInfo) {
    const { logname, logpass, ipConfig, areaConfig } = userInfo
    return new Promise((resolve, reject) => {
      loginApi({ logname: logname.trim(), logpass: logpass , areaId: ipConfig, orgSessionId: areaConfig }).then(response => {
        const { code, data, textMsg } = response;
        if(code == 200){
          setToken(data);
          resolve();
        }else{
          reject(textMsg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  //退出
  logout({ commit , state}) {
    return new Promise((resolve, reject) => {
      logoutApi().then(() => {
        removeToken();
        resetRouter();
        sessionStorage.clear();
        resolve();
      }).catch(error => {
        reject(error)
      })
    })
  },

  //获取用户信息
  getInfo({ commit , state }) {
    return new Promise((resolve, reject) => {
      getInfoApi().then(response => {
        const { data } = response;
        if (data == null) {
          reject('信息验证失败，请重新登入')
        }
        const { person, menu } = data
        sessionStorage.setItem("menu", JSON.stringify(menu));
        let menuTab = fnAddDynamicMenuRoutes(menu);
        sessionStorage.setItem("person", JSON.stringify(person));
        commit('SET_MENU', menuTab)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  //获取菜单
  getMenu({ commit , state }) {
    return new Promise((resolve, reject) => {
      if(sessionStorage.getItem("menu") == null){
        getMenuApi().then(response => {
          const { data } = response;
          sessionStorage.setItem("menu", JSON.stringify(data));
          let menuTab = fnAddDynamicMenuRoutes(data);
          commit('SET_MENU', menuTab)
          resolve()
        }).catch(error => {
          reject(error)
        })
      }else{
        let menuFind = fnAddDynamicMenuRoutes(JSON.parse(sessionStorage.getItem("menu")));
        commit('SET_MENU', menuFind);
        resolve()
      }
    })
  },

  //动态菜单路由
  menuRouter({ commit }, data) {
    commit('SET_MENU', data)
  },

  //删除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken()
      resolve()
    })
  }


}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
