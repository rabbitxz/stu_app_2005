
const dynamicRoutes=[
    {
    path: "/",
    redirect: "/Welcome",
    name: "Home",
    component: ()=>import(/*wekpackChunkName: "home" */"../pages/Home"),
    children:[]
  },
  {
    path:"*",
    component:()=>import(/*wekpackChunkName: "page4.4" */"../pages/page404")
  }
]
export default dynamicRoutes