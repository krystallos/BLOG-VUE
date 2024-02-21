<template>
  <div>
    <!-- 标题-->
    <el-input
      v-model="title"
      :disabled="true">
    </el-input>
    <div style="padding-top: 15px;"></div>
    <!-- 富文本-->
    <div class="editorDiv">
      <div>
        <Editor
          style="height: 500px; overflow-y: hidden;"
          v-model="html"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
        />
      </div>
    </div>
    <!-- 评论-->
    <div style="margin-top: 15px;">
        <div>
          <el-input placeholder="发表你的意见" v-model="speak">
            <el-button slot="append" size="medium" @click="sendComment">提交</el-button>
          </el-input>
        </div>
        <div style="margin-top: 15px;"></div>
        <div class="pl" v-for="(item,i) in speakUserList" :key="i">
          <el-divider></el-divider>
          <div>
            <img src="@/assets/static_images/2b.jpg" style="width: 45px;height: 45px;">
            <span style="color: green;font-weight: 600;">{{item.sayPsnName}} 于</span>
            <span style="color: darkblue;font-weight: 600;"> {{item.createDate}} 说到:</span>
          </div>
          <div style="font-weight: 600;padding-top: 5px;">
            {{item.sayCenter}}
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import { getErrBugApi, sayErrFromBugApi, getSayErrFromBugApi } from '@/api/sysMessage';
  import { Editor } from '@wangeditor/editor-for-vue'

  export default {
    name: 'getSysMessageErr',
    props: ['ids'],
    components: { Editor },
    data(){
      return{
        errIds: this.ids,
        title: '',
        editor: null,
        html: '',
        editorConfig: {
          placeholder: '请输入内容...',
          readOnly: true ,
        },
        mode: 'default',
        /* 评论区*/
        speak: '',
        speakUserList: [],
      }
    },
    methods: {
      onCreated(editor) {
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      },
      /* 提交评论*/
      sendComment(){
        if(this.speak == null || this.speak.length == 0){
          this.$message.warning("至少说两句吧");
          return;
        }
        sayErrFromBugApi({sayCenter: this.speak, errId: this.errIds}).then((data) => {
          if(data.code == 200){
            this.speak = '';
            this.$message.success(data.textMsg);
            this.getSayErrOne()
          }
        })
      },
      /* 获取评论*/
      getSayErrOne(){
        getSayErrFromBugApi({ids: this.errIds}).then((data) => {
          if(data.code == 200){
            this.speakUserList = data.data;
          }else{
            this.$message.error(data.textMsg);
            this.speakUserList = [];
          }
        })
      }
    },
    mounted() {
      /* 获取页面详细信息*/
      getErrBugApi({ids: this.errIds}).then((data) => {
        let {sysErrMsg , sysSayErrMsg} = data.data
        this.title = sysErrMsg.errTitle
        this.html = sysErrMsg.errCenter
        this.speakUserList = sysSayErrMsg
      })
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }
  }
</script>

<style src="@wangeditor/editor/dist/css/style.css" scoped>
  .editorDiv{
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .pl{

  }

</style>
