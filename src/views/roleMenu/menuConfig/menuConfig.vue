<template>
  <div>
    <div>
      <el-button type="primary" @click="handleEdit()">新增菜单</el-button>
    </div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="menuTab"
        style="width: 100%">
        <el-table-column prop="tabName" label="菜单名称">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper" v-if="scope.row.pramName == null">
              <el-tag size="medium">{{ scope.row.tabName }}</el-tag>
            </div>
            <span v-if="scope.row.pramName != null">{{ scope.row.tabName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pramName" label="上级菜单名称"></el-table-column>
        <el-table-column prop="menuUrl" label="菜单URL"></el-table-column>
        <el-table-column prop="icon" label="菜单图标(APP/WEB)" width="170"></el-table-column>
        <el-table-column prop="setApp" label="是否允许APP使用" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.setApp == 1?'允许':'禁止'}} </span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="序列号" width="100"></el-table-column>
        <el-table-column prop="proType" label="基本权限" width="100"></el-table-column>
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
      <!-- 新增 -->
      <el-dialog
        title="新增"
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        width="40%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
        <div>
          <el-input placeholder="请输入菜单名称" v-model="tabNameInput">
            <template slot="prepend">菜单名称</template>
          </el-input>
          <div style="padding-top: 10px;"></div>
          <el-select v-model="pramNameInput" style="width: 100%;" placeholder="上级菜单">
            <el-option
              v-for="item in options"
              :label="item.tabName"
              :value="item.ids"
            ></el-option>
          </el-select>
          <div style="padding-top: 10px;"></div>
          <el-select v-model="proTypeInput" style="width: 100%;" placeholder="请输入所属角色">
            <el-option label="" value=""></el-option>
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="用户" value="用户"></el-option>
          </el-select>
          <div style="padding-top: 10px;"></div>
          <el-input placeholder="请输入菜单配置名称" v-model="menuNameInput">
            <template slot="prepend">菜单路径</template>
          </el-input>
          <div style="padding-top: 10px;"></div>
          <el-input placeholder="请输入菜单路径" v-model="menuUrlInput">
            <template slot="prepend">菜单路径</template>
          </el-input>
          <div style="padding-top: 10px;"></div>
          <el-input placeholder="请输入菜单图标(APP/WEB)" v-model="iconInput">
            <template slot="prepend">菜单图标</template>
          </el-input>
          <div style="padding-top: 10px;"></div>
          <el-select v-model="setAppInput" style="width: 100%;" placeholder="是否给予APP菜单">
            <el-option label="" value=""></el-option>
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="insertMenu">确 定</el-button>
          <el-button type="info" @click="dialogVisible = false;options = [];">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {menuAddTabApi, addNewMenuApi, getTopMenuApi } from '@/api/menuConfig'

  export default {
    name: 'menuConfig',
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        menuTab: [],//表格数据
        loadingTab: false,//加载

        dialogVisible:false,
        options: [],
        tabNameInput: '',
        pramNameInput: '',
        proTypeInput: '',
        menuUrlInput: '',
        iconInput: '',
        setAppInput: '',
        menuNameInput: '',
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.menuAddTabPage();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.menuAddTabPage();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.menuAddTabPage();
      },
      //列表接口集成
      menuAddTabPage(){
        this.loadingTab = true;
        menuAddTabApi({nowTab: this.currentPage, hasTab: this.pageSize}).then((data) => {
          this.total = data.total;
          this.menuTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      handleEdit(){
        this.getTopMenuPage();
        this.dialogVisible = true;
      },
      getTopMenuPage(){
        getTopMenuApi({}).then((data) => {
          if(data.code == 200){
            this.options = data.data
          }
        })
      },
      insertMenu(){
        if(this.tabNameInput == null || this.tabNameInput == ''){this.$message.warning("菜单名称不能为空");return}
        if(this.proTypeInput == null || this.proTypeInput == ''){this.$message.warning("所属角色不能为空");return}
        if(this.menuNameInput == null || this.menuNameInput == ''){this.$message.warning("菜单配置路径不能为空");return}
        if(this.menuUrlInput == null || this.menuUrlInput == ''){this.$message.warning("菜单路径不能为空");return}
        if(this.setAppInput == null || this.setAppInput == ''){this.$message.warning("请选择APP菜单权限");return}
        addNewMenuApi({
          tabName: this.tabNameInput,
          pramId: this.pramNameInput,
          proType: this.proTypeInput,
          menuName: this.menuNameInput,
          menuUrl: this.menuUrlInput,
          icon: this.iconInput,
          setApp: this.setAppInput
        }).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.options = [];
            this.dialogVisible = false;
          }
        })
      }
    },
    created() {
      this.menuAddTabPage();
    }
  }

</script>

<style>
</style>
