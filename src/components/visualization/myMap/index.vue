<template>
  <div class="content">
    <div id="charts" ref="charts" style="width: 98%; height: 90vh;margin-left: 7px;padding-top: 10px;"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import ChinaMap from '@/assets/china.json'
import { getProvincePositionCount } from '@/api/provincePositionCount'

export default {
  data(){
    return{
      provincePositionCountData:[]
    }
  },
  created () {
    this.$nextTick(() => {
      this.initCharts();
    })
  },

  mounted () {
    getProvincePositionCount().then(res=>{
      let provincePositionCount = res.data
      provincePositionCount.forEach(item => {
        const { positionCount, province } = item;
        this.provincePositionCountData.push({'name': province, 'value': positionCount });
      });
      this.initCharts();
    })
  },
  methods: {
    initCharts() {
      const charts = echarts.init(this.$refs["charts"]);
      const option = {
        backgroundColor: 'rgba(15,55,95,0.29)',
        // echarts 图表选项配置
        title: {
          text: '各省市岗位分布',
          left: 'center', // 设置标题居中
          top: 10, // 设置距离顶部 10px
          textStyle: {
            color: 'rgb(0,255,234)',
          }
        },
        tooltip: {
          trigger: 'item',
          formatter:function(params) {
            const c = params.value || 0 // 如果c不存在则赋值为0
            return params.name + '\n' + c;
          },
        },
        visualMap: {
          min: 0,
          max: 20000,
          left: '20px', // 向右移动 30px
          top: 'bottom',
          text: ['高', '低'],
          pieces: [
            {
              lt: 100,
              label: '< 100',
              color: '#E4F3FF'
            },
            {
              gte: 100,
              lt: 500,
              label: ' 100-500 ',
              color: '#E4F3FF'
            },
            {
              gte: 500,
              lt: 3000,
              label: '500-300',
              color: '#AEDBFF'
            },
            {
              gte: 3000,
              lt: 7000,
              label: '3000-7000 ',
              color: '#8CD7E6'
            },
            {
              gte: 7000,
              lt: 10000,
              label: '7000-10000  ',
              color: '#91d524'
            },
              {
              gte: 10000,
              label: ' >10000 ',
              color: 'green'
            },
          ],
          itemWidth: 20,
          itemHeight: 20,
          showLabel: true,
          textStyle: {
            color: 'white',
          },
        },
        series: [
          {
            name: '岗位数量',
            type: 'map',
            mapType: 'china',
            left: 'center',
            top: 130,
            zoom: 1.2,
            roam: true,
            label: {
              normal: {
                show: function(params) {
                  const c = params.value || 0; // 如果c不存在则赋值为0
                  return c >= 10; // 只有当c大于等于10时才显示
                },
                formatter: function(params) {
                  const c = params.value || 0; // 如果c不存在则赋值为0
                  if (c >= 10) {
                    return `{a|${c}}\n{b|${params.name}}`; // 使用a和b标签分别设置颜色
                  } else {
                    return `{b|${params.name}}`; // 当c小于10时只显示name，不显示值
                  }
                },
                rich: {
                  a: {
                    color: 'red' // 数值c显示为红色
                  },
                  b: {
                    color: 'rgb(19,23,18)' // params.name显示为默认颜色
                  }
                },
                fontSize: 11,
              },
              emphasis: {
                show: true,
              }
            },
            data: this.provincePositionCountData,
          },
        ]
      };
      echarts.registerMap("china",ChinaMap)
      charts.setOption(option);
      const chart = document.querySelector('#charts')
      //放置 获取DOM 节点时 去监听
      const observer = new ResizeObserver(() => {
        charts.resize();
      });
      observer.observe(chart);
    },
  },
};
</script>



