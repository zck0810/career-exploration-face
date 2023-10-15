import request from '@/utils/request'

export function getTechnicalFrequencyStatistics() {
  return request({
    url: '/technology/getTechnicalFrequencyStatistics',
    method: "get",
  });
}
