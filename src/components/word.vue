<template>
  <v-card
    elevation="12"
    outlined
    tile
    class="word"
    @click="$emit('focus', word)"
  >
    <v-card-title>
      {{ word[setting.q] }}
    </v-card-title>
    <v-card-text class="word-info" v-if="showReading">
      <v-tooltip bottom v-if="setting.q !== 'part'">
        <template v-slot:activator="{ on, attrs }">
          <span v-on="on" v-bind="attrs" class="word-category"> 【{{ category }}】 </span>
        </template>
        <span class="word-part">{{ word.part }}</span>
      </v-tooltip>
      <span v-if="setting.q !== 'definition'">
        {{ word.definition }}
      </span>
      <div class="font-weight-black text-h6">
        {{ word[setting.a] }}
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
import { ISetting, Word } from "@/utils/types";
import { getSetting } from "@/utils/functions";

export function displayCategory(category: string): string {
  switch (category) {
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
      return category;
  }
}

const WithAWord = Vue.extend({
  props: {
    word: Word,
  },
  computed: {
    category(): string {
      return displayCategory(this.word.part);
    },
  },
});

@Component({
  props: {
    word: { type: Object as PropType<Word> },
  },
})
export default class wordComponent extends WithAWord {
  showReading = false;
  setting: ISetting = getSetting();

  toggle(): void {
    this.showReading = !this.showReading;
  }
  setShowReading(val: boolean) {
    this.showReading = val;
  }
}
</script>

<style>
.word .word-info {
  padding-bottom: 0;
}
</style>
