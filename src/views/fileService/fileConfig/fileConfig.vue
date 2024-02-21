<template>
  <div>
    <div class="topClass">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="filePath" placeholder="文件保存路径"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="sendNach">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="insertOrUpdate(1, null)" plain>新增</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="bottomClass">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="fileConfigTab"
        style="width: 100%">
        <el-table-column prop="filePath" label="文件路径"></el-table-column>
        <el-table-column prop="isHas" label="是否对外公开" width="300px">
          <template slot-scope="scope">{{ scope.row.isHas == "1"?"公开":"非公开" }}</template>
        </el-table-column>
        <el-table-column prop="isValid" label="是否参与下次更新" width="300px">
          <template slot-scope="scope">{{ scope.row.isValid == "1"?"参与":"不参与" }}</template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="insertOrUpdate(2, scope.row.ids)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row.ids)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="padding-top: 10px;"></div>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <div>
      <!-- 新增/删除 -->
      <el-dialog
        v-if="sendDialog"
        title="外置录入"
        :visible.sync="sendDialog"
        width="30%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
        <div style="margin: 0 15px 0 15px;">
          <el-input placeholder="请输入内容" v-model="filePathInput">
            <template slot="prepend">文件静态路径</template>
          </el-input>
          <div style="margin-top: 10px;"></div>
          <el-select style="width: 100%;" v-model="isHasInput" placeholder="是否公开">
            <el-option label="公开" value="1"></el-option>
            <el-option label="非公开" value="0"></el-option>
          </el-select>
          <div style="margin-top: 10px;"></div>
          <el-select style="width: 100%;" v-model="isValidInput" placeholder="是否参与更新">
            <el-option label="参与" value="1"></el-option>
            <el-option label="不参与" value="0"></el-option>
          </el-select>
          <div style="margin-top: 10px;"></div>
          <el-button v-if="isType" style="width: 100%;" type="primary" @click="updateConfig">更新</el-button>
          <el-button v-if="!isType" style="width: 100%;" type="primary" @click="insertConfig">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {fileUtilListApi, delFileUtilApi, fileUtilUpdateApi, fileUtilInsertApi, fileUtilInfoApi } from '@/api/fileConfig'

  export default {
    name: 'fileConfig',
    data(){
      return{
        filePath: '',
        /* 表格 */
        loadingTab: false,
        fileConfigTab: [],
        total: 1,
        currentPage: 1,
        pageSize: 10,
        /* 表单*/
        sendDialog: false,
        isType: false,
        filePathInput: '',
        isHasInput: '',
        isValidInput: '',
        ids: '',
      }
    },
    methods: {
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.fileUtilList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.fileUtilList();
      },
      fileUtilList(){
        this.loadingTab = true
        fileUtilListApi({
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          filePath: this.filePath
        }).then((data) => {
          this.total = data.total;
          this.fileConfigTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 500)
        })
      },
      //搜索记录
      sendNach(){
        this.currentPage = 1;
        this.pageSize = 10;
        this.fileUtilList();
      },
      handleDel(value){
        this.loadingTab = true;
        delFileUtilApi({
          ids: value
        }).then((data) => {
          this.$message.success(data.textMsg);
          this.loadingTab = false;
          this.sendNach()
        })
      },
      insertOrUpdate(value, ids){
        if(value == 1){
          this.isType = false;
          this.isHasInput = '';
          this.isValidInput = '';
          this.filePathInput = '';
        }else{
          this.isType = true;
          this.infoConfig(ids);
        }
        this.sendDialog = true;
      },
      infoConfig(value){
        fileUtilInfoApi({
          ids: value
        }).then((data) => {
          if(data.code == 200){
            let {ids, filePath, isHas, isValid} = data.data
            this.isHasInput = isHas;
            this.isValidInput = isValid;
            this.filePathInput = filePath;
            this.ids = ids;
          }
        })
      },
      insertConfig(){
        if(this.filePathInput == null || this.filePathInput == '' || typeof this.filePathInput == undefined){this.$message.warning("请输入文件路径");return}
        if(this.isHasInput == null || this.isHasInput == '' || typeof this.isHasInput == undefined){this.$message.warning("请选择公开性");return}
        if(this.isValidInput == null || this.isValidInput == '' || typeof this.isValidInput == undefined){this.$message.warning("请选择是否参与更新");return}
        fileUtilInsertApi({
          filePath: this.filePathInput,
          isHas: this.isHasInput,
          isValid: this.isValidInput
        }).then((data) => {
          this.$message.success(data.textMsg);
          this.sendDialog = false;
          this.sendNach()
        })
      },
      updateConfig(){
        fileUtilUpdateApi({
          ids: this.ids,
          filePath: this.filePathInput,
          isHas: this.isHasInput,
          isValid: this.isValidInput
        }).then((data) => {
          this.$message.success(data.textMsg);
          this.sendDialog = false;
          this.sendNach()
        })
      }
    },
    created() {
      this.fileUtilList();
    }
  }
</script>

<style scoped>
  .bottomClass {
    margin-top: 15px;
  }
</style>
