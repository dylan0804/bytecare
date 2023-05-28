import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import InstantSearch from 'vue-instantsearch/vue3/es';
import firebase from './firebase/firebaseInit'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/firebaseInit'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/tailwind.css'


createApp(App)
              .use(store)
              .use(router)
              .use(ElementPlus)
              .use(InstantSearch)
              .mount('#app');
