<template>
  <div class="content">
    <div style="position: absolute;left: 30px">
      <h2 style="color: whitesmoke;font-size: 26px">各省市岗位分布</h2>
    </div>
    <div id="charts" ref="charts"
         style="width: 98%; height: 68vh;margin-left: 7px;padding-top: 10px; position:relative;">
    </div>
    <div class="visual_chart sfzcll" style="position:absolute;">
      <a>岗位排名</a>
      <a>城市</a>
      <a>岗位数量</a>
      <div class="sfzcll_pos_box">
        <div class="sfzcll_box">
          <img class="sfzcll_bkJk" src="@/img/ksh34.png">
          <img class="sfzcll_bkJk" src="@/img/ksh34.png">
          <img class="sfzcll_bkJk" src="@/img/ksh34.png">
          <img class="sfzcll_bkJk" src="@/img/ksh34.png">
          <label><img src="@/img/icona.png">1</label>
          <div class="sfzcll_smallBk">
            <div class="ygl">
              <span>广东</span>
            </div>
          </div>
          <div class="sfzcll_smallBk">
            <div class="ygh">
              <span>15116</span>
            </div>
          </div>
          <div class="clear"></div>
        </div>
        <div class="sfzcll_box">
          <img class="sfzcll_bkJk" src="@/img/ksh34.png">
          <img class="sfzcll_bkJk" src="@/img/ksh34.png">
          <img class="sfzcll_bkJk" src="@/img/ksh34.png">
          <img class="sfzcll_bkJk" src="@/img/ksh34.png">
          <label><img src="@/img/icona.png">2</label>
          <div class="sfzcll_smallBk">
            <div class="ygl">
              <span>江苏</span>
            </div>
          </div>
          <div class="sfzcll_smallBk">
            <div class="ygh">
              <span>10829</span>
            </div>
          </div>
          <div class="clear"></div>
        </div>
        <div class="sfzcll_box">
          <img class="sfzcll_bkJk" src="@/img/ksh34.png">
          <img class="sfzcll_bkJk" src="@/img/ksh34.png">
          <img class="sfzcll_bkJk" src="@/img/ksh34.png">
          <img class="sfzcll_bkJk" src="@/img/ksh34.png">
          <label><img src="@/img/icona.png">3</label>
          <div class="sfzcll_smallBk">
            <div class="ygl">
              <span>北京</span>
            </div>
          </div>
          <div class="sfzcll_smallBk">
            <div class="ygh">
              <span>8103</span>
            </div>
          </div>
          <div class="clear"></div>
        </div>
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
          backgroundColor: 'rgba(15,55,95,0.07)',
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
            bottom: '10px',
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
            itemWidth: 40,
            itemHeight: 15,
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
              top: 90,
              zoom: 1.3,
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
  .visual_chart {
    width: 60%;
    height: 24%;
    position: absolute;
    bottom: 0;
    right: 10px;
    opacity: 0.7;

  }

  .visual_chart_text h1 {
    font-size: 26px;
    margin-bottom: 6px;
  }

  .visual_chart_text h2 {
    font-size: 20px;
  }

  .sfzcll a {
    width: 32%;
    text-align: center;
    line-height: 25px;
    color: #fff;
    display: inline-block;
  }

  .sfzcll .sfzcll_pos_box {
    width: 100%;
    height: calc(100% - 30px);
  }

  .sfzcll .sfzcll_box {
    width: 100%;
    height:31%;
    line-height: 0;
    background: rgba(15, 47, 72, 0.8);
    border: 1px solid #1380bd;
  }

  .sfzcll .sfzcll_box:last-of-type {
    margin: 0;
  }

  .sfzcll .sfzcll_box .sfzcll_bkJk {
    position: absolute;
  }

  .sfzcll .sfzcll_box .sfzcll_bkJk:first-of-type {
    top: -2px;
    left: -2px;
  }

  .sfzcll .sfzcll_box .sfzcll_bkJk:nth-child(2) {
    top: -2px;
    right: -2px;
  }

  .sfzcll .sfzcll_box .sfzcll_bkJk:nth-child(3) {
    bottom: -2px;
    right: -2px;
  }

  .sfzcll .sfzcll_box .sfzcll_bkJk:nth-child(4) {
    bottom: -2px;
    left: -2px;
  }

  .sfzcll .sfzcll_box label {
    width: 33%;
    color: #fff;
    line-height: 0;
    text-align: center;
    float: left;
  }

  .sfzcll .sfzcll_box label img {
    width: 23px;
    height: 23px;
    margin-right: 5px;
    margin-top: 2px;
  }

  .sfzcll .sfzcll_box .sfzcll_smallBk {
    width: 30%;
    height: 100%;
    float: left;
    padding: 2px 5px;
  }

  .sfzcll .sfzcll_box .sfzcll_smallBk > div {
    height: 100%;
    background: url("@/img/ksh38.png") no-repeat;
    background-size: 100% 80%;
    text-align: center;
    line-height: 30px;
  }

  .sfzcll .sfzcll_box .sfzcll_smallBk .ygl {
    color: #00ffc6;
  }

  .sfzcll .sfzcll_box .sfzcll_smallBk .ygh {
    color: #ffe400;
  }
</style>
