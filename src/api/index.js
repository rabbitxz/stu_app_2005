import axios from "./config"
// 获取登录接口
export const login =(username,password)=>axios({
    url:"/users/login",
    method:"post",
    data:{
        username,password
    }
})
// 获取日志
export const getLoginlog=()=>axios.get("/getloginlog")
// 获取侧边菜单
export const getMenuList=()=>axios.get("/permission/getMenuList")
// 获取班级信息
export const getClassList=(params)=>axios({
    url:"/students/getstulist",
    params
})
// 获取验证码接口
export const getCaptcha=()=>axios.get("/users/getCaptcha")
// 检验验证码接口
export const verifyCaptcha=(captcha)=>axios.get(`/users/verifyCaptcha?captcha=${captcha}`)
// 增加学院信息
export const addstuDetail =(stuDetail)=>axios({
    url:"/students/addstu",
    method:"post",
    data:stuDetail
})

// 删除学员信息
export const delstu=sId=>axios.get(`/students/delstu?sId=${sId}`)

// 编辑学员信息
export const updatestu =(updated={})=>axios({
    url:"/students/updatestu",
    method:"post",
    data:updated
})
// 搜索学员接口
export const searchStu=key=>axios.get(`/students/searchstu?key=${key}`)
// 搜索学员班级信息 /students/getclasses
export const classsearch=()=>axios.get(`/students/getclasses`)



