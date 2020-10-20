import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
//从本地存储中取出userInfo--如果有这个就取出来，没有就创建一个数组
let userInfo=localStorage.getItem("qf-userInfo") || "{}"
userInfo=JSON.parse(userInfo)

export default new Vuex.Store({
  state: {
    userInfo
  },
  mutations: {
    //更改state中的userInfo的数据
    SET_USERINFO(state,paylod){
      state.userInfo=paylod
    }
  },
  actions: {},
  modules: {}
});
