<template>
  <div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="userList"
        style="width: 100%">
        <el-table-column prop="userName" label="用户名称" width="220"></el-table-column>
        <el-table-column prop="areaId" label="归属IP" width="170"></el-table-column>
        <el-table-column prop="orgSessionId" label="运营商地址"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="170"></el-table-column>
        <el-table-column prop="phone" label="电话" width="120"></el-table-column>
        <el-table-column prop="state" label="状态" width="70"></el-table-column>
        <el-table-column prop="updateDate" label="最后登入时间" width="180"></el-table-column>
        <el-table-column prop="createDate" label="建立时间" width="180"></el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state == '启用'" size="mini" type="danger" @click="userState(scope.row.ids, 0)">禁用</el-button>
            <el-button v-if="scope.row.state == '禁用'" size="mini" type="success" @click="userState(scope.row.ids, 1)">启用</el-button>
            <el-button size="mini" type="primary" @click="handleInfo(scope.row.ids)">修改</el-button>
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
        title="修改用户信息"
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        width="60%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
        <div>
          <userForInfo :uid="userId" :dialogVisible.sync="dialogVisible"/>
        </div>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {userSelectApi, userUpdateStateApi } from '@/api/userForConfig'
  import userForInfo from './userForInfo.vue'

  export default {
    name: 'userForConfig',
    components: {
      userForInfo
    },
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        userList: [],//表格数据
        loadingTab: false,//加载

        dialogVisible: false,
        userId: '',
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.userTab();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.userTab();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.userTab();
      },
      //列表接口集成
      userTab(){
        this.loadingTab = true;
        userSelectApi({nowTab: this.currentPage, hasTab: this.pageSize}).then((data) => {
          this.total = data.total;
          this.userList = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      //禁用/启用
      userState(ids, value){
        userUpdateStateApi({ids: ids, state: value}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.selectFor();
          }
        })
      },
      //修改
      handleInfo(value){
        this.userId = value;
        this.dialogVisible = true;
      },
    },
    created() {
      this.userTab();
    }
  }

</script>

<style>
</style>
