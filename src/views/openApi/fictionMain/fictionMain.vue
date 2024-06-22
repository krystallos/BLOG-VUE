<template>
  <div class="mainDiv" v-loading="loading">
    <div class="topDiv">
      <el-menu default-active="2" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1" disabled>
          <img src="@/assets/static_images/wdnm.png" class="topImageDiv">
        </el-menu-item>
        <el-menu-item index="2" @click="selectChange(null)">全部小说</el-menu-item>
        <el-menu-item index="3" @click="selectChange(1)">已完结</el-menu-item>
        <el-menu-item index="4" @click="selectChange(2)">未完结</el-menu-item>
        <el-submenu index="5">
          <template slot="title">更多功能</template>
          <el-menu-item index="5-1"><router-link to="/login">回到主站</router-link></el-menu-item>
          <el-menu-item index="5-2"><router-link to="/404">AI词库</router-link></el-menu-item>
          <el-menu-item index="5-3"><router-link to="/setu">爬虫图床</router-link></el-menu-item>
          <el-menu-item index="5-4"><router-link to="/selectImage">识图工具</router-link></el-menu-item>
          <el-menu-item index="5-5"><router-link to="/openApiDoc">接口文档工具</router-link></el-menu-item>
        </el-submenu>
        <el-menu-item index="6" style="float: right;">
          <el-input v-model="chineseName" placeholder="请输入小说标题">
            <el-button slot="append" @click="selectChange(null)" icon="el-icon-search"></el-button>
          </el-input>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="topMsgDiv">
      <h2>FictionBook： 小说站</h2>
    </div>
    <div class="fictionDiv">
      <div class="container">
          <div class="column" v-for="(column,index) in columns" :key="index">
            <div
              class="item"
              v-for="(item,i) in column.columnArr"
              :key="i"
            >
              <div @click="openFiction(item.ids)">
                <el-image
                  class="imageDiv"
                  :src="$hostURL + '/fictionImg/' + item.illustrationUrl"
                  fit="contain">
                </el-image>
                <div class="imageSpan">
                  <span>[EPUB]{{item.chineseName}}</span>
                </div>
                <div style="margin: 10px 16px;">
                  <el-tag v-if="item.tagName != ''" v-for="tagItem in item.tagName.split(',')" style="margin: 3px;" size="mini">{{tagItem}}</el-tag>
                </div>
                <div class="imageMessage">
                  <div>
                    <span>作者: {{item.authorName}}</span>
                  </div>
                  <div>
                    <span>连载时间: {{item.chainBegin}} 至 {{item.chainEnd == null? '未完结' : item.chainEnd}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      <div class="bottButton">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[4, 8, 12]"
          :page-size="pageSize"
          :pager-count="5"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

  import { fictionFileNoPageApi } from '@/api/openApi/fictionMain'

  export default {
    name: 'fictionMain',
    data() {
      return {
        chineseName: '',
        isEnd: null,

        contentArr: [],
        columns: [],
        arrIndex:[],
        loading:false,
        contentArr2:[],

        total: 1,
        currentPage: 1,
        pageSize: 18,
      };
    },
    methods: {
      //查询
      selectChange(value) {
        this.currentPage = 1;
        this.isEnd = value;
        this.fictionFileNoPage();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.fictionFileNoPage();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.fictionFileNoPage();
      },
      openFiction(value){
        const routeData = this.$router.resolve({
          path: '/fictionDetial',
          query: {
            ids: value,
            type: "view",
            modelId: this.cuurentNodeKey,
            readOnly: true,
            isFullScreen: true
          }
        })
        window.open(routeData.href, '_blank')
      },
      fictionFileNoPage(){
        this.loading = true;
        fictionFileNoPageApi({
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          chineseName: this.chineseName,
          isEnd: this.isEnd
        }).then((data) => {
          if(data.code == 200){
            this.total = data.total;
            this.contentArr = [];
            this.contentArr2 = [];
            this.columns = [];
            this.arrIndex = [];
            let item = data.data;
            let list = [];
            for(let a=0;a<data.data.length;a++){
              list.push({
                height: 200,
                ids: item[a].ids,
                illustrationUrl: item[a].illustrationUrl,
                chineseName: item[a].chineseName,
                authorName: item[a].authorName,
                chainBegin: item[a].chainBegin,
                chainEnd: item[a].chainEnd,
                tagName: item[a].tagName == null ? "": item[a].tagName,
                top: ""
              })
            }
            this.contentArr = list;
            this.init(data.total);
            this.loading = false;
          }
        })
      },
      getMinHeight(arr){
        let a = []
        for (let i = 0; i < arr.length; i++) {
          a.push(parseInt(arr[i].height)+parseInt(arr[i].top))
        }
        return Math.min.apply(null,a)
      },
      getMinIndex(val){
        for (let i = 0; i < this.columns.length; i++) {
          let height = this.columns[i].columnArr[this.columns[i].columnArr.length-1].height
          let top = this.columns[i].columnArr[this.columns[i].columnArr.length-1].top
          if(parseInt(height)+parseInt(top)==val){
            this.arrIndex.push(i)
          }
        }
      },

      init(value) {
        // 根据可视区域的宽度判断需要几列
        let cWidth = document.documentElement.clientWidth || document.body.clientWidth;
        if(cWidth < 850){
          return
        }
        this.columns = []
        let contentLen = this.contentArr.length
        // 假设图片宽度为250px
        let cLen = Math.floor((cWidth/250)-1)
        if(value != null && value < cLen){
          cLen = value;
        }
        // 初始化每一列的第一行元素
        for (let i = 0; i < cLen; i++) {
          this.contentArr[i].top = 0 //预设距离顶部值为0
          this.columns.push({columnArr:[this.contentArr[i]]})
        }

        // 对剩余元素的判断，应该放到哪一列
        for (var index = cLen; index < contentLen; index++) {

          this.arrIndex = []
          let arr = [] //找到高度最小的一列，可能有多个
          let minHeight = 0 //高度最小的一列的高度
          let pushIndex = 0  //高度最小的一列所在位置的索引

          for (let i = 0; i < this.columns.length; i++) {
            arr.push({
              height:this.columns[i].columnArr[this.columns[i].columnArr.length-1].height,
              top:this.columns[i].columnArr[this.columns[i].columnArr.length-1].top
            })
          }

          minHeight = this.getMinHeight(arr)
          this.getMinIndex(minHeight)
          if(this.arrIndex.length>0){
            pushIndex = Math.min.apply(null,this.arrIndex) //出现高度一样的，去索引最小的
          }
          this.contentArr[index].top = minHeight +20
          this.columns[pushIndex].columnArr.push(this.contentArr[index])

        }
      },
    },
    mounted() {
      this.fictionFileNoPage();
      window.onresize = () =>{
        this.init(null)
      }
    },
  }

</script>

<style scoped>

  .mainDiv {
    min-width: 800px;
  }

  .topDiv {

  }

  .topImageDiv {
    width: 40px;
    height: 40px;
  }

  .el-menu-item.is-active {
    border: transparent !important;
  }

  .topMsgDiv {
    margin: 15px 30px 0 30px;
  }

  .fictionDiv {
    margin: 20px;
  }

  .container {
    margin: 15px 10% 0 15px;
    padding-bottom: 45px;
    display: flex;
    justify-content: space-around;
    background-color: #f9f9f9;
    transition: all 0.5s ease-in-out;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .item {
    width: 230px;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s ease-in-out;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 5px;
  }

  .item:hover {
      transform: scale(1.04);
  }

  .imageDiv {
    width: 250px;
    height: 300px;
    padding: 15px;
  }

  .imageSpan {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 18px;
    font-weight: 600;
    padding: 0 25px;
  }

  .imageMessage {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 0 18px;
    margin-bottom: 5px;
  }

  .bottButton {
    height: 100px;
    margin-top: 15px;
    bottom: 30px;
  }

</style>
