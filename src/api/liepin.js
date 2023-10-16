import request from '@/utils/request'

export function getCityPositionCount(){
  return request({
    url:'/liepin/getCityPositionCount',
    method:'get',
  })
}


export function getHotPosition(){
  return request({
    url:'/liepin/getHotPosition',
    method:'get',
  })
}
