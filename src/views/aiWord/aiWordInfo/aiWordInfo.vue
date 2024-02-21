<template>
  <div>
    <div style="margin: 0 15px;">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="fatherCheName" placeholder="一级词缀英文"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="fatherName" placeholder="一级词缀中文"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="dicCheName" placeholder="二级词缀英文"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="chiName" placeholder="二级词缀中文"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="selectFor">搜索词缀</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="aiWordInfoTab"
        style="width: 100%">
        <el-table-column prop="fatherCheName" label="一级英文"></el-table-column>
        <el-table-column prop="fatherName" label="一级中文"></el-table-column>
        <el-table-column prop="dicCheName" label="二级中文"></el-table-column>
        <el-table-column prop="chiName" label="二级英文"></el-table-column>
        <el-table-column prop="tabType" label="顶级词性"></el-table-column>
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
  import {apiSelectTabApi } from '@/api/aiWord'
  
  export default {
    name: 'aiWordInfo',
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        aiWordInfoTab: [],//表格数据
        loadingTab: false,//加载
  
        fatherCheName: '',
        fatherName: '',
        dicCheName: '',
        chiName: '',
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.apiSelectTabPage();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.apiSelectTabPage();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.apiSelectTabPage();
      },
      //列表接口集成
      apiSelectTabPage(){
        this.loadingTab = true;
        apiSelectTabApi({
          nowTab: this.currentPage, 
          hasTab: this.pageSize, 
          fatherCheName: this.fatherCheName, 
          fatherName: this.fatherName, 
          dicCheName: this.dicCheName,
          chiName: this.chiName,
        }).then((data) => {
          this.total = data.total;
          this.aiWordInfoTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
    },
    created() {
      this.apiSelectTabPage();
    }
  }
  
</script>

<style>
</style>