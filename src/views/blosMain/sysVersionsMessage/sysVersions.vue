<template>
  <div>
    <div style="float: left;width: 48%;">
      <el-alert
        center
        title="桌面端近期版本更新"
        type="success"
        :closable="false">
      </el-alert>
      <div class="divCard">
        <el-button type="primary" @click="fbdd(1)">发布桌面端迭代</el-button>
      </div>
      <div class="divCard" v-for="(itema, i) in webVerList" :key="i" >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{itema.verVersion}} 更新于 {{itema.verCreate}}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="lookVer(1, i)">查看版本详情</el-button>
          </div>
          <div class="text item">
            {{itema.verName}}
          </div>
        </el-card>
      </div>
    </div>
    <div style="float: right;width: 48%;">
      <el-alert
        center
        title="移动端版本更新"
        type="success"
        :closable="false">
      </el-alert>
      <div class="divCard">
        <el-button type="primary" @click="fbdd(2)">发布移动端迭代</el-button>
      </div>
      <div class="divCard">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{versionsId}} 更新于 {{createDate}} <br> 更新概况: {{isMustUpdate}}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="lookVer(2, 0)">查看版本详情</el-button>
          </div>
          <div class="text item">
            {{versionsCode}} <br>APP更新地址: {{appUrl}}
          </div>
        </el-card>
      </div>
    </div>
    <div>
      <!-- 提交发布迭代 -->
      <el-dialog
        v-if="sendDialog"
        title="发布新的迭代"
        :visible.sync="sendDialog"
        width="60%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        >
        <div style="margin: 0 15px 0 15px;">
          <sendSysVersionsMessage :sendDialog.sync="sendDialog" :upType="upType"/>
        </div>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
      <el-drawer
        :title="draTitle"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
        :destroy-on-close="true">
        <el-divider></el-divider>
        <div class="drawerDiv" v-html="draContcant"></div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
  import {sysVersionsWebTabApi , sysVersionsAppTabApi} from '@/api/sysVersions'
  import sendSysVersionsMessage from './sendSysVersionsMessage.vue'

  export default {
    name: 'sysVersions',
    components: {
      sendSysVersionsMessage
    },
    data(){
      return{
        webVerList: [],

        versionsId: '',
        versionsCode: '',
        versionsType: '',
        appUrl: '',
        createDate: '',
        isMustUpdate: '',

        /* 抽屉*/
        draTitle: '',
        draContcant: '',
        drawer: false,
        direction: 'rtl',

        /* 发布迭代页*/
        sendDialog: false,
        upType: 0,
      }
    },
    methods: {
      getWebVer(){
        sysVersionsWebTabApi({}).then((data) => {
          if(data.code == 200){
            this.webVerList = data.data;
          }
        })
        sysVersionsAppTabApi({}).then((data) => {
          if(data.code == 200){
            let { versionsId, versionsCode, appUrl, createDate, versionsType, isMustUpdate } = data.data;
            this.versionsId = versionsId;
            this.versionsCode = versionsCode;
            this.appUrl = appUrl;
            this.versionsType = versionsType;
            this.createDate = createDate;
            this.isMustUpdate = isMustUpdate == 0 ? '不强制更新' : '强制更新';
          }
        })
      },
      lookVer(value, len){
        if(value == 1){
          this.direction = 'rtl'
          let tabVo = this.webVerList[len]
          this.draTitle = tabVo.verName;
          this.draContcant = tabVo.verType;
        }else{
          this.direction = 'rtl'
          this.draTitle = this.versionsCode;
          this.draContcant = this.versionsType;
        }
        this.drawer = true
      },
      fbdd(value){
        this.upType = value;
        this.sendDialog = true;
      },
      handleClose(done) {
        done();
      }
    },
    created() {
      this.getWebVer();
    }
  }
</script>

<style scoped>
  .divCard{
    margin-top: 15px;
  }

  .drawerDiv{
    padding: 0 15px;
  }

</style>
<style src="@wangeditor/editor/dist/css/style.css">

</style>
