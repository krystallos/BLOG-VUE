<template>
  <div>
    <div>
      <el-row>
        <el-col :span="4">
          <el-input v-model="https" placeholder="请输入网站地址"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="selectFor">查询</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleEdit('add',null)">新增密码本</el-button>
        </el-col>
      </el-row>

    </div>
    <div style="margin-top: 15px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="passWordList"
        style="width: 100%">
        <el-table-column prop="https" label="归属网站"></el-table-column>
        <el-table-column prop="accessName" label="账户"></el-table-column>
        <el-table-column prop="passToken" label="密码校验码" width="150"></el-table-column>
        <el-table-column prop="onState" label="是否有效" width="150"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit('look',scope.row.ids)">查看密码</el-button>
            <el-button size="mini" type="warning" @click="handleEdit('edit',scope.row.ids)">修改密码</el-button>
            <el-button size="mini" type="danger" @click="handleUtil('del',scope.row.ids)">删除</el-button>
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
        title="新增"
        v-if="dialogVisible"
        :visible.sync="dialogVisible"
        width="30%"
        top="35px"
        :modal='true'
        :destroy-on-close='true'
        :close-on-click-modal="false"
        >
        <div>
          <el-input placeholder="请输入网站地址" v-model="httpsInput">
            <template slot="prepend">网站</template>
          </el-input>
          <div style="margin-top: 15px;"></div>
          <el-input placeholder="请输入账号" v-model="accessName">
            <template slot="prepend">账号</template>
          </el-input>
          <div style="margin-top: 15px;"></div>
          <el-input placeholder="请输入密码" v-model="passWordInput">
            <template slot="prepend">网站密码</template>
          </el-input>
          <div style="margin-top: 15px;"></div>
          <el-input placeholder="请确认密码" v-model="passWordDoubleInput">
            <template slot="prepend">确认密码</template>
          </el-input>
          <div style="margin-top: 15px;"></div>
          <el-input placeholder="请输入备注" v-model="remarkInput">
            <template slot="prepend">备注</template>
          </el-input>
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
  import {passWordMineListApi, updatePassWordUtilApi, passWordUtilInfoApi } from '@/api/passWordConfig'

  export default {
    name: 'passWordTab',
    data () {
      return {
        https: '',//搜索栏
        httpsInput: '',
        accessName: '',
        passWordInput: '',
        passWordDoubleInput: '',
        remarkInput:'',

        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        passWordList: [],//表格数据
        loadingTab: false,//加载

        dialogVisible: false,
        postName: null,
        remark: null,

        ids: '',
        froms: '',
      }
    },
    methods: {
      //查询重置集成
      selectFor(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.passWordMineListTab();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.passWordMineListTab();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.passWordMineListTab();
      },
      //列表接口集成
      passWordMineListTab(){
        this.loadingTab = true;
        passWordMineListApi({nowTab: this.currentPage, hasTab: this.pageSize, https: this.https}).then((data) => {
          this.total = data.total;
          this.passWordList = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      //新增/修改/删除
      handleUtil(type, ids){
        if(type == 'add' || type == 'edit'){
          if(this.httpsInput == null || this.httpsInput == ''){this.$message.warning("请填写网站地址");return}
          if(this.accessName == null || this.accessName == ''){this.$message.warning("请填写网站账号");return}
          if(this.passWordInput == null || this.passWordInput == ''){this.$message.warning("请填写密码");return}
          if(this.passWordDoubleInput == null || this.passWordDoubleInput == ''){this.$message.warning("请填写确认密码");return}
          if(this.passWordInput != this.passWordDoubleInput){this.$message.warning("两次密码不一致");return}
        }
        updatePassWordUtilApi({ids: ids, https: this.httpsInput, accessName: this.accessName, passWord: this.passWordInput, remark: this.remarkInput, froms: type}).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.dialogVisible = false;
            this.ids = '';
            this.httpsInput = '';
            this.accessName = '';
            this.passWordDoubleInput = '';
            this.passWordInput = '';
            this.remarkInput = '';
            this.selectFor();
          }
        })
      },
      //新增，修改
      handleEdit(type, ids){
        this.froms = type;
        this.ids = ids;
        if(type == 'edit' || type == 'look'){
          this.$prompt('请输入密码', '密码校验', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            this.passWordUtilInfo(ids,value,type)
          });
        }else if(type == 'add'){
          this.dialogVisible = true;
        }
      },
      passWordUtilInfo(ids,passWord,type){
        passWordUtilInfoApi({ids: ids, passWord: passWord}).then((data) => {
          if(data.code == 200){
            let {https , passWord, remark, accessName} = data.data;
            if(type == 'edit'){
              this.httpsInput = https;
              this.accessName = accessName;
              this.passWordInput = passWord;
              this.remarkInput = remark;
              this.dialogVisible = true;
            }else if(type == 'look'){
              this.$alert('网站<'+ https +'>的密码为['+ passWord + ']', '查看密码', {
                confirmButtonText: '确定'
              });
            }
          }
        })
      }
    },
    created() {
      this.passWordMineListTab();
    }
  }
</script>

<style>
</style>
