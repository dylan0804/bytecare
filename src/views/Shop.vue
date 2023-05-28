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
       <label for="">Short Desc</label>
       <input type="text" v-model="productShortDesc">
       <br>
       <br>
       <label for="">Stock</label>
       <input type="text" v-model="productStock">
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
        <div class="relative">
          <input
            class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Search products"
            />
            <button type="submit" class="absolute top-0 right-0 p-2.5 px-5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-600">
              <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span class="sr-only">Search</span>
            </button>
        </div>       
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

       
       <el-dialog v-model="centerDialogVisible" width="500px" center>
        <div>
          <ais-instant-search :search-client="client" index-name="Products">
  <ais-configure :hits-per-page.camel="5" />
  <ais-autocomplete>
    <template v-slot="{ currentRefinement, indices, refine }">
      <div class="relative">
        <input
          type="search"
          :value="currentRefinement"
          placeholder="Search for a product"
          @input="refine($event.currentTarget.value)"
          class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button type="submit" class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-600">
            <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span class="sr-only">Search</span>
          </button>
      </div>
      <ul v-if="currentRefinement" class="mt-5 border border-gray-300 rounded-md shadow-md">
        <li v-for="(index, indexId) in indices" :key="indexId">
          <h3 class="px-4 py-2 bg-gray-100 border-b border-gray-300 font-medium text-lg">{{ index.indexName }}</h3>
          <ul v-if="index.hits.length > 0">
            <li
              @click="viewProduct(hit.uid)"
              @mouseenter="hoveredItem = hitId" 
              @mouseleave="hoveredItem = null"
              v-for="(hit, hitId) in index.hits"
              :key="hitId"
              class="px-4 py-2 border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
            >
              <div class="flex items-center gap-2 justify-between">
                <!-- Add image here if needed -->
                <div>
                  <ais-highlight attribute="productName" :hit="hit" class="text-blue-500 font-semibold text-lg" />
                  <p class="text-gray-600">{{ hit.productShortDesc }}</p>
                  <el-rate
                    v-model="hit.productRating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                </div>
                <i v-show="hoveredItem === hitId" class="fa-solid fa-arrow-turn-down"></i>
              </div>
            </li>
          </ul>
          <p v-else class="px-4 py-2 text-gray-600">No results found.</p>
        </li>
      </ul>
    </template>
  </ais-autocomplete>
  <div class="flex justify-end items-center mt-5">
    <ais-powered-by class="text-sm text-gray-500" />
  </div>
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
const productShortDesc = ref(null)
const productStock = ref(null)
const imgUrl = ref(null)
const router = useRouter()
const skeleton = ref(4)
const isLoaded = ref(false)
const centerDialogVisible = ref(false)
const hoveredItem = ref(null)

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
            productShortDesc: productShortDesc.value,
            productStock: productStock.value,
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

<style lang="scss" scoped>
:deep(.el-dialog__body), :deep(.el-dialog) {
      width: 800px;
      height: min-content;
      overflow: auto;
}

@media (max-width: 480px) {
    :deep(.el-dialog__body), :deep(.el-dialog) {
      max-width: 375px;
      height: min-content;
      overflow: auto;
    }
  }
</style>





