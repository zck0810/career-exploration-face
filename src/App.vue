<template>
  <div id="app">
    <nav>
      <div style="margin-left: 20px;">
        <router-link to="/">首页</router-link>
        |
        <router-link to="/jobSearch">职位查询</router-link>
        |
        <router-link to="/companySearch">公司查询</router-link>
        |
<!--        <router-link to="/ChatGPT">AI问答助手</router-link>-->
        <router-link to="/newChatgpt">交互式AI问答助手</router-link>
        <span
          style="float: right; margin-right: 30px; color: black; font-size: 20px">当前系统访问量为：{{ visitCount }}</span>
      </div>
    </nav>
    <router-view
      style="max-height: calc(100vh - 54px); height: calc(100vh - 54px); background-color: rgba(123,124,124,0.15);"/>
  </div>
</template>

<script>
import { getVisitCount } from '@/api/visit'

export default {
  data () {
    return {
      visitCount: '',
    }
  },
  mounted () {
    getVisitCount().then(res => {
      const { visit } = res.data
      this.visitCount = visit
      console.log(res)
    })
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: -8px;
  background-color: rgba(255, 255, 255, 0.22);
  height: 100vh;
  max-height: 100vh;
}

nav {
  padding: 15px;
  background-color: rgba(0, 111, 255, 0.51);
  font-size: 18px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 20px;
}

nav a.router-link-exact-active {
  color: #034ce8;
}
</style>
