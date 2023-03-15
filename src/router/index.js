import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Repair from '../views/Repair.vue'
// import BillingInfo from '../components/BillingInfo.vue'
import Problems from '../components/Problems.vue'
import Summary from '../components/Summary.vue'



const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Register'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/repair/step-1',
    name: 'Repair',
    component: Repair,
    meta: {
      title: 'Repair'
    }
  },
  {
    path: '/repair/step-2',
    name: 'Problems',
    component: Problems,
    meta: {
      title: 'Repair'
    }
  },
  {
    path: '/repair/step-3',
    name: 'Summary',
    component: Summary,
    meta: {
      title: 'Repair'
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Bytecare`
  next();
})

export default router
