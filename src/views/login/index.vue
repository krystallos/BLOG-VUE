<template>
  <div class="body" v-loading="loading">
    <div class="container right-panel-active">
      <!-- Sign Up -->
      <div class="container__form container--signup form">
          <h2 class="form__title">我带你们答</h2>
            <el-input
              style="width: 100%;padding-bottom: 15px;"
              ref="logname"
              v-model="loginForm.logname"
              placeholder="电话/邮箱"
              name="logname"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
            <el-input
              style="width: 100%;padding-bottom: 15px;"
              ref="logpass"
              v-model="loginForm.logpass"
              type="password"
              placeholder="密码"
              name="logpass"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
          <el-checkbox style="margin-left: 85%;" v-model="checkedPassWord" @change="handleCheckChange">记住密码</el-checkbox>
          <button class="btn" @click="handleLogin">登入</button>
          <div class="tips">
            <el-link :underline="false" type="primary"><a @click="onView(1)">注册用户</a></el-link>
            <span> | </span>
            <el-link :underline="false" type="primary"><router-link to="/getBackPw">忘记密码？</router-link></el-link>
          </div>
      </div>

      <!-- Sign In -->
      <div class="container__form container--signin">
        <div class="form">
          <div class="heardBox">
            <h1 style="color: black;">新用户注册</h1>
          </div>
          <div class="inputBox">
            <el-input placeholder="用户称呼" v-model="userName">
              <template slot="prepend">用户名</template>
            </el-input>
            <div style="padding-top: 10px;"></div>
            <el-input placeholder="登入用账号信息" v-model="userEmail" type="email">
              <template slot="prepend">邮箱</template>
            </el-input>
            <div style="padding-top: 10px;"></div>
            <el-input placeholder="登入用账号信息" v-model="userPhone" type="number">
              <template slot="prepend">电话</template>
            </el-input>
            <div style="padding-top: 10px;"></div>
            <el-input placeholder="登入用密码信息" v-model="userPw" :show-password="true" type="password">
              <template slot="prepend">密码</template>
            </el-input>
            <div style="padding-top: 10px;"></div>
            <el-input placeholder="二次确认密码" v-model="userPwTo" :show-password="true" type="password">
              <template show-password slot="prepend">确认密码</template>
            </el-input>
            <div style="padding-top: 10px;"></div>
          </div>
          <button class="btn" @click="regiestUser">注册</button>
          <div class="footBox">
            <el-link :underline="false" type="primary"><a @click="onView(2)">已有账号？前往登入！</a></el-link>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
  import {getIpApi} from '@/api/user'
  import { regiestApi } from '@/api/regiest'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        logname: '',
        logpass: '',
        ipConfig: '',
        areaConfig: ''
      },
      loading: false,
      redirect: undefined,
      ipConfig: '',
      areaConfig: '',
      checkedPassWord: false,

      userName: '',
      userEmail: '',
      userPhone: '',
      userPw: '',
      userPwTo: '',
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    setTheme() {
      //我这里是一个按时间 月 修改主题
      const date = new Date();
      let time = date.getHours();
      if(time >= 0 & time <= 6){
        document.documentElement.setAttribute("theme","time-0");
      }else if(time >= 7 & time <= 10){
        document.documentElement.setAttribute("theme","time-1");
      }else if(time >= 11 & time <= 16){
        document.documentElement.setAttribute("theme","time-2");
      }else if(time >= 17 & time <= 20){
        document.documentElement.setAttribute("theme","time-3");
      }else if(time >= 21 & time <= 23){
        document.documentElement.setAttribute("theme","time-4");
      }
    },
    onView(viewType){
      const container = document.querySelector(".container");
      if(viewType === 1){
        container.classList.remove("right-panel-active");
      }else{
        container.classList.add("right-panel-active");
      }
    },
    handleLogin() {
      this.loading = true
      if(this.loginForm.logname == null || this.loginForm.logname.length == 0){
        this.$message.warning("请输入用户名");
        this.loading = false;
        return;
      }
      if(this.loginForm.logpass == null || this.loginForm.logpass.length == 0){
        this.$message.warning("请输入密码");
        this.loading = false;
        return;
      }
      this.$store.dispatch('user/login', this.loginForm).then(() => {
        if(this.checkedPassWord){
          localStorage.setItem("userNameKey", this.loginForm.logname);
          localStorage.setItem("userPassKey", this.loginForm.logpass);
        }else{
          localStorage.removeItem("userNameKey");
          localStorage.removeItem("userPassKey");
        }
        this.$message.success("欢迎回来");
        setTimeout(() => {
          this.$router.push({ path: '/blosMain' })
          this.loading = false
        }, 1500)
      }).catch(() => {
        this.loading = false
      })
    },
    handleCheckChange(){
      if(this.checkedPassWord){
        localStorage.setItem("userSaveKey", this.checkedPassWord);
        this.$message.warning("请勿在非自己使用的电脑保存账号密码");
      }else{
        localStorage.removeItem("userSaveKey");
      }
    },
    regiestUser(){
      this.loading = true;
      if(this.userName == null || this.userName.length == 0){
        this.$message.warning("用户名不能为空");
        this.loading = false;
        return;
      }
      if(this.userEmail == null || this.userEmail.length == 0){
        this.$message.warning("邮箱不能为空");
        this.loading = false;
        return;
      }
      if(this.userPhone == null || this.userPhone.length == 0){
        this.$message.warning("电话不能为空");
        this.loading = false;
        return;
      }
      if(this.userPw == null || this.userPwTo == null){
        this.$message.warning("密码不能为空");
        this.loading = false;
        return;
      }else if(this.userPw.length < 5){
        this.$message.warning("密码长度至少6位");
        this.loading = false;
        return;
      }else if(this.userPw != this.userPwTo){
        this.$message.warning("两次密码不一致");
        this.loading = false;
        return;
      }
      regiestApi({userName: this.userName, email: this.userEmail, phone: this.userPhone, userPassWord: this.userPw}).then((data) => {
        this.loading = false;
        if(data.code == 200){
          this.$message.success(data.textMsg);
          setTimeout(() => {
             // this.$router.push({ path: '/login' })
             this.userName = null;
             this.userEmail = null;
             this.userPhone = null;
             this.userPw = null;
             this.userPwTo = null;
             this.onView(0)
          }, 1000)
        }
      })
    }
  },
  created(){
    this.checkedPassWord = localStorage.getItem("userSaveKey") == null ? false: true;
    if(localStorage.getItem("userNameKey") != null){
      this.loginForm.logname = localStorage.getItem("userNameKey");
    }
    if(localStorage.getItem("userPassKey") != null){
      this.loginForm.logpass = localStorage.getItem("userPassKey");
    }
    getIpApi().then(response => {
      let {ip , data } = response;
      this.loginForm.ipConfig = ip;
      this.loginForm.areaConfig = data.continent + "-" + data.country +
      "-" + data.prov + "-" + data.city +
      "[所属网络集团:" + data.isp + "][经度:" + data.lng + ",纬度:" + data.lat + "]" ;
    })
  },
  mounted(){
    this.setTheme();
  }
}
</script>

<style lang="scss" scoped>

  :root {
    /* RADII */
    --button-radius: 0.7rem;

    /* SIZES */
    --max-width: 758px;
    --max-height: 420px;

    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    --login-back-image: var(--login-back-image-month-4);
  }

  @import url(../../styles/login/theme.css);

  .body {
    background: var(--login-back-image);
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: grid;
    height: 100vh;
    place-items: center;
  }

  .container {
    height: var(--max-height);
    max-width: var(--max-width);
    overflow: hidden;
    width: 100%;
    opacity: 0.8;
  }

  .container__form {
    background-color: #e9e9e9;
    height: 100%;
    position: absolute;
    top: 0;
    transition: all 0.6s ease-in-out;
  }

  .container--signin {
    left: 0%;
    width: 40%;
    opacity: 1;
    z-index: 1;
  }

  .container.right-panel-active .container--signin {
    opacity: 0;
    transform: translateX(150%);
  }

  .container--signup {
    left: 20%;
    opacity: 0;
    width: 40%;
    z-index: 2;
  }

  .container.right-panel-active .container--signup {
    animation: show 0.6s;
    opacity: 1;
    transform: translateX(100%);
    z-index: 5;
  }

  .btn {
    background-color: #0367a6;
    background-image: linear-gradient(90deg, #0367a6 0%, #008997 74%);
    border-radius: 20px;
    border: 1px solid #0367a6;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
    padding: 0.9rem 4rem;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
  }

  .form>.btn {
    margin-top: 1.5rem;
  }

  .btn:active {
    transform: scale(0.95);
  }

  .btn:focus {
    outline: none;
  }

  .form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0 3rem;
    height: 100%;
    text-align: center;
  }

  .input {
    background-color: #fff;
    border: none;
    padding: 0.9rem 0.9rem;
    margin: 0.5rem 0;
    width: 100%;
  }

  @keyframes show {
    0%,
    49.99% {
      opacity: 0;
      z-index: 1;
    }

    50%,
    100% {
      opacity: 1;
      z-index: 2;
    }
  }

  .tips {
    text-align: left;
    font-size: 15px;
    font-weight: 600;
    color: #00b3ff;
    margin-bottom: 10px;
    margin-top: 30px;

    span {
      &:first-of-type {
        margin-right: 10px;
        margin-left: 10px;
      }
    }
  }

  .heardBox{
    padding-top: 10px;
    text-align: center;
    font-size: 15px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  .inputBox{
    width: 95%;
    margin: 0 auto;
  }

  .buttonClass{
    width: 300px;
  }

  .footBox{
    width: 200px;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 0 auto;
  }

</style>
