import { createLocalVue, mount } from "@vue/test-utils";
import Vuetify from 'vuetify';
import setting from "@/views/setting.vue"
import { getSetting } from '@/utils/functions';

describe('setting.vue', () => {
  let wrapper;
  let vuetify: Vuetify
  const localVue = createLocalVue()
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  interface d {
    [key: string]: string
  }

  class LocalStorageMock {
    store: d;
    length: number = 0;
    constructor() {
      this.store = {};
    }

    clear() {
      this.store = {};
      this.length = 0;
    }

    key(index: number): string | null {
      return Object.keys(this.store)[index];
    }

    getItem(key: string) {
      return this.store[key] || null;
    }

    setItem(key: string, value: string) {
      this.store[key] = String(value);
      this.length = Object.keys(this.store).length;
    }

    removeItem(key: string) {
      delete this.store[key];
    }
  }

  it('respects the `getSetting` values', () => {
    const settingData = { difficulty: 1, numWords: 15 };
    localStorage.setItem('wd-setting', JSON.stringify(settingData));
    wrapper = mount(setting, {
      mocks: { $t: (s: string) => s },
      localVue,
      vuetify
    });
    expect(wrapper.vm.$data.difficulty).toBe(1);
    expect(wrapper.vm.$data.numWords).toBe(15);

    settingData.difficulty = 5;
    settingData.numWords = 5;
    localStorage.setItem('wd-setting', JSON.stringify(settingData));
    wrapper = mount(setting, {
      mocks: { $t: (s: string) => s },
      localVue,
      vuetify
    });
    expect(wrapper.vm.$data.difficulty).toBe(5);
    expect(wrapper.vm.$data.numWords).toBe(5);
  })
  it('stores the setting at any change', async () => {
    const settingData = { difficulty: 1, numWords: 15 };
    localStorage.setItem('wd-setting', JSON.stringify(settingData));
    wrapper = mount(setting, {
      mocks: { $t: (s: string) => s },
      localVue,
      vuetify
    });
    // @ts-ignore
    const storeSetting: () => void = jest.spyOn(wrapper.vm, 'storeSetting');
    settingData.difficulty = 5;
    settingData.numWords = 50;
    Object.assign(wrapper.vm.$data, settingData);
    storeSetting();
    const answer = getSetting();
    expect(answer.difficulty).toBe(5);
    expect(answer.numWords).toBe(50);
  })
})