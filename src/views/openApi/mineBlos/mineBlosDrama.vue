<template>
  <div>
    <!-- 顶部锚点-->
    <div
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(231, 231, 231, 0.2)"
      element-loading-text="拼命加载中"
    ></div>
    <div
      class="topTag"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(231, 231, 231, 0.2)"
      element-loading-text="拼命加载中"
    ></div>
    <div class="topMenu" :class="isTopMenu === true ? 'disabledClass2' : 'disabledClass1'">
      <div>
        <a href="#/login" class="topcenter"><i class="el-icon-s-home"></i>加入我们</a>
        <a :href="'#/mineBlos?ids=' + userKey" class="topcenter"><i class="el-icon-s-management"></i>回到主站</a>
        <a :href="'#/mineBlosDescription?ids=' + userKey" class="topcenter"><i class="el-icon-s-custom"></i>关于网站</a>
        <a href="#/setu" class="topcenter"><i class="el-icon-s-marketing"></i>图床</a>
        <a href="#/fictionMain" class="topcenter"><i class="el-icon-s-management"></i>小说库</a>
        <a href="#/selectImage" class="topcenter"><i class="el-icon-camera-solid"></i>图形图像</a>
      </div>
    </div>
    <div class="textTop">
      <span class="text1">我的追番计划</span>
      <el-divider direction="vertical"></el-divider>
      <span class="text2">Drama Project</span>
    </div>
    <div class="groupTime">
      <el-row>
        <el-col :span="6" v-for="item in findListGroup" class="groupBox">
          <el-card :body-style="{ padding: '0px' }">
            <el-image :src="htmlReplace($hostURL + item.dramaPath + item.dramaImage)" fit="cover" style="height: 300px;" lazy></el-image>
            <div style="padding:0 14px 14px 14px;">
                <div class="dramaTitle">
                  <span>{{item.dramaName}}</span>
                </div>
              <div class="bottom clearfix">
                <el-badge :value="item.unPlay + '未观看'" class="item">
                  <span class="time">追番时间： {{ item.createDate }}</span>
                </el-badge>
              </div>
              <div class="bottom clearfix">
                <i class="el-icon-s-help"></i><a @click="leftButtomTom(item.rss)" class="time">RSS订阅链接</a>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div style="height: 30px;"></div>
    <!-- 回滚顶部 -->
    <el-backtop></el-backtop>
  </div>
</template>

<script>
  import { dramaListApi } from '@/api/openApi/mineBlosDrama'

  export default {
    name: 'mineBlosDrama',
    data () {
      return {
        /* 加载*/
        fullscreenLoading: false,
        isTopMenu: true,
        userKey: null,
        findListGroup: [],
        /* 加载*/
        fullscreenLoading: false,
        /* 分页*/
        total: 1,
        currentPage: 1,
        pageSize: 20,
      }
    },
    methods: {
      dramaList(type){
        if(type == 'add'){
          if(this.currentPage * 20 < this.total){
            this.currentPage = this.currentPage + 1;
          }else{
            return;
          }
        }
        dramaListApi({createId: this.userKey, nowTab: this.currentPage, hasTab: this.pageSize,}).then((data) => {
          if(data.code == 200){
            if(type == 'add'){
              let itemList = this.findListGroup;
              this.findListGroup = itemList.concat(data.data);
            }else{
              this.findListGroup = data.data;
            }
            this.total = data.total;
          }
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 500);
        })
      },
      urlHanlden(){
        let geturl = window.location.href;
        let getqyinfo = geturl.split('?');
        if(getqyinfo.length < 2){
          this.userKey == null;
          return;
        }
        let getqys = new URLSearchParams(getqyinfo[1]);
        let getqycode = getqys.get('ids');
        this.userKey = getqycode;
      },
      leftButtomTom(value){
        const save = function(e) {
          e.clipboardData.setData('text/plain', value)
          e.preventDefault() // 阻止默认行为
        }
        const once = {
          once: true
        }
        document.addEventListener('copy', save, once) // 添加一个copy事件,当触发时执行一次,执行完删除
        document.execCommand('copy') // 执行copy方法
        this.$message.success("复制当前订阅地址到剪切板成功")
      },
      htmlReplace(sHtml) {
        return sHtml;
      },
    },
    created(){
      let that = this;
      window.onscroll = function(){
        let scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
        let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        let scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;

        if(scrollTop + windowHeight == scrollHeight){
           that.dramaList('add');
        }
      }

      that.fullscreenLoading = true;
      that.urlHanlden();
      that.dramaList('none');
    }
  }
</script>

<style scoped>

  .topcenter {
    font-size: inherit;
    text-rendering: auto;
    display: inline-block;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,serif;
    color: #666;
    font-size: 17px;
    font-weight: bold;
    margin-left: 60px;
  }

  .topcenter:hover {
    transition:all 0.5s;
    transform: scale(1.2);
  }

  .disabledClass1 {
    transition: translateY(-100%);
    opacity: 0;
  }

  .disabledClass2 {
    transition: translateY(0);
    opacity: 1;
  }

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
    margin-top: 95px;
    text-align: center;
  }

  .text1 {
    font-size: 24px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color: #616161;
  }

  .text2 {
    font-size: 20px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color: #888;
  }

  .groupTime {
    margin: 0 auto;
    width: 70%;
    margin-top: 35px;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .42);
  }

  .groupBox {
    text-align: center;
    padding: 30px;
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

  .clearfix {
    padding: 5px 0;
  }

</style>
