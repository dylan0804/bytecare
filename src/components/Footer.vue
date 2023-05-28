<template>
        <footer class="container mx-auto p-6">
            <hr>
            <div class="mt-10">
                <div class="flex flex-col justify-between space-y-10 md:flex-row md:space-y-0">
                    <h1 class="text-3xl">Bytecare</h1>
                    <div class="flex flex-col space-y-6 text-darkGrayishBlue">
                        <h2 class="text-2xl font-medium text-black">My Account</h2>
                        <router-link v-if="userLoggedIn === 'true'" :to="{ name: 'Register' }">Sign in / Register</router-link>
                        <router-link :to="{ name: 'Cart' }">My cart</router-link>
                        <router-link :to="{ name: 'Wishlist' }">My wishlist</router-link>
                    </div>
                    <div>
                        <h2 class="text-2xl font-medium">Contact Us</h2>
                    </div>
                </div>
            </div>
        </footer>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn");
})

</script>

<style lang="scss" scoped>
footer {
    margin-top: auto;
}
</style>