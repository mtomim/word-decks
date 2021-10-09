<template>
  <v-card
    elevation="12"
    outlined
    tile
    class="word"
    @click="$emit('focus', word)"
  >
    <v-card-title>
      {{ word.word }}
    </v-card-title>
    <v-card-text class="word-info" v-if="showReading">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span v-on="on" v-bind="attrs"> 【{{ category(word.part) }}】 </span>
        </template>
        <span>{{ word.part }}</span>
      </v-tooltip>
      {{ word.definition }}
      <div class="font-weight-black text-h6">
        {{ word.reading }}
      </div>
    </v-card-text>
    <v-card-actions v-show="!$parent.running">
      <v-btn
        elevation="12"
        rounded
        fab
        x-small
        @click.prevent.stop="toggle"
        class="accent"
      >
        <v-icon>mdi-syllabary-hiragana</v-icon>
      </v-btn>
      <v-btn elevation="12" rounded fab x-small class="success" v-if="correct">
        <v-icon>mdi-robot-happy</v-icon>
      </v-btn>
      <v-btn elevation="12" rounded fab x-small class="error" v-if="wrong">
        <v-icon>mdi-robot-dead</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    word: null,
  },
  data: () => ({
    showReading: false,
    correct: false,
    wrong: false,
  }),
  methods: {
    toggle() {
      this.showReading = !this.showReading;
    },
    setShowReading(val) {
      this.showReading = val;
    },
    category(cat) {
      switch (cat) {
        case "Verb":
          return "v.";
        case "Noun":
          return "n.";
        case "Pronoun":
          return "pron.";
        case "Adverb":
          return "adv.";
        case "Adjective":
          return "adj.";
        case "Adjectival Noun":
          return "adj.n.";
        case "Verbal Noun":
          return "v.n.";
        case "Na-adjective":
          return "NAadj.";
        case "Noun; Na-adjective; No-adjective":
          return "n.; NAadj.; NOadj.";
        case "Interjection":
          return "interj.";
        default:
          return cat;
      }
    },
  },
};
</script>

<style>
.word .word-info {
  padding-bottom: 0;
}
</style>
