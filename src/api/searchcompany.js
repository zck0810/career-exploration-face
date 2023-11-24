import request from "@/utils/request";

//查询公司数据
export function getCompanyData(data) {
 return request({
   url:'/company/getCompanyData',
   method:'post',
   data:data
 })
}
//查询公司总数
export function getCompanyTotal() {
 return request({
   url:'/company/getCompanyTotal',
   method:'get',
 })
}

//查询公司数据
export function getHighCompanyInformation(data1) {
  return request({
    url:'/company/getHighCompanyInformation',
    method:'post',
    data:data1
  })
}

