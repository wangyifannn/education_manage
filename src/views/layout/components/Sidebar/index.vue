<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <sidebar-item
        v-for="route in permission_routers"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />

      {{permission_routers}}
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem },
  created() {
  },
  methods: {
  },
  computed: {
    ...mapGetters(["permission_routers", "sidebar"]),
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
