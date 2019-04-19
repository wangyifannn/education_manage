<template>
  <div
    class="list main-page user-list"
    v-loading="fullscreenLoading"
    element-loading-text="拼命加载中"
  >
    <el-row
      class="btn-group"
      :gutter="24"
    >
      <el-col
        :span="5"
        class="pull-left alignleft"
      >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus"
          :disabled="resCode === 502 ? true:false"
          @click="showDialog"
        >
          创建
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
        :span="19"
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
        ref="myform"
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
  name: "classList",
  computed: {
    ...mapGetters(["userId", "classesId"])
  },
  data() {
    // 表单配置
    var form = {
      isLeft: true,
      showFormBorder: false,
      title: "班级管理-添加",
      ref: "twocolumform",
      showTitle: false,
      showUploadImg: false,
      showImg: false,
      showMp4: false,
      showDownloadPath: false,
      labelWidth: px2rem(530),
      labelPositon: "left",
      width: "90%",
      style: "notprepend",
      column: 1,
      hasSubmit: true,
      istop100: false,
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
      width: 80 + rem2px(px2rem(160)),
      minWidth: 500,
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
      dialogTitle: "添加用户",
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
      searchFormItem: []
    };
  },
  created() {
    this.fieldInit();
    this.searchFormInit();
    this.formInit();
    this.getData();
  },
  mounted() {
    this.resetForm();
  },
  methods: {
    // 每页显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    fieldInit() {
      var column = getField("theClass");
      column.forEach(item => {
        if (!!item.width && item.width != "auto") {
          item.width = rem2px(px2rem(item.width));
        }
      });
      this.column = column;
    },
    formInit(row) {
      this.formItem = getFormField("theClass", "item");
      this.getTeacherList(this.formItem[2]);
      this.formData = !!row ? row : getFormField("theClass", "data");
    },
    searchFormInit() {
      this.searchFormItem = getSearchField("theClass", "item");
      this.getTeacherList(this.searchFormItem[1], "all");
      this.searchFormData = getSearchField("theClass", "data");
      this.searchFormData.teacherid = "";
    },
    // 添加数据
    showDialog() {
      this.formInit();
      this.dialogTitle = "创建班级";
      this.dialogVisible = true;
    },
    // 更新数据
    update(row) {
      this.formInit(row);
      this.dialogTitle = "编辑班级";
      this.dialogVisible = true;
    },
    // 提交数据
    submit() {
      var params = this.formData;
      API.addTheClass(params).then(res => {
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
          }, 1000);
        } else {
          var that = this;
          setTimeout(function() {
            that.$router.push({ path: "/login" });
          }, 1000);
        }
      });
    },
    // 弹框关闭时的回调函数
    handleClose(done) {
      done();
      this.getData();
    },
    getTeacherList(obj, type) {
      var config = {
        page: 1,
        roleid: "4",
        teacherid: "",
        loginName: "",
        userName: "",
        phone: "",
        classesId: "",
        createtime: "",
        size: 100
      };
      API.findUserList(config)
        .then(res => {
          if (!!res && res.code === 20000) {
            obj.options = [];
            if (type === "all") {
              obj.options.push({
                value: "",
                label: "全部",
                id: "",
                name: ""
              });
            }
            for (var i = 0; i < res.data.rows.length; i++) {
              obj.options.push({
                value: res.data.rows[i].id,
                label: res.data.rows[i].userName,
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
    // 获取数据
    getData() {
      var _this = this;
      var config = {
        page: _this.currentPage,
        size: _this.pageSize
      };
      // 添加查询字段
      config = $.extend(config, this.searchFormData);
      config.classesid = !!this.classesId ? this.classesId : ""; //根据当前登录用户绑定的班级id查询班级列表
      config.id = !!this.classesId ? this.classesId : ""; //根据当前登录用户绑定的班级id查询班级列表
      this.fullscreenLoading = true;
      window.sessionStorage.setItem("responseType", "json");
      API.findClassList(config)
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
    // 删除
    delete() {
      var _this = this;
      API.delTheClass({ id: _this.ids })
        .then(res => {
          this.$notify({
            title: "提示",
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
