import request from '@/utils/request'

export function getFreshGraduateSalary(){
  return request({
    url:'/fresh-graduate-salary/getFreshGraduateSalary',
    method:'get',
  })
}
