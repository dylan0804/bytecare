<template>
    <div class="container mx-auto p-6 py-20">
        <div class="flex border-2 rounded-xl shadow-lg p-6 md:p-10 flex-col mx-auto space-y-10 md:w-3/4 w-full">
            <div>
                <el-steps :active="0" align-center>
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
  phoneNumber: store.state.phoneNumber,
  city: store.state.city,
  address: store.state.address,
  district: store.state.district,
  postalCode: store.state.postalCode,
  desc: store.state.additionalInfo,
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

const rules = reactive({
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
 
  // desc: [
  //   { required: true, message: 'Please input activity form'},
  // ],
})

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      store.commit("getContactInfo", ruleForm)
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