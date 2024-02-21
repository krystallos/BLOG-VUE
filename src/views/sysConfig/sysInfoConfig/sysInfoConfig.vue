<template>
  <div>
    <div>
      <!-- 顶部按钮 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-date-picker
            v-model="createDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" plain @click="sendNach">查询</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="selectSysInfoList"
        style="width: 100%">
        <el-table-column prop="timeMillis" label="更新步进"></el-table-column>
        <el-table-column prop="systemNum" label="系统名称" width="150px"></el-table-column>
        <el-table-column prop="cpuCode" label="CPU核心数">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.cpuCode }}核</span>
          </template>
        </el-table-column>
        <el-table-column prop="cpuUtilization" label="CPU总利用率">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.cpuUtilization }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="cpuSystemUse" label="CPU系统占用率">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.cpuSystemUse }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="cpuUserUse" label="CPU用户占用率">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.cpuUserUse }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="cpuLeisure" label="CPU闲置率">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.cpuLeisure }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="allMemory" label="总内存">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.allMemory }}GB</span>
          </template>
        </el-table-column>
        <el-table-column prop="utilizationMemory" label="剩余内存">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.utilizationMemory }}GB</span>
          </template>
        </el-table-column>
        <el-table-column prop="useMemory" label="使用内存">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.useMemory }}GB</span>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="170px"></el-table-column>
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

    <div id="main" style="margin-top: 20px;height: 450px;"></div>

    <div id="memory" style="margin-top: 20px;height: 450px;"></div>

  </div>
</template>

<script>
  import {selectSysInfoApi, echartFindListApi } from '@/api/sysInfoConfig'
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
        loadingTab: false,//加载

        dialogVisible: false,
        createDate: null
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
        this.selectSysInfo();
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.selectSysInfo();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.selectSysInfo();
      },
      //列表接口集成
      selectSysInfo(){
        if(this.createDate == null){
          this.createDate = getDay();
        }else{
          if(this.createDate.split("-").length == 3 && this.createDate.split("-")[2].length == 1){
            this.createDate = this.createDate.split("-")[0] + "-" + this.createDate.split("-")[1] + "-0" + this.createDate.split("-")[2]
          }
        }
        this.loadingTab = true;
        selectSysInfoApi({nowTab: this.currentPage, hasTab: this.pageSize, createDate: this.createDate}).then((data) => {
          this.total = data.total;
          this.selectSysInfoList = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      echartFindList(){
        echartFindListApi({}).then((data) => {
          let days = [];
          let echartDatas = [];
          let datas = data.data;

          let cpuUtilization = [];
          let cpuSystemUse = [];
          let cpuUserUse = [];
          let useMemory = [];
          let utilizationMemory = [];
          for(let a = 0; a < datas.length; a++){
            days.push(datas[a].createDate + '时');
            cpuUtilization.push(datas[a].cpuUtilization);
            cpuSystemUse.push(datas[a].cpuSystemUse);
            cpuUserUse.push(datas[a].cpuUserUse);
            useMemory.push(datas[a].useMemory);
            utilizationMemory.push(datas[a].utilizationMemory);
          }
          this.drawChart(days, cpuUtilization, cpuSystemUse, cpuUserUse);
          this.drawMemory(days, useMemory, utilizationMemory);
        })
      },
      drawChart(days, cpuUtilization, cpuSystemUse, cpuUserUse){
        let datas = [];

        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('main'));

        var option = {
          title: {
              text: '24小时系统占用数据'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['CPU利用率(%)', 'CPU系统使用率(%)', 'CPU用户使用率(%)']
          },
          xAxis: [{
              type: 'category',
              data: days
          }],
          yAxis: [{type: 'value'}
          ],
          series: [
            {
              name: 'CPU利用率(%)',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: cpuUtilization
            },
            {
              name: 'CPU系统使用率(%)',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: cpuSystemUse
            },
            {
              name: 'CPU用户使用率(%)',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: cpuUserUse
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
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
      }
    },
    created() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      this.createDate = year + "-" + month + "-" + day;
      this.selectSysInfo();
    },
    mounted() {
      this.echartFindList();
    }
  }
</script>

<style>
</style>
