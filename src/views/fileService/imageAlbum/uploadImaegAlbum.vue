<template>
  <div>
    <div>
      <el-input placeholder="请输入来自省份" v-model="divSessionPiovince">
        <template slot="prepend">拍摄省份</template>
      </el-input>
      <div style="margin-top: 10px;"></div>
      <el-input placeholder="请输入来自地区" v-model="divSessionRegion">
        <template slot="prepend">拍摄地区</template>
      </el-input>
      <div style="margin-top: 10px;"></div>
      <el-input placeholder="请输入拍摄年份" v-model="divSessionYear">
        <template slot="prepend">拍摄年份</template>
      </el-input>
      <div style="margin-top: 10px;"></div>
      <el-input placeholder="请输入拍摄月份" v-model="divSessionMonth">
        <template slot="prepend">拍摄月份</template>
      </el-input>
      <div style="margin-top: 10px;"></div>
      <el-upload
        ref="upload"
        accept=".jpg, .jpeg, .png"
        action="/blosBoot/upload/imageAlbumUpload.act"
        :headers="headers"
        :on-remove="handleRemove"
        :on-change="handleFileList"
        :on-success="handleFileSuccess"
        :file-list="fileList"
        :limit="21"
        :multiple="true"
        :auto-upload="false"
        :data="fileConfig">
        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过21张</div>
      </el-upload>
      <div style="margin-top: 20px;"></div>
      <el-button style="width: 100%;" type="primary" @click="submitUpload">上传</el-button>
    </div>
  </div>
</template>

<script>
  import {uploadImageItemApi } from '@/api/imageAlbum'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'uploadImaegAlbum',
    data() {
      return {
        divSessionPiovince: '',
        divSessionRegion: '',
        divSessionYear: '',
        divSessionMonth: '',
        fileList: [],
        fileConfig: {"sessionPiovince": '',"sessionRegion": '', "sessionYear" : '', "sessionMonth": ''},
        headers: {
          "assessToken": getToken()
        },
        fileSize: 0,
        successFileSize: 0,
      };
    },
    methods: {
      submitUpload() {
        if(this.divSessionPiovince == null || this.divSessionPiovince == ''){ this.$message.warning("请选择拍摄省份");return };
        if(this.divSessionRegion == null || this.divSessionRegion == ''){ this.$message.warning("请选择拍摄地区");return };
        if(this.divSessionYear == null || this.divSessionYear == ''){ this.$message.warning("请选择拍摄年份");return };
        if(this.divSessionMonth == null || this.divSessionMonth == ''){ this.$message.warning("请选择拍摄月份");return };
        this.fileConfig.sessionPiovince = this.divSessionPiovince;
        this.fileConfig.sessionRegion = this.divSessionRegion;
        this.fileConfig.sessionYear = this.divSessionYear;
        this.fileConfig.sessionMonth = this.divSessionMonth;
        this.$refs.upload.submit();
      },
      handleRemove(file) {
        this.$message.success(`已将【${ file.name }】移出上传列表`);
      },
      handleFileList(file, fileList){
        this.fileSize = fileList.length;
      },
      handleFileSuccess(res, file){
        this.successFileSize ++;
        if(this.successFileSize == this.fileSize){
          this.fileList = [];
          this.$notify({
            title: '成功',
            message: this.fileSize + "条文件已全部上传完成",
            type: 'success'
          });
          this.successFileSize = 0;
          this.fileSize = 0;
        }
      }
    },
    created() {
      this.uploadImageItem()
    }
  }
</script>

<style>
</style>
