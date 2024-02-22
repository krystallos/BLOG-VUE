<template>
  <div>
    <div class="topDiv">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-input v-model="blosTitle" placeholder="您的文章标题"></el-input>
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
      <div style="float: left;">
        <el-button type="primary" plain @click="updateWriteBlos">保存文章</el-button>
      </div>
    </div>
    <div style="margin-bottom: 25px;"></div>
  </div>
</template>

<script>

  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { goNewMineBlosTopApi, getWriteMineBlosApi, updateWriteMineBlosApi } from '@/api/writeBlos'

  export default {
    name: 'writeBlosConfig',
    components: { Editor, Toolbar },
    props: ['ids'],
    data () {
      return {
        blosIds: this.ids,
        blosTitle: '',
        selectValue: '',
        centImg: '',
        selectOptions: [],
        fileList: [],
        editor: null,
        html: '',
        toolbarConfig: {
          excludeKeys : [
            "group-video",
            "emotion"
          ]
        },
        editorConfig: {
          placeholder: '请输入内容...'
        },
        mode: 'default',
      }
    },
    methods: {
      onCreated(editor) {
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
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
      getWriteBlos(){
        getWriteMineBlosApi({
          actId: this.blosIds
        }).then((data) => {
          let {content, clobTitle, actType } = data.data;
          this.blosTitle = clobTitle;
          this.html = content;
          this.selectValue = actType;
        })
      },
      updateWriteBlos(){
        if(this.blosTitle == null || this.blosTitle == ''){this.$message.warning("请撰写标题"); return;}
        if(this.editor.getText() == null || this.editor.getText() == ''){this.$message.warning("请撰写内容"); return;}
        if(this.selectValue == null || this.selectValue == ''){this.$message.warning("请选择所属文章分类"); return;}
        let simlContent = this.editor.getText().substring(0,130)  + "...";
        updateWriteMineBlosApi({
          ids: this.blosIds,
          actTitle: this.blosTitle,
          content: this.html,
          liteCont: simlContent,
          actType: this.selectValue
        }).then((data) => {
          if(data.code == 200){
            this.$message.success(data.textMsg);
          }
        })
      }
    },
    created() {
      this.goBlosTag();
      this.getWriteBlos();
    },
    beforeDestroy() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy() // 组件销毁时，及时销毁编辑器
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
