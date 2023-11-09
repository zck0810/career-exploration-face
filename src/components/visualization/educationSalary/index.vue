<template>
  <div>
    <div id="educationSalary" style="width: 100%; height: 31vh;margin-left: 5px;padding-top: 10px;"> </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getFreshGraduateSalary } from '@/api/freshGraduateSalary'

export default {
  name: 'index',
  data(){
    return{
      time:[],
      educationData:['大专','本科不分区','本科普通院校','本科重点院校','硕士普通院校','硕士重点院校','博士普通院校','博士重点院校'],
      countData1:[],
      countData2:[],
      countData3:[],
    }
  },
  mounted () {
    getFreshGraduateSalary().then(res=>{
      const  tempData = res.data
      tempData.forEach(item=>{
        const {
          collegeDegree,
          undergraduateUnzoned,
          generalMaster,
          generalDoctor,
          keyDoctor,
          generalUndergraduate,
          keyUndergraduate,
          time,
          keyMaster
        } = item
        this.time.push(time)
        if(time === '2021届'){
          this.countData1.push(collegeDegree)
          this.countData1.push(undergraduateUnzoned)
          this.countData1.push(generalUndergraduate)
          this.countData1.push(keyUndergraduate)
          this.countData1.push(generalMaster)
          this.countData1.push(keyMaster)
          this.countData1.push(generalDoctor)
          this.countData1.push(keyDoctor)
        }
        if(time === '2022届'){
          this.countData2.push(collegeDegree)
          this.countData2.push(undergraduateUnzoned)
          this.countData2.push(generalUndergraduate)
          this.countData2.push(keyUndergraduate)
          this.countData2.push(generalMaster)
          this.countData2.push(keyMaster)
          this.countData2.push(generalDoctor)
          this.countData2.push(keyDoctor)
        }
        if(time === '2023届'){
          this.countData3.push(collegeDegree)
          this.countData3.push(undergraduateUnzoned)
          this.countData3.push(generalUndergraduate)
          this.countData3.push(keyUndergraduate)
          this.countData3.push(generalMaster)
          this.countData3.push(keyMaster)
          this.countData3.push(generalDoctor)
          this.countData3.push(keyDoctor)
        }
      })
      this.initData()
    })

  },
  methods:{
    initData(){
      const chartDom = document.getElementById('educationSalary')
      const myChart = echarts.init(chartDom)
      let option

      option = {
        title: {                      // 添加标题
          text: '应届生各学历与起薪关系',      // 标题内容
          textStyle: {
            color: 'yellow'           // 标题文字颜色
          },
          left: 'center'              // 标题居中显示
        },
        backgroundColor: 'rgba(15,55,95,0.16)',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          top:30,
          data: this.time,
          textStyle: {
            color: 'yellow',
            fontSize: 15, // 设置 x 轴字体大小为 14
          }
        },
        xAxis: {
          name:'学历',
          data: this.educationData,
          axisLine: {
            lineStyle: {
              color: '#00d8ff',
            }
          },
          axisLabel: {
            fontSize: 12, // 设置 x 轴字体大小为 14
            rotate: 30 // 将文字旋转90度，使其竖着展示
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
            name: '2021届',
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 15,
            data: this.countData1
          },
          {
            name: '2022届',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              borderRadius: 5,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(177,13,231,0.54)' },
                { offset: 1, color: 'rgba(177,13,231,0.76)' }
              ])
            },
            data: this.countData2
          },
          {
            name: '2023届',
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
            data:  this.countData3
          }
        ]
      };

      option && myChart.setOption(option);
      const educationSalary = document.querySelector('#educationSalary')
      //放置 获取DOM 节点时 去监听
      const observer = new ResizeObserver(() => {
        myChart.resize();
      });
      observer.observe(educationSalary);

    }
  }
}
</script>

<style scoped>

</style>
