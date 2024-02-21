<template>
  <div style="min-width: 1800px;">
    <div class="topDiv">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">
          <img src="@/assets/static_images/wdnm.png" class="topImageDiv">
        </el-menu-item>
        <el-menu-item index="2" @click="talkVisible = true">功能介绍</el-menu-item>
        <el-menu-item index="3" @click="thylemVisible = true">使用引擎</el-menu-item>
        <el-menu-item index="4"><a href="/#/login">回到主站</a></el-menu-item>
        <el-menu-item index="5"><a href="/#/404">AI词库</a></el-menu-item>
        <el-menu-item index="6"><a href="/#/setu">爬虫图床</a></el-menu-item>
        <el-menu-item index="7"><a href="/#/fictionMain">小说站</a></el-menu-item>
        <el-menu-item index="8"><a href="/#/openApiDoc">接口文档工具</a></el-menu-item>
      </el-menu>
    </div>
    <div class="cententText">
      <h1>图像检索</h1>
    </div>
    <div class="importDiv">
      <div style="width: 40%;margin: 0 auto;">
        <el-input placeholder="请输入网络地址" v-model="httpImageUrl">
          <el-button slot="append" icon="el-icon-search" @click="apiPost(2 , httpImageUrl)"></el-button>
        </el-input>
      </div>
      <div style="text-align: center;">
        <h2>或可以选址上传本地图片搜索👇</h2>
      </div>
      <div style="width: 40%;margin: 0 auto;margin-top: 20px;">
        <div style="float: left;width: 20%;">
          <el-upload
            ref="upload"
            action="/blosBoot/open/tempFileUpLoadCode.act"
            list-type="picture-card"
            accept=".jpg, .jpeg, .png"
            :on-success="handleSuccess"
            :limit="1"
            :multiple="false"
            :auto-upload="false"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog
            :visible.sync="dialogVisible"
            width="500px"
          >
            <el-image
              style="height: 500px;width: auto;align-items: center;"
              :src="dialogImageUrl"
              fit="cover"
            ></el-image>
          </el-dialog>
        </div>
        <div style="float: right;width: 79%;">
          <el-button style="width: 100%;height: 148px;font-size: 50px;color: red;" @click="submitUpload" v-loading.fullscreen.lock="loading">让我康康!</el-button>
        </div>
      </div>
    </div>
    <div>
      <el-dialog
        v-if="imageDialogVisible"
        title="图片查询结果"
        :visible.sync="imageDialogVisible"
        width="40%"
        :close-on-click-modal="false"
        center>
        <div class="dialogLeft">
          <el-image
          style="height: 500px;width: auto;align-items: center;"
          :src="imgUrl"
          fit="cover"
        ></el-image>
        </div>
        <div class="dialogCenter"></div>
        <div class="dialogLeft">
          <div class="dialogLeftText">作者名称/ID：<span class="dialogLeftMsg"><a :href="authorUrl">{{author}}</a></span></div>
          <div class="dialogLeftText">作品名称：<span class="dialogLeftMsg"><a :href="picUrl">{{pic}}</a></span></div>
          <div class="dialogLeftText">图片相似度：<span class="dialogLeftMsg">{{likeImg}}</span></div>
          <div class="dialogLeftText">{{orderTime}}</div>
          <el-divider content-position="left"><span style="font-weight: 600;">图床收录</span></el-divider>
          <div class="dialogLeftText">{{blosImgUrl}}</div>
          <div class="dialogLeftText">{{blosPic}}</div>
          <div class="dialogLeftText">{{blosPicUrl}}</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="closeImageDialog">我知道了</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="使用引擎"
        :visible.sync="thylemVisible"
        width="30%"
      >
        <img src="@/assets/static_images/sauceNaoImage.png" width="99%"></img>
        <div>
          <h3>引擎地址:<a href="https://saucenao.com">https://saucenao.com</a></h3>
          <h3>API地址:<a href="https://saucenao.com/search.php">https://saucenao.com/search.php</a></h3>
        </div>
        <el-divider></el-divider>
        <strong style="color: brown;">非深度图片采用GCN网路层内聚化</strong>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="功能介绍"
        :visible.sync="talkVisible"
        width="30%"
      >
        <h1>这是什么？</h1>
        <h3>这是一个“简易”的搜图引擎，目的是找到该死的群友发的整天不带名字的图到底出自哪里</h3>
        <h1>要怎么用？</h1>
        <h3>你可以选址将图片保存下来后上传识别，或者输入网络上的URL进行识别，网络上的URL必须要带上HTTPS或者HTTP协议，否则可能会出现找不到的情况</h3>
        <h1>搜索范围？</h1>
        <h3>主要会在Pixiv上搜，有些找不到的图片可能是因为太新了未收录或者图床没办法识别到</h3>
        <el-divider></el-divider>
        <strong style="float: right;">小B崽子，知道了就按下面的那个知道了的按钮👇</strong>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="talkVisible = false">我知道了</el-button>
          </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>

  import { selectSaucenaoImgsApi } from '@/api/openApi/selectImage'

  export default {
    name: 'selectImage',
    data() {
      return {
        activeIndex: '1',
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        httpImageUrl: null,
        loading: false,

        imageDialogVisible: false,
        imgUrl: null,     //预览图
        author: null,     //作者
        authorUrl: null,  //作者URL
        pic: null,        //图片名称
        picUrl: null,     //图片地址
        likeImg: null,    //相似度
        orderTime: null,  //处理时间
        blosImgUrl: null, //图片地址
        blosPic: null,    //图片名称
        blosPicUrl: null, //名称地址

        thylemVisible: false,
        talkVisible: false,
      }
    },
    methods: {
      handleRemove(file) {
        let fileList = this.$refs.upload.uploadFiles;
        //let index = fileList.findIndex( fileItem => {return fileItem.uid === file.uid});
        fileList.splice(null, 1);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      submitUpload() {
        console.log(this.$refs.upload.uploadFiles.length)
        if(this.$refs.upload.uploadFiles.length == 0){
          this.$message.warning("请上传一张图片");
          return;
        }
        this.loading = true;
        this.$refs.upload.submit();
      },
      handleSuccess(response){
        if(response.code == 200){
          this.$notify({
            title: '文件上传通知',
            message: response.reslutMsg
          });
          this.apiPost(1, response.textMsg);
        }
      },
      apiPost(type , returnMsg){
        if(returnMsg == null || returnMsg == ''){
          this.$message.warning("图片URL为空");
          return
        }
        selectSaucenaoImgsApi({
          codeType: type,
          path: returnMsg,
        }).then((data) => {
          if(data.code == 200){
            let {imgUrl, author, authorUrl, pic, picUrl, likeImg, orderTime, blosImgUrl, blosPic, blosPicUrl} = data.data;
            this.imgUrl = imgUrl;
            this.author = author;
            this.authorUrl = authorUrl;
            this.pic = pic;
            this.picUrl = picUrl;
            this.likeImg = likeImg;
            this.orderTime = orderTime;
            this.blosImgUrl = blosImgUrl;
            this.blosPic = blosPic;
            this.blosPicUrl = blosPicUrl;
            this.imageDialogVisible = true;
            this.loading = false;
          }
        })
		this.handleRemove(null);
      },
      closeImageDialog(){
        this.imgUrl = null;
        this.author = null;
        this.authorUrl = null;
        this.pic = null;
        this.picUrl = null;
        this.likeImg = null;
        this.orderTime = null;
        this.imageDialogVisible = false;
      }
    }
  }

</script>

<style scoped>

  .topDiv {

  }

  .topImageDiv {
    width: 40px;
    height: 40px;
  }

  .el-menu-item.is-active {
    border: transparent !important;
  }

  .cententText {
    text-align: center;
    margin: 30px 0;
  }

  .importDiv {
    align-items: center;
  }

  .dialogLeft {
    display: inline-block;
    vertical-align: top;
    width: 45%;
  }

  .dialogCenter {
    display: inline-block;
    vertical-align: top;
    width: 5%;
  }

  .dialogLeftText {
    font-size: 20px;
    font-weight: 600;
    font-family: "幼圆";
    margin-bottom: 10px;
  }

  .dialogLeftMsg {
    color: black;
  }

</style>
