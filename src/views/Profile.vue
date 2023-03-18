<template>
    <div class="container mx-auto p-6 py-20">
        <div class="flex">
            <h1 class="text-2xl">My profile</h1>
        </div>
        <el-divider />
        <div class=" bg-white border-gray-300 rounded-lg">
            <el-tabs type="border-card">
                <el-tab-pane label="My order" class="flex flex-col gap-4">
                    <div v-show="!isLoaded" class="border-2 px-4 py-3 border-gray-300 shadow-sm rounded-md">
                        <el-skeleton :loading="!isLoaded" animated>
                            <template #template>
                            </template>
                        </el-skeleton>
                    </div>
                    <div v-show="isLoaded" v-for="(items, index) in repairItems" :key="index"
                        class="border-2 px-4 py-2 border-gray-300 shadow-sm rounded-md">
                        <div class="flex flex-col items-start space-y-2 md:flex-row md:items-center relative">
                            <p class=" mt-2">Pick up at <strong> {{ items.pickupDate }}</strong> at <strong>{{ items.pickupTime }}</strong></p>
                            <p :class="['text-sm px-3 py-1 rounded-full text-white ml-0 md:ml-auto md:mr-5', 
                                        {'bg-blue-500': getStatus(items) === 'In progress',
                                        'bg-orange-500': getStatus(items) === 'Waiting for pick up',
                                        'bg-green-600': getStatus(items) === 'Completed'}]">
                            {{ getStatus(items) }}
                            </p>
                            <el-dropdown :hide-on-click="false" class="absolute top-0 right-0">
                                <i class="text-2xl fa-solid fa-ellipsis-vertical cursor-pointer outline-none"></i>
                                <template #dropdown>
                                    <el-dropdown-menu class="w-[150px] font-medium">
                                        <el-dropdown-item @click="openDialog(items)">Order details</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                        <el-divider/>
                        <p>Service Type: {{ items.serviceType }}</p>
                        <p>Device: {{ items.deviceType }}</p>
                        <p class=" text-gray-500 mt-5">Order ID: {{ items.uid }}</p>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="Config">Config</el-tab-pane>
                <el-tab-pane label="Role">Role</el-tab-pane>
                <el-tab-pane label="Task">Task</el-tab-pane>
            </el-tabs>
        </div>
    </div>

    <!-- modal -->
    <el-dialog
    v-model="centerDialogVisible"
    :before-close="closeDialog"
    width="800px"
    height="500px"
    align-center
    >
    <div :class="isBelow768 ? 'flex flex-col gap-14' : 'flex gap-32'">
        <div v-for="(item, index) in selectedItem" :key="index" :class="isBelow768 ? '' : 'h-[500px]'">
            <el-steps :direction="isBelow768 ? 'horizontal' : 'vertical'" 
            :active="getStatus(item) === 'Waiting for pick up' ? 0 : getStatus(item) === 'In progress' ? 1 : getStatus(item) === 'Completed' ? 3 : 0">
            <el-step title="Waiting for pick up" :description="getDescriptionOne(item)"/>
            <el-step title="In progress" :description="getDescriptionTwo(item)"/>
            <el-step title="Order completed" :description="getDescriptionThree(item)" />
            </el-steps>
        </div>
        <div v-for="(item, index) in selectedItem" :key="index" class="flex flex-col space-y-10">
            <div>
                <h1 class="font-bold text-xl">Contact Information</h1>
                <el-divider />
                <div>
                    <p>Full name : {{ store.state.profileFirstName }} {{ store.state.profileLastName }}</p>
                    <p>Email: {{ store.state.profileEmail }}</p>
                    <p>Phone number: {{ item.phoneNumber }}</p>
                    <p>City: {{ item.city }}</p>
                    <p>Address: {{ item.address }}</p>
                    <p>District: {{ item.district }}</p>
                    <p>Postal code: {{ item.postalCode }}</p>
                </div>
            </div>
            <div>
                <h1 class="font-bold text-xl">Problem Description</h1>
                <el-divider />
                <div>
                    <p>Pick up schedule: {{ item.pickupDate }} at {{ item.pickupTime }}</p>
                    <p>Service type: {{ item.serviceType }}</p>
                    <p>Operating system: {{ item.operatingSystem }}</p>
                    <p>Device type: {{ item.deviceType }}</p>
                    <p>Problem: {{ item.problem }}</p>
                </div>
            </div>
      </div>

    </div>
    <template #footer>
        <el-button class="bg-blue-500" type="primary" @click="closeDialog">
          Close
        </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import firebase from '../firebase/firebaseInit'
import db from '../firebase/firebaseInit';
import { onMounted, watchEffect } from 'vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { collection, getDocs, updateDoc, doc, query, where, orderBy } from '@firebase/firestore';


const repairItems = ref([]);
const selectedItem = ref([])
const store = useStore();
const isLoaded = ref(false)
const uid = ref(null)
const centerDialogVisible = ref(null)

const windowSize = ref({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const isBelow768 = ref(windowSize.value.width < 768)

  const handleResize = () => {
    windowSize.value = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    isBelow768.value = windowSize.value.width < 768
  }



  const getStatus = (item) => {

    const pickupDate = new Date(item.pickupDate);
    const targetTime = item.pickupTime
    const currentDate = new Date()
    const targetDate = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate());
    
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    updateStatus(item.uid, targetDate, currentDate, targetTime, currentTime);
    
    if (targetDate <= currentDate && targetTime < currentTime && !oneHour(targetTime)) {
        return 'In progress';
    } else if(targetDate <= currentDate && targetTime < currentTime && oneHour(targetTime))  {
        return 'Completed';
    }
    else {
        return 'Waiting for pick up';
    }
}

const oneHour = (givenTime) => {
  const [hours, minutes] = givenTime.split(':');
  const givenDate = new Date();
  givenDate.setHours(hours, minutes, 0, 0);

  const now = new Date();
  return (now.getTime() - givenDate.getTime() >= 60 * 60 * 1000) ? true : false;
}

const updateStatus = async (uid, targetDate, currentDate, targetTime, currentTime) => {
    const usersRef = collection(db, 'users')
    const currentUserRef = doc(usersRef, store.state.profileId)
    const repairCollectionRef = query(collection(currentUserRef, 'repair'), where("uid", "==", uid))
    // console.log(currentUserRef)
    const querySnapshot = await getDocs(repairCollectionRef);
        querySnapshot.forEach(async (doc) => {
            if (targetDate <= currentDate && targetTime < currentTime && !oneHour(targetTime)) {
                updateDoc(doc.ref, {
                    status: 'In progress'
                })
            } else if(targetDate <= currentDate && targetTime < currentTime && oneHour(targetTime))  {
                updateDoc(doc.ref, {
                    status: 'Completed'
                })
            }
    });
}

onMounted(async () => {
    if(uid.value) {
        await getRepairOrder(uid.value);
    }

    window.addEventListener('resize', handleResize)

    setTimeout(() => {
        isLoaded.value = true
    }, 2500)
})

watchEffect(async () => {
    uid.value = store.state.profileId

    if(uid.value) {
        await getRepairOrder(uid.value)
    }
})

const openDialog = (item) => {
    centerDialogVisible.value = true
    selectedItem.value.push(item)
    console.log(selectedItem.value)
}

const getDescriptionOne = (item) => {
        return `Order created at: ${item.createdAt}`
}

const getDescriptionTwo = (item) => {
        if(getStatus(item) === 'In progress' || getStatus(item) === 'Completed') {
            return `Pick up at: ${item.pickupDate} at ${item.pickupTime}`
        }
}

const getDescriptionThree = (item) => {
        if(getStatus(item) === 'Completed') {
            const time = new Date()
            const [hours, minutes] = item.pickupTime.split(':');
            // set the hours and minutes of the given time using the parsed values
            time.setHours(parseInt(hours, 10) + 1, parseInt(minutes, 10));
            // format the new time as a string in "HH:mm" format
            const newTime = time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            return `Order completed at: ${item.pickupDate} at ${newTime}`
        }
}

const closeDialog = () => {
    centerDialogVisible.value = false;
    selectedItem.value.length = 0
}

const getRepairOrder = async (uid) => {
    const repairRef = collection(db, 'users', uid, 'repair');
    const q = query(repairRef, orderBy('status', 'desc'));
    const getItems = await getDocs(q);

    getItems.forEach((item) => {
        repairItems.value.push(item.data());
    })
}
</script>

<style lang="scss" scoped>
</style>