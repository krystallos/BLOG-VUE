<template>
  <div>
    <div style="margin: 30px;">
      <el-descriptions title="系统基本信息" border :column="3">
          <el-descriptions-item label="系统名称">{{systemInfo.systemName}}</el-descriptions-item>
          <el-descriptions-item label="系统类型">{{systemInfo.systemType}}</el-descriptions-item>
          <el-descriptions-item label="CPU型号">{{systemInfo.cpuName}}</el-descriptions-item>
          <el-descriptions-item label="内部IP">{{systemInfo.ip}}</el-descriptions-item>
          <el-descriptions-item label="启动时间">{{systemInfo.startTime}}</el-descriptions-item>
          <el-descriptions-item label="运行时长">{{(systemInfo.runtime / 1000 / 60 / 60).toFixed(2)}} 小时</el-descriptions-item>
      </el-descriptions>
    </div>
    <el-divider></el-divider>
    <div style="margin: 30px;">
      <el-descriptions title="内存占用信息" border :column="3">
          <el-descriptions-item label="系统总内存">{{systemMerony.allMemory}}</el-descriptions-item>
          <el-descriptions-item label="JVM总内存">{{systemMerony.memoryMax}}</el-descriptions-item>
          <el-descriptions-item label="CPU总核心">{{systemMerony.cpuCode}} 核心</el-descriptions-item>
          <el-descriptions-item label="系统使用内存">{{systemMerony.useMemory}}</el-descriptions-item>
          <el-descriptions-item label="JVM使用内存">{{systemMerony.memoryUse}}</el-descriptions-item>
          <el-descriptions-item label="CPU系统占比">{{systemMerony.cpuSystemUse}}</el-descriptions-item>
          <el-descriptions-item label="系统空余内存">{{systemMerony.utilizationMemory}}</el-descriptions-item>
          <el-descriptions-item label="JVM空余内存">{{systemMerony.memoryUtilization}}</el-descriptions-item>
          <el-descriptions-item label="CPU用户占用">{{systemMerony.cpuUserUse}}</el-descriptions-item>
          <el-descriptions-item label="系统内存占比">{{systemMerony.memoryP * 100}} %</el-descriptions-item>
          <el-descriptions-item label="JVM内存占比">{{systemMerony.jvmP * 100}} %</el-descriptions-item>
          <el-descriptions-item label="CPU空余占比">{{systemMerony.cpuLeisure}}</el-descriptions-item>
      </el-descriptions>
    </div>
    <el-divider></el-divider>
    <div style="margin: 30px;">
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="systemDic"
        style="width: 100%">
        <el-table-column prop="dirName" label="磁盘名称" width="220"></el-table-column>
        <el-table-column prop="description" label="磁盘格式" width="220"></el-table-column>
        <el-table-column prop="fsType" label="磁盘类型" width="200"></el-table-column>
        <el-table-column prop="total" label="磁盘总量" width="200"></el-table-column>
        <el-table-column prop="used" label="磁盘使用量" width="200"></el-table-column>
        <el-table-column prop="userP" label="磁盘使用占比" width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ (scope.row.userP * 100).toFixed(2) }} %</span>
          </template>
        </el-table-column>
        <el-table-column prop="uuid" label="磁盘UUID"></el-table-column>
      </el-table>
      <div style="padding-top: 10px;"></div>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-divider></el-divider>
    <div id="main" style="margin-top: 20px;height: 450px;"></div>

    <div id="memory" style="margin-top: 20px;height: 450px;"></div>

  </div>
</template>

<script>
  import {selectDicApi, echartFindListApi, echartNetWorkListApi, getSystemConfigApi, getSystemMeronyApi } from '@/api/sysInfoConfig'
  import { getToken } from '@/utils/auth'

  import * as echarts from 'echarts';

  export default {
    name: 'sysInfoConfig',
    data () {
      return {
        total: 1,//总数
        pageSize: 10,//当前页展示条数
        currentPage: 1,//所在页数
        selectSysInfoList: [],//表格数据
        systemInfo: null, //系统数据
        systemMerony: null, //内存数据
        systemDic: [],  //磁盘信息
        systemId: null,   //系统ID
        loadingTab: false,//加载

        dialogVisible: false
      }
    },
    methods: {
      //获取当前日期
      getDay(){
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        return year + "-" + month + "-" + day;
      },
      //查询重置集成
      sendNach(){
        this.pageSize = 10;
        this.currentPage = 1;
        this.selectDic(null);
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.selectDic(null);
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.selectDic(null);
      },
      getSystemConfig(){
        getSystemConfigApi({}).then((data) => {
          this.systemInfo = data.data
          this.getSystemMerony(data.data.id);
          this.selectDic(data.data.id);
          this.echartFindList(data.data.id);
          this.echartNetWorkList(data.data.id);
        })
      },
      getSystemMerony(id){
        getSystemMeronyApi({systemId: id}).then((data) => {
          this.systemMerony = data.data
        })
      },
      selectDic(id){
        if(id != null){
          this.systemId = id;
        }else{
          id = this.systemId;
        }
        selectDicApi({systemId: id, nowTab: this.currentPage, hasTab: this.pageSize}).then((data) => {
          this.systemDic = data.data
        })
      },
      echartFindList(id){
        echartFindListApi({systemId: id}).then((data) => {
          let days = [];
          let datas = data.data;

          let cpuUserUse = [];
          let useMemory = [];
          let utilizationMemory = [];
          for(let a = 0; a < datas.length; a++){
            days.push(datas[a].createDate + '时');
            useMemory.push(datas[a].useMemory);
            utilizationMemory.push(datas[a].utilizationMemory);
          }
          this.drawMemory(days, useMemory, utilizationMemory);
        })
      },
      echartNetWorkList(id){
        echartNetWorkListApi({systemId: id}).then((data) => {
          let days = [];
          let datas = data.data;

          let txPer = [];
          let rxPer = [];
          for(let a = 0; a < datas.length; a++){
            days.push(datas[a].createDate + '时');
            txPer.push(datas[a].txPercent);
            rxPer.push(datas[a].rxPercent);
          }
          console.log(txPer,rxPer)
          this.drawChart(days, txPer, rxPer);
        })
      },
      drawMemory(days, useMemory, utilizationMemory){
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('memory'));
        var option = {
          title: {text: '内存性能监控'},
          tooltip: {trigger: 'axis'},
          xAxis: [{
              type: 'category',
              boundaryGap: false,
              data: days
          }],
          yAxis: [{
              type: 'value'
          }],
          legend: {data: ['使用内存', '剩余内存']},
          series: [
            {
              name: '使用内存',
              type: 'line',
              stack: 'Total',
              areaStyle: {},
              data: useMemory
            },
            {
              name: '剩余内存',
              type: 'line',
              stack: 'Total',
              areaStyle: {},
              data: utilizationMemory
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
      drawChart(days, txPer, rxPer){
        let datas = [];

        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('main'));

        var option = {
          title: {
              text: '24小时网络占用'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['网络上行(KB)', '网络下行(KB)']
          },
          xAxis: [{
              type: 'category',
              data: days
          }],
          yAxis: [{type: 'value'}
          ],
          series: [
            {
              name: '网络上行(KB)',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: txPer
            },
            {
              name: '网络下行(KB)',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: rxPer
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    },
    created() {
      this.getSystemConfig();
    }
  }
</script>

<style>
</style>
