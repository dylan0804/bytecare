<template>
  <div class="container mx-auto p-6 py-20">
      <div class="flex border-2 rounded-xl shadow-md p-6 md:p-10 flex-col mx-auto space-y-10 md:w-3/4 w-full">
          <div>
              <el-steps :active="2" align-center>
                  <el-step title="Contact Information" />
                  <el-step title="Problem Description" />
                  <el-step title="Summary" />
              </el-steps>
          </div>
          <el-divider />

          <!-- contact information -->
          <div class="p-5 border-2 border-dashed border-gray-300 rounded-lg" >
            <div class="flex justify-between">
              <h1 class="text-md">Contact Information</h1>
              <p @click="disableFormOne" class="text-blue-500 hover:cursor-pointer">Edit</p>
            </div>
            <el-divider />
            <el-form
    ref="ruleFormRefOne"
    :model="ruleForm"
    :rules="rules"
    label-width="150px"
    :label-position="labelPosition"
    class="demo-ruleForm"
    :size="formSize"
    :disabled="isDisabledOne"
    status-icon
  >

    <div class="flex items-center justify-between space-x-6 flex-1">
      <el-form-item class="w-full" label="First Name" prop="firstName">
      <el-input v-model="ruleForm.firstName" clearable />
    </el-form-item>
    <el-form-item class="w-full" label="Last Name" prop="lastName">
      <el-input v-model="ruleForm.lastName" clearable />
    </el-form-item>
    </div>
      <div class="flex items-center justify-between space-x-6 flex-1">
        <el-form-item class="w-full" label="Email" prop="email">
          <el-input v-model="ruleForm.email" clearable />
        </el-form-item>
        <el-form-item class="w-full" label="Phone Number" prop="phoneNumber">
          <el-input v-model="ruleForm.phoneNumber" type="text" clearable/>
        </el-form-item>
      </div>
    <el-form-item label="City" prop="city">
      <el-select v-model="ruleForm.city" placeholder="Please select your city">
        <el-option label="Jakarta" value="Jakarta" />
        <el-option label="Bogor" value="Bogor" />
        <el-option label="Depok" value="Depok" />
        <el-option label="Tangerang" value="Tangerang" />
        <el-option label="Bekasi" value="Bekasi" />
      </el-select>
    </el-form-item>
    <el-form-item label="Address" prop="address">
      <el-input v-model="ruleForm.address" clearable />
    </el-form-item>
    <el-form-item required>
      <el-col :span="12">
        <el-form-item label="District" prop="district">
          <el-input v-model="ruleForm.district" placeholder="Jakarta Barat" clearable />
        </el-form-item>
      </el-col>
      <el-col class="text-center mt-8" :span="1">
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-form-item  label="Postal Code" prop="postalCode">
          <el-input v-model.number="ruleForm.postalCode" placeholder="11210" clearable />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="Additional Information">
      <el-input v-model="ruleForm.desc" type="textarea" />
    </el-form-item>
  </el-form>
          </div>

          <!-- problem description -->
          <div class="p-5 border-2 border-dashed border-gray-300 rounded-lg" >
            <div class="flex justify-between">
              <h1 class="text-md">Problem Description</h1>
              <p @click="disableFormTwo" class="text-blue-500 hover:cursor-pointer">Edit</p>
            </div>
            <el-divider />
            <el-form
  ref="ruleFormRefTwo"
  :model="ruleForm"
  :rules="rules"
  label-width="150px"
  :label-position="labelPosition"
  class="demo-ruleForm"
  :size="formSize"
  :disabled="isDisabledTwo"
  status-icon
>

<el-form-item label="Service Options" prop="repairType">
      <el-radio-group v-model="ruleForm.repairType">
        <el-radio label="Pick up and repair at our office" />
        <el-radio label="Repair at your house" />
      </el-radio-group>
    </el-form-item>
  <el-form-item label="Device Type" prop="deviceType">
    <el-radio-group v-model="ruleForm.deviceType">
      <el-radio label="Desktop" />
      <el-radio label="Laptop" />
    </el-radio-group>
  </el-form-item>
  <el-form-item label="Operating System" prop="operatingSystem">
    <el-select v-model="ruleForm.operatingSystem" placeholder="Select your operating system">
      <el-option label="Windows" value="Windows" />
      <el-option label="macOS" value="macOS" />
      <el-option label="Linux" value="Linux" />
    </el-select>
  </el-form-item>
  <el-form-item v-if="ruleForm.repairType === 'Pick up and repair at our office'" label="Pickup time" required>
      <el-col :span="11">
        <el-form-item prop="date1">
          <el-date-picker
            v-model="ruleForm.date1"
            type="date"
            label="Pick a date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col class="text-center" :span="2">
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-form-item prop="date2">
          <el-time-select
            v-model="ruleForm.date2"
            start="10:00"
            step="00:15"
            end="17:00"
            placeholder="Pick a time"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-form-item>
  <el-form-item label="Describe your problem" prop="problem">
      <el-input maxlength="100" show-word-limit v-model="ruleForm.problem" type="textarea" />
    </el-form-item>
</el-form>
          </div>
          <div class="flex justify-center mt-10">
        <el-button @click="goBack">Back</el-button>
        <el-button class="bg-blue-500 px-6" type="primary" @click="submitForm(ruleFormRefOne, ruleFormRefTwo)">Confirm Order</el-button>
    </div>
      </div>
  </div>

  <!-- modal -->
  <el-dialog
    v-model="centerDialogVisible"
    v-loading="loading"
    width="30%"
    :before-close="handleClose"
    align-center
    center
  >
  <el-result
        icon="success"
        title="Your order has been received!"
        sub-title="You can view your order details in your profile page"
      >
        <template #extra>
          <el-button v-loading.fullscreen.lock="fullscreenLoading" @click="addOrder">Return to Home</el-button>
          <el-button class="bg-blue-500 px-6" v-loading.fullscreen.lock="fullscreenLoading" @click="addOrder" type="primary">View Profile</el-button>
        </template>
      </el-result>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watchEffect } from 'vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import firebase from '../firebase/firebaseInit'
import db from '../firebase/firebaseInit';
import { addDoc, collection, getDocs, query, where } from '@firebase/firestore';


const formSize = ref('large')
const labelPosition = ref('top')
const ruleFormRefOne = ref()
const ruleFormRefTwo = ref()
const isDisabledOne = ref(true)
const isDisabledTwo = ref(true)
const centerDialogVisible = ref(false)
const fullscreenLoading = ref(false)
const router = useRouter();
const store = useStore();

const ruleForm = reactive({
  // contact information
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: store.state.phoneNumber,
  city: store.state.city,
  address: store.state.address,
  district: store.state.district,
  postalCode: store.state.postalCode,
  desc: store.state.additionalInfo,

  // problem desc
  deviceType: store.state.deviceType,
  operatingSystem: store.state.operatingSystem,
  problem: store.state.problem,
  date1: store.state.pickupDate,
  date2: store.state.pickupTime,
  repairType: store.state.serviceType
})

watchEffect(() => {
    ruleForm.email = store.state.profileEmail;
    ruleForm.firstName = store.state.profileFirstName;
    ruleForm.lastName = store.state.profileLastName
})

const validatePhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please input your phone number'));
  } else if (isNaN(value)) {
    callback(new Error('Phone number must be a number'));
  } else {
    callback();
  }
};

const openFullScreen1 = () => {
  fullscreenLoading.value = true
  setTimeout(() => {
    fullscreenLoading.value = false
  }, 1000)
}

const disableFormOne = () => {
  isDisabledOne.value = !isDisabledOne.value
}

const disableFormTwo = () => {
  isDisabledTwo.value = !isDisabledTwo.value
}

const checkFormOne = (formEl) => {
  if (!formEl) return false
  return new Promise((resolve, reject) => {
    formEl.validate((valid, fields) => {
      if (valid) {
        console.log('submit!')
        store.commit("getContactInfo", ruleForm)
        resolve(true)
      } else {
        console.log('error submit!', fields)
        resolve(false)
      }
    })
  })
}


const checkFormTwo = (formEl) => {
  if (!formEl) return false
  return new Promise((resolve, reject) => {
    formEl.validate((valid, fields) => {
      if (valid) {
        console.log('submit!')
        store.commit("getProblemInfo", ruleForm)
        resolve(true)
      } else {
        console.log('error submit!', fields)
        resolve(false)
      }
    })
  })
}

const submitForm = async (ruleFormRefOne, ruleFormRefTwo) => {
  const isFormOneCorrect = await checkFormOne(ruleFormRefOne)
  const isFormTwoCorrect = await checkFormTwo(ruleFormRefTwo)

  console.log(isFormOneCorrect, isFormTwoCorrect)

  if(isFormOneCorrect && isFormTwoCorrect) {
    store.commit("getContactInfo", ruleForm)
    store.commit("getProblemInfi", ruleForm)
    centerDialogVisible.value = true
  }
}

const addOrder = async () => {
  const user = localStorage.getItem("userLoggedIn");
  if(user === 'true') {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", store.state.profileEmail));
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(async(doc) => {
      const subCollectionRepair = collection(doc.ref, 'repair');

      openFullScreen1();

      await addDoc(subCollectionRepair, {
        serviceType: store.state.serviceType,
        phoneNumber: store.state.phoneNumber,
        city: store.state.city,
        address: store.state.address,
        district: store.state.district,
        postalCode: store.state.postalCode,
        pickupDate: store.state.pickupDate,
        pickupTime: store.state.pickupTime,
        additionalInfo: store.state.additionalInfo,

        deviceType: store.state.deviceType,
        operatingSystem: store.state.operatingSystem,
        problem: store.state.problem
      })
    })
    centerDialogVisible.value = false
    setTimeout(() => {
      router.push({ name: 'Home' })
    }, 1000)
  }
}

const handleClose = () => {
  router.push({ name: 'Home' })
}

const goBack = () => {
  router.back();
}

const rules = reactive({
  // contact information
  firstName: [
    { required: true, message: 'Please input your first name'},
    { min: 3, message: 'First name must be longer than 3 characters'},
  ],
  lastName: [
    { required: true, message: 'Please input last name'},
    { min: 3, message: 'Last name must be longer than 3 characters'},
  ],
  email: [
    { required: true, message: 'Please input your email'},
  ],
  phoneNumber: [
    { validator: validatePhone, required: true},
    { required: true, message: 'Please input your phone number'},
  ],
  city: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ],
  address: [
    { required: true, message: 'Please input your address'},
  ],
  district: [
    { required: true, message: 'Please input District'},
  ],
  postalCode: [
    { type:'number', required: true, message: 'Postal Code must be a number'},
    { type:'number', required: true, message: 'Please input Phone Number'},
  ],
 
  // problem description

  repairType: [
    {
      required: true,
      message: 'Please select the service options',
    },
  ],
  deviceType: [
  {
    required: true,
    message: 'Please select your device type',
  },
],
  operatingSystem: [
    {
      required: true,
      message: 'Please select your operating system',
    },
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
    },
  ],
  date2: [
    {
      required: true,
      message: 'Please pick a time',
    },
  ],
  problem: [
    { required: true, message: 'Please describe your problem' },
  ]
})
</script>