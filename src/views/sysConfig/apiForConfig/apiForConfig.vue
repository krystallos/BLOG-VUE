<template>
  <div>
    <div>
      <el-button type="primary" @click="handleEdit">新增对外接口</el-button>
    </div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="apiPostList"
        style="width: 100%">
        <el-table-column prop="postName" label="接口名称"></el-table-column>
        <el-table-column prop="remark" label="接口备注"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
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
          <el-input placeholder="请输入接口名称" v-model="postName">
            <template slot="prepend">接口名称</template>
          </el-input>
          <div style="margin-top: 15px;"></div>
          <el-input placeholder="请输入接口备注" v-model="remark">
            <template slot="prepend">接口备注</template>
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="postApiInsert">确 定</el-button>
          <el-button type="info" @click="dialogVisible = false;">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {postApiTabApi, postApiInsertApi, postApiDeleteApi} from '@/api/apiForConfig'

  export default {
    name: 'apiForConfig',
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        apiPostList: [],//表格数据
        loadingTab: false,//加载

        dialogVisible: false,
        postName: null,
        remark: null,
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.postApiTab();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.postApiTab();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.postApiTab();
      },
      //列表接口集成
      postApiTab(){
        this.loadingTab = true;
        postApiTabApi({nowTab: this.currentPage, hasTab: this.pageSize}).then((data) => {
          this.total = data.total;
          this.apiPostList = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      //新增
      postApiInsert(){
        if(this.postName == null){this.$message.warning("请填写接口名称");return}
        postApiInsertApi({postName: this.postName, remark: this.remark}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.dialogVisible = false;
            this.selectFor();
          }
        })
      },
      //删除
      handleDel(value){
        postApiDeleteApi({ids: value}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
          }
          this.selectFor();
        })
      },
      //新增
      handleEdit(){
        this.dialogVisible = true;
      }
    },
    created() {
      this.postApiTab();
    }
  }
</script>

<style>
</style>
