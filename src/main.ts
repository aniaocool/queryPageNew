import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import mock from './mock'
import commonMixins from './querypage/commonMixins'

createApp(App).use(commonMixins).use(router).use(ElementPlus).use(VueAxios, axios).use(mock).mount('#app')
