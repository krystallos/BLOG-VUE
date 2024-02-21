<template>

  <div>
    <el-input placeholder="标题" v-model="title">
      <template slot="prepend">标题</template>
    </el-input>
    <div style="margin-top: 15px;"></div>
    <el-input placeholder="指向地址" v-model="fromUrl">
      <template slot="prepend">指向地址</template>
    </el-input>
    <div style="margin-top: 15px;"></div>
    <el-input placeholder="系统类型ID" v-model="sysType">
      <template slot="prepend">系统类型ID</template>
    </el-input>
    <div style="margin-top: 15px;"></div>
    <div>
      <el-upload
        action="/blosBoot/upload/tempFileUpLoad.act"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :multiple="false"
        :headers="headers"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">上传轮播图</el-button>
        <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过500kb</div>
      </el-upload>
    </div>
    <div style="margin-top: 15px;"></div>
    <el-button type="primary" @click="sendNach">发布轮播</el-button>
  </div>
</template>

<script>

  import { insertNachrichtenApi,updateNachrichtenApi } from '@/api/sysNachrichten'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'sendSysNachrichten',
    props: ['sendDialog', 'openType', 'nachrVo'],
    data() {
      return {
        ids: '',
        title: '',
        fromUrl: '',
        sysType: '',
        faDiaLog: this.sendDialog,
        faNachrVo: this.nachrVo,
        faOpenType: this.openType,
        fileList: [],
        fileUrl: '',
        headers: {
          "assessToken": getToken()
        },
      };
    },
    methods: {
      handleRemove(file) {
        this.$message.success(`已将${ file.name }移除上传列表`);
      },
      handleExceed(){
        this.$message.warning('单次文件上传限制一张');
      },
      handleSuccess(response){
        this.fileUrl = response.data.fileName
      },
      sendNach(){
        if(this.faOpenType == 0){
          insertNachrichtenApi({imageUrl: this.fileUrl, message: this.title, gotoUrl: this.fromUrl, sysType: this.sysType}).then((data) => {
            if(data.code == 200){
              this.$message.success(data.textMsg);
              setTimeout(() => {
                 this.$emit("update:sendDialog", false);
              }, 500)
            }
          })
        }else{
          updateNachrichtenApi({ids: this.ids, imageUrl: this.fileUrl, message: this.title, gotoUrl: this.fromUrl, sysType: this.sysType}).then((data) => {
            if(data.code == 200){
              this.$message.success(data.textMsg);
              setTimeout(() => {
                 this.$emit("update:sendDialog", false);
              }, 500)
            }
          })
        }
      }
    },
    mounted() {
      if(this.openType == 1){
        this.ids = this.nachrVo.ids;
        this.title = this.nachrVo.message;
        this.fromUrl = this.nachrVo.gotoUrl;
        this.sysType = this.nachrVo.sysType;
      }
    },
  }
</script>

<style>
</style>
