<template>
  <div class="container mx-auto p-6 py-20">
      <div class="flex border-2 rounded-xl shadow-md py-6 px-4 md:p-10 flex-col mx-auto space-y-10 lg:w-3/4 w-full bg-white">
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
  <el-form-item label="Schedule the pickup time" required>
      <el-col :span="11">
        <el-form-item prop="date1">
          <el-date-picker
            v-model="ruleForm.date1"
            type="date"
            :disabled-date="disabledDate"
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
            start="08:00"
            step="00:15"
            end="23:00"
            placeholder="Pick a time"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-form-item>
  <el-form-item label="Describe your problem" prop="problem">
      <el-input maxlength="100" show-word-limit v-model="ruleForm.problem" type="textarea" />
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
import { reactive, ref } from 'vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const formSize = ref('large')
const labelPosition = ref('top')
const ruleFormRef = ref()
const router = useRouter();
const store = useStore();

const ruleForm = reactive({
  deviceType: store.state.deviceType,
  operatingSystem: store.state.operatingSystem,
  problem: store.state.problem,
  date1: store.state.pickupDate,
  date2: store.state.pickupTime,
  repairType: store.state.serviceType
})

const rules = reactive({
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
  ],
  })

const submitForm = async (formEl) => {
if (!formEl) return
await formEl.validate((valid, fields) => {
  if (valid) {
    console.log('submit!')
    store.commit("getProblemInfo", ruleForm)
    router.push({ name: 'Summary' })
  } else {
    console.log('error submit!', fields)
  }
})
}

const disabledDate = (time) => {
  return time.getTime() > Date.now();
};

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