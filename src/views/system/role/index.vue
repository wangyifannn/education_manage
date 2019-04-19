<template>
  <div
    class="role-list list main-page user-list"
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
      @update="update"
      @select="handleSelectionChange"
    >
      <!-- @assignP="assignP" -->
    </MyTable>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      top="10vh"
      width="50%"
      :before-close="handleClose"
    >
      <MyTwoColumForm
        v-if="type!=='assignP'"
        :form="form"
        ref="addroleFrom"
        :formData="formData"
        :formItem="formItem"
        @submit="submit"
      > </MyTwoColumForm>
      <MySearch
        v-if="type==='assignP'"
        class="search mydialog-form"
        :formData="formData"
        :formItem="formItem"
      ></MySearch>
      <el-row
        :gutter="20"
        style="margin:5px 0px;"
        v-if="type==='assignP'"
      >
        <el-button
          size="small"
          type="danger"
          @click="addRightsSubmit"
        >提交</el-button>
      </el-row>
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
import API from "@/api/api_rights.js";
import { getField, getFormField, getSearchField } from "@/assets/json/index.js";
import { getPageSize, px2rem, rem2px } from "@/plugins/util.js";
import { setTimeout } from "timers";
import $ from "jquery";
export default {
  name: "roleList",
  data() {
    // 表单配置
    var form = {
      title: "",
      ref: "form1",
      showTitle: false,
      showImg: false,
      labelWidth: px2rem(480),
      labelPositon: "right",
      width: "90%",
      style: "",
      column: 1,
      hasSubmit: true,
      imgPath: "",
      submitText: "提交",
      cancleText: "取消"
    };
    // 表格操作配置
    var operation = {
      nowPage: "roleList",
      show: true,
      fixed: false,
      size: "mini",
      width: 180 + rem2px(px2rem(260)),
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
        }
        // ,
        // {
        //   type: "text",
        //   size: "mini",
        //   content: "分配权限",
        //   icon: "el-icon-circle-check-outline",
        //   handle: "assignP",
        //   class: "button-operator"
        // }
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
      dialogTitle: "编辑角色",
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
      type: "",
      searchFormData: {},
      searchFormItem: []
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
  },
  methods: {
     // 每页显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    fieldInit() {
      var column = getField("roles");
      column.forEach(item => {
        if (!!item.width && item.width != "auto") {
          item.width = rem2px(px2rem(item.width));
        }
      });
      this.column = column;
    },
    formInit(row) {
      this.formItem = getFormField("role", "item");
      this.formData = !!row ? row : getFormField("role", "data");
    },
    formInitPermission(row) {
      this.formItem = getSearchField("assignRights", "item");
      this.formData = getSearchField("assignRights", "data");
      this.findPermissionListById(row.id);
    },
    searchFormInit() {
      this.searchFormItem = getSearchField("role", "item");
      this.searchFormData = getSearchField("role", "data");
    },
    addRightsSubmit() {
      var menuArr = [];
      var optionsArr = this.formInfo[0].options;
      var checkidArr = this.formData.tbMenusFilter;
      for (let j = 0; j < checkidArr.length; j++) {
        for (let i = 0; i < optionsArr.length; i++) {
          if (checkidArr[j] == optionsArr[i].id) {
            optionsArr[i].isflag = true;
            menuArr.push(optionsArr[i]);
          }
        }
      }
      var params = {
        user: {
          id: !!this.$route.query.id ? this.$route.query.id : "",
          roleId: this.pageItem[0].radioValue
        },
        tbMenus: menuArr
      };
      this.fullscreenLoading = true;
      API.addAPI(params).then(res => {
        this.fullscreenLoading = false;
        this.$message({
          message: res.message,
          type: !!res && res.code === 20000 ? "success" : "warning"
        });
        if (!!res && res.code === 20000) {
          this.$router.go(-1);
        }
      });
    },
    // 更新数据
    update(row) {
      this.formInit(row);
      this.dialogTitle = "编辑角色";
      this.type = "updateAPI";
      this.dialogVisible = true;
    },
    // 角色绑定菜单
    assignP(row) {
      this.type = "assignP";
      this.formInitPermission(row);
      this.dialogTitle = "角色分配权限菜单";
      this.dialogVisible = true;
    },
    // 提交数据
    submit() {
      window.sessionStorage.setItem("responseType", "json");
      API[this.type](this.formData).then(res => {
        this.$message({
          message: res.message,
          type: !!res && res.code === 20000 ? "success" : "warning"
        });
        //权限不足
        if (!!res && res.code === 20000) {
          this.dialogVisible = false;
          var that = this;
          setTimeout(function() {
            that.getData();
            that.formData = this._.forEach(this.formData, function(value, key) {
              value = "";
            });
          }, 1000);
        }
      });
    },
    // 弹框关闭时的回调函数
    handleClose(done) {
      done();
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
      // 接口调用
      this.fullscreenLoading = true;
      window.sessionStorage.setItem("responseType", "json");
      API.findRoleList(config)
        .then(res => {
          this.resCode = res.code;
          if (!!res && res.code === 20000) {
            this.data = res.data;
            this.total = res.data.length;
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
    findPermissionListById(roleId) {
      API.findPermissionList({
        roleId: !!roleId && roleId !== "undefined" ? roleId : "0"
      }).then(res => {
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
          var permissionArr = [];
          for (var i = 0; i < res.data.length; i++) {
            permissionArr.push({
              value: res.data[i].id,
              rolesId: res.data[i].rolesId,
              functionName: res.data[i].functionName,
              createtime: res.data[i].createtime,
              name: res.data[i].functionName,
              title: res.data[i].functionName,
              label: res.data[i].functionName,
              parentId: res.data[i].parentId,
              isflag: res.data[i].isflag,
              href: res.data[i].href,
              sort: res.data[i].sort,
              icon: res.data[i].icon
            });
          }
          this.formItem[0].options = permissionArr;
          this.formData.tbMenusFilter = [];
          this.formData.tbMenusFilter.length = 0;
          for (var i = 0; i < permissionArr.length; i++) {
            if (permissionArr[i].isflag === true) {
              this.formData.tbMenusFilter.push(permissionArr[i].id);
            }
          }
        } else {
          this.$notify({
            title: "提示",
            message: res.message,
            type: !!res && res.code === 20000 ? "success" : "warning"
          });
        }
      });
    },
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
  margin-top: 6px;
  margin-left: 10px;
  color: #fff;
}
</style > 
