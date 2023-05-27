<template>
    <div class="container mx-auto p-6 py-20">
       <!-- <label for="">Product Name</label>
       <input type="text" v-model="productName">
       <br>
       <br>
       <label for="">Description</label>
       <input type="text" v-model="productDesc">
       <br>
       <br>
       <label for="">Price</label>
       <input type="text" v-model="productPrice">
       <br>
       <br>
       <label for="">Rating</label>
       <input type="text" v-model="productRating">
       <br>
       <br>
       <label for="">URL</label>
       <input type="text" v-model="imgUrl">
       <br>
       <el-button @click="addOrder">Add item</el-button> -->
       <div @click="centerDialogVisible = true" class="relative">
        <input v-model="searchQuery" class="py-2 px-6 rounded-full border-[1px] w-full" placeholder="Search Products" type="text">
        <ul class="absolute top-10 z-50 flex flex-col mt-4 justify-center rounded-xl">
        <li @click="viewProduct(item.uid)" 
            v-show="searchQuery !== '' && searchQuery !== ' '" 
            v-for="item in filteredProducts" :key="index"
            class="cursor-pointer bg-white p-4">
            <div class="flex space-x-8 items-center">
              <p class="flex-1">{{ item.productName }}</p>
              <el-rate
                        v-model="item.productRating"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}"
              
                />
              <p>IDR {{ item.productPrice }}</p>
            </div>
          <hr class="mt-6" :class="{'hidden': index === filteredProducts.length - 1}">
        </li>
       </ul>
      </div>
      <div v-show="!isLoaded" class="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-28 mt-10">
         <div v-for="animation in skeleton" :key="index">
            <el-skeleton style="width: 300px" animated>
            <template #template>
              <el-skeleton-item variant="image" style="width: 300px; height: 300px"  />
              <div class="mt-5">
                <el-skeleton-item variant="p" style="width: 50%" />
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-items: space-between;
                  "
                >
                  <el-skeleton-item variant="text" class="mt-2" />
                </div>
              </div>
            </template>
          </el-skeleton>
         </div>
       </div>
       <div v-show="isLoaded" class="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-20 mt-10">
            <div v-for="item in productItem" :key="index"
            class="flex flex-1 flex-col gap-2"
            >
                <div class="relative bg-gray-200 flex justify-center items-center rounded-md cursor-pointer"
                @click="viewProduct(item.uid)">
                  <!-- <el-button class="absolute top-4 right-5 bg-[#F56C6C]" type="danger" circle>
                    <i class="fa-regular fa-heart"></i>
                  </el-button> -->
                  <img class="w-[250px] p-2 h-[250px] rounded-md object-contain" :src="item.productImg" alt="">
                </div>
                <p class=" text-lg font-medium">{{ item.productName }}</p>
                <p class=" text-sm text-gray-600 flex-1">{{ item.productShortDesc }}</p>
                <p>IDR {{ item.productPrice }}</p>
                <el-rate
                    v-model="item.productRating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                />
            </div>
       </div>

       
       <el-dialog v-model="centerDialogVisible" width="400px" center>
        <div>
              <ais-instant-search :search-client="client" index-name="Products">
                <ais-search-box class="search-box" submit-title="Submit the query" />
                <ais-configure
      :hits-per-page.camel="4"
    />
      <ais-hits>
        <template v-slot:item="{ item }">
          <h2 @click="viewProduct(item.uid)">{{ item.productName }}</h2>
        </template>
      </ais-hits>
    </ais-instant-search>
        </div>
  </el-dialog>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import firebase from '../firebase/firebaseInit'
import { storage } from '../firebase/firebaseInit';
import { getDownloadURL, ref as storageRef } from '@firebase/storage';
import db from '../firebase/firebaseInit';
import { addDoc, collection, getDocs } from '@firebase/firestore';
import { onMounted, ref, watchEffect } from 'vue';
import algoliasearch from 'algoliasearch';
import { v4 as uuidv4 } from 'uuid';

const productName = ref(null)
const productDesc = ref(null)
const productPrice = ref(null)
const productRating = ref(null)
const imgUrl = ref(null)
const router = useRouter()
const skeleton = ref(4)
const isLoaded = ref(false)
const centerDialogVisible = ref(false)

const productItem = ref([])
const searchQuery = ref('')
const filteredProducts = ref([])

const placeholder = 'https://via.placeholder.com/400x400'

const client = algoliasearch('BJOGI50ZMG', '6ac84c16c1932221490f03d45fb5c11f');

watchEffect(() => {
  filteredProducts.value = productItem.value.filter(product => {
    return product.productName.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const getProducts = async () => {
  const productsRef = collection(db, 'products');
  const items = await getDocs(productsRef);
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

const viewProduct = (uid) => {
  router.push({ name: 'Product', params: {uid: uid} })
}

const addOrder = async () => {
    try {
        await addDoc(collection(db, "products"), {
            uid: uuidv4(),
            productName: productName.value,
            productDesc: productDesc.value,
            productPrice: productPrice.value,
            productRating: productRating.value,
            productImg: imgUrl.value
        })
    } catch (err) {
        console.error(err)
    }
}

onMounted(async () => {
    await getProducts();
    console.log(productItem.value)

    // setTimeout(() => {
    //     isLoaded.value = true
    // }, 1350)
})

</script>

<style>
   .ais-SearchBox {
    display: flex;
    align-items: center;
    position: relative;
  }

  .ais-SearchBox-form {
    flex-grow: 1;
    margin-right: 10px;
  }

  .ais-SearchBox-input {
    width: 100%;
    padding: 8px;
    padding-left: 34px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
  }

  .ais-SearchBox-submit {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
  }

  .ais-SearchBox-submitIcon {
    width: 18px;
    height: 18px;
    position: absolute;
    top: 12px;
    left: 12px;
  }

  .ais-SearchBox-reset {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .ais-SearchBox-resetIcon {
    display: none;
  }

  .ais-SearchBox-loadingIndicator {
    margin-left: 10px;
    font-size: 20px;
  }

  .ais-Hits-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .ais-Hits-item {
    padding: 8px;
    border: 2px solid black;
    border-radius: 8px;
  }
</style>





