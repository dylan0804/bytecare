import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Repair from '../views/Repair.vue'
import Problems from '../components/Problems.vue'
import Summary from '../components/Summary.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/*',
    component: 404,
  },
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
      title: 'Repair',
      requiresAuth: true
    }
  },
  {
    path: '/repair/step-2',
    name: 'Problems',
    component: Problems,
    meta: {
      title: 'Repair',
      requiresAuth: true
    }
  },
  {
    path: '/repair/step-3',
    name: 'Summary',
    component: Summary,
    meta: {
      title: 'Repair',
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Profile',
      requiresAuth: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0}
  }
})

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title} | Bytecare`
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const userLoggedIn = localStorage.getItem("userLoggedIn");
  if (requiresAuth && userLoggedIn === 'false') {
    next('/register')
  } else {
    next()
  }
})

export default router
