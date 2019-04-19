<template>
  <div class="margin-top:20px;">
    <MyTwoColumForm
      :form="form"
      ref="myform"
      :fullscreenLoading="fullscreenLoading"
      :defaultMsg="form.content"
      :formData="formData"
      @imgPath="getImgPath"
      @uploadPath="getMp4Path"
      :formItem="formItem"
      @submit="submit"
    > </MyTwoColumForm>
  </div>
</template>
<script>
import { getField, getFormField, getSearchField } from "@/assets/json/index.js";
import { getPageSize, px2rem, rem2px } from "@/plugins/util.js";
import { setTimeout } from "timers";
import API from "@/api/api_course.js";
export default {
  name: "createCourse",
  data() {
    // 表单配置
    var form = {
      isLeft: true,
      showFormBorder: false,
      title: "课程管理-创建",
      ref: "courseCreateForm",
      showTitle: false,
      showUE: true,
      showUploadImg: true,
      showImg: true,
      showMp4: true,
      showDownloadPath: false,
      labelWidth: px2rem(500),
      labelPositon: "left",
      width: "90%",
      style: "notprepend",
      column: 1,
      hasSubmit: true,
      istop100: false,
      content: "",
      imgPath: "",
      uploadPath: "",
      submitText: "提交",
      cancleText: "取消"
    };
    return {
      fullscreenLoading: false,
      form: form,
      formItem: [],
      formData: {}
    };
  },
  computed: {
    getClassOptionsVal() {
      return this.formData.classesId;
    }
  },
  watch: {
    getClassOptionsVal(val) {
      if (!!val && !!val.teacherid) {
        this.getTeacherList(this.formItem[4], {
          userid: !!val && val.teacherid ? val.teacherid : ""
        });
      }
    }
  },
  created() {
    this.formInit();
    this.getData();
    if (!!this.$route.query.id) {
      this.getArticleDetail();
    }
  },
  methods: {
    formInit(row) {
      this.formItem = getFormField("courseCreate", "item");
      this.getSortList(this.formItem[2]);
      this.formData = !!row ? row : getFormField("courseCreate", "data");
      this.getClassList(this.formItem[3]);
      if (
        this.$route.path === "/event/editor" ||
        this.$route.path === "/event/create"
      ) {
        this.formItem[2].rules = [];
        this.formItem[3].rules = [];
        this.formItem[4].rules = [];
        this.formItem[2].show = false;
        this.formItem[3].show = false;
        this.formItem[4].show = false;
      } else if (
        this.$route.path === "/experience/editor" ||
        this.$route.path === "/experience/create"
      ) {
        this.formItem[2].rules = [];
        this.formItem[3].rules = [];
        this.formItem[4].rules = [];
        this.formItem[2].show = false;
        this.formItem[3].show = false;
        this.formItem[4].show = false;
      } else if (
        this.$route.path === "/course/editor" ||
        this.$route.path === "/course/create"
      ) {
        this.formItem[2].show = true;
        this.formItem[3].show = true;
        this.formItem[4].show = true;
        this.formItem[2].rules = [
          {
            required: true,
            message: "请选择科目",
            trigger: "blur"
          }
        ];
        this.formItem[3].rules = [
          {
            required: true,
            message: "请选择班级",
            trigger: "blur"
          }
        ];
        this.formItem[4].rules = [
          {
            required: true,
            message: "主讲教师不能为空,请选择班级将自动匹配到相应的主讲教师",
            trigger: "blur"
          }
        ];
      }
    },
    getImgPath(val) {
      this.form.imgPath = !!val ? val.replace(/\\/g, "/") : "";
    },
    getMp4Path(val) {
      this.form.uploadPath = !!val ? val.replace(/\\/g, "/") : "";
    },
    // 提交数据
    submit() {
      window.sessionStorage.setItem("responseType", "json");
      var a = this.formData.imgPath;
      this.formData.imgPath = !!a ? a.replace(/\\/g, "/") : "";
      var params = this.formData;

      params.articleType =
        this.$route.path === "/event/editor" ||
        this.$route.path === "/event/create"
          ? "5"
          : this.$route.path === "/experience/editor" ||
            this.$route.path === "/experience/create"
          ? "4"
          : this.$route.path === "/course/editor" ||
            this.$route.path === "/course/create"
          ? "2"
          : "";
      params.classesId = !!params.classesId ? params.classesId.id : "";
      params.video = this.form.uploadPath;
      params.imgUrl = this.form.imgPath;
      var subparams = {
        article: params,
        articleContent: {
          content: params.content
        }
      };
      API.addAPI(subparams).then(res => {
        this.$message({
          message: res.message,
          type: !!res && res.code === 20000 ? "success" : "warning"
        });
        //权限不足
        if (!!res && res.code === 20000) {
          this.dialogVisible = false;
          var that = this;
          setTimeout(function() {
            that.$router.go(-1);
          }, 1000);
        }
      });
    },
    getData() {
      this.fullscreenLoading = true;
      if (!!this.$route.query.id) {
        this.formData = this.$route.query;
        this.form.imgPath = this.$route.query.img_url;
        this.form.uploadPath = this.$route.query.video;
        this.formData.articleType = !!this.$route.query.article_type
          ? this.$route.query.article_type
          : "";
      }
      var that = this;
      setTimeout(() => {
        that.fullscreenLoading = false;
      }, 100);
    },
    getArticleDetail() {
      API.findArticleDetail({ id: this.$route.query.id }).then(res => {
        if (!!res && res.code === 20000) {
          this.form.content = !!res.data.content ? res.data.content : "";
        }
      });
      if (!!this.$route.query.userid) {
        this.getTeacherList(this.formItem[4], {
          userid: this.$route.query.userid
        });
      }
    },
    getTeacherList(obj, params) {
      var config = {
        page: 1,
        roleid: "4",
        teacherid: "",
        loginName: "",
        userName: "",
        phone: "",
        createtime: "",
        classesId: "",
        id: !!params && params.userid ? params.userid : "",
        size: 20
      };
      API.findUserList(config)
        .then(res => {
          if (!!res && res.code === 20000) {
            obj.options = [];
            for (var i = 0; i < res.data.rows.length; i++) {
              if (res.data.rows[i].id === config.id) {
                obj.options.push({
                  value: res.data.rows[i].id,
                  label: res.data.rows[i].userName,
                  id: res.data.rows[i].id,
                  name: res.data.rows[i].id
                });
              }
            }
            this.formData.userid = res.data.rows[0].id;
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
    getClassList(obj) {
      var config = {
        page: 1,
        size: 50,
        classesid: "",
        name: "",
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
                value: res.data.rows[i],
                label: res.data.rows[i].name,
                id: res.data.rows[i].id,
                name: res.data.rows[i].id
              });
            }
            if (!!this.formData.classesId) {
              for (var i = 0; i < this.formItem[3].options.length; i++) {
                if (
                  this.formItem[3].options[i].id === this.formData.classesId
                ) {
                  this.formData.classesId = this.formItem[3].options[i];
                }
              }
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
    },
    getSortList(obj) {
      var config = {
        page: 1,
        size: 100
      };
      // 添加查询字段
      API.findSortList(config)
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
</style>