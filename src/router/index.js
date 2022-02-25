import { createRouter, createWebHashHistory } from 'vue-router'
import Menu from '../components/Menu.vue'
import Computer from '../components/Computer.vue'

const routes = [
  { path: '/computer', component: Computer },
  { path: '/', component: Menu },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
