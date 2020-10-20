<template>
  <div class="home">
    <el-container>
      <el-aside width="200">
        <h1 class="logo"></h1>
        <!-- 侧边导航栏 -->
        <!--router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" default-active="1" active-text-color="#E47833">
          <el-menu-item index="1" style="padding-left: 20px;">
            <i
              class="iconfont icon-shouye"
              style="margin-right:10px; font-size:20px;"
            ></i>
            <span slot="title">管理首页</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title"  style="padding-left:20px;">
              <i class="iconfont icon-xueyuan" style="margin-right:10px;font-size:20px;"></i>
              <span slot="title" style="color:rgb(78, 91, 248);">学员管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="iconfont icon-wode1" style="margin-right:10px;font-size:20px;"></i>
              <span slot="title">学员项目管理</span>
              </el-menu-item>
            <el-menu-item index="2-2">
               <i class="iconfont icon-kaoqin2" style="margin-right:10px;font-size:20px;"></i>
              <span slot="title">学员资料</span>
              </el-menu-item>
            <el-menu-item index="2-3">
              <i class="iconfont icon-shuju2" style="margin-right:10px;font-size:20px;"></i>
              <span slot="title">学员宿舍</span>
              </el-menu-item>
          </el-submenu>

          <el-menu-item index="3">
            <i class="iconfont icon-kaoqin" style="margin-right: 10px; font-size: 20px;"></i>
            <span slot="title">考勤管理</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="iconfont icon-shuju1" style="margin-right: 10px; font-size: 20px;"></i>
            <span slot="title">数据统计</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="iconfont icon-wode" style="margin-right: 10px; font-size: 20px;"></i>
            <span slot="title">我的中心</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="6"
              ><div class="grid-content">
                <i class="iconfont icon-zhankai z" style="margin-right:10px;font-size:30px;color:#fff;" v-if="isCollapse" @click="zhankai"></i>
                <i class="iconfont icon-shouqi s" style="margin-right:10px;font-size:30px;color:#fff;" v-else @click="shouqi"></i>
                </div
            ></el-col>
            <el-col :span="6"
              ><div class="grid-content">
                千锋管理系统
              </div></el-col
            >
            <el-col :span="6"
              ><div class="grid-content">
                <el-avatar
                :size="40"
                fit="fit"
                src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3300740548,487908546&fm=26&gp=0.jpg"
                ></el-avatar>
                <span>欢迎您:</span>
                <b class="nickname">{{userInfo.nickname}}</b>
                <span class="quit" @click="quit">退出</span>
                </div
            ></el-col>
          </el-row>
        </el-header>
        <!-- 主体 -->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import {getLoginlog} from "@/api"
import router from "../../router"
import {mapState} from "vuex"
export default {
  data() {
    return {
      isCollapse: false
    };
  },
  computed:{
    ...mapState(["userInfo"])
  },
  mounted(){
    getLoginlog()
    .then(res=>{
      console.log(res)
    })
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    zhankai(){
      this.isCollapse=false
    },
    shouqi(){
      this.isCollapse=true
    },
    quit(){
      //退出
      //1.清楚token和userInfo
      //2.跳转到登录页面
      localStorage.removeItem("qf-2005")
      localStorage.removeItem("qf-userInfo")
      this.$router.push("/login")
       this.$message({
                message: "退出成功",
                type: "success"
              });
      
    }
  }
};
</script>
<style scoped>
.el-avatar{
  vertical-align: middle;
  margin:8px;
}
.quit{
  margin:6px;
  cursor: pointer;
}
.z,.s{
  position: absolute;
 left:-10px;
 top:0;
}
.grid-content {
  margin-top: -10px;
}
.logo {
  width: 200;
  background-color: blue;
  height: 60px;
  /* background-color: linear-gradient(135deg, #4c67ff, #5635df); */
  background-image: url("../../assets/imgs/logo.png");
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center;
}
.el-header {
  color: #fff;
  background: linear-gradient(135deg, #4c67ff, #5635df);
}
.el-row {
  margin-bottom: 20px;
  box-sizing: border-box;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-header,
.el-footer {
  /* background-color: #b3c0d1; */
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align:left;
}
.el-menu-item{
   color:rgb(78, 91, 248);
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
i.iconfont{
  color: #4e5bf8;
}

</style>



