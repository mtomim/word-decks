import { createLocalVue, mount } from '@vue/test-utils'
import score from '@/views/score.vue'

import Vuetify from 'vuetify';

describe('score.vue', () => {
  let vuetify: Vuetify
  const localVue = createLocalVue()
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('orders score history correctly', async () => {
    const wrapper = mount(score, {
      localVue,
      vuetify
    });
    const { score: theScore } = wrapper.vm.$data;
    expect(Object.keys(theScore).length).toBe(0);
    const newScore = {
      '100': [true],
      '33': [false, false, true],
      '66': [true, false, true],
      '25': [true, false, false, false],
      '50': [false, true],
      '10': [...Array(9).fill(false), true]
    };
    await wrapper.setData({ score: newScore })
    expect(Object.keys(theScore).length).toBe(6);
    const scoreCards = wrapper.findAll('.pa-4');
    expect(scoreCards.length).toBe(6);
    expect(scoreCards.at(0).text()).toContain('(10.00)')
    expect(scoreCards.at(1).text()).toContain('(25.00)')
    expect(scoreCards.at(2).text()).toContain('(33.33)')
    expect(scoreCards.at(3).text()).toContain('(50.00)')
    expect(scoreCards.at(4).text()).toContain('(66.67)')
    expect(scoreCards.at(5).text()).toContain('(100.00)')
  })
})