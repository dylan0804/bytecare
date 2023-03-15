<template>
<div class="app">
  <Navigation v-if="!navigation" />
  <router-view/>
  <Footer v-if="!navigation"  />
</div>
</template>

<script setup>
import Navigation from './components/Navigation.vue';
import Navigation2 from './components/Navigation2.vue';
import Footer from './components/Footer.vue';
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import { onAuthStateChanged } from '@firebase/auth';
import firebase from './firebase/firebaseInit'
import { auth } from './firebase/firebaseInit'

const navigation = ref(null)
const router = useRouter()
const store = useStore()

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    store.commit("updateUser", user);
    if(user) {
      await store.dispatch("getCurrentUser")
    }else {
      console.log("no user is logged in!!")
    }
  })
})


// dont display nav and footer if the page is in either login or register
const checkRoute = () => {
  if (
    router.currentRoute.value.name === 'Login' ||
    router.currentRoute.value.name === 'Register' ||
    router.currentRoute.value.name === 'ForgotPassword'
  ) {
    navigation.value = true
  } else {
    navigation.value = false
  }
}

// check current route
watch(router.currentRoute, checkRoute, { immediate: true })

</script>

<style lang="scss">
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
</style>
