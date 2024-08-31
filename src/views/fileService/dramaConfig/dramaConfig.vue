<template>
  <div>
    <div class="topClass">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="dramaName" placeholder="番剧名称"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="productionYear" placeholder="年份"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="sendNach">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="insertOrUpdate(1, null)" plain>新增</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="bottomClass">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="dramaConfigTab"
        style="width: 100%">
        <el-table-column prop="dramaName" label="番剧名称" width="500px"></el-table-column>
        <el-table-column prop="dramaPath" label="番剧路径"  width="500px"></el-table-column>
        <el-table-column prop="dramaImage" label="番剧封面">
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="$hostURL + scope.row.dramaPath + scope.row.dramaImage"
              @click="openDetialImage($hostURL + scope.row.dramaPath + scope.row.dramaImage)"
              lazy>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="productionYear" label="发布年份"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="insertOrUpdate(2, scope.row.ids)">修改</el-button>
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
      <!-- 新增/删除 -->
      <el-dialog
        v-if="sendDialog"
        title="外置录入"
        :visible.sync="sendDialog"
        width="30%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
        <div style="margin: 0 15px 0 15px;">
          <el-input placeholder="请输入番剧名称" v-model="dramaNameInput">
            <template slot="prepend">番剧名称</template>
          </el-input>
          <div style="margin-top: 10px;"></div>
          <el-input placeholder="请输入番剧所在文件夹" v-model="dramaPathInput">
            <template slot="prepend">番剧路径</template>
          </el-input>
          <div style="margin-top: 10px;"></div>
          <el-input placeholder="请输入番剧图片路径" v-model="dramaImageInput">
            <template slot="prepend">番剧图片路径</template>
          </el-input>
          <div style="margin-top: 10px;"></div>
          <el-input placeholder="请输入发布年份" type="number" v-model="productionYearInput">
            <template slot="prepend">发布年份</template>
          </el-input>
          <div style="margin-top: 10px;"></div>
          <el-input placeholder="请输入未观看集数" v-model="unPlayInput">
            <template slot="prepend">未观看集数</template>
          </el-input>
          <div style="margin-top: 10px;"></div>
          <el-input placeholder="请输入RSS订阅地址" v-model="rssInput">
            <template slot="prepend">RSS订阅地址</template>
          </el-input>
          <div style="margin-top: 10px;"></div>
          <el-button v-if="isType" style="width: 100%;" type="primary" @click="insertOrupdateConfig(1)">更新</el-button>
          <el-button v-if="!isType" style="width: 100%;" type="primary" @click="insertOrupdateConfig(2)">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {dramaListTabApi, getDetialdramaApi, delDramaApi, editDramaApi, insertDramaApi } from '@/api/dramaConfig'

  export default {
    name: 'dramaConfig',
    data(){
      return{
        dramaName: '',
        productionYear: '',
        /* 表格 */
        loadingTab: false,
        dramaConfigTab: [],
        srcImage: [],
        total: 1,
        currentPage: 1,
        pageSize: 10,
        /* 表单*/
        sendDialog: false,
        isType: false,
        dramaNameInput: '',
        dramaPathInput: '',
        dramaImageInput: '',
        productionYearInput: '',
        unPlayInput: '',
        rssInput: '',
        ids: '',
      }
    },
    methods: {
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.dramaListTab();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.dramaListTab();
      },
      dramaListTab(){
        this.loadingTab = true
        dramaListTabApi({
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          dramaName: this.dramaName,
          productionYear: this.productionYear
        }).then((data) => {
          this.total = data.total;
          this.dramaConfigTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 500)
        })
      },
      openDetialImage(url){
        this.srcImage = [];
        this.srcImage.push(url)
      },
      //搜索记录
      sendNach(){
        this.currentPage = 1;
        this.pageSize = 10;
        this.dramaListTab();
      },
      handleDel(value){
        this.loadingTab = true;
        delDramaApi({
          ids: value
        }).then((data) => {
          this.$message.success(data.textMsg);
          this.loadingTab = false;
          this.sendNach()
        })
      },
      insertOrUpdate(value, ids){
        if(value == 1){
          this.isType = false;
          this.dramaNameInput = null,
          this.dramaPathInput = null,
          this.dramaImageInput = null,
          this.productionYearInput = null,
          this.unPlayInput = null,
          this.rssInput = null,
          this.ids = null;
        }else{
          this.isType = true;
          this.infoConfig(ids);
        }
        this.sendDialog = true;
      },
      infoConfig(value){
        getDetialdramaApi({
          ids: value
        }).then((data) => {
          if(data.code == 200){
            let {ids, dramaName, dramaPath, dramaImage, productionYear, unPlay, rss} = data.data
            this.dramaNameInput = dramaName,
            this.dramaPathInput = dramaPath,
            this.dramaImageInput = dramaImage,
            this.productionYearInput = productionYear,
            this.unPlayInput = unPlay,
            this.rssInput = rss,
            this.ids = ids;
          }
        })
      },
      insertOrupdateConfig(value){
        if(this.dramaNameInput == null || this.dramaNameInput == '' || typeof this.dramaNameInput == undefined){this.$message.warning("请输入番剧名称");return}
        if(this.dramaPathInput == null || this.dramaPathInput == '' || typeof this.dramaPathInput == undefined){this.$message.warning("请输入番剧路径");return}
        if(this.dramaImageInput == null || this.dramaImageInput == '' || typeof this.dramaImageInput == undefined){this.$message.warning("请输入图片路径");return}
        if(this.productionYearInput == null || this.productionYearInput == '' || typeof this.productionYearInput == undefined){this.$message.warning("请输入发布年份");return}
        if(this.unPlayInput == null || this.unPlayInput == '' || typeof this.unPlayInput == undefined){this.unPlayInput = 0}
        if(this.rssInput == null || this.rssInput == '' || typeof this.rssInput == undefined){this.rssInput = ""}
        if(value == 1){
          editDramaApi({
            ids: this.ids,
            dramaName: this.dramaNameInput,
            dramaPath: this.dramaPathInput,
            dramaImage: this.dramaImageInput,
            productionYear: this.productionYearInput,
            unPlay: this.unPlayInput,
            rss: this.rssInput
          }).then((data) => {
            if(data.code == 200){
              this.$message.success(data.textMsg);
              this.sendDialog = false;
              this.sendNach()
            }
          })
        }else{
          insertDramaApi({
            dramaName: this.dramaNameInput,
            dramaPath: this.dramaPathInput,
            dramaImage: this.dramaImageInput,
            productionYear: this.productionYearInput,
            unPlay: this.unPlayInput,
            rss: this.rssInput
          }).then((data) => {
            if(data.code == 200){
              this.$message.success(data.textMsg);
              this.sendDialog = false;
              this.sendNach()
            }
          })
        }
      },
    },
    created() {
      this.dramaListTab();
    }
  }
</script>

<style scoped>
  .bottomClass {
    margin-top: 15px;
  }
</style>
