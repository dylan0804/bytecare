import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Repair from '../views/Repair.vue'
import Problems from '../components/Problems.vue'
import Summary from '../components/Summary.vue'
import Profile from '../views/Profile.vue'
import Shop from '../views/Shop.vue'
import Product from '../views/Product.vue'
import Cart from '../views/Cart.vue'
import Billing from '../views/Billing.vue'
import Wishlist from '../views/Wishlist.vue'

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
    path: '/shop',
    name: 'Shop',
    component: Shop,
    meta: {
      title: 'Shop',
      requiresAuth: true
    }
  },
  {
    path: '/product/:uid',
    name: 'Product',
    component: Product,
    meta: {
      title: 'Product',
      requiresAuth: true
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
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: {
      title: 'Cart',
      requiresAuth: true
    }
  },
  {
    path: '/billing',
    name: 'Billing',
    component: Billing,
    meta: {
      title: 'Billing',
      requiresAuth: true
    }
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: Wishlist,
    meta: {
      title: 'Wishlist',
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
  document.title = `${to.meta.title || 'Default Title'} | Bytecare`;

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn")); // Assuming a boolean value is stored

  if (requiresAuth && !userLoggedIn) {
    next('/register');
  } else {
    next();
  }
});

export default router
