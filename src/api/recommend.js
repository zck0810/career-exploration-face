import request from '@/utils/request'

export function getRecommendData(data){
  return request({
    url:'/runPython',
    method:'post',
    data:data
  })
}
