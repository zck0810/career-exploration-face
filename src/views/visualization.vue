<template xmlns="">
  <div class="visualization-container">
    <el-row class="row-class">
      <el-col :span="7" class="col-container">
        <el-row style="height: 35%;">
          <dv-border-box-13>
            <wordCloud></wordCloud>
          </dv-border-box-13>
        </el-row>
        <el-row style="height: 35%;">
          <dv-border-box-13>
            <cityPositionCount></cityPositionCount>
          </dv-border-box-13>
        </el-row>
        <el-row style="height: 30%;">
          <dv-border-box-13>
            <wordCloud></wordCloud>
          </dv-border-box-13>
        </el-row>
      </el-col>

      <el-col :span="10" class="col-container">
        <el-row style="height: 70%;">
          <dv-border-box-13>
            <myMap></myMap>
          </dv-border-box-13>
        </el-row>
        <el-row style="height: 30%;">
          <dv-border-box-13>
            <wordCloud></wordCloud>
          </dv-border-box-13>
        </el-row>
      </el-col>

      <el-col :span="7" class="col-container">
        <el-row style="height: 70%;">
          <dv-border-box-13>
            <hotPosition></hotPosition>
          </dv-border-box-13>
        </el-row>
        <el-row style="height: 30%;">
          <dv-border-box-13>
            <wordCloud></wordCloud>
          </dv-border-box-13>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import wordCloud from '@/components/visualization/wordCloud'
import cityPositionCount from '@/components/visualization/cityPositionCount'
import hotPosition from '@/components/visualization/hotPosition'
import myMap from '@/components/visualization/myMap'

export default {
  name: 'visualization',
  components: {
    wordCloud,
    cityPositionCount,
    hotPosition,
    myMap
  },

}
</script>

<style scoped>
.visualization-container{
  text-align: center;
  max-height: calc(100vh - 54px);
  overflow-y: auto;
  background-image: url("@/assets/image/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
}
.row-class{
  height: 126vh;
  max-height: 126vh;
}
.col-container{
  height: 126vh;
  max-height: 126vh;
}
</style>
