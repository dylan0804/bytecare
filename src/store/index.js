import { createStore } from 'vuex'
import db from '@/firebase/firebaseInit'
import { auth } from '@/firebase/firebaseInit'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default createStore({
  state: {
    user: null,
    profileId: null,
    profileFirstName: null,
    profileLastName: null,
    profileEmail: null,
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
