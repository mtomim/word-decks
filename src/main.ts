import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify';
import messages from '@/assets/language';
import router from '@/router'
import store from './store';

Vue.use(VueI18n)
Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: localStorage.getItem('wd-locale') || 'fr',
  messages
});

new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
