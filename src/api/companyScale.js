import request from '@/utils/request'

export function getCompanyScaleData(selectedCity){
  return request({
    url:'/company/getCompanyScaleData',
    method:'get',
    params:{selectedCity: selectedCity}
  })
}
