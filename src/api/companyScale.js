import request from '@/utils/request'

export function getCompanyScaleData(){
  return request({
    url:'/company-scale/getCompanyScaleData',
    method:'get',
  })
}
