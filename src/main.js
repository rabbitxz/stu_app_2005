import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入element ui 
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import "@/assets/base.css"
import "@/assets/reset.css"
import "@/assets/iconFonts/iconfont.css"
Vue.config.productionTip = false;

import "./utils/recursionRoutes"
Vue.use(ElementUI);

import qfSubMenu from "qf-sub-menu" //引入侧边栏菜单的组件
Vue.use(qfSubMenu)

// 引入has.js--判断吧阿彬彬是否禁用的方法
import has from "./utils/has"
Vue.prototype.$has = has;
//导入进度条nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//导航守卫，前置钩子
// 定义全局自定义指令，判断是否具备相应按钮权限
Vue.directive("haspermission",{
  bind(el,binding,VNode){
    // 获取localstrorage中的按钮权限名称
    let buttons=localStorage.getItem("qf-permission-buttons")
    if(!has(buttons,binding.value)){
       console.log(el.className)
      let className=el.className;
      el.className=className+" "+"is-disabled"
      console.log(el.className)
      
      el.disabled=false
      
    }
  }
})
router.beforeEach((to, from, next) => {
  NProgress.start();
  //用户登录之后才会有token，判断是否登录成功就放行
  let token=localStorage.getItem("qf-2005") || null
  if(token){//判断是否登录成功就放行
    if(store.state.menulist.length==0){//判断是否有侧边的菜单
      store.dispatch('FETCH_MENULIST')//没有侧边菜单-使用action中的方法进行赋值
      .then(()=>{
       next({path:to.path})
      })//放行，解决addRouter出现空白页问题 next传入的参数就是要进入页面的路由信息
    }else{
      next()
    }
    
  }else{//否则，说明没有token,没有登录，判断要去的路径是否是登录页面，如果是也放行，
    if(to.path==="/login"){
      next()
    }else{//否则的话说明用户在地址栏输入其他地址，直接跳转到登录页面
      console.log(to.path);
      next({path:"/login"})
    }
  }
  
})

//路由后置钩子
router.afterEach( (to,from)=> {
  NProgress.done();  //进度条消失
//  console.log(to)
 let crumbs=to.matched.slice(1)//to下面的matched，是一个数组，每次数组的第一个数据都是空的，所以从第一个开始截取
//  console.log(crumbs)
  store.commit("SET_CRUMBS",crumbs)//将返回来的数据传给store中的SET_CRUMBS返回的就是当前路由里面的菜单
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

