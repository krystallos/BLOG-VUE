<template>
  <div>
    <div class="topDiv">
      <el-row :gutter="24">
        <el-col :span="20">
          <el-input v-model="blosTitle" placeholder="您的文章标题"></el-input>
        </el-col>
        <el-col :span="4">
          <el-upload
            class="upload-demo"
            action="/blosBoot/upload/blosItemUpload.act"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
            :headers="headers"
            :multiple='false'
            :limit='1'
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <div class="centernDiv">
      <!-- 富文本内容 -->
      <div>
        <div style="border: 1px solid #ccc;">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 600px; overflow-y: hidden;"
            v-model="html"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
          />
        </div>
      </div>
      <!-- 富文本内容 -->
    </div>
    <div class="bottomDiv">
      <div style="float: right;">
        <div style="margin:20px 0 0 0;">
          <span> 是否随笔 </span>
          <el-radio-group v-model="state">
            <el-radio :label="1">博客</el-radio>
            <el-radio :label="2">随笔</el-radio>
          </el-radio-group>
        </div>
        <div style="margin:20px 0 0 0;">
        <span> 所属分类 </span>
          <el-select v-model="selectValue" placeholder="归类">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div style="float: left;margin:15px 0 0 0;">
        <el-button type="primary" plain @click="writeBlos">提交文章</el-button>
      </div>
    </div>
  </div>
</template>

<script>

  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { goNewMineBlosTopApi, writeMineBlosApi } from '@/api/writeBlos'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'writeBlos',
    components: { Editor, Toolbar },
    data () {
      return {
        keyTime: '',
        blosTitle: '',
        selectValue: '',
        state: 1,
        centImg: '',
        selectOptions: [],
        fileList: [],
        headers: {
          "assessToken": getToken()
        },
        editor: null,
        html: '',
        toolbarConfig: {
          excludeKeys : [
            "group-video",
            "emotion"
          ]
        },
        editorConfig: {
          placeholder: '请输入内容...',
          MENU_CONF: {
            // 配置上传图片
            uploadImage: {
              // 后端上传地址，必填
              server: "/blosBoot/upload/blosItemUpload.act",
              timeout: 30 * 1000, // 30s 超时时间
              fieldName: 'file',
              headers: { "assessToken": getToken() },
              //选择文件时的类型限制，默认为['image/*'] 如不想限制，则设置为 []
              allowedFileTypes: ['image/*'],
              metaWithUrl: false, // 参数拼接到 url 上
              maxFileSize: 50 * 1024 * 1024, //1g //设置大点 不然图片过大会报错
              // 上传完成回调
              customInsert(res, insertFn){
                insertFn(res.textMsg, "alt", res.textMsg)
              },
              // 上传错误，或者触发 timeout 超时
              onError(file, err, res) {
                this.$message.warning(err.message);
              },
            },
          },
        },
        mode: 'default',
      }
    },
    methods: {
      onCreated(editor) {
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错

        if(localStorage.getItem("blosItem")!==null){
          this.$confirm('发现上次未保存的文章，是否恢复?', '文章恢复', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            editor.setHtml(localStorage.getItem("blosItem"));
          }).catch(() => {
            localStorage.removeItem("blosItem");
          });
        }
        let msg = this.$notify;
        this.keyTime = setInterval(function (){
          if(editor.getText().length!==0){
              localStorage.removeItem("blosItem");
              localStorage.setItem("blosItem",editor.getHtml());
              msg.info({
                title: '文章自动保存',
                message: '已在'+ new Date().toLocaleTimeString() +'自动保存了一次'
              });
          }
        },120000);
      },
      handleRemove() {
        this.centImg = null;
        this.fileList = []
        this.$message.success('删除成功');
      },
      handleSuccess(res) {
        this.centImg = res.textMsg.replace('blosBoot/imgBlos/','');
        this.$message.success(res.reslutMsg);
      },
      goBlosTag(){
        goNewMineBlosTopApi({}).then((data) => {
          if(data.code == 200){
            let item = data.data;
            let tagVal = [];
            for(let a=0;a<item.length;a++){
              tagVal.push({
                value: item[a].ids,
                label: item[a].blosTypeName
              })
            }
            this.selectOptions = tagVal;
          }
        })
      },
      writeBlos(){
        if(this.blosTitle == null || this.blosTitle == ''){this.$message.warning("请撰写标题"); return;}
        if(this.centImg == null || this.centImg == ''){this.$message.warning("请上传头图"); return;}
        if(this.editor.getText() == null || this.editor.getText() == ''){this.$message.warning("请撰写内容"); return;}
        if(this.selectValue == null || this.selectValue == ''){this.$message.warning("请选择所属文章分类"); return;}
        let simlContent = this.editor.getText().substring(0,130)  + "...";
        writeMineBlosApi({
          actTitle: this.blosTitle,
          content: this.html,
          liteCont: simlContent,
          actType: this.selectValue,
          state: this.state,
          centImg: this.centImg
        }).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
            setTimeout(() => {
               this.$router.go(0)
            }, 1000)
          }
        })
      }
    },
    created() {
      this.goBlosTag();
    },
    beforeDestroy() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy(); // 组件销毁时，及时销毁编辑器
      clearInterval(this.keyTime);
    }
  }

</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<style scoped>
  .topDiv {
    margin-top: 10px;
  }

  .centernDiv {
    margin-top: 15px;
  }

  .bottomDiv {
    margin-top: 10px;
  }

</style>
