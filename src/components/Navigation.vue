<template>
    <div class="shadow-md bg-white">
        <nav class="relative mx-auto container p-4">
           <div class="flex items-center justify-between">
               <div>
                   <router-link :to="{ name: 'Home' }" class="text-3xl">Bytecare</router-link>
               </div>
               <div class="md:flex items-center space-x-10 hidden">
                   <div class="nav-link text-xl">
                       <router-link :to="{ name: 'Repair' }">Repair</router-link>
                       <span class="block w-1/2 bg-orange-500 h-0.5 transition-all"></span>
                   </div>
                   <div class="nav-link text-xl">
                       <router-link :to="{ name: 'Shop' }">Shop</router-link>
                       <span class="block w-1/2 bg-orange-500 h-0.5 transition-all"></span>
                   </div>
                   <div class="nav-link text-xl">
                       <router-link :to="{ name: 'Wishlist' }">Wishlist</router-link>
                       <span class="block w-1/2 bg-orange-500 h-0.5 transition-all"></span>
                   </div>
               </div>
               <el-dropdown v-show="!isLoggedIn" :hide-on-click="false" class="ml-auto md:hidden">
                    <i class="fa-solid fa-bars flex ml-auto text-3xl outline-none cursor-pointer md:hidden"></i>
                    <template #dropdown>
                        <el-dropdown-menu class="w-[150px] font-medium">
                            <el-dropdown-item @click="router.push({ name: 'Repair' })">Repair</el-dropdown-item>
                            <el-dropdown-item @click="router.push({ name: 'Shop' })">Shop</el-dropdown-item>
                            <el-dropdown-item @click="router.push({ name: 'Wishlist' })">Wishlist</el-dropdown-item>
                            <el-dropdown-item divided>
                                <router-link :to="{ name: 'Register' }">Sign in / Register</router-link>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
               <div v-show="!isLoggedIn" class="flex items-center space-x-3">
                    <router-link :to="{ name: 'Login' }" class="text-md hidden md:block p-2 px-6 text-black border-2 border-black rounded-full">Login</router-link>
                    <router-link :to="{ name: 'Register' }" class="text-md hidden md:block p-2 px-6 border-2 border-black text-white bg-black rounded-full">Register</router-link>
              </div>
              <div v-show="isLoggedIn">
                <el-dropdown :hide-on-click="false">
                    <!-- <el-skeleton v-if="!store.state.profileFirstName" class=" outline-none" style="--el-skeleton-circle-size: 50px" animated>
                        <template #template>
                        <el-skeleton-item variant="circle"/>
                        </template>
                    </el-skeleton> -->
                    <el-avatar class="text-2xl bg-[#454545] outline-none hover:outline-dashed" :size="50">{{ userInitials }}</el-avatar>
                    <template #dropdown>
                        <el-dropdown-menu class="flex flex-col space-y-3 p-4 font-medium text-sm">
                            <div class="flex items-center space-x-4">
                                <div>
                                    <el-avatar class="text-2xl bg-[#454545] outline-none" :size="50">{{ userInitials }}</el-avatar>
                                </div>
                        <div>
                                    <p>{{ firstName }} {{ lastName }}</p>
                                    <p>{{ email }}</p>
                                </div>
                            </div>
                            <hr>
                            <div class="flex flex-col space-y-3 justify-start">
                                <el-dropdown-item @click="router.push({ name: 'Profile' })">
                                    <router-link class="flex space-x-1 items-center" to="#">
                                        <i class="fa-solid fa-user"></i>
                                        <p>My profile</p>
                                    </router-link>
                                </el-dropdown-item>
                                <el-dropdown-item @click="router.push({ name: 'Repair' })" divided>
                                    <router-link class="flex space-x-1 items-center" to="#">
                                        <i class="fa-solid fa-wrench"></i>
                                        <p>Repair</p>
                                    </router-link>
                                </el-dropdown-item>
                                <el-dropdown-item @click="router.push({ name: 'Shop' })">
                                    <router-link class="flex space-x-1 items-center" to="#">
                                        <i class="fa-solid fa-shop"></i>
                                        <p>Shop</p>
                                    </router-link>
                                </el-dropdown-item>
                                <el-dropdown-item @click="router.push({ name: 'Cart' })" >
                                    <router-link class="flex space-x-1 items-center" to="#">
                                        <i class="fa-solid fa-cart-shopping"></i>
                                        <p>My cart</p>
                                    </router-link>
                                </el-dropdown-item>
                                <el-dropdown-item @click="router.push({ name: 'Wishlist' })">
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
    </div>
</template>
<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import { auth } from '@/firebase/firebaseInit';
import { signOut } from '@firebase/auth';
import { useRouter } from 'vue-router';

//variables
// const store = useStore();
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const userInitials = ref("");
const isLoggedIn = ref(null)
const router = useRouter();
const centerDialogVisible = ref(false)
const cartDialog = ref(false)

const signOutUser = async () => {
    router.push({ name: 'Home' })
    try {
        await signOut(auth)
        console.log("user is successfully logged out!")

        localStorage.setItem("profileFirstName", null)
        localStorage.setItem("profileLastName", null)
        localStorage.setItem("profileEmail", null)
        localStorage.setItem("userLoggedIn", false);

        window.location.reload();
        // router.push({ name: 'Home'} )
    } catch (err) {
        console.log(err.message)
    }
}

// check is user logged or not
onMounted(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn");

    firstName.value = localStorage.getItem('profileFirstName');
    lastName.value = localStorage.getItem('profileLastName');
    email.value = localStorage.getItem('profileEmail');

    userInitials.value = (lastName.value) ? firstName.value[0] + lastName.value[0] : firstName.value[0]
}),

watchEffect(() => {
  

  const userLoggedIn = localStorage.getItem("userLoggedIn");
  isLoggedIn.value = userLoggedIn === "true";

});
</script>

<style lang="scss" scoped>
.nav-link:hover span{
    width: 100%
}
</style>