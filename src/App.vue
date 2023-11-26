<template>
  <div id="app">
    <nav>
      <div style="margin-left: 20px;">
        <router-link to="/">综合信息可视化 <i class="el-icon-s-home"></i></router-link>

        |
        <router-link to="/jobSearch">职位查询 <i class="el-icon-location"></i></router-link>
        |
        <router-link to="/companySearch">公司查询 <i class="el-icon-s-platform"></i></router-link>
<!--        <router-link to="/ChatGPT">AI问答助手老版</router-link>-->
        |
        <router-link to="/newChatgpt">AI问答助手 <i class="el-icon-s-custom"></i></router-link>
<!--        <router-link to="/Recommend">职位推荐</router-link>-->
        <span
          style="float: right; margin-right: 30px; color: black; font-size: 20px">当前系统访问量为：{{ visitCount }} <i class="el-icon-user"></i></span>
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
// 解决ERROR ResizeObserver loop completed with undelivered notifications.
//问题的
    const debounce = (fn, delay) => {
      let timer = null;
      return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      }
    }
// 解决ERROR ResizeObserver loop completed with undelivered notifications.
//问题的
    const _ResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
      constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
      }
    }
    getVisitCount().then(res => {
      const { visit } = res.data
      this.visitCount = visit
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
