<template>

  <div>
    <!-- 顶部INPUT -->
    <div>
      <el-input
        v-model="fromPersonName"
        :disabled="true">
        <template slot="prepend">发件人：</template>
      </el-input>
      <div style="padding-top: 10px;"></div>
      <el-input
        v-model="intoPersonName"
        :disabled="true">
        <template slot="prepend">收件人：</template>
      </el-input>
      <div style="padding-top: 10px;"></div>
      <el-input
        v-model="title"
        :disabled="true">
        <template slot="prepend">标题：</template>
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
  </div>


</template>

<script>
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

  export default {
    name: 'getMineEmail',
    props: ['getEmailVo'],
    components: { Editor, Toolbar },
    data() {
      return {
        fromPersonName: '',//发件人
        intoPersonName: '',//收件人
        title: '',//标题
        emailVo: '',//邮件ID

        editor: null,
        html: '',
        toolbarConfig: {
          excludeKeys : [
            "group-video",
            "insertTable",
            "todo",
            "emotion",
            "bgColor",
            "lineHeight"
          ]
        },
        editorConfig: {
          placeholder: '请输入内容...',
          readOnly: true ,
        },
        mode: 'default',
      }
    },
    methods: {
      onCreated(editor) {
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      },
    },
    mounted() {
      let { content, fromPersonName, fromPersonEmil, intoPersonName, intoPersonEmil, title } = this.getEmailVo
      this.fromPersonName = fromPersonName + " [" + fromPersonEmil + "]";
      this.intoPersonName = intoPersonName + " [" + intoPersonEmil + "]";
      this.title = title;
      //必须延迟加载，否则会在组件前赋值v-model
      setTimeout(() => {
         this.html = content;
      }, 10)
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
