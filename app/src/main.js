import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import "./assets/styles/font.css";
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";

createApp(App).use(router).use(FloatingVue).mount("#app");
