<template>
  <v-container class="grey lighten-5">
    <v-row>
      <v-col>
        <v-btn @click="playWorst">{{
          $t("label.replay_worst_in_current_mode")
        }}</v-btn>
      </v-col>
    </v-row>
    <v-row dense no-gutters>
      <v-col v-for="(word, i) in fromWorst" :key="`${i}`">
        <v-card
          hover
          :href="`https://jisho.org/search/${word.word}`"
          target="jisho.org"
          class="pa-4"
          raised
          :style="
            `background-color: rgb(255,${155 + word.score},${155 + word.score})`
          "
        >
          {{ word.word }}
          ({{ word.score.toFixed(2) }})
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { getCurrentWordSet, getSetting } from "@/utils/functions";
import Vue from "vue";

export const scoreKey = "wd-score";

declare interface IScore {
  [key: string]: boolean[];
}

declare interface IWordHistory {
  word: string;
  history: boolean[];
  score?: number;
}

export default Vue.extend({
  data() {
    return {
      score: {} as IScore,
    };
  },
  beforeMount() {
    this.score = JSON.parse(localStorage.getItem(scoreKey) || "{}") as IScore;
  },
  computed: {
    toArray(): IWordHistory[] {
      return Object.entries(this.score).map(
        ([word, history]) => ({ word, history } as IWordHistory)
      );
    },
    fromWorst(): IWordHistory[] {
      return [...this.toArray].sort(
        (a, b) => this.evaluateHistory(a) - this.evaluateHistory(b)
      );
    },
  },
  methods: {
    evaluateHistory(entry: IWordHistory) {
      const { history } = entry;
      const score = (100 * history.filter((h) => h).length) / history.length;
      Object.assign(entry, { score });
      return score;
    },
    playWorst() {
      const setting = getSetting();
      const { q, numWords } = setting;
      const currentWordSet = getCurrentWordSet()?.content || [];
      this.$store.commit("activatePlayWorstMode");
      this.$store.commit(
        "setWorstPack",
        this.fromWorst
          .map((w) => currentWordSet.find((cw) => cw[q] === w.word))
          .filter(w => !!w)
          .slice(0, numWords)
      );
      this.$router.push({ name: "play" });
    },
  },
});
</script>

<style></style>
