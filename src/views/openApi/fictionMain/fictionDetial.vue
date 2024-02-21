<template>
  <div class="main">
    <div class="topBreadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/fictionMain' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="centernDiv">
      <div class="centernTopDiv">
        [EPUB]《{{chineseName}}》[共 {{bookSize}} 卷]
      </div>
      <div class="createDateDiv">
        Posted {{createDate}}
      </div>
      <div class="tagDiv">
        <el-tag v-for="tagItem in tagVo" style="margin: 3px;" size="medium">{{tagItem.dicName}}</el-tag>
      </div>
      <div class="dividerDiv">
        <el-divider content-position="left">小说简介</el-divider>
      </div>
      <div>
        <div class="imageDiv">
          <el-image
          style="width: 100%; height: auto"
          :src="$hostURL + illustrationUrl"
          fit="scale-down"></el-image>
        </div>
        <div class="jianjieDiv">
          <div class="textDiv">
            <span style="font-weight: 700;">中文：</span>{{chineseName}}
          </div>
          <div class="textDiv">
            <span style="font-weight: 700;">原名：</span>{{originName}}
          </div>
          <div class="textDiv">
            <span style="font-weight: 700;">英译：</span>{{englishName}}
          </div>
          <div class="textDiv">
            <span style="font-weight: 700;">作者：</span>{{authorName}}
          </div>
          <div class="textDiv">
            <span style="font-weight: 700;">插图：</span>{{illustrationAuth}}
          </div>
          <div class="textDiv">
            <span style="font-weight: 700;">出版：</span>{{pressName}}
          </div>
          <div class="textDiv">
            <span style="font-weight: 700;">文库：</span>{{libilName}}
          </div>
          <div class="textDiv">
            <span style="font-weight: 700;">初版：</span>{{chainBegin}} 至 {{chainEnd == null ? '未完结' : chainEnd}}
          </div>
          <div class="dividerDiv">
            <el-divider content-position="left">故事梗概</el-divider>
          </div>
          <div class="textDiv">
            {{storyMsg}}
          </div>
        </div>
      </div>
      <div class="bookDiv">
        <el-table
          :data="bookList"
          style="width: 100%">
            <el-table-column prop="fictionBookName" label="储存识别名称"></el-table-column>
            <el-table-column prop="fictionOriginName" label="书籍原名"></el-table-column>
            <el-table-column label="查看" width="100px">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-view" @click="openFiction(scope.row.ids)" circle></el-button>
              </template>
            </el-table-column>
            <el-table-column label="下载" width="100px">
              <template slot-scope="scope">
                <el-button type="info" icon="el-icon-folder-opened" @click="downloadFiction(scope.row.ids)" circle></el-button>
              </template>
            </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

  import { fictionDetialApi } from '@/api/openApi/fictionMain'

  export default {
    name: 'fictionDetial',
    data() {
      return {
        chineseName: '',
        createDate: '',
        originName: '',
        englishName: '',
        authorName: '',
        illustrationAuth: '',
        illustrationUrl: '',
        pressName: '',
        libilName: '',
        chainBegin: '',
        chainEnd: '',
        storyMsg: '',
        tagVo: [],
        bookSize: 0,
        bookList: [],
      }
    },
    methods: {
      //取URL
      urlHanlden(){
        let geturl = window.location.href;
        let getqyinfo = geturl.split('?');
        if(getqyinfo.length < 2){
          this.userKey == null;
          return;
        }
        let getqys = new URLSearchParams(getqyinfo[1]);
        let getqycode = getqys.get('ids');
        return getqycode;
      },
      fictionDetial(value){
        fictionDetialApi({ids: value}).then((data) => {
          if(data.code == 200){
            let detial = data.data.hasDetil;
            let {chineseName , createDate, originName, englishName, authorName, illustrationAuth,
                illustrationUrl, pressName, chainBegin, libilName, chainEnd, tagVo, storyMsg} = detial;
            let bookLen = data.data.book;
            this.chineseName = chineseName;
            this.createDate = createDate;
            this.originName = originName;
            this.englishName = englishName;
            this.authorName = authorName;
            this.illustrationAuth = illustrationAuth;
            this.illustrationUrl = illustrationUrl;
            this.pressName = pressName;
            this.libilName = libilName;
            this.chainBegin = chainBegin;
            this.chainEnd = chainEnd;
            this.tagVo = tagVo;
            this.storyMsg = storyMsg;
            this.bookSize = bookLen.length;
            this.bookList = bookLen;
          }
        })
      },
      openFiction(value){
        const routeData = this.$router.resolve({
          path: '/book',
          query: {
            ids: value,
            type: "view",
            modelId: this.cuurentNodeKey,
            readOnly: true,
            isFullScreen: true
          }
        })
        window.open(routeData.href, '_blank')
      },
      downloadFiction(value){
        this.$notify({
          title: '功能性提示',
          message: '目前小说下载暂未开放，后续功能完成另行通知',
          type: 'warning'
        });
      }
    },
    created() {
      this.fictionDetial(this.urlHanlden());
    }
  }

</script>

<style scoped>

  .main {
    /* background-color: #a9b8c3; */
  }

  .topBreadcrumb {
    width: 75%;
    margin: 30px auto;
  }

  .centernDiv {
    width: 75%;
    margin: 0 auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    overflow: hidden;
  }

  .centernTopDiv {
    padding: 15px 35px 15px 35px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 35px;
    font-weight: 600;
  }

  .createDateDiv {
    padding: 15px 35px 5px 35px;
    font-size: 15px;
    color: #3c5b68;
  }

  .tagDiv {
    padding: 5px 28px;
  }

  .dividerDiv {
    width: 98%;
    margin: 0 auto;
  }

  .imageDiv {
    float: right;
    width: 35%;
    margin: 0 20px 0 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .jianjieDiv {
    float: left;
    width: 60%;
    padding: 0 15px 0 15px;
  }

  @media screen and (max-width: 1100px) {
    .imageDiv {
      float: none;
      width: 95%;
    }
    .jianjieDiv {
      float: none;
      width: 95%;
    }
  }

  .textDiv {
    font-family: 'book antiqua', palatino, serif;
    color: #5c5c5c;
    padding: 10px 0;
  }

  .bookDiv {
    width: 95%;
    margin: 0 auto;
  }

</style>
