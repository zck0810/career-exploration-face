<!--
<template>
  <div>
    <div id="companyScale" style="height: 26vh; width: 96%;margin-left: 10px; padding-top: 12px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getCompanyScaleData } from '@/api/companyScale'

export default {
  name: 'companyScale',
  data(){
    return{
      companyScale:[]
    }
  },

  mounted () {

    getCompanyScaleData(selectedCity).then(res=>{
      const tempCompanyScale = res.data[0]
      const {
        hundred_to_five_hundred,
        less_than_fifty,
        thousand_to_five_thousand,
        fifty_to_hundred,
        greater_than_five_thousand,
        five_hundred_to_thousand
      } = tempCompanyScale
      this.companyScale.push({name:'50人以下',value: less_than_fifty})
      this.companyScale.push({name:'500-100人',value: fifty_to_hundred})
      this.companyScale.push({name:'100-500人',value: hundred_to_five_hundred})
      this.companyScale.push({name:'500-1000人',value: five_hundred_to_thousand})
      this.companyScale.push({name:'1000-5000人',value: thousand_to_five_thousand})
      this.companyScale.push({name:'5000人以上',value: greater_than_five_thousand})
      this.initPieData()
    })
  },
  methods:{
    initPieData(){
      const chartDom = document.getElementById('companyScale')
      const myChart = echarts.init(chartDom)
      let option

      option = {
        backgroundColor: 'rgba(15,55,95,0.18)',
        title: {                      // 添加标题
          text: '公司规模占比',      // 标题内容
          textStyle: {
            color: 'yellow'           // 标题文字颜色
          },
          left: 'center'              // 标题居中显示
        },
        legend: {
          top: '10%',
          left: 'center',
          textStyle: {
            color: 'white' // 将字体颜色设置为白色
          }
        },
        series: [
          {
            name: '公司规模占比',
            type: 'pie',
            top: 60,
            radius: ['50%', '95%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold',
                formatter: '{b}\n {d}%',
                color: '#92e804'
              }
            },
            labelLine: {
              show: false
            },
            data: this.companyScale
          }
        ]
      };

      option && myChart.setOption(option);
      const companyScale = document.querySelector('#companyScale')
      //放置 获取DOM 节点时 去监听
      const observer = new ResizeObserver(() => {
        myChart.resize();
      });
      observer.observe(companyScale);
    }
  }
}
</script>

<style scoped>

</style>
-->
