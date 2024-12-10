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
        <el-col :span="6" v-for="item in findListGroup" class="groupBox">
          <el-card :body-style="{ padding: '0px' }">
            <el-image :src="$hostURL + '/ehentai/' + htmlReplace(item.bookName) + item.bookImage" fit="cover" style="height: 300px;" lazy></el-image>
            <div style="padding:0 14px 14px 14px;">
                <div class="hentaiTitle">
                  <span @click="open(item.bookName)">{{item.bookName}}</span>
                </div>
              <div class="bottom clearfix">
                <span class="time">作者： {{ item.bookAuthor }}</span>
              </div>
              <div class="bottom clearfix">
                <span class="time">引入时间： {{ item.bookSaveTime }}</span>
              </div>
              <div class="bottom clearfix">
                <el-tag @click="editBook(item.ids)">编辑</el-tag>
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
      :page-sizes="[8, 16, 24]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 回滚顶部 -->
    <el-backtop></el-backtop>
  </div>
</template>

<script>
  import { selectEhentaiFileApi, updateEhentaiFileApi, editEhentaiFileApi } from '@/api/mineEhentaiConfig'

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
        pageSize: 8,
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
        this.pageSize = 8;
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
      fileLoading(){
        updateEhentaiFileApi({}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.fullscreenLoading = false;
          }
        })
      },
      open(name) {
        this.$alert(name, '详细名称');
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
    padding: 30px;
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
  }

</style>
