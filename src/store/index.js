import { createStore } from 'vuex'
import db from '@/firebase/firebaseInit'
import { collection, query, where, getDocs } from 'firebase/firestore'

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
    problem: ''
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
      state.profileId = payload.id
      state.profileFirstName = payload.data().firstName;
      state.profileLastName = payload.data().lastName;
      state.profileEmail = payload.data().email;
      console.log(state.profileId)
      console.log(state.profileFirstName)
      console.log(state.profileLastName)
      console.log(state.profileEmail)
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
    }
  },
  actions: {
    // get current user data
    async getCurrentUser({commit, state}) {
      if(state.user) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("email", "==", state.user.email));
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          console.log(`${state.user.email} is the current user!!!`)
          commit("setUserData", doc)
        })
      }else {
        commit("setUserData", null)
      }
    }
  },
  modules: {
  }
})
