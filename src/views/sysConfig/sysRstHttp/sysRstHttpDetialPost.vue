<template>
  <div v-loading="loadingTab">
    <span style='font-size: 20px;font-weight: 600;'>基本结构</span>
    <div style="margin-top: 10px;">
      <el-row :gutter="24" style="margin-bottom: 10px;">
        <el-col :span="6">
          <el-input :disabled="disBoolean" v-model="postType" placeholder="请选择接口类型">
            <el-select :disabled="disBoolean" v-model="postType" slot="prepend" placeholder="请选择">
              <el-option label="POST" value="POST"></el-option>
              <el-option label="GET" value="GET"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
              <el-option label="HEAD" value="HEAD"></el-option>
              <el-option label="LINK" value="LINK"></el-option>
              <el-option label="LOCK" value="LOCK"></el-option>
            </el-select>
            <template slot="append">接口类型</template>
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-input :disabled="disBoolean" v-model="postUrl" placeholder="请输入接口地址">
            <template slot="prepend">接口地址</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-input :disabled="disBoolean" v-model="dataType" placeholder="请选择数据格式">
            <el-select :disabled="disBoolean" v-model="dataType" slot="prepend">
              <el-option label="none" value="none"></el-option>
              <el-option label="form-data" value="form-data"></el-option>
              <el-option label="w-xxx-from-urlencoded" value="w-xxx-from-urlencoded"></el-option>
              <el-option label="json" value="json"></el-option>
              <el-option label="xml" value="xml"></el-option>
              <el-option label="raw" value="raw"></el-option>
              <el-option label="binary" value="binary"></el-option>
            </el-select>
            <template slot="append">数据格式</template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-input :disabled="disBoolean" v-model="postName" placeholder="请输入接口名称">
            <template slot="prepend">接口名称</template>
          </el-input>
        </el-col>
        <el-col :span="5" v-if="disType == 1">
          <el-input :disabled="disBoolean" v-model="createName">
            <template slot="prepend">创建用户</template>
          </el-input>
        </el-col>
        <el-col :span="5" v-if="disType == 1">
          <el-input :disabled="disBoolean" v-model="updateDate">
            <template slot="prepend">更新时间</template>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 15px;">
      <!-- 富文本内容 -->
      <div style="margin-top: 10px;">
        <el-row :gutter="24" style="margin-bottom: 10px;">
          <el-col :span="24">
            <span style='font-size: 20px;font-weight: 600;'>头部参数 (Params/Header)</span>
            <Editor
                style="height: 100px; overflow-y: hidden;border: 1px solid #e5e5e5;"
                v-model="params"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
            />
          </el-col>
        </el-row>
      </div>

      <div style="margin-top: 10px;">
        <el-row :gutter="24" style="margin-bottom: 10px;">
          <el-col :span="10">
            <span style='font-size: 20px;font-weight: 600;'>请求</span>
            <Editor
                style="height: 500px; overflow-y: hidden;border: 1px solid #e5e5e5;"
                v-model="inpBody"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
            />
          </el-col>
          <el-col :span="14">
            <span style='font-size: 20px;font-weight: 600;'>响应</span>
            <Editor
                style="height: 500px; overflow-y: hidden;border: 1px solid #e5e5e5;"
                v-model="outBody"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
            />
          </el-col>
        </el-row>
      </div>
      <!-- 富文本内容 -->
    </div>
    <div style="float: right;" v-if="disType == 2 || disType == 3">
      <el-button type="primary" icon="el-icon-edit" @click="savePost()"> 保存 </el-button>
    </div>
  </div>
</template>

<script>

  import { getRstApiDetialApi, saveRstApiDetialApi } from '@/api/sysRstHttpApi'
  import { Editor } from '@wangeditor/editor-for-vue'

  export default {
    name: 'sysRstHttpDetialPost',
    props: ['dialogPostVisible', 'postIds', 'projectId', 'type'],
    components: { Editor },
    data () {
      return {
        postId: this.postIds,
        projectIds: this.projectId,
        loadingTab: false,//加载
        disType: this.type,
        disBoolean: false,

        postType: '',
        postUrl:'',
        postName:'',
        params:'',
        inpBody:'',
        outBody:'',
        dataType:'',
        createName:'',
        updateDate:'',
        editorConfig: {
          placeholder: '请输入内容...',
        },
        editor: null,
        editorIn: null,
        editorOut: null,
        mode: 'default',
      }
    },
    methods: {
      //详情接口集成
      getRstApiDetial(){
        this.loadingTab = true;
        getRstApiDetialApi({ids: this.postId }).then((data) => {
          setTimeout(() => {
            this.postType = data.data.postType;
            this.postUrl = data.data.postUrl;
            this.postName = data.data.postName;
            this.params = data.data.params;
            this.inpBody = data.data.inpBody;
            this.outBody = data.data.outBody;
            this.dataType = data.data.dataType;
            this.createName = data.data.createName;
            this.updateDate = data.data.updateDate;
            this.loadingTab = false;
          }, 500)
        })
      },
      savePost(){
        this.loadingTab = true;
        saveRstApiDetialApi({
          ids: this.postId,
          projectId: this.projectIds,
          postType: this.postType,
          postUrl: this.postUrl,
          postName: this.postName,
          params: this.params,
          inpBody: this.inpBody,
          outBody: this.outBody,
          dataType: this.dataType
        }).then((data) => {
          setTimeout(() => {
            if(data.code == 200){
              this.$message.success(data.textMsg);
              this.$emit("update:dialogPostVisible", false);
            }
            this.loadingTab = false;
          }, 500)
        })
      },
      onCreated(editor) {
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        if(this.disType == 1){
          editor.disable();
        }
      },
    },
    mounted() {
      if(this.disType == 1){
        this.disBoolean = true;
      }
      if(this.disType == 1 || this.disType == 2){
        this.getRstApiDetial();
      }
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }
  }

</script>
<style src="@wangeditor/editor/dist/css/style.css">

</style>
