import { createLocalVue, mount } from '@vue/test-utils'
import VueI18n from 'vue-i18n';
import csvImport from '@/components/csvImport.vue'
import router from '@/router'

import Vuetify from 'vuetify';
import messages from '@/assets/language';
import { Word } from '@/utils/types';

const i18n = new VueI18n({
  locale: localStorage.getItem('wd-locale') || 'fr',
  messages
});

describe('csvImport.vue', () => {
  let vuetify: Vuetify
  const localVue = createLocalVue()
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('shows expand button for samples at start', async () => {
    const wrapper = mount(csvImport, {
      mocks: {
        $t: (s: string, o?: object) => s
      },
      i18n,
      localVue,
      vuetify
    });
    expect(wrapper.find('.mdi-plus-box').exists()).toBeTruthy();
    expect(wrapper.find('.mdi-minus-box').exists()).toBeFalsy();
    expect(wrapper.findAll('.v-card').exists()).toBeFalsy();

    await wrapper.find('.mdi-plus-box').trigger('click');

    expect(wrapper.find('.mdi-plus-box').exists()).toBeFalsy();
    expect(wrapper.find('.mdi-minus-box').exists()).toBeTruthy();
    expect(wrapper.findAll('.v-card').length).toBe(2);

    await wrapper.find('.mdi-minus-box').trigger('click');

    expect(wrapper.find('.mdi-plus-box').exists()).toBeTruthy();
    expect(wrapper.find('.mdi-minus-box').exists()).toBeFalsy();
    expect(wrapper.findAll('.v-card').exists()).toBeFalsy();
  });

  it('shows the internal 2 sets of words', async () => {
    const wrapper = mount(csvImport, {
      mocks: {
        $t: (s: string, o?: object) => s,
      },
      i18n,
      router,
      localVue,
      vuetify
    });
    const spy = spyOn(router, 'push');
    expect(wrapper.vm.$data.registryWrapper.size).toBe(2);
    expect(wrapper.findAll('.v-btn span.v-btn__content .mdi-close').length).toBe(2);
    expect(wrapper.findAll('.v-btn.v-btn--outlined').length).toBe(1);
    expect(wrapper.find('.v-btn.v-btn--outlined').text())
      .toContain(wrapper.vm.$data.currentWordSetName);
    await wrapper.find('.v-btn.v-btn--outlined').trigger('click');
    expect(spy).toHaveBeenCalledWith({ name: 'play' });
  });

  it('parses the dropped files', async () => {
    const wrapper = mount(csvImport, {
      mocks: {
        $t: (s: string, o?: object) => s,
      },
      i18n,
      router,
      localVue,
      vuetify
    });
    // @ts-ignore
    const over = jest.spyOn(wrapper.vm, 'over');
    // @ts-ignore
    const end = jest.spyOn(wrapper.vm, 'end');
    // @ts-ignore
    const parse = jest.spyOn(wrapper.vm, 'parse');

    expect(wrapper.find('.drop-zone').exists()).toBeTruthy();
    const dz = wrapper.find('.drop-zone')
    expect(dz.classes().includes('over')).toBeFalsy();

    await dz.trigger('dragover');

    expect(over).toHaveBeenCalledTimes(1);
    expect(dz.classes().includes('over')).toBeTruthy();

    await dz.trigger('dragleave');

    expect(end).toHaveBeenCalledTimes(1);
    expect(dz.classes().includes('over')).toBeFalsy();

    await dz.trigger('drop');

    expect(parse).toHaveBeenCalledTimes(1);

    expect(wrapper.vm.$data.errors.length).toBe(0);
    // @ts-ignore
    const { read } = wrapper.vm;

    let file = new File([], 'data.csv', { type: 'text/csv' });
    file.text = async function() {
      return 'word,reading,xxx,yyy';
    }
    await read(file);

    expect(wrapper.vm.$data.errors.length).toBe(1);

    file.text = async() => [
      'word,reading,definition,part',
      'abc,def,ghi,jkl',
      'ABC,DEF,GHI,JKL',
    ].join('\n');
    await read(file);

    file = new File([], 'data.json', { type: 'application/json' })
    file.text = async () => JSON.stringify(Array(3).fill(new Word()).map((_,i) => ({
      word: `word${i}`,
      reading: `r${i}`,
      definition: `d${i}`,
      part: `p${i}`,
    })));
    await read(file);

    expect(wrapper.vm.$data.errors.length).toBe(1);

    file.text = async () => JSON.stringify(Array(3).fill(new Word()).map((_,i) => ({
      wordx: `word${i}`,
      reading: `r${i}`,
      definitionx: `d${i}`,
      part: `p${i}`,
    })));
    await read(file);

    expect(wrapper.vm.$data.errors.length).toBe(2);
  })

})