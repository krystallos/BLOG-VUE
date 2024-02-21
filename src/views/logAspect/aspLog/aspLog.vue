<template>
  <div>
    <div style="margin: 0 15px;">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="urlIze" placeholder="访问接口"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="apiName" placeholder="接口名称"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="ip" placeholder="访问IP"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="selectFor">查询日志</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="aspLogTab"
        style="width: 100%">
        <el-table-column label="访问地址" show-overflow-tooltip>
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              {{ scope.row.urlIze }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="apiName" label="接口名称"></el-table-column>
        <el-table-column prop="title" label="接口描述"></el-table-column>
        <el-table-column prop="type" label="接口类型" width="100"></el-table-column>
        <el-table-column prop="httpMethod" label="入参" width="100"></el-table-column>
        <el-table-column prop="ip" label="IP地址" width="250"></el-table-column>
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
  import {aspLogApi } from '@/api/logAspect'

  export default {
    name: 'aspLog',
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        aspLogTab: [],//表格数据
        loadingTab: false,//加载

        urlIze: '',
        apiName: '',
        ip: '',
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.aspLogPage();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.aspLogPage();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.aspLogPage();
      },
      //列表接口集成
      aspLogPage(){
        this.loadingTab = true;
        aspLogApi({nowTab: this.currentPage, hasTab: this.pageSize, urlIze: this.urlIze, ip: this.ip, apiName: this.apiName}).then((data) => {
          this.total = data.total;
          this.aspLogTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
    },
    created() {
      this.aspLogPage();
    }
  }

</script>

<style>
</style>
