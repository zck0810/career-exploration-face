<template>
  <div>
    <div id="main" style="width: 97%; height: 40vh;margin-left: 10px;padding-top: 10px;"> </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'index',
  mounted () {
    this.initData()
  },
  methods:{
    initData(){
      const chartDom = document.getElementById('main')
      const myChart = echarts.init(chartDom)
      let option

      option = {
        backgroundColor: 'rgba(15,55,95,0.16)',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          top:20,
          data: ['最高平均薪资', '平均薪资', '最低平均薪资'],
          textStyle: {
            color: 'yellow'
          }
        },
        xAxis: {
          name:'学历',
          data: ['本科', '统招本科', '硕士', '博士', '大专', '中专', '不限学历'],
          axisLine: {
            lineStyle: {
              color: '#00d8ff'
            }
          },
          axisLabel: {
            fontSize: 13 // 设置 x 轴字体大小为 14
          }
        },
        yAxis: {
          name:'薪资',
          splitLine: { show: false },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#00d8ff'
            }
          }
        },
        series: [
          {
            name: '最高平均薪资',
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 15,
            data: [7000, 7900, 10000, 14000, 4000, 3000, 6000]
          },
          {
            name: '最低平均薪资',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              borderRadius: 5,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(177,13,231,0.54)' },
                { offset: 1, color: 'rgba(177,13,231,0.76)' }
              ])
            },
            data: [5230, 6460, 8800, 11200, 3000, 2600, 5500]
          },
          {
            name: '平均薪资',
            type: 'bar',
            barGap: '-100%',
            barWidth: 20,
            itemStyle: {
              borderRadius: 5,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(224,8,121,0.93)' },
                { offset: 0.2, color: 'rgba(224,8,121,0.66)' },
                { offset: 1, color: 'rgba(224,8,121,0.25)' }
              ])
            },
            z: -12,
            data:  [6000, 6800, 9000, 12000, 3200, 2700, 5800]
          }
        ]
      };

      option && myChart.setOption(option);

    }
  }
}
</script>

<style scoped>

</style>
