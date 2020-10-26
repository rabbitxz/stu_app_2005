<template>
  <el-table :data="loginlog" border style="width: 100%" v-loading="loading">
    <el-table-column
      prop="username"
      label="登入账户"
      align="center"
      width="180"
    >
    </el-table-column>
    <el-table-column
      prop="lastLogin.ip"
      label="上次登录ip"
      align="center"
      width="180"
    >
    </el-table-column>
    <el-table-column
      prop="lastLogin.loginTime"
      label="上次登入时间"
      align="center"
      width="180"
    >
    </el-table-column>
    <el-table-column prop="nowLogin.ip" align="center" label="本次登入ip">
    </el-table-column>
    <el-table-column
      prop="nowLogin.loginTime"
      align="center"
      label="本次登入时间"
    >
    </el-table-column>
  </el-table>
</template>
    <style scoped>
  .el-table{
    margin-top:20px;
  }
</style>
<script>
import { getLoginlog } from "@/api";
export default {
  data() {
    return {
      loginlog: [],
      loading: true
    };
  },
  created() {
    getLoginlog().then(res => {
      this.loading=false
      this.loginlog = res.data.data;
    });
  }
};
</script>