<template>
  <div>
    <div style="margin: 0 15px;">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="author" placeholder="作者名称"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="pic" placeholder="图片名称"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="selectFor">查询搜图记录</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="aspImgTab"
        style="width: 100%">
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="authorUrl" label="作者地址"></el-table-column>
        <el-table-column prop="pic" label="图片名称"></el-table-column>
        <el-table-column prop="picUrl" label="图片地址"></el-table-column>
        <el-table-column prop="orderTime" label="图片处理时间"></el-table-column>
        <el-table-column prop="likeImg" label="相似度"></el-table-column>
        <el-table-column prop="createDate" label="访问时间" width="250"></el-table-column>
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
  import {aspImgApi } from '@/api/logAspect'

  export default {
    name: 'aspImg',
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        aspImgTab: [],//表格数据
        loadingTab: false,//加载

        author: '',
        pic: '',
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.aspImgPage();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.aspImgPage();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.aspImgPage();
      },
      //列表接口集成
      aspImgPage(){
        this.loadingTab = true;
        aspImgApi({nowTab: this.currentPage, hasTab: this.pageSize, author: this.author, pic: this.pic}).then((data) => {
          this.total = data.total;
          this.aspImgTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
    },
    created() {
      this.aspImgPage();
    }
  }


</script>

<style>
</style>
