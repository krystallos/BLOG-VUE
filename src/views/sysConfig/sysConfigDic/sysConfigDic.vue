<template>
  <div>
    <div style="margin: 0 15px;">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="dicKey" placeholder="字典名称"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="isTest" placeholder="所属环境">
            <el-option label="" value=""></el-option>
            <el-option label="开发" value="TEST"></el-option>
            <el-option label="产品" value="PROD"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="selectFor">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="success" @click="edisDic(null)">新增</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="sysDicTab"
        style="width: 100%">
        <el-table-column prop="dicKey" label="字典名称" width="350"></el-table-column>
        <el-table-column prop="dicValue" label="字典值" width="350"></el-table-column>
        <el-table-column prop="isStatus" label="是否启用"></el-table-column>
        <el-table-column prop="isSystem" label="是否系统字段">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              {{ scope.row.isSystem == '1' ? '是' : '否' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="isTest" label="开发环境"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edisDic(scope.row.ids)">修改</el-button>
            <el-button size="mini" type="danger" v-loading.fullscreen.lock="loadingDic" @click="delDic(scope.row.ids, 1)">删除</el-button>
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
          <el-input placeholder="xxx : xxx" v-model="dicInputVo.dicKeyInput">
            <template slot="prepend">字典名称</template>
          </el-input>
          <div style="margin-top: 15px;"></div>
          <el-input placeholder="字典值" v-model="dicInputVo.dicValueInput">
            <template slot="prepend">字典值</template>
          </el-input>
          <div style="margin-top: 15px;"></div>
          <el-input placeholder="请输入备注" v-model="dicInputVo.remarkInput">
            <template slot="prepend">备注</template>
          </el-input>
          <div style="margin-top: 15px;"></div>
          <span style="color: #909399;padding: 10px; 0">是否启用</span>
          <el-select v-model="dicInputVo.isStatusInput" placeholder="是否启用">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="2"></el-option>
          </el-select>
          <div style="margin-top: 15px;"></div>
          <span style="color: #909399;padding: 10px; 0">是否系统字段</span>
          <el-select v-model="dicInputVo.isSystemInput" placeholder="是否系统字段">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
          </el-select>
          <div style="margin-top: 15px;"></div>
          <span style="color: #909399;padding: 10px; 0">开发环境</span>
          <el-select v-model="dicInputVo.isTestInput" placeholder="开发环境">
              <el-option label="开发" value="TEST"></el-option>
              <el-option label="产品" value="PROD"></el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleUtil(froms, ids)">确 定</el-button>
          <el-button type="info" @click="dialogVisible = false;">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {sysConfigListApi, getSysConfigApi, delSysConfigApi, editSysConfigApi} from '@/api/sysConfigDic'

  export default {
    name: 'sysConfigDic',
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        sysDicTab: [],//表格数据
        loadingTab: false,//加载
        loadingDic: false,//加载

        dialogVisible: false,//新增、修改
        dicInputVo:{
          dicKeyInput: null,
          dicValueInput: null,
          isStatusInput: 1,
          isSystemInput: 1,
          remarkInput: null,
          isTestInput: 1
        },
        froms: '',
        ids: null,

        dicKey: null,
        isTest: null,
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.sysConfigList();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.sysConfigList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.sysConfigList();
      },
      //列表接口集成
      sysConfigList(){
        this.loadingTab = true;
        sysConfigListApi({nowTab: this.currentPage, hasTab: this.pageSize, dicKey: this.dicKey, isTest: this.isTest}).then((data) => {
          this.total = data.total;
          this.sysDicTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      //打开新增、修改
      edisDic(id){
        if(id == null){
          this.froms = 'add';
          this.ids = null;
          this.dicInputVo.dicKeyInput = null;
          this.dicInputVo.dicValueInput = null;
          this.dicInputVo.isStatusInput = '启用';
          this.dicInputVo.isSystemInput = '是';
          this.dicInputVo.remarkInput = null;
          this.dicInputVo.isTestInput = 'TEST';
          this.dialogVisible = true;
        }else{
          this.froms = 'edit';
          this.ids = id;
          getSysConfigApi({ids: id}).then((data) => {
            let dicVo = data.data;
            this.dicInputVo.dicKeyInput = dicVo.dicKey;
            this.dicInputVo.dicValueInput = dicVo.dicValue;
            this.dicInputVo.isStatusInput = dicVo.isStatus;
            this.dicInputVo.isSystemInput = dicVo.isSystem;
            this.dicInputVo.remarkInput = dicVo.remark;
            this.dicInputVo.isTestInput = dicVo.isTest;
            this.dialogVisible = true;
            setTimeout(() => {
               this.loadingTab = false;
            }, 1000)
          })
        }
      },
      handleUtil(froms, ids){
        editSysConfigApi({
          ids: ids,
          dicKey: this.dicInputVo.dicKeyInput,
          dicValue: this.dicInputVo.dicValueInput,
          isStatus: this.dicInputVo.isStatusInput,
          isSystem: this.dicInputVo.isSystemInput,
          isTest: this.dicInputVo.isTestInput,
          remark: this.dicInputVo.remarkInput,
          froms: froms
        }).then((data) => {
          this.$message.success(data.textMsg);
          this.dialogVisible = false;
          this.sysConfigList();
        })
      },
      delDic(id){
        delSysConfigApi({ids: id}).then((data) => {
          this.$message.success(data.textMsg);
          this.sysConfigList();
        })
      }
    },
    created() {
      this.sysConfigList();
    }
  }


</script>

<style>
</style>
