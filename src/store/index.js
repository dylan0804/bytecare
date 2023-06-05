import { createStore } from 'vuex'
import db from '@/firebase/firebaseInit'
import { collection, query, where, getDocs, updateDoc, orderBy } from 'firebase/firestore'
import { getDownloadURL, ref as storageRef } from '@firebase/storage';
import { storage } from '../firebase/firebaseInit';


export default createStore({
  state: {
    // user credentials
    user: null,
    profileId: null,
    profileFirstName: null,
    profileLastName: null,
    profileEmail: null,

    // repair user
    repairFirstName: null,
    repairLastName: null,
    repairEmail: null,

    //repair step-1
    serviceType: '',
    phoneNumber: null,
    city: '',
    address: '',
    district: '',
    postalCode: null,
    pickupDate: null,
    pickupTime: null,
    additionalInfo: '',

    //repair step-2
    deviceType: '',
    operatingSystem: '',
    problem: '',

    repairHistory: [],
    orderHistory: [],
    repairHistoryFetched: false,
    orderHistoryFetched: false,

    //shop
    shopItems: [],
    shopItemsFetched: false,
  },
  getters: {
  },
  mutations: {
    // update whether user is logged in or not
    updateUser(state, payload) {
      state.user = payload
    },
    // set user
    setUserData(state, payload) {
      localStorage.setItem("profileId", payload.id)
      state.profileId = payload.id
      state.profileFirstName = payload.data().firstName;
      state.profileLastName = payload.data().lastName;
      state.profileEmail = payload.data().email;
    },

    //get contact info
    getContactInfo(state, payload) {
      state.phoneNumber = payload.phoneNumber,
      state.city = payload.city,
      state.address = payload.address
      state.district = payload.district,
      state.postalCode = payload.postalCode,
      state.additionalInfo = payload.desc
    },

    getRepairUser(state, payload) {
      state.repairFirstName = payload.firstName,
      state.repairLastName = payload.lastName,
      state.repairEmail = payload.email
    },
    getProblemInfo(state, payload) {
      state.operatingSystem = payload.operatingSystem
      state.deviceType = payload.deviceType
      state.problem = payload.problem
      state.pickupDate = payload.date1,
      state.pickupTime = payload.date2,
      state.serviceType = payload.repairType
    },
    PUSH_REPAIR_HISTORY(state, item) {
      state.repairHistory.push(item);
    },
    SET_REPAIR_HISTORY_FETCHED(state, value) {
      state.repairHistoryFetched = value;
    },
    UPDATE_REPAIR_ITEM_STATUS(state, { index, status }) {
      if (index !== -1) {
        state.repairHistory[index].status = status;
      }
    },
    CLEAR_REPAIR_HISTORY(state) {
      state.repairHistory = [];
    },
    SET_CART_ITEMS(state, items) {
      state.orderHistory = items;
    },
    SET_ORDER_HISTORY_FETCHED(state, value) {
      state.orderHistoryFetched = value;
    },
    ADD_PRODUCT(state, products) {
      state.shopItems = products;
      // Update the products array in the store
    },
    SET_SHOP_ITEMS_FETCHED(state, value) {
      state.shopItemsFetched = value;
    },
  },
  actions: {
    // get current user data
    async getCurrentUser({commit, state}) {
      if(state.user) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("email", "==", state.user.email));
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          commit("setUserData", doc)
        })
      }else {
        commit("setUserData", null)
      }
    },

    async getRepairOrder({commit}) {
      commit('CLEAR_REPAIR_HISTORY');

      const repairRef = collection(db, 'users', localStorage.getItem('profileId'), 'repair');
      const q = query(repairRef, orderBy('status', 'desc'));
      const getItems = await getDocs(q);
  
      getItems.forEach((item) => {
          this.dispatch('getStatus', { item: item.data(), ref: item.ref })
      })
    },

    async getStatus({ commit }, { item, ref })  {
      const pickupDate = new Date(item.pickupDate);
      const pickupTime = item.pickupTime;
      const pickupDateTime = new Date(`${pickupDate.toDateString()} ${pickupTime}`);
      const currentDate = new Date();
  
      const timeDifference = currentDate - pickupDateTime
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      
      if (hoursDifference >= 1) {
          updateDoc(ref, {
              status: 'Completed'
          })
      } else if (hoursDifference > 0 && hoursDifference < 1) {
          updateDoc(ref, {
              status: 'In progress'
          })
      }

      let status = ''
      if (status) {
        updateDoc(ref, {
          status: status,
        });
        commit('UPDATE_REPAIR_ITEM_STATUS', { index: repairItems.findIndex((item) => item.ref === ref), status });
      }
      commit('PUSH_REPAIR_HISTORY', item);
      commit('SET_REPAIR_HISTORY_FETCHED', true);
  },

  async getOrders({ commit }) {
    const ordersRef = collection(db, 'orders');
    const cartRef = query(ordersRef, where('buyerUid', '==', localStorage.getItem('profileId')));
    const querySnapshot = await getDocs(cartRef);

    let temp = [];
    querySnapshot.forEach((doc) => {
      temp.push(doc.data());
    });

    commit('SET_CART_ITEMS', temp);
    commit('SET_ORDER_HISTORY_FETCHED', true)
  },

   async getProducts ({ commit }) {
    // Check if the products array is already populated in the store
    
    let temp = []

    const productsRef = collection(db, 'products');
    const items = await getDocs(productsRef);
    try {
      items.forEach(async (item) => {
        const itemData = item.data();
        const imageRef = storageRef(storage, item.data().productImg);
        const url = await getDownloadURL(imageRef);
        itemData.productImg = url;
        temp.push(itemData)
      });
    } catch (err) {
      console.error(err);
    }
    console.log('hey')

    commit('ADD_PRODUCT', temp)
    commit('SET_SHOP_ITEMS_FETCHED', true)
  }
  
  },
  modules: {
  }
})
