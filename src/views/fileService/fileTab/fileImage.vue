<template>
  <div v-loading.fullscreen.lock="imgLoading">
    <div class="topClass">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="pathName" placeholder="文件路径"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="authorName" placeholder="作者"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="fileName" placeholder="文件名称"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="tagName" placeholder="图片标签"></el-input>
        </el-col>
        <el-col :span="2">
          <el-select v-model="select" style="width: 100%;" placeholder="公开/非公开资源">
            <el-option label="" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="sendNach">搜索</el-button>
        </el-col>
        <el-col :span="3">
          <el-switch
            style="display: block;height: 40px;display: table-cell;background-color: aliceblue;border-radius: 5px;padding: 5px;"
            v-model="openHiddenButton"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-text="增强功能">
          </el-switch>
        </el-col>
      </el-row>
    </div>
    <transition name="el-fade-in-linear">
      <div class="topClass" v-if="openHiddenButton">
        <el-row :gutter="20">
          <el-col :span="2">
            <el-button type="warning" @click="openReadyImage">同步文件</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="warning" @click="openReadyTag">同步标签</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="openWorkImage" plain>外置录入</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="openUploadImage">上传图片</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="info" @click="isChange(1)" plain>分享图片</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" @click="isChange(2)" plain>删除图片</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <div class="imgClass">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="fileImageTab"
        style="width: 100%"
        ref="multipleTable">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="pathName" label="文件路径" width="200px"></el-table-column>
        <el-table-column label="作者" show-overflow-tooltip width="200px">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              {{ scope.row.authorName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名称" width="400px"></el-table-column>
        <el-table-column prop="tagNameList" label="图片标签" width="250px">
          <template slot-scope="scope">
            <el-tag style="margin: 2px;" v-for="item in scope.row.tagNameList" @click="addTagSelect(item)">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fileType" label="类型" width="50px"></el-table-column>
        <el-table-column prop="imageUrl" label="轮播图片" width="100px">
          <template slot-scope="scope">
            <!-- <el-image
              style="width: 60px; height: 60px"
              :src="$hostURL + scope.row.thumbnail + htmlReplace(scope.row.fileName)"
              :preview-src-list="srcImage"
              @click="openImage($hostURL + scope.row.lonPathNameType + htmlReplace(scope.row.fileName))"
              lazy>
            </el-image> -->
            <el-image
              style="width: 60px; height: 60px"
              :src="$hostURL + scope.row.thumbnail + htmlReplace(scope.row.fileName)"
              @click="openDetialImage(scope.row.ids ,$hostURL + scope.row.lonPathNameType + htmlReplace(scope.row.fileName))"
              lazy>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="psnName" label="用户" width="70px"></el-table-column>
        <el-table-column prop="createDate" label="建立时间" width="170px"></el-table-column>
        <el-table-column prop="isHas" label="是否公开" width="100px"></el-table-column>
      </el-table>
      <div style="padding-top: 10px;"></div>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <div>
      <!-- 外置录入 -->
      <el-dialog
        v-if="sendDialog"
        title="外置录入"
        :visible.sync="sendDialog"
        width="30%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
        <div style="margin: 0 15px 0 15px;">
          <insertFileWorkImage :sendDialog.sync="sendDialog" />
        </div>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
      <!-- 同步资源文件 -->
      <el-dialog
        title="资源操作警告"
        :visible.sync="readyDialogVisible"
        width="30%"
        center>
        <div style="width: 100%;text-align:center;">
          <el-tooltip class="item" effect="dark" content="对你的所有文件进行还原同步" placement="bottom">
            <el-button type="danger" style="margin-right: 50px;" @click="readyImg(0)">彻底删除同步</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="根据文件路径设置中的参与同步配置还原" placement="bottom">
            <el-button type="warning" style="margin-left: 50px;" @click="readyImg(1)">还原性同步</el-button>
          </el-tooltip>
        </div>
      </el-dialog>
      <!-- 同步文件标签 -->
      <el-dialog
        title="资源操作警告"
        :visible.sync="tagDialogVisible"
        width="30%"
        center>
        <div style="width: 100%;text-align:center;">
          <el-input v-model="tagThread" placeholder="请输入需要同步的文件路径(作者UID)"></el-input>
          <el-divider></el-divider>
          <el-button type="warning" plain @click="startThread">开始同步</el-button>
        </div>
      </el-dialog>
      <!-- 上传文件 -->
      <el-dialog
        title="文件上传"
        v-if="uploadDialogVisible"
        :visible.sync="uploadDialogVisible"
        top="35px"
        width="30%"
        :destroy-on-close='true'
        :close-on-click-modal="false">
        <div>
          <uploadImaeg />
        </div>
      </el-dialog>
      <!-- 二维码 -->
      <el-dialog
        title="资源分享"
        v-if="codeDialogVisible"
        :visible.sync="codeDialogVisible"
        top="40px"
        width="30%"
        :destroy-on-close='true'
        :close-on-click-modal="false">
        <el-image
          :src="$hostURL + '/assFileCode/' + path">
        </el-image>
        <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;text-align: center;padding: 5px 5px 5px 5px;">
          <span style="font-size: 400;">二维码校验码为：【{{codeMd5}}】</span>
          <br>
          <el-link style="font-size: 400;" icon="el-icon-view" type="primary" @click="handleShare(codeUrl)">{{codeUrl}}</el-link>
        </div>
      </el-dialog>
      <!-- 图片详细信息 -->
      <el-dialog
        title="图片详情"
        v-if="detialDialogVisible"
        :visible.sync="detialDialogVisible"
        top="20px"
        width="60%"
        :destroy-on-close='true'
        :close-on-click-modal="false">
        <div :style="{'width': detialImageAspect, 'margin': '0 auto', 'background-color':'#f5f5f5'}">
          <el-image
            fits="contain"
            class="imgCententBlosType"
            :preview-src-list="srcImage"
            :src="detialImageUrl">
          </el-image>
        </div>
        <div class="mainDiv">
          <div class="authorDiv">
            <div class="block">
              <el-avatar :size="40" :src="headImage"></el-avatar>
            </div>
            <span class="demonstration">{{detialAuthorName}}</span>
          </div>
          <div class="textDiv">
            <span class="pidnstration">PID：『{{pixivId}}』</span>
            <span class="pidnstration">国家/地区：{{region}}</span>
          </div>
          <h1 class="fileNameDiv">{{detialFileName}}</h1>
          <div class="tagDiv">
            <el-tag v-for="(item1, index) in tagNameList" style="margin: 5px;" size="medium" @click="addTagSelect(item1)">
            {{item1}}
          </el-tag>
          </div>
          <div class="textDiv">
            <span class="pidnstration">数据类型：{{fileType}}</span>
            <span class="pidnstration">上传用户：{{psnName}}</span>
            <span class="pidnstration">文件创建时间：{{createDate}}</span>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { getImageDetial, codeFileApi, fileImageTabListApi, fileReadyApi, fileDelOkApi, fileTagThreadApi } from "@/api/fileImage"
  import insertFileWorkImage from './insertFileWorkImage.vue'
  import uploadImaeg from './uploadImaeg.vue'

  export default {
    name: 'fileImage',
    components: {
      insertFileWorkImage,
      uploadImaeg
    },
    data(){
      return{
        pathName: '',
        authorName: '',
        fileName: '',
        tagName: '',
        select: '1',
        /* 表格 */
        loadingTab: false,
        fileImageTab: [],
        total: 1,
        currentPage: 1,
        pageSize: 10,
        /* 图片 */
        srcImage: [],
        openHiddenButton: false,
        /* 表单*/
        sendDialog: false,
        readyDialogVisible: false,
        tagDialogVisible: false,
        uploadDialogVisible: false,
        /* 等待同步的作者ID*/
        tagThread: null,
        /* 分享二维码*/
        codeDialogVisible: false,
        path: '',
        codeMd5: '',
        codeUrl: '',
        /* 图片详细信息 */
        detialDialogVisible: false,
        detialImageUrl: '',
        detialImageWidth: 0,
        detialImageHeight: 0,
        detialImageAspect: '0%',
        imgLoading: false,

        /* 定时器*/
        timer: null,

        /* 详情内容 */
        headImage: '',
        detialAuthorName: '',
        createDate: '1',
        detialFileName:'123',
        fileType:'jpg',
        pixivId:'1',
        psnName:'1',
        region:'1',
        tagNameList: []
      }
    },
    methods: {
      htmlReplace(sHtml) {
        return encodeURIComponent(sHtml);
      },
      addTagSelect(value){
        this.tagName = value;
        this.sendNach();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.getImageList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getImageList();
      },
      getImageList(){
        this.loadingTab = true
        fileImageTabListApi({
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          pathName: this.pathName,
          fileName: this.fileName,
          tagName: this.tagName,
          isHas: this.select,
          authorName: this.authorName
        }).then((data) => {
          this.total = data.total;
          this.fileImageTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 500)
        })
      },
      handleShare(id){
        let url = window.location.href;
        url = url.split("#")[0] + '#/imageShare?ids=' + id;
        const save = function(e) {
          e.clipboardData.setData('text/plain', url)
          e.preventDefault() // 阻止默认行为
        }
        const once = {
          once: true
        }
        document.addEventListener('copy', save, once) // 添加一个copy事件,当触发时执行一次,执行完删除
        document.execCommand('copy') // 执行copy方法
        this.$message.success("复制当前页面地址到剪切板成功")
      },
      //搜索记录
      sendNach(){
        this.currentPage = 1;
        this.pageSize = 10;
        this.getImageList();
      },
      /* 获取列表勾选数据 */
      isChange(type) {
        let ids = this.$refs.multipleTable.selection.map((item) => item.ids);
        if(ids.length == 0){
          this.$message.warning("至少选择一条数据操作");
          return;
        }
        if(type == 1){
          if(ids.length > 20){
            this.$message.warning("至多选择二十条数据分享");
            return;
          }
          codeFileApi({
            passWord: 0,
            codeMind: ids.toString()
          }).then((data) => {
            if(data.code == 200){
              this.path = data.data.path;
              this.codeMd5 = data.data.codeMd5;
              this.codeUrl = data.data.url;
              this.codeDialogVisible = true;
            }
          })
        }else if(type == 2){
          fileDelOkApi({
            ids: ids
          }).then((data) => {
            if(data.code == 200){
              this.$message.success(data.textMsg);
              this.sendNach();
            }
          })
        }
      },
      //打开图片
      openImage(url){
        this.srcImage = [];
        this.srcImage.push(url)
      },
      //打开图片详细信息
      openDetialImage(ids, url){
        this.imgLoading = true;
        const img = new Image();
        img.src = url;
        this.timer = setInterval(() => {
          if(img.width){
            clearInterval(this.timer);
            this.timer = null;
            this.detialImageWidth = img.width;
            this.detialImageHeight = img.height;
            if(img.width / img.height > 1){
              this.detialImageAspect = '95%';
            }else{
              this.detialImageAspect = '45%';
            }
            this.srcImage = [];
            this.srcImage.push(url)
            this.imgLoading = false;
          }
        }, 500)
        getImageDetial({
          ids: ids
        }).then((data) => {
          if(data.code == 200){
            this.headImage = data.data.headImage;
            this.detialAuthorName = data.data.authorName;
            this.createDate = data.data.createDate;
            this.detialFileName = data.data.fileName;
            this.fileType = data.data.fileType;
            this.pixivId = data.data.pixivId;
            this.psnName = data.data.psnName;
            this.region = data.data.region;
            this.tagNameList = data.data.tagNameList;
            this.detialImageUrl = url;
            this.detialDialogVisible = true;
          }
        })
      },
      //打开外置录入
      openWorkImage(){
        this.sendDialog = true
      },
      //打开同步文件
      openReadyImage(){
        this.readyDialogVisible = true
      },
      //打开上传文件
      openUploadImage(){
        this.uploadDialogVisible = true
      },
      //同步文件
      readyImg(value){
        fileReadyApi({
          readyType: value
        }).then((data) => {
          if(data.code == 200){
            this.$notify({
              title: '图片同步处理',
              message: '已将该队列放至后台处理，请稍等片刻',
              type: 'success',
              duration: 0
            });
            this.readyDialogVisible = false;
          }
        })
      },
      //打开同步标签
      openReadyTag(){
        this.tagDialogVisible = true
      },
      //同步标签
      startThread(){
        fileTagThreadApi({
          pathName: this.tagThread
        }).then((data) => {
          if(data.code == 200){
            this.$notify({
              title: '图片同步处理',
              message: data.textMsg,
              type: 'success'
            });
            this.tagDialogVisible = false;
            this.tagThread = null;
          }
        })
      }
    },
    created() {
      clearInterval(this.timer);
      this.timer = null;
      this.getImageList();
    },
  }

</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .topClass {
    margin-top: 10px;
  }

  .imgClass {
    margin-top: 15px;
  }

  .imgCententBlosType {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    z-index: 1;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .mainDiv {
    margin: 30px 5% 0 5%;
  }

  .authorDiv {
    margin: 5px;
    display: flex;
    font-size: 15px;
    font-weight: 400;
  }

  .demonstration {
    padding-left: 10px;
    display: flex;
    align-items: center;
    flex: 1;
  }

  .pidnstration {
    padding-left: 10px;
    padding-bottom: 15px;
    display: flex;
    align-items: center;
    flex: 1;
  }

  .fileNameDiv {
    margin: 5px 5px 5px 5px;
    color: rgb(31, 31, 31);
    line-height: 24px;
    font-size: 20px;
    font-weight: bold;
  }

  .tagDiv {
    padding: 5px 0px;
    width: 95%;
  }

  .textDiv {
    font-size: 12px;
    color: rgb(173, 173, 173);
    display: block;
    line-height: 1;
  }

</style>
