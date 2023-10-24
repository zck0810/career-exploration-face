<template>
  <div class="update-demo">
    <dv-conical-column-chart :config="config" style="width:90%;height:30vh; padding-top: 20px; margin-left: 20px;" />
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
        fontSize:13,
        imgSideLength:40,
        img: [
          'http://datav.jiaminghi.com/img/conicalColumnChart/1st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/2st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/3st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/4st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/5st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/6st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/7st.png'
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
