<template>
  <div>
    <div>
      <el-menu default-active="2" mode="horizontal">
        <el-menu-item index="1">
          <img src="@/assets/static_images/wdnm.png" class="topImageDiv">
        </el-menu-item>
        <el-menu-item index="2" @click="talkVisible = true">功能介绍</el-menu-item>
        <el-menu-item index="3" >
          <router-link to="/login">回到主站</router-link>
        </el-menu-item>
        <el-menu-item index="4">
          <router-link to="/404">AI词库</router-link>
        </el-menu-item>
        <el-menu-item index="5">
          <router-link to="/setu">爬虫图床</router-link>
        </el-menu-item>
        <el-menu-item index="6">
          <router-link to="/fictionMain">小说站</router-link>
        </el-menu-item>
        <el-menu-item index="7">
          <router-link to="/selectImage">识图工具</router-link>
        </el-menu-item>
      </el-menu>
    </div>
    <div style="padding: 40px;">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="projectName" placeholder="项目名称"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="selectFor">搜索</el-button>
        </el-col>
      </el-row>
      <div style="margin-top: 15px;">
        <!-- 表格 -->
        <el-table
          :data="projectList"
          v-loading="loadingTab"
          style="width: 100%;margin-bottom: 20px;"
          row-key="ids"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="projectName" label="项目名称" width="600">
            <template slot-scope="scope">
              <span style="font-weight: 600;" v-if="scope.row.isFile == '0'">{{"── " + scope.row.projectName}}</span>
              <span v-if="scope.row.isFile == '1'">{{"  ├── " + scope.row.projectName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isFile" label="是否项目" width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isFile == '0'">项目</el-tag>
              <el-tag v-if="scope.row.isFile == '1'">文件夹</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="hasCountFile" label="包含文件夹" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.isFile == '0'">{{scope.row.hasCountFile + '个'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createName" label="创建者" width="150"></el-table-column>
          <el-table-column prop="updateDate" label="创建时间"></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isFile == '1'" @click="handleDetial(scope.row.ids)" type="primary" size="small" plain>查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格 -->
        <div style="margin-top: 15px;"></div>
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
        <!-- 分页器 -->
      </div>
      <el-dialog
        v-if="dialogVisible"
        title="API文档详情"
        :visible.sync="dialogVisible"
        width="80%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        >
        <div>
          <sysOpenRstHttpDetial :dialogSend.sync="dialogVisible" :projectId="childProjectId"/>
        </div>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        title="功能介绍"
        :visible.sync="talkVisible"
        width="30%"
      >
        <h1>这是什么？</h1>
        <h3>这是一个仿ApiFox的接口文档工具，通过后端在后台的扫描将文档保存至云端给前端使用，前端如果需要申请使用权限需联系管理员。</h3>
        <h1>要怎么用？</h1>
        <h3>首先向管理员申请需要联调的项目文档ID，并将ID输入URL中的projectId中刷新整个页面即可，如果需要申请多个文档则需要使用多个URL，也可以申请后台权限以便在后台直接操作</h3>
        <h1>受限及后续升级？</h1>
        <h3>后续会捆绑消息通知<此页面>，及权限组页面，未登入只能同时使用一个URL，登入后将可以支持多步进和编辑修改功能</h3>
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

  import { rstOpenPostList, getOpenRstApiKeyApi } from '@/api/openApi/sysOpenRstHttpApi'
  import { selectSessionSysVersionsApi, sysVersionsSessionIssApi } from '@/api/sysVersions'
  import sysOpenRstHttpDetial from './sysOpenRstHttpDetial.vue'

  export default {
    name: 'sysOpenRstHttp',
    components: {
      sysOpenRstHttpDetial
    },
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        projectList: [],//表格数据
        loadingTab: false,//加载

        dialogVisible: false,
        projectName: '',
        projectId: '',
        childProjectId: '',

        talkVisible: false
      }
    },
    methods: {
      selectSessionSysVersions(key){
        selectSessionSysVersionsApi({session: key}).then((data) => {
          if(data.data != null){
            this.$alert(data.data.verType, data.data.verName, {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '我已了解',
              callback: action => {
                sysVersionsSessionIssApi({ids :data.data.ids, session :key}).then((data) => {})
              }
            });
          }
        })
      },
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.rstPostListApi();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.rstPostListApi();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.rstPostListApi();
      },
      //列表接口集成
      rstPostListApi(Key){
        this.loadingTab = true;

        rstOpenPostList({nowTab: this.currentPage, hasTab: this.pageSize, projectName: this.projectName ,ids: this.projectId}).then((data) => {
          this.total = data.total;
          this.projectList = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 500)
        })
      },
      handleOpenRstApiKey(key){
        getOpenRstApiKeyApi({rstKey: key, rstIds: this.projectId}).then((data) => {
          if(data.data.rstKey == null || data.data.rstKey != key){
            this.$message.error("校验码错误");
            localStorage.removeItem("httpApiKey");
          }else{
            localStorage.setItem("httpApiKey", data.data.rstKey);
            this.rstPostListApi();
            this.selectSessionSysVersions(data.data.rstKey);
          }
        })
      },
      handleDetial(id){
        this.childProjectId = id;
        this.dialogVisible = true;
      },
      urlHanlden(){
        let geturl = window.location.href;
        let getqyinfo = geturl.split('?');
        if(getqyinfo.length < 2){
          this.userKey == null;
          return;
        }
        let getqys = new URLSearchParams(getqyinfo[1]);
        let getqycode = getqys.get('projectId');
        this.projectId = getqycode;
      },
    },
    created() {
      this.urlHanlden();

      let key = localStorage.getItem("httpApiKey");
      if(key == null || key == ""){
        this.$prompt('请输入邀请码：', '邀请码校验', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '',
          showCancelButton: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              if(instance.inputValue == null || instance.inputValue == ''){
                this.$message.error("前缀名称不能为空");
              }else{done();}
            }
          }
        }).then(({value}) => {
          this.handleOpenRstApiKey(value);
        })
      }else{
        this.handleOpenRstApiKey(key);
      }
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
