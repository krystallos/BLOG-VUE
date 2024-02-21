<template>
  <div>
    <div>
      <div>
        <el-input placeholder="请输入用户名" v-model="userNames">
          <template slot="prepend">用户名</template>
        </el-input>
        <div style="margin-top: 15px;"></div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input placeholder="请输入邮箱" v-model="emails">
              <template slot="prepend">邮箱</template>
            </el-input>
          </el-col>
          <el-col :span="12">
          <el-input placeholder="请输入电话" v-model="phones">
            <template slot="prepend">电话</template>
          </el-input>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 15px;">
        <el-descriptions class="margin-top" title="人员信息" :column="3" border>
            <template slot="extra">
              <el-button type="warning" size="small" @click="userPassBack(1)">重置密码(随机)</el-button>
              <el-button type="warning" size="small" @click="userPassBack(2)">重置密码(指定)</el-button>
            </template>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                人员名称
              </template>
              {{psnName}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-mobile-phone"></i>
                人员社区
              </template>
              {{psnLikeName}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-location-outline"></i>
                用户标识
              </template>
              <el-tag size="small">{{psnDelFlag}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-tickets"></i>
                用户状态
              </template>
              <el-tag size="small">{{psnState}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                建立时间
              </template>
              {{createDate}}
            </el-descriptions-item>
          </el-descriptions>
      </div>
      <div style="margin-top: 15px;">
        <el-button :loading="buttonUpdate" type="primary" @click="userUpdate">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {getUserApi, selectPersonEnityApi, userUpdateApi, userPassBackApi } from '@/api/userForConfig'

  export default {
    name: 'userForInfo',
    props: ['dialogVisible', 'uid'],
    data(){
      return{
        userId: this.uid,
        userNames: '',
        phones: '',
        emails: '',

        psnName: '',
        psnLikeName: '',
        createDate: '',
        psnState: '',
        psnDelFlag: '',

        buttonUpdate: false,
      }
    },
    methods: {
      //获取用户
      getUser(){
        getUserApi({ids: this.userId}).then((data) => {
          if(data.code == 200){
            let {userName , phone , email} = data.data
            this.userNames = userName;
            this.phones = phone;
            this.emails = email;
          }
        })
      },
      //获取人员
      selectPersonEnity(){
        selectPersonEnityApi({userId: this.userId}).then((data) => {
          if(data.code == 200){
            let {psnName , psnLikeName , delFlag , psnState , createDate} = data.data
            this.psnName = psnName;
            this.psnLikeName = psnLikeName;
            this.psnDelFlag = delFlag=="0"?'使用中':'已移除';
            this.psnState = psnState=="1"?'启用':'禁用';
            this.createDate = createDate;
          }
        })
      },
      userUpdate(){
        if(this.userNames == null || this.userNames == ''){this.$message.warning("请输入用户名");return}
        if(this.phones == null || this.phones == ''){this.$message.warning("请输入电话");return}
        if(this.emails == null || this.emails == ''){this.$message.warning("请输入邮箱");return}
        this.buttonUpdate = true;
        userUpdateApi({ids: this.userId, userName: this.userNames, phone: this.phones, email: this.emails}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.$emit("update:dialogVisible", false);
          }
          this.buttonUpdate = false;
        })
      },
      userPassBack(value){
        if(value == 2){
          this.$prompt('请输入新的密码', '密码输入', {
            confirmButtonText: '确定',
          }).then(({ value }) => {
            this.resPassWord(value)
          });
        }else{
          this.resPassWord(null)
        }
      },
      resPassWord(value){
        userPassBackApi({ids: this.userId, userName: this.userNames, userPassWord: value}).then((data) => {
          if(data.code == 200){
            this.$alert(data.textMsg, '修改完成', {
              confirmButtonText: '确定'
            });
          }
        })
      }
    },
    mounted() {
      this.getUser();
      this.selectPersonEnity();
    }
  }

</script>

<style>
</style>
