<template>
  <div>
    <div
      class="main-page"
      v-loading="fullscreenLoading"
    >
      <el-row class="alignleft fontbold">
        将邀请函发送给：
      </el-row>
      <el-row>
        <el-radio-group v-model="radioType">
          <el-radio :label="2">选择班级</el-radio>
          <el-radio :label="1">选择用户</el-radio>
        </el-radio-group>
      </el-row>
      <el-row
        :gutter="24"
        style="width:100%;margin: 0 auto;margin-top: 10px;"
        class="lineheight28 alignleft bordershow"
        v-for="(item,index) in itemInfo"
        :key="index"
        v-show="item.radioType===radioType"
      >
        <el-col
          :span="2"
          class="alignright"
        >
          {{item.label}}:
        </el-col>
        <el-col :span="22">
          <el-radio
            v-model="item.radioVal"
            v-for="(itemradio,ind) in item.radio"
            :key="ind"
            :label="itemradio"
          >{{itemradio}}</el-radio>
          <el-select
            v-show="item.radioVal!== item.radio[0]"
            v-model="item.optionsArr"
            :multiple="item.radioType == '2'?false:true"
            filterable
            remote
            :remote-method="index===0?remoteMethodClass:index===1?remoteMethodAffair:index===2?remoteMethodTeacher:remoteMethodStudent"
            placeholder="请选择或输入相关名称"
            :loading="loading"
            @focus="item.radioType == '2'?focus:''"
          >
            <el-option
              v-for="myitem in item.options"
              :key="myitem.value"
              :label="myitem.label"
              :value="myitem.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        style="margin:50px 0px;"
      >
        <el-button
          size="small"
          type="danger"
          @click="publishSubmit"
        >提交</el-button>
        <i style="margin:0px 20px;"></i>
        <el-button
          v-show="$route.matched[this.$route.matched.length - 1].name.indexOf('-') !=-1"
          @click="$router.go(-1)"
        >返回</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import API from "@/api/api_course.js";
let _ = require("lodash");
export default {
  data() {
    return {
      loading: false,
      fullscreenLoading: false,
      radioType: 2,
      itemInfo: [
        {
          label: "班级",
          radio: ["全部班级", "选择班级"],
          options: [{ value: "2班", label: "2班" }],
          radioVal: "全部班级",
          radioType: 2,
          optionsArr: [],
          optionsAllArr: []
        },
        {
          label: "教务",
          radio: ["全部教务", "选择教务"],
          options: [],
          radioVal: "选择教务",
          optionsArr: [],
          radioType: 1,
          remoteItem: "",
          optionsAllArr: []
        },
        {
          label: "教师",
          radio: ["全部教师", "选择教师"],
          options: [{ value: "li教师", label: "li教师" }],
          radioVal: "选择教师",
          optionsArr: [],
          radioType: 1,
          remoteItem: "",
          optionsAllArr: []
        },
        {
          label: "学员",
          radio: ["全部学员", "选择学员"],
          options: [
            { value: "杨洋", label: "杨洋" },
            { value: "郑爽", label: "郑爽" }
          ],
          radioVal: "选择学员",
          optionsArr: [],
          radioType: 1,
          remoteItem: "",
          optionsAllArr: []
        }
      ]
    };
  },
  computed: {
    getRadioValue0() {
      return this.itemInfo[0].radioVal;
    },
    getClassOptionsVal() {
      return this.itemInfo[0].optionsArr;
    },
    getRadioValue1() {
      return this.itemInfo[1].radioVal;
    },
    getRadioValue2() {
      return this.itemInfo[2].radioVal;
    },
    getRadioValue3() {
      return this.itemInfo[3].radioVal;
    }
  },
  watch: {
    getRadioValue0(val) {
      if (val === "全部班级") {
        this.getUserOptionData(
          "",
          { classesId: "", apiType: "all" },
          "this.itemInfo[0].optionsAllArr",
          "arr"
        ); //全部班级相关人员
      }
    },
    getClassOptionsVal(val) {
      if (!!val) {
        this.getUserOptionData(
          "",
          { classesId: val, apiType: "all" },
          "this.itemInfo[0].optionsAllArr",
          "arr"
        ); //获取所有关联班级的人员openid
      }
    },
    getRadioValue1(val) {
      if (val === "全部教务") {
        this.getUserOptionData(
          "3",
          { apiType: "all" },
          "this.itemInfo[1].optionsAllArr",
          "arr"
        ); //教务
      } else {
        this.getUserOptionData("3", {}, this.itemInfo[1]); //教务
      }
    },
    getRadioValue2(val) {
      if (val === "全部教师") {
        this.getUserOptionData(
          "4",
          { apiType: "all" },
          "this.itemInfo[2].optionsAllArr",
          "arr"
        ); //教师
      } else {
        this.getUserOptionData("4", {}, this.itemInfo[2]); //教师
      }
    },
    getRadioValue3(val) {
      if (val === "全部学员") {
        this.getUserOptionData(
          "5",
          { apiType: "all" },
          "this.itemInfo[3].optionsAllArr",
          "arr"
        ); //学员
      } else {
        this.getUserOptionData("5", {}, this.itemInfo[3]); //学员
      }
    }
  },
  created() {
    this.getOptionVal();
    this.getUserOptionData(
      "",
      { classesId: "", apiType: "all" },
      "this.itemInfo[0].optionsAllArr",
      "arr"
    ); //全部班级相关人员
  },
  methods: {
    focus(event) {
      this.getOptionVal();
    },
    getOptionVal() {
      this.getClassList(this.itemInfo[0], "");
      this.getUserOptionData("3", {}, this.itemInfo[1]); //教务
      this.getUserOptionData("4", {}, this.itemInfo[2]); //教师
      this.getUserOptionData("5", {}, this.itemInfo[3]); //学员
    },
    publishSubmit() {
      var allUserOpenIdArr;
      if (this.radioType === 2) {
        //选择班级
        allUserOpenIdArr = this.itemInfo[0].optionsAllArr;
      } else {
        //选择用户
        allUserOpenIdArr = _.union(
          this.itemInfo[1].radioVal === "全部教务"
            ? this.itemInfo[1].optionsAllArr
            : this.itemInfo[1].optionsArr,
          this.itemInfo[2].radioVal === "全部教师"
            ? this.itemInfo[2].optionsAllArr
            : this.itemInfo[2].optionsArr,
          this.itemInfo[3].radioVal === "全部学员"
            ? this.itemInfo[3].optionsAllArr
            : this.itemInfo[3].optionsArr
        ); //将三个数组合并为一个数组且数组去重
      }
      var params = {
        openidList: allUserOpenIdArr
      };
      params = $.extend(params, this.$route.query);
      this.fullscreenLoading = true;
      API.sendInfo(params).then(res => {
        this.fullscreenLoading = false;
        this.$notify({
          title: "提示",
          duration: "1000",
          message: res.message,
          type: !!res && res.code === 20000 ? "success" : "error"
        });
      });
    },
    remoteMethodAffair(query) {
      if (query !== "") {
        this.loading = true;
        this.getUserOptionData("3", { userName: query }, this.itemInfo[1]); //教务
        setTimeout(() => {
          this.loading = false;
          this.itemInfo[1].options = this.itemInfo[1].options.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.itemInfo[1].options = [];
      }
    },
    remoteMethodTeacher(query) {
      if (query !== "") {
        this.loading = true;
        this.getUserOptionData("4", { userName: query }, this.itemInfo[2]); //教师
        setTimeout(() => {
          this.loading = false;
          this.itemInfo[2].options = this.itemInfo[2].options.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.itemInfo[2].options = [];
      }
    },
    remoteMethodStudent(query) {
      if (query !== "") {
        this.loading = true;
        this.getUserOptionData("5", { userName: query }, this.itemInfo[3]); //学员
        setTimeout(() => {
          this.loading = false;
          this.itemInfo[3].options = this.itemInfo[3].options.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.itemInfo[3].options = [];
      }
    },
    remoteMethodClass(query) {
      if (query !== "") {
        this.loading = true;
        this.getClassList(this.itemInfo[0], query);
        setTimeout(() => {
          this.loading = false;
          this.itemInfo[0].options = this.itemInfo[0].options.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.itemInfo[0].options = [];
      }
    },
    /*
    getUserOptionData()函数参数说明
    *roleid表示查询的用户类型
    *params表示接口请求及接口判断的相关参数
    *obj表示最后要将接口返回的数据赋值的对象
    *objType用来区分对象类型是arr还是obj类型，从而赋值不同的数据格式
    */
    getUserOptionData(roleid, params, obj, objType) {
      var config = {
        apiType: !!params.apiType ? params.apiType : "",
        page: !!params.apiType && params.apiType === "all" ? "" : "1",
        roleid: !!roleid ? roleid : "",
        teacherid: "",
        classesId: !!params.classesId ? params.classesId : "",
        loginName: "",
        userName: !!params.userName ? params.userName : "",
        phone: "",
        createtime: "",
        size: !!params.apiType && params.apiType === "all" ? "" : "10"
      };
      this.fullscreenLoading = true;
      API.findUserList(config)
        .then(res => {
          if (!!res && res.code === 20000) {
            var objArr = [];
            if (objType === "arr") {
              objArr.length = 0;
              for (var i = 0; i < res.data.length; i++) {
                if (!!res.data[i].openid) {
                  objArr.push(res.data[i].openid);
                }
              }
              switch (obj) {
                case "this.itemInfo[0].optionsAllArr":
                  this.itemInfo[0].optionsAllArr = !!objArr ? objArr : [];
                  break;
                case "this.itemInfo[1].optionsAllArr":
                  this.itemInfo[1].optionsAllArr = !!objArr ? objArr : [];
                  break;
                case "this.itemInfo[2].optionsAllArr":
                  this.itemInfo[2].optionsAllArr = !!objArr ? objArr : [];
                  break;
                case "this.itemInfo[3].optionsAllArr":
                  this.itemInfo[3].optionsAllArr = !!objArr ? objArr : [];
                  break;
                default:
                  break;
              }
            } else {
              obj.options = [];
              for (var i = 0; i < res.data.rows.length; i++) {
                if (!!res.data.rows[i].openid) {
                  obj.options.push({
                    value: res.data.rows[i].openid,
                    label: res.data.rows[i].userName,
                    id: res.data.rows[i].id,
                    name: res.data.rows[i].id
                  });
                }
              }
            }
            this.fullscreenLoading = false;
          } else {
            this.$message({
              type: !!res && res.code === 20000 ? "success" : "warning",
              message: res.message
            });
            if (!!res && res.code === 20011) {
              var that = this;
              setTimeout(() => {
                sessionStorage.clear();
                that.$router.push({ path: "/login" });
              }, 3000);
            }
          }
          this.fullscreenLoading = false;
        })
        .catch(err => {
          this.fullscreenLoading = false;
        });
    },
    getClassList(obj, name) {
      var config = {
        page: 1,
        size: 50,
        classesid: "",
        name: name,
        teacherid: "",
        createtime: ""
      };
      // 添加查询字段
      API.findClassList(config)
        .then(res => {
          this.resCode = res.code;
          if (!!res && res.code === 20000) {
            obj.options = [];
            for (var i = 0; i < res.data.rows.length; i++) {
              obj.options.push({
                value: res.data.rows[i].id,
                label: res.data.rows[i].name,
                id: res.data.rows[i].id,
                name: res.data.rows[i].id
              });
            }
          } else {
            this.$message({
              type: !!res && res.code === 20000 ? "success" : "warning",
              message: res.message
            });
            if (!!res && res.code === 20011) {
              //登录已过期
              sessionStorage.removeItem("access-user");
              sessionStorage.removeItem("token");
              var that = this;
              setTimeout(function() {
                that.$router.push({ path: "/login" });
              }, 2000);
              return;
            }
          }
          this.fullscreenLoading = false;
        })
        .catch(err => {
          this.fullscreenLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.publish .el-select.el-select--medium {
  width: 91%;
  margin: 10px 0px 0px 108px;
}
.bordershow {
  border: 1px solid lightgray;
  padding: 21px;
}
</style>
