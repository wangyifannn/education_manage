<template>
  <div
    class="main-page rights-box"
    v-loading="fullscreenLoading"
  >
    <el-row
      :gutter="20"
      class="alignright"
      style="margin:0px 0px;"
    >
      <!-- <el-button
        size="small"
        type="danger"
        @click="preview"
      >预览</el-button> -->
      <i style="margin:0px 10px;"></i>
      <el-button
        size="small"
        type="danger"
        @click="gotoUrl()"
      >返回</el-button>
    </el-row>
    <div
      class="grid-content bg-purple"
      v-for="(item,index) in pageItem"
      :key="index"
    >
      <el-row class="alignleft">
        <img
          style="width:20px;height:auto;vertical-align:middle;"
          :src="item.imgIcon"
          alt="图片加载失败"
        > {{item.title}}
      </el-row>
      <el-row
        class="border-all-grey"
        :class="{ 'first-row': index===1}"
      >
        <template v-if=" !!item.radio && item.radio.length > 0 && index===0">
          <el-row class="rights-radio-bg">
            <el-radio-group v-model="item.radioValue">
              <el-radio
                v-for="(radioitem,index) in item.radio"
                style="margin:0px 10px;"
                :key="index"
                :label="radioitem.value"
                :disabled="radioitem.disabled"
              >{{radioitem.label}}</el-radio>
            </el-radio-group>
          </el-row>
        </template>
        <el-row
          v-if="index===1"
          :gutter="24"
          class="main-conent-input200"
        >
          <twoColumForm
            :formUpdateData="formUpdateData"
            @submitFromData="submitFromData"
          ></twoColumForm>
        </el-row>
      </el-row>
    </div>
    <el-row style="margin:50px 0px;"></el-row>
  </div>
</template>
<script>
import API from "@/api/api_event";
import twoColumForm from "@/views/event/twoColumForm";
import { getField, getFormField, getSearchField } from "@/assets/json/index.js";
export default {
  name: "templateUpdate",
  data() {
    return {
      formUpdateData: "",
      fullscreenLoading: false,
      key: Date.now(),
      pageItem: [
        {
          title: "风格设置",
          imgIcon: require("@/assets/img/rights/rights.png"),
          radio: [
            { label: "通知", name: "templateId", value: "1" },
            { label: "邀请", name: "templateId", value: "2" },
            { label: "公告", name: "templateId", value: "3" }
          ],
          radioValue: "3",
          formData: {
            buttonShow: false
          }
        },
        {
          title: "内容设置",
          imgIcon: require("@/assets/img/rights/operator.png"),
          radio: [],
          radioValue: "",
          formData: {
            buttonShow: false
          }
        }
      ]
    };
  },
  components: { twoColumForm },
  created() {
    this.getUpdataData();
    this.pageItem[0].radioValue = !!this.pageItem[0].radioValue
      ? this.pageItem[0].radioValue
      : "1";
  },
  methods: {
    refresh() {
      this.key = Date.now();
    },
    gotoUrl(path, query) {
      this.$router.push({
        path: !!path ? path : "/event/index",
        query: !!query ? query : { time: this.key }
      });
    },
    submitFromData(params) {
      this.fullscreenLoading = true;
      params.templateId = this.pageItem[0].radioValue;
      params.content = params.eventContent;
      API.addAPI(params).then(res => {
        this.fullscreenLoading = false;
        this.$message({
          message: res.message,
          type: !!res && res.code === 20000 ? "success" : "warning"
        });
        this.refresh();
        this.$router.push({ path: "/event/index", query: { time: this.key } });
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
      });
    },
    getUpdataData() {
      this.fullscreenLoading = true;
      this.formUpdateData = this.$route.query;
      this.pageItem[0].radioValue = this.$route.query.templateId;
      var that = this;
      setTimeout(() => {
        that.fullscreenLoading = false;
      }, 100);
    }
  }
};
</script>
<style>
.border-all-grey {
  border: 1px solid #ececec;
  padding: 10px 20px;
  margin-top: 10px;
  margin-bottom: 25px;
}
.rights-radio-bg {
  background: #ececec;
  height: 35px;
  line-height: 35px;
}
</style>