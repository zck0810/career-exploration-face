<template>
  <div class="Recommend-container">
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="活动形式">
      <el-input type="textarea" v-model="form.desc" style="width: 500px;margin-top:10px" @keyup.enter.native="loadPost"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="loadPost">推荐</el-button>
      <el-button @click="resultQuery">取消</el-button>
    </el-form-item>
  </el-form>
    <h1>返回结果:</h1>
    <div style="width: 700px;height: 300px;border: 1px solid skyblue;margin: 20px">{{result}}</div>
  </div>
</template>
<script>
  import {getRecommendData} from "@/api/recommend";

  export default {

    name: "Recommend",
    data() {
      return {
        result:'',
        form: {
          desc: ''
        }
      }
    },
    methods: {
      resultQuery() {
        this.form.desc = ''
      },
      loadPost() {
        const data = {
          form: this.form,
        }
        getRecommendData(data).then(res => {
          console.log(res)
          if (res.code === 20000) {
            this.result= res.data.data
          } else {
            alert('获取数据失败')
          }

        })
      },
    }
  }
</script>
<style scoped>
  .Recommend-container{
    overflow-y: auto;
    margin: 30px;
  }
</style>
