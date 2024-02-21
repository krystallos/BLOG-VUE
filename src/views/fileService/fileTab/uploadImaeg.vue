<template>
  <div>
    <div>
      <el-select v-model="pathId" style="width: 100%;" placeholder="文件配置路径" ref='selectLable' @change="getLabel">
        <el-option
          v-for="item in listPath"
          :key="item.ids"
          :label="item.filePath"
          :value="item.ids + ',' + item.isHas">
        </el-option>
      </el-select>
      <div style="margin-top: 10px;"></div>
      <el-input placeholder="请输入保存文件夹" v-model="pathName">
        <template slot="prepend">所属文件夹</template>
      </el-input>
      <div style="margin-top: 10px;"></div>
      <el-upload
        ref="upload"
        accept=".jpg, .jpeg, .png"
        action="/blosBoot/upload/accessFileUpload.act"
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
  import {uploadImageItemApi } from '@/api/fileImage'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'uploadImaeg',
    data() {
      return {
        pathId: '',
        filePath: '',
        listPath: [],
        pathName: '',
        isHas: '',
        fileList: [],
        fileConfig: {"lonPathNameType": '',"pathName": '',"pathId": '', "isHas" : ''},
        headers: {
          "assessToken": getToken()
        },
        fileSize: 0,
        successFileSize: 0,
      };
    },
    methods: {
      getLabel(){
        this.$nextTick(_=>{
          this.filePath = this.$refs.selectLable.selected.label
        })
      },
      submitUpload() {
        if(this.pathId == null || typeof pathId == undefined){ this.$message.warning("请选择文件路径");return }
        if(this.pathName == null || this.pathName.length == 0 || typeof pathName == undefined){ this.$message.warning("请选择保存的文件地址");return }
        this.fileConfig.lonPathNameType = this.$refs.selectLable.selected.label + "/" + this.pathName;
        this.fileConfig.pathName = this.pathName;
        this.fileConfig.pathId = this.pathId.split(",")[0];
        this.fileConfig.isHas = this.pathId.split(",")[1];
        this.$refs.upload.submit();
      },
      uploadImageItem(){
        uploadImageItemApi({}).then((data) => {
          if(data.code == 200){
            let {listPath} = data.data;
            this.listPath = listPath;
          }
        })
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
          this.successFileSize = 0;
          this.fileSize = 0;
          this.$notify({
            title: '成功',
            message: this.fileSize + "条文件已全部上传完成",
            type: 'success'
          });
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
