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
          <div>
              <el-form
  ref="ruleFormRef"
  :model="ruleForm"
  :rules="rules"
  label-width="150px"
  :label-position="labelPosition"
  class="demo-ruleForm"
  :size="formSize"
  status-icon
>
  <el-form-item label="Service Options" prop="repairType">
    <el-radio-group v-model="ruleForm.repairType">
      <el-radio label="Pick up and repair at our office" />
      <el-radio label="Repair at your house" />
    </el-radio-group>
  </el-form-item>

  <el-form-item label="First Name" prop="firstName">
    <el-input v-model="ruleForm.firstName" clearable />
  </el-form-item>
  <el-form-item label="Last Name" prop="lastName">
    <el-input v-model="ruleForm.lastName" clearable />
  </el-form-item>
  <el-form-item label="Email" prop="lastName">
    <el-input v-model="ruleForm.email" clearable />
  </el-form-item>
  <el-form-item label="Phone Number" prop="phoneNumber">
    <el-input v-model.number="ruleForm.phoneNumber" type="text" clearable/>
  </el-form-item>
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
    <el-col :span="11">
      <el-form-item label="District" prop="district">
        <el-input v-model="ruleForm.district" placeholder="Jakarta Barat" clearable />
      </el-form-item>
    </el-col>
    <el-col class="text-center mt-8" :span="2">
      <span class="text-gray-500">-</span>
    </el-col>
    <el-col :span="11">
      <el-form-item label="Postal Code" prop="postalCode">
        <el-input v-model.number="ruleForm.postalCode" placeholder="11210" clearable />
      </el-form-item>
    </el-col>
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
  <el-form-item label="Additional Information">
    <el-input v-model="ruleForm.desc" type="textarea" />
  </el-form-item>
  <div class="flex justify-center mt-10">
      <el-button @click="goBack">Back</el-button>
      <el-button class="bg-blue-500 px-6" type="primary" @click="submitForm(ruleFormRef)">Next</el-button>
  </div>
</el-form>
          </div>
      </div>
  </div>
</template>

<script setup>
import { reactive, ref, watchEffect } from 'vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const formSize = ref('large')
const labelPosition = ref('top')
const ruleFormRef = ref()
const router = useRouter();
const store = useStore();

const ruleForm = reactive({
firstName: '',
lastName: '',
email: '',
phoneNumber: null,
city: '',
address: '',
district:'',
postalCode: null,
// count: '',
// date1: '',
// date2: '',
// delivery: false,
// type: [],
// resource: '',
// desc: '',
repairType: ''
})

watchEffect(() => {
  ruleForm.email = store.state.profileEmail;
  ruleForm.firstName = store.state.profileFirstName;
  ruleForm.lastName = store.state.profileLastName
})

const rules = reactive({
firstName: [
  { required: true, message: 'Please input First Name', trigger: 'blur' },
  { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
],
lastName: [
  { required: true, message: 'Please input Last Name', trigger: 'blur' },
  { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
],
phoneNumber: [
  { type:'number', required: true, message: 'Phone Number must be a number'},
  { type:'number', required: true, message: 'Please input Phone Number', trigger: 'blur' },
],
city: [
  {
    required: true,
    message: 'Please select Activity zone',
    trigger: 'change',
  },
],
address: [
  { required: true, message: 'Please input your address', trigger: 'blur' },
],
district: [
  { required: true, message: 'Please input District', trigger: 'blur' },
],
postalCode: [
  { type:'number', required: true, message: 'Postal Code must be a number'},
  { type:'number', required: true, message: 'Please input Phone Number', trigger: 'blur' },
],
date1: [
  {
    type: 'date',
    required: true,
    message: 'Please pick a date',
    trigger: 'change',
  },
],
date2: [
  {
    required: true,
    message: 'Please pick a time',
    trigger: 'change',
  },
],
repairType: [
  {
    required: true,
    message: 'Please select the service options',
    trigger: 'blur',
  },
],
// desc: [
//   { required: true, message: 'Please input activity form', trigger: 'blur' },
// ],
})

const submitForm = async (formEl) => {
if (!formEl) return
await formEl.validate((valid, fields) => {
  if (valid) {
    console.log('submit!')
    router.push({ name: 'Problems' })
  } else {
    console.log('error submit!', fields)
  }
})
}

const goBack = () => {
router.back()
}

// const resetForm = (formEl) => {
//   if (!formEl) return
//   formEl.resetFields()
// }

// const options = Array.from({ length: 10000 }).map((_, idx) => ({
//   value: `${idx + 1}`,
//   label: `${idx + 1}`,
// }))

</script>