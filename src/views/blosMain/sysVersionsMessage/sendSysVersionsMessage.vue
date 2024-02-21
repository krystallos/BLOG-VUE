<template>

  <div>
    <!-- 顶部INPUT -->
    <div>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-input v-model="verName" >
            <template slot="prepend">迭代标题：</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-if="isUpType == 2">
        <div style="padding-top: 10px;"></div>
        <el-col :span="18">
          <el-input v-model="appUrl" >
            <template slot="prepend">迭代APP地址：</template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-select v-model="isMustUpdate" placeholder="是否强制更新">
              <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div style="padding-top: 10px;"></div>
      <el-row :gutter="24">
        <el-col :span="18">
          <div class="grid-content bg-purple">
            <el-input v-model="verVersion" >
              <template slot="prepend">迭代版本号：</template>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-date-picker
              type="date"
              v-model="verCreate"
              value-format="yyyy-MM-dd"
              placeholder="发布时间" >
            </el-date-picker>
          </div>
        </el-col>
      </el-row>
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
    <div style="float: right;">
      <el-button v-loading.fullscreen.lock="loadingSend" type="primary" icon="el-icon-message" @click="sendVersion()"> 提交迭代 </el-button>
    </div>
  </div>

</template>

<script>
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import {upVersionTextApi } from '@/api/sysVersions'

  export default {
    name: 'sendSysVersionsMessage',
    props: ['sendDialog' , 'upType'],
    components: { Editor, Toolbar },
    data(){
      return{
        verName: '',
        verCreate: '',
        verVersion: '',
        isMustUpdate: '0',
        appUrl: '',
        //下拉值
        selectOptions: [{
          value: '0',
          label: '不强制更新'
        },{
          value: '1',
          label: '强制更新'
        }],

        loadingSend: false,
        isUpType: this.upType,

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
      sendVersion(){
        this.loadingSend = true;
        upVersionTextApi({
          verName: this.verName,
          verType: this.editor.getHtml(),
          verCreate: this.verCreate,
          verVersion: this.verVersion,
          sysType: this.isUpType,
          appUrl: this.appUrl,
          isMustUpdate: this.isMustUpdate
        }).then((data) => {
          this.loadingSend = false;
          if(data.code == 200){
            this.$message.success(data.textMsg);
            this.$emit("update:sendDialog", false);
          }
        })
      }
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }
  }
</script>

<style src="@wangeditor/editor/dist/css/style.css" scoped>
  .el-row {
    margin: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

</style>
