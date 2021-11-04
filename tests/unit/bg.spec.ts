import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import Vuetify from 'vuetify';
import messages from '@/assets/language';
import VueI18n from "vue-i18n";
import bg from '@/components/bg.vue';

const i18n = new VueI18n({
  locale: localStorage.getItem('wd-locale') || 'fr',
  messages
});

describe('bg.vue', () => {
  let vuetify: Vuetify
  const localVue = createLocalVue()
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('shows the background', async () => {
    const wrapper = mount(bg, {
      mocks: {
        $t: (s: string, o?: object) => s,
      },
      i18n,
      localVue,
      vuetify
    });

    expect(wrapper.find('#bg').exists());
    await wrapper.setData({ height: 400 });
    expect(wrapper.findAll('#bg > div').length).not.toBe(0);
  });
});