<template>
    <div class="container mx-auto p-6 py-20">
        <h1 class="text-2xl">My Wishlist</h1>
        <el-empty v-show="cartItems.length === 0 && isLoaded" description="Your wishlist is empty">
            <el-link @click="router.push({ name: 'Shop' })" type="primary">Shop now</el-link>
        </el-empty>
        <div v-show="!isLoaded" class="flex space-x-4">
            <div class="flex-col flex-1">
                <div class="mt-10 p-4 border-[1px] custom-shadow rounded-lg bg-white">
                    <el-skeleton :rows="2" animated/>
                </div>
            </div>
        </div>
        <div v-show="cartItems.length !== 0 && isLoaded">
        <div class="flex flex-col flex-1">
                <div v-for="(item, index) in cartItems" :key="index" class="mt-10 py-4 px-2 md:p-4 border-[1px] custom-shadow rounded-lg bg-white shadow-md">
                <div class="flex space-x-6">
                    <img @click="viewProduct(item.uid)" :src="item.productImg" class="max-w-[100px] h-auto min-h-[100px] object-contain cursor-pointer" alt="">
                    <div class="flex flex-col gap-2 xl:flex-row flex-1 justify-between"> <!-- change made here -->
                        <div class="flex flex-col gap-2 justify-between">
                          <h1 @click="viewProduct(item.uid)" class="font-medium hover:underline cursor-pointer">{{ item.productName }}</h1>
                          <p class="text-gray-500">{{ item.productShortDesc }}</p>
                          <el-rate
                              v-model="item.productRating"
                              disabled
                              show-score
                              text-color="#ff9900"
                              score-template="{value}"
                          />
                        </div>
                        <div class="flex flex-col items-start gap-3 xl:items-end cursor-pointer">
                            <p class=" font-medium">IDR {{ item.productPrice }}</p>
                            <div class="flex flex-col xl:flex-row-reverse mt-auto items-start xl:items-center gap-3">
                              <el-input-number v-model="item.productQty" :min="1" @change="handleChange(item.productName, item.productQty)"/>
                              <div class="flex items-center gap-2">
                                <p @click="addToCart(item.uid)" class="whitespace-nowrap underline hover:text-black text-gray-500">Add to cart</p>
                                <p @click="deleteItem(item.uid)" class="underline hover:text-black text-gray-500">Remove</p>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import firebase from '../firebase/firebaseInit'
import { storage } from '../firebase/firebaseInit';
import { getDownloadURL, ref as storageRef } from '@firebase/storage';
import db from '../firebase/firebaseInit';
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc, addDoc } from '@firebase/firestore';
import { useStore } from 'vuex';
import { ref, onMounted, computed } from 'vue';

const router = useRouter();
const store = useStore();
const cartItems = ref([]);
const updateQty = ref(0);
const isLoaded = ref(false)

onMounted(async () => {
    await getProducts()
    isLoaded.value = true
})


const getProducts = async () => {
  const cartsRef = collection(db, 'wishlist');
  const cartRef = query(cartsRef, where('buyerUid', '==', localStorage.getItem("profileId")));
  const items = await getDocs(cartRef);

  try {
    items.forEach(async (item) => {
      const itemData = item.data();
      const imageRef = storageRef(storage, item.data().productImg);
      const url = await getDownloadURL(imageRef);
      itemData.productImg = url;
      updateQty.value = item.data().productQty
      cartItems.value.push(itemData);
    });
  } catch (err) {
    console.error(err);
  }
}

const deleteItem = async (uid) => {
  cartItems.value = cartItems.value.filter(item => item.uid !== uid);

  const q = query(
    collection(db, "wishlist"),
    where("uid", '==', uid),
    where("buyerUid", '==', localStorage.getItem("profileId"))
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (item) => {
    try {
      await deleteDoc(doc(db, "wishlist", item.id));
    } catch (error) {
      console.log(error.message)
    }
  });
};

const handleChange = async (name, qty) => {
  const cartsRef = collection(db, 'wishlist');
  const cartRef = query(
    cartsRef,
    where('buyerUid', '==', localStorage.getItem('profileId')),
    where('productName', '==', name)
  );

  const items = await getDocs(cartRef);

  items.forEach(async (item) => {
    updateQty.value = qty
    await updateDoc(item.ref, { productQty: qty });
  });
};

const addToCart = async (uid) => {
  cartItems.value = cartItems.value.filter(item => item.uid !== uid);

  const q = query(
      collection(db, "wishlist"),
      where("uid", '==', uid),
      where("buyerUid", '==', localStorage.getItem("profileId"))
    );

  if(await productDoesntExist(uid)) {
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (item) => {
      try {
        await addDoc(collection(db, "carts"), {
            uid: item.data().uid,
            productName: item.data().productName,
            productDesc: item.data().productDesc,
            productShortDesc: item.data().productShortDesc,
            productPrice: item.data().productPrice,
            productRating: item.data().productRating,
            productImg: item.data().productImg,
            productQty: item.data().productQty,
            buyerEmail: store.state.profileEmail,
            buyerUid: store.state.profileId,
        })
        await deleteDoc(doc(db, "wishlist", item.id));
      } catch (error) {
        console.log(error.message)
      }
    });
    }else {
      const collectionRef = collection(db, "carts");
      const querySnapshot = await getDocs(
        query(collectionRef, where("uid", "==", uid))
      );

      querySnapshot.forEach(async (item) => {
        const currentQuantity = item.data().productQty || 0;
        const newQuantity = currentQuantity + updateQty.value;

        await updateDoc(item.ref, { productQty: newQuantity });
        
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (item) => {
          await deleteDoc(doc(db, "wishlist", item.id));
        })
    });
    }
}

const productDoesntExist = async (uid) => {
    const cartsRef = collection(db, "carts");

    // Check if email already exists in Firestore
    const q = query(cartsRef, 
                    where("uid", "==", uid), 
                    where('buyerUid', '==', localStorage.getItem('profileId')));

    const snapshot = await getDocs(q);

    return (snapshot.empty) ? true : false;
}

</script>