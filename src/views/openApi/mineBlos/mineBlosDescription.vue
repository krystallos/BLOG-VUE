<template>
  <div>
    <div v-if="userKey != null" class="topMenu" :class="isTopMenu === true ? 'disabledClass2' : 'disabledClass1'">
      <div>
        <a href="#/login" class="topcenter"><i class="el-icon-s-home"></i>加入我们</a>
        <a :href="'#/mineBlos?ids=' + userKey" class="topcenter"><i class="el-icon-s-management"></i>回到主站</a>
        <a :href="'#/mineBlosDescription?ids=' + userKey" class="topcenter"><i class="el-icon-s-custom"></i>关于网站</a>
        <a href="#/setu" class="topcenter"><i class="el-icon-s-marketing"></i>图床</a>
        <a href="#/fictionMain" class="topcenter"><i class="el-icon-s-management"></i>小说库</a>
        <a href="#/selectImage" class="topcenter"><i class="el-icon-video-camera-solid"></i>图形图像</a>
      </div>
    </div>
    <div class="topImageDiv">
      <!-- 图片-->
      <div class="topIamge">
        <!-- 文字 -->
        <div class="topDiv">
          <span class="topText">关于网站 / 技术栈</span>
        </div>
      </div>
    </div>
    <div class="divText">
      <strong class="titleText">
        『WDNMD-我带你们答』
      </strong>
      <div style="margin-top: 20px;">
        <img class="titleImage" src="../../../icons/favicon_io/android-chrome-192x192.png">
      </div>
    </div>
    <div class="qgDiv">
      <el-divider></el-divider>
      <span style="color: #ff0000;opacity: 0.7;">@2021 WDNMD</span>
      <span style="color: blue;opacity: 0.7;"> by Enokimushroom233</span>
    </div>
    <div class="blosMsgDiv">
    <el-timeline>
        <el-timeline-item>
          <span class="blosMsgSpan">2021.06 网站建立</span>
        </el-timeline-item>
        <el-timeline-item>
          <span class="blosMsgSpan">2021.08 网站投入使用，首篇文章生成</span>
        </el-timeline-item>
        <el-timeline-item>
          <span class="blosMsgSpan">2021.12 实现图床功能，预计以每年1至1.5万张进度持续爬取高质量艺术作品</span>
        </el-timeline-item>
        <el-timeline-item>
          <span class="blosMsgSpan">2022.04 完善网站功能，植入邮件、图片查询、小说等功能</span>
        </el-timeline-item>
        <el-timeline-item>
          <span class="blosMsgSpan">2022.10 首次对博客功能进行升级，引入图片深度学习功能</span>
        </el-timeline-item>
        <el-timeline-item>
          <span class="blosMsgSpan">2023.01 图床升级，支持除基本图片格式外的更多格式，支持异地备份同步和手动录入功能</span>
        </el-timeline-item>
        <el-timeline-item>
          <span class="blosMsgSpan">2023.06 网站整体升级，从原先的LayerUI升级为ElmUI，后端改为Spring分布式部署</span>
        </el-timeline-item>
        <el-timeline-item>
          <span class="blosMsgSpan">2023.09 添加个人账单、添加性能监控</span>
        </el-timeline-item>
        <el-timeline-item>
          <span class="blosMsgSpan">2024.01 网站第二次整体升级、SEO友好度提升至96/100</span>
        </el-timeline-item>
        <el-timeline-item>
          <span class="blosMsgSpan">新的一年，新的计划部署......</span>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div class="qgDiv1">
      <el-divider></el-divider>
      <span class="qgText1"># 图卷积网络依赖(GCNs)</span>
      <span class="qgMsg1">
        图卷积网络的本质就是提取图结构的空间特征，基于提取方式的不同可以分为：
        基于空间域的图网络（GraphSAGE，GAT，MPNN等）、
        基于谱域的图网络（Spectral CNN、ChebyNet、GCN等），项目目前采用的是GCN策略
        对爬取的图床图片进行归类分析处理。
      </span>
      <span class="qgText1"># 分布式平台</span>
      <span class="qgMsg1">
        采用阿里云与私有服务器混合搭建的策略，系统节点对等，当出现高压并发由转发中心进行决策权重分配，
        针对图床和博客文章采用单点SPoF。
      </span>
      <span class="qgText1"># 数据主从同步</span>
      <span class="qgMsg1">
        使用最基础的Oracle数据库主从信息同步，并对BinaryLog进行监控，保证数据同步周期内不会出现数据丢失的情况。
      </span>
      <span class="qgText1"># 自动化计划</span>
      <span class="qgMsg1">
        包含固定的守护线程和可配置的计划线程，支持最高7个计划同时进行，计划任务会针对服务器历史状态决策某个时间段执行任务，
        目前已有功能包含了图片爬虫，图像神经处理，服务器性能监控，数据库主从同步任务，内存回收计划。
      </span>
    </div>
    <div class="bottomDiv">
      <el-divider></el-divider>
      <span>
        该内容使用『
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans">知识共享署名 - 非商业性使用 - 相同方式共享 4.0 国际许可协议</a>
        』
      </span>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'mineBlosDescription',
    data() {
      return {
        userKey: null,
        isTopMenu: true,
      }
    },
    methods: {
      urlHanlden(){
        let geturl = window.location.href;
        let getqyinfo = geturl.split('?');
        if(getqyinfo.length < 2){
          this.userKey == null;
          return;
        }
        let getqys = new URLSearchParams(getqyinfo[1]);
        let userKey = getqys.get('ids');
        this.userKey = userKey;
      },
    },
    mounted(){
      this.urlHanlden();
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
    background-color: rgba(248, 248, 248, 0.85);
    /* 设置水平居中 */
    align-items: center;
    /* 该盒子位于最上层 不要被其它盒子覆盖 */
    z-index: 6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .52);
    display: flex;
    justify-content: center;
    transition:all 0.3s;
  }

  .disabledClass1 {
    transition: translateY(-100%);
    opacity: 0;
  }

  .disabledClass2 {
    transition: translateY(0);
    opacity: 1;
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

  .topcenter {
    font-size: inherit;
    text-rendering: auto;
    display: inline-block;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,serif;
    color: #666;
    font-size: 15px;
    font-weight: bold;
    margin-left: 60px;
  }

  .topcenter:hover {
    transition:all 0.5s;
    transform: scale(1.2);
  }

  .topImageDiv {
    height: 450px;
    position: relative;
    margin-bottom: 15px;
  }

  .topIamge {
    object-fit: cover;
    text-align: center;
    width: 100%;
    height: 100%;
    position: absolute;
    background-image: url('../../../assets/static_images/mineBlosTitImage.jpg');
  }

  .topDiv {
    width: 100%;
    position: absolute;
    bottom: 35%;
  }

  .divText {
    margin: 25px 0 20px 0;
    text-align: center;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .titleImage {
    border-radius: 50%;
    width: 150px;
    animation: rotate 7s infinite linear; /* 旋转动画持续时间为10秒，无限循环 */
  }

  .topText{
    font-size: 40px;
    font-weight: 400;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color: white;
    -webkit-text-stroke:0.3px #1d1d1d;
    text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.7);
  }

  .titleText{
    font-size: 34px;
    width: 100%;
    color: #404040;
    line-height: 150%;
    font-family: '华文行楷';
  }

  .qgDiv {
    margin: 0 auto;
    text-align: center;
    font-size: 15px;
    font-weight: bolder;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    width: 85%;
  }

  .qgDiv1 {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 85%;
  }

  .qgText1 {
    font-size: 15px;
    font-weight: bolder;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: #404040;
    padding: 15px 0 15px 15%;
  }

  .qgMsg1 {
    text-indent: 2em;
    font-size: 13px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: #8d8d8d;
    text-overflow: ellipsis;
    white-space: normal;
    overflow: hidden;
    max-width: 98%;
    line-height: 25px;
    padding: 0 0 0 18%;
  }

  .blosMsgDiv {
    margin-top: 45px;
    margin-left: 30%;
    display: flex;
    flex-direction: column;
  }

  .blosMsgSpan {
    color: #797979;
    line-height: 30px;
    font-size: 15px;
    padding: 0 10px 10px 0;
  }


  .bottomDiv {
    margin-top: 50px;
    margin-bottom: 30px;

    height: 100px;
    text-align: center;
    overflow: hidden;

    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,serif;
    font-size: 15px;
    font-weight: bold;
    color: #888;
  }

</style>
