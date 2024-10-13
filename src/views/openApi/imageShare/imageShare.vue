<template>
  <div>
    <div
      class="topTag"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(231, 231, 231, 0.2)"
      element-loading-text="拼命加载中"
    ></div>
    <div>
      <el-menu default-active="2" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="0" disabled>
          <img src="@/assets/static_images/wdnm.png" class="topImageDiv">
        </el-menu-item>
        <el-menu-item index="1"><router-link to="/setu">爬虫图床</router-link></el-menu-item>
        <el-menu-item index="2"><router-link to="/fictionMain">小说站</router-link></el-menu-item>
        <el-menu-item index="3"><router-link to="/selectImage">图像处理</router-link></el-menu-item>
      </el-menu>
    </div>
    <el-empty v-if="imageList.length == 0" :image-size="200"></el-empty>
    <div style="margin: 10px 0 0 10px;" v-if="imageList.length > 0" v-for="(item , index) in imageList">
      <el-card class="imageBox" shadow="always">
        <el-image
          :src="$hostURL + '/imgItem/' + item.filePath + htmlReplace(item.fileName)"
          :preview-src-list="srcImage"
          @click="openImage($hostURL + '/img/' + item.filePath + htmlReplace(item.fileName))"
          lazy>
        </el-image>
        <div style="padding: 5px;">
          <h5>{{item.fileName}}</h5>
          <h6>『{{item.authorName}}』</h6>
          <time class="time">{{ item.updateDate }}</time>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>

  import { codeFileLook } from '@/api/openApi/imageShare'

  export default {
    name: 'imageShare',
    data() {
      return {
        imageList: [],
        srcImage: [],
        userKey: null,
        fullscreenLoading: false,
        system:{
          win: false,
          mac: false,
          xll: false,
          ipad:false
        }
      };
    },
    methods: {
      htmlReplace(sHtml) {
        return encodeURIComponent(sHtml);
      },
      //打开图片
      openImage(url){
        this.srcImage = [];
        this.srcImage.push(url)
      },
      codeFileLookApi(){
        this.fullscreenLoading = true;
        codeFileLook({
          ids: this.userKey
        }).then((data) => {
          if(data.code == 200){
            this.imageList = data.data;
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
    },
    created() {
      var p = navigator.platform;
      this.system.win = p.indexOf("Win") == 0;
      this.system.mac = p.indexOf("Mac") == 0;
      this.system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
      this.system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;
      if (this.system.win || this.system.mac || this.system.xll|| this.system.ipad) {
        this.$alert('建议在手机上获得最佳体验', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.urlHanlden();
            if(this.userKey == null || this.userKey == ''){
              this.$message({
                message: '链接格式错误，请联系管理员',
                type: 'warning'
              });
            }else{
              this.codeFileLookApi();
            }
          }
        });
      }else{
        this.urlHanlden();
        if(this.userKey == null || this.userKey == ''){
          this.$message({
            message: '链接格式错误，请联系管理员',
            type: 'warning'
          });
        }else{
          this.codeFileLookApi();
        }
      }
    }
  }

</script>

<style scoped>
  .time {
    font-size: 13px;
    color: #999;
  }

  .image {
    width: 100%;
    display: block;
  }

  .imageBox {
    width: 80%;
    height: 100%;
    text-align: center;
    margin: 0 auto;
  }

  .topImageDiv {
    width: 40px;
    height: 40px;
  }

</style>
