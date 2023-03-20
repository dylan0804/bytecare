<template>
    <div class="container mx-auto p-6 py-20">
        <div class="flex">
            <h1 class="text-2xl">My profile</h1>
        </div>
        <el-divider />
        <div class=" bg-white border-gray-300 rounded-lg">
            <el-tabs type="border-card">
                <el-tab-pane label="My order" class="flex flex-col gap-4">
                    <div v-show="!isLoaded" class="px-4 py-2 rounded-md custom-shadow">
                        <el-skeleton :loading="!isLoaded" animated>
                            <template #template>
                            </template>
                        </el-skeleton>
                    </div>
                    <div v-show="isLoaded" v-for="(items, index) in repairItems" :key="index"
                        class="px-4 py-2 custom-shadow rounded-md">
                        <div class="flex flex-col items-start space-y-2 md:flex-row md:items-center relative">
                            <p class="mt-2">Pick up in <strong> {{ items.pickupDate }}</strong> at <strong>{{ items.pickupTime }}</strong></p>
                            <p :class="['status', 
                                        {'status-blue': getStatus(items) === 'In progress',
                                        'status-orange': getStatus(items) === 'Waiting for pick up',
                                        'status-green': getStatus(items) === 'Completed'}]">
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
                <el-tab-pane label="Settings">Settings</el-tab-pane>
                <!-- <el-tab-pane label="Role">Role</el-tab-pane>
                <el-tab-pane label="Task">Task</el-tab-pane> -->
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
    <div :class="isBelow768 ? 'step-detail-hor' : 'step-detail-vert'">
        <div v-for="(item, index) in selectedItem" :key="index">
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
                    <p>Full name : {{ store.state.repairFirstName }} {{ store.state.repairLastName }}</p>
                    <p>Email: {{ store.state.repairEmail }}</p>
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
    const pickupTime = item.pickupTime;
    const pickupDateTime = new Date(`${pickupDate.toDateString()} ${pickupTime}`);
    const currentDate = new Date();

    const timeDifference = currentDate - pickupDateTime
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    updateStatus(item.uid, hoursDifference);
    
    if (hoursDifference >= 1) {
        return 'Completed';
    } else if (hoursDifference > 0 && hoursDifference < 1) {
        return 'In progress';
    } else {
        return 'Waiting for pick up';
    }
}

const updateStatus = async (uid, hoursDifference) => {
    const usersRef = collection(db, 'users')
    const currentUserRef = doc(usersRef, store.state.profileId)
    const repairCollectionRef = query(collection(currentUserRef, 'repair'), where("uid", "==", uid))
    // console.log(currentUserRef)
    const querySnapshot = await getDocs(repairCollectionRef);
        querySnapshot.forEach(async (doc) => {
            if (hoursDifference >= 1) {
                    updateDoc(doc.ref, {
                    status: 'Completed'
                })
            } else if (hoursDifference > 0 && hoursDifference < 1) {
                    updateDoc(doc.ref, {
                    status: 'In progress'
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
        return `Order created in: ${item.createdAt}`
}

const getDescriptionTwo = (item) => {
        if(getStatus(item) === 'In progress' || getStatus(item) === 'Completed') {
            return `Pick up in: ${item.pickupDate} at ${item.pickupTime}`
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
            return `Order completed in: ${item.pickupDate} at ${newTime}`
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

.step-detail-hor {
    display: flex;
    flex-direction: column;
    gap: 3.5rem;
}
.step-detail-vert {
    display: flex;
    gap: 8rem;
}

.step-detail-height {
    height: 500px;
}

.status {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem/* 14px */;
    line-height: 1.25rem/* 20px */;
    border-radius: 9999px;
    margin-left: auto;
    margin-right: 1rem;
    color: white;

    @media (max-width: 767px) {
        margin-right: auto;
        margin-left: 0;
    }
 }

 .status-blue {
    background-color: #1E90FF;
 }
 .status-orange {
    background-color: #FF8C00;
 }
 .status-green {
    background-color: green;
 }

 .custom-shadow {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
 }
</style>