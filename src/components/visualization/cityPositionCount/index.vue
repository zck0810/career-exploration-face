<template>
  <div id="cityPositionCount" style="width: 94%; height: 40vh; margin-left: 13px;padding-top: 20px;"></div>
</template>
<script>
import {getCityPositionCount} from "@/api/liepin";
import * as echarts from 'echarts';
export default {
  name: "cityPositionCount",
  data() {
    return {
      dataAxis: [],
      data: []
    }
  },
  mounted() {
    this.dataLink()
  },
  methods: {
    dataLink() {
      const myChart = echarts.init(document.getElementById('cityPositionCount'));
      getCityPositionCount().then(res => {
        console.log(res)
        const cityList = [];
        const countList = [];
        for (let i = 0; i < res.data.length-10; i++) {
          const {
            city_prefix,
            count
          } = res.data[i];
          cityList.push(city_prefix);
          countList.push(count);
        }
        let dataAxis = cityList;
        let data = countList;
        let yMax = 8000;
        let dataShadow = [];
        for (let i = 0; i < data.length; i++) {
          dataShadow.push(yMax);
        }

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
            data: dataAxis,
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
              show: false,
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
              type: 'bar',
              left: '60', // 调整整体向右移动20px
              // showBackground: true,
              itemStyle: {
                barBorderRadius: [20, 20, 0, 0], // 仅设置末端为圆角，其他角为直角
                color: function () {
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

              emphasis: {
                itemStyle: {
                  color: function () {
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
              data: data,
            },

          ]
        };
        option && myChart.setOption(option);
        // 当用户单击栏时启用数据缩放
        const zoomSize = 6;
        myChart.on('click', function (params) {
          myChart.dispatchAction({
            type: 'dataZoom',
            startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
            endValue:
              dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
          });
        });
      });
      const cityPositionCount = document.querySelector('#cityPositionCount')
      //放置 获取DOM 节点时 去监听
      const observer = new ResizeObserver(() => {
        myChart.resize();
      });
      observer.observe(cityPositionCount);
    }
  }
}
</script>
<style scoped>

</style>










