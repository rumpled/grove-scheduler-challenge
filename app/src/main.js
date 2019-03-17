import Vue from "vue";
import App from "./App.vue";

// parsing cron and figuring out next/prev occurences
import Later from "later/later.js"; // eslint-disable-line no-unused-vars

// friendly time display
import moment from "moment"; // eslint-disable-line no-unused-vars
import VueMoment from "vue-moment"; // eslint-disable-line no-unused-vars
Vue.use(VueMoment);

// colorization
import * as d3 from "d3";
Vue.prototype.$d3 = d3;

// better request library
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

// notifications
import Pushjs from "push.js";
Vue.prototype.$pushjs = Pushjs;

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

// make sure we get permission to show notifications on load, don't wait for the first try
if (!Pushjs.Permission.has()) {
  Pushjs.Permission.request(
    function() {
      console.log("Notification permission granted");
    },
    function() {
      console.log("Notification permission denied");
    }
  );
}
