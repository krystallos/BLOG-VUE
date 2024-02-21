<template>
  <div v-loading="loadingTab">
    <el-row :gutter="24" style="margin-bottom: 15px;">
      <el-col :span="24">
        <el-input v-model="projectName" placeholder="项目名称"></el-input>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="margin-bottom: 15px;">
      <el-col :span="24">
        <el-select v-model="projectPid" placeholder="上级项目" style="width: 100%;" clearable >
          <el-option
            v-for="item in selectProject"
            :key="item.ids"
            :label="item.projectName"
            :value="item.ids">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-button @click="saveRstPostApi" type="primary" plain style="width: 100%;">保存项目</el-button>
  </div>
</template>

<script>

  import { getRstPostChiListApi, saveRstPostApi } from '@/api/sysRstHttpApi'

  export default {
    name: 'sysRstHttpInsert',
    props: {dialogInsertVisible:{type: Boolean, default: true}},
    data () {
      return {
        loadingTab: false,//加载

        selectProject: [],
        projectName: '',
        projectPid: '',
      }
    },
    methods: {
      //详情接口集成
      getRstPostChiListApi(){
        getRstPostChiListApi({}).then((data) => {
          this.selectProject = data.data;
        })
      },
      //保存项目
      saveRstPostApi(){
        if(this.projectName == null || this.projectName == ''){
          this.$message.error("请填写项目/文件夹名称");
          return;
        }
        this.loadingTab = true;
        saveRstPostApi({projectName : this.projectName, projectPid : this.projectPid }).then((data) => {
          if(data.code == 200 ){
            setTimeout(() => {
              this.$message.success(data.textMsg);
              this.loadingTab = false;
              this.$emit("update:dialogInsertVisible", false);
            }, 500)
          }else{
            this.loadingTab = false;
          }
        })
      },
    },
    mounted() {
      this.getRstPostChiListApi();
    }
  }

</script>

<style>
</style>
