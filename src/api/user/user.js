import request from '@/utils/request';

export function userLogin(data) {
  return request({
    url: '/sysuser/login',
    method: 'post',
    data
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
    url: '/user/logout',
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
