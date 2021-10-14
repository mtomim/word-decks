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
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Component from "vue-class-component";
import { Word } from "../utils/types";

@Component({
  props: {
    word: { type: Object as PropType<Word> }
  }
})
export default class wordComponent extends Vue {
  showReading = false

  toggle(): void {
    this.showReading = !this.showReading;
  }
  setShowReading(val: boolean) {
    this.showReading = val;
  }
  category(cat: string): string {
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
  }
}
</script>

<style>
.word .word-info {
  padding-bottom: 0;
}
</style>
