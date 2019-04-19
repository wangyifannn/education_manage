<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <screenfull class="right-menu-item hover-effect" />
      </template>
      <span style="position: relative;top: -16px;">欢迎您：{{!!introduction?roleName[introduction]:""}}&nbsp;<span style="color: cornflowerblue;">{{name}}</span></span>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="avatar || userNoImg"
            class="user-avatar"
          >
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span
              style="display:block;"
              @click="showDialog"
            >个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span
              style="display:block;"
              @click="logout"
            >{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      top="10vh"
      width="50%"
      :before-close="handleClose"
    >
      <MyTwoColumForm
        :form="form"
        ref="adduserForm"
        :formData="formData"
        :formItem="formItem"
        @submit="submit"
      > </MyTwoColumForm>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";

import API from "@/api/api_user.js";
import { getField, getFormField, getSearchField } from "@/assets/json/index.js";
import { getPageSize, px2rem, rem2px } from "@/plugins/util.js";
import { setTimeout } from "timers";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  computed: {
    ...mapGetters(["sidebar", "name", "avatar", "device", "introduction"])
  },
  data() {
    var form = {
      showFormBorder: false,
      title: "用户管理-添加",
      ref: "twocolumform",
      showTitle: false,
      showUploadImg: false,
      showImg: false,
      showMp4: false,
      showDownloadPath: false,
      title: "",
      ref: "adduserForm",
      showTitle: false,
      showUploadImg: true,
      labelWidth: px2rem(520),
      labelPositon: "right",
      width: "90%",
      style: "notprepend",
      column: 1,
      hasSubmit: true,
      imgPath: "",
      submitText: "提交",
      cancleText: "取消"
    };
    return {
      form: form,
      dialogTitle: "添加用户",
      dialogVisible: false,
      formItem: [],
      formData: {},
      roleName: ["", "admin", "校长", "教务", "教师", "学员", "会员", "粉丝"],
      userNoImg: require("@/assets/img/noImg.png")
    };
  },
  created() {
    this.formInit();
  },
  methods: {
    formInit() {
      this.formItem = getFormField("user", "item");
      this.formItem[1].rules = [
        { required: false, message: "请选择班级", trigger: "blur" }
      ];
      this.$store.dispatch("GetUserInfo").then(res => {
        let userInfo = res.data.data;
        this.formItem[1].disabled = false;
        if (userInfo.roleid <= 4) {
          this.getClassList(this.formItem[1], {}, "");
          this.formItem[1].rules = [];
          if (userInfo.roleid <= 2) {
            this.formItem[0].disabled = false;
          }
        } else {
          this.getClassList(this.formItem[1], {}, "student");
          this.formItem[0].disabled = true;
          this.formItem[1].disabled = true;
        }
        this.formData = !!userInfo ? userInfo : getFormField("user", "data");
      });
    },
    handleClose(done) {
      done();
    },
    // 添加数据
    showDialog() {
      this.formInit();
      this.dialogTitle = "编辑个人信息";
      this.type = "updateUserInfo";
      this.dialogVisible = true;
    },
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
      });
    },
    // 提交数据
    submit() {
      window.sessionStorage.setItem("responseType", "json");
      var submitParams = this.formData;
      API[this.type](submitParams).then(res => {
        //权限不足
        if (!!res && res.code === 20011) {
          this.$message({
            message: res.message + ",请重新登录",
            type: !!res && res.code === 20000 ? "success" : "warning"
          });
          return;
        }
        this.$notify({
          title: "提示",
          message: res.message,
          type: !!res && res.code === 20000 ? "success" : "warning"
        });
        if (!!res && res.code === 20000) {
          this.dialogVisible = false;
          var that = this;
          setTimeout(function() {
            if (!!res.message && res.message === "修改成功") {
              if (
                that.formData.id ===
                JSON.parse(sessionStorage.getItem("access-user")).id
              ) {
                that.$notify({
                  title: "提示",
                  message: "当前登录用户信息已修改，请重新登录",
                  type: "warning",
                  duration: 5000
                });
              }
            }
          }, 1000);
        }
      });
    },
    getClassList(obj, params, type) {
      var config = {
        page: 1,
        size: 50,
        classesid: !!params && !!params.classesid ? params.classesid : "",
        name: "",
        teacherid: !!params && !!params.teacherId ? params.teacherId : "",
        createtime: ""
      };
      window.sessionStorage.setItem("responseType", "json");
      API.findClassList(config)
        .then(res => {
          if (!!res && res.code === 20000) {
            if (type === "student") {
              obj.options = [];
            } else {
              obj.options = [
                {
                  value: "",
                  label: "全部"
                }
              ];
            }
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

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
