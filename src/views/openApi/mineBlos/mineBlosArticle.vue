<template>
  <div>
    <div class="topMenu" :class="isTopMenu === true ? 'disabledClass2' : 'disabledClass1'">
      <div>
        <a href="#/login" class="topcenter"><i class="el-icon-s-home"></i>加入我们</a>
        <a :href="'#/mineBlos?ids=' + userKey" class="topcenter"><i class="el-icon-s-management"></i>回到主站</a>
        <a :href="'#/mineBlosDrama?ids=' + userKey" class="topcenter"><i class="el-icon-video-camera-solid"></i>我的追番</a>
        <a :href="'#/mineBlosDescription?ids=' + userKey" class="topcenter"><i class="el-icon-s-custom"></i>关于网站</a>
        <a href="#/setu" class="topcenter"><i class="el-icon-s-marketing"></i>图床</a>
        <a href="#/fictionMain" class="topcenter"><i class="el-icon-s-management"></i>小说库</a>
        <a href="#/selectImage" class="topcenter"><i class="el-icon-camera-solid"></i>图形图像</a>
      </div>
    </div>
    <!-- <div class="bacImage"></div> -->
    <div class="topImageDiv">
      <!-- 图片-->
      <img class="topIamge" :src="imageUrl" />
      <!-- 文字 -->
      <div class="topDiv">
        <div class="topMsg">
          <span>【{{psnBlosName}}】的文章</span>
        </div>
        <div class="titleMsg">
          <span>《{{blosTitle}}》</span>
        </div>
        <div style="height: 55px;">
          <div class="timeMsg">
            <span>撰写于：{{blosTime}}</span>
            <div style="height: 10px;"></div>
            <span>博客分类：{{actType}}</span>
          </div>
          <div class="iconDiv">
            <a @click="leftButtomTom('linkShare')"><i class="el-icon-share">点击分享页面</i></a>
          </div>
        </div>
      </div>
    </div>
    <div class="cententDiv">
      <!-- 富文本内容 -->
      <div>
        <div style="border: 0px solid #ccc;">
            <Editor
                style="height: auto; overflow-y: hidden;"
                v-model="html"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
            />
        </div>
      </div>
      <!-- 富文本内容 -->
    </div>
    <!-- 结尾 -->
    <div class="bottomDiv">
      <span>
        该文章使用『
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans">知识共享署名 - 非商业性使用 - 相同方式共享 4.0 国际许可协议</a>
        』
      </span>
    </div>
    <!-- 回滚顶部 -->
    <el-backtop></el-backtop>
  </div>
</template>

<script scoped>
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { hisBlosApi, hisBlosTypeApi } from '@/api/openApi/mineBlosMain'

  export default {
    name: 'mineBlosArticle',
    components: { Editor, Toolbar },
    data() {
      return {
        psnBlosName: null,
        userKey: null,
        blosTitle: '',
        blosTime: '',
        actType: '',
        imageUrl: '',
        /* 富文本*/
        editor: null,
        html: '',
        toolbarConfig: {
          excludeKeys : [
            "group-video",
            "insertTable",
            "todo",
            "emotion",
            "bgColor",
            "lineHeight",
            "group-image"
          ]
        },
        editorConfig: {
          placeholder: '找不到编辑的文本...',
        },
        mode: 'default',
        /* 富文本*/
        isTopMenu: false,
      }
    },
    methods: {
      onCreated(editor) {
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        editor.disable();
      },
      urlHanlden(){
        let geturl = window.location.href;
        let getqyinfo = geturl.split('?');
        if(getqyinfo.length < 2){
          this.userKey == null;
          return;
        }
        let getqys = new URLSearchParams(getqyinfo[1]);
        let getqycode = getqys.get('blosIds');
        let userKey = getqys.get('ids');
        this.userKey = userKey;
        return getqycode;
      },
      hisBlosApiTab(value){
        hisBlosApi({ids: value}).then((data) => {
          if(data.code == 200){
            let {content , clobTitle, psnName, createDate, actType, centImg} = data.data
            this.psnBlosName = psnName;
            this.blosTitle = clobTitle;
            this.blosTime = createDate;
            this.actType = actType;
            this.imageUrl = centImg;
            this.html = content;
          }
        })
      },
      hisBlosTypeTab(){
        hisBlosTypeApi({}).then((data) => {
          if(data.code == 200){

          }
        })
      },
      leftButtomTom(value){
        if(value == 'linkShare'){
          let url = window.location.href;
          let userName = this.psnBlosName;
          let title = this.blosTitle;
          const save = function(e) {
            e.clipboardData.setData('text/plain', url + "  来自 -WDNMD博客站【"+ userName +"】的文章《" + title + "》，分享于: [" + new Date() + "]")
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
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    },
    mounted(){
      let blosId = this.urlHanlden();
      if(blosId != null){
        this.hisBlosApiTab(blosId);
      }else{
        this.$message.error("无法获取当前文章ID")
      }

      var that = this;
      //监听页面滚动
      window.addEventListener('scroll',function(){
        //获取页面滚动的距离(Y轴) 当距离大于500时执行动画并将导航栏设置为可见
        if(window.pageYOffset >= 450){
          that.isTopMenu = true;
        }else {
          //收起导航栏
          that.isTopMenu = false;
        }
      });
    }
  }

</script>

<style src="@wangeditor/editor/dist/css/style.css">
</style>
<style scoped>
  /* .bacImage {
    position: fixed;
    z-index: -1;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: url('../../../assets/static_images/mineBlosTitImage.jpg');
  } */

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
  }

  .topDiv {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }

  .iconDiv {
    float: right;
    margin: 5px 15px;
    padding-right: 16%;
    font-size: 15px;
    color: white;
    -webkit-text-stroke:0.3px #1d1d1d;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
  }

  .topMsg {
    padding-top: 50px;
    padding-left: 17%;
    font-size: 25px;
    font-weight: 400;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color: white;
    -webkit-text-stroke:0.3px #1d1d1d;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
  }

  .titleMsg {
    text-align: center;
    padding-top: 40px;
    padding-bottom: 30px;
    font-size: 30px;
    font-weight: 600;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color: white;
    -webkit-text-stroke:0.3px #1d1d1d;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
  }

  .timeMsg {
    padding-left: 17%;
    float: left;
    width: 48%;
    margin: 0 auto;
    padding-bottom: 10px;
    font-size: 15px;
    font-weight: 400;
    font-family: "幼圆";
    color: white;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
  }

  .cententDiv {
    margin: 0 auto;
    width: 65%;
    border-radius: 10px;
    background-color: white;
    filter:alpha(Opacity=96);-moz-opacity:0.96;opacity: 0.96;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .bottomDiv {
    height: 100px;
    text-align: center;
    margin-top: 30px;
    overflow: hidden;

    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,serif;
    font-weight: bold;
    color: #888;
  }

  .leftDiv {
    float: left;
    height: 200px;
    width: 300px;
    margin: 15px 15px 15px 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .rightDiv {
    float: right;
    height: 200px;
    width: 300px;
    margin: 15px 15px 15px 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  * {
    margin: 0;
    padding: 0;
  }

  .zz ::before {
    content: "";
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .bili-banner {
      margin: 0 auto;
      position: relative;
      z-index: 0;
      min-height: 155px;
      height: 9.375vw;
      min-width: 999px;
      background-color: white;
      display: flex;
      justify-content: center;
      background-repeat: no-repeat;
      background-position: center 0;
      background-size: cover;
  }

  .animateds-banner {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: hidden;
  }

  .animateds-banner > .layer {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
  }

</style>
