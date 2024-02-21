<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input v-model="projectName" placeholder="项目名称"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="selectFor">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" @click="insertProject">新增项目</el-button>
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
          width="300">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isFile == '0'" @click="handleShare(scope.row.ids, scope.row.projectName, scope.row.createName)" type="success" size="small" plain>分享</el-button>
            <el-button v-if="scope.row.isFile == '1'" @click="handleDetial(scope.row.ids)" type="primary" size="small" plain>查看</el-button>
            <el-button @click="handleEdit(scope.row.ids, scope.row.projectName)" type="info" size="small" plain>编辑</el-button>
            <el-button @click="handleDel(scope.row.ids)" type="danger" size="small" plain>删除</el-button>
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
        <sysRstHttpDetial :dialogSend.sync="dialogVisible" :projectId="projectId"/>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <el-dialog
      v-if="dialogInsertVisible"
      title="API文档新增"
      :visible.sync="dialogInsertVisible"
      width="20%"
      top="100px"
      :modal='true'
      :destroy-on-close='true'
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      >
      <div>
        <sysRstHttpInsert :dialogInsertVisible.sync="dialogInsertVisible"/>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script>

  import { rstPostList, rstPostDeleteApi, editRstPostApi } from '@/api/sysRstHttpApi'
  import sysRstHttpDetial from './sysRstHttpDetial.vue'
  import sysRstHttpInsert from './sysRstHttpInsert.vue'

  export default {
    name: 'sysRstHttp',
    components: {
      sysRstHttpDetial,
      sysRstHttpInsert
    },
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        projectList: [],//表格数据
        loadingTab: false,//加载

        dialogVisible: false,
        dialogInsertVisible: false,
        projectName: '',
        projectId: '',
      }
    },
    methods: {
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
      rstPostListApi(){
        this.loadingTab = true;
        rstPostList({nowTab: this.currentPage, hasTab: this.pageSize, projectName: this.projectName }).then((data) => {
          this.total = data.total;
          this.projectList = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 500)
        })
      },
      handleDel(id){
        this.$confirm('此操作将删除该文档及文档下的分类, 是否继续?', '删除警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          rstPostDeleteApi({ids: id }).then((data) => {
            this.selectFor();
            this.$message.success(data.textMsg);
          })
        });
      },
      handleDetial(id){
        this.projectId = id;
        this.dialogVisible = true;
      },
      handleEdit(id, projectName){
        this.$prompt('请输入新的名称', '信息修改', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: projectName
        }).then(({value}) => {
          if(value == null || value == ''){
            this.$message.error("新项目名称不能为空");
            return;
          }
          editRstPostApi({ids: id, projectName: value}).then((data) => {
            setTimeout(() => {
              this.$message.success(data.textMsg);
              this.selectFor();
            }, 500)
          })
        })
      },
      insertProject(){
        this.dialogInsertVisible = true;
      },
      handleShare(id, name, createName){
        let url = window.location.href;
        url = url.split("#")[0] + '#/openApiDoc?projectId=' + id;
        const save = function(e) {
          e.clipboardData.setData('text/plain', url + "  来自" + createName + "分享的接口[" + name + "]")
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
    created() {
      this.rstPostListApi();
    }
  }

</script>

<style>
</style>
