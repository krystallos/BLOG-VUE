<template>
  <div>
    <div>
      <el-input v-model="pathName" placeholder="文件路径"></el-input>
      <div style="margin-top: 10px;"></div>
      <el-input v-model="fileName" placeholder="文件名称"></el-input>
      <div style="margin-top: 10px;"></div>
    </div>
    <div>
      <el-select v-model="fileType" style="width: 100%;" placeholder="文件配置后缀">
        <el-option label="gif" value="gif"></el-option>
        <el-option label="png" value="png"></el-option>
        <el-option label="jpg" value="jpg"></el-option>
      </el-select>
      <div style="margin-top: 10px;"></div>
      <el-select v-model="pathId" style="width: 100%;" placeholder="文件配置路径">
        <el-option
          v-for="item in listPath"
          :key="item.ids"
          :label="item.filePath"
          :value="item.ids">
        </el-option>
      </el-select>
      <div style="margin-top: 10px;"></div>
      <el-select v-model="isHas" style="width: 100%;" placeholder="是否公开图片">
        <el-option label="否" value="0"></el-option>
        <el-option label="是" value="1"></el-option>
      </el-select>
      <div style="margin-top: 15px;"></div>
    </div>
      <el-button type="primary" style="width: 100%;" @click="getSaveFile">保存</el-button>
    </div>
  </div>
</template>

<script>
  import { getWorkImageTempApi, fileGetHandWorkSaveFileApi } from "@/api/fileImage"

  export default {
    name: 'insertFileWorkImage',
    props: ['sendDialog'],
    data(){
      return{
        pathName: '',
        fileName: '',
        fileType: '',
        pathId: '',
        isHas: '',
        listPath: [],
      }
    },
    methods: {
      imagePathSize(){
        getWorkImageTempApi({}).then((data) => {
          if(data.code == 200){
            let { pathName, fileName, fileType, isHas, filePath , listPath } = data.data;
            this.pathName = pathName;
            this.fileName = fileName;
            this.fileType = fileType;
            this.isHas = isHas;
            this.listPath = listPath;
            this.pathId = filePath
          }
        })
      },
      getSaveFile(){
        if(this.pathName == null || typeof this.pathName == undefined) {this.$message.warning('请填写文件路径'); return}
        if(this.fileName == null || this.fileName.length == 0 || typeof this.fileName == undefined) {this.$message.warning('请填写文件名称'); return}
        if(this.fileType == null || typeof this.fileType == undefined) {this.$message.warning('请选择文件后缀'); return}
        if(this.pathId == null || typeof this.pathId == undefined) {this.$message.warning('请选择配置路径'); return}
        if(this.isHas == null || typeof this.isHas == undefined) {this.$message.warning('请选择公开性'); return}
        fileGetHandWorkSaveFileApi({
          pathName: this.pathName,
          fileName: this.fileName,
          fileType: this.fileType,
          filePath: this.pathId,
          isHas: this.isHas
        }).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            setTimeout(() => {
               this.$emit("update:sendDialog", false);
            }, 500)
          }
        })
      }
    },
    created() {
      this.imagePathSize()
    }
  }
</script>

<style>
</style>
