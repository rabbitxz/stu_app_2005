<template>
  <div class="home">
    <el-container>
      <el-aside width="200">
        <h1 class="logo"></h1>
        <!-- 侧边导航栏 -->
        <!--router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <el-menu
          class="el-menu-vertical-demo"
          :default-active="$route.path"
          :collapse="isCollapse"
          :router="true"
          active-text-color="#E47833"
          text-color=" #4e5bf8"
        >
          <qf-sub-menu :sideMenu="menulist"></qf-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="6"
              ><div class="grid-content">
                <i
                  class="iconfont icon-zhankai z"
                  style="margin-right:10px;font-size:30px;color:#fff;"
                  v-if="isCollapse"
                  @click="zhankai"
                ></i>
                <i
                  class="iconfont icon-shouqi s"
                  style="margin-right:10px;font-size:30px;color:#fff;"
                  v-else
                  @click="shouqi"
                ></i></div
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
                <b class="nickname" @click="$router.push('/Mine')">{{ userInfo.nickname }}</b>
                <span class="quit" @click="quit">退出</span>
              </div></el-col
            >
          </el-row>
        </el-header>
        <!-- 主体 -->
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:item.path}" v-for="(item,index) in crumbs" :key="index">
              {{item.meta.name}}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getLoginlog } from "@/api";
import router from "../../router";
import { mapState } from "vuex";
export default {
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    ...mapState(["userInfo", "menulist","crumbs"])
  },
  
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    zhankai() {
      this.isCollapse = false;
    },
    shouqi() {
      this.isCollapse = true;
    },
    quit() {
      //退出
      //1.清除token和userInfo
      //2.跳转到登录页面
      localStorage.removeItem("qf-2005");
      localStorage.removeItem("qf-userInfo");
      this.$router.push("/login");
      
      this.$message({
        message: "退出成功",
        type: "success"
      });
      window.location.reload();
    }
  }
};
</script>
<style scoped>
/* 图片头像样式 */
.el-avatar {
  vertical-align: middle;
  margin: 8px;
}
/* 退出按钮样式 */
.quit {
  margin: 6px;
  cursor: pointer;
}
/* 展开收齐按钮样式 */
.z,
.s {
  position: absolute;
  left: -10px;
  top: 0;
}
/* 头部里面的栅栏样式，总体偏下，向上移动 */
.grid-content {
  margin-top: -10px;
}
/* 左边logo图片等样式 */
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
/* 头部栏样式-字体颜色和背景色 */
.el-header {
  color: #fff;
  background: linear-gradient(135deg, #4c67ff, #5635df);
}
.el-row {
  /* margin-bottom: 20px; */
  box-sizing: border-box;
}
.el-col {
  border-radius: 4px;
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
/* 头部样式 */
.el-header,
.el-footer {
  /* background-color: #b3c0d1; */
  color: #333;
  text-align: center;
  line-height: 60px;
}
/* 侧边栏样式 */
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: left;
}
/* 菜单样式 */
.el-menu-item {
  color: rgb(78, 91, 248);
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
.nickname{
  cursor: pointer;
}

</style>



