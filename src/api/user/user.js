import request from '@/utils/request';
import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage';

export function userLogin(data) {
  return request({
    url: '/sysuser/login',
    method: 'post',
    data
  });
}
// 获取验证码
export function getCaptcha(key) {
  return request({
    url: '/sysuser/randomImage/' + key,
    method: 'get'
  });
}

export function getInfo(token) {
  return request({
    url: '/sysuser/info',
    method: 'get'
  });
}

export function logout() {
  return request({
    url: '/sysuser/logout',
    method: 'post'
  });
}

// 获取所有用户信息
export function getUsers(currentPage, pageSize) {
  return request({
    url: '/sysuser/users',
    method: 'get',
    params: { currentPage, pageSize }
  });
}

// 添加用户信息
export function addUsers(userInfo) {
  return request({
    url: '/sysuser/adduser',
    method: 'post',
    data: userInfo
  });
}

const deleteUserById = (params) => deleteAction('/sysuser/deluser', params);
export {
  deleteUserById
};
