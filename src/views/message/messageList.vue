<template>
  <div
    class="list main-page"
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
        <el-dropdown
          split-button
          type="primary"
          @command="handleCommand"
        >
          <span @click="handleCommand('exper')">体验区评论</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="eventRing">活动圈</el-dropdown-item>
            <el-dropdown-item
              actived
              command="classInfo"
            >班级通知</el-dropdown-item>
            <el-dropdown-item command="classCourse">班级课程</el-dropdown-item>
            <el-dropdown-item command="classRing">班级圈</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @delete="deleteConfirm"
      @Banned="Banned"
      @select="handleSelectionChange"
    ></MyTable>
    <!-- myconfirm -->
    <MyConfirm
      ref="myconfirm"
      :type="confirmType"
      :title="confirmTitle"
      :content="confirmContent"
    ></MyConfirm>
  </div>
</template>

<script>
import API from "@/api/api_message.js";
import { getField, getFormField, getSearchField } from "@/assets/json/index.js";
import { getPageSize, px2rem, rem2px } from "@/plugins/util.js";
import { setTimeout } from "timers";
export default {
  name: "messageList",
  data() {
    // 表格操作配置
    var operation = {
      nowPage: "messageList",
      show: true,
      fixed: false,
      size: "mini",
      width: 80 + rem2px(px2rem(160)),
      minWidth: 100,
      label: "操作",
      btns: [
        {
          type: "text",
          size: "mini",
          content: "禁言",
          icon: "el-icon-circle-close-outline",
          handle: "Banned",
          class: "button-operator colorgreen"
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
      dialogTitle: "添加渭华讲堂",
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
      type: "experience",
      searchFormData: {},
      searchFormItem: []
    };
  },
  created() {
    this.fieldInit();
    this.searchFormInit();
    this.getData();
  },
  methods: {
    // 每页显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    Banned(row) {
      row.isblack = 1;
      this.changeUserStatus(row);
    },
    handleCommand(command) {
      this.type = command;
      this.getData();
    },
    changeUserStatus(row) {
      API.userStatus(row).then(res => {
        this.$notify({
          title: "提示",
          duration: "1000",
          message: res.message,
          type:
            !!res && res.code === 20000 && res.message !== "禁言失败"
              ? "success"
              : "error"
        });
        if (!!res && res.code === 20000) {
          this.getData();
        }
      });
    },
    gotoUrl(path, query) {
      this.$router.push({
        path: !!path ? path : "",
        query: !!query ? query : ""
      });
    },
    fieldInit() {
      // 获取字段
      var column = getField("messageList");
      column.forEach(item => {
        if (!!item.width && item.width != "auto") {
          item.width = rem2px(px2rem(item.width));
        }
      });
      this.column = column;
    },
    // 搜索表单数据初始化
    searchFormInit() {
      this.searchFormItem = getSearchField("messageList", "item");
      this.searchFormData = getSearchField("messageList", "data");
    },

    // 更新数据
    update(row) {
      this.gotoUrl("/event/messageAdd", row);
      this.$route.matched[this.$route.matched.length - 1].name =
        sessionStorage.getItem("preMenu") + "-编辑";
    },
    // 获取数据
    getData() {
      var config = {
        page: this.currentPage,
        type: this.type,
        size: this.pageSize
      };
      // 添加查询字段
      config = $.extend(config, this.searchFormData);
      window.sessionStorage.setItem("responseType", "json");
      this.fullscreenLoading = true;
      // 接口调用
      API.findAPI(config)
        .then(res => {
          if (!!res && res.code === 20000) {
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
          console.log(err);
        });
    },
    // 删除
    delete() {
      var _this = this;
      API.delAPI({ id: _this.ids, type: this.type })
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
