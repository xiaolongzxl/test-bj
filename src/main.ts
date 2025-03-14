import 'babel-polyfill';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import App from './App.vue';

import router from '@/router';
import store from '@/store';
import 'normalize.css';
import '@/assets/less/reset.less';
import '@/assets/less/variable.less';
import '@/assets/less/el-reset.less';
import SvgIcon from '@/views/home/file/components/svgIcon.vue';
import FileBtns from '@/views/home/file/components/btns/index.vue';

import 'virtual:uno.css';
import 'virtual:svg-icons-register';
// 自定义事件
import mitt from 'mitt';
// 预览图片
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';
// 时间
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
// 换言
import i18n from './lang';
// lodash
import _ from 'lodash';
// auto-import 无需引入createApp
const app = createApp(App);
app.use(store);
app.use(i18n);
app.use(VueViewer);
app.use(ElementPlus, {
  locale: zhCn,
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component('SvgIcon', SvgIcon);
app.component('FileBtns', FileBtns);
app.config.globalProperties.$getAssetsImages = (name: string) => {
  return new URL(`/src/assets/images/${name}`, import.meta.url).href; //本地文件路径
};
app.config.globalProperties.Bus = mitt();
app.config.globalProperties._ = _;
app.config.globalProperties.moment = moment;
// 中文输入触发事件
// app.directive('composition', {
//   mounted(el, binding) {
//     const { value } = binding;
//     el.addEventListener('compositionstart', value);
//     el.addEventListener('compositionend', value);
//   },
//   unmounted(el, binding) {
//     const { value } = binding;
//     el.removeEventListener('compositionstart', value);
//     el.removeEventListener('compositionend', value);
//   },
// });
app.use(router);
app.mount('#app');
