<template>
    <div class="container mx-auto p-6 py-20">
        <div class="flex">
            <h1 class="text-2xl">My profile</h1>
        </div>
        <el-divider />
        <!-- <div class=" bg-white border-gray-300 rounded-lg">
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
                                        {'status-blue': items.status === 'In progress',
                                        'status-orange': items.status === 'Waiting for pick up',
                                        'status-green': items.status === 'Completed'}]">
                            {{ items.status}}
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
                <el-tab-pane label="Role">Role</el-tab-pane>
                <el-tab-pane label="Task">Task</el-tab-pane>
            </el-tabs>
        </div> -->
        <el-menu
                :default-active="currentTab"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
            >
                <el-menu-item index="1" @click="currentTab = '1'">Repair history</el-menu-item>
                <el-menu-item index="2" @click="currentTab = '2'">Order history</el-menu-item>
                <el-menu-item index="3" @click="currentTab = '3'">Orders</el-menu-item>
            </el-menu>
            <div v-show="isLoaded && currentTab === '1'" v-for="(items, index) in repairItems" :key="index"
                        class="mt-5 px-4 py-2 custom-shadow rounded-lg bg-white">
                        <div class="flex flex-col items-start space-y-2 md:flex-row md:items-center relative">
                            <p class="mt-2">Pick up in <strong> {{ items.pickupDate }}</strong> at <strong>{{ items.pickupTime }}</strong></p>
                            <p :class="['status', 
                                        {'status-blue': items.status === 'In progress',
                                        'status-orange': items.status === 'Waiting for pick up',
                                        'status-green': items.status === 'Completed'}]">
                            {{ items.status}}
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

            <div v-show="isLoaded && currentTab === '2'" class="mt-5">
                <el-table :data="cartItems" stripe style="width: 100%">
                    <el-table-column type="index" width="50" />
                    <el-table-column prop="productName" label="Name" width="180">
                        <template #default="scope">
                            <p>{{ scope.row.firstName }} {{ scope.row.lastName }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="productPrice" label="Price" min-width="180">
                        <template #default="scope">
                            <p>{{ scope.row.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'IDR' }) }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalQty" label="Quantity" align="center" min-width="100"/>
                    <el-table-column label="Delivery Type" min-width="180">
                    <template #default="scope">
                        <el-tag effect="plain" size="large" :type="tagType(scope.row.deliveryType)">{{ scope.row.deliveryType }}</el-tag>
                    </template>
                    </el-table-column>
                    <el-table-column label="" width="150">
                    <template #default="scope">
                        <el-button class="bg-[#409EFF] text-white" size="large" @click="handleEdit(scope.$index, scope.row)">Details</el-button>
                    </template>
                    </el-table-column>
                </el-table>
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
            :active="item.status === 'Waiting for pick up' ? 0 : item.status === 'In progress' ? 1 : item.status === 'Completed' ? 3 : 0">
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
                    <p>Full name : {{ item.repairFirstName }} {{ item.repairLastName }}</p>
                    <p>Email: {{ item.repairEmail }}</p>
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
import { collection, getDocs, updateDoc, query, orderBy, where } from '@firebase/firestore';
import { storage } from '../firebase/firebaseInit';
import { getDownloadURL, ref as storageRef } from '@firebase/storage';


const repairItems = ref([]);
const selectedItem = ref([])
const store = useStore();
const isLoaded = ref(false)
const uid = ref(null)
const currentTab = ref('1');
const centerDialogVisible = ref(null)
const cartItems = ref([])

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



  const getStatus = (item, ref) => {
    const pickupDate = new Date(item.pickupDate);
    const pickupTime = item.pickupTime;
    const pickupDateTime = new Date(`${pickupDate.toDateString()} ${pickupTime}`);
    const currentDate = new Date();

    const timeDifference = currentDate - pickupDateTime
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    
    if (hoursDifference >= 1) {
        updateDoc(ref, {
            status: 'Completed'
        })
    } else if (hoursDifference > 0 && hoursDifference < 1) {
        updateDoc(ref, {
            status: 'In progress'
        })
    }
    repairItems.value.push(item);
}

// const updateStatus = async (uid, hoursDifference) => {
//     const usersRef = collection(db, 'users')
//     const currentUserRef = doc(usersRef, store.state.profileId)
//     const repairCollectionRef = query(collection(currentUserRef, 'repair'), where("uid", "==", uid))
//     // console.log(currentUserRef)
//     const querySnapshot = await getDocs(repairCollectionRef);
//         querySnapshot.forEach(async (doc) => {
//             if (hoursDifference >= 1) {
//                     updateDoc(doc.ref, {
//                     status: 'Completed'
//                 })
//             } else if (hoursDifference > 0 && hoursDifference < 1) {
//                     updateDoc(doc.ref, {
//                     status: 'In progress'
//                 })
//             }
//     });
// }

onMounted(async () => {
  try {
    await Promise.all([getRepairOrder(localStorage.getItem("profileId")), getOrders()]);
    // Both functions have completed
    window.addEventListener('resize', handleResize);

    setTimeout(() => {
      isLoaded.value = true;
    }, 2000);
  } catch (error) {
    // Handle any errors that occurred during the asynchronous operations
    console.error(error);
  }
});


watchEffect(async () => {
    uid.value = store.state.profileId
})

const openDialog = (item) => {
    centerDialogVisible.value = true
    selectedItem.value.push(item)
    console.log(selectedItem.value)
}

const getOrders = async () => {
  const ordersRef = collection(db, 'orders');
  const cartRef = query(ordersRef, where('buyerUid', '==', localStorage.getItem("profileId")));
  const querySnapshot = await getDocs(cartRef);

  querySnapshot.forEach((doc) => {
    cartItems.value.push(doc.data())
    console.log(cartItems.value)
  });
};

// const getProducts = async () => {
//   const cartsRef = collection(db, 'orders');
//   const cartRef = query(cartsRef, where('buyerUid', '==', localStorage.getItem("profileId")));
//   const items = await getDocs(cartRef);

//   try {
//     items.forEach(async (item) => {
//       const itemData = item.data();
//       const imageRef = storageRef(storage, item.data().productImg);
//       const url = await getDownloadURL(imageRef);
//       itemData.productImg = url;
//       cartItems.value.push(itemData);
//     });
//   } catch (err) {
//     console.error(err);
//   }
//   console.log(cartItems.value)
// }

const getDescriptionOne = (item) => {
        return `Order created in: ${item.createdAt}`
}

const getDescriptionTwo = (item) => {
        if(item.status === 'In progress' || item.status === 'Completed') {
            return `Pick up in: ${item.pickupDate} at ${item.pickupTime}`
        }
}

const getDescriptionThree = (item) => {
        if(item.status === 'Completed') {
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
        getStatus(item.data(), item.ref)
    })
    
}

const tagType = (type) => {
    if(type === 'Express') {
        return 'warning'
    }else if(type === 'Next Day') {
        return 'success'
    }else if(type === 'Standard') {
        return ''
    }else {
        return 'info'
    }
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