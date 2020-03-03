import request from '@/utils/request'

export function userLogin(data) {
  return request({
    url: '/sysuser/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/sysuser/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
