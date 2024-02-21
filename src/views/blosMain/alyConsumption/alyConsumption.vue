<template>
  <div>
    <div>
      <!-- 顶部按钮 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="order" placeholder="交易订单号"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="payPerson" placeholder="交易方"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="moneyOrder" placeholder="金额(可在金额前加入大小于号)"></el-input>
        </el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="payTime"
            type="year"
            placeholder="选择日期"
            format="yyyy"
            value-format="yyyy">
          </el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" plain @click="sendNach">搜索账单</el-button>
        </el-col>
        <el-col :span="2">
          <el-upload
            action="/blosBoot/upload/importExcl.act"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :multiple="false"
            :headers="headers"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button type="primary" plain>导入账单</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        v-loading="loadingTab"
        :data="appAlyTab"
        style="width: 100%">
        <el-table-column prop="order" label="订单号"></el-table-column>
        <el-table-column prop="payTime" label="交易时间" width="150px"></el-table-column>
        <el-table-column prop="payFrom" label="交易来源"></el-table-column>
        <el-table-column prop="payType" label="交易类型" width="150px"></el-table-column>
        <el-table-column prop="payPerson" label="交易方"></el-table-column>
        <el-table-column prop="commodity" label="商品名称"></el-table-column>
        <el-table-column prop="amount" label="金额" width="100px"></el-table-column>
        <el-table-column prop="incomeOrExpenditure" label="收支" width="100px"></el-table-column>
        <el-table-column prop="fundStatus" label="资金状态" width="100px"></el-table-column>
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

    <div style="margin-top: 20px;">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-date-picker
            v-model="year"
            type="year"
            placeholder="选择日期"
            format="yyyy"
            value-format="yyyy">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-switch
            v-model="outMoney"
            active-text="高于1000"
            inactive-text="低于1000">
          </el-switch>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" plain @click="echartConsumptionLeft">查询年-日趋月消费</el-button>
        </el-col>
      </el-row>
    </div>
    <div id="main" style="margin-top: 20px;height: 500px;"></div>

  </div>
</template>

<script>
  import {consumptionListApi, echartConsumptionLeftApi } from '@/api/alyConsumption'
  import { getToken } from '@/utils/auth'

  import * as echarts from 'echarts';

  export default {
    name: 'alyConsumption',
    data(){
      return{
        order: '',
        payPerson: '',
        moneyOrder: '',
        payTime: '',
        year: '',
        /* 表格 */
        loadingTab: false,
        appAlyTab: [],
        total: 1,
        currentPage: 1,
        pageSize: 10,
        /* 上传*/
        fileList: [],
        headers: {
          "assessToken": getToken()
        },
        /* 折线图*/
        monthDatas: [],
        /* 折线图切换 */
        outMoney: false
      }
    },
    methods: {
      handleRemove(file) {
        this.$message.warning(`已将${ file.name }移除上传列表`);
      },
      handleExceed(){
        this.$message.warning('单次文件上传限制一张');
      },
      handleSuccess(response){
        this.$message.success(response.textMsg);
      },
      //修改当前页数
      handleSizeChange(val) {
        this.pageSize = val;
        this.getAlyList();
      },
      //修改所在页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getAlyList();
      },
      getAlyList(){
        this.loadingTab = true
        if(this.payTime == null || this.payTime == ''){
          this.payTime = new Date().getFullYear() + '';
        }
        consumptionListApi({
          nowTab: this.currentPage,
          hasTab: this.pageSize,
          payPerson: this.payPerson,
          moneyOrder: this.moneyOrder,
          order: this.order,
          payTime: this.payTime,
        }).then((data) => {
          this.total = data.total;
          this.appAlyTab = data.data;
          setTimeout(() => {
             this.loadingTab = false;
          }, 1000)
        })
      },
      //搜索记录
      sendNach(){
        this.getAlyList();
      },
      echartConsumptionLeft(){
        if(this.year == null || this.year == ''){
          this.year = new Date().getFullYear() + '';
        }
        let orderTypes = '';
        orderTypes = this.outMoney
        this.monthDatas = [];
        echartConsumptionLeftApi({beginTime: this.year, orderType: orderTypes}).then((data) => {
          if(data.code == 200){
            let map = data.data;
            let valType = [];
            for(let a=1;a < 13;a++){
              let dayValue = [];
              for(let b=0;b<map[a].length;b++){
                dayValue.push(map[a][b])
              }
              let dub = {};
              dub.name = a + '月';
              dub.type = 'line';
              dub.data = dayValue;
              dub.areaStyle = {};
              this.monthDatas.push(dub);
            }
            this.drawChart();
          }
        })
      },
      drawChart(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('main'));
        let mSize = []
        for(let i=1; i<32;i++){
          mSize.push(i + "日");
        }
        let datas = this.monthDatas;
        // 指定图表的配置项和数据
        var option = {
          title: {
              text: '日趋月消费总图'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            }
          },
          legend: {
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: mSize
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: datas
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }

    },
    created() {
      this.getAlyList();
    },
    mounted() {
      this.echartConsumptionLeft();
    }
  }
</script>

<style>
</style>
