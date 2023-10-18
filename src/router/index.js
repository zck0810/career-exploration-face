import Vue from 'vue'
import VueRouter from 'vue-router'
import visualization from '../views/visualization.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'visualization',
    component: visualization
  },
  {
    path: '/jobSearch',
    name: 'jobSearch',
    component: () => import('../views/jobSearch.vue')
  },
  {
    path: '/companySearch',
    name: 'companySearch',
    component: () => import('../views/companySearch.vue')
  },
  {
    path: '/ChatGPT',
    name: 'ChatGPT',
    component: () => import('../views/ChatGPT.vue')
  },
  {
    path: '/newChatgpt',
    name: 'newChatgpt',
    component: () => import('../views/newChatgpt.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
