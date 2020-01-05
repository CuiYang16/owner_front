import request from '@/utils/request'

export function userLogin(data) {
  return request({
    url: '/sysuser/login',
    method: 'post',
    data
  })
}
