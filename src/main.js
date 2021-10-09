import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueI18n from 'vue-i18n'
import messages from './assets/language';
import router from './router'

Vue.use(VueI18n)
Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: 'fr',
  messages
});

new Vue({
  i18n,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
