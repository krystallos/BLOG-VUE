<template>

  <div>
    <!-- 顶部INPUT -->
    <div>
      <el-input v-model="intoPersonName" >
        <template slot="prepend">收件人邮箱：</template>
      </el-input>
      <div style="padding-top: 10px;"></div>
      <el-input v-model="title" >
        <template slot="prepend">邮件标题：</template>
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
    <span>是否重要邮件 </span>
    <el-select v-model="selectValue" placeholder="是否重要文件">
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    </div>
    <div style="float: right;">
      <el-button v-loading.fullscreen.lock="loadingSend" type="primary" icon="el-icon-message" @click="sendEmail(1)"> 发送邮件 </el-button>
      <el-button v-loading.fullscreen.lock="loadingSend" type="info" icon="el-icon-message" @click="sendEmail(2)" plain>存为草稿</el-button>
    </div>
  </div>


</template>

<script>
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { sendEmailApi } from '@/api/email'

  export default {
    name: 'sendMineEmail',
    props: {dialogSend:{type: Boolean, default: true}},
    components: { Editor, Toolbar },
    data() {
      return {
        loadingSend: false,//加载中(发送)
        intoPersonName: '',//收件人
        title: '',//标题
        selectValue: '0',//下拉选值
        //下拉值
        selectOptions: [{
          value: '0',
          label: '否'
        }, {
          value: '1',
          label: '是'
        }],
        ids: null,//邮件ID，是否用于草稿发送
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
      sendEmail(type){// 1是正常发送，2是保存到草稿箱
        this.loadingSend = true;
        if(this.intoPersonName == null || this.intoPersonName == ''){
          this.$message.warning("请填写收件人邮箱!");
          this.loadingSend = false;
          return
        }
        if(this.title == null || this.title == ''){
          this.$message.warning("请填写邮件标题!");
          this.loadingSend = false;
          return
        }
        sendEmailApi({
          intoPersonEmil: this.intoPersonName,
          title: this.title,
          content: this.editor.getHtml(),
          isLike: this.selectValue,
          type: type,
          ids: this.ids,
        }).then((data) => {
          this.loadingSend = false;
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.$emit("update:dialogSend", false);
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
