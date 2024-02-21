<template>
  <div>
    <div>
      <el-button type="primary" @click="addRoleMenu">新增角色-菜单</el-button>
    </div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="roleMenuTab"
        style="width: 100%">
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="menuName" label="菜单名称"></el-table-column>
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
      <!-- 菜单穿梭框 -->
      <el-dialog
        title="操作"
        v-if="transferVisible"
        :visible.sync="transferVisible"
        width="50%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        append-to-body
        >
        <div style="margin: 0 auto;">
          <el-transfer
            v-model="transferRight"
            :titles="['未添加','已添加']"
            :data="transferLeft"
            @change="handleChange"
          ></el-transfer>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {roleMenuTabApi, funcRoleMenuApi, updateResMenuApi } from '@/api/roleConfig';

  export default {
    name: 'roleForMenu',
    props: ['roleId'],
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        roleMenuTab: [],//表格数据
        loadingTab: false,//加载

        ids: this.roleId,
        transferVisible: false,
        transferLeft: [],
        transferRight: [],
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.roleMenuTabPage();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.roleMenuTabPage();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.roleMenuTabPage();
      },
      //列表接口集成
      roleMenuTabPage(){
        this.loadingTab = true;
        roleMenuTabApi({nowTab: this.currentPage, hasTab: this.pageSize, roleId: this.ids}).then((data) => {
          this.total = data.total;
          this.roleMenuTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      addRoleMenu(){
        this.funcRoleMenuPage();
        this.transferVisible = true;
      },
      funcRoleMenuPage(){
        this.transferLeft = [];
        this.transferRight = [];
        funcRoleMenuApi({roleId: this.ids}).then((data) => {
          let {allMenu, hasMenu} = data.data;
          let hasTab = [];
          this.transferLeft = allMenu;
          for(let a=0;a<hasMenu.length;a++){
            hasTab.push(hasMenu[a].key);
          }
          this.transferRight = hasTab;
        })
      },
      handleChange(value, direction, movedKeys){
        let type = "2";
        if('left' == direction){
          type = "1";
        }else if('right' == direction){
          type = "0";
        }
        updateResMenuApi({roleId: this.ids, ids: movedKeys, type: type}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.funcRoleMenuPage();
          }
        })
      }
    },
    created() {
      this.roleMenuTabPage();
    }
  }

</script>

<style scoped>
  .el-transfer-panel{
    width: 40%;
  }

</style>
