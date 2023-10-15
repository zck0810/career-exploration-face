import request from '@/utils/request'

export function getVisitCount(){
  return request({
    url:'visit/getVisitCount',
    method:'get'
  })
}
