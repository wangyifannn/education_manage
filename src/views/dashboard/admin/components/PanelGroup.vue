<template>
  <div>

    <el-row
      :gutter="40"
      class="panel-group"
    >
      <el-col
        :xs="12"
        :sm="12"
        :lg="6"
        class="card-panel-col"
      >
        <div
          class="card-panel"
          @click="handleSetLineChartData('newVisitis')"
        >
          <div class="card-panel-icon-wrapper icon-red">
            <svg-icon
              icon-class="schoolmaster"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">校长总数</div>
            <count-to
              :start-val="0"
              :end-val="schoolMasterNum"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :lg="6"
        class="card-panel-col"
      >
        <div
          class="card-panel"
          @click="handleSetLineChartData('newVisitis')"
        >
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon
              icon-class="affair"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">教务总数</div>
            <count-to
              :start-val="0"
              :end-val="affairsNum"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :lg="6"
        class="card-panel-col"
      >
        <div
          class="card-panel"
          @click="handleSetLineChartData('newVisitis')"
        >
          <div class="card-panel-icon-wrapper icon-D5CEE4">
            <svg-icon
              icon-class="peoples"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">教师总数</div>
            <count-to
              :start-val="0"
              :end-val="teacherNum"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :lg="6"
        class="card-panel-col"
      >
        <div
          class="card-panel"
          @click="handleSetLineChartData('messages')"
        >
          <div class="card-panel-icon-wrapper icon-B689B9">
            <svg-icon
              icon-class="student"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">学员总数</div>
            <count-to
              :start-val="0"
              :end-val="studentNum"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :lg="6"
        class="card-panel-col"
      >
        <div
          class="card-panel"
          @click="handleSetLineChartData('shoppings')"
        >
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon
              icon-class="vip"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">会员总数</div>
            <count-to
              :start-val="0"
              :end-val="vipNum"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :lg="6"
        class="card-panel-col"
      >
        <div
          class="card-panel"
          @click="handleSetLineChartData('shoppings')"
        >
          <div class="card-panel-icon-wrapper icon-orange">
            <svg-icon
              icon-class="fans"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">粉丝总数</div>
            <count-to
              :start-val="0"
              :end-val="fansNum"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :lg="6"
        class="card-panel-col"
      >
        <div
          class="card-panel"
          @click="handleSetLineChartData('purchases')"
        >
          <div class="card-panel-icon-wrapper icon-blue">
            <svg-icon
              icon-class="class"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">班级总数</div>
            <count-to
              :start-val="0"
              :end-val="theClassNum"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col
        :xs="12"
        :sm="12"
        :lg="6"
        class="card-panel-col"
      >
        <div
          class="card-panel"
          @click="handleSetLineChartData('purchases')"
        >
          <div class="card-panel-icon-wrapper icon-salmon">
            <svg-icon
              icon-class="course"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">课程总数</div>
            <count-to
              :start-val="0"
              :end-val="courseNum"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import API from "@/api/api_dashboard";
export default {
  components: {
    CountTo
  },
  data() {
    return {
      schoolMasterNum: 0,
      affairsNum: 0,
      teacherNum: 0,
      studentNum: 0,
      vipNum: 0,
      fansNum: 0,
      theClassNum: 0,
      courseNum: 0
    };
  },
  mounted() {
    this.getCountByRoleId(2);
    this.getCountByRoleId(3);
    this.getCountByRoleId(4);
    this.getCountByRoleId(5);
    this.getCountByRoleId(6);
    this.getFansSum();
    this.getClassSum();
    this.getCourseSum();
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
    getCountByRoleId(id, numPrams) {
      API.getCountByRoleId(id)
        .then(res => {
          switch (id) {
            case 2:
              this.schoolMasterNum = !!res ? res : 0;
              break;
            case 3:
              this.affairsNum = !!res ? res : 0;
              break;
            case 4:
              this.teacherNum = !!res ? res : 0;
              break;
            case 5:
              this.studentNum = !!res ? res : 0;
              break;
            case 6:
              this.vipNum = !!res ? res : 0;
              break;
            case 7:
              this.fansNum = !!res ? res : 0;
              break;
            default:
              break;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getClassSum() {
      API.findClassSum()
        .then(res => {
          this.theClassNum = !!res ? res : 0;
        })
        .catch(err => {
          this.theClassNum = 0;
        });
    },
    getFansSum() {
      API.findFansSum()
        .then(res => {
          this.fansNum = !!res ? res : 0;
        })
        .catch(err => {
          this.fansNum = 0;
        });
    },
    getCourseSum() {
      API.findCourseSum()
        .then(res => {
          this.courseNum = !!res ? res : 0;
        })
        .catch(err => {
          this.courseNum = 0;
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-blue {
        background: #88c6ff;
      }
      .icon-red {
        background: #f4516c;
      }
      .icon-D5CEE4 {
        background: #fc5c7e;
      }
      .icon-shopping {
        background: #34bfa3;
      }
      .icon-purple {
        background: #ea83d3;
      }
      .icon-orange {
        background: #ffcc40;
      }
      .icon-B689B9 {
        background: #c493be;
      }
      .icon-salmon {
        background: salmon;
      }
    }
    .icon-blue {
      color: #88c6ff;
    }
    .icon-B689B9 {
      color: #c493be;
    }
    .icon-salmon {
      color: salmon;
    }
    .icon-purple {
      color: #ea83d3;
    }
    .icon-orange {
      color: #ffcc40; //ffcc40
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-red {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3;
    }
    .icon-D5CEE4 {
      color: #fc5c7e;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
