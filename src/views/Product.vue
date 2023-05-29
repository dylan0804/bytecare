<template>
    <div class="container mx-auto p-6 py-20">
        <Skeleton v-show="!isLoaded" />
        <div v-show="isLoaded" v-for="item in productItem" :key="index"
        class="xl:flex gap-20">
            <img class="md:w-[50%] mx-auto h-auto" :src="item.productImg" alt="">
            <div class="flex flex-col mt-10">
                <div class="flex flex-col gap-3">
                    <p class=" text-3xl font-bold">{{ item.productName }}</p>
                    <p class=" text-gray-600">{{ item.productDesc }}</p>
                    <el-rate
                        v-model="item.productRating"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}"
                    />
                </div>
                <el-divider></el-divider>
                <div class="flex flex-col gap-3">
                    <p class="text-xl font-bold">IDR {{ item.productPrice }} or {{ installment(item.productPrice) }} / month</p>
                    <p class=" text-gray-600">Suggested payments with 6 months installment plan</p>
                </div>
                <el-divider></el-divider>
                <div class="flex items-center gap-6">
                    <el-input-number v-model="productQty" :min="1" size="large"/>
                    <p class="text-gray-600">Only <span class="text-orange-500"> {{ item.productStock }} items </span>left. Dont miss it!</p>
                </div>
                <div class=" mt-8 flex">
                    <el-button size="large" type="primary" @click="addToCart" class="text-md md:block p-2 px-10 bg-[#409EFF] text-white rounded-full">Add to cart</el-button>
                    <el-button size="large" @click="addToWishlist" class="text-md md:block p-2 px-10 border-[1px] border-black text-black rounded-full">Add to wishlist</el-button>
                </div>
                <el-divider></el-divider>
                <div class="border-[1px] border-gray-300 p-4 flex flex-col gap-4">
                    <div class="flex gap-2">
                        <i class="mt-1.5 text-orange-500 fa-solid fa-cart-shopping"></i>
                        <div>
                            <p class=" font-semibold">Free Delivery</p>
                            <p class=" text-gray-600">Free Delivery on all orders over IDR 1.500.000</p>
                        </div>
                    </div>
                    <hr/>
                    <div class="flex gap-3">
                        <i class="mt-1.5 text-orange-500 fa-solid fa-calendar"></i>
                        <div>
                            <p class="font-semibold">Return Policy</p>
                            <p class=" text-gray-600">Return your item within 30 days of purchase in its original packaging and unused condition.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Skeleton from '@/components/Skeleton.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import firebase from '../firebase/firebaseInit'
import { storage } from '../firebase/firebaseInit';
import { getDownloadURL, ref as storageRef } from '@firebase/storage';
import db from '../firebase/firebaseInit';
import { collection, getDocs, query, where, addDoc, updateDoc } from '@firebase/firestore';
import { ElNotification } from 'element-plus';

const route = useRoute();
const productItem = ref([])
const productQty = ref(1)
const store = useStore();
const isLoaded = ref(false)
const msg = ref('')

onMounted(async () => {
    await getProduct()
})

const getProduct = async () => {
  const productsRef = collection(db, 'products');
  const productRef = query(productsRef, where('uid', '==', route.params.uid));
  const items = await getDocs(productRef);

  try {
    items.forEach(async (item) => {
      const itemData = item.data();
      const imageRef = storageRef(storage, item.data().productImg);
      const url = await getDownloadURL(imageRef);
      itemData.productImg = url;
      productItem.value.push(itemData);
    });
  } catch (err) {
    console.error(err);
  }
  isLoaded.value = true
}

const addItemToCollection = async (collectionName, itemData) => {
  openNotification(collectionName);
  if (await productDoesntExist(route.params.uid, collectionName)) {
    try {
      await addDoc(collection(db, collectionName), {
        uid: itemData[0].uid,
        productName: itemData[0].productName,
        productDesc: itemData[0].productDesc,
        productShortDesc: itemData[0].productShortDesc,
        productPrice: itemData[0].productPrice,
        productRating: itemData[0].productRating,
        productImg: itemData[0].productImg,
        productQty: productQty.value,
        buyerEmail: store.state.profileEmail,
        buyerUid: store.state.profileId,
      });
    } catch (err) {
      console.error(err);
    }
  } else {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(
      query(collectionRef, where("uid", "==", route.params.uid))
    );

    querySnapshot.forEach(async (item) => {
      const currentQuantity = item.data().productQty || 0;
      const newQuantity = currentQuantity + productQty.value;

      await updateDoc(item.ref, { productQty: newQuantity });
    });
  }
};

const addToCart = async () => {
  await addItemToCollection("carts", productItem.value);
};

const addToWishlist = async () => {
  await addItemToCollection("wishlist", productItem.value);
};


const productDoesntExist = async (uid, collectionName) => {
    const cartsRef = collection(db, collectionName);

    // Check if email already exists in Firestore
    const q = query(cartsRef, where("uid", "==", uid), where('buyerUid', '==', localStorage.getItem('profileId')));
    const snapshot = await getDocs(q);

    return (snapshot.empty) ? true : false;
}

const openNotification = (collectionName) => {
  (collectionName === 'wishlist') ? msg.value = 'wishlist' : msg.value = 'cart'

    ElNotification({
    title: 'Success',
    message: `Product has been added to your ${msg.value}`,
    type: 'success',
    duration: 1000,
  })
}

const installment = (price) => {
    const numericPrice = parseFloat(price.replace(/Rp|\./g, '').replace(',', '.'));
    const installmentPrice = numericPrice / 6;
    return "IDR " + installmentPrice.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
</script>

<style>

</style>