<template>
  <div id="wordCloud" ref="wordCloud" style="height: 40vh; width: 94%;margin-left: 13px; padding-top: 12px;" ></div>
</template>
<script>
import * as echarts from 'echarts'
import 'echarts-wordcloud/dist/echarts-wordcloud'
import 'echarts-wordcloud/dist/echarts-wordcloud.min'

import { getTechnicalFrequencyStatistics } from '@/api/visualization'

export default {
  data() {
    return {
      wordList:[]
    }
  },
  mounted(){
    getTechnicalFrequencyStatistics().then(res=>{
      const technologyAndCount = res.data
      this.wordList = technologyAndCount.map(item => {
        const {
          count,
          technology
        } = item
        return {
          name: technology,
          value: count
        };
      });
      this.initChart();
    })

  },
  methods:{
    initChart(){
      let myChart = echarts.init(this.$refs.wordCloud);
      let option = {
        backgroundColor: 'rgba(15,55,95,0.18)',
        title: {
          text: '技术栈要求词云图',
          left: 'center', // 设置标题居中
          top: 10, // 设置距离顶部 10px
          textStyle: {
            color:  'rgb(0,255,234)',
          }
        },
        tooltip: {
          trigger: 'item',
        },
        textStyle:{
          top: '30',
          color: function() {
            return (
                "rgb(" +
                Math.round(Math.random() * 255) +
                ", " +
                Math.round(Math.random() * 255) +
                ", " +
                Math.round(Math.random() * 255) +
                ")"
            );
          }
        },
        series: [
          {
            type: "wordCloud",
            shape: 'circle',
            //用来调整词之间的距离
            gridSize: 8,
            sizeRange: [12, 30],
            rotationRange: [0,90],
            left: "center",
            top: "center",
            width: "200%",
            height: "200%",
            data: this.wordList
          }
        ]
      };
      option && myChart.setOption(option);
      const wordCloud = document.querySelector('#wordCloud')
      //放置 获取DOM 节点时 去监听
      const observer = new ResizeObserver(() => {
        myChart.resize();
      });
      observer.observe(wordCloud);
    }
  }
}
</script>
<style scoped>
</style>
