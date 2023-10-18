import request from "@/utils/request";

//查询公司数据
export function getCompanyData(data) {
 return request({
   url:'/company/getCompanyData',
   method:'post',
   data:data
 })
}

