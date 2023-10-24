<template>
  <div class="update-demo">
    <span style="position: absolute; top: 20px; text-align: center; font-size: 20px; left: 35%; color:yellow; font-weight: bold">学历要求岗位数量关系</span>
    <dv-conical-column-chart :config="config" style="width:96%;height:35vh; top: 10px; margin-left: 10px; position: relative; background-color: rgba(15,55,95,0.18)"  />
  </div>
</template>

<script>
import { getEducationCount } from '@/api/liepin'

export default {
  name: 'educationPositionCount',
  data () {
    return {
      config: {
        showValue: true,
        fontSize:14,
        imgSideLength:30,
        columnColor: "rgba(0,216,255,0.58)",
        title: {                      // 添加标题
          text: '应届生各学历与起薪关系',      // 标题内容
          textStyle: {
            color: 'yellow'           // 标题文字颜色
          },
          left: 'center'              // 标题居中显示
        },
        img: [
          'http://datav.jiaminghi.com/img/conicalColumnChart/1st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/2st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/3st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/4st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/5st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/6st.png',
        ],
        data: [
          {
            name: '周口',
            value: 55
          },
          {
            name: '南阳',
            value: 120
          },
          {
            name: '西峡',
            value: 71
          },
          {
            name: '驻马店',
            value: 66
          },
          {
            name: '新乡',
            value: 80
          },
          {
            name: '信阳',
            value: 35
          },
          {
            name: '漯河',
            value: 15
          }
        ],
      }
    }
  },
  mounted () {
    getEducationCount().then(res=>{
      this.config.data = res.data
      this.config = { ...this.config }
    })
  },
  methods: {

  }
}
</script>



