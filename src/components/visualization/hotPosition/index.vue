<template>
  <div id="position" style="width: 100%; height: 100%;">
  </div>
</template>
<script>
import * as echarts from 'echarts';
import {getHotPosition} from "@/api/liepin";
export default {
  name:'hotPosition',
  mounted() {
    this.hotJob()
  },
  methods:{
    async hotJob(){
      const res = await getHotPosition();
      let dataSource = []
      for(let i=0;i<20;i++){
        dataSource.push(Object.values(res.data[i]))
      }
      dataSource = dataSource.reverse();
      const chartDom = document.getElementById('position');
      const myChart = echarts.init(chartDom);
      let option = {
        title: {
          text: '热门岗位Top20',
          left: 'center', // 设置标题居中
          top: 20, // 设置距离顶部 10px
          textStyle: {
            color:  'rgb(0,255,234)',
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // 设置背景透明度为 80%
        tooltip: {
          trigger: 'item'
        },
        dataset: {
          source: dataSource
        },
        grid: {
          containLabel: true,
          width: '83%',
          left: 10
        },
        xAxis: {
          name: '岗位数量',
          position: 'left',
          nameTextStyle:{
            color:"#00ffff",
            fontSize:10,
          },
          axisLabel: {
            rotate: 0 ,// 设置旋转角度，正值表示逆时针旋转，负值表示顺时针旋转
            color:"#00ffff",
          }
        },
        yAxis: {
          name: "岗位名称",
          nameTextStyle: {
            color:"#00ffff",
            position: 'bottom'
          },
          type: 'category' ,
          position:  'left',
          axisLabel: {
            rotate: 0, // 设置旋转角度，正值表示逆时针旋转，负值表示顺时针旋转
            color:"#00ffff",
            fontSize:12,
          }
        },
        series: [
          {
            type: 'bar',
            encode: {
              x: 'amount',
              y: 'product'
            },
            itemStyle: {
              barBorderRadius: [0, 20, 20, 0], // 仅设置末端为圆角，其他角为直角
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
          }
        ]
      };
      option && myChart.setOption(option);
      const position = document.querySelector('#position')
      //放置 获取DOM 节点时 去监听
      const observer = new ResizeObserver(() => {
        myChart.resize();
      });
      observer.observe(position);
    }
  }
}

</script>

<style>

</style>
