<template>
  <div>
    <div class="topClass">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="tagName" placeholder="标签名称"></el-input>
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
        :data="fictionConfigTab"
        style="width: 100%">
        <el-table-column prop="tagName" label="标签名称" width="600px"></el-table-column>
        <el-table-column prop="tagRemark" label="标签备注"></el-table-column>
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
          <el-input placeholder="请输入内容" v-model="tagNameInput">
            <template slot="prepend">标签名称</template>
          </el-input>
          <div style="margin-top: 10px;"></div>
          <el-input placeholder="请输入内容" v-model="tagRemarkInput">
            <template slot="prepend">标签备注</template>
          </el-input>
          <div style="margin-top: 10px;"></div>
          <el-button v-if="isType" style="width: 100%;" type="primary" @click="updateConfig">更新</el-button>
          <el-button v-if="!isType" style="width: 100%;" type="primary" @click="insertConfig">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {fictionUtilListApi, delFictionUtilApi, insertFictionUtilApi, updateFictionUtilApi, fictionUtilTabInfoApi } from '@/api/fictionConfig'

  export default {
    name: 'fictionConfig',
    data(){
      return{
        tagName: '',
        /* 表格 */
        loadingTab: false,
        fictionConfigTab: [],
        total: 1,
        currentPage: 1,
        pageSize: 10,
        /* 表单*/
        sendDialog: false,
        isType: false,
        tagNameInput: '',
        tagRemarkInput: '',
        ids: '',
      }
    },
    methods: {
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.fictionUtilList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.fictionUtilList();
      },
      fictionUtilList(){
        this.loadingTab = true
        fictionUtilListApi({
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          tagName: this.tagName
        }).then((data) => {
          this.total = data.total;
          this.fictionConfigTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 500)
        })
      },
      //搜索记录
      sendNach(){
        this.currentPage = 1;
        this.pageSize = 10;
        this.fictionUtilList();
      },
      handleDel(value){
        this.loadingTab = true;
        delFictionUtilApi({
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
          this.tagNameInput = '';
          this.tagRemarkInput = '';
        }else{
          this.isType = true;
          this.infoConfig(ids);
        }
        this.sendDialog = true;
      },
      infoConfig(value){
        fictionUtilTabInfoApi({
          ids: value
        }).then((data) => {
          if(data.code == 200){
            let {ids, tagName, tagRemark} = data.data
            this.tagNameInput = tagName;
            this.tagRemarkInput = tagRemark;
            this.ids = ids;
          }
        })
      },
      insertConfig(){
        if(this.tagNameInput == null || this.tagNameInput == '' || typeof this.tagNameInput == undefined){this.$message.warning("请输入标签名称");return}
        if(this.tagRemarkInput == null || this.tagRemarkInput == '' || typeof this.tagRemarkInput == undefined){this.$message.warning("请输入标签备注");return}
        insertFictionUtilApi({
          tagName: this.tagNameInput,
          tagRemark: this.tagRemarkInput
        }).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.sendDialog = false;
            this.sendNach()
          }
        })
      },
      updateConfig(){
        updateFictionUtilApi({
          ids: this.ids,
          tagName: this.tagNameInput,
          tagRemark: this.tagRemarkInput
        }).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.sendDialog = false;
            this.sendNach()
          }
        })
      }
    },
    created() {
      this.fictionUtilList();
    }
  }
</script>

<style scoped>
  .bottomClass {
    margin-top: 15px;
  }
</style>
