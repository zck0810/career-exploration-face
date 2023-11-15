import request from '@/utils/request'

export function getRecommendData(inputValue){
  return request({
    url:'/runPython',
    method:'post',
    params:{inputValue: inputValue}
  })
}
