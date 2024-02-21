<template>
  <div style="background-color: white;">
    <div style="height: 35px;"></div>
    <div class="topDiv">
      <h1 class="topText">找回密码</h1>
    </div>
    <div style="height: 35px;"></div>
    <div>
      <el-steps :active="active" align-center>
        <el-step title="输入邮箱" description="输入您的注册邮箱"></el-step>
        <el-step title="邮箱验证" description="向邮箱发送验证码并验证"></el-step>
        <el-step title="修改密码" description="将旧密码改为新密码"></el-step>
      </el-steps>
    </div>
    <div style="height: 35px;"></div>
    <div class="middleDiv">
      <div class="steps1" v-if="active == 1">
        <el-input v-model="email" placeholder="请输入邮箱" maxlength="30" show-word-limit></el-input>
      </div>
      <div class="steps2" v-if="active == 2">
        <el-input v-model="email" :disabled="true"></el-input>
        <div style="height: 25px;"></div>
        <el-input v-model="code" placeholder="请输入验证码" maxlength="6" show-word-limit></el-input>
      </div>
      <div class="steps3" v-if="active == 3">
        <el-input v-model="email" :disabled="true"></el-input>
        <div style="height: 25px;"></div>
        <el-input placeholder="登入用密码信息" v-model="userPw" :show-password="true" type="password" maxlength="30" show-word-limit>
          <template slot="prepend">密码</template>
        </el-input>
        <div style="height: 25px;"></div>
        <el-input placeholder="二次确认密码" v-model="userPwTo" :show-password="true" type="password" maxlength="30" show-word-limit>
          <template show-password slot="prepend">确认密码</template>
        </el-input>
      </div>
    </div>
    <div style="height: 35px;"></div>
    <div class="bottomDiv">
      <el-button class="bottomButton" type="primary" v-if="active == 1" style="margin-top: 12px;" @click="sendGoBackEmail" plain>发送验证码</el-button>
      <el-button class="bottomButton" type="primary" v-if="active == 2" style="margin-top: 12px;" @click="next" plain :loading="loadNext">下一步</el-button>
      <el-button class="bottomButton" type="primary" v-if="active == 3" style="margin-top: 12px;" @click="amendPass" plain :loading="loadAmend">修改密码</el-button>
    </div>
  </div>
</template>

<script>
  import { sendGoBackEmailApi, goBackCodeVerifyApi, changePassWordApi } from '@/api/getBackPassWord'

  export default {
      data() {
        return {
          active: 1,//进度
          email: '',//邮箱
          code: '',//验证码
          loadNext: false,//下一步加载中
          token: '',//用于验证修改密码是流程内的操作
          userPw: '',//密码
          userPwTo: '',//确认密码
          loadAmend: false,//修改密码加载中
        };
      },
      methods: {
        amendPass(){
          if(this.userPw == null || this.userPwTo == null){
            this.$message.warning('请输入新的密码');
            return
          }else if(this.userPw.length < 6){
            this.$message.warning('密码长度小于6位');
            return
          }else if(this.userPw != this.userPwTo){
            this.$message.warning('两次密码不一致');
            return
          }
          this.loadAmend = true;
          changePassWordApi({email: this.email, token: this.token, passWord: this.userPw}).then((data) => {
            if(data.code == 200){
              this.$message.success(data.textMsg + "，2秒后将自动回到登入页");
              setTimeout(() => {
                this.loadAmend = false;
                this.$router.push({ path: '/login' })
              }, 2000)
            }else{
              this.loadAmend = false;
              this.$message.warning(data.textMsg);
            }
          })
        },
        next() {
          if(this.code == null || this.code == ''){
            this.$message.warning('请输入验证码');
            return
          }
          this.loadNext = true;
          goBackCodeVerifyApi({email: this.email, code: this.code}).then((data) => {
            if(data.code == 200){
              this.$message.success(data.textMsg);
              this.loadNext = false;
              this.token = data.data.token
              this.active++
            }else{
              setTimeout(() => {
                 this.loadNext = false;
              }, 1500)
            }
          })
        },
        sendGoBackEmail(){
          if(this.email == null || this.email == ''){
            this.$message.warning('请输入邮箱');
            return
          }
          sendGoBackEmailApi({email: this.email}).then((data) => {
            if(data.code == 200){
              this.$message.success(data.textMsg);
              this.active++
            }
          })
        }
      }
    }
</script>

<style scoped>

  .topDiv{
    text-align: center;
  }

  .topText{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  .middleDiv{
    width: 40%;
    margin: 0 auto;
  }

  .bottomDiv{
    margin: 0 auto;
    width: 150px;
  }

  .bottomButton{
    width: 150px;
  }

</style>
