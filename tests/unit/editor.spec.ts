import Vuetify from 'vuetify';
import { createLocalVue, mount } from '@vue/test-utils';
import editor from '@/components/editor.vue';
import { DataFile, Field, registry, Word } from '@/utils/types';
import store from '@/store';
import '@testing-library/jest-dom'

describe('editor', () => {
  const words: Word[] = Array(10).fill(0).map((_,i) => Object.assign(new Word(), {
    word: `word${i + 1}`,
    reading: `reading${i + 1}`,
    definition: `definition${i + 1}`,
    part: `part${i + 1}`
  }));
  registry.push(Object.assign(new DataFile(), {
    fileName: 'editor test',
    headers: Object.keys(Field),
    content: words,
  }));

  it('shows 10 editing table rows with given data when 10 words are given as props `words`', async () => {
    const localVue = createLocalVue();
    const wrapper = mount(editor, {
      mocks: { $t: (s: string, o?: object) => s },
      localVue,
      vuetify: new Vuetify(),
      store
    });
    await wrapper.setData({ fileIndex: registry.length - 1 })
    expect(wrapper.findAll('.word').length).toBe(10);
    words.forEach(word => {
      expect(wrapper.text()).toContain(word.word);
      expect(wrapper.text()).toContain(word.reading);
      expect(wrapper.text()).toContain(word.definition);
      expect(wrapper.text()).toContain(word.part);
    });
  })

  it('shows rows with editable cells having `.editable` and when clicked getting editable', async () => {
    const localVue = createLocalVue();
    const wrapper = mount(editor, {
      mocks: { $t: (s: string, o?: object) => s },
      localVue,
      vuetify: new Vuetify(),
      store
    });
    await wrapper.setData({ fileIndex: registry.length - 1 })
    expect(wrapper.findAll('.editable').length).toBe(40);
    await wrapper.findAll('.editable').at(5).trigger('click');
    expect(wrapper.findAll('input').length).toBe(4);
    await wrapper.findAll('.editable').at(5).find('input').trigger('click');
    await wrapper.findAll('.editable').at(5).find('input').setValue('xxx')
    await wrapper.findAll('.editable').at(5).find('input').trigger('keypress.enter');
    expect(wrapper.findAll('.editable input').length).toBe(0);
    const headers = (wrapper.vm as any).headers;
    expect(wrapper.vm.$data.editWords[1].word[headers[1]]).toBe(`xxx`)

    await wrapper.findAll('.editable').at(5).trigger('click');
    expect(wrapper.findAll('.editable input').length).toBe(4);
    await wrapper.findAll('.editable').at(5).find('input').trigger('click');
    await wrapper.findAll('.editable').at(5).find('input').setValue('xxxxx')
    expect(wrapper.vm.$data.editWords[1].temp[headers[1]]).toBe(`xxxxx`)
    await wrapper.findAll('.editable').at(5).find('input').trigger('keypress.esc');
    expect(wrapper.findAll('.editable input').length).toBe(0);
    expect(wrapper.vm.$data.editWords[1].word[headers[1]]).toBe(`xxx`)
  })

  it('allows adding new words by clicking on add icon button', async () => {
    const localVue = createLocalVue();
    const wrapper = mount(editor, {
      mocks: { $t: (s: string, o?: object) => s },
      localVue,
      vuetify: new Vuetify(),
      store
    });
    await wrapper.setData({ fileIndex: registry.length - 1 })
    const wordsLen = wrapper.findAll('.word').length;
    await wrapper.find('.add-button').trigger('click')
    expect(wrapper.findAll('.row.word.editing').length).toBe(1)
    expect(wrapper.findAll('.editable input').length).toBe(4)
    expect(wrapper.vm.$data.editWords.length).toBe(wordsLen + 1)
  });

  it('allows creating a new data file by clickin on another add icon button', async () => {
    const localVue = createLocalVue();
    const wrapper = mount(editor, {
      mocks: { $t: (s: string, o?: object) => s },
      localVue,
      vuetify: new Vuetify(),
      store
    });
    const priorFileCount = registry.length;
    await wrapper.find('.add-set-button').trigger('click')
    expect(wrapper.findAll('.new-file-name').length).toBe(1)
    await wrapper.findAll('.cancel').trigger('click')
    expect(registry.length).toBe(priorFileCount);

    await wrapper.find('.add-set-button').trigger('click')
    await wrapper.find('.new-file-name input').setValue(registry[0].fileName);
    expect(wrapper.find('.save').exists()).toBeFalsy();
    await wrapper.find('.new-file-name input').setValue(`file ${new Date().getTime()}`);
    expect(wrapper.find('.save').exists()).toBeTruthy();
    await wrapper.find('.save').trigger('click');
    expect(registry.length).toBe(priorFileCount + 1);
  })
});