<template>
  <div v-loading="loading">

    <div v-show="showLook" style="background: rgba(243, 243, 243, 0.95);width: 100%;height: 100%;position: fixed;z-index: 200;left: 0;right: 0;" >
      <div style="text-align: center;margin-top: 10%;">
        <i class="el-icon-warning" style="font-size: 150px;"></i>
        <h2>此页面不宜在公众场合查看，并将会<span style="color: red;">监控您的网络地址</span>，
        如接受协议可点击[<span style="color: red;">我知道了</span>]继续浏览</h2>
        <el-button @click="showLook = false" type="warning">我知道了</el-button>
      </div>
    </div>

    <div class="topMenuDiv">
      <el-menu default-active="2" mode="horizontal">
        <el-menu-item index="1">
          <img src="@/assets/static_images/wdnm.png" class="topImageDiv">
        </el-menu-item>
        <el-menu-item index="2"><router-link to="/login">回到主站</router-link></el-menu-item>
        <el-menu-item index="3"><router-link to="/404">AI词库</router-link></el-menu-item>
        <el-menu-item index="4"><router-link to="/selectImage">识图工具</router-link></el-menu-item>
        <el-menu-item index="5"><router-link to="/fictionMain">小说站</router-link></el-menu-item>
        <el-menu-item index="6"><router-link to="/openApiDoc">接口文档工具</router-link></el-menu-item>
      </el-menu>
    </div>
    <div class="topDiv">
      <el-switch
        v-model="isOpen"
        @change="look"
        active-text="非公开"
        inactive-text="公开">
      </el-switch>
    </div>
    <div v-if="selectTag != null || authorId != null" style="margin: 15px auto;">
      <div style="font-size: 15px;font-weight: 600;width: 100%;text-align: center;">
        当前搜索条件：
        <el-tag style="margin: 0px 5px;" v-if="selectTag != null" type="success" @close="handleCloseTag('tag')" closable>{{selectTag}}</el-tag>
        <el-tag style="margin: 0px 5px;" v-if="authorId != null" type="success" @close="handleCloseTag('uid')" closable>{{authorName}}</el-tag>
      </div>
    </div>
    <div>
      <table class="divImageDiv">
        <div class="imageDiv" v-for="(item, index) in srcList">
          <el-image
            style="width: 320px; height: 300px; padding: 15px;"
            :src="$hostURL + item.thumbnail"
            @click="openImage($hostURL + item.pathName)"
            :preview-src-list="srcImage"
            lazy
          >
          </el-image>
          <div class="textMsgCs">
            <el-popover trigger="hover" placement="top">
              <strong>{{item.fileName}}</strong>
              <div slot="reference" class="name-wrapper">
                {{ item.fileName }}
              </div>
            </el-popover>
          </div>
          <div class="tabDiv">
            <strong>
              近期有<el-tag>{{item.countImg}}</el-tag>人评分，平均推荐度为
              <el-tag type="success">{{item.avgScore}}</el-tag>
            </strong>
          </div>
          <div style="text-align: center;overflow: hidden;">
            <div style="float: left;padding-left: 15%;">
              图片评分:
              <el-rate
                v-model="gakSock[index].gakItem"
                :disabled="gakSock[index].disItem"
                :colors="colors"
                @change="pingfen(index,gakSock[index].gakItem)"
                >
              </el-rate>
            </div>
            <div style="float: right;padding-right: 15px;">
              <el-button size="small" type="info" plain  @click="addUidSelect(item.authorId, item.authorName)">更多该作者图片</el-button>
            </div>
          </div>
          <div class="tagDiv">
            <el-tag v-for="(item1, index) in item.tagNameList" style="margin: 5px;" size="medium" @click="addTagSelect(item1)">{{item1}}</el-tag>
            <!-- <el-button class="tagBut" icon="el-icon-edit" @click="addTag(item.ids)" plain>添加标签</el-button> -->
          </div>
        </div>
      </table>
    </div>
    <div class="bottomDiv">
      <el-divider></el-divider>
      <el-button :disabled="loading" type="primary" @click="again">再来一批<i class="el-icon-present el-icon--right"></i></el-button>
    </div>
    <el-dialog
      title="添加新的标签"
      :visible.sync="dialogVisible"
      width="50vh"
      center>
      <div>
        <el-input v-model="tagName" placeholder="请输入标签" maxlength="10"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTag">取 消</el-button>
        <el-button type="primary" @click="saveTag">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fileRandomApi, scoreImageApi, saveImageTagApi } from '@/api/openApi/imageRandom'

  export default {
    name: 'setu',
    data () {
      return {
        selectTag: null,
        authorId: null,
        authorName: null,

        isOpen: false,
        srcList: [],
        srcImage: [],
        gakSock: [],
        gakDis: [],
        colors: ['#99A9BF', '#F7BA2A', '#0099ff'],
        loading: false,

        ids: '',
        dialogVisible: false,
        tagName: '',
        showLook: true
      }
    },
    methods: {
      fileRandomPage(){
        this.loading = true;
        let value = 1
        if(this.isOpen){
          value = 0
        }
        fileRandomApi({type: value, authorId: this.authorId, tagName: this.selectTag}).then((data) => {
          this.gakSock = [];
          let gakSize = [];
          this.srcList = data.data;
          for(let a=0;a<this.srcList.length;a++){
            gakSize.push({
              gakItem: 0,
              disItem: false,
            })
          }
          this.gakSock = gakSize;
          setTimeout(() => {
             this.loading = false;
          }, 1000)
        })
      },
      openImage(url){
        this.srcImage = [];
        this.srcImage.push(url)
      },
      look(){
        this.authorId = null;
        if(this.isOpen == true){
          this.$notify({
            title: '警告',
            message: '已将图片推荐改为R18',
            type: 'warning'
          });
        }
        this.fileRandomPage();
      },
      again(){
        this.fileRandomPage();
      },
      pingfen(index,value){
        scoreImageApi({imgId: this.srcList[index].ids, score : value}).then((data) => {
          if(data.code == 200){
            this.gakSock[index].disItem = true
            this.$message.success(data.textMsg);
          }
        })
      },
      closeTag(){
        this.ids = null;
        this.tagName = null;
        this.dialogVisible = false;
      },
      saveTag(){
        saveImageTagApi({ids: this.ids, tagName: this.tagName}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.dialogVisible = false;
            this.ids = null;
            this.tagName = null;
          }
        })
      },
      addTag(value){
        this.ids = value;
        this.dialogVisible = true;
      },
      addTagSelect(value){
        this.selectTag = value;
        this.fileRandomPage();
      },
      addUidSelect(value, name){
        this.authorId = value;
        this.authorName = name;
        this.fileRandomPage();
      },
      handleCloseTag(value){
        if('tag' == value){
          this.selectTag = null;
        }else if('uid' == value){
          this.authorId = null;
        }
        this.fileRandomPage();
      }
    },
    created() {
      this.fileRandomPage();
    }
  }

</script>

<style scoped>

  .topImageDiv {
    width: 40px;
    height: 40px;
  }

  .el-menu-item.is-active {
    border: transparent !important;
  }

  .tagDiv {
    padding: 10px;
    width: 320px;
  }

  .tagBut {
    width: 100%;
    padding: 5px;
  }

  .topDiv {
    margin: 0 auto;
    padding: 20px;
    height: 30px;
    width: 200px;
  }

  .divImageDiv {
    margin: 0 auto;
  }

  .imageDiv {
    float: left;
    margin: 10px 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .bottomDiv {
    text-align: center;
    margin-bottom: 20px;
  }

  .textMsgCs {
    width: 290px;
    padding: 5px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tabDiv {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 0 10px;
  }

</style>
