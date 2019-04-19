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
      </el-col>
      <el-col
        :span="19"
        class="pull-right alignright"
      >
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
      :showImgColumn="true"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @Banned="Banned"
      @Restore="Restore"
      @select="handleSelectionChange"
    >
    </MyTable>
    <MyConfirm ref="myconfirm">
    </MyConfirm>
  </div>
</template>
<script>
import API from "@/api/api_user.js";
import { getField, getFormField, getSearchField } from "@/assets/json/index.js";
import { getPageSize, px2rem, rem2px } from "@/plugins/util.js";
import { setTimeout } from "timers";
import $ from "jquery";
export default {
  name: "fansList",
  data() {
    // 表格操作配置
    var operation = {
      nowPage: "fansList",
      show: true,
      fixed: false,
      size: "mini",
      width: rem2px(px2rem(180)),
      minWidth: 180,
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
          content: "恢复",
          icon: "el-icon-circle-check-outline",
          handle: "Restore",
          class: "button-operator colorred"
        }
      ]
    };
    return {
      resCode: "",
      imgPath: "",
      // 加载loading初始化
      fullscreenLoading: false,
      confirmType: "warning",
      dialogVisible: false,
      multipleSelection: [],
      ids: null,
      operation: operation, // 操作按钮
      column: [],
      data: [],
      pageSize: getPageSize(),
      currentPage: 1,
      total: 0,
      type: "saveTask"
    };
  },
  created() {
    this.fieldInit();
    this.getData();
  },
  methods: {
    Restore(row) {
      row.isblack = 0;
      this.changeUserStatus(row);
    },
    Banned(row) {
      row.isblack = 1;
      this.changeUserStatus(row);
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
    fieldInit() {
      var column = getField("fansUser");
      column.forEach(item => {
        if (!!item.width && item.width != "auto") {
          item.width = rem2px(px2rem(item.width));
        }
      });
      this.column = column;
    },
    // 弹框关闭时的回调函数
    handleClose(done) {
      done();
      this.data = JSON.parse(sessionStorage.getItem("userRow"));
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
      API.findFansList(config)
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
              res.data.rows[i].sex = res.data.rows[i].sex === "2" ? "女" : "男";
              res.data.rows[i].isblack =
                res.data.rows[i].isblack === "0" ? "正常" : "禁言";
              res.data.rows[i].subscribeText =
                res.data.rows[i].subscribe === "1" ? "已关注" : "未关注";
              // subscribe 0未 关注 ，1关注
              res.data.rows[i].roleid = this.roleId2Name(
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
    // 获取选中行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 每页显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
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
