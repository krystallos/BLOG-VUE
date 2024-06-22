<template>
  <div v-loading="loadingTab">
    <div style="margin-top: 15px;">
      <el-descriptions class="margin-top" title="接口信息" :column="3" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              项目名称
            </template>
            {{projectName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              分类名称
            </template>
            {{fileName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              创建时间
            </template>
            {{fileCreateDate}}
          </el-descriptions-item>
        </el-descriptions>
    </div>
    <div style="margin-top: 15px;">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="postName" placeholder="接口名称"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="postUrl" placeholder="接口路径"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="selectFor">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="handleDetial(null, 3)" type="success">新增接口</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="rstProjectList"
        style="width: 100%;margin-bottom: 20px;"
      >
        <el-table-column prop="postName" label="接口名称" width="200"></el-table-column>
        <el-table-column prop="postUrl" label="接口URL" width="600"></el-table-column>
        <el-table-column prop="createName" label="创建者" width="150"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="150"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button @click="handleDetial(scope.row.ids, 1)" type="primary" size="small" plain>查看</el-button>
            <el-button @click="handleDetial(scope.row.ids, 2)" type="info" size="small" plain>编辑</el-button>
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
    <el-dialog
      v-if="dialogPostVisible"
      title="接口详情"
      :visible.sync="dialogPostVisible"
      width="80%"
      top="15px"
      bottom="15px"
      style="margin-bottom: 15px;"
      :modal='false'
      :destroy-on-close='true'
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      >
        <div>
          <sysRstHttpDetialPost :dialogPostVisible.sync="dialogPostVisible" :postIds="postIds" :projectId="projectIds" :type="type"/>
        </div>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
  </div>
</template>

<script>

  import { getRstPostApi, getRstPostListApi,  rstDeleteApi } from '@/api/sysRstHttpApi'
  import sysRstHttpDetialPost from './sysRstHttpDetialPost.vue'

  export default {
    name: 'sysRstHttpDetial',
    props: ['dialogVisible', 'projectId'],
    components: {
      sysRstHttpDetialPost
    },
    data () {
      return {
        projectIds: this.projectId,
        type: '',//1是查看，2是编辑，3是新增
        postIds: '',
        loadingTab: false,//加载
        postName: '',
        postUrl: '',
        dialogPostVisible: false,

        projectName: '',
        fileName: '',
        fileCreateDate: '',
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
        this.getRstPostListApi();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.getRstPostListApi();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getRstPostListApi();
      },
      //详情接口集成
      getRstPostApi(){
        getRstPostApi({ids: this.projectIds }).then((data) => {
          this.projectName = data.data.projectName;
          this.fileName = data.data.fileName;
          this.fileCreateDate = data.data.fileCreateDate;
          this.rstProjectList = data.data.rstPostApi;
          this.getRstPostListApi();
        })
      },
      getRstPostListApi(){
        this.loadingTab = true;
        getRstPostListApi({
          ids: this.projectIds, 
          postName: this.postName, 
          postUrl: this.postUrl, 
          nowTab: this.currentPage, 
          hasTab: this.pageSize,
        }).then((data) => {
          setTimeout(() => {
            this.rstProjectList = data.data;
            this.total = data.total;
            this.loadingTab = false;
          }, 500)
        })
      },
      handleDel(id){
        this.$confirm('此操作将删除该接口, 是否继续?', '删除警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          rstDeleteApi({ids: id }).then((data) => {
            this.getRstPostListApi();
            this.$message.success(data.textMsg);
          })
        });
      },
      handleDetial(id, type){
        this.postIds = id;
        this.type = type;
        this.dialogPostVisible = true;
      },
    },
    mounted() {
      this.getRstPostApi();
    }
  }

</script>

<style>
</style>
