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
      </div>
    </div>
    <div class="textTop">
      <span class="text1">文章归档</span>
      <el-divider direction="vertical"></el-divider>
      <span class="text2">Archives</span>
    </div>
    <div class="groupTime">
      <el-timeline>
        <el-timeline-item
          v-for="(item , index) in findListGroup" :key="index"
          :timestamp="item.dicName" placement="top"
          color="#00a6ff"
        >
          <div @click="openBlos(item.key)">
            <el-card>
              <h4>{{item.dicValue}}</h4>
              <p>来自分类：{{item.value}}</p>
            </el-card>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
    <!-- 回滚顶部 -->
    <el-backtop></el-backtop>
  </div>
</template>

<script>

  import { getTimeGroupByApi } from '@/api/openApi/mineBlosMain'

  export default {
    name: 'mineBlosTimeGroup',
    data () {
      return {
        /* 加载*/
        fullscreenLoading: false,
        isTopMenu: true,
        userKey: null,
        findListGroup: [],
        /* 加载*/
        fullscreenLoading: false,
      }
    },
    methods: {
      getTimeGroupBy(){
        getTimeGroupByApi({psnId: this.userKey}).then((data) => {
          if(data.code == 200){
            this.findListGroup = data.data
          }
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 500);
        })
      },
      openBlos(value){
        const routeData = this.$router.resolve({
          path: '/mineBlosArticle',
          query: {
            blosIds: value,
            type: "view",
            modelId: this.cuurentNodeKey,
            readOnly: true,
            isFullScreen: true
          }
        })
        window.open(routeData.href, '_blank')
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
    },
    created(){
      this.fullscreenLoading = true;
      this.urlHanlden();
      this.getTimeGroupBy();
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
    color: #484848;
  }

  .text2 {
    font-size: 20px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color: #888;
  }

  .groupTime {
    margin: 0 auto;
    width: 40%;
    margin-top: 35px;
    align-items: center;
  }

</style>
