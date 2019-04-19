<template>
  <div class="main-page">
    <p class="fontsize20 fontbold">邀请函用户信息统计表</p>
    <countTable></countTable>
    <p class="fontsize20 fontbold">邀请函用户访问量统计</p>
    <countLine :chartData="lineChartData"></countLine>
  </div>
</template>
<script>
import { getPageSize, px2rem, rem2px } from "@/plugins/util.js";
import { setTimeout } from "timers";
import countTable from "@/views/event/countTable";
import countLine from "@/components/echartsLine";

export default {
  name: "count",
  components: { countTable, countLine },
  data() {
    return {
      newVisitis: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      },
      lineChartData: ""
    };
  },
  methods: {
  },
  created() {
    this.lineChartData = this.newVisitis;
  }
};
</script>
<style lang="scss" scoped>
</style>
