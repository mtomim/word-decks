<template>
  <v-container class="grey lighten-5">
    <v-row dense no-gutters>
      <v-col
        v-for="(word, i) in fromWorst"
        :key="`${i}`"
      >
        <v-card
          hover
          :href="`https://jisho.org/search/${word.word}`"
          target="jisho.org"
          class="pa-4"
          raised
          :style="`background-color: rgb(255,${155 + word.score},${155 + word.score})`"
        >
          {{word.word}}
          ({{ word.score.toFixed(2) }})
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export const scoreKey = "wd-score";

export default {
  data() {
    return {
      score: {}
    };
  },
  beforeMount() {
    this.score = JSON.parse(localStorage.getItem(scoreKey) || "{}");
  },
  computed: {
    toArray() {
      return Object.entries(this.score)
        .map(([word, history]) => ({word, history}));
    },
    fromWorst() {
      return [...this.toArray].sort((a,b) => 
        this.evaluateHistory(a) - this.evaluateHistory(b)
      );
    }
  },
  methods: {
    evaluateHistory(entry) {
      const { history } = entry;
      const score = 100 * history.filter(h => h).length / history.length;
      Object.assign(entry, { score });
      return score;
    }
  },
};
</script>

<style></style>
