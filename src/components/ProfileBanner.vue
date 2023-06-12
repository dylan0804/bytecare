<template>
    <div class="profile-banner flex flex-col items-start p-4 md:px-6 lg:items-center gap-10 lg:flex-row md:h-[260px] lg:h-[150px]">
        <div class="flex justify-start mt-4 lg:mt-0">
            <img src="../assets/img/nav_profile.svg" class="w-[80px] h-auto items-center" alt="">
            <div class="md:ml-8 ml-3 flex flex-col justify-evenly text-lg">
                <p>Hello, <strong class=" font-semibold">{{ firstName }}</strong> </p>
                <p>{{ email }}</p>
            </div>
        </div>
        <div class="lg:ml-auto flex flex-col gap-2 md:flex-row bg-white text-black items-center p-4 rounded-lg">
            <div class="flex gap-2 items-center">
                <div>
                <p class=" text-gray-500">Completed Repairs</p>
                <p>{{ store.state.completedRepairs || '-' }}</p>
                </div>
                <el-divider direction="vertical" class="h-[60px]" />
                <div>
                    <p class=" text-gray-500">Ongoing Repairs</p>
                    <p>{{ store.state.ongoingRepairs || '-' }}</p>
                </div>
            </div>
            <el-divider direction="vertical" class="h-[60px] hidden md:block" />
            <hr class="bg-black" />
            <div class="flex gap-2 items-center">
                <div>
                <p class=" text-gray-500">Ongoing Orders</p>
                <p>{{ store.state.ongoingOrders || '-' }}</p>
                </div>
                <el-divider direction="vertical" class="h-[60px]" />
                <div>
                    <p class=" text-gray-500">Completed Orders</p>
                    <p>{{ store.state.completedOrders || '-' }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore()

const firstName = computed(() => {
   return localStorage.getItem('profileFirstName')
})

const email = computed(() => {
    return localStorage.getItem('profileEmail')
})

// const lastName = computed(() => {
//    return localStorage.getItem('profileLastName')
// })

</script>

<style lang="scss" scoped>
    .profile-banner {
        // height: 150px;
        border-radius: 10px;
        background-image: url('../assets/img/profile-banner-bg.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        color: white;
    }
</style>

