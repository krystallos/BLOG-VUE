<template>
  <div>
    <div class="topClass">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="codeMind" placeholder="包含的图片ID"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="path" placeholder="文件保存路径"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="codeType" style="width: 100%;" placeholder="图片类型">
            <el-option label="" value=""></el-option>
            <el-option label="识别文件" value="1"></el-option>
            <el-option label="二维码文件" value="0"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="sendNach">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="bottomClass">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="fileCodeTab"
        style="width: 100%">
        <el-table-column prop="codeMind" show-overflow-tooltip label="包含的图片ID"></el-table-column>
        <el-table-column prop="passWord" label="加密密码（为空则没有密码）"></el-table-column>
        <el-table-column prop="path" label="图片地址"></el-table-column>
        <el-table-column prop="itemPath" label="轮播图片">
          <template slot-scope="scope">
            <el-image
              style="width: 70px; height: 70px"
              :src="$hostURL + scope.row.itemPath"
              :preview-src-list="srcImage"
              @click="openImage($hostURL + scope.row.itemPath)"
              lazy>
            </el-image>
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
  </div>
</template>

<script>
  import {fileCodeLookListApi } from '@/api/fileCode'

  export default {
    name: 'fileCode',
    data(){
      return{
        codeMind: '',
        path: '',
        codeType: '',
        /* 表格 */
        loadingTab: false,
        fileCodeTab: [],
        total: 1,
        currentPage: 1,
        pageSize: 10,
        /* 图片 */
        srcImage: [],
      }
    },
    methods: {
      //打开图片
      openImage(url){
        this.srcImage = [];
        this.srcImage.push(url)
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.fileCodeLookList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.fileCodeLookList();
      },
      fileCodeLookList(){
        this.loadingTab = true
        fileCodeLookListApi({
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          codeMind: this.codeMind,
          path: this.path,
          codeType: this.codeType
        }).then((data) => {
          this.total = data.total;
          this.fileCodeTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 500)
        })
      },
      //搜索记录
      sendNach(){
        this.currentPage = 1;
        this.pageSize = 10;
        this.fileCodeLookList();
      },
    },
    created() {
      this.fileCodeLookList();
    }
  }
</script>

<style>
</style>
