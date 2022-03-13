import { createRouter, createWebHistory } from 'vue-router'
import Menu from '../components/Menu.vue'
import Computer from '../components/Computer.vue'
import Online from '../components/Online.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'

const routes = [
  { path: '/computer', component: Computer },
  { path: '/online', component: Online },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/', component: Menu },
]

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  routes,
})

export default router
