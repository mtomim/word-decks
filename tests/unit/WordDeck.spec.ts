import { createLocalVue, mount } from '@vue/test-utils'
import WordDeck from '@/components/WordDeck.vue'
import wordComponent from '@/components/word.vue'

import { DataFile, DataFileRegistry, registry, Word } from "@/utils/types";
import Vuetify from 'vuetify';
import { Store } from 'vuex';


jest.mock('@/utils/functions', () => {
  const { DataFile, registry } = jest.requireActual('@/utils/types');
  const testDataFile = {
    fileName: "test-asset",
    fileSize: 56533,
    headers: ["word", "reading", "definition", "part"],
    content: Array(150).fill(0).map((_, i) => ({
      word: `${i + 1}`,
      reading: `0${i + 1}`,
      definition: 'd',
      part: 'n'
    })),
    creationDate: new Date().getTime(),
  } as DataFile;

  registry.push(testDataFile)

  const orig = jest.requireActual('@/utils/functions')
  return {
    ...orig,
    getCurrentWordSet: () => testDataFile,
    getSetting: () => ({ difficulty: 1, numWords: 15 })
  };
});

import store from '@/store';
describe('WordDeck.vue', () => {
  let vuetify: Vuetify
  const localVue = createLocalVue()
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('renders N words', () => {
    const wrapper = mount(WordDeck, {
      mocks: {
        $t: (s: string, o?: object) => s
      },
      store,
      localVue,
      vuetify
    });
    expect(wrapper.vm.$data.words.length).toBe(
      registry.find((r) => r.fileName === 'test-asset')?.content.length);
    expect(wrapper.vm.$data.difficulty).toBe(1);
    expect(wrapper.vm.$data.numWords).toBe(15);
    (wrapper.vm.$data.randomN as Word[]).map((w) => Number(w.word)).forEach((n) => {
      expect(n).toBeGreaterThan(0);
      expect(n).toBeLessThanOrEqual(wrapper.vm.$data.words.length / 10);
    });

    wrapper.vm.$data.difficulty = 2;
    wrapper.find('i.mdi-autorenew').trigger('click');
    (wrapper.vm.$data.randomN as Word[]).map((w) => Number(w.word)).forEach((n) => {
      expect(n).toBeGreaterThan(15);
      expect(n).toBeLessThanOrEqual(30);
    });

    wrapper.vm.$data.difficulty = 3;
    wrapper.find('i.mdi-autorenew').trigger('click');
    (wrapper.vm.$data.randomN as Word[]).map((w) => Number(w.word)).forEach((n) => {
      expect(n).toBeGreaterThan(30);
      expect(n).toBeLessThanOrEqual(45);
    });
  })

  it('renders N < 90 words, exceeding levels are capped by maxLevel', () => {
    const r = DataFileRegistry.REGISTRY;
    const file = r.find((f) => f.fileName === 'test-asset');
    expect(file).not.toBeNull();
    if (file !== undefined) {
      file.content = Array(90).fill(0).map((_, i) => ({
        word: `${i + 1}`,
        reading: `0${i + 1}`,
        definition: 'd',
        part: 'n'
      }))
    }
    const wrapper = mount(WordDeck, {
      mocks: {
        $t: (s: string, o?: object) => s
      },
      store,
      localVue,
      vuetify
    });
    const assertLevelWords = function (level: number) {
      const numWords = 15;
      wrapper.vm.$data.difficulty = level;
      wrapper.find('i.mdi-autorenew').trigger('click');
      const realLen = wrapper.vm.$data.words.length;
      if (level * numWords > realLen) {
        level = Math.floor(wrapper.vm.$data.words.length / numWords);
      }
      const naturalNum = numWords * 10;
      const factor = realLen < naturalNum ? 1 : realLen / naturalNum;
      (wrapper.vm.$data.randomN as Word[]).forEach((w) => {
        const num = Number(w.word);
        expect(num).toBeGreaterThan(numWords * (level - 1) * factor);
        expect(num).toBeLessThanOrEqual(numWords * level * factor);
      })
    }
    assertLevelWords(4);
    assertLevelWords(6);
    assertLevelWords(10);
    if (file !== undefined) {
      file.content.push(...Array(90).fill(0).map((_, i) => ({
        word: `${i + 91}`,
        reading: `0${i + 91}`,
        definition: 'd',
        part: 'n'
      })))
    }
    assertLevelWords(4);
    assertLevelWords(6);
    assertLevelWords(10);
    assertLevelWords(4);
    assertLevelWords(6);
    assertLevelWords(10);
    assertLevelWords(4);
    assertLevelWords(6);
    assertLevelWords(10);
    assertLevelWords(4);
    assertLevelWords(6);
    assertLevelWords(10);
    assertLevelWords(4);
    assertLevelWords(6);
    assertLevelWords(10);
    assertLevelWords(4);
    assertLevelWords(6);
    assertLevelWords(7);
    assertLevelWords(8);
    assertLevelWords(10);
  })

  it('renders words of good range regardless of numWords value', () => {
    const r = DataFileRegistry.REGISTRY;
    const file = r.find((f) => f.fileName === 'test-asset');
    expect(file).not.toBeNull();
    if (file !== undefined) {
      file.content = Array(500).fill(0).map((_, i) => ({
        word: `${i + 1}`,
        reading: `0${i + 1}`,
        definition: 'd',
        part: 'n'
      }))
    }
    const wrapper = mount(WordDeck, {
      mocks: {
        $t: (s: string, o?: object) => s
      },
      store,
      localVue,
      vuetify
    });
    const len = file?.content.length || 500;
    [1, 5, 15, 51, 100].forEach((numWords) => {
      wrapper.setData({ numWords: numWords });
      const maxLevel = Math.min(Math.max(Math.floor(len / numWords), 1), 10);
      const packSize = Math.round(len / maxLevel);
      [1, 2, 9, 10].forEach((level) => {
        if (level > 500 / numWords) {
          level = Math.floor(500 / numWords);
        }
        wrapper.setData({ difficulty: level });
        wrapper.find('i.mdi-autorenew').trigger('click');
        (wrapper.vm.$data.randomN as Word[]).forEach((w) => {
          const num = Number(w.word);
          expect(num).toBeGreaterThan(packSize * (level - 1));
          expect(num).toBeLessThanOrEqual(packSize * level);
        })
      })
    })
  })

  it('shows the first word when start button clicked', async () => {
    const wrapper = mount(WordDeck, {
      mocks: {
        $t: (s: string, o?: object) => s
      },
      store,
      localVue,
      vuetify
    });
    const { numWords } = wrapper.vm.$data;
    await wrapper.find('.renew').trigger('click');
    expect(wrapper.findAllComponents(wordComponent).length)
      .toBe(numWords)
    await wrapper.find('.start-button').trigger('click');
    expect(wrapper.vm.$data.wordInFocus).not.toBeNull();
    expect(wrapper.findComponent(wordComponent).exists()).toBeTruthy();
    expect(wrapper.findAll('.word .word').length)
      .toBe(numWords - 1)
  })

  it('shows explanations of words when checkbox checked', async () => {
    const wrapper = mount(WordDeck, {
      mocks: {
        $t: (s: string, o?: object) => s
      },
      store,
      localVue,
      vuetify
    });
    const { numWords } = wrapper.vm.$data;
    expect(wrapper.vm.$data.explain).toBe(false);
    await wrapper.find('.start-button').trigger('click');
    expect(wrapper.findAllComponents(wordComponent).exists()).toBeTruthy()
    expect(wrapper.findAllComponents(wordComponent).length).toBe(numWords - 1)
    expect(wrapper.findAll('.word .word').length).toBe(numWords - 1)
    expect(wrapper.findAllComponents(wordComponent).at(0).find('.word-info').exists()).toBeFalsy()
    await wrapper.find('.v-input.ma-0 .v-label').trigger('click')
    expect(wrapper.vm.$data.explain).toBe(true);
    expect(wrapper.findAllComponents(wordComponent).at(0).find('.word-info').exists()).toBeTruthy()
    await wrapper.find('.renew').trigger('click');
    expect(wrapper.findAllComponents(wordComponent).at(0).find('.word-info').exists()).toBeTruthy()
    wrapper.vm.$data.explain = false;
    await wrapper.find('.renew').trigger('click');
    expect(wrapper.findAllComponents(wordComponent).at(0).find('.word-info').exists()).toBeFalsy()
  })

  it('loads the next set of words when `start` clicked and empty', async () => {
    const wrapper = mount(WordDeck, {
      mocks: {
        $t: (s: string, o?: object) => s
      },
      store,
      localVue,
      vuetify
    });
    const { numWords } = wrapper.vm.$data;
    await wrapper.find('.start-button').trigger('click');
    expect(wrapper.findAllComponents(wordComponent).length).toBe(numWords - 1)
    for (let i = 0; i < numWords - 1; i++) {
      await wrapper.find('.word .word').trigger('click')
    }
    expect(wrapper.findAllComponents(wordComponent).length).toBe(0)
    expect(wrapper.findComponent(wordComponent).exists()).toBeFalsy()
    expect(wrapper.findAll('.text-h4').length).toBe(5)
    let i = 0;
    let answerIdx;
    const { reading } = wrapper.vm.$data.wordInFocus;
    while (wrapper.vm.$data.wordInFocus
      && i < wrapper.findAll('.text-h4').length) {
      const answer = wrapper.findAll('.text-h4').at(i).text();
      if (answer !== reading) {
        await wrapper.findAll('.text-h4').at(i).trigger('click')
        setTimeout(() => expect(wrapper.vm.$data.answer).toBe(""), 501)
      } else {
        answerIdx = i;
      }
      i++;
    }
    expect(wrapper.find('.start-button').exists()).toBeFalsy()
    await wrapper.findAll('.text-h4').at(answerIdx as number).trigger('click')
    expect(wrapper.find('.start-button').exists()).toBeTruthy()
    await wrapper.find('.start-button').trigger('click');
    expect(wrapper.findComponent(wordComponent).exists()).toBeTruthy()
    expect(wrapper.findAllComponents(wordComponent).length).toBe(numWords - 1)
  })
  it('displays info on the word without answer', async () => {
    const wrapper = mount(WordDeck, {
      mocks: {
        $t: (s: string, o?: object) => s
      },
      store,
      localVue,
      vuetify
    });
    await wrapper.find('.start-button').trigger('click');
    const { wordInFocus } = wrapper.vm.$data;
    const hints = wrapper.find('.hints')
    const mainDisp = wrapper.find('.text-h1.text-no-wrap')
    function getCategory() {
      return `【${(wrapper.vm as any).category}】`;
    }
    // standard setting, 'word' => 'reading'
    await wrapper.setData({ q: 'word', a: 'reading' });
    [getCategory(), wordInFocus.definition]
    .every((t:string) => expect(hints.text()).toContain(t));
    [wordInFocus.word, wordInFocus.reading]
    .every((t:string) => expect(hints.text()).not.toContain(t));
    expect(mainDisp.text()).toContain(wordInFocus.word);
    // setting 'reading' => 'part'
    await wrapper.setData({ q: 'reading', a: 'part' });
    [wordInFocus.word, wordInFocus.definition]
    .every((t:string) => expect(hints.text()).toContain(t));
    [getCategory(),  wordInFocus.reading]
    .every((t:string) => expect(hints.text()).not.toContain(t));
    expect(mainDisp.text()).toContain(wordInFocus.reading);
    // setting 'word' => 'definition'
    await wrapper.setData({ q: 'word', a: 'definition' });
    [getCategory(), wordInFocus.reading]
    .every((t:string) => expect(hints.text()).toContain(t));
    [wordInFocus.word, wordInFocus.definition]
    .every((t:string) => expect(hints.text().split(/\s+/g).includes(t)).toBeFalsy());
    expect(mainDisp.text()).toContain(wordInFocus.word);
  })
})
