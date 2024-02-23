<template>
  <div>
    <el-divider content-position="left"><span style="font-size: 15px;font-weight: 600;">用户信息</span></el-divider>
    <div style="margin: 15px;">
      <el-descriptions>
          <el-descriptions-item label="用户名">{{psnName}}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{psnPhone}}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{email}}</el-descriptions-item>
          <el-descriptions-item label="所属社区">{{likeCommunity}}</el-descriptions-item>
          <el-descriptions-item label="账号建立时间">{{createDate}}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div style="margin-top: 15px;"></div>
    <el-divider content-position="left"><span style="font-size: 15px;font-weight: 600;">归档</span></el-divider>
    <div style="box-shadow: 0 3px 5px 3px rgba(110,110,110,.1);">
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="最近" name="1" ><mineBlosCountTab :sysType="sysType" v-if="isTab == '1'" /></el-tab-pane>
        <el-tab-pane label="资源" name="3"><mineBlosCountTab :sysType="sysType" v-if="isTab == '3'" /></el-tab-pane>
        <el-tab-pane label="收藏" name="4"><mineBlosCountTab :sysType="sysType" v-if="isTab == '4'" /></el-tab-pane>
      </el-tabs>
    </div>
    <div style="margin-top: 15px;"></div>
    <el-divider content-position="left"><span style="font-size: 15px;font-weight: 600;">文章管理</span></el-divider>
    <div style="box-shadow: 0 3px 5px 3px rgba(110,110,110,.3);">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="mineBlosTab"
        style="width: 100%;padding: 5px;">
        <el-table-column prop="clobTitle" label="文章名称"></el-table-column>
        <el-table-column prop="actName" label="分类" width="150px"></el-table-column>
        <el-table-column prop="psnName" label="用户" width="70px"></el-table-column>
        <el-table-column prop="createDate" label="建立时间" width="170px"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" @click="openBlos(scope.row.ids)">编辑</el-button>
            <el-button type="danger" @click="delBlos(scope.row.ids)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="padding-top: 10px;"></div>
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
    </div>
    <div>
      <!-- 详细信息 -->
      <el-dialog
        v-if="dialogVisible"
        title="文章详情"
        :visible.sync="dialogVisible"
        width="85%"
        top="25px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        >
        <div>
          <writeBlosConfig :ids="ids"/>
        </div>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
      <!-- 详细信息 -->
    </div>
  </div>
</template>

<script>
  import mineBlosCountTab from './mineBlosCountTab.vue'
  import writeBlosConfig from './writeBlosConfig.vue'
  import {mineBlosArticleApi, delMineBlosArticleApi} from '@/api/mineBlosCount'

  export default {
    name: 'mineBlosCount',
    components: {
      mineBlosCountTab,
      writeBlosConfig
    },
    data () {
      return {
        psnName: '',
        psnPhone: '',
        email: '',
        likeCommunity: '',
        createDate: '',

        sysType: '1',
        activeName: '1',
        isTab: '1',

        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        mineBlosTab: [],//表格数据
        loadingTab: false,//加载

        ids: null,      //打开的博客详情ID
        dialogVisible: false, //博客详情
      };
    },
    methods: {
      handleClick(tab, event) {
        this.sysType = tab.$props.name;
        this.isTab = tab.$props.name;
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.getListMineBlosArt();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getListMineBlosArt();
      },
      getListMineBlosArt(){
        this.loadingTab = true;
        mineBlosArticleApi({
            nowTab: this.currentPage,
            hasTab: this.pageSize
          }).then((data) => {
            this.loadingTab = false;
            this.mineBlosTab = data.data
            this.total = data.total
          })
      },
      delBlos(ids){
        delMineBlosArticleApi({
          ids: ids
        }).then((data) => {
          this.getListMineBlosArt();
        })
      },
      openBlos(ids){
        this.ids = ids;
        this.dialogVisible = true;
      }
    },
    created() {
      let person = sessionStorage.getItem("person");
      if(person == null){
        this.$message.warning("获取不到用户信息，建议退出重新登入刷新");
      }else{
        let {email,psnName,psnLikeName,phone,createDate } = JSON.parse(person);
        this.email = email;
        this.psnName = psnName;
        this.psnPhone = phone;
        this.likeCommunity = psnLikeName;
        this.createDate = createDate;
        this.getListMineBlosArt();
      }
    }
  }
</script>

<style>
</style>
