<template>
    <div class="min-h-screen relative flex flex-row-reverse justify-center items-center">
        <router-link :to="{ name: 'Home' }" class="absolute top-10 left-10 text-gray-500 z-30">&#8592; Back to home</router-link>
        <form class="relative min-h-screen flex flex-col space-y-6 items-start justify-center md:w-[50%] md:ml-24">
            <p class="text-gray-500">START FOR FREE</p>
            <h1 class="font-medium text-3xl">Login to Bytecare</h1>
            <p class="font-light">Don't have an account? <router-link class="text-[#387ff5]"  :to="{ name: 'Register' }">Register</router-link></p>
            <div class="flex flex-col space-y-4">
                <el-input class="w-[350px] h-[40px]" v-model="email" placeholder="johndoe@mail.com" autocomplete="off" autofocus="false" clearable>
                    <template #append><i class="fa-solid fa-at"></i></template>
                </el-input>
                <el-input class="w-[350px] h-[40px]" v-model="password" type="password" placeholder="6+ characters" autocomplete="off" clearable show-password>
                    <template #append><i class="fa-solid fa-lock"></i></template>
                </el-input>
            </div>
            <span v-if="errMsg" class="warning">{{ errMsg }}</span>
            <button @click.prevent="validateUser" class="text-lg font-light md:block p-2 w-[350px] rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600">Login with existing account <address></address></button>
            <el-button 
                v-loading.fullscreen.lock="fullscreenLoading" 
                @click.prevent="signInWithGoogle" 
                class="flex justify-center items-center text-lg font-light py-5 w-[350px] rounded-md border-2 border-gray-400 text-gray-500">
                <i class="fa-brands fa-google mr-2 text-blue-500"></i>
                <p>Sign in with Google</p>
            </el-button>
        </form>
        <div class="min-h-screen min-w-[450px] items-center hidden lg:flex w-[50%]">
            <img src="../assets/img/Service-Management-Solutions-for-Children-What-we-do.jpg" alt="">
            <!-- <div class="flex flex-col justify-center h-[100vh] p-3">
                <div class="flex flex-col relative justify-center bg-[#387ff5] h-full rounded-xl px-4">
                    <router-link  :to="{ name: 'Home' }" class=" text-white absolute top-8 left-4 z-20">&#8592; Back to Home</router-link>
                    <h1 class="text-white font-bold text-3xl">Start your journey with us.</h1>
                    <p class="text-white">Discover the world's best community of freelancers and business owners</p>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@firebase/auth';
import firebase from '../firebase/firebaseInit'
import { auth } from '../firebase/firebaseInit'

const email = ref("");
const password = ref("");
const errMsg = ref("");
const router = useRouter();
const fullscreenLoading = ref(false)

//validate user
const validateUser = async () => {
    if(email.value === "" &&
       password.value === "") {
            errMsg.value = "Please fill out all the fields"
       } else {
            await loginUser();
            // await store.dispatch("getCurrentUser");
            // console.log(store.state.profileFirstName)
       }
}

// login user
const loginUser = async () => {
    try {
            const loggedIn = await signInWithEmailAndPassword(auth, email.value, password.value)
            const user = loggedIn.user
            console.log(user.email)
            errMsg.value = "";
            localStorage.setItem("userLoggedIn", true);
            localStorage.setItem("isMessageShown", false)
            openFullScreen1()
            setTimeout(() => {
                router.push({ name: 'Home' })
            },  1500)
        } catch (err) {
            errMsg.value = "Invalid email or password"
    }
}

//login with google
const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
        prompt: 'select_account'
    });

  try {
    const result = await signInWithPopup(auth, provider);
    // Signed in with Google
    const user = result.user;

    openFullScreen1()

    localStorage.setItem("userLoggedIn", true);
    localStorage.setItem("isMessageShown", false)
    console.log(user);
    setTimeout(() => {
        router.push({ name: 'Home' })
    },  2000)
  } catch (error) {
    // Handle errors here
    console.log(error.code)
  }
}

//loading animation
const openFullScreen1 = () => {
    console.log("LOADINGGGG")
  fullscreenLoading.value = true
  setTimeout(() => {
    fullscreenLoading.value = false
  }, 2000)
}
</script>

<style lang="scss" scoped>

// .right {
//     background: url(../assets/img/background.png);
// }
// .right-side {
//     position: absolute;
//     background-color: white;
//     transform: skew(-4deg);
//     left: -40px;
//     width: 100px;
//     height: 100%;
// }


</style>