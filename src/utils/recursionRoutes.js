import allRoutes from "../router/allRoutes"
//根据服务器用户返回的menuList数据和allRoutes进行匹配，得到符合当前用户的有效路由配置
const recursionRoutes=(allRoutes,menuList)=>{
    let userRoutes = [];//最后对比的结果放到这个里面
    allRoutes.forEach(item=>{//item是有效的路由配置，是一个对象
        menuList.forEach(v=>{
            if(item.meta.name===v.name){//判断服务器返回的 "name": "考勤管理"是否和有效路由中的匹配
            if(v.children && Array.isArray (v.children)){//当服务器中有子名字时
                item.children=recursionRoutes(item.children,v.children)//递归自己，循环子路由，满足条件会返回新数组，并将返回的正确子路由再赋值给有效路由
            }
            userRoutes.push(item)
            }
        })
    })
    return userRoutes
}

export default recursionRoutes