<template>
  <div class="content">
    <div id="charts" ref="charts"
         style="width: 98%; height: 83vh;margin-left: 7px;padding-top: 10px; position:relative;">
    </div>
      <span style="color: white;font-size: 22px; position: absolute; top: 8px; left:38%;">各省市岗位分布</span>
    <div class="bar">
      <div class="barbox">
        <span style="color: white;margin-right:300px">薪资最高Top3岗位</span>
        <ul class="clearfix">
          <li class="pulll_left counter" style="font-size: 40px">1942</li>
          <li class="pulll_left counter" style="font-size: 40px">98612</li>
          <li class="pulll_left counter" style="font-size: 40px">2091</li>
        </ul>
        <ul class="clearfix">
          <li class="pulll_left">字段名称</li>
          <li class="pulll_left">字段名称</li>
          <li class="pulll_left">字段名称</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import * as echarts from 'echarts'
  import ChinaMap from '@/assets/china.json'
  import {getProvincePositionCount} from '@/api/provincePositionCount'

  export default {
    data() {
      return {
        provincePositionCountData: []
      }
    },
    created() {
      this.$nextTick(() => {
        this.initCharts();
      })
    },
    mounted() {
      getProvincePositionCount().then(res => {
        let provincePositionCount = res.data
        // 使用 reduce 进行聚合
        const aggregatedData = provincePositionCount.reduce((acc, item) => {
          const existingItem = acc.find((el) => el.province === item.province);

          if (existingItem) {
            existingItem.positionCount += item.positionCount;
          } else {
            acc.push({province: item.province, positionCount: item.positionCount});
          }

          return acc;
        }, []);
        aggregatedData.forEach(item => {
          const {positionCount, province} = item;
          this.provincePositionCountData.push({'name': province, 'value': positionCount});
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
            text: '',
            left: 'center', // 设置标题居中
            top: 10, // 设置距离顶部 10px
            textStyle: {
              color: 'rgb(0,255,234)',
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
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
                color: 'rgba(250,182,10,0.63)'
              },
              {
                gte: 100,
                lt: 500,
                label: ' 100-500 ',
                color: 'blue'
              },
              {
                gte: 500,
                lt: 3000,
                label: '500-300',
                color: 'green'
              },
              {
                gte: 3000,
                lt: 7000,
                label: '3000-7000 ',
                color: '#ce611d'
              },
              {
                gte: 7000,
                lt: 10000,
                label: '7000-10000  ',
                color: '#ce1d1d'
              },
              {
                gte: 10000,
                label: ' >10000 ',
                color: '#e603ef'
              },
            ],
            itemWidth: 50,
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
              top: 180,
              zoom: 1.2,
              roam: true,
              label: {
                normal: {
                  show: function (params) {
                    const c = params.value || 0; // 如果c不存在则赋值为0
                    return c >= 1; // 只有当c大于等于10时才显示
                  },
                  formatter: function (params) {
                    const c = params.value || 0; // 如果c不存在则赋值为0
                    if (c >= 1) {
                      return `{a|${c}}\n{b|${params.name}}`; // 使用a和b标签分别设置颜色
                    } else {
                      return `{b|${params.name}}`; // 当c小于10时只显示name，不显示值
                    }
                  },
                  rich: {
                    a: {
                      color: 'rgb(255,255,255)', // 数值c显示为红色
                      fontWeight: 700,
                    },
                    b: {
                      color: 'rgb(255,255,255)', // params.name显示为默认颜色
                    }
                  },
                },
                emphasis: {
                  show: true,
                }
              },
              itemStyle: {
                normal: {
                  borderColor: "rgba(147, 235, 248, 1)",
                  borderWidth: 1,
                  areaColor: {
                    type: "radial",
                    x: 0.5,
                    y: 0.5,
                    r: 0.8,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(147,235,248,0.71)", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "rgba(147, 235, 248, .2)", // 100% 处的颜色
                      },
                    ],
                  },
                  shadowColor: "rgba(128, 217, 248, 1)",
                  shadowOffsetX: -2,
                  shadowOffsetY: 2,
                  shadowBlur: 10,
                },
                // 鼠标放上去高亮的样式
                emphasis: {
                  areaColor: "#389BB7",
                  borderWidth: 0,
                },
              },
              data: this.provincePositionCountData,
            },
          ]
        };
        echarts.registerMap("china", ChinaMap)
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

<style>
  .bar {
    position: absolute;
    top: 30px;
    width: 93%;
    background: rgba(101, 132, 226, 0);
    padding: 20px;
  }

  li {
    list-style-type: none;
  }

  .barbox li {
    width: 33.33333%;
    text-align: center;
    position: relative;
  }

  .barbox:before,
  .barbox:after {
    position: absolute;
    width: 30px;
    height: 20px;
    content: "";
  }

  .barbox:before {
    border-left: 2px solid #02a6b5;
    left: 0;
    border-top: 2px solid #02a6b5;
  }

  .barbox:after {
    border-right: 2px solid #02a6b5;
    right: 0;
    bottom: 0;
    border-bottom: 2px solid #02a6b5;
  }

  .barbox li:before {
    position: absolute;
    content: "";
    height: 50%;
    width: 1px;
    background: rgba(255, 255, 255, .2);
    right: 0;
    top: 25%;
  }

  .barbox {
    border: 2px solid rgba(25, 186, 139, .17);
    position: relative;
  }

  .barbox li {
    color: #ffeb7b;
    padding: -10px;
    font-weight: bold;
    font-family: electronicFont;
  }

  .clearfix:after, .clearfix:before {
    display: table;
    content: " "
  }

  .clearfix:after {
    clear: both
  }

  .pulll_left {
    float: left;
  }

</style>
