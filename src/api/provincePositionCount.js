import request from '@/utils/request'

export function getProvincePositionCount(){
  return request({
    url:'/province-position-count/getProvincePositionCount',
    method:'get',
  })
}



