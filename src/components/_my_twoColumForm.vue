<template>
  <div
    class="two-form"
    :style="'width: ' + (form.width ? form.width : '100%')"
    :class="{ 'alignleft' : form.isLeft===true  }"
  >
    <!-- 标题 -->
    <div
      class="form-title"
      v-if="form.showTitle"
    >{{form.title}}</div>
    <!-- 通用表单 -->
    <el-form
      :class="{'showFormBorder':!!form.showFormBorder}"
      v-if="!form.isTable"
      :ref="form.ref"
      :disabled="form.disabled"
      :label-position="form.labelPositon"
      size="mini"
      :model="formData"
      enctype="multipart/form-data"
      @submit.native.prevent
      :label-width="form.labelWidth"
    >
      <!-- 上传封面图片 -->
      <el-row
        :gutter="24"
        v-show="!!form.showImg"
        v-loading="imgLoading"
        element-loading-text="拼命上传中..."
        element-loading-spinner="el-icon-loading"
      >
        <el-col :span="5">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :auto-upload="true"
            :http-request="uploadUserImg"
          >
            <i class="el-icon-plus avatar-uploader-icon"><span class="alignright imglabelstyle">图片</span></i>
            <img
              v-if="form.imgPath!==''"
              :src="form.imgPath"
              class="avatar"
            >
          </el-upload>
        </el-col>
        <el-col :span="19">
          <div
            class="alignleft"
            style="margin-top: 22px;"
          >
            <span>点击左图上传封面图片</span><br />
            <span class="spec">要求：</span><br />
            <span>1.建议图片比例 3:1</span><br />
            <span>2.图片大小 20MB以下</span><br />
            <span>3.图片格式 jpg、jpeg、png等 </span><br />
          </div>
        </el-col>
      </el-row>
      <!-- 上传视频mp4或pdf -->
      <el-row
        style="margin-bottom: 10px;"
        :gutter="24"
        v-show="!!form.showMp4"
        v-loading="mp4Loading"
        element-loading-text="拼命上传中"
        element-loading-spinner="el-icon-loading"
      >
        <el-col :span="8">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUploadMp4"
            :auto-upload="true"
            :http-request="uploadMp4"
          >
            <i
              v-if="form.showDownloadPath==false"
              class="el-icon-plus avatar-uploader-icon mp4-i"
            ><span class="alignright imglabelstyle">视频</span></i>
            <i
              v-if="form.showDownloadPath==true"
              class="el-icon-plus avatar-uploader-icon mp4-i"
            ><span
                style="font-size:14px;position: absolute;left: 13px;color:#000;"
                class="alignright"
              >文件</span></i>
            <div v-if="form.showDownloadPath==false">
              <div
                class="my-video"
                v-show="!!form.uploadPath"
              >
                <video
                  ref='mp4video'
                  :src="form.uploadPath"
                  width="320"
                  height="150"
                  controls
                >
                  您的浏览器不支持 video元素。</video>
              </div>
            </div>

          </el-upload>
        </el-col>
        <el-col :span="16">
          <div
            class="alignleft"
            style="margin-top: 22px;"
            v-if="form.showDownloadPath==false"
          >
            <span>点击左图上传视频</span><br />
            <span class="spec">要求：</span><br />
            <span>1.视频格式Mp4、WebM、Ogg、Mov等</span><br />
          </div>
          <div
            class="alignleft"
            style="margin-top: 22px;"
            v-if="form.showDownloadPath==true"
          >
            <span>点击左图上传pdf文件</span><br />
            <span class="spec">要求：</span><br />
            <span>1.文件格式：pdf</span><br />
            <div v-if="form.showDownloadPath==true">
              <div class="my-pdf">
                <a
                  v-if="!!downloadPath"
                  :href="downloadPath"
                  target="_blank"
                >立即查看</a>
                <span v-if="downloadPath===''">暂未上传</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- input  -->
      <el-row>
        <template v-for="(item, index) in formItem">
          <el-col
            :span="24/form.column"
            :key="index"
            v-if="item.show"
            :class="{'el-input-100':form.column ===1}"
          >
            <el-form-item
              :label="!!item.label? item.label:''"
              :prop="item.name"
              :rules="item.rule !== 'phone' ? item.rules:phoneVal"
              :label-width="!!form.labelWidth ? form.labelWidth:'100%'"
            >
              <!-- 上传文件 -->
              <el-input
                v-if="item.type === 'file'"
                :type="item.type"
                v-model="formData[item.name]"
              ></el-input>
              <!-- 输入框 -->
              <el-input
                v-else-if="item.type === 'text'"
                v-model="formData[item.name]"
                :type="item.type"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
              >
                <template
                  v-if="form.style==='prepend'"
                  slot="prepend"
                >{{item.label}}
                </template>
              </el-input>
              <!-- 日期选择框 -->
              <el-date-picker
                v-else-if="item.type === 'date'"
                v-model="formData[item.name]"
                :type="item.type"
                :placeholder="item.placeholder"
                :default-time="item.defaultTime"
                :disabled="item.disabled"
                :format="(item.format ? item.format : 'yyyy-MM-dd')"
                :style="'width: ' + (item.width ? item.width : '100%')"
              ></el-date-picker>
              <!-- 时间选择框 -->
              <el-time-picker
                v-else-if="item.type === 'fixed-time'"
                v-model="formData[item.name]"
                :type="item.type"
                :placeholder="item.placeholder"
                :default-time="item.defaultTime"
                :disabled="item.disabled"
                :format="(item.format ? item.format : 'hh:mm:ss')"
                :style="'width: ' + (item.width ? item.width : '100%')"
              ></el-time-picker>
              <!-- 日期时间选择器 -->
              <el-date-picker
                v-else-if="item.type == 'datetime'"
                v-model="formData[item.name]"
                :type="item.type"
                :placeholder="item.placeholder"
                :default-time="item.defaultTime"
                :align="item.align"
                :picker-options="pickerOptions"
                :disabled="item.disabled"
                :value-format="(item.format ? item.format : 'yyyy-MM-dd hh:mm:ss')"
                :format="(item.format ? item.format : 'yyyy-MM-dd hh:mm:ss')"
                :style="'width: ' + (item.width ? item.width : '100%')"
              ></el-date-picker>
              <!-- 开关 -->
              <el-switch
                v-else-if="item.type=='switch'"
                v-model="formData[item.name]"
              ></el-switch>
              <!-- select选择框 -->
              <el-select
                v-else-if="item.type=='select'"
                v-model="formData[item.name]"
                :placeholder="item.placeholder"
                :multiple="item.multiple"
                :collapse-tags="item.collapseTags"
                :filterable="item.filterable"
                value-key="id"
                :disabled="item.disabled"
                :allow-create="item.allowCreate"
                :style="'width: ' + (item.width ? item.width : '100%')"
              >
                <el-option
                  v-for="iitem in item.options"
                  :key="iitem.id"
                  :label="iitem.label"
                  :value="iitem.value"
                >
                </el-option>
              </el-select>
              <!-- 复选框 -->
              <el-checkbox-group
                v-else-if="item.type=='checkbox'"
                v-model="formData[item.name]"
                :style="'width: ' + (item.width ? item.width : '100%')"
              >
                <el-checkbox
                  v-for="(option, idx) in item.options"
                  :key="idx"
                  :label="option.id"
                >{{option.name}}</el-checkbox>
              </el-checkbox-group>
              <!-- 单选 -->
              <el-radio-group
                v-else-if="item.type=='radio'"
                v-model="formData[item.name]"
              >
                <el-radio
                  v-for="(option, idx) in item.options"
                  :key="idx"
                  :label="option.value"
                  :disabled="!!option.disabled?option.disabled:false"
                >{{option.label}}</el-radio>
              </el-radio-group>
              <!--单选按钮组 -->
              <el-radio-group
                v-else-if="item.type=='radioGroup'"
                :disabled="item.disabled"
                v-model="formData[item.name]"
              >
                <el-radio-button
                  v-for="(option, idx) in item.options"
                  :key="idx"
                  :label="option.value"
                >{{option.label}}</el-radio-button>
              </el-radio-group>
              <!-- 文本域 -->
              <el-input
                v-else-if="item.type=='textarea'"
                :type="item.type"
                v-model="formData[item.name]"
                :placeholder="item.placeholder"
              ></el-input>
              <!-- 其他 -->
              <el-input
                v-else-if="item.type=='password'"
                :type="item.type"
                :placeholder="item.placeholder"
                v-model="formData[item.name]"
                @keyup.enter.native="submitForm(form.ref)"
              >
                <template
                  v-if="form.style==='prepend'"
                  slot="prepend"
                >{{item.label}}
                </template>
              </el-input>
              <el-input
                v-else
                :type="item.type"
                :placeholder="item.placeholder"
                v-model="formData[item.name]"
              ></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <!-- 富文本--详细内容 -->
      <el-row
        class="info"
        :gutter="24"
        v-if="form.showUE"
      >
        <el-col
          class="alignleft"
          :span="2"
          style="color:#606266;font-weight: bold;"
        >
          内容
        </el-col>
        <el-col :span="22">
          <UE
            @ready="editorReady"
            ref="ue"
            :fullscreenLoading="fullscreenLoading"
            :value="defaultMSG"
            style="width:100%;"
          ></UE>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格式表单 -->
    <el-table
      v-else
      :data="form.data"
      :show-header="true"
      :border="true"
      style="width: 100%"
    >
      <el-table-column
        v-for="(item, index) in form.column"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        width="auto"
      >
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row[item.prop]"
            :disabled="item.disabled"
          >
          </el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-row
      v-if="!!form.hasSubmit"
      class="btn-group"
      :class="{'btn-group-top100':!!form.istop100}"
    >
      <el-button
        v-if="!!form.cancleShow"
        size="mini"
        @click="resetForm()"
      >{{form.cancleText}}</el-button>

      <el-button
        type="primary"
        size="mini"
        @click="submitForm(form.ref)"
      >{{form.submitText}}</el-button>
    </el-row>
  </div>
</template>
<script>
import API from "@/api/api_course.js";
import UE from "@/components/myEdit";
export default {
  name: "MyTwoColumForm",
  components: { UE },
  props: {
    fullscreenLoading: {
      type: Boolean,
      default: true
    },
    form: {
      type: Object,
      default: () => {
        return {
          content: "",
          imgPath: "",
          showImg: {
            type: Boolean,
            default: true
          },
          showMp4: {
            type: Boolean,
            default: true
          },
          showDownloadPath: {
            type: Boolean,
            default: true
          },
          cancleShow: {
            type: Boolean,
            default: true
          },
          isLeft: {
            type: Boolean,
            default: true
          },
          showUE: {
            type: Boolean,
            default: false
          },
          title: {
            type: String,
            default: "标题"
          },
          showTitle: {
            type: Boolean,
            default: true
          },
          ref: {
            type: String,
            default: "form"
          },

          width: {
            type: Number,
            default: 100
          },
          isTable: {
            type: Boolean,
            default: false
          },
          labelWidth: {
            type: String,
            default: "120px"
          },
          labelPositon: {
            type: String,
            default: "right"
          },
          column: {
            type: Number,
            default: 1
          },
          hasSubmit: {
            type: Boolean,
            default: true
          },
          disabled: {
            type: Boolean,
            default: false
          }
        };
      }
    },
    formItem: {
      type: Array,
      default: () => [Object]
    },
    formData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    var validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!this.isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      defaultMSG: null,
      mp4Loading: false,
      imgLoading: false,
      checkAll: false,
      isIndeterminate: true,
      imgPath: "",
      uploadPath: "",
      downloadPath: "",
      phoneVal: [
        { required: true, trigger: "blur", validator: validPhone } //这里需要用到全局变量
      ],
      mp4Data: {
        file: {
          type: File,
          default: () => {
            return new FormData();
          }
        }
      },
      imgData: {
        file: {
          type: File,
          default: () => {
            return new FormData();
          }
        },
        menu: "用户头像"
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    };
  },

  created() {
    window.sessionStorage.setItem("responseType", "json");
  },
  methods: {
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    },
    editorReady(instance) {
      var that = this;
      setTimeout(function() {
        !!that.form.content
          ? instance.setContent(that.form.content)
          : instance.placeholder("请输入内容......");
        instance.addListener("contentChange", () => {
          that.form.content = instance.getContent();
        });
      }, 500);
    },
    getUEContent() {
      if (this.form.content === "") {
        this.$message({
          type: "warning",
          message: "请输入内容"
        });
        return;
      } else {
        this.$emit("submit", this.form.content);
      }
    },
    getSubmitData(clear) {
      for (let i = 0; i < this.forms.length; i++) {
        const item = this.forms[i];
        this.formData[item.ref] = {};
        for (let j = 0; j < item.formItem.length; j++) {
          item.formItem[j].value = clear ? "" : item.formItem[j].value;
          this.formData[item.ref][item.formItem[j].name] =
            item.formItem[j].value;
        }
      }
    },

    onSubmit() {
      this.getSubmitData();

      this.$emit("submit", this.formData);
    },

    onCancel() {
      this.getSubmitData(true);
      this.$emit("cancle");
    },
    submitForm() {
      this.$refs[this.form.ref].validate(valid => {
        if (valid) {
          this.formData.content = !!this.formData.content
            ? this.formData.content
            : this.form.content;
          if (this.mp4Loading === false) {
            this.$emit("submit", this.formData);
          } else {
            this.$notify({
              title: "提示",
              message: "视频正在上传中，暂时不能提交，请耐心等待。。。",
              type: "warning"
            });
          }
        } else {
          return false;
        }
      });
    },

    resetForm() {
      this.$refs[this.form.ref].resetFields();
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/JPG";
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isJPG) {
        this.$message.error("上传图片只能是 jpg 、jpeg、png格式!");
      }
      if (!isLt20M) {
        this.$message.error("上传图片大小不能超过20MB!");
      }
      if (!isJPG || !isLt20M) {
        return isJPG && isLt20M;
      }
      this.imgData.file = file;
    },
    // 检测上传视频格式MP4
    beforeAvatarUploadMp4(file) {
      var isMp4;
      if (!!this.form.showDownloadPath) {
        isMp4 = file.type === "application/pdf";
      } else {
        isMp4 =
          file.type === "video/mp4" ||
          file.type === "video/webm" ||
          file.type === "audio/ogg" ||
          file.type === "video/quicktime" ||
          file.type === "video/ogg";
      }
      if (!isMp4) {
        var mes = !!this.form.showDownloadPath
          ? "上传格式只能是pdf格式!"
          : "上传格式只能是 Mp4、webm、ogg格式!";
        this.$message.error(mes);
        return isMp4;
      }
      this.mp4Data.file = file;
    },

    uploadMp4() {
      var form = new FormData();
      form.append("menu", "视频");
      form.append("file", this.mp4Data.file);
      window.sessionStorage.setItem("responseType", "form");
      this.mp4Loading = true;
      API.uploadImg(form)
        .then(res => {
          this.mp4Loading = false;
          window.sessionStorage.setItem("responseType", "json");
          if (!!res && res.code === 20000) {
            this.uploadPath = !!res.data ? res.data[0] : "";
            if (!!this.$refs.mp4video) {
              this.$refs.mp4video.src = this.uploadPath;
            } else {
              this.downloadPath = this.uploadPath;
            }
            this.$emit("uploadPath", this.uploadPath);
          }
          this.$message({
            message: res.message,
            type: res.code === 20000 ? "success" : "error"
          });
        })
        .catch(err => {
          this.mp4Loading = false;
        });
    },
    uploadUserImg() {
      var form = new FormData();
      form.append("menu", this.imgData.menu);
      form.append("file", this.imgData.file);
      window.sessionStorage.setItem("responseType", "form");
      API.uploadImg(form)
        .then(res => {
          window.sessionStorage.setItem("responseType", "json");
          if (!!res && res.code === 20000) {
            this.form.imgPath = !!res.data ? res.data[0] : "";
            this.$emit("imgPath", this.form.imgPath);
            this.$message({
              message: res.message,
              type: "success"
            });
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "err",
            type: "error"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/base/variables.scss";

@import "@/assets/base/mixins.scss";
.two-form {
  text-align: left;
  margin: 0 auto;
  font-size: 14px;
  color: #606266;
  .el-col-24 {
    width: 98%;
  }
  .imglabelstyle {
    font-weight: bold;
    font-size: 14px;
    position: absolute;
    left: 19px;
    color: #606266;
  }
  &-title {
    line-height: 40px;
    background: $tc;
    margin-bottom: 20px;
    color: #fff; // text-align: left
  }
  i.el-icon-plus.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    margin-bottom: 10px;
  }
  i.el-icon-plus.avatar-uploader-icon.mp4-i {
    width: 320px;
  }
  .avatar {
    max-width: 140px;
    height: 140px;
    left: 93px;
    top: 0px;
    position: absolute;
  }
  .avatar-uploader {
    text-align: left;
    margin-left: 81px;
  }
  .my-video {
    position: absolute;
    top: 0px;
    left: 93px;
    height: 150px;
  }
  .my-pdf {
    position: absolute;
    top: 120px;
    left: 456px;
    height: 150px;
  }
  .el-upload.el-upload--text {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .el-upload__text {
    margin-bottom: 20px;
    color: #8c939d;
  }
  .el-table {
    margin-bottom: 20px;
  }

  .btn-group {
    text-align: center;
    padding: 15px 0px 0px;
    cursor: pointer;
  }
  .btn-group-top100 {
    bottom: -89px;
    left: 46%;
    position: absolute;
  }
  .el-checkbox {
    margin-left: 0;
    width: px2rem(90);
    &:not(:last-of-type) {
      @include px2rem(margin-right, 30);
    }
  }
  .form-title {
    width: 100%;
    background-color: #e5e8ef;
    color: #57606f;
    line-height: 38px;
    padding-left: 20px;
  }
  form.el-form.el-form--label-left.showFormBorder {
    border: 1px solid #e5e8ef;
    padding: 20px;
  }
  .el-input {
    width: 80% !important;
  }
  .el-textarea {
    width: 80% !important;
  }
  .el-input-100 .el-input {
    width: 100%;
  }
  .el-col-2 {
    width: 6.33333%;
  }
  .alignleft.el-col.el-col-2 {
    margin-left: 10px;
  }
  .el-col-22 {
    margin-left: -10px;
  }
}
</style>