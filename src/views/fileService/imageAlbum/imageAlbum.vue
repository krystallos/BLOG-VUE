<template>
  <div>
    <div class="topClass">
      <el-row :gutter="18">
        <el-col :span="4">
          <el-input v-model="sessionPiovince" placeholder="来自省份"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="sessionRegion" placeholder="来自地区"></el-input>
        </el-col>
        <el-col :span="2">
          <el-input v-model="sessionYear" placeholder="年份"></el-input>
        </el-col>
        <el-col :span="2">
          <el-input v-model="sessionMonth" placeholder="月份"></el-input>
        </el-col>
        <el-col :span="2">
        <el-select v-model="isLike" style="width: 100%;" placeholder="是否收藏">
          <el-option label="" value=""></el-option>
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="sendNach">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="openUploadImage">上传图片</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="bottomClass">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="imageAlbumTab"
        style="width: 100%"
        ref="multipleTable">
        <el-table-column prop="imageName" label="照片名称" width="300px"></el-table-column>
        <el-table-column prop="createId" label="上传用户" width="200px"></el-table-column>
        <el-table-column prop="sessionPiovince" label="来自省份" width="150px"></el-table-column>
        <el-table-column prop="sessionRegion" label="来自地区" width="150px"></el-table-column>
        <el-table-column prop="sessionYear" label="年份" width="100px"></el-table-column>
        <el-table-column prop="sessionMonth" label="月份" width="100px"></el-table-column>
        <el-table-column prop="imageUrl" label="轮播图片" width="150px">
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="$hostURL + '/' + scope.row.imageTemp + '/' + scope.row.imageName + '.' + scope.row.fileType"
              @click="openDetialImage($hostURL + '/' + scope.row.imagePath + '/' + scope.row.imageName + '.' + scope.row.fileType)"
              :preview-src-list="srcList"
              lazy>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="建立时间" width="170px"></el-table-column>
        <el-table-column prop="isLikeName" label="是否收藏" width="100px"></el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button @click="handleOpen(scope.row)" type="text" size="small">编辑</el-button>
            <el-button v-if="scope.row.isLike == 0" @click="handleLike(scope.row.ids, 1)" type="text" size="small">加入收藏</el-button>
            <el-button v-if="scope.row.isLike == 1" @click="handleLike(scope.row.ids, 0)" type="text" size="small">取消收藏</el-button>
            <el-button @click="handleDel(scope.row.ids)" type="text" size="small">删除</el-button>
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
      <!-- 外置录入 -->
      <el-dialog
        v-if="sendDialog"
        title="编辑"
        :visible.sync="sendDialog"
        width="30%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
          <div style="padding-bottom: 15px;">
            <el-input v-model="editVo.imageName" placeholder="请输入照片名称">
              <template slot="prepend">照片名称</template>
            </el-input>
          </div>
          <div style="padding-bottom: 15px;">
            <el-input v-model="editVo.sessionPiovince" placeholder="请输入照片来源省份">
              <template slot="prepend">来源省份</template>
            </el-input>
          </div>
          <div style="padding-bottom: 15px;">
            <el-input v-model="editVo.sessionRegion" placeholder="请输入照片来源地区">
              <template slot="prepend">来源地区</template>
            </el-input>
          </div>
          <div style="padding-bottom: 15px;">
            <el-input v-model="editVo.sessionYear" placeholder="请输入照片拍摄年份">
              <template slot="prepend">年份</template>
            </el-input>
          </div>
          <div style="padding-bottom: 15px;">
            <el-input v-model="editVo.sessionMonth" placeholder="请输入照片拍摄月份">
              <template slot="prepend">月份</template>
            </el-input>
          </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleEdit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <!-- 上传文件 -->
      <el-dialog
        title="文件上传"
        v-if="uploadDialogVisible"
        :visible.sync="uploadDialogVisible"
        top="35px"
        width="30%"
        :destroy-on-close='true'
        :close-on-click-modal="false">
        <div>
          <uploadImaegAlbum />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {selectImageAlbumApi, delImageAlbumApi, likeImageAlbumApi, editImageAlbumApi} from '@/api/imageAlbum'
  import uploadImaegAlbum from './uploadImaegAlbum.vue'

  export default {
    name: 'imageAlbum',
    components: {
      uploadImaegAlbum
    },
    data(){
      return{
        sessionPiovince: '',
        sessionRegion: '',
        sessionYear: '',
        sessionMonth: '',
        isLike: '',

        /* 表格 */
        loadingTab: false,
        imageAlbumTab: [],
        total: 1,
        currentPage: 1,
        pageSize: 10,

        ids: '',
        srcList: [],
        sendDialog: false,
        editVo: null,
        uploadDialogVisible: false,
      }
    },
    methods: {
      htmlReplace(sHtml) {
        return encodeURIComponent(sHtml);
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.selectImageAlbum();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.selectImageAlbum();
      },
      selectImageAlbum(){
        this.loadingTab = true
        selectImageAlbumApi({
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          sessionPiovince: this.sessionPiovince,
          sessionRegion: this.sessionRegion,
          sessionYear: this.sessionYear,
          sessionMonth: this.sessionMonth,
          isLike: this.isLike
        }).then((data) => {
          this.total = data.total;
          this.imageAlbumTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 500)
        })
      },
      //搜索记录
      sendNach(){
        this.currentPage = 1;
        this.pageSize = 10;
        this.selectImageAlbum();
      },
      //打开图片详细信息
      openDetialImage(url){
        this.srcList = [];
        this.srcList.push(url);
      },
      handleLike(ids, value){
        this.loadingTab = true;
        likeImageAlbumApi({
          ids: ids,
          isLike: value
        }).then((data) => {
          this.loadingTab = false;
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.sendNach()
          }
        })
      },
      handleDel(value){
        this.loadingTab = true;
        delImageAlbumApi({
          ids: value
        }).then((data) => {
          this.loadingTab = false;
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.sendNach()
          }
        })
      },
      handleOpen(value){
        this.sendDialog = true;
        this.editVo = null;
        this.editVo = value;
      },
      handleEdit(){
        let vo = this.editVo;
        editImageAlbumApi({
          ids: vo.ids,
          imageName: vo.imageName,
          sessionPiovince: vo.sessionPiovince,
          sessionRegion: vo.sessionRegion,
          sessionYear: vo.sessionYear,
          sessionMonth: vo.sessionMonth
        }).then((data) => {
          this.$message.success(data.textMsg);
          this.sendDialog = false;
          this.sendNach()
        })
      },
      //打开上传文件
      openUploadImage(){
        this.uploadDialogVisible = true
      },
    },
    created() {
      this.selectImageAlbum();
    }
  }
</script>

<style scoped>
  .bottomClass {
    margin-top: 15px;
  }
</style>
