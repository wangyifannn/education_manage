<template>
  <div class="main-page">
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
        >创建模板</el-button>
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
    <el-row>
      <div
        v-for="(inviteItem,index) in data"
        :key="index"
        class="single-member effect-5 clearfix shadow"
      >
        <div class="member-image">
          <img
            :src="!!inviteItem.templateId?img[inviteItem.templateId-1]:require('@/assets/img/noImg.png')"
            :onerror="errorImg"
          />
        </div>
        <div class="member-info">
          <p
            class="title aligncenter"
            :title="inviteItem.title"
          >{{inviteItem.title}}</p>
          <h6>{{inviteItem.activitytime}}</h6>
          <div class="btn-count-publish">
            <el-button
              type="primary"
              size="mini"
              plain
              @click="countFun(inviteItem)"
            >统计</el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              @click="publishFun(inviteItem)"
            >发布</el-button>
          </div>
          <p>{{inviteItem.content}}</p>
          <img
            class="preview"
            src='@/assets/img/preview.png'
            :onerror="errorImg"
            title="预览"
            alt="预览"
            @click="preview(inviteItem)"
          />
          <div class="social-touch icon-colored">
            <a
              class="fb-touch"
              title="编辑"
              href="#"
              @click="update(inviteItem)"
            ></a>
            <a
              class="tweet-touch"
              title="复制"
              @click="copyConfirm(inviteItem)"
              href="#"
            ></a>
            <a
              class="linkedin-touch"
              title="删除"
              @click="deleteConfirm(inviteItem)"
              href="#"
            ></a>

          </div>
        </div>
      </div>
    </el-row>
    <div style="margin-top:15px;margin-bottom:50px;">
      <el-pagination
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- myconfirm -->
    <MyConfirm
      ref="myconfirm"
      :type="confirmType"
      :title="confirmTitle"
      :content="confirmContent"
    ></MyConfirm>
    <div
      class="page-pre"
      v-if="showPre"
    >
      <templatePage
        :showPre="showPre"
        :eventData="eventData"
        @closePre="closePre"
      ></templatePage>
    </div>
  </div>
</template>

<script>
import API from "@/api/api_event.js";
import { getField, getFormField, getSearchField } from "@/assets/json/index.js";
import { getPageSize, px2rem, rem2px } from "@/plugins/util.js";
import { setTimeout } from "timers";
import templatePage from "@/views/event/templatePage";
export default {
  name: "templateList",
  components: { templatePage },
  data() {
    return {
      img: [
        require("@/assets/img/invite/event1.png"),
        require("@/assets/img/event/yaoqinghan2.png"),
        require("@/assets/img/event/yaoqinghan3.png"),
        require("@/assets/img/event/yaoqinghan4.png")
      ],
      copyData: {},
      errorImg: 'this.src="' + require("@/assets/img/noImg.png") + '"',
      fullscreenLoading: false,
      confirmType: "warning",
      confirmTitle: "提示信息",
      confirmContent: "此操作将永久删除该文件, 是否继续?",
      dialogTitle: "活动统计",
      dialogVisible: false,
      multipleSelection: [],
      ids: null,
      column: [],
      data: [],
      formItem: [],
      formData: {},
      pageSize: 8,
      currentPage: 1,
      total: 0,
      type: "add",
      searchFormData: {},
      searchFormItem: [],
      eventData: {},
      
      showPre: false
    };
  },
  created() {
    this.fieldInit();
    this.searchFormInit();
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
      this.gotoUrl("/event/templateAdd", {});
    },
    countFun(params) {
      this.gotoUrl("/event/count", {
        invitationId: params.id + "",invitationTitle:!!params.title?params.title:""
      });
    },

    publishFun(params) {
      this.gotoUrl("/event/publish", params);
    },
    countTo(row) {
      this.showDialog();
    },
    // 更新数据
    update(row) {
      var params = row;
      params.eventContent = params.content;
      delete params["content"];
      this.gotoUrl("/event/templateUpdate", params);
    },
    // 获取数据
    getData() {
      var _this = this;
      var config = {
        page: _this.currentPage,
        size: _this.pageSize
      };
      config = $.extend(config, this.searchFormData);
      // 添加查询字段
      window.sessionStorage.setItem("responseType", "json");
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
    // 删除确认
    deleteConfirm(row) {
      this.confirmContent = "此操作将永久删除该文件, 是否继续?";
      var _this = this;
      _this.ids = row.id;
      setTimeout(() => {
        _this.$refs.myconfirm.confirm(_this.delete, _this.cancle);
      }, 100);
    },
    copyConfirm(params) {
      this.confirmContent = "请确定将要复制的模板名称为：" + params.title;
      var _this = this;
      this.copyData = params;
      setTimeout(() => {
        _this.$refs.myconfirm.confirm(_this.copyFun, "");
      }, 100);
    },
    copyFun() {
      this.copyData.id = "";
      API.addAPI(this.copyData).then(res => {
        this.$message({
          message: res.message,
          type: !!res && res.code === 20000 ? "success" : "warning"
        });
        if (!!res && res.code === 20000) {
          this.getData();
        }
      });
    },
    preview(row) {
      this.showPre = true;
      this.eventData = row;
    },
    closePre(params) {
      this.showPre = params;
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
.page-pre {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 100;
}
// 通用样式
.single-member {
  width: 21%;
  float: left;
  font-family: sans-sarif;
  margin: 30px 5.3% 30px 0px;
  background-color: #fff;
  text-align: center;
  position: relative;
}
.single-member:nth-child(4n + 4) {
  margin-right: 0px;
}
.member-image img {
  max-width: 100%;
  vertical-align: middle;
}

h6 {
  font-size: 13px;
  font-weight: 300;
  margin: 4px 0 2px;
  line-height: 22px;
}
p {
  font-size: 14px;
  font-weight: 300;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-height: 22px;
  padding: 0 30px;
  margin-bottom: 10px;
}
p.title {
  font-size: 20px;
  font-weight: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  display: block;
  margin: 10px 0 0;
  text-transform: uppercase;
}
.social-touch a {
  display: inline-block;
  width: 27px;
  height: 26px;
  vertical-align: middle;
  margin: 0 2px;
  background-image: url("../../assets/img/social-icons.png");
  background-repeat: no-repeat;
  opacity: 0.7;
  transition: 0.3s;
}
.social-touch a:hover {
  opacity: 1;
  transition: 0.3s;
}
.fb-touch {
  background-position: 0 0;
}
.tweet-touch {
  background-position: -35px 0;
}
.linkedin-touch {
  background-position: -71px 0;
}
.icon-colored .fb-touch {
  background-position: 0 -27px;
}
.icon-colored .tweet-touch {
  background-position: -35px -27px;
}
.icon-colored .linkedin-touch {
  background-position: -71px -27px;
}

.btn-count-publish button.el-button {
  padding: 0px 10px;
  line-height: 19px;
  font-size: 10px;
}
// 第三种样式
/*= effect-5 css =*/
.effect-5 {
  max-height: 318px;
  min-height: 318px;
  overflow: hidden;
}
.effect-5 .member-info {
  background-color: #fff;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  height: 82px;
  transition: 0.3s;
  z-index: 2;
}
.effect-5 .member-image {
  margin-top: 95px;
  float: left;
  width: 100%;
  position: relative;
  transition: 0.3s;
  z-index: 4;
}
.effect-5 .member-image img {
  width: 100%;
  min-height: 223px;
  max-height: 225px;
}
.effect-5 .member-info:before {
  border-left: 122px solid transparent;
  border-right: 122px solid transparent;
  border-top: 15px solid #fff;
  bottom: -15px;
  content: "";
  left: 0;
  position: absolute;
  z-index: 9;
}
.effect-5:hover .member-info {
  height: 195px;
  transition: 0.3s;
  z-index: 6;
}
.effect-5:hover .member-image {
  margin-top: 200px;
  transition: 0.3s;
}
.preview {
  position: absolute;
  top: -10px;
  position: absolute;
  top: 0px;
  width: 35px;
  cursor: pointer;
  height: 35px;
  /* border: 1px solid red; */
  right: 0px;
}
.shadow {
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 23px;
  border-radius: 10px;
  width: 21%;
}
/*= effect-5 css end =*/
</style>
