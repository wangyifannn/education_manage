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
        :span="4"
        class="pull-left alignleft"
      >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus"
          @click="addFun()"
        >添加</el-button>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-delete"
          @click="deleteBatch"
        >删除</el-button>
      </el-col>
      <el-col
        :span="20"
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
      @update="update"
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
import { mapGetters } from "vuex";
import API from "@/api/api_course.js";
import { getField, getFormField, getSearchField } from "@/assets/json/index.js";
import { getPageSize, px2rem, rem2px } from "@/plugins/util.js";
import { setTimeout } from "timers";
export default {
  name: "eventList",
  computed: {
    ...mapGetters(["classesId"])
  },
  data() {
    // 表格操作配置
    var operation = {
      nowPage: "convenienceSearchList",
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
    // 每页显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    gotoUrl(path, query) {
      this.$router.push({
        path: !!path ? path : "",
        query: !!query ? query : ""
      });
    },
    fieldInit() {
      // 获取字段
      var column = getField("course");
      column.forEach(item => {
        if (!!item.width && item.width != "auto") {
          item.width = rem2px(px2rem(item.width));
        }
      });
      this.column = column;
      if (
        this.$route.path === "/event/list" ||
        this.$route.path === "/experience/list"
      ) {
        this.column[1].show = false; //科目
        this.column[2].show = false; //教师
        this.column[4].show = false; //班级名称
      } else if (this.$route.path === "/course/list") {
        this.column[1].show = true; //科目
        this.column[2].show = true; //教师
        this.column[4].show = true; //班级名称
      }
    },
    // 搜索表单数据初始化
    searchFormInit() {
      this.searchFormItem = getSearchField("course", "item");
      this.searchFormData = getSearchField("course", "data");
       if (
        this.$route.path === "/event/list" ||
        this.$route.path === "/experience/list"
      ) {
        this.searchFormItem[1].show = false; //教师
        this.searchFormItem[2].show = false; //班级
      } else if (this.$route.path === "/course/list") {
        this.searchFormItem[1].show = true; //教师
        this.searchFormItem[2].show = true; //班级
      }
    },
    addFun() {
      let goPath =
        this.$route.path === "/event/list"
          ? "/event/create"
          : this.$route.path === "/experience/list"
          ? "/experience/create"
          : this.$route.path === "/course/list"
          ? "/course/create"
          : "";
      this.gotoUrl(goPath, {});
    },
    // 更新数据
    update(row) {
      row.classesId = row.classes_id;
      let goPath =
        this.$route.path === "/event/list"
          ? "/event/editor"
          : this.$route.path === "/experience/list"
          ? "/experience/editor"
          : this.$route.path === "/course/list"
          ? "/course/editor"
          : "";
      this.gotoUrl(goPath, row);
    },
    // 获取数据
    getData() {
      console.log(this.$route.path);
      var articelType =
        this.$route.path === "/event/list"
          ? "5"
          : this.$route.path === "/experience/list"
          ? "4"
          : this.$route.path === "/course/list"
          ? "2"
          : "";
      var config = {
        article_type: !!articelType ? articelType : "",
        start: this.currentPage - 1,
        size: this.pageSize,
        classesId: !!this.classesId ? this.classesId : ""
      };
      // 添加查询字段
      window.sessionStorage.setItem("responseType", "json");
      config = $.extend(config, this.searchFormData);
      config.startTime = !!config.startTime
        ? config.startTime + " 00:00:00"
        : "";
      config.endTime = !!this.searchFormData.startTime
        ? this.searchFormData.startTime + " 23:59:59"
        : "";
      this.fullscreenLoading = true;
      API.findData(config)
        .then(res => {
          if (!!res && res.code === 20000) {
            this.data = res.data.rows;
            this.total = res.data.total;
          } else {
            this.$notify({
              title: "提示",
              message:
                !!res && res.data.total === 0
                  ? "查询成功，暂无相关数据"
                  : res.message,
              type: !!res && res.code === 20000 ? "success" : "warning"
            });
          }
          this.fullscreenLoading = false;
        })
        .catch(err => {});
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
