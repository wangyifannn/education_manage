<template>
  <div class="blct-table">
    <!-- 标题 -->
    <el-row
      class="title"
      v-if="titleShow"
    >
      <h5>{{title}}</h5>
    </el-row>
    <!-- 增删改查操作 -->
    <el-row
      class="btn-group"
      v-if="btnGroupShow"
    >
      <el-button
        size="mini"
        icon="el-icon-minus"
      >删除</el-button>
    </el-row>
    <!-- 表 -->
    <!--:height="height?height:500"-->
    <el-table
      ref="multipleTable"
      :size="size"
      :highlight-current-row="true"
      :data="data"
      :stripe="stripe"
      :border="border"
      min-height="300"
      :max-height="maxHeight"
      :style="styles"
      :tooltip-effect="'dark'"
      :row-class-name="tableRowClassName"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
      <!-- :currentRow="currentRow" -->
      <!-- 复选框 -->
      <el-table-column
        type="selection"
        v-if="multiple"
        :width="width"
        :align="'center'"
        :fixed="false"
        :selectable='checkboxInit'
      >
      </el-table-column>
      <!-- 单选框 -->
      <!-- 序号 -->
      <el-table-column
        v-if="hasIndex"
        :align="'center'"
        :fixed="'left'"
        type="index"
        label="序号"
        sortable="true"
        width="50"
        :index="indexMethod"
      >
      </el-table-column>
      <!-- 图片 -->
      <el-table-column
        v-if="showImgColumn"
        label="图片"
        width="180"
        :align="'center'"
      >
        <template slot-scope="scope">
          <img
            :src="!!scope.row.img_url?scope.row.img_url:!!scope.row.imgPath?!!scope.row.imgPath:!!scope.row.headimgurl?scope.row.headimgurl:!!scope.row.headImage?scope.row.headImage:require('@/assets/img/noImg.png')"
            :onerror="errorImg"
            style="width:55px;height:55px;border-radius:50%;border:none;"
          />
        </template>
      </el-table-column>
      <!-- 选项内容 -->
      <template v-for="(item, idx) in column">
        <el-table-column
          v-if="item.show"
          :key="idx"
          :align="'center'"
          :fixed="item.fixed"
          :sortable="item.sortable"
          :prop="item.prop"
          :label="item.label"
          :show-overflow-tooltip="true"
          :width="item.width"
        >
          <template slot-scope="scope">
            <!-- 下拉列表显示 -->
            <!-- 超出点点显示 -->
            <el-tooltip
              v-if="item.type == 'tooltip'"
              :content="scope.row[item.prop]"
              placement="top"
            >
              <p> {{ scope.row[item.prop] }}</p>
            </el-tooltip>
            <!-- 超出点点显示模式二 -->
            <el-popover
              v-else-if="item.type == 'popover'"
              trigger="hover"
              placement="top"
            >
              <ul>
                <li
                  v-for="(citem, cidx) in scope.row[item.fprop]"
                  :key="cidx"
                >
                  <span
                    v-for="(ccitem, ccidx) in citem"
                    :key="ccidx"
                  >{{ccitem}}/</span>
                </li>
              </ul>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <p size="medium">
                  <span>{{scope.row[item.fprop][0][item.prop]}}</span>
                </p>
              </div>
            </el-popover>
            <!-- 数据是Object -->
            <span v-else-if="item.type == 'Object'">{{ scope.row[item.fprop][item.prop] ? scope.row[item.fprop][item.prop] : '-' }}</span>
            <!-- 链接 -->
            <a
              v-else-if="item.type == 'link'"
              :href="scope.row[item.prop]"
              :download="scope.row.name"
            > <i class="el-icon-download"></i> 下载</a>
            <!-- 内容需要转换 -->
            <span
              v-else-if="item.type == 'needChange'"
              :style="'color:'+ item.change[scope.row[item.prop]].name"
            >{{ item.change[scope.row[item.prop]].name }}</span>
            <!-- 正常显示 -->
            <span v-else>{{ (scope.row[item.prop] != null && (scope.row[item.prop] + '')) ? scope.row[item.prop] : '-' }}</span>
          </template>
          <template v-if="item.column">
            <el-table-column
              v-for="(item, idx) in item.column"
              :key="idx"
              :fixed="item.fixed"
              :sortable="item.sortable"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
            >
              <template v-if="item.column"></template>
            </el-table-column>
          </template>
        </el-table-column>
      </template>
      <!-- 操作按钮 -->
      <el-table-column
        v-if="operation.show"
        :align="'center'"
        :fixed="operation.fixed"
        :label="operation.label"
        :width="operation.width"
        :minWidth="operation.minWidth"
      >
        <template slot-scope="scope">
          <template v-for="(citem, index) in operation.btns">
            <el-button
              v-if="setShow(scope.row, citem)"
              :key="index"
              type="text"
              :title="!!setDisabled(scope.row, citem)?'该用户未关联微信，不能禁言':'' "
              :class="citem.class"
              @click="handle(citem.handle, scope.row)"
              :icon="citem.icon"
              :disabled="setDisabled(scope.row, citem)"
              :size="citem.size"
            >{{citem.content}}
            </el-button>
          </template>
        </template>
      </el-table-column>
      <!-- 当暂无数据时，自定义页面显示内容 -->
      <div slot="empty">
        <p>
          <img
            class="nodata-img"
            :src="require('@/assets/img/noData.png')"
            alt=""
          >
        </p>
      </div>
    </el-table>
    <!-- 分页 -->
    <el-row
      class="pagination"
      v-if="total >= pageSize"
    >
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[pageSize,50,100, 200, 300]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import { rem2px, px2rem, getTableHeight } from "@/plugins/util.js";
export default {
  name: "MyTable",
  props: {
    table: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => []
    },
    column: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "标题"
    },
    titleShow: {
      type: Boolean,
      default: false
    },
    btnGroupShow: {
      type: Boolean,
      default: false
    },
    // showImgColumn
    showImgColumn: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "mini"
    },
    stripe: {
      type: Boolean,
      default: false
    }, // 是否带有斑马纹路
    border: {
      type: Boolean,
      default: false
    }, // 是否要竖直边框
    multiple: {
      type: Boolean,
      default: true
    }, // 复选框
    height: {
      type: String,
      default: px2rem(getTableHeight())
    },
    maxHeight: {
      type: String,
      default: "none"
    },
    styles: {
      type: String,
      default: ""
    },
    hasIndex: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    layout: {
      type: String,
      default: "prev, pager, next"
    },
    operation: {
      type: Object,
      default: () => {
        return {};
      }
    },
    operation: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      width: rem2px(px2rem(50)),
      errorImg: 'this.src="' + require("@/assets/img/noImg.png") + '"',
      multipleSelection: []
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      // 可以通过指定 Table 组件的 row-class-name 属性来为 Table 中的某一行添加 class，表明该行处于某种状态。
      if (rowIndex % 2 === 0) {
        return "even-row";
      } else {
        return "odd-row";
      }
    },
    handle(str, row) {
      this.rowClick(row);
      this.$emit(str, row); //将事件名字和参数值传递出去，
    },
    handleSelectionChange(val) {
      this.$emit("select", val);
    },
    rowClick(row) {
      this.$emit("rowClick", row);
    },
    indexMethod(index) {
      index = index + 1 + (this.currentPage - 1) * this.pageSize;
      return index;
    },
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(index) {
      this.$emit("handleCurrentChange", index);
    },
    checkboxInit(row, index) {
      //不可勾选
      // else return 1; //可勾选
      return 1;
    },
    setDisabled(row, btn) {
      var flag = false;
      switch (this.operation.nowPage) {
        case "userssList":
          if (!!row.openid) {
            flag = false;
          } else {
            flag = btn.content === "禁言" || btn.content === "恢复";
          }
          break;
        default:
          break;
      }
      return flag;
    },
    setShow(row, btn) {
      var flag = true;
      switch (this.operation.nowPage) {
        case "fansList":
          if (row.isblack === "禁言") {
            flag = btn.content === "恢复";
          } else {
            flag = btn.content === "禁言";
          }
          break;
        default:
          break;
      }
      return flag;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/base/variables.scss";
@import "@/assets/base/mixins.scss";
.title {
  @include padding(10, 10, 20, 10);
  border-bottom: 2px dashed rgba(229, 229, 229, 1);
  h5 {
    @include px2rem(font-size, 29);
    color: $tc;
    &:before {
      content: "";
      display: inline-block;
      vertical-align: middle;
      @include px2rem(height, 770);
      @include px2rem(width, 5);
      @include px2rem(margin-right, 9);
      background-color: $tc;
    }
  }
}
.btn-group {
  @include padding(20, 10);
}
.pagination {
  text-align: right;
  @include padding(20, 10);
}
</style>