<template>
    <div class="container mx-auto p-6 py-20">
        <h1 class="text-2xl">My cart</h1>
         <el-empty v-show="cartItems.length === 0 && isLoaded" description="Your cart is empty">
            <el-link @click="router.push({ name: 'Shop' })" type="primary">Shop now</el-link>
        </el-empty>
        <div v-show="!isLoaded" class="flex space-x-4">
            <div class="flex-col flex-1">
                <div class="mt-10 p-4 border-[1px] custom-shadow rounded-lg bg-white">
                    <el-skeleton :rows="2" animated/>
                </div>
            </div>
            <el-affix :offset="0">
                <div class="w-[300px] flex-col sticky top-0">
                    <div class="rounded-md border-[1px] h-min mt-10 px-4 py-2 bg-white">
                        <el-skeleton :rows="3" animated/>
                    </div>
                </div>
            </el-affix>
        </div>

        <!-- <el-table :data="cartItems" style="width: 100%">
          <el-table-column type="expand">
            <template #default="props">
            <div class="ml-[60px] flex flex-col space-y-2">
              <p >Name: {{ props.row.productName }}</p>
              <p >Price: {{ props.row.productPrice }}</p>
              <p >Description: {{ props.row.productDesc }}</p>
              <p >Quantity: {{ props.row.productQty }}</p>
              <h3>Family</h3>
              <el-table :data="props.row.family" :border="childBorder">
                <el-table-column label="Name" prop="name" />
                <el-table-column label="State" prop="state" />
                <el-table-column label="City" prop="city" />
                <el-table-column label="Address" prop="address" />
                <el-table-column label="Zip" prop="zip" />
              </el-table>
            </div>
          </template>
          </el-table-column>
          <el-table-column prop="productName" label="Date" width="500"/>
          <el-table-column prop="productPrice" label="Name" width="180" />
          <el-table-column prop="productQty" label="Address" />
        </el-table> -->
        <div v-show="cartItems.length !== 0 && isLoaded" class="flex flex-col lg:flex-row lg:space-x-6">
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
                                <p @click="addToWishlist(item.uid)" class="whitespace-nowrap underline hover:text-black text-gray-500">Move to wishlist</p>
                                <p @click="deleteItem(item.uid)" class="underline hover:text-black text-gray-500">Remove</p>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="ml-auto w-full lg:max-w-min">
              <el-affix :offset="0">
                  <div class="w-full lg:w-[350px] lg:flex flex-col">
                      <div class="rounded-md border-[1px] h-min mt-10 px-4 py-2 bg-white">
                          <div class="flex items-center gap-2">
                            <i class="fa-sharp fa-solid fa-bag-shopping"></i>
                            <h1 class=" font-medium">Order Summary</h1>
                          </div>
                          <div class="flex justify-between mt-5">
                              <p>Price</p>
                              <p>{{ totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'IDR' }) }}</p>
                          </div>
                          <div class="flex justify-between mt-1">
                              <p>Tax</p>
                              <p class="text-gray-500 italic">Calculated at checkout</p>
                          </div>
                          <el-divider></el-divider>
                          <div class="flex justify-between">
                              <p>Subtotal</p>
                              <p>{{ totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'IDR' }) }}</p>
                          </div>
                      </div>
                      <el-button @click="checkoutOrder" class="w-full p-4 mt-5 bg-[#409EFF] font-normal text-lg" :loading="isLoading" size="large" type="primary">Check out</el-button>
                  </div>
              </el-affix>
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
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc, addDoc, onSnapshot } from '@firebase/firestore';
import { useStore } from 'vuex';
import { ref, onMounted, computed, reactive } from 'vue';

const router = useRouter();
const store = useStore();
let cartItems = reactive([]);
const updateQty = ref(0)
const isLoaded = ref(false)

onMounted(async () => {
    getProducts()
    isLoaded.value = true
})

const getProducts = () => {
  const cartsRef = collection(db, 'carts');
  const cartRef = query(cartsRef, where('buyerUid', '==', localStorage.getItem("profileId")));

  const unsubscribe = onSnapshot(cartRef, (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'added') {
        const itemData = change.doc.data();
        const imageRef = storageRef(storage, itemData.productImg);
        const url = await getDownloadURL(imageRef);
        itemData.productImg = url;
        updateQty.value = itemData.productQty;
        const priceSeparator = Number(itemData.productPrice.replace(/[^\d]/g, "")) * itemData.productQty;
        totalPrice.value += parseInt(priceSeparator);
        cartItems.push(itemData);
      }
      if (change.type === 'modified') {
        // Handle modified documents
        const index = cartItems.findIndex((item) => item.id === itemId);
        if (index > -1) {
          const updatedItem = {
            ...cartItems[index],
            productQty: itemData.productQty // Update the quantity
          };
          cartItems[index] = updatedItem;
        } else {
          const imageRef = storageRef(storage, itemData.productImg);
          const url = await getDownloadURL(imageRef);
          itemData.productImg = url;
          cartItems.value.push(itemData); // Add the modified item as a new item
        }
      }

      if (change.type === 'removed') {
        // Handle removed documents
        const itemId = change.doc.id;
        // Remove the item from cartItems.value array
        const index = cartItems.findIndex((item) => item.id === itemId);
        if (index > -1) {
          cartItems.splice(index, 1);
        }
      }
    });
  });

  // Store the unsubscribe function to be able to stop listening for updates
  // For example, you can call unsubscribe() when the component is unmounted

  // Optional: Return the unsubscribe function if you need it for cleanup
  return unsubscribe;
};


const totalPrice = computed(() => calculateTotalPrice());

const calculateTotalPrice = () => {
  let total = 0;
  for (const item of cartItems) {
    const price = Number(item.productPrice.replace(/[^\d]/g, ""));
    const quantity = item.productQty;
    total += price * quantity;
  }
  return total;
};

const deleteItem = async (uid) => {
  const index = cartItems.findIndex(item => item.uid === uid);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }

  const q = query(
    collection(db, "carts"),
    where("uid", '==', uid),
    where("buyerUid", '==', localStorage.getItem("profileId"))
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (item) => {
    try {
      await deleteDoc(doc(db, "carts", item.id));
      console.log('Document deleted successfully.');
    } catch (error) {
      console.log(error.message)
    }
  });
};

const addToWishlist = async (uid) => {
  const index = cartItems.findIndex(item => item.uid === uid);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }

  const q = query(
    collection(db, "carts"),
    where("uid", '==', uid),
    where("buyerEmail", '==', localStorage.getItem("profileEmail"))
  );

  if(await productDoesntExist(uid)) {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (item) => {
      try {
        await addDoc(collection(db, "wishlist"), {
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
        await deleteDoc(doc(db, "carts", item.id));
      } catch (error) {
        console.log(error.message)
      }
  });
  }else {
    const collectionRef = collection(db, "wishlist");
      const querySnapshot = await getDocs(
        query(collectionRef, where("uid", "==", uid))
      );

      querySnapshot.forEach(async (item) => {
        const currentQuantity = item.data().productQty || 0;
        const newQuantity = currentQuantity + updateQty.value;

        await updateDoc(item.ref, { productQty: newQuantity });
        
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (item) => {
          await deleteDoc(doc(db, "carts", item.id));
        })
    });
  }
}

const handleChange = async (name, qty) => {
  const cartsRef = collection(db, 'carts');
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


const productDoesntExist = async (uid) => {
    const cartsRef = collection(db, "wishlist");

    // Check if email already exists in Firestore
    const q = query(cartsRef, 
                    where("uid", "==", uid), 
                    where('buyerUid', '==', localStorage.getItem('profileId')));

    const snapshot = await getDocs(q);

    return (snapshot.empty) ? true : false;
}

const checkoutOrder = async () => {
    router.push({ name: 'Billing' })
}

const viewProduct = (uid) => {
  router.push({ name: 'Product', params: {uid: uid} })
}

</script>
