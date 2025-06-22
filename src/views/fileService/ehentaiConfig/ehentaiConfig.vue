<template>
  <div>
    <!-- 顶部锚点-->
    <div
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(231, 231, 231, 0.2)"
      element-loading-text="拼命加载中"
    ></div>
    <div class="topClass">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="ehentaiName" placeholder="文件名称"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="ehentaiAuthor" placeholder="作者名称"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="sendNach">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" @click="fileLoading" plain>文件同步</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="groupTime">
      <el-row>
        <el-col :span="4" v-for="item in findListGroup" class="groupBox">
          <el-card :body-style="{ padding: '0px' }">
            <el-image :src="$hostURL + '/ehentai/' + htmlReplace(item.bookName) + item.bookImage" fit="cover" style="height: 300px;" lazy></el-image>
            <div style="padding:0 14px 14px 14px;">
                <div class="hentaiTitle">
                  <span @click="open(item.bookName, item.bookAuthor)">{{item.bookName}}</span>
                </div>
              <div class="clearfix">
                <span class="time">作者： {{ item.bookAuthor }}</span>
              </div>
              <div class="clearfix">
                <span class="time">引入时间： {{ item.bookSaveTime }}</span>
              </div>
              <div class="bottom clearfix">
                <el-tag @click="editBook(item.ids)">编辑</el-tag>
              </div>
              <div class="bottom clearfix">
                <el-tag @click="openBook(item.ids)">预览</el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div style="padding-top: 10px;"></div>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[12, 24, 36]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 回滚顶部 -->
    <el-backtop></el-backtop>

    <!-- 图片详细信息 -->
    <el-dialog
      title="详情"
      v-if="detialDialogVisible"
      :visible.sync="detialDialogVisible"
      top="20px"
      width="60%"
      :destroy-on-close='true'
      :close-on-click-modal="false">
      <div
        class="mainDiv"
        v-loading="bookLoading"
        element-loading-background="rgba(255, 255, 255, 0.2)"
      >
        <div class="authorDiv" v-if="ehentaiType == 1">
          <div class="block" v-for="fileTemp in ehentaiFile">
            <span>fileTemp</span>
          </div>
        </div>

        <div class="imageDiv" v-if="ehentaiType == 0">
          <div :style="{'width': detialImageAspect, 'margin': '0 auto', 'background-color':'#f5f5f5'}">
            <el-image
              fits="contain"
              class="imgCententBlosType"
              :preview-src-list="srcList"
              :src="$hostURL + '/ehentai/' + detialImageUrl">
            </el-image>
          </div>
          <div class="textDiv">
            <el-button type="primary" plain @click="up()">上一页</el-button>
            <el-button type="primary" plain @click="down()">下一页</el-button>
          </div>
        </div>

      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { selectEhentaiFileApi, updateEhentaiFileApi, editEhentaiFileApi, openEhentaiFileApi } from '@/api/mineEhentaiConfig'

  export default {
    name: 'ehentaiConfig',
    data () {
      return {
        /* 加载*/
        fullscreenLoading: false,
        ehentaiName: null,
        ehentaiAuthor: null,
        findListGroup: [],
        /* 分页*/
        total: 1,
        currentPage: 1,
        pageSize: 12,
        /* 文件列表*/
        ehentaiFile: [],
        ehentaiType: 0,
        detialDialogVisible: false,
        detialImageAspect: '0%',
        detialImageWidth: 0,
        detialImageHeight: 0,
        nowIndex: 0,
        srcList: [],
        bookLoading: false,
      }
    },
    methods: {
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.eHentaiList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.eHentaiList();
      },
      //搜索记录
      sendNach(){
        this.currentPage = 1;
        this.pageSize = 12;
        this.eHentaiList();
      },
      eHentaiList(){
        this.fullscreenLoading = true
        selectEhentaiFileApi({
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          bookName: this.ehentaiName,
          bookAuthor: this.ehentaiAuthor
        }).then((data) => {
          this.total = data.total;
          this.findListGroup = data.data;
          setTimeout(() => {
             this.fullscreenLoading = false;
          }, 500)
        })
      },
      editBook(ids){
        this.$prompt('新的作者名称', '更新作者', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          editEhentaiFileApi({
            ids: ids,
            bookAuthor: value
          }).then((data) => {
            this.$message({
              type: 'success',
              message: '更新完成'
            });
            this.sendNach();
          })
        });
      },
      openBook(ids){
        openEhentaiFileApi({ids: ids}).then((data) => {
          if(data.code == 200){
            let fileList = data.data;
            if(data.total == 1){
              this.ehentaiFile = fileList;
              this.detialImageAspect = '20%';
            }else{
              this.nowIndex = 0;
              this.ehentaiFile = fileList;
              this.detialImageAspect = '45%';
              this.srcList = [];
              this.srcList.push(this.$hostURL + '/ehentai/' + this.htmlReplace(fileList[this.nowIndex].bookName) + "/" + this.htmlReplace(fileList[this.nowIndex].fileName));
              this.detialImageUrl = this.htmlReplace(fileList[this.nowIndex].bookName) + "/" + this.htmlReplace(fileList[this.nowIndex].fileName);
            }
            this.detialDialogVisible = true;
          }
        })
      },
      up(){
        let fileList = this.ehentaiFile;
        if(this.nowIndex == 0){
          this.$message({
            type: 'warning',
            message: '当前已是第一页了'
          });
        }else{
          this.bookLoading = true;
          this.nowIndex--;
          this.srcList = [];
          this.srcList.push(this.$hostURL + '/ehentai/' + this.htmlReplace(fileList[this.nowIndex].bookName) + "/" + this.htmlReplace(fileList[this.nowIndex].fileName));
          this.detialImageUrl = this.htmlReplace(fileList[this.nowIndex].bookName) + "/" + this.htmlReplace(fileList[this.nowIndex].fileName);
          setTimeout(() => {
            this.bookLoading = false;
          }, 700)
        }
      },
      down(){
        let fileList = this.ehentaiFile;
        if(this.nowIndex >= fileList.length - 1){
          this.$message({
            type: 'warning',
            message: '当前已是最后一页了'
          });
        }else{
          this.bookLoading = true;
          this.nowIndex++;
          this.srcList = [];
          this.srcList.push(this.$hostURL + '/ehentai/' + this.htmlReplace(fileList[this.nowIndex].bookName) + "/" + this.htmlReplace(fileList[this.nowIndex].fileName));
          this.detialImageUrl = this.htmlReplace(fileList[this.nowIndex].bookName) + "/" + this.htmlReplace(fileList[this.nowIndex].fileName);
          setTimeout(() => {
            this.bookLoading = false;
          }, 700)
        }
      },
      fileLoading(){
        updateEhentaiFileApi({}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.fullscreenLoading = false;
          }
        })
      },
      open(name, auth) {
        this.$alert('<strong>名称： </strong>' + name + '<br><hr><strong>作者： </strong>' + auth, '详细信息', {
          dangerouslyUseHTMLString: true
        });
      },
      htmlReplace(sHtml) {
        return encodeURIComponent(sHtml);;
      },
    },
    created(){
      this.eHentaiList();
    }
  }
</script>

<style scoped>

  .groupTime {
    margin: 0 auto;
  }

  .groupBox {
    text-align: center;
    padding: 10px;
  }

  .hentaiTitle {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
    padding: 10px 15px;
  }

  .time {
    font-size: 14px;
    font-family: "幼圆";
    font-weight: 600;
  }

  .clearfix {
    padding: 5px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bottom {
    display: inline-block;
    padding:0 5px 0 5px;
  }

  .textDiv {
    margin-top: 10px;
    text-align: center;
  }

</style>
