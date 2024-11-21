import 'vuetify/styles'
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { createWebHistory, createRouter } from 'vue-router'
import CalculatorView from './views/Calculator.vue'




const routes = [
    { path: '/admin', component: () => import('./views/Admin.vue') },
    { path: '/', component: CalculatorView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


createApp(App)
.use(vuetify)
.use(router)
.mount('#app')