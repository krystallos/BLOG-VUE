<template>
  <div>
    <div style="text-align: center;margin-top: 15px;">
      <span style="font-size: 25px;font-weight: 500;color: rgba(0, 0, 0, .9)">马尾港潮汐表</span>
      <br>
      <div style="padding-top: 10px;"/>
      <span style="font-size: 15px;font-weight: 500;color: rgba(0, 0, 0, .9);">{{new Date}}</span>
    </div>
    <div id="water" style="margin-top: 20px;height: 450px;"></div>
    <div style="width: 100%;margin-left: 6%;">
      <el-col :span="3" v-for="item in weatherList" class="groupBox">
        <el-card class="box-card">
          <div class="text week">
            {{item.week}}
          </div>
          <div class="text">
            {{item.date}}
          </div>
          <div :class="[item.text == '大潮' ? 'maxDiff': 'seatext']">
            {{item.text}}
          </div>
          <div class="text">
            {{item.weather}}
          </div>
          <div class="text">
            {{item.low + '~' + item.high + '°'}}
          </div>
          <div class="text">
            {{item.wind + ' ' + item.windLevel}}
          </div>
        </el-card>
      </el-col>
    </div>
    <div style="margin-bottom: 30px;">
      <el-descriptions class="margin-top" :column="1"border>
          <el-descriptions-item>
            <template slot="label">
              赶海时间
            </template>
            <span style="font-size: 15px;font-weight: bold;">
              {{gotoSea}}
            </span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              鱼口时间
            </template>
            <span style="font-size: 15px;font-weight: bold;">
              {{fishTime}}
            </span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              潮高(峰值)
            </template>
            <span style="font-size: 15px;font-weight: bold;">
              {{hydrologicalHeight}}
            </span>
          </el-descriptions-item>
        </el-descriptions>
    </div>
  </div>
</template>

<script>

  import {getHydrologicalListApi, getWeatherListApi, getHydrologicalTimeApi} from '@/api/hydrologicalWeather'
  import * as echarts from 'echarts';

export default {
  name: 'hydrologicalWeather',
  data () {
    return {
      weatherList: [],
      gotoSea: '',
      fishTime: '',
      hydrologicalHeight: '',
    }
  },
  methods: {
    getHydrologicalTime(type){
      getHydrologicalTimeApi({type: type}).then((data) => {
        let newData = data.data;
        console.log(newData);
        let findList = '';
        for(let a=0;a<newData.length;a++){
          if(type == 1 || type == 2){
            findList += (newData[a].start + ' - ' + newData[a].end + '[ ' + newData[a].level + ' ] ，');
          }else{
            findList += (newData[a].start + ' - ' + newData[a].end + '[ ' + (newData[a].level / 100) + '米 ] ，');
          }
        }
        if(type == 1){
          this.fishTime = findList;
        }else if(type == 2){
          this.gotoSea = findList;
        }else{
          this.hydrologicalHeight = findList;
        }
      })
    },
    getWeatherList(){
      getWeatherListApi({}).then((data) => {
        this.weatherList = data.data;
      })
    },
    echartFindList(){
      getHydrologicalListApi({}).then((data) => {
        let days = [];
        let water = [];
        let datas = data.data;
        for(let a = 0; a < datas.length; a++){
          days.push(datas[a].t);
          water.push(datas[a].y / 100);
        }
        this.drawMemory(days, water);
      })
    },
    drawMemory(days, water){
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('water'));
      var option = {
        xAxis: {
          type: 'category',
          data: days,
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: water,
            type: 'bar'
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
  mounted() {
    this.echartFindList();
    this.getWeatherList();
    this.getHydrologicalTime(1);
    this.getHydrologicalTime(2);
    this.getHydrologicalTime(3);
  }
}
</script>

<style scoped>
  .groupBox {
    text-align: center;
    padding: 30px;
  }

  .box-card {
    border-radius: 5%;
  }

  .text {
    font-size: 15px;
    font-weight: 700;
    padding: 4px 0 0 0;
  }

  .seatext {
    font-size: 18px;
    font-weight: 500;
    padding: 4px 0 0 0;
  }

  .week {
    color: rgba(0,0,0,.4);
  }

  .maxDiff {
    font-size: 18px;
    font-weight: 500;
    padding: 4px 0 0 0;
    color: crimson;
  }

  .margin-top {
    margin: 0 auto;
    width: 85%;
  }

</style>
