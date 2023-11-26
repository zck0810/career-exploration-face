import request from '@/utils/request'

export function getCityPositionCount(selectedCity){
  return request({
    url:'/liepin/getCityPositionCount',
    method:'get',
    params:{selectedCity: selectedCity}
  })
}


export function getHotPosition(selectedCity){
  return request({
    url:'/liepin/getHotPosition',
    method:'get',
    params:{selectedCity: selectedCity}
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

//高级筛选
export function getJobInformation(data) {
  return request({
    url:'/liepin/getJobInformation',
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
//获取职位总数
export function getPositionTotal(){
  return request({
    url:'/liepin/getPositionTotal',
    method:'get',
  })
}
//获取万元以上职位总数
export function getHighSalaryTotal(){
  return request({
    url:'/liepin/getHighSalaryTotal',
    method:'get',
  })
}
//获取万元以下职位总数
export function getLowSalaryTotal(){
  return request({
    url:'/liepin/getLowSalaryTotal',
    method:'get',
  })
}

//获取万元以下职位总数
export function getPositionRecommendationData(data){
  return request({
    url:'/liepin/getPositionRecommendationData',
    method:'post',
    data:data
  })
}
