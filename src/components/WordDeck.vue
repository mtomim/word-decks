<template>
  <v-container>
    <v-row>
      <v-col cols="10">
        <v-row>
          <v-col v-if="wordInFocus" class="col-6">
            <v-row>
              <v-col>
                <span class="text-h1">{{ wordInFocus.word }}</span>
                <span class="text-h6">{{ wordInFocus.definition }}</span>
                <a :href="`https://jisho.org/search/${wordInFocus.word}`" target="jisho.org">
                  <v-icon>mdi-link</v-icon>
                </a>
              </v-col>
            </v-row>
            <v-row>
              <v-btn-toggle v-model="dirHorizontal" color="info">
                <v-btn x-small :value="true"><v-icon>mdi-table-row</v-icon></v-btn>
                <v-btn x-small :value="false"><v-icon>mdi-table-column</v-icon></v-btn>
              </v-btn-toggle>
            </v-row>
            <v-row>
              <v-btn-toggle v-model="answer" :class="{vertical: !dirHorizontal}">
                <v-btn
                  v-for="(rdng, i) in readings"
                  :key="`rd-${i}`"
                  @click="correct(wordInFocus, rdng)"
                  color="secondary"
                  class="text-h4"
                  >{{ rdng }}</v-btn
                >
              </v-btn-toggle>
            </v-row>
          </v-col>
          <v-col v-else>
            <v-btn color="primary" @click="start">{{
              $t("label.start")
            }}</v-btn>
          </v-col>
          <v-col class="col-6">
            <v-row class="d-flex flex-row">
              <v-col cols="6" class="d-flex">
                <v-progress-circular
                  class="d-flex ml-auto"
                  :value="progress"
                  :color="color"
                  size="64"
                  width="8"
                ></v-progress-circular>
              </v-col>
              <v-col cols="6" class="d-flex">
                <span :style="`color: ${color}`" class="text-h2 d-flex ma-auto mr-1">{{ Number.isNaN(proportion) ? 0 : Math.round(100 - proportion * 100) }}%</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="words-stack" justify="start">
          <v-col v-for="(word, i) in randomN" :key="`w-${i}`" cols="2">
            <div class="word">
              <word :word="word" :ref="`w_${i}`" @focus="handleWordFocus" />
            </div>
          </v-col>
        </v-row>
        <v-row align="start" class="mt-4">
          <v-col>
            <v-btn @click.prevent.stop="loadNext" color="accent">
              <v-icon>mdi-autorenew</v-icon>
            </v-btn>
            <v-checkbox v-model="explain" :label="$t('label.explain')" class="ma-0" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" class="d-flex flex-column-reverse" align-self="start">
        <v-btn
          v-for="([word, answer, right], i) in answers"
          :href="`https://jisho.org/search/${word}`"
          target="jisho.org"
          link
          class="mr-auto font-weight-black"
          :key="i"
          :color="right && 'primary lighten-1' || 'error'"
        >
        {{word}}: {{answer}}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import word from "./word.vue";
import { levenshteinDistance, getSetting, getCurrentWordSet } from "@/utils/functions";

import Vue from "vue";
import { scoreKey } from "@/views/score.vue"

const score = JSON.parse(localStorage.getItem(scoreKey) || "{}");

export default Vue.extend({
  name: "WordDeck",

  components: {
    word,
  },
  data() {
    return {
      words: [],
      randomN: [],
      difficulty: 10,
      numWords: 20,
      wordInFocus: undefined,
      answer: undefined,
      explain: false,
      dirHorizontal: true,
      answers: [],
    };
  },
  beforeMount() {
    this.words = getCurrentWordSet().content;
    Object.assign(this, getSetting());
  },
  computed: {
    proportion() {
      return this.answers.filter(([,,right]) => !right).length / this.answers.length;
    },
    color() {
      if (this.answers.length === 0) {
        return "orange";
      }
      return `rgb(${255 * this.proportion}, ${255 - 255 * this.proportion}, 0)`;
    },
    progress() {
      return  (this.numWords - this.randomN.length - (this.wordInFocus ? 1 : 0)) / this.numWords * 100;
    },
    kanjiWords() {
      return this.words.filter((w) => w.word !== w.reading);
    },
    running() {
      return !!this.wordInFocus;
    },
    wordsOfSelectDifficulty() {
      const { length } = this.kanjiWords;
      const lower = (length * (this.difficulty - 10)) / 100;
      const max = (length * 10) / 100;
      return this.kanjiWords.slice(lower, max);
    },
    sortedWords() {
      const reading = this.wordInFocus?.reading;
      return [...this.kanjiWords].sort(
        (a, b) =>
          levenshteinDistance(a.reading, reading) -
          levenshteinDistance(b.reading, reading)
      );
    },
    readings() {
      const choices = [];
      const { reading } = this.wordInFocus;
      if (!reading) {
        return choices;
      }
      const readingArray = this.sortedWords
        .filter((word) => word.reading !== reading);
      while (choices.length < 4) {
        choices.push(
          ...readingArray
            .filter((word) => !choices.includes(word.reading))
            .filter((word) => word.word !== this.wordInFocus.word)
            .slice(0, Math.min(3 * (4 - choices.length), readingArray.length))
            .filter(() => Math.random() * 3 < 1)
            .map((word) => word.reading)
            .reduce((array, curr) => {
              if (!array.includes(curr)) {
                array.push(curr);
              }
              return array;
            }, [])
        );
      }
      if (choices.length > 4) {
        choices.splice(4);
      }
      const insertPoint = Math.floor(Math.random() * 5);
      return [
        ...choices.slice(0, insertPoint),
        reading,
        ...choices.slice(insertPoint),
      ];
    },
  },
  mounted: function() {
    this.randomN = this.getRandomNWords();
    this.dirHorizontal = JSON.parse(localStorage.getItem("wd-dirHorizontal"));
  },
  methods: {
    loadNext() {
      this.randomN = this.getRandomNWords();
      if (this.explain) {
        this.explain = false;
        this.$nextTick(() => this.explain = true);
      }
    },
    start() {
      if (this.randomN.length === 0) {
        this.loadNext();
      }
      this.focusOnWord(this.randomN.find(() => true));
    },
    getRandomNWords() {
      const arr = [];
      if (this.kanjiWords.length > this.numWords) {
        const length = this.kanjiWords.length;
        const lower = (length * (this.difficulty - 10)) / 100;
        const max = (length * 10) / 100;
        while (arr.length < this.numWords) {
          const randomWord = this.kanjiWords[
            Math.floor(Math.random() * max + lower)
          ];
          if (!arr.includes(randomWord)) {
            arr.push(randomWord);
          }
        }
      }
      return arr;
    },
    focusOnWord(word) {
      const arr = this.randomN;
      if (arr.length && word) {
        this.wordInFocus = arr.splice(arr.indexOf(word), 1).pop();
      } else {
        this.wordInFocus = word;
      }
      this.$nextTick(() => {
        this.answer = undefined;
      });
    },
    correct(word, answer) {
      const right = word.reading === answer;
      this.answers.push([word.word, answer, right]);
      (score[word.word] = score[word.word] || []).push(right);
      if (right) {
        this.focusOnWord(this.randomN.find(() => true));
      }
      localStorage.setItem(scoreKey, JSON.stringify(score));
    },
    handleWordFocus(word) {
      this.focusOnWord(word);
    },
  },
  watch: {
    explain(val) {
      this.randomN.forEach((w, i) => {
        if (Array.isArray(this.$refs[`w_${i}`])) {
          this.$refs[`w_${i}`].forEach((ref) => ref.setShowReading(val));
        }
      });
    },
    dirHorizontal(val) {
      localStorage.setItem("wd-dirHorizontal", JSON.stringify(val));
    }
  },
});
</script>

<style>
.words-stack .word {
  min-width: 8rem;
  max-width: 15rem;
}
.words-stack .word .v-card__title {
  white-space: nowrap;
}
.v-btn-toggle.vertical {
  flex-direction: column;
}
</style>
