<template>
  <div class="login-page">
    <div class="left"></div>
    <!-- status-icon 判断输入框的后面是否有图标X -->
    <div class="login_container">
      <h1 class="title">千锋管理系统</h1>
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        label-width="100px"
        class="demo-loginForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
<el-form-item label="验证码" prop="captcha"  @keydown.enter.native="submitForm('loginForm')">
          <el-input
            type="text"
            v-model="loginForm.captcha"
            class="captcha"
            autocomplete="off"
          ></el-input>
          <span class="captcha-svg" v-html="captchasvg" @click="rersh"></span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <video
      src="@/assets/video/bg_video.mp4"
      class="bg_video"
      muted
      autoplay
      loop
      preload="auto"
    ></video>
  </div>
</template>
<style scoped>
.title {
  color: #fff;
  margin-top: 100px;
  margin-bottom: 50px;
  text-align: center;
}
.login-page {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.login_container {
  z-index: 9;
  width: 25rem;
  height: 30.47619048rem;
  position: absolute;
  top: 50%;
  left: 75%;
  transform: translate(-50%, -50%);
  border-radius: 11px;
  background: rgba(0, 0, 0, 0.2);
}
.bg_video {
  display: block;
  margin: auto;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 0;
  left: 0;
}
.el-form-item__label {
  color: #fff;
}
.el-button {
  width: 83%;
  background: linear-gradient(90deg, #1596fb, #002dff);
}
.left {
  z-index: 5;
  width: 50%;
  height: 100%;
  background-image: url("../../assets/imgs/bg2.png");
  background-repeat: no-repeat;
  background-size: 50%;
  position: absolute;
  opacity: 0.7;
  background-position: 60% 65%;
}
.captcha-svg{
  background-color: #fff;
  display: inline-block;
  height: 44px;
 
}
</style>
<script>
import { login,getCaptcha,verifyCaptcha } from "@/api";
import {mapMutations} from "vuex"
export default {
  /**
   * @param {object} rule 表单验证对象
   * @param {String} value 输入框中输入的内容
   * @param {function} callback 验证通过不传参，验证不通过传参
   */
  data() {
    var validateusername = (rule, value, callback) => {
      // 用户名正则，4到16位（字母，数字，下划线，减号）
      let uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
      if (!value) {
        //正则：!uPattern.test(value)
        callback("4到16位（字母，数字，下划线，减号）");
      } else {
        callback();
      }
    };
    // 密码验证
    var validatepassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    // 校验 验证码
    var validatecaptcha = (rule, value, callback) => {
      if (value === "" || value.length!==5) {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        captcha:"",
      },
      captchasvg:"",
      rules: {
        username: [{ validator: validateusername, trigger: "blur" }],
        password: [{ validator: validatepassword, trigger: "blur" }],
        captcha: [{ validator: validatecaptcha, trigger: "blur" }]
      }
    };
  },
  methods: {
    //点击验证码图片刷新验证码
    rersh(){
      this.SET_CAPTCHA()
    },
    //封装刷新获取验证码
    SET_CAPTCHA(){
      getCaptcha()
      .then(res=>{
        this.captchasvg=res.data.img
      })
    },
    ...mapMutations(['SET_USERINFO']),
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {//因为要先判断验证码所以异步
        if (valid) {
          
          let res=await verifyCaptcha(this.loginForm.captcha)
          if(!res.data.state){
            //验证码不正确，提示并终止执行进入页面
            this.$message.error("验证码不正确");
              return
          }
          
          // 点击登录出现loding页面
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          //表示本地校验成功
          //获取用户名和密码发送到服务器，并创建token到本地
          let { username, password } = this.loginForm;
          login(username, password).then(res => {
            //关闭loging页面--发送登录请求时关闭
            loading.close();
            if (res.data.state) {
              // 创建token到本地,将userInfo也存储到本地中（为了显示其用户昵称等信息）
              localStorage.setItem("qf-2005", res.data.token);
              localStorage.setItem("qf-userInfo", JSON.stringify(res.data.userInfo));
              localStorage.setItem("qf-permission-buttons", JSON.stringify(res.data.permission.buttons));
              //更改vuex中state中userInfo的值
              this.SET_USERINFO(res.data.userInfo)
              this.$router.push("/");
              this.$message({
                message: "登录成功",
                type: "success"
              });
            } else {
              this.$message.error("用户名或密码错误");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 组建中的方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  // 调用验证码方法
  mounted () {
      this.SET_CAPTCHA()
    },
};
</script>

