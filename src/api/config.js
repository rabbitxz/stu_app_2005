import axios from "axios"
import router from "./../router"
import ElementUI from "element-ui"
//判断当前模式--如果是开发模式路径就是/api
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? "/api" : "http://www.chst.vip"

axios.defaults.withCredentials=true//允许携带cookie

//拦截器---每次请求服务都要携带token（登录注册页面除外）
axios.interceptors.request.use(config=>{
    //判断是否是登录页面，如果是就直接放行--登录注册不需要携带token
    if(config.url==="/users/login"){
        return config
    }else{
        //获取token
        let token=localStorage.getItem("qf-2005")
        //config指的是每一个请求，为其新创建一个属性authorization并将token赋给他
        config.headers['authorization'] = token;
        //放行
        return config
    }
})
axios.interceptors.response.use(config=>{
    //当localstroage里面的数据和请求服务时的token不对应时说明token失效
    if(config.data.code==="1004" || config.data.code==="10022"){
        //当前后台中1004代表校验失败，10022代表检验失败，提示错误，并跳转到登录页面
        ElementUI.Message.error("登录过期，请重新登录")
        //跳转到登录页面
        router.push("/login")
    }
    return config
})
//如果服务器4秒请求不到就会报错不在请求
axios.create({
    timeout:4000
})

//将axios暴露出去
export default axios