import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: '#4caf50',
            secondary: '#009688',
            accent: '#00dd00',
            error: '#673ab7',
            warning: '#ff9800',
            info: '#ff5722',
            success: '#4caf50'
            }
        }
    }
});
