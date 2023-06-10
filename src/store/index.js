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

    completedRepairs: 0,
    ongoingRepairs: 0,
    completedOrdersCountFetched: false,
    repairHistory: [],
    orderHistory: [],
    repairHistoryFetched: false,
    orderHistoryFetched: false,

    //shop
    shopItems: [],
    completedOrders: 0,
    ongoingOrders: 0,
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
    CLEAR_COMPLETED_REPAIRS(state) {
      state.completedRepairs = 0;
    },
    CLEAR_ONGOING_REPAIRS(state) {
      state.ongoingRepairs = 0;
    },
    CLEAR_COMPLETED_ORDERS(state) {
      state.completedOrders = 0;
    },
    CLEAR_ONGOING_ORDERS(state) {
      state.ongoingOrders = 0;
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
    INCREMENT_COMPLETED_REPAIRS(state) {
      state.completedRepairs++;
    },
    SET_COMPLETED_REPAIRS(state, count) {
      state.completedRepairs = count;
    },
    SET_COMPLETED_ORDERS_COUNT_FETCHED(state, value) {
      state.completedOrdersCountFetched = value;
    },
    INCREMENT_ONGOING_REPAIRS(state) {
      state.ongoingRepairs++;
    },
    DECREMENT_ONGOING_REPAIRS(state) {
      state.ongoingRepairs--;
    },
    INCREMENT_ONGOING_ORDERS(state) {
      state.ongoingOrders++;
    },
    INCREMENT_COMPLETED_ORDERS(state) {
      state.completedOrders++;
    },
    DECREMENT_ONGOING_ORDERS(state) {
      state.ongoingOrders--;
    },
    DECREMENT_COMPLETED_ORDERS(state) {
      state.ongoingOrders--;
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
      commit('CLEAR_COMPLETED_REPAIRS')
      commit('CLEAR_ONGOING_REPAIRS')

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

      if(item.status === 'Waiting for pick up' || item.status === 'In progress') {
        commit('INCREMENT_ONGOING_REPAIRS')
      }
      
      if (hoursDifference >= 1) {
          if(item.status === 'In progress') {
            commit('DECREMENT_ONGOING_REPAIRS')
          }
          updateDoc(ref, {
              status: 'Completed'
          })
          commit('INCREMENT_COMPLETED_REPAIRS');
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
    commit('CLEAR_ONGOING_ORDERS')
    commit('CLEAR_COMPLETED_ORDERS')

    const ordersRef = collection(db, 'orders');
    const cartRef = query(ordersRef, where('buyerUid', '==', localStorage.getItem('profileId')));
    const querySnapshot = await getDocs(cartRef);

    let temp = [];
    querySnapshot.forEach(async (doc) => {
      // this.dispatch('updateStatus', { item: doc.data(), ref: doc.ref })
      temp.push(doc.data());
      commit('INCREMENT_ONGOING_ORDERS')
    });

    commit('SET_CART_ITEMS', temp);
    commit('SET_ORDER_HISTORY_FETCHED', true)

  },

  // async updateStatus({}, { item, ref }) {
  //   const orderDate = new Date(item.orderDate)
  //   let deliveryDate = new Date()
  //   const currentDate = new Date()

  //   if(item.deliveryType === 'Next Day') {
  //     deliveryDate.setDate(orderDate.getDate() + 1)
  //   }else if(item.deliveryType === 'Standard') {
  //     deliveryDate.setDate(orderDate.getDate() + 2)
  //   }

  //   if(currentDate >= deliveryDate) {
  //     updateDoc(ref, {
  //       status: 'Delivered',
  //     });
  //   }

  //   console.log(orderDate)
  // },

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
