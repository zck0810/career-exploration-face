<!--<template>
  <div id="cityPositionCount" style="width: 100%; height: 33vh; margin-left: 13px;"></div>
</template>
<script>
import { getCityPositionCount } from '@/api/liepin'
import * as echarts from 'echarts'

export default {
  name: 'cityPositionCount',

  mounted () {
    this.cityPositionCountEcharts()
  },
  methods: {
    cityPositionCountEcharts () {
      const myChart = echarts.init(document.getElementById('cityPositionCount'))
      getCityPositionCount().then(res => {
        const cityList = []
        const countList = []
        for (let i = 0; i < res.data.length - 10; i++) {
          const {
            city_prefix,
            count
          } = res.data[i]
          cityList.push(city_prefix)
          countList.push(count)
        }
        let dataAxis = cityList
        let data = countList

        let option = {
          tooltip: {
            trigger: 'item',
          },
          backgroundColor: 'rgba(15,55,95,0.17)',
          title: {
            text: '城市岗位数量Top10统计图',
            top: '15',
            left: 'center',
            textStyle: {
              color: 'rgb(0,216,255)'
            }
          },
          xAxis: {
            data: dataAxis.slice(0, 10),
            boundaryGap: false,
            axisLabel: {
              interval: 0, // 显示所有标签
              rotate: 0, // 将标签旋转 0°
              inside: false,
              color: '#fff'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            z: 10
          },
          yAxis: {
            axisLine: {
              show: true,
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#fff',
            }
          },
          dataZoom: [
            {
              type: 'inside'
            }
          ],
          series: [
            {
              type: 'line',
              left: '60', // 调整整体向右移动20px
              showBackground: true,
              areaStyle: {},
              itemStyle: {
                barBorderRadius: [20, 20, 0, 0], // 仅设置末端为圆角，其他角为直角
                color: function () {
                  return (
                    'rgb(' +
                    Math.round(Math.random() * 255) +
                    ', ' +
                    Math.round(Math.random() * 255) +
                    ', ' +
                    Math.round(Math.random() * 255) +
                    ')'
                  )
                }
              },

              emphasis: {
                itemStyle: {
                  color: function () {
                    return (
                      'rgb(' +
                      Math.round(Math.random() * 255) +
                      ', ' +
                      Math.round(Math.random() * 255) +
                      ', ' +
                      Math.round(Math.random() * 255) +
                      ')'
                    )
                  }
                }
              },
              stack: 'Total',
              label: {
                show: true,
                textStyle: {
                  color: '#ffffff',
                  size: 20
                },
                position: 'top'
              },
              data: data.slice(0, 10),
            },

          ]
        }
        option && myChart.setOption(option)
        // 当用户单击栏时启用数据缩放
        const zoomSize = 6
        myChart.on('click', function (params) {
          myChart.dispatchAction({
            type: 'dataZoom',
            startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
            endValue:
              dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
          })
        })
      })
      const cityPositionCount = document.querySelector('#cityPositionCount')
      //放置 获取DOM 节点时 去监听
      const observer = new ResizeObserver(() => {
        myChart.resize()
      })
      observer.observe(cityPositionCount)
    }
  }
}
</script>-->


<template>
  <div>
    <div ref="lineChart" style="width: 100%; height: 33vh; margin-left: 13px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getCityPositionCount } from '@/api/liepin'

export default {
  data () {
    return {
      cityList: [],
      countList: [],
      currentIndex: 1,
      myChart: null,
    }
  },
  async mounted () {
    await getCityPositionCount().then(res => {
      const tempCityList = []
      const tempCountList = []
      for (let i = 0; i < res.data.length; i++) {
        const {
          city_prefix,
          count
        } = res.data[i]
        tempCityList.push(city_prefix)
        tempCountList.push(count)
      }

      //打乱数组，如折线图有波动，更好看
      for (let i = tempCityList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempCityList[i], tempCityList[j]] = [tempCityList[j], tempCityList[i]];
        [tempCountList[i], tempCountList[j]] = [tempCountList[j], tempCountList[i]];
      }


      this.cityList = tempCityList     // 初始化数据
      this.countList = tempCountList
    })

    this.cityPositionCountEcharts()
    // 定时更新数据
    setInterval(this.updateChart, 2000)
  },
  methods: {
    cityPositionCountEcharts(){
      // 初始化echarts实例
      this.myChart = echarts.init(this.$refs.lineChart)
      // 配置项
      const option = {
        tooltip: {
          trigger: 'item',
        },
        title: {
          text: '城市岗位数量Top10统计图',
          top: '15',
          left: 'center',
          textStyle: {
            color: 'rgb(0,216,255)'
          },
        },
        xAxis: {
          boundaryGap: false,
          type: 'category',
          data: this.cityList.slice(0, 10),
          axisLabel: {
            interval: 0,
            color: '#fff'
          },

        },
        yAxis: {
          axisLine: {
            show: true,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
          }
        },
        series: [
          {
            data: this.countList.slice(0, 10),
            type: 'line',
            smooth: true,
            areaStyle: {
              color: 'rgb(0,255,255)'
            },
            itemStyle: {
              color: function () {
                return (
                  'rgb(' +
                  Math.round(Math.random() * 255) +
                  ', ' +
                  Math.round(Math.random() * 255) +
                  ', ' +
                  Math.round(Math.random() * 255) +
                  ')'
                )
              }
            },
            label: {
              show: true,
              textStyle: {
                color: '#ffffff',
                size: 20
              },
              position: 'top'
            },
          }],
      }
      // 使用刚指定的配置项和数据显示图表
      this.myChart.setOption(option)
      const lineChart = this.$refs.lineChart; // 修改这一行
      const observer = new ResizeObserver(() => {
        this.myChart.resize();
      });
      observer.observe(lineChart);
    },
    updateChart () {
      const newCityList = this.cityList.slice(this.currentIndex, this.currentIndex + 10)
      const newCountList = this.countList.slice(this.currentIndex, this.currentIndex + 10)
      // 更新图表数据
      this.myChart.setOption({
        xAxis: {
          data: newCityList,
        },
        series: [{
          data: newCountList,
        }],
      })
      this.currentIndex = (this.currentIndex + 1) % (this.cityList.length - 9)
    },
  },
}
</script>
