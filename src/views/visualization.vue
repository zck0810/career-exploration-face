<template>
  <div class="visualization-container">
    <el-row class="row-class">
      <el-col :span="8" class="col-container">
        <el-row style="height: 35%;">
          <dv-border-box-13>
            <wordCloud></wordCloud>
          </dv-border-box-13>
        </el-row>
        <el-row style="height: 35%;">
          <dv-border-box-13 style="overflow: hidden">
            <educationSalary></educationSalary>
          </dv-border-box-13>
        </el-row>
        <el-row style="height: 30%;">
          <dv-border-box-13 style="overflow: hidden">
            <div ref="lineChart" style="width: 98%; height: 33vh; margin-left: 10px;"></div>
          </dv-border-box-13>
        </el-row>
      </el-col>

      <el-col :span="9" class="col-container">
        <el-row style="height: 100%;">
          <dv-border-box-1>
            <myMap></myMap>
          </dv-border-box-1>
        </el-row>
      </el-col>

      <el-col :span="7" class="col-container">
        <el-row style="height: 70%;">
          <dv-border-box-13>
            <div>
              <div class="hotPosition">
                <label class="labelClass">岗位数量排名Top100：</label>
                <select class="citySelect" v-model="selectedCity" @change="changeCity">
                  <option value="全国">全国</option>
                  <option value="北京">北京</option>
                  <option value="上海">上海</option>
                  <option value="深圳">深圳</option>
                  <option value="广州">广州</option>
                </select>
                <dv-scroll-ranking-board :config="config" class="scroll-ranking" />
              </div>
            </div>
          </dv-border-box-13>
        </el-row>
        <el-row style="height: 30%;">
          <dv-border-box-13>
            <companyScale></companyScale>
          </dv-border-box-13>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import wordCloud from '@/components/visualization/wordCloud'
import myMap from '@/components/visualization/myMap'
import educationPositionCount from '@/components/visualization/educationPositionCount'
import educationSalary from '@/components/visualization/educationSalary'
import companyScale from '@/components/visualization/companyScale'
import { getCityPositionCount, getHotPosition } from '@/api/liepin'
import * as echarts from 'echarts'
export default {
  name: 'visualization',
  data(){
    return{
      selectedCity: '全国', // 默认选择全国
      lineTitle:'热门城市岗位数量',
      config: {
        rowNum:10,
        data: []
      },
      cityList: [],
      countList: [],
      currentIndex: 1,
      myChart: null,
    }
  },
  components: {
    wordCloud,
    myMap,
    educationPositionCount,
    educationSalary,
    companyScale
  },

  async mounted () {
    this.hotPositionEcharts()
    await this.getLineChartData()

    this.cityPositionCountEcharts()
    // 定时更新数据
    setInterval(this.updateChart, 2000)
  },
  methods:{
    changeCity(){
      this.hotPositionEcharts() //渲染热门岗位轮播图
      this.getLineChartData() //后去折线图城市岗位数量数据
      this.cityPositionCountEcharts() //渲染城市岗位数量折线图

    },
    getLineChartData(){
      this.lineTitle = this.selectedCity + "热门城市岗位数量"
      const selectedCity = this.selectedCity
      getCityPositionCount(selectedCity).then(res => {
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
    },
    //渲染城市
    hotPositionEcharts() {
      const selectedCity = this.selectedCity
      getHotPosition(selectedCity).then(res=>{
        const positionCount = res.data
        let positionCountData = []
        positionCount.forEach(item => {
          positionCountData.push({name:item.position,value:item.count})
        })
        this.config.data = positionCountData
        this.config = { ...this.config }
      })
    },
    //渲染城市岗位数量图表
    cityPositionCountEcharts(){
      // 初始化echarts实例
      this.myChart = echarts.init(this.$refs.lineChart)
      // 配置项
      const option = {
        tooltip: {
          trigger: 'item',
        },
        title: {
          text: this.lineTitle,
          top: '15',
          left: 'center',
          textStyle: {
            color: 'rgb(0,216,255)'
          },
        },
        xAxis: {
          name:'城市',
          boundaryGap: false,
          type: 'category',
          data: this.cityList.slice(0, 8),
          axisLabel: {
            interval: 0,
            color: '#00d8ff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#00d8ff',
            },
          },
        },
        yAxis: {
          name:'岗位数量',
          splitLine: {
            lineStyle: {
              color: 'rgba(0,216,255,0.63)' // 设置背景水平线的颜色为红色
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#00d8ff',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#00d8ff',
          }
        },
        series: [
          {
            data: this.countList.slice(0, 8),
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
                color: '#00d8ff',
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
      const newCityList = this.cityList.slice(this.currentIndex, this.currentIndex + 8)
      const newCountList = this.countList.slice(this.currentIndex, this.currentIndex + 8)
      // 更新图表数据
      this.myChart.setOption({
        xAxis: {
          data: newCityList,
        },
        series: [{
          data: newCountList,
        }],
      })
      this.currentIndex = (this.currentIndex + 1) % (this.cityList.length - 7)
    },
  }
}
</script>

<style scoped>
.visualization-container{
  text-align: center;
  max-height: calc(100vh - 54px);
  overflow-y: auto;
  background-image: url("@/assets/image/1.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
.row-class{
  height: calc(100vh - 54px);
  max-height: calc(100vh - 54px);
}
.col-container{
  height: calc(100vh - 54px);
  max-height: calc(100vh - 54px);
}

.scroll-ranking{
  width: 92%;
  height: 56vh;
  margin-left: 20px;
  padding-top: 50px;
}
.hotPosition{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.labelClass{
  position: absolute;
  top: 15px;
  left: 5%;
  font-size: 18px;
  color: yellow;
  font-weight: bold;

}
.citySelect{
  position: absolute;
  top: 12px;
  width: 100px;
  height: 30px;
  left: 50%;
  background-color: rgb(19, 23, 18);
  border-radius: 5px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.78);
}
</style>

