import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import about from '@/views/about.vue'
import setting from '@/views/setting.vue'
import edit from '@/views/edit.vue'
import score from '@/views/score.vue'

Vue.use(VueRouter)

export const routes = [
  {
    path: '/play',
    name: 'play',
    component: Home,
    icon: 'mdi-play'
  },
  {
    path: '/about',
    name: 'about',
    component: about,
    icon: 'mdi-information'
  },
  {
    path: '/setting',
    name: 'setting',
    component: setting,
    icon: 'mdi-cogs'
  },
  {
    path: '/edit',
    name: 'edit',
    component: edit,
    icon: 'mdi-pencil'
  },
  {
    path: '/score',
    name: 'score',
    component: score,
    icon: 'mdi-note'
  },
]
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
