<template>
  <div>
    <MyTwoColumForm
      :form="form"
      ref="myform"
      :formData="formData"
      :formItem="formItem"
      @submit="submit"
    > </MyTwoColumForm>
  </div>
</template>

<script>
import { getField, getFormField, getSearchField } from "@/assets/json/index.js";
import { getPageSize, px2rem, rem2px } from "@/plugins/util.js";
import { setTimeout } from "timers";
import API from "@/api/api_user.js";
export default {
  name: "towColumForm",
  props: {
    formUpdateData: {
      type: Object,
      default: function() {
        return {
        };
      }
    }
  },
  data() {
    // 表单配置
    var form = {
      isLeft: true,
      showFormBorder: false,
      title: "活动管理-创建",
      ref: "twocolumform",
      showTitle: false,
      showUploadImg: true,
      showImg: false,
      showMp4: false,
      showDownloadPath: false,
      labelWidth: px2rem(500),
      labelPositon: "right",
      width: "90%",
      style: "notprepend",
      column: 2,
      hasSubmit: true,
      istop100: true,
      imgPath: "",
      submitText: "提交",
      cancleText: "取消"
    };
    return {
      form: form,
      formItem: [],
      formData: {}
    };
  },

  created() {
    this.formInit();
  },
  methods: {
    formInit() {
      this.formItem = getFormField("event", "item");
      this.formData = !!this.formUpdateData ? this.formUpdateData : getFormField("event", "data");
    },
    // 提交数据
    submit() {
      window.sessionStorage.setItem("responseType", "json");
      var a = this.formData.imgPath;
      this.formData.imgPath = !!a ? a.replace(/\\/g, "/") : "";
      this.$emit("submitFromData", this.formData);
    }
  }
};
</script>
