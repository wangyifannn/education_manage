<template>
  <div
    class="list page-box"
    v-loading="fullscreenLoading"
    element-loading-text="拼命加载中"
  >
    <!-- 按钮操作 -->
    <el-row
      class="btn-group"
      :gutter="24"
    >
      <el-col
        :span="8"
        class="pull-left alignleft"
      >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus"
          @click="addFun()"
        >创建</el-button>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-delete"
          @click="deleteBatch"
        >删除</el-button>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-delete"
          @click="deleteBatch"
        >删除</el-button>
      </el-col>
      <el-col
        :span="16"
        class="pull-right alignright"
      >
        <MySearch
          class="search"
          :formData="searchFormData"
          :formItem="searchFormItem"
          @submit="searchSubmit"
        ></MySearch>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <MyTable
      size="mini"
      :stripe="false"
      :border="false"
      :multiple="true"
      :showImgColumn="true"
      :operation="operation"
      :column="column"
      :data="data"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :total="total"
      @handleCurrentChange="handleCurrentChange"
      @delete="deleteConfirm"
      @update="update"
      @countTo="countTo"
      @select="handleSelectionChange"
    ></MyTable>
    <!-- myconfirm -->
    <MyConfirm
      ref="myconfirm"
      :type="confirmType"
      :title="confirmTitle"
      :content="confirmContent"
    ></MyConfirm>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      top="10vh"
      width="50%"
      :before-close="handleClose"
    >
      <MyTable
        size="mini"
        :stripe="false"
        :border="false"
        :multiple="true"
        :showImgColumn="true"
        :operation="operation"
        :column="column"
        :data="data"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :total="total"
        @handleCurrentChange="handleCurrentChange"
        @delete="deleteConfirm"
        @update="update"
        @select="handleSelectionChange"
      ></MyTable>
    </el-dialog>
  </div>
</template>

<script>
import API from "@/api/api_student.js";
import { getField, getFormField, getSearchField } from "@/assets/json/index.js";
import { getPageSize, px2rem, rem2px } from "@/plugins/util.js";
import { setTimeout } from "timers";
export default {
  name: "indexList",
  data() {
    // 表格操作配置
    var operation = {
      nowPage: "convenienceSearchList",
      show: true,
      fixed: false,
      size: "mini",
      width: 150 + rem2px(px2rem(160)),
      minWidth: 150,
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
          content: "统计",
          icon: "el-icon-document",
          handle: "countTo",
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
      fullscreenLoading: false,
      confirmType: "warning",
      confirmTitle: "提示信息",
      confirmContent: "此操作将永久删除该文件, 是否继续?",
      dialogTitle: "活动统计",
      dialogVisible: false,
      multipleSelection: [],
      ids: null,
      operation: operation, // 操作按钮
      column: [],
      data: [],
      formItem: [],
      formData: {},
      pageSize: getPageSize(),
      currentPage: 1,
      total: 0,
      type: "add",
      searchFormData: {},
      searchFormItem: []
    };
  },
  created() {
    this.fieldInit();
    this.searchFormInit();
  },
  mounted() {
    this.getData();
  },
  activated() {
    this.getData();
  },
  methods: {
    gotoUrl(path, query) {
      this.$router.push({
        path: !!path ? path : "",
        query: !!query ? query : ""
      });
    },
    // 添加数据
    showDialog() {
      this.dialogTitle = "活动统计-用户信息";
      this.dialogVisible = true;
    },
    // 弹框关闭时的回调函数
    handleClose(done) {
      done();
    },
    fieldInit() {
      // 获取字段
      var column = getField("event");
      column.forEach(item => {
        if (!!item.width && item.width != "auto") {
          item.width = rem2px(px2rem(item.width));
        }
      });
      this.column = column;
    },
    // 搜索表单数据初始化
    searchFormInit() {
      this.searchFormItem = getSearchField("event", "item");
      this.searchFormData = getSearchField("event", "data");
    },
    addFun() {
      this.gotoUrl("/event/eventAdd", {});
      this.$route.matched[
        this.$route.matched.length - 1
      ].name = !!sessionStorage.getItem("preMenu")
        ? sessionStorage.getItem("preMenu") + "-添加"
        : this.$route.matched[this.$route.matched.length - 1].name;
    },
    countTo(row) {
      this.showDialog();
    },
    // 更新数据
    update(row) {
      this.gotoUrl("/event/eventAdd", row);
      this.$route.matched[this.$route.matched.length - 1].name =
        sessionStorage.getItem("preMenu") + "-编辑";
    },
    // 获取数据
    getData() {
      var _this = this;
      var config = {
        page: _this.currentPage,
        size: _this.pageSize
      };
      // 添加查询字段
      window.sessionStorage.setItem("responseType", "json");
      config = $.extend(config, this.searchFormData);
      // 接口调用
      this.fullscreenLoading = true;
      API.findData(config)
        .then(res => {
          if (!!res && res.code === 20000 && res.data.total !== 0) {
            this.data = res.data.rows;
            this.total = res.data.total;
          } else {
            this.$message({
              message:
                !!res && res.data.total === 0
                  ? "查询成功，暂无相关数据"
                  : res.message,
              type: !!res && res.code === 20000 ? "success" : "warning"
            });
          }
          this.fullscreenLoading = false;
        })
        .catch(err => {
          alert(err);
        });
    },
    // 删除
    delete() {
      var _this = this;
      API.delAPI({ id: _this.ids })
        .then(res => {
          this.$notify({
            title: "提示",
            duration: "1000",
            message: res.message,
            type: !!res && res.code === 20000 ? "success" : "error"
          });
          if (!!res && res.code === 20000) {
            this.ids = null;
            var that = this;
            that.getData();
          }
        })
        .catch(err => {
          this.$message({
            message: err,
            type: "error"
          });
        });
    },
    // 批量删除
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
    // 删除确认
    deleteConfirm(row) {
      var _this = this;
      _this.ids = row.id;
      setTimeout(() => {
        _this.$refs.myconfirm.confirm(_this.delete, _this.cancle);
      }, 100);
    },
    // 取消删除
    cancle() {
      this.ids = null;
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

<style lang="scss" scoped>
@import "@/assets/base/variables.scss";
</style>
