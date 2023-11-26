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
        <el-row style="height: 100%;">
          <dv-border-box-1>
            <myMap>
            </myMap>
          </dv-border-box-1>
        </el-row>
      </el-col>

      <el-col :span="7" class="col-container">
        <el-row style="height: 70%;">
          <dv-border-box-13>
            <div>
              <div class="hotPosition">
                <label class="labelClass">岗位数量排名Top30：</label>
                <select class="citySelect" v-model="selectedCity" @change="changeCity">
                  <option value="全国">全国</option>
                  <option value="北京">北京</option>
                  <option value="上海">上海</option>
                  <option value="深圳">深圳</option>
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
            color: 'yellow'           // 标题文字颜色
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

.title {
  height: 40px;
  width: 100%;
  background-image: url("../img/topbg.png");
  background-size: cover;
  background-position: center;
  padding-top: 10px;
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
  color: yellow;
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

const cityList = ['北京',
'上海',
'深圳',
'杭州',
'广州',
'成都',
'南京',
'武汉',
'苏州',
'西安',
'天津',
'大连',
'合肥',
'长沙',
'重庆',
'厦门',
'太原',
'南宁',
'无锡',
'石家',
'福州',
'哈尔',
'南昌',
'宁波',
'沈阳',
'海口',
'济南',
'东莞',
'青岛',
'长春',
'佛山',
'常州',
'珠海',
'柳州',
'芜湖',
'保定',
'廊坊',
'桂林',
'宁德',
'三亚',
'嘉兴',
'徐州',
'南通',
'泉州',
'唐山',
'郑州',
'温州',
'惠州',
'赣州',
'晋中',
'烟台',
'金华',
'潍坊',
'株洲',
'湖州',
'中山',
'绍兴',
'雄安',
'绵阳',
'秦皇',
'扬州',
'淄博',
'镇江',
'沧州',
'上饶',
'滁州',
'盐城',
'邯郸',
'澄迈',
'长治',
'运城',
'钦州',
'临沂',
'大庆',
'湘潭',
'临汾',
'台州',
'晋城',
'邢台',
'大同',
'北海',
'泰州',
'池州',
'九江',
'贵阳',
'蚌埠',
'梧州',
'昆明',
'阜阳',
'淮安',
'连云',
'东营',
'宜宾',
'张家',
'吕梁',
'聊城',
'忻州',
'宿迁',
'阳泉',
'济宁',
'衡阳',
'莆田',
'朔州',
'汕头',
'宣城',
'吉安',
'马鞍',
'安庆',
'牡丹',
'兰州',
'文昌',
'万宁',
'衡水',
'齐齐',
'贵港',
'儋州',
'陵水',
'眉山',
'宜春',
'新余',
'佳木',
'承德',
'菏泽',
'常德',
'琼海',
'滨州',
'郴州',
'泸州',
'漳州',
'吉林',
'岳阳',
'崇左',
'安徽',
'资阳',
'威海',
'宿州',
'龙岩',
'德阳',
'玉林',
'湛江',
'泰安',
'淮南',
'娄底',
'乌鲁',
'百色',
'枣庄',
'绥化',
'抚州',
'乐山',
'防城',
'德州',
'营口',
'梅州',
'铜陵',
'亳州',
'来宾',
'清远',
'益阳',
'萍乡',
'肇庆',
'揭阳',
'自贡',
'河池',
'贺州',
'邵阳',
'临高',
'丽水',
'鞍山',
'保亭',
'延边',
'遂宁',
'景德',
'六安',
'鹰潭',
'新乡',
'永州',
'雅安',
'四川',
'鄂尔',
'日照',
'洛阳',
'西宁',
'南充',
'乐东',
'昌江',
'通化',
'云浮',
'海南',
'定安',
'湘西',
'南阳',
'银川',
'广东',
'黄山',
'福建',
'伊春',
'衢州',
'江门',
'许昌',
'湖南',
'鸡西',
'浙江',
'河北',
'咸阳',
'舟山',
'琼中',
'锦州',
'广元',
'茂名',
'江苏',
'白沙',
'襄阳',
'达州',
'酒泉',
'东方',
'济源',
'信阳',
'大理',
'南平',
'抚顺',
'焦作',
'呼和',
'盘锦',
'阳江',
'鹤岗',
'安阳',
'铜仁',
'咸宁',
'天水',
'攀枝',
'葫芦',
'五指',
'平顶',
'曲靖',
'阿坝',
'黄冈',
'内江',
'怀化',
'仙桃',
'朝阳',
'淮北',
'恩施',
'黑河',
'双鸭',
'宝鸡',
'广安',
'辽源',
'三明',
'黑龙',
'丹东',
'白城',
'杨凌',
'红河',
'辽阳',
'三门',
'十堰',
'孝感',
'荆州',
'四平',
'荆门',
'驻马',
'南山区',
'海淀区',
'高新区',
'浦东新区',
'天河区',
'朝阳区',
'高新区',
'洪山区',
'工业园区',
'滨江区',
'雨花台区',
'余杭区',
'福田区',
'西湖区',
'甘井子区',
'江夏区',
'武侯区',
'黄埔区',
'江宁区',
'雁塔区',
'龙岗区',
'海珠区',
'岳麓区',
'徐汇区',
'闵行区',
'西青区',
'番禺区',
'高新区',
'渝北区',
'建邺区',
'宝安区',
'滨海新区',
'杨浦区',
'虎丘区',
'吴中区',
'武昌区',
'浦口区',
'郫都区',
'沙河口区',
'蜀山区',
'长宁区',
'越秀区',
'双流区',
'静安区',
'黄浦区',
'上城区',
'龙华区',
'萧山区',
'锦江区',
'相城区',
'小店区',
'昆山',
'东丽区',
'包河区',
'西城区',
'拱墅区',
'鼓楼区',
'白云区',
'秦淮区',
'思明区',
'大兴区',
'丰台区',
'新吴区',
'东城区',
'昌平区',
'玄武区',
'青秀区',
'普陀区',
'嘉定区',
'罗湖区',
'南开区',
'良庆区',
'通州区',
'成华区',
'金牛区',
'长安区',
'江汉区',
'未央区',
'南岗区',
'河西区',
'东西湖区',
'栖霞区',
'经开区',
'吴江区',
'青羊区',
'裕华区',
'鄞州区',
'龙华区',
'长沙县',
'钱塘区',
'虹口区',
'鼓楼区',
'香洲区',
'开福区',
'蔡甸区',
'顺德区',
'荔湾区',
'集美区',
'江岸区',
'坪山区',
'松北区',
'石景山区',
'武清区',
'渝中区',
'南沙区',
'和平区',
'浑南区',
'红谷滩区',
'姑苏区',
'江北区',
'中山区',
'高新区',
'顺义区',
'美兰区',
'松江区',
'桥西区',
'长安区',
'雨花区',
'松山湖',
'湖里区',
'临平区',
'锡山区',
'沙坪坝区',
'青浦区',
'宝山区',
'芙蓉区',
'碑林区',
'常熟',
'闽侯县',
'高新区',
'汉阳区',
'太仓',
'滨湖区',
'天心区',
'西乡塘区',
'经开区',
'花都区',
'台江区',
'武进区',
'光明区',
'金州区',
'南岸区',
'南海区',
'肥西县',
'铁西区',
'万柏林区',
'广阳区',
'青山湖区',
'蕉城区',
'香坊区',
'张家港',
'硚口区',
'新站区',
'九龙坡区',
'仓山区',
'秀英区',
'津南区',
'历城区',
'新城区',
'河东区',
'莲湖区',
'崂山区',
'崇川区',
'慈溪',
'新北区',
'庐阳区',
'莲池区',
'柳南区',
'江南区',
'迎泽区',
'榆次区',
'盐田区',
'北辰区',
'历下区',
'南湖区',
'沈河区',
'市中区',
'翔安区',
'高新区',
'黄岛区',
'增城区',
'六合区',
'和平区',
'道里区',
'新华区',
'红桥区',
'弋江区',
'南关区',
'鸠江区',
'城阳区',
'海曙区',
'北碚区',
'南昌县',
'惠山区',
'青山区',
'西岗区',
'江阴',
'杏花岭区',
'钟楼区',
'禅城区',
'富阳区',
'容城县',
'龙泉驿区',
'鹿泉区',
'温江区',
'七星区',
'晋安区',
'市南区',
'黄陂区',
'章贡区',
'惠城区',
'郑东新区',
'吉阳区',
'奉贤区',
'梁溪区',
'净月区',
'市北区',
'金坛区',
'河北区',
'琼山区',
'朝阳区',
'鱼峰区',
'江北区',
'望城区',
'南城区',
'东湖区',
'竞秀区',
'邗江区',
'崖州区',
'巴南区',
'丰泽区',
'崇州',
'三河',
'吴兴区',
'马尾区',
'晋江',
'北仑区',
'路南区',
'晋源区',
'道外区',
'路北区',
'新建区',
'大渡口区',
'新都区',
'溧水区',
'同安区',
'平房区',
'信州区',
'义乌',
'余姚',
'临桂区',
'鼓楼区',
'瑶海区',
'临安区',
'皇姑区',
'尖草坪区',
'婺城区',
'西湖区',
'嘉善县',
'如皋',
'龙湾区',
'金山区',
'旅顺口区',
'绿园区',
'金水区',
'天宁区',
'房山区',
'政务区',
'钦南区',
'芝罘区',
'灞桥区',
'海宁',
'宜兴',
'城中区',
'越城区',
'兴宁区',
'东城区',
'盐湖区',
'镇海区',
'静海区',
'固安县',
'海沧区',
'高新区',
'铜山区',
'平湖',
'青云谱区',
'横琴新区',
'海港区',
'亭湖区',
'宁乡',
'大东区',
'乐清',
'槐荫区',
'鹿城区',
'海门区',
'柳北区',
'宿豫区',
'天元区',
'清江浦区',
'李沧区',
'怀柔区',
'肥东县',
'沈北新区',
'莱山区',
'江津区',
'龙凤区',
'涪陵区',
'张店区',
'璧山区',
'石峰区',
'天涯区',
'宝坻区',
'从化区',
'潞州区',
'万秀区',
'惠阳区',
'瓯海区',
'海安',
'汉南区',
'鲤城区',
'涪城区',
'奎文区',
'福山区',
'门头沟区',
'京口区',
'斗门区',
'长乐区',
'叙州区',
'平城区',
'汽开区',
'经开区',
'高淳区',
'即墨区',
'椒江区',
'来安县',
'贾汪区',
'东昌府区',
'万州区',
'濂溪区',
'迁安',
'忻府区',
'长丰县',
'桐乡',
'海城区',
'任城区',
'彭州',
'高陵区',
'双城区',
'东营区',
'南明区',
'诸暨',
'江都区',
'滨湖区',
'渝水区',
'新洲区',
'运河区',
'永川区',
'通州区',
'长兴县',
'上虞区',
'兰山区',
'柯桥区',
'经开区',
'盐都区',
'云龙区',
'南谯区',
'蚌山区',
'浏阳',
'奉化区',
'于洪区',
'武陵区',
'寮步镇',
'天桥区',
'海棠区',
'东安区',
'海州区',
'丹徒区',
'信都区',
'秀洲区',
'南浔区',
'新津区',
'安吉县',
'宽城区',
'安次区',
'岳塘区',
'高碑店',
'桥西区',
'观山湖区',
'岳阳楼区',
'扶绥县',
'泉山区',
'海陵区',
'万江区',
'武鸣区',
'平谷区',
'邕宁区',
'宁海县',
'厚街镇',
'贵池区',
'正定县',
'塘厦镇',
'繁昌区',
'镜湖区',
'常平镇',
'谯城区',
'迎江区',
'大邑县',
'汾阳',
'润州区',
'金湾区',
'丛台区',
'莞城区',
'港口区',
'长安镇',
'邯山区',
'洛江区',
'尧都区',
'清徐县',
'二七区',
'安宁区',
'西山区',
'介休',
'娄星区',
'青白江区',
'泰兴',
'阿城区',
'琅琊区',
'城区',
'武义县',
'凤岗镇',
'溧阳',
'胶州',
'金东区',
'上党区',
'灵山县',
'浔阳区',
'双桥区',
'和县',
'象山区',
'雨山区',
'朔城区',
'丹阳',
'长清区',
'合川区',
'铁山港区',
'吉州区',
'海盐县',
'清溪镇',
'长洲区',
'高明区',
'新华区',
'离石区',
'桐庐县',
'翠屏区',
'颍州区',
'金城江区',
'二道区',
'富锦',
'右江区',
'宁国',
'简阳',
'郊区',
'呼兰区',
'宣州区',
'都江堰',
'庄河',
'岱岳区',
'桥东区',
'管城区',
'沂南县',
'环翠区',
'临海',
'丹棱县',
'北林区',
'澄海区',
'密云区',
'游仙区',
'巢湖',
'桃城区',
'曹妃甸区',
'德城区',
'寒亭区',
'栾城区',
'永康',
'自流井区',
'康巴什区',
'旌阳区',
'涧西区',
'城西区',
'通川区',
'肃州区',
'博望区',
'大岭山',
'宁河区',
'湾沚区',
'大朗镇',
'东乡区',
'花山区',
'清城区',
'铜官区',
'临川区',
'英德',
'云阳县',
'金凤区',
'宜秀区',
'揭东区',
'爱民区',
'三水区',
'榕城区',
'瑞安',
'船山区',
'南川区',
'樟木头',
'红旗区',
'襄垣县',
'月湖区',
'苏家屯区',
'蓬溪县',
'沙田镇',
'鄠邑区',
'句容',
'银海区',
'福清',
'南宫',
'大足区',
'扬中',
'如东县',
'龙港',
'阎良区',
'石碣镇',
'前进区',
'云冈区',
'襄都区',
'九台区',
'向阳区',
'颍泉区',
'铁锋区',
'徐水区',
'萨尔图区',
'古交',
'龙沙区',
'南安',
'虎门镇',
'樟树',
'平果市',
'茂南区',
'桂平',
'高安',
'港北区',
'双清区',
'呈贡区',
'延吉',
'官渡区',
'寿县',
'湘潭县',
'翼城县',
'城关区',
'怀安县',
'盘龙区',
'雨湖区',
'新昌县',
'牡丹区',
'綦江区',
'广信区',
'涟水县',
'姜堰区',
'站前区',
'八步区',
'冷水滩区',
'平桂区',
'铜梁区',
'罗庄区',
'荷塘区',
'安达',
'长寿区',
'莲都区',
'温岭',
'江州区',
'靖江',
'彭山区',
'禹会区',
'东阳',
'祁县',
'高港区',
'信丰县',
'汝城县',
'乐亭县',
'平度',
'金平区',
'博兴县',
'南康区',
'延庆区',
'广陵区',
'高平',
'龙湖区',
'五通桥区',
'浮梁县',
'龙马潭区',
'赣县区',
'市中区',
'玉田县',
'永福县',
'恩平',
'洛龙区',
'寿光',
'柯城区',
'白塔区',
'柴桑区',
'高邮',
'台安县',
'灵川县',
'昌邑',
'普陀区',
'桃源县',
'五台县',
'秀峰区',
'西工区',
'海阳',
'藁城区',
'临潼区',
'临猗县',
'钦北区',
'安义县',
'定襄县',
'围场县',
'荔浦市',
'周至县',
'平陆县',
'丰都县',
'都昌县',
'遵化',
'象山县',
'岢岚县',
'珠山区',
'辛集',
'永济',
'新兴县',
'阳朔县',
'兴庆区',
'繁峙县',
'望花区',
'武乡县',
'驿城区',
'兴宾区',
'雁山区',
'陕州区',
'伊美区',
'进贤县',
'鹤城区',
'沁县',
'城子河区',
'梅江区',
'永嘉县',
'赣榆区',
'桥头镇',
'怀宁县',
'工农区',
'济阳区',
'阳明区',
'桐城',
'岑溪',
'北流',
'平潭县',
'潜山',
'太和县',
'麻城',
'蒙山县',
'苍南县',
'博白县',
'启东',
'吉水县',
'界首',
'黄山区',
'任丘',
'陆川县',
'石排镇',
'张湾区',
'铁东区',
'蓟州区',
'北关区',
'颍上县',
'依安县',
'兖州区',
'巨鹿县',
'奉节县',
'颍东区',
'富拉尔基区',
'金乡县',
'石龙镇',
'新城区',
'云州区',
'建华区',
'闽清县',
'隆尧县',
'茶山镇',
'通城县',
'丰城',
'泾阳县',
'宜丰县',
'魏都区',
'复兴区',
'清苑区',
'五常',
'让胡路区',
'大厂县',
'防城区',
'长汀县',
'惠安县',
'德清县',
'抚宁区',
'武安',
'东港区',
'城区',
'台儿庄区',
'博山区',
'田东县',
'沙市区',
'麻涌镇',
'大理',
'五华区',
'市中区',
'西林县',
'掇刀区',
'港南区',
'永清县',
'安新县',
'资阳区',
'嵊州',
'荔城区',
'云岩区',
'邵东市',
'金安区',
'宾县',
'广德',
'埇桥区',
'金堂县',
'田家庵区',
'东台',
'潼南区',
'普兰店区',
'阳曲县',
'泗县',
'雄县',
'泰山区',
'谢家集区',
'韶山',
'郓城县',
'白云区',
'皋兰县',
'嘉陵区',
'友谊县',
'名山区',
'肥城',
'廉江',
'大丰区',
'安源区',
'淮安区',
'赤坎区',
'荣昌区',
'玉山县',
'河东区',
'上林县',
'瓦房店',
'太谷区',
'麻章区',
'兴城',
'鄱阳县',
'涟源',
'左权县',
'潮阳区',
'盱眙县',
'仁寿县',
'固镇县',
'雁江区',
'孝南区',
'睢宁县',
'醴陵',
'于都县',
'北湖区',
'东坑镇',
'新市区',
'丰南区',
'濠江区',
'青神县',
'水磨沟区',
'北城区',
'长海县',
'宝应县',
'江阳区',
'新乐',
'龙子湖区',
'苏仙区',
'中堂镇',
'沙依巴克区',
'开平区',
'麦积区',
'兴安县',
'纳溪区',
'四会',
'东胜区',
'叠彩区',
'台山',
'高要区',
'雁峰区',
'伊金霍洛',
'齐河县']
