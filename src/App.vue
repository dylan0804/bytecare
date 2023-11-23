<template>
<div class="app">
  <Navigation v-if="!navigation" />
  <router-view/>
  <Footer v-if="!navigation"  />

  <el-dialog
    v-model="centerDialogVisible"
    title="Share your thoughts"
    width="350px"
    align-center
    center
  >
    <div class="flex flex-col justify-center items-center">
      <p>Scan this code to give us your feedbacks</p>
      <img src="../src/assets/img/qr.png" alt="">
      <el-divider>
        or
      </el-divider>
      <div class="w-[90%] text-center">
        <div class="p-2 rounded-md border-solid border-2 truncate">
          <a class=" text-sky-600" href="https://forms.gle/TNQZnUWrBCtUjHGw5"
          >  
          https://forms.gle/TNQZnUWrBCtUjHGw5
        </a>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" plain @click="centerDialogVisible = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

</div>
</template>

<script setup>
import Navigation from './components/Navigation.vue';
import Footer from './components/Footer.vue';
import { ref, watch, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import { onAuthStateChanged } from '@firebase/auth';
import firebase from './firebase/firebaseInit'
import { auth } from './firebase/firebaseInit'

const navigation = ref(null)
const router = useRouter()
const store = useStore()
const centerDialogVisible = ref(false);

onMounted(() => {
  // if(!store.state.shopItemsFetched) {
  //   store.dispatch('getProducts')
  // }

  onAuthStateChanged(auth, async (user) => {
    store.commit("updateUser", user);
    if(user) {
      await store.dispatch("getCurrentUser")
    }
  })
})

onBeforeMount(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn");
    const hasModalBeenShown = sessionStorage.getItem('hasModalBeenShown');

    console.log('User Logged In:', userLoggedIn);
    console.log('Modal Shown Flag:', hasModalBeenShown);

    if (!hasModalBeenShown) {
        console.log('Opening Modal...');
        centerDialogVisible.value = true;

        // Set the flag immediately
        sessionStorage.setItem('hasModalBeenShown', 'true');
    }
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
  body {
    background-color: #f4f6f8;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  
</style>
