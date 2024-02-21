<template>
  <div>
    <div>
      <el-button type="primary" @click="handleEdit(null)">新增博客类型</el-button>
    </div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="mineBlosTypeList"
        style="width: 100%">
        <el-table-column prop="blosTypeName" label="类型名称"></el-table-column>
        <el-table-column prop="isValid" label="有效性" width="250"></el-table-column>
        <el-table-column prop="createDate" label="建立及更新时间" width="250"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.ids)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row.ids)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格 -->
      <div style="margin-top: 15px;"></div>
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
      <!-- 分页器 -->
    </div>
    <div>
      <!-- 详细信息/修改 -->
      <el-dialog
        v-loading="loadingDialog"
        element-loading-background="rgba(184, 184, 184, 0.3)"
        title="操作"
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        width="30%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
        <div>
          <el-input placeholder="请输入博客类型" v-model="blosTypeName">
            <template slot="prepend">博客类型</template>
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="insertBlosType">确 定</el-button>
          <el-button type="info" @click="dialogVisible = false;ids = null;">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {mineBlosTypeTabApi, deleteBlosTypeApi, insertBlosTypeApi, getMineBlosTypeApi } from '@/api/mineBlosConfig'

  export default {
    name: 'mineBlosConfig',
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        mineBlosTypeList: [],//表格数据
        loadingTab: false,//加载

        loadingDialog: false,
        dialogVisible: false,
        blosTypeName: null,
        ids: '',
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.mineBlosTypeTab();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.mineBlosTypeTab();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.mineBlosTypeTab();
      },
      //列表接口集成
      mineBlosTypeTab(){
        this.loadingTab = true;
        mineBlosTypeTabApi({nowTab: this.currentPage, hasTab: this.pageSize}).then((data) => {
          this.total = data.total;
          this.mineBlosTypeList = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      //新增
      insertBlosType(){
        if(this.blosTypeName == null || this.blosTypeName == ''){this.$message.warning("请填写博客类型");return}
        insertBlosTypeApi({ids: this.ids, blosTypeName: this.blosTypeName}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.dialogVisible = false;
            this.selectFor();
          }
        })
      },
      //删除
      handleDel(value){
        deleteBlosTypeApi({ids: value}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
          }
          this.selectFor();
        })
      },
      //新增/修改
      handleEdit(value){
        if(value == null){
          this.ids = null;
          this.blosTypeName = null;
          this.dialogVisible = true;
        }else{
          this.ids = value;
          this.dialogVisible = true;
          this.loadingDialog = true;
          getMineBlosTypeApi({ids: value}).then((data) => {
            if(data.code == 200){
              let {blosTypeName} = data.data;
              this.blosTypeName = blosTypeName;
            }
            setTimeout(() => {
               this.loadingDialog = false;
            }, 500)
          })
        }
      }
    },
    created() {
      this.mineBlosTypeTab();
    }
  }
</script>

<style>
</style>
