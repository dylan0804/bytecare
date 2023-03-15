<template>
    <nav class="container mx-auto pt-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-6">
                <router-link to="#" class="px-3 py-2 rounded-md hover:bg-[#66b1ff]">Repair</router-link>
                <router-link to="#" class="px-3 py-2 rounded-md hover:bg-[#66b1ff]">Shop</router-link>
                <router-link to="#" class="px-3 py-2 rounded-md hover:bg-[#66b1ff]">Wishlist</router-link>
            </div>
            <div v-show="isLoggedIn">
            <el-dropdown :hide-on-click="false">
                <el-avatar class="text-2xl bg-[#454545] outline-none hover:outline-dashed" :size="50">{{ userInitials }}</el-avatar>
                <template #dropdown>
                    <el-dropdown-menu class="flex flex-col space-y-3 p-4 font-medium text-sm">
                        <div class="flex items-center space-x-4">
                            <div>
                                <el-avatar class="text-2xl bg-[#454545] outline-none" :size="50">{{ userInitials }}</el-avatar>
                            </div>
                            <div>
                                <p>{{ store.state.profileFirstName }} {{ store.state.profileLastName }}</p>
                                <p>{{ store.state.profileEmail }}</p>
                            </div>
                        </div>
                        <hr>
                        <div class="flex flex-col space-y-3 justify-start">
                            <el-dropdown-item>
                                <router-link class="flex space-x-1 items-center" to="#">
                                    <i class="fa-solid fa-cart-shopping"></i>
                                    <p>My cart</p>    
                                </router-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <router-link class="flex space-x-1 items-center" to="#">
                                    <i class="fa-solid fa-heart"></i>
                                    <p>My wishlist</p>
                                </router-link>
                            </el-dropdown-item>
                            <el-dropdown-item  @click="signOutUser" divided>
                                <button class="flex space-x-1 items-center">
                                    <i class="fa-solid fa-right-from-bracket"></i>
                                    <p>Sign out</p>
                                </button>
                            </el-dropdown-item>
                        </div>
                    </el-dropdown-menu>
                </template>
             </el-dropdown>
          </div>
        </div>
    </nav>
</template>

<script setup>
import { useStore } from 'vuex';
import { onMounted, ref, watchEffect } from 'vue';
import { auth } from '@/firebase/firebaseInit';
import { signOut } from '@firebase/auth';

//variables
const store = useStore();
const userInitials = ref("");
const isLoggedIn = ref(null)

const signOutUser = async () => {
    try {
        await signOut(auth)
        localStorage.setItem("userLoggedIn", false);
        console.log("user is successfully logged out!")
        localStorage.setItem("isMessageShown", false)
        window.location.reload();
    } catch (err) {
        console.log(err.message)
    }
}

// check is user logged or not
onMounted(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn");
    if (userLoggedIn === 'true') {
      console.log("User is logged in!");
    } else {
      console.log("User is not logged in!");
    }
}),

watchEffect(() => {
  if (store.state.profileFirstName && store.state.profileLastName) {
    userInitials.value = store.state.profileFirstName[0] + store.state.profileLastName[0];
  }

  const userLoggedIn = localStorage.getItem("userLoggedIn");
  isLoggedIn.value = userLoggedIn === "true";

});
</script>