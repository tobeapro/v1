// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import elementUi from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(elementUi)
Vue.use(axios)
Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  elementUi,
  axios,
  template: '<App/>',
  components: { App }
})
