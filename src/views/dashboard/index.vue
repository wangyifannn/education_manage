<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";
import editorDashboard from "./editor";
import Driver from "driver.js"; // import driver.js
import "driver.js/dist/driver.min.css"; // import driver.js css
import steps from "./defineSteps";

export default {
  name: "Dashboard",
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      driver: null,
      currentRole: "adminDashboard"
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  mounted() {
    this.driver = new Driver();
    // this.guide();
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps);
      this.driver.start();
    }
  },
  created() {
    if (
      !this.roles.includes("admin") &&
      !this.roles.includes("schoolMaster") &&
      !this.roles.includes("affair") &&
      !this.roles.includes("teacher")
    ) {
      this.currentRole = "editorDashboard";
    }
  }
};
</script>
