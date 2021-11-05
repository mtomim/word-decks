import Vue from 'vue';
import Vuex from 'vuex';
import { Word } from '@/utils/types';

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    playWorstMode: false,
    worstPack: [] as Word[]
  },
  mutations: {
    setWorstPack(state, worstPack: Word[]) {
      state.worstPack = worstPack;
    },
    togglePlayWorstMode(state) {
      state.playWorstMode = !state.playWorstMode;
    },
    activatePlayWorstMode(state) {
      state.playWorstMode = true;
    },
    deactivatePlayWorstMode(state) {
      state.playWorstMode = false;
    }
  }
})