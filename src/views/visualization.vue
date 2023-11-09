<template xmlns="">
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
            <cityPositionCount></cityPositionCount>
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
            <hotPosition></hotPosition>
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
import cityPositionCount from '@/components/visualization/cityPositionCount'
import hotPosition from '@/components/visualization/hotPosition'
import myMap from '@/components/visualization/myMap'
import educationPositionCount from '@/components/visualization/educationPositionCount'
import educationSalary from '@/components/visualization/educationSalary'
import companyScale from '@/components/visualization/companyScale'

export default {
  name: 'visualization',
  components: {
    wordCloud,
    cityPositionCount,
    hotPosition,
    myMap,
    educationPositionCount,
    educationSalary,
    companyScale
  },
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
</style>
