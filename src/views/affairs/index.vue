<template>
  <div
    class="list main-page  user-list"
    v-loading="fullscreenLoading"
    element-loading-text="拼命加载中"
  >
    <el-row
      class="btn-group"
      :gutter="24"
    >
      <el-col
        :span="4"
        class="pull-left alignleft"
      >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus"
          :disabled="resCode === 502 ? true:false"
          @click="showDialog"
        >
          添加
        </el-button>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-delete"
          :disabled="resCode === 502 ? true:false"
          @click="deleteBatch"
        >
          删除
        </el-button>
      </el-col>
      <el-col
        :span="20"
        class="pull-right alignright"
      >
        <MySearch
          class="pull-right search"
          :formData="searchFormData"
          :formItem="searchFormItem"
          @submit="searchSubmit"
        >
        </MySearch>
      </el-col>
    </el-row>
    <MyTable
      size="mini"
      :stripe="false"
      :border="false"
      :multiple="true"
      :operation="operation"
      :column="column"
      :data="data"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :total="total"
      :showImgColumn="false"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @delete="deleteConfirm"
      @update="update"
      @resetPass="resetPass"
      @select="handleSelectionChange"
    >
    </MyTable>
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
    <MyConfirm
      ref="myconfirm"
      :type="confirmType"
      :title="confirmTitle"
      :content="confirmContent"
    >
    </MyConfirm>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import API from "@/api/api_user.js";
import { getField, getFormField, getSearchField } from "@/assets/json/index.js";
import { getPageSize, px2rem, rem2px } from "@/plugins/util.js";
import { setTimeout } from "timers";
import $ from "jquery";
export default {
  name: "userList",
  data() {
    // 表单配置
    var form = {
      showFormBorder: false,
      title: "教务管理-添加",
      showTitle: false,
      showUploadImg: false,
      showImg: false,
      showMp4: false,
      showDownloadPath: false,
      title: "",
      ref: "teacherForm",
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
    // 表格操作配置
    var operation = {
      nowPage: "userList",
      show: true,
      fixed: false,
      size: "mini",
      width: rem2px(px2rem(300)),
      minWidth: 300,
      label: "操作",
      btns: [
        {
          type: "text",
          size: "mini",
          content: "编辑",
          icon: "el-icon-edit-outline",
          handle: "update",
          class: "button-operator"
        },
        {
          type: "text",
          size: "mini",
          content: "删除",
          icon: "el-icon-delete",
          handle: "delete",
          class: "button-operator"
        },
        {
          type: "text",
          size: "mini",
          content: "重置密码",
          icon: "el-icon-refresh",
          handle: "resetPass",
          class: "button-operator"
        }
      ]
    };
    return {
      resCode: "",
      imgPath: "",
      // 加载loading初始化
      fullscreenLoading: false,
      confirmType: "warning",
      confirmTitle: "提示信息",
      confirmContent: "此操作将永久删除该数据, 是否继续?",
      dialogTitle: "添加教务",
      dialogVisible: false,
      multipleSelection: [],
      ids: null,
      form: form,
      operation: operation, // 操作按钮
      column: [],
      data: [],
      formItem: [],
      formData: {},
      pageSize: getPageSize(),
      currentPage: 1,
      total: 0,
      type: "saveTask",
      searchFormData: {},
      searchFormItem: [],
      initFormData: {
        id: "",
        roleid: "",
        userName: "",
        sex: "",
        passwd: "",
        phone: "",
        address: "",
        imgPath: ""
      }
    };
  },
  created() {
    this.fieldInit();
    this.formInit();
    this.searchFormInit();
    this.getData();
  },
  mounted() {
    this.resetForm();
    this.getClassList();
  },
  computed: {
    ...mapGetters(["classesId"])
  },
  methods: {
    resetPass(row) {
      // 重置密码
      this.formInitPass(row);
      this.dialogTitle = "重置密码";
      this.type = "resetPass";
      this.dialogVisible = true;
    },
    formInitPass(row) {
      this.formItem = getFormField("pass", "item");
      this.formData = getFormField("pass", "data");
      this.formData.loginPwd = "";
      this.formData.id = row.id;
    },
    // 每页显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    initFormDataFun() {
      this.initFormData = {
        id: "",
        userName: "",
        sex: "",
        passwd: "",
        phone: "",
        address: "",
        roleid: "3",
        imgPath: ""
      };
      this.formData = this.initFormData;
      if (this.formData.roleid <= 4) {
        this.formItem[1].rules = [];
      }
    },
    fieldInit() {
      var column = getField("teacher");
      column.forEach(item => {
        if (!!item.width && item.width != "auto") {
          item.width = rem2px(px2rem(item.width));
        }
      });
      this.column = column;
    },
    formInit(row) {
      this.formItem = getFormField("user", "item");
      this.formData = !!row ? row : getFormField("user", "data");
      this.formItem[0].disabled = true;
      this.getClassList(this.formItem[1]);
    },
    searchFormInit() {
      this.searchFormItem = getSearchField("teacher", "item");
      this.getClassList(this.searchFormItem[1], "search");
      this.searchFormData = getSearchField("teacher", "data");
      this.searchFormData.classesId = "";
    },
    // 添加数据
    showDialog() {
      this.formInit();
      this.dialogTitle = "添加教务";
      this.type = "addUser";
      this.initFormDataFun();
      this.formItem[4].rules = [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur"
        }
      ];
      this.formItem[4].show = true;
      this.dialogVisible = true;
    },
    // 更新数据
    update(row) {
      this.formInit(row);
      this.dialogTitle = "编辑教务";
      this.type = "updateUserInfo";
      this.formItem[1].rules = [];
      this.formItem[4].rules = [];
      this.formItem[4].show = false;
      this.dialogVisible = true;
    },
    // 提交数据
    submit() {
      window.sessionStorage.setItem("responseType", "json");
      API[this.type](this.formData).then(res => {
        this.$notify({
          title: "提示",
          message: res.message,
          type: !!res && res.code === 20000 ? "success" : "warning"
        });
        //权限不足
        if (!!res && res.code === 20000) {
          this.dialogVisible = false;
          var that = this;
          setTimeout(function() {
            that.getData();
          }, 100);
        }
      });
    },
    // 弹框关闭时的回调函数
    handleClose(done) {
      done();
      this.data = JSON.parse(sessionStorage.getItem("userRow"));
    },
    getClassList(obj, type) {
      var config = {
        page: 1,
        size: 100,
        classesid: "",
        name: "",
        teacherid: "",
        createtime: ""
      };
      API.findClassList(config)
        .then(res => {
          if (!!res && res.code === 20000) {
            if (type !== "student") {
              obj.options = [
                {
                  value: "",
                  label: "全部"
                }
              ];
            } else {
              obj.options = [];
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
    },
    // 获取数据
    getData() {
      var _this = this;
      var config = {
        roleid: "3",
        teacherid: "",
        loginName: "",
        classesId: !!this.classesId ? this.classesId : "",
        page: _this.currentPage,
        size: _this.pageSize
      };
      // 添加查询字段
      config = $.extend(config, this.searchFormData);
      // 接口调用
      this.fullscreenLoading = true;
      window.sessionStorage.setItem("responseType", "json");
      API.findUserList(config)
        .then(res => {
          this.resCode = res.code;
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
          if (!!res && res.code === 20000) {
            for (var i = 0; i < res.data.rows.length; i++) {
              res.data.rows[i].sexName =
                res.data.rows[i].sex === 2 ? "女" : "男";
              res.data.rows[i].roleName = this.roleId2Name(
                res.data.rows[i].roleid
              );
            }
            window.sessionStorage.setItem(
              "userRow",
              JSON.stringify(res.data.rows)
            );
            this.data = res.data.rows;
            this.total = res.data.total;
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
    },
    roleId2Name(index) {
      //  1 admin 2 校长 3 教务 4 教师 5 学员 6 会员 7 粉丝
      var roleArr = [
        "",
        "admin",
        "校长",
        "教务",
        "教师",
        "学员",
        "会员",
        "粉丝"
      ];
      return roleArr[index];
    },
    // 删除
    delete() {
      var _this = this;
      API.delUser({ id: _this.ids })
        .then(res => {
          this.$notify({
            title: "提示",
            duration: "1000",
            message: res.message,
            type: !!res && res.code === 20000 ? "success" : "error"
          });
          if (!!res && res.code === 20000) {
            this.ids = null;
            this.getData();
          }
        })
        .catch(err => {
          this.$message({
            message: err,
            type: "error"
          });
        });
    },
    // 批量.删除
    deleteBatch() {
      var id = [];
      this.multipleSelection.forEach(item => {
        id.push(item.id);
      });
      this.ids = id.join();
      if (id.length > 0) {
        this.deleteConfirm({ id: this.ids });
      } else {
        this.$message({
          message: "请至少选择一个选项",
          type: "warning"
        });
      }
    },
    // 删除确认
    deleteConfirm(row) {
      var _this = this;
      _this.ids = row.id;
      setTimeout(() => {
        this.$refs.myconfirm.confirm(_this.delete, _this.cancle);
      }, 100);
    },
    // 取消删除
    cancle() {
      this.ids = null;
    },
    // 表单重置
    resetForm() {
      if (this.$refs["myform"] != undefined) {
        this.$refs["myform"].resetForm();
      }
    },
    // 获取选中行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页切换
    handleCurrentChange(index) {
      this.currentPage = index;
      this.getData();
    },
    // 搜索
    searchSubmit() {
      this.currentPage = 1;
      this.getData();
    }
  }
};
</script> 
<style lang = "scss" scoped >
@import "@/assets/base/variables.scss";

button.el-button.pull-right.el-button--default {
  margin-top: 3px;
  margin-left: 10px;
  color: #fff;
}
.user-list .el-input-group__prepend {
  min-width: 60px;
}
.user-list label.el-form-item__label {
  text-align: center;
  min-width: 114px;
}
button.el-button.pull-right.export-button.el-button--default.el-button--mini {
  margin-top: 0px;
}
.export-button:hover {
  background: #6393ed;
}
</style > 
