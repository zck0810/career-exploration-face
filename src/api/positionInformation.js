import request from '@/utils/request'

export function getAllData() {
  return request({
    url:'/positionInformation/getAllData',
    method:'get',
  })
}

export function getCityPositionCount(){
  return request({
    url:'/positionInformation/getCityPositionCount',
    method:'get',
  })
}

export function getHotPosition(){
  return request({
    url:'/positionInformation/getHotPosition',
    method:'get',
  })
}
