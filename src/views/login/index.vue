<template>
  <div class="login">
    <img
      class="login_bg"
      src="@/assets/img/login/login_bg.png"
      alt
    >
    <img
      class="login_font"
      src="@/assets/img/login/login_font.png"
      alt
    >
    <el-form
      ref="AccountFrom"
      :model="account"
      :rules="rules"
      label-position="right"
      label-width="70px"
      status-icon
      class="demo-ruleForm login-container"
    >
      <h3 class="title">登录</h3>
      <el-form-item
        prop="userName"
        label=""
        label-width="0"
      >
        <el-input
          type="text"
          v-model="account.userName"
          auto-complete="off"
          placeholder="手机"
        >
          <template slot="prepend"><img
              src="@/assets/img/login/account.png"
              alt=""
            ></template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="passWord"
        label=""
        label-width="0"
      >
        <el-input
          type="password"
          v-model="account.passWord"
          auto-complete="off"
          placeholder="密码"
        >
          <template slot="prepend"><img
              src="@/assets/img/login/password_icon.png"
              alt=""
            ></template>
        </el-input>
      </el-form-item>
      <el-form-item
        style="width:100%;"
        label-width="0"
      >
        <el-button
          class="login_btn"
          type="primary"
          style="width:100%;"
          :disabled="buttonDisabledStatus"
          @click.native.prevent="handleLogin"
          :loading="loading"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getCookie, setCookie } from "@/plugins/util"; //引用刚才我们创建的util.js文件，并使用getCookie方法
export default {
  name: "Login",
  data() {
    return {
      buttonDisabledStatus: false, //初始应为true，测试阶段设为false，不对验证码进行校验
      loading: false,
      redirect: "",
      account: {
        userName: "", //11111111111 //admin //18109271742
        passWord: ""
      },
      captcha: "",
      rules: {
        userName: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {},

  methods: {
    handleLogin(ev) {
      window.sessionStorage.responseType = "json";
      this.$refs.AccountFrom.validate(valid => {
        if (valid) {
          this.logining = true;
          var loginParams = {
            phone: this.account.userName,
            passwd: this.account.passWord
          };
          window.sessionStorage.setItem("responseType", "form");
          this.$store
            .dispatch("LoginByUsername", loginParams)
            .then(res => {
              this.loading = false;
              this.$notify({
                title: "提示",
                message: res.message,
                type: !!res && res.code === 20000 ? "success" : "warning"
              });
              if (!!res && res.code !== 20000) {
                return;
              } else {
                this.$router.push({ path: "/dashboard" });
              }
            })
            .catch(err => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style>
body {
  background: #fff;
}
.el-input-group__append,
.el-input-group__prepend {
  background-color: #fff;
}
</style>
<style lang="scss" scoped>
.login {
  .login_bg {
    width: 100%;
    min-height: 740px;
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 0;
  }
  .login_font {
    width: 35%;
    height: auto;
    z-index: 2;
    position: absolute;
    left: 0px;
    top: 10%;
    right: 0px;
    margin: auto;
  }
  .login-container {
    position: absolute;
    top: 28%;
    left: 0px;
    right: 0px;
    width: 23%;
    z-index: 2;
    margin: auto;
    vertical-align: middle;
    text-align: center;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 10px auto;
    min-width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #fafdfd;
    .title {
      margin: 0px auto 20px auto;
      text-align: center;
      font-size: 22px;
      color: cornflowerblue;
    }
    .login_btn {
      background: #3f7cf7;
      padding: 11px 10px;
      border: none;
      font-size: 16px;
    }
  }
}
</style>