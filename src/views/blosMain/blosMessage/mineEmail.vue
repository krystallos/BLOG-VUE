<template>
  <div>
    <!-- 顶部按钮 -->
    <el-button type="primary" plain @click="isSend">发送邮件</el-button>
    <el-button type="info" plain @click="isChange(3)" :loading="isLikeLoad">转重要邮件</el-button>
    <el-button type="success" plain @click="isChange(2)" :loading="isLookLoad">批量已读</el-button>
    <el-button type="danger" plain @click="isChange(1)" :loading="isDelLoad">批量删除</el-button>
    <!-- 顶部按钮 -->
    <!-- 表格 -->
    <el-table
      v-loading="loadingTab"
      :data="emailTab"
      style="width: 100%"
      ref="multipleTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="fromPersonName" label="发件人" width="180"></el-table-column>
      <el-table-column prop="intoPersonName" label="收件人" width="180"></el-table-column>
      <el-table-column prop="title" label="标题" width="500"></el-table-column>
      <el-table-column prop="isLike" label="是否关注"></el-table-column>
      <el-table-column prop="isLook" label="状态"></el-table-column>
      <el-table-column prop="createDate" label="操作时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="emailGet(scope.row.ids)">邮件详情</el-button>
          <el-button size="mini" type="danger" v-loading.fullscreen.lock="loadingEmail" @click="handleEdit(scope.row.ids, 1)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->
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
    <!-- 分页器 -->
    <!-- 详细信息 -->
    <el-dialog
      v-if="dialogVisible"
      title="邮件详情"
      :visible.sync="dialogVisible"
      width="60%"
      top="35px"
      :modal='true'
      :destroy-on-close='true'
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      >
      <div>
        <getMineEmail :getEmailVo="getEmailVo" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 详细信息 -->
    <!-- 发送邮件 -->
    <el-dialog
      v-if="dialogSend"
      title="发送邮件"
      :visible.sync="dialogSend"
      width="60%"
      top="35px"
      :modal='true'
      :destroy-on-close='true'
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      >
      <div>
        <sendMineEmail :dialogSend.sync="dialogSend" />
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <!-- 发送邮件 -->
  </div>
</template>

<script>
import { getEmailListApi, stateEmailListApi, getEmail } from '@/api/email'
import getMineEmail from './getMineEmail.vue'
import sendMineEmail from './sendMineEmail.vue'

export default {
  name: 'mineEmail',
  components: {
    getMineEmail,
    sendMineEmail
  },
  data() {
    return {
      emailTab: [],//表格数据
      total: 1,//总数
      pageSize: 10,//当前页展示条数
      currentPage: 1,//所在页数
      isLikeLoad: false,//重要邮件加载
      isLookLoad: false,//查看邮件加载
      isDelLoad: false,//删除邮件加载
      dialogVisible: false,//详情页面
      getEmailVo: [],//邮件信息
      loadingTab: true,//加载中(列表)
      loadingEmail: false,//加载中(详细信息)
      dialogSend: false,//发送页面
    }
  },
  methods: {
    /* 发送邮件页 */
    isSend() {
      this.dialogSend = true;
    },
    /* 获取列表勾选数据 */
    isChange(type) {
      this.handleEdit(this.$refs.multipleTable.selection.map((item) => item.ids), type)
    },
    //修改当前页数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getEmailList();
    },
    //修改所在页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getEmailList();
    },
    //获取某行然后操作
    handleEdit(index, type){
      let names = ''
      if(type === 1){names = '删除'}
      else if(type === 2){names = '批量已读'}
      else if(type === 3){names = '转储重要邮件'}
      this.$confirm('确定要进行['+names+']操作吗', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(index == null || index.length == 0){
          this.$message.warning("请选择至少一条数据!");
        }else{
          this.stateEmailList(index, type)
          this.pageSize = 10;
          this.currentPage = 1;
          this.getEmailList();
        }
      })
    },
    //获取详细信息
    emailGet(index){
      this.loadingEmail = true;
      getEmail({ids: index}).then((data) => {
        this.getEmailVo = data.data
        this.loadingEmail = false;
        this.dialogVisible = true;
      })
    },
    //列表接口集成
    getEmailList(){
      this.loadingTab = true;
      getEmailListApi({nowTab: this.currentPage, hasTab: this.pageSize}).then((data) => {
        this.total = data.total;
        this.emailTab = data.data;
        setTimeout(() => {
           this.loadingTab = false;
        }, 500)
      })
    },
    //删除、状态变更集成接口
    stateEmailList(row, type){
      let ids = [];
      if(typeof row == "string"){
        ids.push(row)
      }else{
        ids = row
      }
      stateEmailListApi({mineEmilId: ids, type: type}).then((data) => {
        this.$message({message: data.textMsg, type: 'success'});
      })
    }
  },
  created() {
    //首次请求
    this.getEmailList();
  }
}
</script>

<style scoped>

</style>
