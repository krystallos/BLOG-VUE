<template>
  <div>
    <div>
      <el-descriptions title="用户信息">
          <el-descriptions-item label="用户名">{{psnName}}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{psnPhone}}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{email}}</el-descriptions-item>
          <el-descriptions-item label="所属社区">{{likeCommunity}}</el-descriptions-item>
          <el-descriptions-item label="账号建立时间">{{createDate}}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div style="margin-top: 15px;"></div>
    <div>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="最近(2天内的数据)" name="1" ><mineBlosCountTab :sysType="sysType" v-if="isTab == '1'" /></el-tab-pane>
        <el-tab-pane label="文章" name="2"><mineBlosCountTab :sysType="sysType" v-if="isTab == '2'" /></el-tab-pane>
        <el-tab-pane label="资源(近100条)" name="3"><mineBlosCountTab :sysType="sysType" v-if="isTab == '3'" /></el-tab-pane>
        <el-tab-pane label="收藏" name="4"><mineBlosCountTab :sysType="sysType" v-if="isTab == '4'" /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import mineBlosCountTab from './mineBlosCountTab.vue'

  export default {
    name: 'mineBlosCount',
    components: {
      mineBlosCountTab
    },
    data () {
      return {
        psnName: '',
        psnPhone: '',
        email: '',
        likeCommunity: '',
        createDate: '',

        sysType: '1',
        activeName: '1',
        isTab: '1'
      };
    },
    methods: {
      handleClick(tab, event) {
        this.sysType = tab.$props.name;
        this.isTab = tab.$props.name;
      }
    },
    created() {
      let person = sessionStorage.getItem("person");
      if(person == null){
        this.$message.warning("获取不到用户信息，建议退出重新登入刷新");
      }else{
        let {email,psnName,psnLikeName,phone,createDate } = JSON.parse(person);
        this.email = email;
        this.psnName = psnName;
        this.psnPhone = phone;
        this.likeCommunity = psnLikeName;
        this.createDate = createDate;
      }
    }
  }
</script>

<style>
</style>
