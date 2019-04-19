<template>
  <div
    class=""
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
        style="line-height: 32px;"
      >
        邀请函名称：<span class="redcolor">{{this.$route.query.invitationTitle}}</span>
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
      :operation="operation"
      :column="column"
      :data="data"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :total="total"
      @handleCurrentChange="handleCurrentChange"
      @delete="''"
      @update="''"
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
import API from "@/api/api_event.js";
import { getField, getFormField, getSearchField } from "@/assets/json/index.js";
import { getPageSize, px2rem, rem2px } from "@/plugins/util.js";
import { setTimeout } from "timers";
let _ = require("lodash");
export default {
  name: "countTable",
  data() {
    // 表格操作配置
    var operation = {
      nowPage: "countTable",
      show: false,
      fixed: false,
      size: "mini",
      width: 80 + rem2px(px2rem(160)),
      minWidth: 100,
      label: "操作",
      btns: [
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
      dialogTitle: "添加",
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
      type: "addhongselvyou",
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
  methods: {
    gotoUrl(path, query) {
      this.$router.push({
        path: !!path ? path : "",
        query: !!query ? query : ""
      });
    },
    fieldInit() {
      // 获取字段
      var column = getField("countTable");
      column.forEach(item => {
        if (!!item.width && item.width != "auto") {
          item.width = rem2px(px2rem(item.width));
        }
      });
      this.column = column;
    },
    // 搜索表单数据初始化
    searchFormInit() {
      this.searchFormItem = getSearchField("countTable", "item");
      this.searchFormData = getSearchField("countTable", "data");
    },
    // 获取数据
    getData() {
      var _this = this;
      var config = {
        start: _this.currentPage,
        size: _this.pageSize
      };
      // 添加查询字段
      config = $.extend(config, this.searchFormData);
      config.invitationId = this.$route.query.invitationId;
      window.sessionStorage.setItem("responseType", "json");
      this.fullscreenLoading = true;
      // 接口调用
      API.getCountTableData(config)
        .then(res => {
          if (!!res && res.code === 20000 && res.data[0].countNum !== 0) {
            this.data = res.data;
            this.total = !res.data[0] ? 0 : res.data[0].countNum;
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
          this.fullscreenLoading = false;
        });
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
      this.getData();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/base/variables.scss";
</style>
