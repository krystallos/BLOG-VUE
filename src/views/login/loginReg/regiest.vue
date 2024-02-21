<template>
  <div class="main">
    <div style="padding: 100px;"></div>
    <div class="box">
      <div class="heardBox">
        <h1 style="color: aliceblue;">新用户注册</h1>
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
      <div class="buttonBox">
        <el-button v-loading="loading" @click="regiestUser" class="buttonClass" type="primary">注册</el-button>
      </div>
      <div class="footBox">
        <el-link :underline="false" type="primary"><router-link to="/login">已有账号？前往登入！</router-link></el-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { regiestApi } from '@/api/regiest'
  import settings from '@/settings';

  export default {
    name: 'regiest',
    data() {
      return{
        userName: '',
        userEmail: '',
        userPhone: '',
        userPw: '',
        userPwTo: '',
        loading: false,
      }
    },
    methods: {
      regiestUser(){
        this.loading = true;
        if(this.userName == null || this.userName.length == 0){
          this.$message.warning("用户名不能为空");
          return;
        }
        if(this.userEmail == null || this.userEmail.length == 0){
          this.$message.warning("邮箱不能为空");
          return;
        }
        if(this.userPhone == null || this.userPhone.length == 0){
          this.$message.warning("电话不能为空");
          return;
        }
        if(this.userPw == null || this.userPwTo == null){
          this.$message.warning("密码不能为空");
          return;
        }else if(this.userPw.length < 5){
          this.$message.warning("密码长度至少6位");
          return;
        }else if(this.userPw != this.userPwTo){
          this.$message.warning("两次密码不一致");
          return;
        }
        regiestApi({userName: this.userName, email: this.userEmail, phone: this.userPhone, userPassWord: this.userPw}).then((data) => {
          this.loading = false;
          if(data.code == 200){
            this.$message.success(data.textMsg);
            setTimeout(() => {
               this.$router.push({ path: '/login' })
            }, 2000)
          }
        })
      }
    }
  }
</script>

<style scoped>

  .main{
    height: 100%;
    background-color: #2d3a4b;
  }

  .box{
    width: 30%;
    margin: 0 auto;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background-color: #2f3d50;
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

  .buttonBox{
    width: 300px;
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
