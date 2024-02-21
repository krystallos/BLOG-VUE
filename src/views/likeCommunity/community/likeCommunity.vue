<template>
  <div>
    <div style="margin: 0 15px;">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="likeName" placeholder="请输入想加入的社区名称"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="likeMenuTabPage">查询社区</el-button>
        </el-col>
      </el-row>
    </div>
    <div v-loading="loadingTab">
      <el-card class="box-card" shadow="hover" v-for="(item, i) in comList" :key="i">
        <div slot="header" class="clearfix">
          <span>社区: {{item.likeName}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="innerJoinLike(item.ids)">加入</el-button>
        </div>
        <div class="text item">
          <span>{{item.likeRemaker}}</span>
        </div>
      </el-card>
      <el-card class="box-card1" shadow="hover">
        <div slot="header">
          <span style="text-align: center;">加入社区的三个步骤</span>
        </div>
        <div class="text item">
          <el-steps :active="autoLenSteps" align-center>
            <el-step title="步骤1" description="选择并寻找想加入的社区"></el-step>
            <el-step title="步骤2" description="选择右上角加入"></el-step>
            <el-step title="步骤3" description="加入成功后退出重新登入"></el-step>
          </el-steps>
        </div>
      </el-card>
    </div>
    <div style="margin-top: 15px;"></div>
    <div>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[6, 9, 12]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 分页器 -->
    </div>
  </div>
</template>

<script>
  import { innerJoinLikeApi, likeMenuTabPageApi } from '@/api/likeCommunity'

  export default {
    name: 'likeCommunity',
    data(){
      return{
        total: 1,//总数
        pageSize: 6,//当前页展示条数
        currentPage: 1,//所在页数
        loadingTab: false,//查看加载
        comList: [],
        likeName: '',//社区名称
        autoLenSteps: 3,
      }
    },
    methods: {
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.likeMenuTabPage();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.likeMenuTabPage();
      },
      //列表接口集成
      likeMenuTabPage(){
        this.loadingTab = true;
        likeMenuTabPageApi({nowTab: this.currentPage, hasTab: this.pageSize, likeName: this.likeName}).then((data) => {
          this.total = data.total;
          this.comList = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      //加入社区
      innerJoinLike(value){
        this.loadingTab = true;
        innerJoinLikeApi({psnLikeId: value}).then((data) => {
          setTimeout(() => {
            if(data.code == 200){
              this.$message.success(data.textMsg);
            }
             this.loadingTab = false;
          }, 500)
        })
      },
    },
    created() {
      this.likeMenuTabPage();
    }
  }
</script>

<style scoped>
  
  .box-card {
    float: left;
    margin: 15px 15px;
    width: 510px;
  }
  .box-card1 {
    margin: 15px 15px;
    width: 100%;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
