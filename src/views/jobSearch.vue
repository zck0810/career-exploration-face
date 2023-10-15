<template>
  <div class="jobSearch-container">
    <h1>职位查询页面</h1>
  </div>
</template>

<script>
import { getAllData } from '@/api/positionInformation'


export default {
  data(){
    return{

    }
  },

  mounted () {
    getAllData().then(res=>{
      console.log(res)
    })
  }
}

</script>

<style scoped>
.jobSearch-container{
  text-align: center;
  max-height: calc(100vh - 54px);
  overflow-y: auto;
}
</style>
