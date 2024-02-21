<template>
  <div>
    <div class="topClass">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="pathName" placeholder="文件路径"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="fileName" placeholder="文件名称"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="tagName" placeholder="图片标签"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="select" style="width: 100%;" placeholder="公开/非公开资源">
            <el-option label="" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="sendNach">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="imgClass">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="fileImageTab"
        style="width: 100%"
        ref="multipleTable">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="pathName" label="文件路径" width="250px"></el-table-column>
        <el-table-column prop="fileName" label="文件名称" width="400px"></el-table-column>
        <el-table-column prop="tagNameList" label="图片标签" width="250px">
          <template slot-scope="scope">
            <el-tag style="margin: 2px;" v-for="item in scope.row.tagNameList" @click="addTagSelect(item)">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fileType" label="文件类型" width="150px"></el-table-column>
        <el-table-column prop="imageUrl" label="轮播图片">
          <template slot-scope="scope">
            <el-image
              style="width: 70px; height: 70px"
              :src="$hostURL + scope.row.thumbnail + htmlReplace(scope.row.fileName)"
              :preview-src-list="srcImage"
              @click="openImage($hostURL + scope.row.lonPathNameType + htmlReplace(scope.row.fileName))"
              lazy>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="psnName" label="所属用户" width="150px"></el-table-column>
        <el-table-column prop="createDate" label="建立时间" width="170px"></el-table-column>
        <el-table-column prop="isHas" label="是否公开" width="100px"></el-table-column>
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
  import { fileImageTabListApi, fileReadyApi, fileDelOkApi } from "@/api/fileImage"

  export default {
    name: 'fileImageVisitor',
    data(){
      return{
        pathName: '',
        fileName: '',
        tagName: '',
        select: '1',
        /* 表格 */
        loadingTab: false,
        fileImageTab: [],
        total: 1,
        currentPage: 1,
        pageSize: 10,
        /* 图片 */
        srcImage: [],
        openHiddenButton: false,
      }
    },
    methods: {
      htmlReplace(sHtml) {
        return encodeURIComponent(sHtml);
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.getImageList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getImageList();
      },
      getImageList(){
        this.loadingTab = true
        fileImageTabListApi({
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          pathName: this.pathName,
          fileName: this.fileName,
          tagName: this.tagName,
          isHas: this.select,
        }).then((data) => {
          this.total = data.total;
          this.fileImageTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 500)
        })
      },
      //搜索记录
      sendNach(){
        this.currentPage = 1;
        this.pageSize = 10;
        this.getImageList();
      },
      //打开图片
      openImage(url){
        this.srcImage = [];
        this.srcImage.push(url)
      },
    },
    created() {
      this.getImageList();
    }
  }

</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .topClass {
    margin-top: 10px;
  }

  .imgClass {
    margin-top: 15px;
  }
</style>
