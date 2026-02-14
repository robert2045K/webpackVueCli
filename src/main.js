import  { createApp } from 'vue';
import App from './App.vue';
import router from "./views/router";
// 引入全部element-plus组件。
//import ElementPlus from "element-plus";
//引入css
// import 'element-plus/dist/index.css';

createApp(App).use(router).mount('#app')
//createApp(App).use(router).use(ElementPlus).mount('#app')