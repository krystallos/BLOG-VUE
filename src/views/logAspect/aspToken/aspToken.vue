<template>
  <div>
    <div style="margin: 0 15px;">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="areaId" placeholder="访问IP"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="selectFor">查询token</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="aspTokenTab"
        style="width: 100%">
        <el-table-column prop="requestId" label="操作ID" width="350"></el-table-column>
        <el-table-column prop="domainName" label="域名"></el-table-column>
        <el-table-column prop="line" label="主要线路" width="150"></el-table-column>
        <el-table-column prop="rr" label="属性" width="100"></el-table-column>
        <el-table-column prop="status" label="操作状态" width="100"></el-table-column>
        <el-table-column prop="type" label="代理域名类型" width="150"></el-table-column>
        <el-table-column prop="value" label="IP" width="300"></el-table-column>
        <el-table-column prop="updateTimestamp" label="更新时间戳"></el-table-column>
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
  </div>
</template>

<script>
  import {aspTokenApi } from '@/api/logAspect'

  export default {
    name: 'aspLog',
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        aspTokenTab: [],//表格数据
        loadingTab: false,//加载

        areaId: '',
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.aspTokenPage();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.aspTokenPage();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.aspTokenPage();
      },
      //列表接口集成
      aspTokenPage(){
        this.loadingTab = true;
        aspTokenApi({nowTab: this.currentPage, hasTab: this.pageSize, areaId: this.areaId}).then((data) => {
          this.total = data.total;
          this.aspTokenTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
    },
    created() {
      this.aspTokenPage();
    }
  }


</script>

<style>
</style>
