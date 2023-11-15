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
      // 使用 reduce 进行聚合
      const aggregatedData = provincePositionCount.reduce((acc, item) => {
        const existingItem = acc.find((el) => el.province === item.province);

        if (existingItem) {
          existingItem.positionCount += item.positionCount;
        } else {
          acc.push({ province: item.province, positionCount: item.positionCount });
        }

        return acc;
      }, []);
      aggregatedData.forEach(item => {
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
            top: 130,
            zoom: 1.2,
            roam: true,
            label: {
              normal: {
                show: function(params) {
                  const c = params.value || 0; // 如果c不存在则赋值为0
                  return c >= 1; // 只有当c大于等于10时才显示
                },
                formatter: function(params) {
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













<!--<template>
  <div class="content">
    <div ref="charts" style="width: 98%; height: 90vh; margin-left: 7px; padding-top: 10px;"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getMap } from "@/assets/maputils";
import { getProvincePositionCount } from '@/api/provincePositionCount'

export default {
  data(){
    return{
      provincePositionCountData:[],
      provinceCoordinates: {
        北京: [116.46, 39.92],
        天津: [117.2, 39.13],
        上海: [121.48, 31.22],
        重庆: [106.54, 29.59],
        广东: [113.23, 23.16],
        浙江: [120.19, 30.26],
        江苏: [118.78, 32.04],
        山东: [117, 36.65],
        河南: [113.65, 34.76],
        河北: [114.48, 38.03],
        山西: [112.53, 37.87],
        辽宁: [123.43, 41.80],
        吉林: [125.35, 43.88],
        黑龙江: [126.63, 45.75],
        湖北: [114.31, 30.52],
        湖南: [112, 28.21],
        安徽: [117.27, 31.86],
        福建: [119.31, 26.08],
        江西: [115.89, 28.68],
        四川: [104.06, 30.67],
        云南: [101.485106, 25.008643],
        贵州: [106.71, 26.57],
        陕西: [108.95, 34.27],
        甘肃: [103.73, 36.03],
        青海: [101.74, 36.56],
        西藏: [91.11, 29.97],
        新疆: [87.68, 43.77],
        宁夏: [106.27, 38.47],
        内蒙: [111.65, 40.82],
        广西: [108.33, 22.84],
        海南: [110.35, 20.02],
      },
    }
  },
  mounted () {
    getProvincePositionCount().then((res) => {
      let provincePositionCount = res.data;
      // 使用 reduce 进行聚合
      const aggregatedData = provincePositionCount.reduce((acc, item) => {
        const existingItem = acc.find((el) => el.province === item.province);

        if (existingItem) {
          existingItem.positionCount += item.positionCount;
        } else {
          acc.push({ province: item.province, positionCount: item.positionCount });
        }

        return acc;
      }, []);
      aggregatedData.forEach((item) => {
        const { positionCount, province } = item;
        const coordinates = this.provinceCoordinates[province];
        if (coordinates) {
          this.provincePositionCountData.push({
            name: province,
            value: [...coordinates, positionCount],
          });
        }
      });
      this.$nextTick(() => {
        this.initCharts();
      });
    });


  },
  methods: {
    initCharts() {
      const charts = echarts.init(this.$refs["charts"]);
      const option = {
        title: {
          text: '各省市岗位分布',
          left: 'center', // 设置标题居中
          top: 10, // 设置距离顶部 10px
          textStyle: {
            color: 'rgb(0,255,234)',
            fontSize:25,
          }
        },
        visualMap: {
          min: 0,
          max: 20000,
          left: '20px', // 向右移动 30px
          top: 'bottom',
          text: ['高', '低'],
          seriesIndex: [0],
          pieces: [
            {
              lt: 100,
              label: '< 100',
              color: 'rgba(165,204,130,0.8)'
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
              label: '500-3000',
              color: '#00467F'
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
              color: '#e603ef'
            },
            {
              gte: 10000,
              label: ' >10000 ',
              color: '#ce1d1d'
            },
          ],
          itemWidth: 50,
          itemHeight: 20,
          showLabel: true,
          textStyle: {
            color: 'white',
          },
        },
        graphic: [
          {
            type: "text",
            left: "10%",
            top: "10%",
            style: {
              text: "中国",
              font: 'bolder 1.5rem "Microsoft YaHei", sans-serif',
              fill: "#fff",
            },
            onclick: () => {
              const [grahpName, graphJson] = getMap(name);
              const index = option.graphic.findIndex((i) => i.style.text === name);
              option.graphic.splice(index + 2);
              option.geo.map = mapName;
              echarts.registerMap(grahpName, graphJson);
              charts.setOption(option, true);
            },
          },
        ],
        tooltip: {
          show: true,
          formatter(params) {
            return `地区：${params.name}</br>岗位数量：${params.value[2]}`;
          },
        },
        geo: {
          zoom: 1.2,
          roam: true,
          map: "china",
          label: {
            normal: {
              show: true,
              textStyle: {
                color: "#fff",
              },
            },
            emphasis: {
              textStyle: {
                color: "#fff",
              },
            },
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
                    color: "rgba(147, 235, 248, 0)",
                  },
                  {
                    offset: 1,
                    color: "rgba(147, 235, 248, .2)",
                  },
                ],
              },
              shadowColor: "rgba(128, 217, 248, 1)",
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 10,
            },
            emphasis: {
              areaColor: "#389BB7",
              borderWidth: 0,
            },
          },
        },
        series: [
          {
            type: 'map',
            zoom: 1.2,
            geoIndex:0,
            data: this.provincePositionCountData,
            roam: true,
            map: "china",
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: "#fff",
                },
              },
              emphasis: {
                textStyle: {
                  color: "#fff",
                },
              },
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
                      color: "rgba(147, 235, 248, 0)",
                    },
                    {
                      offset: 1,
                      color: "rgba(147, 235, 248, .2)",
                    },
                  ],
                },
                shadowColor: "rgba(128, 217, 248, 1)",
                shadowOffsetX: -2,
                shadowOffsetY: 2,
                shadowBlur: 10,
              },
              emphasis: {
                areaColor: "#389BB7",
                borderWidth: 0,
              },
            },
          },
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            effectType: "ripple",
            showEffectOn: "render",
            rippleEffect: {
              period: 10,
              scale: 10,
              brushType: "fill",
            },
            hoverAnimation: true,
            itemStyle: {
              normal: {
                color: "rgba(255, 235, 59, .7)",
                shadowBlur: 10,
                shadowColor: "#333",
              },
            },
            zlevel: 1,
            data: this.provincePositionCountData.filter(item => item.value[2] > 7000)
              .map(item => ({ name: item.name, value: item.value })),
          },
          {
            type: "scatter",
            coordinateSystem: "geo",
            symbol: "pin",
            legendHoverLink: true,
            symbolSize: [60, 60],
            label: {
              show: true,
              formatter(value) {
                return value.data.value[2];
              },
              color: "#fff",
            },
            itemStyle: {
              normal: {
                color: "rgba(255,0,0,.7)",
                shadowBlur: 2,
                shadowColor: "D8BC37",
              },
            },
            data: this.provincePositionCountData,
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
            },
            hoverAnimation: true,
            zlevel: 2,
          },
        ],
      };

      const [mapName, mapJson] = getMap();
      option.geo.map = mapName;
      echarts.registerMap(mapName, mapJson);
      charts.setOption(option);

      charts.on("click", ({ name }) => {
        const [mapName, mapJson] = getMap(name);
        option.geo.zoom = 0.8;
        option.geo.map = mapName;
        const idx = option.graphic.length + 1;
        option.graphic.push({
          type: "text",
          left: `${idx * 10}%`,
          top: "10%",
          style: {
            text: name,
            font: 'bolder 1.5rem "Microsoft YaHei", sans-serif',
            fill: "#fff",
          },
        });
        echarts.registerMap(mapName, mapJson);
        charts.setOption(option, true);
      });

      charts.off();
      charts.on("click", ({ name }) => {
        const index = option.graphic.findIndex((i) => i.style.text === name);
        if (!name || index !== -1) return;
        const [mapName, mapJson] = getMap(name);
        option.geo.zoom = 0.8;
        option.geo.map = mapName;
        const idx = option.graphic.length + 1;
        option.graphic.push({
          type: "text",
          left: `${idx * 10}%`,
          top: "10%",
          style: {
            text: name,
            font: 'bolder 1.5rem "Microsoft YaHei", sans-serif',
            fill: "#fff",
          },
          onclick: () => {
            const [grahpName, graphJson] = getMap(name);
            const index = option.graphic.findIndex((i) => i.style.text === name);
            option.graphic.splice(index + 1);
            option.geo.map = mapName;
            echarts.registerMap(grahpName, graphJson);
            charts.setOption(option, true);
          },
        });
        echarts.registerMap(mapName, mapJson);
        charts.setOption(option, true);

      });
    },
  },
};
</script>-->


