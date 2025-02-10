<template>
  <div>
    <!-- 顶部锚点-->
    <div
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(231, 231, 231, 0.2)"
      element-loading-text="拼命加载中"
    ></div>
    <div
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(231, 231, 231, 0.2)"
      element-loading-text="拼命加载中"
    ></div>

    <div class="textTop">
      <span class="text1">云相册</span>
      <el-divider direction="vertical"></el-divider>
      <span class="text2">Cloud Album</span>
    </div>
    <el-tabs tab-position="left" class="groupOrderTime">
      <el-tab-pane
        :label="item.sessionYear"
        :key="index"
        :name="item.sessionYear"
        v-for="(item,index) in findListGroupOrder"
      >
        <div style="font-weight: 600;font-size: 15px;" slot="label" @click="gotoImageGroup('none', item.sessionMonth)">{{item.sessionYear}}</div>
      </el-tab-pane>
    </el-tabs>
    <div class="groupTime">
      <el-row>
        <el-col :span="5" v-for="item in findListGroup" class="groupBox">
          <el-card :body-style="{ padding: '0px' }">
            <el-image
              :src="$hostURL + '/' + item.imageTemp + '/' + item.imageName + '.' + item.fileType" fit="cover" style="height: 300px;" lazy
              @click="openDetialImage($hostURL + '/' + item.imagePath + '/' + item.imageName + '.' + item.fileType)"
              :preview-src-list="srcList"
            ></el-image>
            <div style="padding:0 14px 14px 14px;">
                <div class="dramaTitle">
                  <span>{{item.imageName}}</span>
                </div>
              <div class="bottom clearfix">
                <span class="time">拍摄时间： {{ item.sessionYear + '年 ' + item.sessionMonth + '月' }}</span>
              </div>
              <div class="bottom clearfix">
                <span class="time">{{ item.sessionPiovince + ' ' + item.sessionRegion }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-dialog
        title="账号验证"
        :show-close="false"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="30%">
        <div style="padding-bottom: 15px;">
          <el-input placeholder="请输入账号" v-model="logname">
            <template slot="prepend">账号</template>
          </el-input>
        </div>
        <div style="padding-bottom: 15px;">
          <el-input placeholder="请输入密码" v-model="logpass">
            <template slot="prepend">密码</template>
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getUserInp">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 回滚顶部 -->
    <el-backtop></el-backtop>
  </div>
</template>

<script>

  import { selectUserApi, selectImageGroupTimeApi, selectImageGroupAlbumApi } from '@/api/openApi/openImageAlbum'

  export default {
    name: 'openImageAlbum',
    data () {
      return {
        /* 加载*/
        fullscreenLoading: false,
        userKey: null,
        findListGroup: [],
        findListGroupOrder: [],
        /* 加载*/
        fullscreenLoading: false,
        dialogVisible: false,

        logname: '',
        logpass: '',
        /* 分页*/
        total: 1,
        currentPage: 1,
        pageSize: 12,

        year: '',
        month: '',
        srcList: [],
      }
    },
    methods: {
      gotoImageGroup(type,time){
        this.year = time.split("-")[0];
        this.month = time.split("-")[1];
        this.total = 1;
        this.currentPage = 1;
        this.selectInfoImageGroup(type);
      },
      selectInfoImageGroup(type){
        if(type == 'add'){
          if(this.currentPage * 12 < this.total){
            this.currentPage = this.currentPage + 1;
          }else{
            return;
          }
        }
        selectImageGroupAlbumApi({
          sessionYear: this.year,
          sessionMonth: this.month,
          createId: this.userKey,
          nowTab: this.currentPage,
          hasTab: this.pageSize
        }).then((data) => {
          this.fullscreenLoading = false;
          this.total = data.total;
          if(type == 'add'){
            let itemList = this.findListGroup;
            this.findListGroup = itemList.concat(data.data);
          }else{
            this.findListGroup = data.data;
          }
        })
      },
      selectImageGroupTime(){
        selectImageGroupTimeApi({ids: this.userKey}).then((data) => {
          this.findListGroupOrder = data.data;
          if(this.findListGroupOrder.length > 0){
            let time = this.findListGroupOrder[0].sessionMonth;
            this.year = time.split("-")[0];
            this.month = time.split("-")[1];
            this.selectInfoImageGroup('none');
          }
        })
      },
      getUserInp(){
        this.fullscreenLoading = true;
        selectUserApi({logname: this.logname, logpass: this.logpass}).then((data) => {
          if(data.code != 200){
            localStorage.removeItem("httpImage");
            this.userKey = null;
            this.fullscreenLoading = false;
          }else{
            this.dialogVisible = false;
            localStorage.setItem("httpImage", data.data);
            this.userKey = data.data;
            this.selectImageGroupTime();
          }
        })
      },
      urlHanlden(){
        this.dialogVisible = true
      },
      //打开图片详细信息
      openDetialImage(url){
        this.srcList = [];
        this.srcList.push(url);
      },
    },
    created(){
      let key = localStorage.getItem("httpImage");
      if(key == null || key == ''){
        this.urlHanlden();
        return;
      }else{
        this.fullscreenLoading = true;
        let that = this;
        that.userKey = key;
        this.selectImageGroupTime();
        window.onscroll = function(){
          let scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
          let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
          let scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
          if(scrollTop + windowHeight == scrollHeight){
            console.log("翻页")
             that.selectInfoImageGroup('add');
          }
        }
      }

    }
  }
</script>

<style scoped>

  .topMenu {
    width: 100%;
    /* 设置固定定位 */
    position: fixed;
    top: 0;
    height: 70px;
    background-color: rgba(248, 248, 248, 0.98);
    /* 设置水平居中 */
    align-items: center;
    /* 该盒子位于最上层 不要被其它盒子覆盖 */
    z-index: 6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .52);
    display: flex;
    justify-content: center;
    transition:all 0.3s;
  }

  .textTop {
    margin-top: 35px;
    text-align: center;
  }

  .text1 {
    font-size: 24px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color: #484848;
  }

  .text2 {
    font-size: 20px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color: #888;
  }

  .groupOrderTime {
    margin: 35px 0 0 10%;
    align-items: center;
    float: left;
  }

  .groupTime {
    width: 81%;
    margin: 35px 0 0 20px;
    align-items: center;
    float: left;
  }

  .groupBox {
    text-align: center;
    padding: 10px 10px 10px 10px;
  }

  .dramaTitle {
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

</style>
