<template>
  <div>
    <!-- 系统信息 -->
    <div style="width: 100%;">
      <el-card shadow="hover" class="box-card1">
        <div slot="header" class="clearfix">
          <span class="cardText">正在维护的数据</span>
        </div>
        <div class="text item">
          <span>文件 {{hasFile}} 件</span>
        </div>
        <div class="text item">
          <span>书籍 {{hasBook}} 件</span>
        </div>
      </el-card>
      <el-card shadow="hover" class="box-card1">
        <div slot="header" class="clearfix">
          <span class="cardText">相关邮件</span>
        </div>
        <div class="text item">
          <span>接收/发送 {{hasEmail}} 件</span>
        </div>
      </el-card>
      <el-card shadow="hover" class="box-card1">
        <div slot="header" class="clearfix">
          <span class="cardText">用户身份</span>
        </div>
        <div class="text item">
          <span>{{userName}} / {{isAdmin}}</span>
        </div>
      </el-card>
      <el-card shadow="hover" class="box-card2">
        <div slot="header" class="clearfix">
          <span class="cardText">对外博客地址</span>
        </div>
        <div class="text item">
          <el-link icon="el-icon-view" type="primary" @click="openArticle(blosUrl)">{{blosUrl}}</el-link>
        </div>
      </el-card>
      <div style="padding-top: 1px;"></div>
    </div>
    <div style="margin-top: 15px;"></div>
    <div>
      <!-- 顶部按钮 -->
      <el-button type="primary" plain @click="issBug">提交BUG</el-button>
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        highlight-current-row
        :data="bugTab"
        style="width: 100%"
        ref="multipleTable">
        <el-table-column prop="errTitle" label="标题"></el-table-column>
        <el-table-column prop="errPsnName" label="建立者" width="180"></el-table-column>
        <el-table-column prop="createDate" label="建立时间" width="180"></el-table-column>
        <el-table-column prop="isOk" label="是否解决" width="180"></el-table-column>
        <el-table-column prop="isType" label="优先级" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="errBugGet(scope.row.ids)">详情</el-button>
            <el-button size="mini" type="warning" @click="isChange(scope.row.ids)">撤回BUG</el-button>
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
    <!-- BUG详细信息 -->
    <el-dialog
      v-if="dialogVisible"
      title="BUG详情"
      :visible.sync="dialogVisible"
      width="60%"
      top="35px"
      bottom="35px"
      :modal='true'
      :destroy-on-close='true'
      :close-on-click-modal="false"
      >
      <div style="margin: 0 15px 0 15px;">
        <getSysMessageErr :ids="errBugIds" />
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <!-- 提交BUG -->
    <el-dialog
      v-if="sendDialog"
      title="提交BUG"
      :visible.sync="sendDialog"
      width="60%"
      top="35px"
      :modal='true'
      :destroy-on-close='true'
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="item-dialog"
      >
      <div style="margin: 0 15px 0 15px;">
        <sendSysMessageErr :sendDialog.sync="sendDialog"/>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script>
  import { mineSysMsgGetApi, sysMsgErrorApi, backErrFromAddApi } from '@/api/sysMessage';
  import getSysMessageErr from './getSysMessageErr.vue'
  import sendSysMessageErr from './sendSysMessageErr.vue'

  export default {
    name: 'sysMessage',
    components: {
      getSysMessageErr,
      sendSysMessageErr
    },
    data(){
      return{
        hasFile: 0,
        hasBook: 0,
        hasEmail: 0,
        userName: '未知名称',
        isAdmin: '用户',
        blosUrl: '',
        /* 表格 */
        loadingTab: false,
        bugTab: [],
        total: 1,
        currentPage: 1,
        pageSize: 10,
        /* 详情 */
        dialogVisible: false,
        errBugIds: '',
        /* 提交 */
        sendDialog: false,

      }
    },
    methods: {
      getMineSys(){
        mineSysMsgGetApi({}).then((data) => {
          if(data.code == 200){
            let { blosUrl, hasBook, hasEmail, hasFile, isAdmin, name } = data.data;
            this.blosUrl = blosUrl;
            this.hasBook = hasBook;
            this.isAdmin = isAdmin;
            this.userName = name;
            this.hasEmail = hasEmail;
            this.hasFile = hasFile;
          }
        })
      },
      getErrList(){
        this.loadingTab = true
        sysMsgErrorApi({nowTab: this.currentPage, hasTab: this.pageSize}).then((data) => {
          this.total = data.total;
          this.bugTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.getErrList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getErrList();
      },
      //提交bug
      issBug(){
        this.sendDialog = true;
      },
      /* 撤回BUG */
      isChange(value) {
        backErrFromAddApi({ids: value}).then((data) => {
          if(data.code == 200){
            this.$message.success("撤回成功！");
            this.pageSize = 10;
            this.currentPage = 1;
            this.getErrList();
          }
        })
      },
      //详情页
      errBugGet(value){
        this.errBugIds = value;
        this.dialogVisible = true;
      },
      openArticle(value){
        let url = value.split('?ids=');
        const routeData = this.$router.resolve({
          path: '/mineBlos',
          query: {
            ids: url[1],
            type: "view",
            modelId: this.cuurentNodeKey,
            readOnly: true,
            isFullScreen: true
          }
        })
        window.open(routeData.href, '_blank')
      }
    },
    created() {
      this.getMineSys();
      this.getErrList();
    }
  }
</script>

<style scoped>

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card1 {
    margin: 20px 20px;
    width: 480px;
    float: left;
  }

  .box-card2 {
    width: 98%;
    margin: 20px 20px;
  }

  .cardText {
    font-size: 18px large;
    font-weight: 600;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

</style>
