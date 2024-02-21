<template>
  <div>
    <div class="topClass">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input v-model="originName" placeholder="原作名称"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="englishName" placeholder="英文名称"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="chineseName" placeholder="中文名称"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="authorName" placeholder="作者"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="pressName" placeholder="出版社"></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="libilName" placeholder="文库"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="sendNach">搜索</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button style="width: 50%;" type="primary" @click="handleInsert()" plain>添加书籍</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="bottomClass">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="fictionTab"
        style="width: 100%">
        <el-table-column label="原作名" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <p style="font-weight: 600;">{{ scope.row.tagName }}</p>
              <div slot="reference" class="name-wrapper">
                {{ scope.row.originName }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="englishName" label="英文名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="chineseName" label="中译名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="authorName" label="作者" width="120px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pressName" label="出版社" width="150px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="libilName" label="文库" width="150px" show-overflow-tooltip></el-table-column>
        <el-table-column label="连载时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              {{ scope.row.chainBegin }} - {{ scope.row.chainEnd == null?'未完结':scope.row.chainEnd }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleBook(scope.row.ids)">查看篇章</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.ids)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row.ids)">删除</el-button>
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
      <!-- 添加修改 -->
      <el-dialog
        v-if="sendDialog"
        title="小说管理"
        :visible.sync="sendDialog"
        width="50%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
        <div style="margin: 0 15px 0 15px;">
          <fictionEdit :sendDialog.sync="sendDialog" :openType="openType" :ids="ids"/>
        </div>
      </el-dialog>
      <!-- 添加 -->
      <!-- 查看书籍-->
      <el-dialog
        v-if="bookDialog"
        title="小说书籍"
        :visible.sync="bookDialog"
        width="70%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
        <div style="margin: 0 15px 0 15px;">
          <fictionBook :bookDialog.sync="bookDialog" :bookIds="ids"/>
        </div>
      </el-dialog>
      <!-- 查看书籍-->
    </div>
  </div>
</template>

<script>
  import {fictionFileListApi, delFictionFileApi } from '@/api/fictionTab'
  import fictionEdit from './fictionEdit.vue'
  import fictionBook from './fictionBook.vue'

  export default {
    name: 'fictionTab',
    components: {
      fictionEdit,
      fictionBook
    },
    data(){
      return{
        originName: '',
        englishName: '',
        chineseName: '',
        pressName: '',
        authorName: '',
        libilName: '',
        /* 表格 */
        loadingTab: false,
        fictionTab: [],
        total: 1,
        currentPage: 1,
        pageSize: 10,
        /* 添加修改 */
        sendDialog: false,
        bookDialog: false,
        ids:'',
        openType: 0,
      }
    },
    methods: {
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.fictionFileList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.fictionFileList();
      },
      fictionFileList(){
        this.loadingTab = true
        fictionFileListApi({
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          originName: this.originName,
          englishName: this.englishName,
          chineseName: this.chineseName,
          pressName: this.pressName,
          authorName: this.authorName,
          libilName: this.libilName,
        }).then((data) => {
          this.total = data.total;
          this.fictionTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 500)
        })
      },
      //搜索记录
      sendNach(){
        this.currentPage = 1;
        this.pageSize = 10;
        this.fictionFileList();
      },
      handleDel(value){
        this.loadingTab = true;
        delFictionFileApi({
          ids: value
        }).then((data) => {
          this.$message.success(data.textMsg);
          this.loadingTab = false;
          this.sendNach()
        })
      },
      handleEdit(value){
        this.ids = value;
        this.openType = 1;
        this.sendDialog = true;
      },
      handleInsert(){
        this.openType = 0;
        this.sendDialog = true;
      },
      handleBook(value){
        this.ids = value;
        this.bookDialog = true;
      }
    },
    created() {
      this.fictionFileList();
    }
  }
</script>

<style scoped>
  .bottomClass {
    margin-top: 15px;
  }
</style>
