<template>
  <div>
    <div>
      <!-- 顶部按钮 -->
      <el-button type="primary" plain @click="sendNach">发布轮播信息</el-button>
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="appNavTab"
        style="width: 100%">
        <el-table-column prop="imageUrl" label="轮播图片" width="280">
          <template slot-scope="scope">
            <el-image
              style="width: 70px; height: 70px"
              :src="$hostURL + scope.row.imageUrl"
              :preview-src-list="srcImage"
              @click="openImage($hostURL + scope.row.imageUrl)"
              lazy>
            </el-image>
          </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="message" label="文本描述"></el-table-column>
        <el-table-column prop="gotoUrl" label="指向地址"></el-table-column>
        <el-table-column prop="sysType" label="系统类型ID" width="180"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="updateNach(scope.row.ids)">更新</el-button>
            <el-button size="mini" type="danger" @click="delNach(scope.row.ids)">删除</el-button>
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
      <!-- 发布轮播 -->
      <el-dialog
        v-if="sendDialog"
        title="发布轮播"
        :visible.sync="sendDialog"
        width="60%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
        <div style="margin: 0 15px 0 15px;">
          <sendSysNachrichten :sendDialog.sync="sendDialog" :nachrVo="nachrVo" :openType="openType"/>
        </div>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {nachrichtenListApi, delNachrichtenApi, getNachrichtenApi } from '@/api/sysNachrichten'
  import sendSysNachrichten from './sendSysNachrichten.vue'

  export default {
    name: 'sysMessage',
    components: {
      sendSysNachrichten
    },
    data(){
      return{
        /* 表格 */
        loadingTab: false,
        appNavTab: [],
        total: 1,
        currentPage: 1,
        pageSize: 10,
        srcImage: [],

        /* 表单*/
        sendDialog: false,
        nachrVo: [],
        openType: 0,
      }
    },
    methods: {
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.getNavList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getNavList();
      },
      getNavList(){
        this.loadingTab = true
        nachrichtenListApi({nowTab: this.currentPage, hasTab: this.pageSize}).then((data) => {
          this.total = data.total;
          this.appNavTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      openImage(url){
        this.srcImage = [];
        this.srcImage.push(url)
      },
      updateNach(value){
        getNachrichtenApi({ids: value}).then((data) => {
          if(data.code == 200){
            this.openType = 1;
            this.nachrVo = data.data;
            this.sendDialog = true;
          }
        })
      },
      sendNach(){
        this.openType = 0;
        this.sendDialog = true;
      },
      delNach(value){
        delNachrichtenApi({ids: value}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.pageSize = 10;
            this.currentPage = 1;
            this.getNavList()
          }
        })
      }
    },
    created() {
      this.getNavList();
    }
  }
</script>

<style>
</style>
