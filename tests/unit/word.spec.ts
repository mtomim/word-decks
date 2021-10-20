import { createLocalVue, mount } from '@vue/test-utils'
import wordComponent from '@/components/word.vue'

import Vuetify from 'vuetify';
import { Word } from '@/utils/types';
import { PropType } from 'vue';

describe('WordDeck.vue', () => {
  let vuetify: Vuetify
  const localVue = createLocalVue()
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const aWord = {
    word: '高校生',
    reading: 'こうこうせい',
    definition: 'high school student',
    part: 'Noun',
  } as Word;

  const categories = {
    "Verb": "v.",
    "Noun": "n.",
    "Pronoun": "pron.",
    "Adverb": "adv.",
    "Adjective": "adj.",
    "Adjectival Noun": "adj.n.",
    "Verbal Noun": "v.n.",
    "Na-adjective": "NAadj.",
    "Noun; Na-adjective; No-adjective": "n.; NAadj.; NOadj.",
    "Interjection": "interj."
  };

  it('renders the given word', async () => {
    const wrapper = mount(wordComponent, {
      mocks: {
        $t: (s: string, o?: object) => s
      },
      propsData: { word: aWord },
      localVue,
      vuetify
    });
    expect(wrapper.vm.$props.word.word).toBe('高校生');
    expect(wrapper.find('.word').exists()).toBeTruthy();
    expect(wrapper.find('.word .v-card__title').exists()).toBeTruthy();
    expect(wrapper.vm.$data.showReading).toBe(false);
    await wrapper.find('.v-btn.accent').trigger('click');
    expect(wrapper.vm.$data.showReading).toBe(true);
    expect(wrapper.find('.word-info').exists()).toBeTruthy();
    await wrapper.find('.v-btn.accent').trigger('click');
    expect(wrapper.vm.$data.showReading).toBe(false);
    expect(wrapper.find('.word-info').exists()).toBeFalsy();
    await wrapper.find('.v-btn.accent').trigger('click');
    for (const [k,v] of Object.entries(categories)) {
      await wrapper.setProps({ word: Object.assign({ ...aWord }, { part: k }) })
      expect(wrapper.find('.word-category').text()).not.toBe(k);
      expect(wrapper.find('.word-category').text()).toBe(`【${v}】`);
    }
    await wrapper.setProps({ word: Object.assign({ ...aWord }, { part: 'abc' }) })
    expect(wrapper.find('.word-category').text()).toBe('【abc】');
  })
});