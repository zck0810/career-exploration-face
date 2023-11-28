<template>
  <div class="visualization-container">
    <div class="title">
      <!--      上右下左-->
      <h2 style="color:rgb(0,216,255);margin:0;font-size: 30px">基于大模型的职探AI小助手</h2>
    </div>
    <el-row class="row-class">
      <el-col :span="8" class="col-container">
        <el-row style="height: 35%;">
          <dv-border-box-13>
            <dataStatistics></dataStatistics>
          </dv-border-box-13>
        </el-row>
        <el-row style="height: 35%;">
          <dv-border-box-13 style="overflow: hidden">
            <educationSalary></educationSalary>
          </dv-border-box-13>
        </el-row>
        <el-row style="height: 30%;">
          <dv-border-box-13 style="overflow: hidden">
            <div ref="lineChart" style="width: 98%; height: 31vh; margin-left: 10px;"></div>
          </dv-border-box-13>
        </el-row>
      </el-col>

      <el-col :span="9" class="col-container">
        <el-row style="height:20%;">
          <div class="visual_conTop">
            <div class="visual_conTop_box visual_conTop1">
              <div>
                <h3>Java开发工程师</h3>
                <span style="color: skyblue;float: left;margin-top: -10px;font-size: 22px">￥</span>
                <p>12000</p>
                <span style="color: white;float: left;margin: 10px 0 0 35px">(元 /月)</span>
                <div class="conTop_smil">
                  <a class="sz">岗位数量:<span>10983</span><i class="fa fa-long-arrow-up"></i></a>

                </div>
              </div>
            </div>
            <div class="visual_conTop_box visual_conTop1">
              <div>
                <h3>前端开发工程师</h3>
                <span style="color: skyblue;float: left;margin-top: -10px;font-size: 22px">￥</span>
                <p>10000</p>
                <span style="color: white;float: left;margin: 10px 0 0 35px">(元 /月)</span>
                <div class="conTop_smil">
                  <a class="sz">岗位数量:<span>10097</span></a>
                </div>
              </div>
            </div>
            <div class="visual_conTop_box visual_conTop2">
              <div>
                <h3>C++开发工程师</h3>
                <span style="color: skyblue;float: left;margin-top: -10px;font-size: 22px">￥</span>
                <p>15000</p>
                <span style="color: white;float: left;margin: 10px 0 0 35px">(元 /月)</span>
                <div class="conTop_smil">
                  <a class="sz">岗位数量:<span>5604</span></a>
                </div>
              </div>
            </div>
            <div class="clear"></div>
          </div>
        </el-row>
        <el-row style="height: 80%;">
          <dv-border-box-8>
            <myMap></myMap>
          </dv-border-box-8>
        </el-row>
      </el-col>

      <el-col :span="7" class="col-container">
        <el-row style="height: 70%;">
          <dv-border-box-13>
            <div>
              <div class="hotPosition">
                <label class="labelClass">岗位数量排名Top10：</label>
                <select class="citySelect" v-model="selectedCity" @change="changeCity">
                  <option value="全国">全国</option>
                  <option value="北京">北京</option>
                  <option value="上海">上海</option>
                  <option value="深圳">深圳</option>
                  <option value="南京">南京</option>
                  <option value="杭州">杭州</option>
                  <option value="广州">广州</option>
                </select>
                <dv-scroll-ranking-board :config="config" class="scroll-ranking"/>
              </div>
            </div>
          </dv-border-box-13>
        </el-row>
        <el-row style="height: 30%;">
          <dv-border-box-13>
            <!--            <companyScale></companyScale>-->
            <div id="companyScale" style="height: 24vh; width: 96%;margin-left: 10px; padding-top: 12px;"></div>
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
import dataStatistics from '@/components/visualization/dataStatistics'
import { getCityPositionCount, getHotPosition } from '@/api/liepin'
import * as echarts from 'echarts'
import { getCompanyScaleData } from '@/api/companyScale'

export default {
  name: 'visualization',
  data () {
    return {
      selectedCity: '全国', // 默认选择全国
      lineTitle: '热门城市岗位数量',
      config: {
        rowNum: 10,
        data: [],
        // waitTime:99999999,
      },
      cityList: [],
      countList: [],
      currentIndex: 1,
      myChart: null,
      companyScale: [],
    }
  },
  components: {
    wordCloud,
    myMap,
    educationPositionCount,
    educationSalary,
    companyScale,
    dataStatistics
  },

  async mounted () {
    this.hotPositionEcharts()
    await this.getLineChartData()

    this.cityPositionCountEcharts()

    this.companyScaleEcharts()
    // 定时更新数据
    setInterval(this.updateChart, 2000)
  },
  methods: {
    changeCity () {
      this.hotPositionEcharts() //渲染热门岗位轮播图
      this.getLineChartData() //后去折线图城市岗位数量数据
      this.cityPositionCountEcharts() //渲染城市岗位数量折线图
      this.companyScale = []
      this.companyScaleEcharts() //渲染公司规模饼图
    },

    getLineChartData () {
      this.lineTitle = this.selectedCity + '热门城市岗位数量'
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
          [tempCountList[i], tempCountList[j]] = [tempCountList[j], tempCountList[i]]
        }
        this.cityList = tempCityList     // 初始化数据
        this.countList = tempCountList
      })
    },
    //渲染城市
    hotPositionEcharts () {
      const selectedCity = this.selectedCity
      getHotPosition(selectedCity).then(res => {
        const positionCount = res.data
        let positionCountData = []
        positionCount.forEach(item => {
          positionCountData.push({
            name: item.category,
            value: item.total
          })
        })
        this.config.data = positionCountData
        this.config = { ...this.config }
      })
    },

    //渲染城市岗位数量图表
    cityPositionCountEcharts () {
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
          name: '城市',
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
          name: '岗位数量',
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
      const lineChart = this.$refs.lineChart // 修改这一行
      const observer = new ResizeObserver(() => {
        this.myChart.resize()
      })
      observer.observe(lineChart)
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

    companyScaleEcharts () {
      getCompanyScaleData(this.selectedCity).then(res => {
        const tempCompanyScale = res.data[0]
        console.log(tempCompanyScale)
        const {
          hundred_to_five_hundred,
          less_than_fifty,
          thousand_to_five_thousand,
          fifty_to_hundred,
          greater_than_five_thousand,
          five_hundred_to_thousand
        } = tempCompanyScale
        this.companyScale.push({
          name: '50人以下',
          value: less_than_fifty
        })
        this.companyScale.push({
          name: '50-100人',
          value: fifty_to_hundred
        })
        this.companyScale.push({
          name: '100-500人',
          value: hundred_to_five_hundred
        })
        this.companyScale.push({
          name: '500-1000人',
          value: five_hundred_to_thousand
        })
        this.companyScale.push({
          name: '1000-5000人',
          value: thousand_to_five_thousand
        })
        this.companyScale.push({
          name: '5000人以上',
          value: greater_than_five_thousand
        })
        this.initPieData()
      })
    },

    initPieData () {
      const chartDom = document.getElementById('companyScale')
      const myChart = echarts.init(chartDom)
      let option

      option = {
        backgroundColor: 'rgba(15,55,95,0.18)',
        title: {                      // 添加标题
          text: this.selectedCity + '公司规模占比',      // 标题内容
          textStyle: {
            color: '#20dbfd'           // 标题文字颜色
          },
          left: 'center'              // 标题居中显示
        },
        legend: {
          // top: '10%',
          // left: 'center',
          orient: 'vertical', // 设置图例垂直排列
          left: 10, // 设置图例距离左侧的距离
          top: 'middle', // 设置图例在容器中垂直居中
          textStyle: {
            color: 'white' // 将字体颜色设置为白色
          }
        },
        series: [
          {
            name: '公司规模占比',
            type: 'pie',
            top: 30,
            center: ['60%', '50%'], // 将 center 的水平位置调整为 '60%'
            radius: ['50%', '85%'],
            avoidLabelOverlap: false,
            animationType: 'scale', // 设置过渡效果类型，这里使用缩放
            animationDurationUpdate: 2000, // 过渡效果持续时间，单位为毫秒
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold',
                formatter: '{b}\n {d}%',
                color: '#92e804'
              }
            },
            labelLine: {
              show: false
            },
            data: this.companyScale
          }
        ]
      }

      option && myChart.setOption(option)
      const companyScale = document.querySelector('#companyScale')
      //放置 获取DOM 节点时 去监听
      const observer = new ResizeObserver(() => {
        myChart.resize()
      })
      observer.observe(companyScale)
    }
  }
}
</script>

<style scoped>
  .visual_conTop {
    height: 130px;
    margin-bottom: 10px;
  }

  .visual_conTop .visual_conTop_box {
    height: 100%;
    padding: 0 3px;
  }

  .visual_conTop .visual_conTop1 {
    width: 32%;
    height: 100%;
    float: left;
  }

  .visual_conTop .visual_conTop1 > div {
    background: url("../img/ksh39.png") no-repeat;
    background-size: 100% 100%;
  }

  .visual_conTop .visual_conTop2 {
    width: 32%;
    height: 100%;
    float: left;
  }

  .visual_conTop .visual_conTop2 > div {
    background: url("../img/ksh39.png") no-repeat;
    background-size: 100% 100%;
  }

  .visual_conTop .visual_conTop_box > div {
    height: 100%;
  }

  .visual_conTop .visual_conTop_box > div h3 {
    color: #fff;
    font-size: 16px;
    padding: 10px 0 0 0;

  }

  .visual_conTop .visual_conTop_box > div p {
    width: 33%;
    float: left;
    line-height: 0;
    color: #20dbfd;
    text-shadow: 0 0 25px #00d8ff;
    font-size: 44px;
    font-family: 'yjsz';
    text-align: right;
    margin-top: 20px;
  }

  @font-face {
    font-family: yjsz;
    src: url("../img/yjsz.TTF")
  }

  .visual_conTop .visual_conTop_box > div .conTop_smil {
    width: 64%;
    height: 20px;
    float: left;
    padding-top: 23px;
    margin-top: -30px;
  }

  .visual_conTop .visual_conTop_box > div .conTop_smil a {
    display: block;
    line-height: 20px;
    text-align: right;
    color: #fff;
    padding-left: 9px;
    font-size: 15px;
  }

  .visual_conTop .visual_conTop_box > div .conTop_smil span {
    width: 32px;
    display: inline-block;
    margin-left: 3px;
  }

  .visual_conTop .visual_conTop_box > div .conTop_smil a.sz {
    color: #12fe81;
  }

  .visual_conTop .visual_conTop_box > div .conTop_smil a.xd {
    color: #12fe81;

  }

.title {
  height: 40px;
  width: 100%;
  background-image: url("../img/topbg.png");
  background-size: cover;
  background-position: center;
    padding-top: 5px;
}

.visualization-container {
  text-align: center;
  max-height: calc(100vh - 54px);
  overflow-y: auto;
  background-image: url("@/assets/image/bg1.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.row-class {
  height: calc(100vh - 104px);
  max-height: calc(100vh - 104px);
}

.col-container {
  height: calc(100vh - 104px);
  max-height: calc(100vh - 104px);
}

.scroll-ranking {
  width: 92%;
  height: 54vh;
  margin-left: 20px;
  padding-top: 50px;
}

.hotPosition {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.labelClass {
  position: absolute;
  top: 15px;
  left: 5%;
  font-size: 18px;
  color: #20dbfd;
  font-weight: bold;

}

.citySelect {
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

