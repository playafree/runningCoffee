import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    shopbagCount: 0,
    isLoad: false
  },
  mutations:{
    changeShopbagCount(state, data){
      state.shopbagCount = data;
    },
    changeIsLoad(state){
      state.isLoad = true;
    }
  }
})
