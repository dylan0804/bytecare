<template>
  <div class="container mx-auto p-6 py-20">
      <div class="flex border-2 rounded-xl shadow-md p-6 md:p-10 flex-col mx-auto space-y-10 md:w-3/4 w-full">
          <div>
              <el-steps :active="1" align-center>
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
  <el-form-item label="Device Type" prop="deviceType">
    <el-radio-group v-model="ruleForm.deviceType">
      <el-radio label="Desktop" />
      <el-radio label="Laptop" />
    </el-radio-group>
  </el-form-item>
  <el-form-item label="Operating System" prop="OS">
    <el-select v-model="ruleForm.OS" placeholder="Select your operating system">
      <el-option label="Windows" value="Windows" />
      <el-option label="macOS" value="macOS" />
      <el-option label="Linux" value="Linux" />
    </el-select>
  </el-form-item>
  <el-form-item label="Describe your problem" prop="problem">
    <el-input maxlength="100" show-word-limit v-model="ruleForm.problem" type="textarea" clearable/>
  </el-form-item>
  <div class="flex justify-center mt-10">
      <el-button @click="goBack()">Back</el-button>
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
  count: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  problem: '',
  deviceType: '',
  OS: '',
})

const rules = reactive({
  deviceType: [
  {
    required: true,
    message: 'Please select your device type',
    trigger: 'blur',
  },
],
OS: [
  {
    required: true,
    message: 'Please select your operating system',
    trigger: 'change',
  },
],
problem: [
  { required: true, message: 'Please describe your problem', trigger: 'blur' },
],
})

const submitForm = async (formEl) => {
if (!formEl) return
await formEl.validate((valid, fields) => {
  if (valid) {
    console.log('submit!')
    router.push({ name: 'Summary' })
  } else {
    console.log('error submit!', fields)
  }
})
}

const goBack = () => {
  router.back()
}

// const resetForm = (formEl) => {
// if (!formEl) return
// formEl.resetFields()
// }

// const options = Array.from({ length: 10000 }).map((_, idx) => ({
//   value: `${idx + 1}`,
//   label: `${idx + 1}`,
// }))

</script>