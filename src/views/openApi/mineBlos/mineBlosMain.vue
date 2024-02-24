<template>
  <div>
    <!-- 顶部锚点-->
    <div class="topMenu" :class="isTopMenu === true ? 'disabledClass2' : 'disabledClass1'">
      <div>
        <a href="#/login" class="topcenter"><i class="el-icon-s-home"></i>加入我们</a>
        <a :href="'#/mineBlosTimeGroup?ids=' + userKey" class="topcenter"><i class="el-icon-s-management"></i>文章归档</a>
        <a :href="'#/mineBlosDescription?ids=' + userKey" class="topcenter"><i class="el-icon-s-custom"></i>关于网站</a>
        <a href="#/setu" class="topcenter"><i class="el-icon-s-marketing"></i>图床</a>
        <a href="#/fictionMain" class="topcenter"><i class="el-icon-s-management"></i>小说库</a>
        <a href="#/selectImage" class="topcenter"><i class="el-icon-video-camera-solid"></i>图形图像</a>
      </div>
    </div>
    <div class="leftTopButton">
      <div class="svgTopButton">
        <div>
          <a @click="changeShow">
            <svg-icon style="width: 40px;height: 40px;color: white;" icon-class="mineBlosHome" />
          </a>
        </div>
        <div class="mr_sty" :class="[{'animationWidth1':isShow === 1},{'animationWidth2':isShow === 2},{'animationWidth3':isShow === 3},{'animationWidth4':isShow === 4}]">
          <div style="z-index: 5;font-size: 30px;text-align: center;padding-top: 5px;">
            <el-tooltip effect="dark" content="回到登入页" placement="right">
              <a href="#/login"><i class="el-icon-s-home"></i></a>
            </el-tooltip>
            <el-tooltip effect="dark" content="分享该博客站" placement="right">
              <a @click="leftButtomTom('linkShare')"><i class="el-icon-share"></i></a>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="topImg">
      <div class="topMsg">
        <h1>『{{userName}}』的个人博客</h1>
        <h2 style="padding-left: 5%;">{{nowDate}} 新年新气象</h2>
      </div>
    </div>
    <div class="middenMain">
      <div class="middenDiv">
        <!-- 版本更新 -->
        <div class="divCard">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{webVerList.verVersion}} 版本 - 更新于 {{webVerList.verCreate}}</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="lookVer">查看版本详情</el-button>
            </div>
            <div class="text item">
              {{webVerList.verName}}
            </div>
          </el-card>
        </div>
        <!-- 版本更新 -->
        <!-- 搜索标签 -->
        <div class="divTagCard">
          <el-tag
            style="margin-left: 10px;"
            v-for="(value, key) in tags"
            :key="key"
            closable
            @close="handleCloseTag(value)">
            {{value[1]}}
          </el-tag>
        </div>
        <!-- 搜索标签 -->
        <!-- 随笔 -->
        <div style="width: 97%;margin: 0 auto">
          <el-divider content-position="left">
            <i class="el-icon-s-management"></i>
            <span style="font-size: 20px;font-weight: bold;padding-left: 5px;">随笔</span>
          </el-divider>
        </div>
        <el-empty :image-size="120" v-if="findNoteList.length == 0" description="暂无随笔"></el-empty>
        <el-carousel
          v-if="findNoteList.length != 0"
          v-loading="notescreenLoading"
          arrow="never" :autoplay="false"
          indicator-position="none" :loop="true"
          height="350px" style="width: 98%;"
          ref="nop">
          <el-carousel-item class="blosCard" v-for="(item , index) in findNoteList" :key="index">
            <div class="imgCententNoteType">
              <img class="blosImage2" :src="item.centImg"/>
              <div @click="openArticle(item.ids)" class="cententNoteType">
                <p class="cententNoteTypeP"> {{item.clobTitle}} </p>
                <p class="cententNoteTypeG">归类于： <i class="el-icon-s-cooperation"></i> {{item.actType}}</p>
                <p class="cententNoteTypeG">撰写时间： <i class="el-icon-s-help"></i> {{item.createDate}}</p>
                <hr>
                <p class="cententNoteTypeT"> {{item.liteCont}} </p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="arrowToggle">
          <a class="prev" @click="prev"><i class="el-icon-caret-left"></i>上一篇</a>
          <span class="messageToggle">第 {{pageItem}} 篇 / 共 {{total2}} 篇</span>
          <a class="next" @click="next">下一篇<i class="el-icon-caret-right"></i></a>
        </div>
        <!-- 随笔 -->
        <div style="height: 35px;"></div>
        <!-- 博客 -->
        <div style="width: 97%;margin: 0 auto;">
          <el-divider content-position="left">
            <i class="el-icon-s-management"></i>
            <span style="font-size: 20px;font-weight: bold;padding-left: 5px;">文章</span>
          </el-divider>
        </div>
        <el-empty :image-size="120" v-if="findBlosList.length == 0" description="暂无文章"></el-empty>
        <div @click="openArticle(item.ids)" v-if="findBlosList.length != 0"
          class="blosCard" v-for="(item , index) in findBlosList"
          :key="index" v-loading="fullscreenLoading">
          <div class="imgCententBlosType">
            <img class="blosImage1" :src="item.centImg"/>
            <div class="cententBlosType">
              <p class="cententBlosTypeP"> {{item.clobTitle}} </p>
              <p class="cententBlosTypeG">归类于： <i class="el-icon-s-cooperation"></i> {{item.actType}}</p>
              <p class="cententBlosTypeG">撰写时间： <i class="el-icon-s-help"></i> {{item.createDate}}</p>
              <hr>
              <p class="cententBlosTypeT"> {{item.liteCont}} </p>
            </div>
          </div>
        </div>
        <!-- 博客 -->
        <div class="bottButton">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[4, 8, 12]"
            :page-size="pageSize"
            :pager-count="5"
            layout="prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <!-- 右侧标签 -->
      <div class="rightDiv">
        <el-input placeholder="请输入内容" v-model="clobTitle">
          <el-button @click="addRightTag('tag3', clobTitle, clobTitle.slice(0,3) + '...')" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <!-- <div class="topTextLog" :style="{height: tabDateBoo==true?'50px':'auto'}">
          <div class="topBackColor" @click="tabDate('tabDateBoo')">
            <span style="color: white;font-weight: 600;float: left;">归档</span>
            <i style="float: right;" class="el-icon-s-fold"></i>
          </div>
          <ul>
            <li class="lis" v-for="(item , index) in findRightGroupTime" :key="index">
              <a @click="addRightTag('tag1', item.dicValue, item.dicName)">{{item.dicName}}</a>
            </li>
          </ul>
        </div> -->
        <div class="topTextLog" :style="{height: tabTagBoo==true?'50px':'auto'}">
          <div class="ulClass">
            <div class="topBackColor" @click="tabDate('tabTagBoo')">
              <span style="color: white;font-weight: 600;float: left;">分类</span>
              <i style="float: right;" class="el-icon-s-fold"></i>
            </div>
            <ul>
              <li class="lis" v-for="(item , index) in findRightGroupTag" :key="index">
                <a @click="addRightTag('tag2', item.ids, item.actName)">{{item.actName}}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="topTextLog" :style="{height: tabMenuBoo==true?'50px':'auto'}">
          <div class="topBackColor" @click="tabDate('tabMenuBoo')">
            <span style="color: white;font-weight: 600;float: left;">更多功能</span>
            <i style="float: right;" class="el-icon-s-fold"></i>
          </div>
          <ul>
            <li class="lis" v-for="(item , index) in findRightGroupMenu" :key="index"><a :href="item.url">{{item.name}}</a></li>
          </ul>
        </div>
      </div>
      <!-- 右侧标签 -->
    </div>
    <div>
      <footer class="footer">
        <div class="none"></div>
        <!-- 回滚顶部 -->
        <el-backtop></el-backtop>
      </footer>
    </div>
    <div>
      <el-drawer
        :title="draTitle"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
        :destroy-on-close="true">
        <el-divider></el-divider>
        <div class="drawerDiv" v-html="draContcant"></div>
      </el-drawer>
    </div>
  </div>
</template>

<script>

  import {hisBlosMainApi, hisBlosMineTypeApi, hisNoteMineTypeApi } from '@/api/openApi/mineBlosMain'

  export default {
    name: 'mineBlos',
    data () {
      return {
        activeName: '',
        isShow: 1,
        isTopMenu: false,
        isOpen: true,
        userKey: null,
        userName: '',
        nowDate: new Date().getFullYear(),
        webVerList: {verVersion: '', verCreate: '', verName: ''},
        tags: new Map(),
        tagMap: new Map(),
        clobTitle: '',

        /* 抽屉*/
        draTitle: '',
        draContcant: '',
        drawer: false,
        direction: 'rtl',

        /* 分页*/
        total: 1,
        currentPage: 1,
        pageSize: 4,
        /* 分页2 */
        total2: 1,
        currentPage2: 1,
        pageSize2: 3,
        /* 走马灯默认tab */
        pageItem: 1,

        /* 单元格*/
        findBlosList: [],
        findNoteList: [],
        // findRightGroupTime: [],
        findRightGroupTag: [],
        findRightGroupMenu: [{
          name: '图床', url: '#/setu'
        },{
          name: 'AI词库', url: ''
        },{
          name: '小说站', url: '#/fictionMain'
        },{
          name: '图像处理', url: '#/selectImage'
        },{
          name: '回到主站', url: '#/login'
        }],

        /* 右侧下拉*/
        tabDateBoo: true,
        tabTagBoo: true,
        tabMenuBoo: false,

        /* 加载*/
        fullscreenLoading: false,
        notescreenLoading: false,
      }
    },
    methods: {
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.blosFindList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.blosFindList();
      },
      hisBlosMainInfo(){
        hisBlosMainApi({ids: this.userKey}).then((data) => {
          if(data.code == 200){
            let {person, sysVersionsList, groupTag} = data.data
            this.userName = person.psnName;
            this.webVerList = sysVersionsList != null? sysVersionsList: {"verName" : '近期暂无公告', "verCreate": 'N/A', 'verVersion': 'N/A'};
            // this.findRightGroupTime = groupTime;
            this.findRightGroupTag = groupTag;
          }
        })
      },
      blosFindList(){
        let tag1 = this.tagMap.get('tag1') != null ? this.tagMap.get('tag1'): 'All';
        let tag2 = this.tagMap.get('tag2') != null ? this.tagMap.get('tag2'): null;
        let tag3 = this.tagMap.get('tag3') != null ? this.tagMap.get('tag3'): null;

        this.fullscreenLoading = true;
        hisBlosMineTypeApi({
          psnId: this.userKey,
          createDate: tag1,
          actType: tag2,
          clobTitle: tag3,
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          onState: 1
        }).then((data) => {
          if(data.code == 200){
            this.findBlosList = [];
            this.findBlosList = data.data;
            this.total = data.total;
          }
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 500);
        })
      },
      suibiFindList(){
        let tag1 = this.tagMap.get('tag1') != null ? this.tagMap.get('tag1'): 'All';
        let tag2 = this.tagMap.get('tag2') != null ? this.tagMap.get('tag2'): null;
        let tag3 = this.tagMap.get('tag3') != null ? this.tagMap.get('tag3'): null;

        this.notescreenLoading = true;
        hisNoteMineTypeApi({
          psnId: this.userKey,
          createDate: tag1,
          actType: tag2,
          clobTitle: tag3,
          nowTab: this.currentPage2,
          hasTab: this.pageSize2,
          onState: 2
        }).then((data) => {
          if(data.code == 200){
            this.findNoteList = data.data;
            this.total2 = data.total;
            setTimeout(() => {
              this.notescreenLoading = false;
            }, 500);
          }
        })
      },
      prev () {
        let item = this.pageItem;
        if(item != 1){
          if(item == (this.currentPage2 - 1) * this.pageSize2 + 1){
            this.currentPage2 = this.currentPage2 - 1;
            this.suibiFindList();
          }else{
            this.$refs.nop.prev();
          }
          this.pageItem = item - 1;
        }else{
          this.$message('当前已经到头啦');
        }
      },
      next () {
        let item = this.pageItem;
        if(item > this.total2){
          this.$message('当前暂无文章');
          return;
        }
        if(item == this.total2){
          this.$message('当前已经到底，文章将从头开始加载');
          this.pageItem = 1;
          this.currentPage2 = 1;
          this.suibiFindList();
        }
        if(item == this.currentPage2 * this.pageSize2){
          this.currentPage2 = this.currentPage2 + 1;
          this.suibiFindList();
        }
        if(item != this.total2 && item != this.currentPage2 * this.pageSize2 + 1){
          this.pageItem = item + 1;
          this.$refs.nop.next();
          return;
        }
      },
      openHisMain(){
        this.$prompt('请输入用户推荐码', '访问拦截', {
          confirmButtonText: '确定'
        }).then(({ value }) => {
          this.userKey = value;
          this.hisBlosMainInfo();
          this.blosFindList();
          this.suibiFindList();
        });
      },
      lookVer(){
        this.direction = 'rtl'
        let tabVo = this.webVerList;
        this.draTitle = tabVo.verName;
        this.draContcant = tabVo.verType;
        this.drawer = true
      },
      handleClose(done) {
        done();
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
      tabDate(value){
        if(value == 'tabDateBoo'){
          if(this.tabDateBoo){
            this.tabDateBoo = false;
          }else{
            this.tabDateBoo = true;
          }
        }else if(value == 'tabTagBoo'){
          if(this.tabTagBoo){
            this.tabTagBoo = false;
          }else{
            this.tabTagBoo = true;
          }
        }else if(value == 'tabMenuBoo'){
          if(this.tabMenuBoo){
            this.tabMenuBoo = false;
          }else{
            this.tabMenuBoo = true;
          }
        }
      },
      changeShow() {
        //展开
        if (this.isOpen) {
          this.isOpen = false;
          this.isShow = 2
          setTimeout(() => {
            this.isShow = 3
          }, 1800)
        } else {
          //收起
          this.isOpen = true;
          this.isShow = 4
          setTimeout(() => {
            this.isShow = 1
          }, 1800)
        }
      },
      leftButtomTom(value){
        if(value == 'linkShare'){
          let url = window.location.href;
          let userName = this.userName;
          const save = function(e) {
            e.clipboardData.setData('text/plain', url + "  来自 -WDNMD博客站【"+ userName +"】的个人博客首页，分享于: [" + new Date() + "]")
            e.preventDefault() // 阻止默认行为
          }
          const once = {
            once: true
          }
          document.addEventListener('copy', save, once) // 添加一个copy事件,当触发时执行一次,执行完删除
          document.execCommand('copy') // 执行copy方法
          this.$message.success("复制当前页面地址到剪切板成功")
        }
      },
      addRightTag(value, value1, value2){
        this.pageItem = 1;
        this.tags.set(value, value2);
        this.tagMap.set(value, value1)
        this.blosFindList();
        this.suibiFindList();
      },
      handleCloseTag(tag) {
        this.tags.delete(tag[0]);
        this.tagMap.delete(tag[0]);
        //如果是搜索栏
        if(tag[0] == 'tag3'){
          this.clobTitle = ''
        }
        this.blosFindList();
        this.suibiFindList();
      },
      openArticle(value){
        const routeData = this.$router.resolve({
          path: '/mineBlosArticle',
          query: {
            blosIds: value,
            ids: this.userKey,
            type: "view",
            modelId: this.cuurentNodeKey,
            readOnly: true
          }
        })
        window.open(routeData.href, '_blank')
      }
    },
    mounted() {
      var that = this;
      //监听页面滚动
      window.addEventListener('scroll',function(){
        //获取页面滚动的距离(Y轴) 当距离大于500时执行动画并将导航栏设置为可见
        if(window.pageYOffset >= 500){
          that.isTopMenu = true;
        }else {
          //收起导航栏
          that.isTopMenu = false;
        }
      });
    },
    created(){
      this.urlHanlden();
      if(this.userKey == null || this.userKey == ''){
        this.openHisMain();
      }else{
        this.hisBlosMainInfo();
        this.blosFindList();
        this.suibiFindList();
      }
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
    font-size: 15px;
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

  .leftTopButton {
    position: absolute;
    width: 80px;
    height: 80px;
    z-index: 7;
  }

  .svgTopButton {
    width: 50px;
    height: 50px;
    z-index: 7;
    margin: 20px 0 0 20px;
  }

  .topImg {
    height: 100%;
    width: 100%;
    z-index: -1;
    position: relative;
    background: url('../../../assets/static_images/mineBlosImage.jpg') no-repeat center top;
    background-size:100%;
  }

  .topMsg {
    color: #f7f7f7;
    text-shadow: 1.5px 1.5px 1px #7c7c7c;
    height: 100%;
    padding-left: 25%;
    padding-top: 8%;
    padding-bottom: 16%;
    font-size: 18px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  .middenMain {
    overflow: auto;
    position: relative;
    z-index: 5;
    margin-top: -5%;
    width: 100%;
  }

  .middenDiv {
    float: left;
    background-color: #ffffff;
    width: 65%;
    height: auto;
    margin: 0 0 1% 10%;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }

  .bottButton {
    text-align: center;
    margin: 15px auto;
  }

  .divCard {
    padding: 15px;
  }

  .divTagCard {
    padding: 5px;
  }

  .blosCard {
    padding: 15px;
  }

  .drawerDiv {
    padding: 0 15px;
  }

  .footer {
    position:relative;
    top: 20vh;
  }

  .none {
    position:relative;
    top:0px;
    left: 0px;
  }

  .none::after {
    position:absolute;
    z-index: -1;
    content:"";
    bottom: 0;
    height: 250px;
    width: 100%;
    background: url('../../../assets/static_images/footer.png') no-repeat center;
  }

  .blosImage1 {
    object-fit: cover;
    text-align: center;
    width: 40%;
    height: 100%;
    float: left;
    padding: 5px;
  }

  .imgCententBlosType {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .22), 0 0 6px rgba(0, 0, 0, .14);
    z-index: 1;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.5s;
    overflow: hidden;
    height: 350px;
    background-color: #fafafa;
  }

  .imgCententBlosType:hover {
      transform: scale(1.08);
  }

  .imgCententNoteType {
    height: 350px;
    background-color: #fafafa;
  }

  .blosImage2 {
    object-fit: cover;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .cententNoteType {
    background-color: rgba(0, 0, 0, .65);
    width: 99%;
    height: 350px;
    padding: 15px;
    position: absolute;
    opacity: 0;
    transition: 0.3s;
    -webkit-transition: .5s;
    -moz-transition: .5s;
  }

  .cententNoteType:hover{
      opacity: 1;
  }

  .cententNoteTypeP {
      color: white;
      font-family: "幼圆";
      padding: 15px 1% 0px;
      font-size: 25px;
      font-weight: 700;
  }

  .cententNoteTypeT {
      color: white;
      font-family: "幼圆";
      padding: 0px 1% 5px;
      font-size: 15px;
      font-weight: 600;
  }

  .cententNoteTypeG {
      color: white;
      font-family: "幼圆";
      padding: 0px 1% 0;
      font-size: 14px;
      font-weight: 600;
  }

  .cententBlosType {
    float: left;
    z-index: 2;
    border-radius: 5px;
    width: 59%;
    height: 100%;
    padding: 15px;
  }

  .cententBlosTypeP {
      color: black;
      font-family: "幼圆";
      padding: 15px 1% 0px;
      font-size: 25px;
      font-weight: 700;
  }

  .cententBlosTypeT {
      color: black;
      font-family: "幼圆";
      padding: 0px 1% 5px;
      font-size: 15px;
      font-weight: 600;
  }

  .cententBlosTypeG {
      color: black;
      font-family: "幼圆";
      padding: 0px 1% 0;
      font-size: 14px;
      font-weight: 600;
  }

  .rightDiv {
    float: left;
    width: 15%;
    margin: 5% 0 0 5%;
    /* margin-right: 30px; */
  }

  .lis {
    line-height: 30px;
    width: 80%;
    border-bottom: 1px dashed #e1e1e1;
  }

  .topBackColor {
    background-color: #404a58;
    height: 50px;
    border-radius: 5px;
    padding: 15px 20px;
  }

  .topTextLog {
    margin-top: 30px;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    border-radius: 5px;
    background-color: #ffffff;
    width: 200px;
    height: auto;
    z-index:1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  @media screen and (max-width: 1020px) {
    .rightDiv {
      display: none;
    }

    .middenDiv {
      position: relative;
      float: left;
      width: 90%;
    }

  }

  @media screen and (max-width: 640px) {
    .topMsg {
      font-size: 10px;
    }

  }

  .mr_sty {
    overflow: hidden;
    filter: invert(100%);
  }
  .animationWidth1 {
    width: 0;
    height:0;
    background: white;
  }
  .animationWidth2{
    width: 80%;
    height:100px;
    background: white;
    position:relative;
    animation:animationWidth2 2s infinite;
    animation-iteration-count: 1;
  }
  @keyframes animationWidth2 {
    0%   {height:0}
    100% {height:100px}
  }
  .animationWidth3{
    width: 80%;
    height:100px;
    background: white;
  }
  .animationWidth4{
    width: 80%;
    height:100px;
    background: white;/* transparent */
    position:relative;
    animation:animationWidth4 2s infinite;
    animation-iteration-count: 1;
  }
  @keyframes animationWidth4 {
    0%   {height:100px}
    100% {height:0}
  }

  .arrowToggle {
    font-family: 幼圆;
    font-weight: bold;
    margin: 25px;
    .prev {
      width: 95px;
      height: 25px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .4);
      border-radius: 5px;
      float: left;
      background-size: cover;
    }
    .messageToggle{
      margin-left: 37%;
    }
    .next {
      width: 95px;
      height: 25px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .4);
      border-radius: 5px;
      float: right;
      background-size: cover;
    }
  }

</style>
