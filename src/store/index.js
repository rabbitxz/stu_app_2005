import Vue from "vue";
import Vuex from "vuex";

import {getMenuList} from "@/api"
import recursionRoutes from "../utils/recursionRoutes";
import allRoutes from "../router/allRoutes";
import dynamicRoutes from "../router/dynamicRoutes"
import router from "../router";
Vue.use(Vuex);
//从本地存储中取出userInfo--如果有这个就取出来，没有就创建一个数组
let userInfo=localStorage.getItem("qf-userInfo") || "{}"
userInfo=JSON.parse(userInfo)

export default new Vuex.Store({
  state: {
    userInfo,
    menulist:[],
    crumbs:[]
  },
  mutations: {
    //更改state中的userInfo的数据
    SET_USERINFO(state,paylod){
      state.userInfo=paylod
    },
    SET_MENULIST(state,paylod){
      state.menulist=paylod
      let target=dynamicRoutes.find(item=>item.path==="/")//返回动态路由里面路径是/的对象，也就是主页home
      target.children=[...paylod]
      // console.log(target);
      //将动态路由配置通过动态的方式加入到router中，用vuex中的方法addRoutes()，这样才能渲染
      router.addRoutes([...dynamicRoutes])
    },
    SET_CRUMBS(state,payload){
      state.crumbs=payload
    },
  },
  actions: {
    async FETCH_MENULIST({commit}){
      let res=await getMenuList()//返回的是一个promise
      if(res && res.data){//如果服务器传过来有res并且res下有数据
        //进行计算，得出用户菜单
        let usermenu=recursionRoutes(allRoutes,res.data.menuList)//得到用户拥有的路由
        commit("SET_MENULIST",usermenu)
      }
    },
  },
  modules: {}
});
