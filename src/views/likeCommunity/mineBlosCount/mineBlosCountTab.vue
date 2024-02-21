<template>
  <div>
    <div>
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="mineBlosTab"
        style="width: 100%">
        <el-table-column prop="clobTitle" label="标题"></el-table-column>
        <el-table-column prop="psnName" label="创作者" width="250"></el-table-column>
        <el-table-column prop="createDate" label="建立及更新时间" width="250"></el-table-column>
      </el-table>
      <!-- 表格 -->
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
  import {mineBlosTabApi} from '@/api/mineBlosCount'

  export default {
    name: 'mineBlosCountTab',
    props: ['sysType'],
    data () {
      return {
        type: this.sysType,
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        mineBlosTab: [],//表格数据
        loadingTab: false,//加载
      };
    },
    methods: {
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.getListMineBlos();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getListMineBlos();
      },
      getListMineBlos(){
        this.loadingTab = true;
        mineBlosTabApi({
            type: this.type,
            nowTab: this.currentPage,
            hasTab: this.pageSize
          }).then((data) => {
            this.loadingTab = false;
            this.mineBlosTab = data.data
            this.total = data.total
          })
      }
    },
    mounted() {
        this.getListMineBlos();
    },
  }
</script>

<style>
</style>
