<template>
  <div style="min-width: 1300px;" id="epub" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="header">
        <a href="/#/login">WDNMD-我带你们答</a>
        <a id="title">《{{title}}》</a>
        <div class="tool-box">
          <button id="showcatalog" @click="showCatalog">目录</button>
          <button id="fontsize" @click="fontSize--">字体变小</button>
          <button id="fontsize" @click="fontSize++">字体变大</button>
        </div>
    </div>
    <main>
      <div id="left-slide" style="background-color: rgb(246, 241, 231);height: 900px;" v-show="this.catalog" >
          <h4 style="background-color: rgb(246, 241, 231);">目录</h4>
          <ul id="catalogs">
            <li class="chapter" v-for="(item,index) in catalogs" :hrefs="item.href" :key="index" @click="jumpTo">
            {{item.title}}
            </li>
          </ul>
      </div>
      <div id="main-content">
          <div id="bookHere">
            <a id="pre" @click="prePage()">
              <i style="font-size: 60px;padding: 280px 0 0 30px;" class="el-icon-caret-left"></i>
            </a>
            <a id="next">
              <i style="font-size: 60px;padding: 280px 0 0 30px;" class="el-icon-caret-right"></i>
            </a>
          </div>
          <div style="width: 40%;margin: 0 auto;font-weight: 600;" id="percentage" v-show="bookAvailable">
            当前浏览进度：
            <el-progress :text-inside="true" :stroke-width="26" :percentage="Number((percentage*100).toFixed(0))"></el-progress>
          </div>
      </div>
    </main>
  </div>
</template>

<script>

  import ePub from 'epubjs'
  import { fictionUrlForEpubApi } from '@/api/openApi/fictionMain'

  export default {
    name:'book',
    data(){
      return {
        location:{percentageFromCfi(){
          return '...'
        }},
        fullscreenLoading: false,
        catalogs:[],
        catalog:false,
        title:'',
        book:{},
        rendition:{},
        percentage:0,
        id:0,
        themes:{fontSize(){return 0}},
        fontSize:16,
        method:"paginated",
        bookAvailable:false,
        cfi:null,
      }
    },
    watch: {
      fontSize: function(n){
        this.themes.fontSize(n+'px');
      },
    },
    methods:{
      //目录跳转
      async jumpTo(e){
        await this.rendition.display(e.target.getAttribute("hrefs")).then(()=>{
          this.percentage = this.location.percentageFromCfi(this.rendition.currentLocation().start.cfi)
        })
      },
      bindMove(){
        var that = this
        var box = document.getElementById('next')
        var y = 0
        var t = 0
        var isDown = false
        var ismove=false
        box.onmousedown = function(e){
          y = e.clientY;
          t = box.offsetTop
          isDown = true
          box.style.cursor = 'pointer'
        }
        box.onmousemove = function(e){
          if(isDown == false){
            return;
          }
          var ny = e.clientY;
          if(Math.abs(ny-y)>3)ismove=true
          box.style.top=t+ny-y+'px'
        }
        box.onmouseup = function(){
          isDown = false;
          box.style.cursor = 'default'
          if(ismove){
            ismove=false
          }else{
            that.nextPage()
          }
        }
      },
      async prePage(){
        if(this.rendition){
         await this.rendition.prev().then(()=>{
          this.percentage = this.location.percentageFromCfi(this.rendition.currentLocation().start.cfi)
         })
        }
      },
      async nextPage(){
        var that = this
        if(that.rendition){
          await that.rendition.next().then(()=>{
            that.percentage = that.location.percentageFromCfi(that.rendition.currentLocation().start.cfi)
          })
        }
      },
      showCatalog(){
        this.catalog=!this.catalog
      },
      initBook(){

      },
      read(obj){
        var that = this
        that.id = obj.ids;
        that.title = obj.fictionOriginName;
        that.book = ePub("/blosBoot/fictionFile/" + obj.fictionId + "/" + obj.fictionBookName)
        that.rendition = that.book.renderTo('bookHere',{
          flow: that.method,
          width:'100%',
          height:'700px',
        })
        that.themes = that.rendition.themes
        that.themes.register({"night":{body:{"background-color":"#0f1112","color":"#666"}},"day":{body:{"background-color":"rgb(246, 241, 231)","color":"#262626"}}})
        that.themes.fontSize(that.fontSize+'px');
        that.rendition.display()
        that.book.ready.then(()=>{
          var catalog = that.book.navigation.toc
          for(let item of catalog){
           that.catalogs.push({title:item.label,href:item.href})
          }
          return that.book.locations.generate()
        }).then(()=>{
          that.location = that.book.locations
          that.bookAvailable = true
          that.cfi = that.rendition.currentLocation().start.cfi
        })
        this.fullscreenLoading = false;
      },
      init(){
        this.id = this.$route.query.uid
      },
      fictionUrlForEpub(value){
        fictionUrlForEpubApi({ids:value}).then((data) => {
          if(data.code == 200){
            this.read(data.data)
          }
        })
      },
      //取URL
      urlHanlden(){
        let geturl = window.location.href;
        let getqyinfo = geturl.split('?');
        if(getqyinfo.length < 2){
          this.userKey == null;
          return;
        }
        let getqys = new URLSearchParams(getqyinfo[1]);
        let getqycode = getqys.get('ids');
        return getqycode;
      },
    },
    mounted(){
      this.fullscreenLoading = true;
      this.init()
      this.fictionUrlForEpub(this.urlHanlden());
      this.bindMove()
    }
}

</script>


<style scoped>
  ::-webkit-scrollbar{
    display:none;
  }
  #title{
    color: #262626;
  }
  .header{
    height: 64px;
    padding:12px;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
  }
  .header a{
    line-height: 40px;
    color: #42b983;
    font-weight: 700;
    margin-left: 30px;
  }
  .header .tool-box{
    display: flex;
  }
  .header .tool-box > button {
    display:inline-block;
    border: none;
    padding: 10px;
    color:#42b983;
    background-color: #fff;
    margin-left: 20px;
    font-size:16px;
    font-weight: 700;
    cursor: pointer;
  }

  #left-slide{
      width: 250px;
      float: left;
      box-sizing: border-box;
      border-right: 1px solid #d8d8d8;
      height: 791px;
      overflow: hidden;
  }
  #left-slide>h4{
    background-color: #ede7da;
    margin: 0;
    line-height: 50px;
    padding-left: 20px;
  }
  #left-slide #catalogs{
    height: 791px;
    color: #262626;
    padding: 0 10px;
    overflow-y:auto;
    overflow-x:hidden;
    background-color: rgb(246, 241, 231);

  }
  #left-slide #catalogs .chapter:hover{
    color: #2480d1;
    opacity: .7;
    transition: all .3s;
  }
  #left-slide #catalogs .chapter{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #d3d3d3;
   text-overflow: ellipsis;
   white-space: nowrap;
   cursor: pointer;
   font-weight: 400;
   font-size: 14px;
  }
  #main-content{
      overflow: hidden;
      height: 900px;
      background-color: #ede7da;
  }

  #bookHere{
      position: relative;
      width: 980px;
      margin: 0 auto;
      background-color: rgb(246, 241, 231);
      height: 710px;
      border-left: 1px solid #d8d8d8;
      border-right: 1px solid #d8d8d8;
      border-bottom: 1px solid #d8d8d8;
      margin-bottom: 30px;
      margin-top: 50px;
      user-select: none;
      font-size: 18px;
  }

  #bookHere #pre{
    left:0;
    width: 128px;
    height:128px;
    position: absolute;
    left:-138px;
    bottom:0px;
    cursor: pointer;
    background-color: #e7e2d6;
    height: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 10px;
  }

  #bookHere #next{
    position: absolute;
    right:-138px;
    width: 128px;
    height: 128px;
    background-color: #e7e2d6;
    height: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 10px;
  }
  #bookHere #next:hover{
    cursor: pointer;
  }
  #bookHere #percentage{
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translateX(100%);
    z-index: 2;

  }
  #bookHere #book-leaf{
    height: 20px;
    width: 80px;
    transform: translate(-100%,100%);
    background-color: #ede7da;
  }
  #bookHere #book-leaf .tria{
    float: left;
    height: 0;
    width:0;
    border: 10px solid transparent;
    border-left:10px solid #ede7da;
  }

  #bookHere #book-leaf:hover{
    cursor: pointer;
    transform: translate(-80%,100%);
  }
</style>
