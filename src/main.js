import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import "@/assets/base.css"
import "@/assets/reset.css"
import "@/assets/iconFonts/iconfont.css"
Vue.config.productionTip = false;

//导航守卫，前置钩子
router.beforeEach((to, from, next) => {
  //用户登录之后才会有token，判断是否登录成功就放行
  let token=localStorage.getItem("qf-2005")
  if(token){//判断是否登录成功就放行
    next()
  }else{//否则，说明没有token,没有登录，判断要去的路径是否是登录页面，如果是也放行，
    if(to.path==="/login"){
      next()
    }else{//否则的话说明用户在地址栏输入其他地址，直接跳转到登录页面
      console.log(to.path);
      next({path:"/login"})
    }
  }
  
})

Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

