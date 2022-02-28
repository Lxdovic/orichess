import { createRouter, createWebHistory } from 'vue-router'
import Menu from '../components/Menu.vue'
import Computer from '../components/Computer.vue'

const routes = [
  { path: '/computer', component: Computer },
  { path: '/', component: Menu },
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes,
})

export default router
