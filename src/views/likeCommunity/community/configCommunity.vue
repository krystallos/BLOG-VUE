<template>
  <div>
    <div>
      <el-button type="primary" @click="handleEdit(null)">新增社区</el-button>
    </div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="likeCommunityTab"
        style="width: 100%">
        <el-table-column prop="likeName" label="社区"></el-table-column>
        <el-table-column prop="likeRemaker" label="社区备注"></el-table-column>
        <el-table-column prop="likeSort" label="社区排序" width="250"></el-table-column>
        <el-table-column prop="createDate" label="建立及更新时间" width="250"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.ids)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row.ids)">删除</el-button>
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
    <div>
      <!-- 详细信息/修改 -->
      <el-dialog
        v-loading="loadingDialog"
        element-loading-background="rgba(184, 184, 184, 0.3)"
        title="操作"
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        width="30%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
        <div>
          <el-input placeholder="请输入社区名称" v-model="likeName">
            <template slot="prepend">社区名称</template>
          </el-input>
          <div style="padding-top: 10px;"></div>
          <el-input placeholder="请输入社区备注" v-model="likeRemaker">
            <template slot="prepend">社区备注</template>
          </el-input>
          <div style="padding-top: 10px;"></div>
          <el-input type="number" placeholder="请输入社区排序" v-model="likeSort">
            <template slot="prepend">社区排序</template>
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="insertCommunity">确 定</el-button>
          <el-button type="info" @click="dialogVisible = false;ids = null;">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {likeMenuTabPageApi, addLikeMenuApi, delLikeMenuApi, editLikeMenuApi, getLikeMenuApi} from '@/api/likeCommunity'

  export default {
    name: 'configCommunity',
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        likeCommunityTab: [],//表格数据
        loadingTab: false,//加载

        loadingDialog: false,
        dialogVisible: false,
        likeName: '',
        likeRemaker: '',
        likeSort: '',
        ids: '',
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.likeMenuTabPage();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.likeMenuTabPage();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.likeMenuTabPage();
      },
      //列表接口集成
      likeMenuTabPage(){
        this.loadingTab = true;
        likeMenuTabPageApi({nowTab: this.currentPage, hasTab: this.pageSize}).then((data) => {
          this.total = data.total;
          this.likeCommunityTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      //新增
      insertCommunity(){
        if(this.likeName == null || this.likeName == ''){this.$message.warning("请输入社区名称");return;}
        else if(this.likeRemaker == null || this.likeRemaker == ''){this.$message.warning("请输入社区备注");return;}
        else if(this.likeSort == null || this.likeSort == ''){this.$message.warning("请输入社区排序");return;}
        if(this.ids != null){
          editLikeMenuApi({ids: this.ids, likeName: this.likeName, likeRemaker: this.likeRemaker, likeSort: this.likeSort}).then((data) => {
            if(data.code == 200){
              this.$message.success(data.textMsg);
              this.dialogVisible = false;
              this.selectFor();
            }
          })
        }else{
          addLikeMenuApi({likeName: this.likeName, likeRemaker: this.likeRemaker, likeSort: this.likeSort}).then((data) => {
            if(data.code == 200){
              this.$message.success(data.textMsg);
              this.dialogVisible = false;
              this.selectFor();
            }
          })
        }
      },
      //删除
      handleDel(value){
        delLikeMenuApi({ids: value}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
          }
          this.pageSize = 10;
          this.currentPage = 1;
          this.likeMenuTabPage();
        })
      },
      //新增/修改
      handleEdit(value){
        if(value == null){
          this.ids = null;
          this.likeSort = '';
          this.likeRemaker = '';
          this.likeName = '';
          this.dialogVisible = true;
        }else{
          this.ids = value;
          this.dialogVisible = true;
          this.loadingDialog = true;
          getLikeMenuApi({ids: value}).then((data) => {
            if(data.code == 200){
              let {likeSort, likeRemaker, likeName} = data.data;
              this.likeSort = likeSort;
              this.likeRemaker = likeRemaker;
              this.likeName = likeName;
            }
            setTimeout(() => {
               this.loadingDialog = false;
            }, 500)
          })
        }
      }
    },
    created() {
      this.likeMenuTabPage();
    }
  }
</script>

<style>
</style>
