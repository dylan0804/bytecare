<template>
  <div class="container mx-auto p-6 py-10">
    <div class="flex flex-col-reverse items-center md:flex-row">
      <div class="md:w-1/2 md:items-start ml-0 lg:ml-20 flex flex-col items-center">
        <h1 class="text-5xl font-bold text-center max-w-md md:text-left">Enhance Your Computer with Quality Parts</h1>
        <p class="max-w-md mt-10 text-center text-darkGrayishBlue md:text-left">Maximize your computer's performance with our premium selection of accessories. Shop now for unbeatable prices and top-quality products.</p>
        <router-link :to="{ name: 'Shop' }" class="mt-10 p-2 px-6 text-white bg-gradient-to-l from-blue-500 to-blue-600 rounded-full">Browse now</router-link>
      </div>
      <div class="md:w-1/2">
        <img src="../assets/img/shopping.png" alt="">
      </div>
    </div>
    <div class="flex flex-col-reverse items-center mt-10 md:mt-0 md:flex-row-reverse">
      <div class="md:w-1/2 md:items-start flex flex-col items-center xl:ml-52 md:ml-20">
        <h1 class="text-5xl font-bold text-center max-w-md md:text-left">Your computer's second chance</h1>
        <p class="max-w-md mt-10 text-center text-darkGrayishBlue md:text-left">Your go-to destination for professional and affordable computer repair services to keep your technology running smoothly.</p>
        <router-link :to="{ name: 'Repair' }" class="mt-10 p-2 px-6 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">Book Appointment</router-link>
      </div>
      <div class="md:w-1/2">
       <img class="min-w-[400px]" src="../assets/img/computer.png" alt="">
      </div>
    </div>
  </div>
  <div :class="[!isLoggedIn ? 'color-transition-2' : 'color-transition']">
    <div :class="[isLoggedIn ? 'except container mx-auto' : 'container mx-auto px-6']">
    <div class="flex flex-col bg-white mx-auto p-6 shadow-2xl space-y-6 rounded-lg md:flex-row md:space-x-4 md:space-y-0">
      <div class="flex flex-col gap-5">
        <i class="fa-solid fa-screwdriver-wrench text-5xl"></i>
        <h2 class="font-semibold">Repair services</h2>
        <p>Fast turnaround times and competitive pricing for repairs.</p>
      </div>
      <span class="vertical-line bg-gray-300"></span>
      <div class="flex flex-col gap-5">
        <i class="fa-solid fa-gears text-5xl"></i>
        <h2 class="font-semibold">Buy parts</h2>
        <p>Wide range of competitively priced computer parts and accessories.</p>
      </div>
      <span class="vertical-line bg-gray-300"></span>
      <div class="flex flex-col gap-5">
        <i class="fa-solid fa-user-shield text-5xl"></i>
        <h2 class="font-semibold">Excellent service</h2>
        <p>Excellent customer service to help you every step of the way.</p>
      </div>
    </div>

    <div v-if="!isLoggedIn" class="text-white flex flex-col text-center space-y-14 justify-between items-center py-20 md:space-y-0 md:flex-row md:text-left">
      <h2 class=" text-4xl font-light max-w-xs">QUALITY PARTS, QUALITY REPAIRS. REGISTER FOR YOUR FREE ACCOUNT TODAY!</h2>
      <router-link :to="{ name: 'Register' }" class="text-xl font-light bg-white text-black rounded-full p-2 px-6">Register for Bytecare &#8594;</router-link>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';

const isLoggedIn = ref(null)

onMounted(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn");
    if (userLoggedIn === 'true') {
      console.log("User is logged in!");
    } else {
      console.log("User is not logged in!");
    }
}),

watchEffect(() => {
  const userLoggedIn = localStorage.getItem("userLoggedIn");
  isLoggedIn.value = userLoggedIn === "true";
});

</script>

<style lang="scss" scoped>
.vertical-line {
  width: 2px;

  @media(max-width: 767px) {
    height: 2px;
    width: 100%;
  }
}

.color-transition {
  background-image: linear-gradient(to bottom, #f4f6f8 0%, #f4f6f8 40%,
  #387ff5 40%, #387ff5 100%);
}

.color-transition-2 {
  background-image: linear-gradient(to bottom,  #f4f6f8 0%, #f4f6f8 20%,
  #387ff5 20%, #387ff5 100%);
}


.except {
  padding: 2rem 1.5rem;
  padding-bottom: 8rem;
}

</style>