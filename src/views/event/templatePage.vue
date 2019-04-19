<template>
  <div
    class="template-page-box"
    @click="closePre()"
    v-show="showPre"
  >
    <div class="template-page">
      <div class="swiper-box">
        <div class="page page1">
          <img
            src="@/assets/img/invite/in_word.png"
            style="width: 55%;
    height: auto;margin-top:100px;margin-bottom:50px;"
            alt=""
          >
          <h2 class="colorblue">声动语商学苑-邀请函</h2>
          <h4 class="colorblue">活动时间：{{eventData.activitytime}}</h4>
        </div>
        <div class="page page2">
          <img
            class="event_word"
            src="@/assets/img/invite/event_word.png"
          >
          <div class="event_box aligncenter">
            <p class="border-bottom-line">活动主题</p>
            <p>{{eventData.title}}</p>
          </div>
          <div
            class="event_box aligncenter border-top-line"
            v-if="!!eventData.money"
          >
            <p class="border-bottom-line">活动费用</p>
            <p>{{eventData.money}}</p>
          </div>
          <div class="event_box aligncenter border-top-line">
            <p class="border-bottom-line">活动内容</p>
            <p>{{eventData.content}}</p>
          </div>
        </div>
        <div class="page page2">
          <img
            class="event_word"
            src="@/assets/img/invite/event_word.png"
          >
          <div class="event_box aligncenter">
            <p class="border-bottom-line">活动地址</p>
            <p>{{eventData.address}}</p>
          </div>
          <div class="event_box aligncenter border-top-line">
            <p class="border-bottom-line">联系人</p>
            <p>{{eventData.linkName}}</p>
          </div>
          <div class="event_box aligncenter border-top-line">
            <p class="border-bottom-line">联系电话</p>
            <p>{{eventData.phone}}</p>
          </div>
        </div>
        <div class="event_form_page page3">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "templatePage",
  props: {
    showPre: {
      type: Boolean,
      default: false
    },
    eventData: {
      type: Object,
      default: function() {
        return {
          activitytime: "",
          address: "",
          content: "",
          money: "",
          linkName: "",
          phone: "",
          title: "",
          createtime: ""
        };
      }
    }
  },
  data() {
    return {};
  },

  created() {},
  methods: {
    closePre() {
      this.$emit("closePre", false);
    }
  }
};
</script>

 <style lang="scss" scoped>
.template-page-box {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  height: 100%;
  padding-top: 10px;
}
.template-page {
  width: 23%;
  max-width: 375px;
  margin: 0 auto;
  margin-top: 20px;
  position: relative;
  background: url("../../assets/img/invite/phone.png");
  height: 660px;
  background-size: 100% 100%;
}
.event_box {
  width: 80%;
  color: cadetblue;
  margin: 0 auto;
}
.border-top-line {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.border-bottom-line {
  padding-bottom: 3px;
  font-size: 16px;
}
.swiper-box {
  width: 87%;
  height: 497px;
  z-index: 100;
  text-align: center;
  margin: 0 auto;
  overflow: auto;
  left: 6.7%;
  top: 12.1%;
  position: absolute;
}
.page.page2 {
  margin-top: -18px;
}
.colorblue {
  color: cadetblue;
}
.page {
  width: 100%;
  min-height: 611px;
  background: url("../../assets/img/invite/banners.png");
  background-size: 100% 100%;
  img {
    width: 100%;
  }
  .event_word {
    width: 80%;
    height: auto;
    margin-top: 50px;
  }
}
.event_form_page {
  width: 100%;
  margin-top: -15px;
  min-height: 611px;
  background: url("../../assets/img/invite/event_form.png");
  background-size: 100% 100%;
}
</style>
