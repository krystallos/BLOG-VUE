<template>

  <div>
    <!-- 顶部INPUT -->
    <div>
      <el-input v-model="errTitle" >
        <template slot="prepend">BUG标题：</template>
      </el-input>
    </div>
    <div style="padding-top: 10px;"></div>
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
              style="height: 500px; overflow-y: hidden;"
              v-model="html"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
          />
      </div>
    </div>
    <!-- 富文本内容 -->
    <div style="padding-top: 10px;"></div>
    <div style="float: left;">
    <span> BUG等级 </span>
    <el-select v-model="selectValue" placeholder="级别">
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    </div>
    <div style="float: right;">
      <el-button v-loading.fullscreen.lock="loadingSend" type="primary" icon="el-icon-message" @click="sendEmail()"> 提交BUG </el-button>
    </div>
  </div>


</template>

<script>
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { upErrFromBugApi } from '@/api/sysMessage'

  export default {
    name: 'sendSysMessageErr',
    props: {sendDialog:{type: Boolean, default: true}},
    components: { Editor, Toolbar },
    data() {
      return {
        loadingSend: false,//加载中(提交)
        errTitle: '',//标题
        selectValue: '一般',//下拉选值
        //下拉值
        selectOptions: [{
          value: '优先',
          label: '优先'
        },{
          value: '一般',
          label: '一般'
        },{
          value: '暂缓',
          label: '暂缓'
        }],
        editor: null,
        html: '',
        toolbarConfig: {
          excludeKeys : [
            "group-video",
            "insertTable",
            "todo",
            "emotion",
            "bgColor",
            "lineHeight",
            "group-image"
          ]
        },
        editorConfig: {
          placeholder: '请输入内容...',
        },
        mode: 'default',
      }
    },
    methods: {
      onCreated(editor) {
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      },
      sendEmail(){
        this.loadingSend = true;
        if(this.errTitle == null || this.errTitle == ''){
          this.$message.warning("请填写BUG标题!");
          this.loadingSend = false;
          return
        }
        upErrFromBugApi({
          errTitle: this.errTitle,
          errCenter: this.editor.getHtml(),
          isType: this.selectValue
        }).then((data) => {
          this.loadingSend = false;
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.$emit("update:sendDialog", false);
          }
        })
      }
    },
    mounted() {
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
