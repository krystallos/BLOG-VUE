<template>
  <div>
    <div>
      <el-input placeholder="请输入中文名称" v-model="chineseName">
        <template slot="prepend">中译名</template>
      </el-input>
      <div style="margin-top: 10px;"></div>
      <el-input placeholder="请输入原作名称" v-model="originName">
        <template slot="prepend">原作名称</template>
      </el-input>
      <div style="margin-top: 10px;"></div>
      <el-input placeholder="请输入英文名称" v-model="englishName">
        <template slot="prepend">英译名</template>
      </el-input>
      <div style="margin-top: 10px;"></div>
      <el-input placeholder="请输入小说作者" v-model="authorName">
        <template slot="prepend">作者</template>
      </el-input>
      <div style="margin-top: 10px;"></div>
      <el-input placeholder="请输入插图作者" v-model="illustrationAuth">
        <template slot="prepend">插图作者</template>
      </el-input>
      <div style="margin-top: 10px;"></div>
      <el-input placeholder="请输入出版社" v-model="pressName">
        <template slot="prepend">出版社</template>
      </el-input>
      <div style="margin-top: 10px;"></div>
      <el-input placeholder="请输入文库" v-model="libilName">
        <template slot="prepend">文库</template>
      </el-input>
      <div style="margin-top: 10px;"></div>
      <el-select style="width: 100%;" v-model="getSelect" filterable multiple placeholder="请选择标签" ref='selectLable' @change="getLabel">
        <el-option
          v-for="item in options"
          :key="item.dicValue"
          :label="item.dicName"
          :value="item.dicValue">
        </el-option>
      </el-select>
      <div style="margin-top: 10px;"></div>
      <el-date-picker
        style="width: 30%;"
        type="date"
        v-model="chainBegin"
        value-format="yyyy-MM-dd"
        placeholder="连载开始时间" >
      </el-date-picker>
      <span> 至 </span>
      <el-date-picker
        style="width: 30%;"
        type="date"
        v-model="chainEnd"
        value-format="yyyy-MM-dd"
        placeholder="连载结束时间" >
      </el-date-picker>
      <div style="margin-top: 10px;"></div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入故事简介"
        v-model="storyMsg"
        maxlength="1300"
        show-word-limit
      >
      </el-input>
      <el-divider></el-divider>
      <el-upload
        class="upload-demo"
        action="/blosBoot/upload/fictionImgUpload.act"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :headers="headers"
        :file-list="fileList"
        :multiple="false"
        :limit="1"
        list-type="picture">
        <el-button size="small" type="primary">上传小说封面</el-button>
      </el-upload>
    </div>
    <div style="margin-top: 15px;">
      <el-button style="width: 100%;" type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
  import { fictionFileTabInfoApi, selectFileUtilDicNoTabApi, insertFictionFileApi, updateFictionFileApi } from '@/api/fictionTab'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'fictionEdit',
    props: ['sendDialog', 'openType', 'ids'],
    data(){
      return{
        fIds: this.ids,
        originName: '',
        englishName: '',
        chineseName: '',
        pressName: '',
        authorName: '',
        libilName: '',
        illustrationAuth: '',
        illustrationUrl: '',
        chainBegin: '',
        chainEnd: '',
        storyMsg: '',
        options: [],
        getSelect: [],
        getSelectName: [],
        fileList: [],
        openTabType: this.openType,
        headers: {
          "assessToken": getToken()
        },
      }
    },
    methods: {
      getLabel(val){
        this.getSelectName = [] //初始化数据
        for(let i=0;i<val.length;i++){
          this.options.find((item)=>{ //这里的options就是数据源
            if(item.dicValue == val[i]){
              this.getSelectName.push(item.dicName) //这里的label我改成了roleName
            }
          });
        }
      },
      fictionFileTabInfo(){
        fictionFileTabInfoApi({
          ids: this.fIds
        }).then((data) => {
          if(data.code == 200){
            let { chineseName,englishName,originName,authorName,illustrationAuth,pressName,libilName,chainBegin,chainEnd,storyMsg,illustrationUrl,tagVo,allTag } = data.data;
            this.authorName = authorName;
            this.originName = originName;
            this.chineseName = chineseName;
            this.englishName = englishName;
            this.illustrationAuth = illustrationAuth;
            this.pressName = pressName;
            this.libilName = libilName;
            this.chainBegin = chainBegin;
            this.chainEnd = chainEnd;
            this.storyMsg = storyMsg;
            this.options = allTag;
            this.storyMsg = storyMsg;
            this.storyMsg = storyMsg;
            this.fileList.push({
              name: chineseName,
              url: this.$hostURL + illustrationUrl
            })
            let dicValue = [];
            tagVo.forEach((item)=>{
                dicValue.push(item.dicValue)
            })
            this.getSelect = dicValue;
          }
        })
      },
      selectFileUtilDicNoTab(){
        selectFileUtilDicNoTabApi({}).then((data) => {
          if(data.code == 200){
            this.options = data.data
          }
        })
      },
      handleRemove() {
        this.fileList = [];
        this.illustrationUrl = '';
      },
      handleSuccess(response, file, fileList){
        this.$message.success("上传成功");
        this.illustrationUrl = response.data.dateStr + "/" + response.data.ids
      },
      handleSubmit(){
        console.log(this.openTabType)
        if(this.chineseName == null || this.chineseName == ''){this.$message.warning("请填写译名");return}
        if(this.originName == null || this.originName == ''){this.$message.warning("请填写原作名称");return}
        if(this.authorName == null || this.authorName == ''){this.$message.warning("请填写作者名称");return}
        if(this.illustrationAuth == null || this.illustrationAuth == ''){this.$message.warning("请填写插图作者名称");return}
        if(this.pressName == null || this.pressName == ''){this.$message.warning("请填写出版社名称");return}
        if(this.libilName == null || this.libilName == ''){this.$message.warning("请填写文库名称");return}
        if(this.chainBegin == null || this.chainBegin == ''){this.$message.warning("请填写连载开始时间");return}
        console.log(this.openTabType)
        if(this.openTabType == 1){
          this.update();
        }else{
          this.insert();
        }
      },
      insert(){
        insertFictionFileApi({
          originName:this.originName,
          englishName:this.englishName,
          chineseName:this.chineseName,
          pressName:this.pressName,
          authorName:this.authorName,
          illustrationAuth:this.illustrationAuth,
          libilName:this.libilName,
          chainBegin:this.chainBegin,
          chainEnd:this.chainEnd,
          tagId:this.getSelect.join(),
          tagName:this.getSelectName.join(),
          storyMsg:this.storyMsg,
          illustrationUrl:this.illustrationUrl
        }).then((data) => {
          if(data.code == 200){
            this.$emit("update:sendDialog", false);
            this.$message.success(data.textMsg)
          }
        })
      },
      update(){
        updateFictionFileApi({
          ids: this.fIds,
          originName:this.originName,
          englishName:this.englishName,
          chineseName:this.chineseName,
          pressName:this.pressName,
          authorName:this.authorName,
          illustrationAuth:this.illustrationAuth,
          libilName:this.libilName,
          chainBegin:this.chainBegin,
          chainEnd:this.chainEnd,
          tagId:this.getSelect.join(),
          tagName:this.getSelectName.join(),
          storyMsg:this.storyMsg,
          illustrationUrl:this.illustrationUrl
        }).then((data) => {
          if(data.code == 200){
            this.$emit("update:sendDialog", false);
            this.$message.success(data.textMsg)
          }
        })
      }
    },
    mounted() {
      //修改
      if(this.openTabType == 1){
        this.fictionFileTabInfo();
      }else{
        this.selectFileUtilDicNoTab();
      }
    }
  }

</script>

<style>
</style>
