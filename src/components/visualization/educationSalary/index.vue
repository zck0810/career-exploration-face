<template>
  <div>
    <div id="educationSalary" style="width: 100%; height: 32vh;margin-left: 5px;padding-top: 10px; position:relative;"> </div>
    <button @click="changeEcharts" style="position: absolute; height: 25px;width: 60px;top: 20px;right: 20px; font-size: 14px;
    color: rgb(255,251,0); background-color: rgba(0,216,255,0.87)" >{{changeShowText}}</button>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import {getFreshGraduateSalary} from '@/api/freshGraduateSalary'
  import {getTechnicalFrequencyStatistics} from "@/api/visualization";
  import 'echarts-wordcloud/dist/echarts-wordcloud'
  import 'echarts-wordcloud/dist/echarts-wordcloud.min'

  export default {
  name: 'educationSalary',
  data(){
    return{
      time:[],
      educationData:['大专','本科不分区','本科普通院校','本科重点院校','硕士普通院校','硕士重点院校','博士普通院校','博士重点院校'],
      countData1:[],
      countData2:[],
      countData3:[],
      chartDom:null,
      changeShowText:'词云图',
      timer: null,  // 添加一个定时器变量
      wordList:[],
      textData1:'',
      textData2:'',
      textData3:'',

    }
  },
  async mounted () {
    getTechnicalFrequencyStatistics().then(res=>{
      const technologyAndCount = res.data
      const {technology: technology1} = technologyAndCount[0];
      this.textData1=technology1
      const {technology: technology2} = technologyAndCount[1];
      this.textData2=technology2
      const {technology: technology3} = technologyAndCount[2];
      this.textData3=technology3
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

   await getFreshGraduateSalary().then(res=>{
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
        })})


  },
  methods:{
    changeEcharts(){
      this.initEcharts()
    },
    initEcharts(){
        if(this.changeShowText === '词云图'){
          this.changeShowText = '城市'
          echarts.dispose(this.chartDom);
          this.initEducationSalaryDataWithCity()
        }else if(this.changeShowText === '城市'){
          this.changeShowText = '学历'
          echarts.dispose(this.chartDom);
          this.initEducationSalaryEcharts()
        }else {
          this.changeShowText = '词云图'
          echarts.dispose(this.chartDom);
          this.initChart()
        }
    },

    initEducationSalaryEcharts(){
      this.chartDom = document.getElementById('educationSalary')
      const myChart = echarts.init(this.chartDom)
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
            rotate: 20 // 将文字旋转90度，使其竖着展示
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
    },

    initEducationSalaryDataWithCity(){
      this.chartDom = document.getElementById('educationSalary')
      const myChart = echarts.init(this.chartDom)
      let option
      option = {
        title: {                      // 添加标题
          text: '应届生各学历起薪与城市关系',      // 标题内容
          textStyle: {
            color: 'yellow'           // 标题文字颜色
          },
          left: 'center'              // 标题居中显示
        },
        legend: {
          top:30,
          textStyle: {
            color: 'yellow',
            fontSize: 15, // 设置 x 轴字体大小为 14
          }
        },
        tooltip: {},
        dataset: {
          source: [
            ['product', '大专', '本科', '硕士'],
            ['上海', 6200, 7500, 10500],
            ['北京', 6200, 7600, 10400],
            ['南京', 5300, 6700, 9200],
            ['广州', 5400, 6800, 8900],
            ['成都', 5500, 6900, 9200],
            ['杭州', 5600, 7200, 9100],
            ['武汉', 5000, 6500, 8600],
            ['深圳', 6000, 7300, 10200],
            ['西安', 5100, 6500, 8700],
            ['郑州', 4800, 6000, 8100],
          ]
        },
        xAxis: {
          name:'城市',
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#00d8ff',
            }
          },
          axisLabel: {
            fontSize: 12, // 设置 x 轴字体大小为 14
          }},
        yAxis: {
          name:'薪资',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#00d8ff'
            }
          },
        },
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
      };

      option && myChart.setOption(option);
      const EducationSalaryDataWithCity = document.querySelector('#educationSalary')
      //放置 获取DOM 节点时 去监听
      const observer = new ResizeObserver(() => {
        myChart.resize();
      });
      observer.observe(EducationSalaryDataWithCity);
    },

    initChart(){
      this.chartDom = document.getElementById('educationSalary')
      const myChart = echarts.init(this.chartDom)
      let option = {
        backgroundColor: 'rgba(15,55,95,0.18)',
        title: {
          text: '技术栈要求词云图',
          left: 'center', // 设置标题居中
          top: 8, // 设置距离顶部 10px
          textStyle: {
            color:  '#20dbfd',
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
        graphic: [
          {
            type: 'group',
            bounding: 'raw',
            right: 260,
            bottom: 60,
            z: 100,
            children: [
              {
                type: 'rect',
                left: 'center',
                top: 'center',
                z: 100,
                shape: {
                  width:650,
                  height: 50
                },
                style: {
                  fill: 'rgba(0,0,0,0.1)'
                }
              },
              {
                type: 'text',
                left:"center",
                top: 'center',
                z: 100,
                style: {
                  fill: '#20dbfd',
                  text: '解读：技术栈频次最高Top3:  ' + this.textData1 + '  ' + this.textData2 + '  ' + this.textData3,
                  font: 'bold 20px sans-serif',
                }
              }
            ]
          },
        ],
        series: [
          {
            type: "wordCloud",
            shape: 'circle',
            //用来调整词之间的距离
            gridSize: 7,
            sizeRange: [12, 30],
            rotationRange: [0,90],
            // left: "center",
            right: "20%",
            top: "center",
            width: "200%",
            height: "200%",
            data: this.wordList
          }
        ]
      };
      option && myChart.setOption(option);
      const wordCloud = document.querySelector('#educationSalary')
      //放置 获取DOM 节点时 去监听
      const observer = new ResizeObserver(() => {
        myChart.resize();
      });
      observer.observe(wordCloud);   //错误
    }

  },

  beforeDestroy() {
    if (this.chartDom) {
      echarts.dispose(this.chartDom);
    }
  },
}
</script>
