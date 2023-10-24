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

//查询职位数据
export function getPositionData(data) {
  return request({
    url:'/liepin/getPositionData',
    method:'post',
    data:data
  })
}


export function getEducationCount(){
  return request({
    url:'/liepin/getEducationCount',
    method:'get',
  })
}
