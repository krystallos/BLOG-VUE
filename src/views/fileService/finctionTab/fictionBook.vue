<template>
  <div>
    <div class="topClass">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="fictionOriginNameInput" placeholder="请输入书籍名称"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="sendNach">查询书籍</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="sendHand">查看封面</el-button>
        </el-col>
        <el-col :span="3">
          <el-upload
            class="upload-demo"
            action="/blosBoot/upload/fictionFileUpload.act"
            :on-success="handleSuccess"
            :multiple="false"
            :limit="1"
            :headers="headers"
            :data="{'fictionId': this.bIds}"
            :file-list="fileList"
            >
            <el-button type="warning">上传小说</el-button>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <div class="bottomClass">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="fictionBookTab"
        style="width: 100%">
        <el-table-column prop="fictionOriginName" label="书籍名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fictionBookName" label="入库名称" width="180px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" label="入库时间" width="180px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bookSort" label="序号" width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
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
      <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]" style="z-index: 3000;" />
    </div>
  </div>
</template>

<script>
  import {fictionFileMainListApi, delFictionMainApi, lookBookMainCoverApi } from '@/api/fictionTab'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'fictionBook',
    components: {
      'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
    },
    props: ['bookDialog', 'bookIds'],
    data(){
      return{
        bIds: this.bookIds,
        fictionOriginNameInput: '',
        /* 表格 */
        loadingTab: false,
        fictionBookTab: [],
        total: 1,
        currentPage: 1,
        pageSize: 10,
        /* 图片*/
        showViewer: false, // 显示查看器
        url: '',// url地址
        headers: {
          "assessToken": getToken()
        },
        fileList: []
      }
    },
    methods: {
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.fictionFileMainList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.fictionFileMainList();
      },
      fictionFileMainList(){
        this.loadingTab = true
        fictionFileMainListApi({
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          fictionId: this.bIds,
          fictionOriginName: this.fictionOriginNameInput
        }).then((data) => {
          this.total = data.total;
          this.fictionBookTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 500)
        })
      },
      //搜索记录
      sendNach(){
        this.currentPage = 1;
        this.pageSize = 10;
        this.fictionFileMainList();
      },
      sendHand(){
        lookBookMainCoverApi({
          ids: this.bIds
        }).then((data) => {
          this.showViewer = true;
          this.url = this.$hostURL + data.data.illustrationUrl;
        })
      },
      closeViewer(){
        this.showViewer = false;
      },
      handleDel(value){
        this.loadingTab = true;
        delFictionMainApi({
          ids: value
        }).then((data) => {
          this.$message.success(data.textMsg);
          this.loadingTab = false;
          this.sendNach()
        })
      },
      handleSuccess(file) {
        this.fileList = []
        this.$message.success("小说上传成功");
        this.fictionFileMainList();
      }
    },
    created() {
      this.fictionFileMainList();
    }
  }
</script>

<style>
</style>
