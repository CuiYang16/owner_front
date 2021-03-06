import {
  userLogin,
  logout,
  getInfo
} from '@/api/user/user';
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth';
import router, {
  resetRouter
} from '@/router';
import { Message } from 'element-ui';
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const {
      username,
      password,
      rememberMe,
      captcha,
      checkKey
    } = userInfo;
    return new Promise((resolve, reject) => {
      userLogin({
        userName: username.trim(),
        passWord: password,
        rememberMe: rememberMe,
        captcha: captcha,
        checkKey: checkKey
      }).then(response => {
        const res = response.data;
        commit('SET_TOKEN', res.data.token);
        setToken(res.data.token);
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const res = response.data;
        if (!res.data) {
          reject('请重新登录！');
        }

        const {
          roles,
          userName
        } = res.data;

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!');
        }
        commit('SET_ROLES', roles);
        commit('SET_NAME', userName);
        commit('SET_AVATAR', '');
        commit('SET_INTRODUCTION', '');

        resolve(res.data);
      }).catch(error => {
        reject(error);
      });
    });
  },

  // user logout
  logout({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      logout().then(res => {
        console.log(res.data);
        if (res.data.success) {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resetRouter();

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, {
            root: true
          });
        } else {
          Message.error(res.data.message);
        }
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  changeRoles({
    commit,
    dispatch
  }, role) {
    return new Promise(async resolve => {
      const token = role + '-token';

      commit('SET_TOKEN', token);
      setToken(token);
      console.log(await dispatch('getInfo'));
      const {
        roles
      } = await dispatch('getInfo');

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      });

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, {
        root: true
      });

      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
