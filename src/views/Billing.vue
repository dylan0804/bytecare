<template>
    <div class="container mx-auto p-6 py-20 affix-container">
        <h1 class="text-2xl">Billing details</h1>
        <div class="flex lg:space-x-24">
            <div class="flex-col flex-1 mt-10">
                <el-form
                    ref="ruleFormRef"
                    :label-position="labelPosition"
                    label-width="100px"
                    :model="billingDetails"
                    :rules="rules"
                    size="large"
                    status-icon
                >
                    <div class="flex flex-col w-full xl:flex-row xl:space-x-6">
                        <el-form-item class="w-full" label="First Name" prop="firstName">
                        <el-input v-model="billingDetails.firstName" />
                        </el-form-item>
                        <el-form-item class="w-full" label="Last Name">
                        <el-input v-model="billingDetails.lastName" />
                        </el-form-item>
                    </div>
                    <el-form-item label="Email" prop="email">
                    <el-input v-model="billingDetails.email" />
                    </el-form-item>
                    <el-form-item label="Address" prop="address">
                    <el-input v-model="billingDetails.address" />
                    </el-form-item>
                <h1 class="text-2xl mt-20">Payment method</h1>
                    <div class="flex flex-col gap-4 mt-5">
                        <label :class="{'border-blue-400': paymentMethod === 'Credit Card', 'border-2 p-4 rounded-lg flex items-center gap-2': true}">
                            <input type="radio" name="checkbox" value="Credit Card" v-model="paymentMethod">
                            Credit Card
                            <img class="h-[30px] ml-auto" src="../assets/img/Daco_5143969.png" alt="">
                        </label>
                        <div v-show="paymentMethod === 'Credit Card'" class="flex flex-col p-5 rounded-lg border-dashed border-2 border-gray-300 max-w-lg bg-[#edf2f7]">
                            <p>Card Number</p>
                                <div class="relative">
                                  <el-input
                                    v-model="billingDetails.cardNumber"
                                    class="mt-2"
                                    size="large"
                                    placeholder="Card number"
                                    maxlength="16"
                                    clearable
                                    @input="handleChange"
                                  >
                                  </el-input>
                                  <img v-show="mastercard" class="absolute w-[35px] h-auto top-[17px] right-9" src="../assets/img/mastercard.png" alt="">
                                  <img v-show="visa" class="absolute w-[35px] h-auto top-[22px] right-9" src="../assets/img/visa.png" alt="">
                                  <img v-show="amex" class="absolute w-[35px] h-auto top-[10px] right-9" src="../assets/img/amex.png" alt="">
                                  <img v-show="discover" class="absolute w-[35px] h-auto top-[10px] right-9" src="../assets/img/discover.png" alt="">
                                </div>
                                <p class="mt-2 font-light text-sm text-red-500">{{ ccWarning }}</p>
                            <div class="mt-4 w-full flex flex-col xl:flex-row gap-2">
                                <div class="w-full">
                                    <p>Expiration Date</p>
                                        <el-date-picker
                                        v-model="billingDetails.expirationDate"
                                        class="mt-2"
                                        type="month"
                                        placeholder="Pick a month and year"
                                        size="large"
                                        :disabled-date="disabledDate"
                                                                        />
                                    <p class="mt-2 font-light text-sm text-red-500">{{ dateWarning }}</p>
                                </div>
                                <div class="w-full">
                                    <div class="flex items-center space-x-1">
                                        <p>CVV</p>
                                        <el-tooltip content="3-digits at the back of your credit card" placement="top" effect="dark">
                                            <i class="fa-sharp fa-regular fa-circle-question"></i>
                                        </el-tooltip>
                                    </div>
                                        <el-input
                                            v-model="billingDetails.cvv"
                                            class="mt-2"
                                            type="password"
                                            size="large"
                                            placeholder="CVV"
                                            maxlength="3"
                                            clearable
                                        >
                                        </el-input>
                                        <p class="mt-2 font-light text-sm text-red-500">{{ cvvWarning }}</p>
                                </div>
                            </div>
                        </div>
                        <label :class="{'border-blue-400': paymentMethod === 'PayPal', 'border-2 p-4 rounded-lg flex items-center gap-2': true}">
                            <input type="radio" name="checkbox" value="PayPal" v-model="paymentMethod">
                            PayPal
                            <img class="h-[30px] ml-auto" src="../assets/img/pngwing.com.png" alt="">
                        </label>
                        <p v-show="paymentWarning.length !== 0" class=" font-light text-sm text-red-500">{{ paymentWarning }}</p>
                    </div>
                    <div class="mt-16">
                        <div class="flex items-center gap-2">
                            <h1 class="text-2xl">Delivery Options</h1>
                            <el-tooltip content="Free delivery on all orders over IDR 1.500.000" placement="top" effect="dark">
                                <i class="fa-sharp fa-regular fa-circle-question"></i>
                            </el-tooltip>
                        </div>
                        <label v-for="method in deliveryMethods" :key="method.value" :class="{'border-blue-400': deliveryMethod === method.value, 'border-2 p-4 rounded-lg flex items-center gap-2 mt-5': true}">
                            <input type="radio" name="deliveryMethod" :value="method.value" v-model="deliveryMethod">
                            {{ method.label }}
                            <p class="ml-auto">{{ delivery(method.value, totalPrice) }}</p>
                            <p v-if="method.value === 'pickup' && pickupDate">Your pickup date is {{ pickupDate.toLocaleDateString('en-US', options) }}</p>
                        </label>
                        <div v-show="deliveryMethod === 'pickup'" class="flex flex-col mt-4 p-5 rounded-lg border-dashed border-2 border-gray-300 max-w-lg bg-[#edf2f7]">
                            <p>Schedule a pickup date</p>
                            <el-date-picker
                                v-model="pickupDate"
                                class="mt-2"
                                type="date"
                                placeholder="Pick a day"
                                :disabled-date="disabledDate"
                                :shortcuts="shortcuts"
                                :size="large"
                            />
                        </div>
                        <p v-show="deliveryWarning.length !== 0"  class="font-light text-sm text-red-500 mt-5">{{ deliveryWarning }}</p>
                    </div>
                </el-form>
            </div>
            <div class="flex flex-col">
                <div class="w-[500px] hidden lg:block">
                    <div class="rounded-md border-[1px] h-min mt-10 px-4 py-2 bg-white overflow-scroll">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-cart-shopping"></i>
                            <h1 class="text-lg font-medium">Cart Summary</h1>
                        </div>
                        <div v-for="(item, index) in cartItems" :key="index" class="mt-5">
                        <div class="flex flex-1 justify-between items-center">
                            <p>{{ item.productQty }} x {{ item.productName }}</p>
                            <p class="text-left">IDR {{ item.productPrice }}</p>
                        </div>
                        <p class="text-gray-500 w-1/2">{{ item.productShortDesc }}</p>
                        <el-divider></el-divider>
                        </div>
                        <div class="flex justify-between pb-2">
                            <p>Subtotal</p>
                            <p>{{ totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'IDR' }) }}</p>
                        </div>
                    </div>
                </div>
                <div class="w-[500px] hidden lg:block">
                    <div class="rounded-md border-[1px] h-min mt-5 px-4 py-2 bg-white">
                        <div class="flex items-center gap-2">
                            <i class="fa-sharp fa-solid fa-bag-shopping"></i>
                            <h1 class="text-lg font-medium">Order Summary</h1>
                        </div>
                        <div class="flex justify-between mt-5">
                            <p>Subtotal</p>
                            <p>{{ totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'IDR' }) }}</p>
                        </div>
                        <div class="flex justify-between mt-2">
                            <p>Tax</p>
                            <p>{{ calculateTax().toLocaleString('en-US', { style: 'currency', currency: 'IDR' }) }}</p>
                        </div>
                        <div class="flex justify-between mt-2">
                            <p>Delivery Fee</p>
                            <p>{{ getDeliveryFee(totalPrice).toLocaleString('en-US', { style: 'currency', currency: 'IDR' }) }}</p>
                        </div>
                        <el-divider></el-divider>
                        <div class="flex justify-between pb-2">
                            <p>Total</p>
                            <p>{{ getTotalPrice(totalPrice, calculateTax(), getDeliveryFee(totalPrice)) }}</p>
                        </div>
                    </div>
                    <el-button @click="submitForm(ruleFormRef)" class="w-full p-4 mt-5 bg-[#409EFF] font-normal text-lg" :loading="isLoading" size="large" type="primary">Place order</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import firebase from '../firebase/firebaseInit'
import db from '../firebase/firebaseInit';
import { collection, getDocs, query, where, addDoc, writeBatch, doc } from '@firebase/firestore';
import { ref, reactive, onMounted, computed, watchEffect } from 'vue';
import { v4 as uuidv4 } from 'uuid'

const paymentMethod = ref('')
const deliveryMethod = ref('')
const pickupDate = ref('')
const cartItems = ref([])
const ruleFormRef = ref()
const labelPosition = ref('top')
const isLoading = ref(false)
const totalWithTax = ref(0)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const address = ref('')

const cardNumber = ref('')
const cvv = ref('')
const expirationDate = ref('')
const visa = ref(false)
const mastercard = ref(false)
const discover = ref(false)
const amex = ref(false)

const paymentWarning = ref('')
const deliveryWarning = ref('')
const ccWarning = ref('')
const dateWarning = ref('')
const cvvWarning = ref('')

const deliveryMethods = [
        { label: 'Next Day Delivery', value: 'Next Day' },
        { label: 'Standard Delivery', value: 'Standard' },
        { label: 'Express Delivery', value: 'Express' },
        { label: 'Pickup', value: 'Pickup' }
]

const validatePhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please input your phone number'));
  } else if (isNaN(value)) {
    callback(new Error('Phone number must be a number'));
  } else {
    callback();
  }
};

const validatePostalCode = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please input your postal code'));
  } else if (isNaN(value)) {
    callback(new Error('Postal code must be a number'));
  } else {
    callback();
  }
};

const validateNames = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please input your name'));
  } else if (value.trim() === '') {
    callback(new Error('Please input your name'));
  } else {
    callback();
  }
};

const validateCc = (rule, value, callback) => {
  if (value === '' && paymentMethod.value === 'Credit Card') {
    callback(new Error('Please input your credit card number'));
  } else if (value.trim() === '') {
    callback(new Error('Please input your name'));
  } else {
    callback();
  }
};

const rules = reactive({
firstName: [
  { validator: validateNames, required: true},
  { required: true, message: 'Please input your first name'},
  { min: 3, message: 'First name must be longer than 3 characters'},
],
email: [
  { required: true, message: 'Please input your email'},
],
phoneNumber: [
  { validator: validatePhone, required: true},
  { required: true, message: 'Please input your phone number'},
],
address: [
  { required: true, message: 'Please input your address'},
],
district: [
  { required: true, message: 'Please input District'},
],
postalCode: [
  { validator: validatePostalCode, required: true},
  { required: true, message: 'Please input Phone Number'},
],
cardNumber: [
  { validator: validateCc, required: true, message: 'Please input the credit card number'},
],
cvv: [
  { required: true, message: 'Please input your CVV'},
],
expirationDate: [
    {
      type: 'date',
      required: true,
      message: 'Please input the expiration date',
    },
  ],
})

const billingDetails = reactive({
  firstName: firstName.value,
  lastName: lastName.value,
  email: email.value,
  address: address.value,
  cardNumber: cardNumber.value,
  cvv: cvv.value,
  expirationDate: expirationDate.value
})

const options = { 
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
//   {
//     text: 'Yesterday',
//     value: () => {
//       const date = new Date();
//       date.setTime(date.getTime() - 3600 * 1000 * 24);
//       return date;
//     },
//   },
//   {
//     text: 'A week ago',
//     value: () => {
//       const date = new Date();
//       date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
//       return date;
//     },
//   },
  {
    text: 'Next week',
    value: () => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    },
  },
];

onMounted(async () => {
    await getProducts()
})

const getDeliveryFee = (price) => {
      if(price >= 1500000 && deliveryMethod.value !== 'pickup') {
        return 'Free'
      }

      if (deliveryMethod.value === 'Standard') {
        return 12000;
      } else if (deliveryMethod.value === 'Express') {
        return 20000;
      } else if (deliveryMethod.value === 'Next Day') {
        return 18000;
      }else if (deliveryMethod.value === 'Pickup') {
        return 'Pickup'
      }else {
        return '-'
      }
      // Add more conditions for other delivery methods if needed
}

const totalPrice = computed(() => calculateTotalPrice());

const calculateTax = () => {
  return totalPrice.value * 0.1;
};


const getTotalPrice = (totalPrice, tax, deliveryFee) => {
    if(deliveryFee === 'Free' || deliveryFee === '-' || deliveryFee === 'Pickup') {
        return (totalPrice + tax).toLocaleString('en-US', { style: 'currency', currency: 'IDR' });
    }else {
        return (totalPrice + tax + deliveryFee).toLocaleString('en-US', { style: 'currency', currency: 'IDR' });
    }
}

watchEffect(() => {
    if (deliveryMethod.value !== 'pickup') {
        pickupDate.value = null; // Clear the pickupDate
    }

    if (paymentMethod.value) {
        paymentWarning.value = ''; // Clear the paymentWarning if paymentMethod is not empty
    } 

    if (deliveryMethod.value) {
        deliveryWarning.value = ''; // Clear the paymentWarning if paymentMethod is not empty
    } 

    if (billingDetails.cardNumber) {
        ccWarning.value = ''
    } 

    if (billingDetails.expirationDate) {
        dateWarning.value = ''
    } 

    if (billingDetails.cvv) {
        cvvWarning.value = ''
    } 
});

const disabledDate = (time) => {
  return time.getTime() < Date.now();
};

const getProducts = async () => {
  const cartsRef = collection(db, 'carts');
  const cartRef = query(cartsRef, where('buyerUid', '==', localStorage.getItem("profileId")));
  const items = await getDocs(cartRef);

  try {
    items.forEach(async (item) => {
      const itemData = item.data();
      const priceSeparator = Number(itemData.productPrice.replace(/[^\d]/g, "")) * itemData.productQty;
      totalPrice.value += parseInt(priceSeparator);
      cartItems.value.push(itemData);
    });
  } catch (err) {
    console.error(err);
  }
  console.log(cartItems.value)
}

const delivery = (method, price) => {
    if(price >= 1500000 && method !== 'Pickup') {
        return 'Free'
    }

    if(price < 1500000 && method === 'Express') {
        return 'IDR 20.000'
    } else if(price < 1500000 && method === 'Next Day') {
        return 'IDR 18.000'
    }else if(price < 1500000 && method === 'Standard') {
        return 'IDR 12.000'
    }
}

// const handleInput = () => {
//     const inputText = cc.value;
//     const firstDigit = inputText.charAt(0);
//     console.log(firstDigit)
// }

const calculateTotalPrice = () => {
  let total = 0;
  for (const item of cartItems.value) {
    const price = Number(item.productPrice.replace(/[^\d]/g, ""));
    const quantity = item.productQty;
    total += price * quantity;
  }
  return total;
};

// const getImageUrl = () => {
//     if (cc.value.charAt(0) === '4') {
//         return '@/assets/img/visa.png';
//     } else {
//         return ''; // Set to an empty string if no matching card type
//     }
// }

const validateForm = () => {
    let isValid = true

    if(!paymentMethod.value) {
        paymentWarning.value = 'Please choose your payment method'
        isValid = false
    }else {
        paymentWarning.value = ''
    }

    if(!deliveryMethod.value) {
        deliveryWarning.value = 'Please choose your delivery method'
        isValid = false
    }else {
        deliveryWarning.value = ''
    }

    if(!billingDetails.cardNumber && paymentMethod.value === 'Credit Card') {
        ccWarning.value = 'Please input your credit card number'
        isValid = false
    }else if(billingDetails.cardNumber.length < 16 && paymentMethod.value === 'Credit Card') {
        ccWarning.value = 'Credit card number needs to be 16-digits'
    }else {
        ccWarning.value = ''
    }

    if(!billingDetails.expirationDate && paymentMethod.value === 'Credit Card') {
        dateWarning.value = 'Please input your expiration date'
        isValid = false
    }else {
        dateWarning.value = ''
    }

    if(!billingDetails.cvv && paymentMethod.value === 'Credit Card') {
        cvvWarning.value = 'Please input your CVV'
        isValid = false
    }else if(billingDetails.cvv.length < 3 && paymentMethod.value === 'Credit Card') {
        cvvWarning.value = 'CVV needs to be 3-digits'
    }else {
        cvvWarning.value = ''
    }

    return isValid
}

const placeOrder = async () => {
  const cartsRef = collection(db, 'carts');
  const cartRef = query(cartsRef, where('buyerUid', '==', localStorage.getItem("profileId")));
  const items = await getDocs(cartRef);

  totalWithTax.value = totalPrice.value + calculateTax();
  const deliveryFee = getDeliveryFee(totalPrice.value);

  if (deliveryFee !== 'Free') {
    totalWithTax.value += deliveryFee;
  }


  try {
    const batch = writeBatch(db);
    let totalQty = 0;
    items.forEach((item) => {
      const itemData = item.data();
      totalQty += itemData.productQty
      batch.delete(item.ref);
    });

    const orderRef = doc(collection(db, "orders"));
    const orderData = {
      uid: uuidv4(),
      firstName: billingDetails.firstName,
      lastName: billingDetails.lastName,
      address: billingDetails.address,
      email: billingDetails.email,
      paymentMethod: paymentMethod.value,
      deliveryFee: getDeliveryFee(totalPrice),
      deliveryType: deliveryMethod.value,
      items: items.docs.map((item) => item.data()),
      totalPrice: totalWithTax.value,
      totalQty: totalQty,
      buyerUid: localStorage.getItem('profileId')
    };

    batch.set(orderRef, orderData);
    await batch.commit();
  } catch (err) {
    console.error(err);
  }
}




const handleChange = () => {
  if(billingDetails.cardNumber.charAt(0) === '') {
    amex.value = false
    visa.value = false
    mastercard.value = false
    discover.value = false
  }
  else if(billingDetails.cardNumber.charAt(0) === '4') {
    visa.value = true
    amex.value = false
    mastercard.value = false
    discover.value = false
  }else if(billingDetails.cardNumber.charAt(0) === '5') {
    mastercard.value = true
    visa.value = false
    amex.value = false
    discover.value = false
  }else if(billingDetails.cardNumber.charAt(0) === '6') {
    discover.value = true
    visa.value = false
    mastercard.value = false
    amex.value = false
  }else if(billingDetails.cardNumber.charAt(0) === '3') {
    amex.value = true
    visa.value = false
    mastercard.value = false
    discover.value = false
  }
}

const submitForm = async (formEl) => {
    isLoading.value = true
    validateForm()

    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid && validateForm()) {
            placeOrder()
        } else {
            console.log('error submit!', fields)
        }
    })
    isLoading.value = false
}



</script>

<style>

</style>
