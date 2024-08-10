<template>
  <div v-loading="loadingTab">
    <el-row :gutter="20">
      <el-col :span="2">
        <el-button type="primary" @click="getKey">新增邀请码</el-button>
      </el-col>
    </el-row>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        :data="rstProjectList"
        style="width: 100%;margin-bottom: 20px;"
      >
        <el-table-column prop="rstKey" label="接口Key"></el-table-column>
        <el-table-column prop="userName" label="创建者" width="150"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="150"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="handleDel(scope.row.ids)" type="danger" size="small" plain>删除</el-button>
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
        :page-sizes="[5, 10, 15]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 分页器 -->
    </div>
  </div>
</template>

<script>

  import { getRstPostKeyListApi, insertRstKeyApi, delRstApiKeyApi } from '@/api/sysRstHttpApi'

  export default {
    name: 'sysRstHttpKeyDetial',
    props: ['dialogKeyVisible', 'projectId'],
    data () {
      return {
        projectIds: this.projectId,
        loadingTab: false,//加载

        rstProjectList: [],
        total: 1,//总数
        pageSize: 5,//当前页展示条数
        currentPage: 1//所在页数
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 5;
        this.currentPage = 1;
        this.getRstKeyPostApi();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.getRstKeyPostApi();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getRstKeyPostApi();
      },
      //列表接口集成
      getRstKeyPostApi(){
        this.loadingTab = true;
        getRstPostKeyListApi({nowTab: this.currentPage, hasTab: this.pageSize, rstIds: this.projectIds }).then((data) => {
          this.total = data.total;
          this.rstProjectList = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 500)
        })
      },
      handleDel(id){
        this.$confirm('此操作将删除该分享码, 是否继续?', '删除警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          delRstApiKeyApi({ids: id }).then((data) => {
            this.getRstKeyPostApi();
            this.$message.success(data.textMsg);
          })
        });
      },
      getKey(){
        this.$prompt('请输入前缀', '生成新的Key', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: ''
        }).then(({value}) => {
          if(value == null || value == ''){
            this.$message.error("前缀名称不能为空");
            return;
          }
          insertRstKeyApi({rstIds: this.projectIds, rstKey: value}).then((data) => {
            setTimeout(() => {
              this.getRstKeyPostApi();
              this.$alert("新的Api邀请链接为：" + data.data.rstKey, data.reslutMsg, {
                confirmButtonText: '确定'
              });
            }, 500)
          })
        })
      }
    },
    mounted() {
      this.getRstKeyPostApi();
    }
  }

</script>

<style>
</style>
