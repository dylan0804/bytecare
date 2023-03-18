<template>
    <div class="min-h-screen relative flex flex-row-reverse justify-center items-center">
        <router-link :to="{ name: 'Home' }" class="absolute top-10 left-10 text-gray-500 z-30">&#8592; Back to home</router-link>
        <form class="relative min-h-screen flex flex-col space-y-6 items-start justify-center md:w-[50%] md:ml-24">
            <p class="text-gray-500">START FOR FREE</p>
            <h1 class="font-medium text-3xl">Sign up to Bytecare</h1>
            <p class="font-light">Already have an account? <router-link class="text-[#387ff5]"  :to="{ name: 'Login' }">Login</router-link></p>
            <div class="flex flex-col space-y-4">
                <el-input class="w-[350px] h-[40px]" v-model="firstName" placeholder="John" clearable>
                    <template #append><i class="fa-solid fa-user"></i></template>
                </el-input>
                <el-input class="w-[350px] h-[40px]" v-model="lastName" placeholder="Doe" clearable>
                    <template #append><i class="fa-solid fa-user"></i></template>
                </el-input>
                <el-input class="w-[350px] h-[40px]" v-model="email" placeholder="johndoe@mail.com" autocomplete="off" autofocus="false" clearable>
                    <template #append><i class="fa-solid fa-at"></i></template>
                </el-input>
                <el-input class="w-[350px] h-[40px]" v-model="password" type="password" placeholder="6+ characters" autocomplete="off" clearable show-password>
                    <template #append><i class="fa-solid fa-lock"></i></template>
                </el-input>
            </div>
            <span v-if="errMsg" class="warning">{{ errMsg }}</span>
            <button @click.prevent="validateUser" class="text-lg font-light md:block p-2 w-[350px] rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600">Create an account</button>
            <el-button 
                v-loading.fullscreen.lock="fullscreenLoading" 
                @click.prevent="signInWithGoogle" 
                class="flex justify-center items-center text-lg font-light py-5 w-[350px] rounded-md border-2 border-gray-400 text-gray-500">
                <i class="fa-brands fa-google mr-2 text-blue-500"></i>
                <p>Sign up with Google</p>
            </el-button>
        </form>
        <div class="min-h-screen min-w-[450px] items-center hidden lg:flex w-[50%] bg-white">
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
import { addDoc, collection, where, getDocs, query } from '@firebase/firestore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import db from '../firebase/firebaseInit'
import firebase from '../firebase/firebaseInit'
import { auth } from '../firebase/firebaseInit'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

//variables
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const errMsg = ref("");
const router = useRouter();
const fullscreenLoading = ref(false)

//validate user
const validateUser = async () => {
    if(firstName.value === "" &&
       lastName.value === "" &&
       email.value === "" &&
       password.value === "") {
            errMsg.value = "Please fill out all the fields"
       } else {
            localStorage.setItem("userLoggedIn", true)
            localStorage.setItem("isMessageShown", false)
            console.log("register on the way")
            // localStorage.setItem("profileEmail", email.value)
            // localStorage.setItem("profileEmail", email.value)
            // localStorage.setItem("profileEmail", email.value)
            await registerUser();
            router.push({ name: 'Home'} )
            // await store.dispatch("getCurrentUser")
       }
}

// check auth errors
const checkErrors = (err) => {
    if(err.code === "auth/email-already-in-use") {
        errMsg.value = "Email already in use"
    }else if(err.code === "auth/invalid-email") {
        errMsg.value = "Email is not valid"
    }else if(err.code === "auth/weak-password") {
        errMsg.value = "Password needs to be at least 6 characters"
    }
}

// register user
const registerUser = async () => {
    try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);

        openFullScreen1()

        await addDoc(collection(db, "users"), {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value
        })
    } catch(err) {
        console.log(err.code)
        checkErrors(err)
    }
}

// Add the sign-in with Google button to your app
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

    if(await emailDoesntExist(user)) {
        const displayName = user.displayName;
        const nameArray = displayName.split(' ');
        const firstName = nameArray[0];
        const lastName = nameArray[1];

        await addDoc(collection(db, "users"), {
            firstName: firstName,
            lastName: lastName,
            email: user.email
        })
    }

    localStorage.setItem("userLoggedIn", true);
    localStorage.setItem("isMessageShown", false)
    console.log(user);
    router.push({ name: 'Home'} )
  } catch (error) {
    // Handle errors here
    console.log(error.code)
  }
}

const emailDoesntExist = async (newUser) => {
    const email = newUser.email;
    const usersRef = collection(db, "users");

    // Check if email already exists in Firestore
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    return (snapshot.empty) ? true : false;
}

//loading animation
const openFullScreen1 = () => {
  fullscreenLoading.value = true
  setTimeout(() => {
    fullscreenLoading.value = false
  }, 2000)
}

</script>

<style lang="scss" scoped>
// .right {
//     background: url(../assets/img/background.png);
//     .right-side {
//     position: absolute;
//     background-color: white;
//     transform: skew(-4deg);
//     left: -40px;
//     width: 100px;
//     height: 100%;
//     }
// }


</style>