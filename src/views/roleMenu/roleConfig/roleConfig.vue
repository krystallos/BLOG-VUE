<template>
  <div>
    <div>
      <el-button type="primary" @click="handleEdit('add', null)">新增角色</el-button>
    </div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="roleTypeTab"
        style="width: 100%">
        <el-table-column prop="ids" label="角色唯一键"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column label="操作" width="450">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit('roleMenu' ,scope.row.ids)">配置角色-菜单</el-button>
            <el-button size="mini" type="info" @click="handleEdit('roleUser', scope.row.ids)">配置角色-用户</el-button>
            <el-button size="mini" type="warning" @click="handleEdit('edit', scope.row.ids)">修改角色</el-button>
            <el-button size="mini" type="danger" @click="handleEdit('del',scope.row.ids)">删除角色</el-button>
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
          <el-input placeholder="请输入角色名称" v-model="roleNameInput">
            <template slot="prepend">角色名称</template>
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleAddOrUpdate">确 定</el-button>
          <el-button type="info" @click="dialogVisible = false;">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 角色-菜单 -->
      <el-dialog
        title="角色-菜单权限"
        v-if="roleMenuVisible"
        :visible.sync="roleMenuVisible"
        width="60%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
        <div>
          <roleForMenu :roleId="ids" />
        </div>
      </el-dialog>
      <!-- 角色-用户 -->
      <!-- 菜单穿梭框 -->
      <el-dialog
        title="操作"
        v-if="roleUserVisible"
        :visible.sync="roleUserVisible"
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
  import {roleTypeListApi, delRoleApi, roleInfoApi, updateRoleApi, addRoleApi, funcRolePersonApi, updateResPersonApi } from '@/api/roleConfig';
  import roleForMenu from './roleForMenu.vue'

  export default {
    name: 'roleConfig',
    components: {
      roleForMenu
    },
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        roleTypeTab: [],//表格数据
        loadingTab: false,//加载

        dialogVisible: false,
        roleMenuVisible: false,
        roleUserVisible: false,
        roleNameInput: '',
        fromType: '',
        ids: '',
        transferLeft: [],
        transferRight: [],
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.roleTypeListPage();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.roleTypeListPage();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.roleTypeListPage();
      },
      //列表接口集成
      roleTypeListPage(){
        this.loadingTab = true;
        roleTypeListApi({nowTab: this.currentPage, hasTab: this.pageSize}).then((data) => {
          this.total = data.total;
          this.roleTypeTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      delRolePost(value){
        delRoleApi({ids: value}).then((data) => {
          this.$message.success(data.textMsg);
          this.selectFor();
        })
      },
      roleInfoPage(value){
        roleInfoApi({ids: value}).then((data) => {
          this.roleNameInput = data.data.roleName;
        })
      },
      updateRolePage(value){
        updateRoleApi({ids: value, roleName: this.roleNameInput}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.roleNameInput = '';
            this.ids = '';
            this.dialogVisible= false;
          }
        })
      },
      addRolePage(){
        addRoleApi({roleName: this.roleNameInput}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.roleNameInput = '';
            this.dialogVisible= false;
          }
        })
      },
      handleEdit(type, ids){
        if(type == 'del'){
          this.delRolePost(ids);
        }else if(type == 'edit'){
          this.fromType = 'edit';
          this.ids = ids;
          this.roleInfoPage(ids);
          this.dialogVisible = true;
        }else if(type == 'add'){
          this.fromType = 'add'
          this.dialogVisible = true;
        }else if(type == 'roleMenu'){
          this.ids = ids;
          this.roleMenuVisible = true;
        }else if(type == 'roleUser'){
          this.ids = ids;
          this.funcRolePersonPage();
          this.roleUserVisible = true;
        }
      },
      handleAddOrUpdate(){
        if(this.fromType == 'add'){
          this.addRolePage();
        }else if(this.fromType == 'edit'){
          this.updateRolePage(this.ids);
        }
        this.selectFor();
      },
      funcRolePersonPage(){
        this.transferLeft = [];
        this.transferRight = [];
        funcRolePersonApi({roleId: this.ids}).then((data) => {
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
        updateResPersonApi({roleId: this.ids, ids: movedKeys, type: type}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.funcRolePersonPage();
          }
        })
      },
    },
    created() {
      this.roleTypeListPage();
    }
  }

</script>

<style>
</style>
