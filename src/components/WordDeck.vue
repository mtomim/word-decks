<template>
  <v-container id="wd-container">
    <div id="wd-word-bg" v-if="wordInFocus">{{ wordInFocus[q] }}</div>
    <v-row>
      <v-col cols="10">
        <v-row justify="space-between">
          <v-col v-if="wordInFocus">
            <v-row>
              <v-col md="auto">
                <span class="text-h1 text-no-wrap">{{ wordInFocus[q] }}</span>
              </v-col>
              <v-col md="auto" class="hints">
                <span class="text-h6" v-if="![q,a].includes('word')">{{ wordInFocus.word }}</span>
                <span class="text-h6" v-if="a !== 'reading'">
                  <template v-if="q !== 'reading'">{{ wordInFocus.reading }}</template>
                  {{ toRomaji(wordInFocus.reading) }}
                </span>
                <span class="text-h6" v-if="![q,a].includes('part')">【{{ category }}】</span>
                <span class="text-h6" v-if="![q,a].includes('definition')">{{ wordInFocus.definition }}</span>
                <a
                  :href="`https://jisho.org/search/${wordInFocus.word}`"
                  target="jisho.org"
                >
                  <v-icon>mdi-link</v-icon>
                </a>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-else>
            <v-btn color="primary" class="start-button" @click="start">{{
              $t("label.start")
            }}</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-row class="d-flex flex-row">
              <v-col class="d-flex" md="auto">
                <v-progress-circular
                  class="d-flex ml-auto mr-3"
                  :value="progress"
                  :color="color"
                  size="64"
                  width="8"
                ></v-progress-circular>
                <span
                  :style="`color: ${color}`"
                  class="text-h2 d-flex ma-auto mr-1"
                  >{{
                    Number.isNaN(proportion)
                      ? 0
                      : Math.round(100 - proportion * 100)
                  }}%</span
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-if="multipleChoices && multipleChoices.length">
          <v-col>
            <v-row no-gutters>
              <v-col>
                <v-btn-toggle v-model="dirHorizontal" color="info">
                  <v-btn x-small :value="true"
                    ><v-icon>mdi-table-row</v-icon></v-btn
                  >
                  <v-btn x-small :value="false"
                    ><v-icon>mdi-table-column</v-icon></v-btn
                  >
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-btn-toggle
                  v-model="answer"
                  :class="{ vertical: !dirHorizontal }"
                >
                  <v-tooltip
                    :disabled="a !== 'reading'"
                    v-for="(rdng, i) in multipleChoices"
                    :key="`rd-${i}`"
                    :right="!dirHorizontal"
                    :top="dirHorizontal"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        @click="correct(wordInFocus, rdng)"
                        color="secondary"
                        class="text-h4"
                        v-bind="attrs"
                        v-on="on"
                        >{{ rdng }}</v-btn
                      >
                    </template>
                    <span>{{ toRomaji(rdng) }}</span>
                  </v-tooltip>
                </v-btn-toggle>
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
        <v-row align="start" class="mt-4" justify="start">
          <v-col md="auto">
            <v-btn @click.prevent.stop="loadNext" color="accent" class="renew">
              <v-icon>mdi-autorenew</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-checkbox
              v-model="explain"
              :label="$t('label.explain')"
              class="ma-0"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" class="d-flex flex-column-reverse" align-self="start">
        <v-btn
          v-for="({ word, answer, right }, i) in answers"
          :href="`https://jisho.org/search/${word}`"
          target="jisho.org"
          link
          class="mr-auto font-weight-black"
          :key="i"
          :color="(right && 'primary lighten-1') || 'error'"
        >
          <v-icon small
            >mdi-emoticon-{{ `${right ? "excited" : "cry"}` }}</v-icon
          >
          {{ word }}: {{ answer }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import word, { displayCategory } from "./word.vue";
import { toRomaji } from "kana-romaji";
import {
  levenshteinDistance,
  getSetting,
  getCurrentWordSet,
  shuffle,
  partitionBySize,
  uniq,
} from "@/utils/functions";
import { Answer, Field, Word } from "@/utils/types";
import { scoreKey } from "@/views/score.vue";

const score = JSON.parse(localStorage.getItem(scoreKey) || "{}");

@Component({
  name: "WordDeck",
  components: {
    word,
  },
  watch: {
    explain(val) {
      (this as WordDeck).randomN.forEach((w: Word, i: number) => {
        if (Array.isArray(this.$refs[`w_${i}`])) {
          (this.$refs[`w_${i}`] as word[]).forEach((ref) =>
            ref.setShowReading(val)
          );
        }
      });
    },
    dirHorizontal(val) {
      localStorage.setItem("wd-dirHorizontal", JSON.stringify(val));
    },
  },
})
export default class WordDeck extends Vue {
  words: Word[] | null = [];
  randomN: Word[] = [];
  difficulty = 1;
  numWords = 20;
  q = Field.word;
  a = Field.reading;
  wordInFocus: Word | null = null;
  answer: string | null = null;
  explain: boolean = false;
  dirHorizontal: boolean = true;
  answers: Answer[] = [];

  toRomaji(s: string): string {
    return toRomaji(s);
  }
  loadNext() {
    this.randomN = this.getRandomNWords();
    if (this.explain) {
      this.explain = false;
      this.$nextTick(() => (this.explain = true));
    }
  }
  start() {
    if (this.randomN.length === 0) {
      this.loadNext();
    }
    this.focusOnWord(this.randomN.shift()!);
  }
  getRandomNWords() {
    return shuffle(
      this.levelPacks[Math.min(this.difficulty, this.maxLevel) - 1]
    ).slice(0, this.numWords);
  }
  focusOnWord(word: Word | null) {
    const arr = this.randomN;
    if (arr.length && word && arr.includes(word)) {
      arr.splice(arr.indexOf(word), 1);
    }
    this.wordInFocus = word;
    this.$nextTick(() => {
      this.answer = "";
    });
  }
  correct(word: Word, answer: string) {
    const right = word[this.a] === answer;
    this.answers.push(new Answer({ word: word[this.q], answer, right }));
    (score[word[this.q]] = score[word[this.q]] || []).push(right);
    if (right) {
      this.focusOnWord(this.randomN.shift() || null);
    } else {
      setTimeout(() => {
        this.answer = "";
      }, 500);
    }
    localStorage.setItem(scoreKey, JSON.stringify(score));
  }
  handleWordFocus(word: Word) {
    this.focusOnWord(word);
  }

  get category(): string {
    return displayCategory(this.wordInFocus?.part || "");
  }

  get levelPacks() {
    return partitionBySize(
      this.kanjiWords,
      Math.round(this.kanjiWords.length / this.maxLevel)
    );
  }
  get maxLevel() {
    return Math.min(
      Math.max(Math.floor(this.kanjiWords.length / this.numWords), 1),
      10
    );
  }
  get proportion() {
    return (
      this.answers.filter(({ right }) => !right).length / this.answers.length
    );
  }
  get color() {
    if (this.answers.length === 0) {
      return "orange";
    }
    return `rgb(${255 * this.proportion}, ${255 - 255 * this.proportion}, 0)`;
  }
  get progress() {
    return (
      ((this.numWords - this.randomN.length - (this.wordInFocus ? 1 : 0)) /
        this.numWords) *
      100
    );
  }
  get kanjiWords(): Word[] {
    return (
      (this.words && this.words.filter((w) => w[this.q] !== w[this.a])) || []
    );
  }
  get running() {
    return !!this.wordInFocus;
  }
  get sortedWords() {
    const answerField = this.a;
    const expected = (this.wordInFocus && this.wordInFocus[answerField]) || "";
    return [...this.kanjiWords].sort(
      (a, b) =>
        levenshteinDistance(a[answerField], expected) -
        levenshteinDistance(b[answerField], expected)
    );
  }
  get multipleChoices(): string[] {
    if (this.wordInFocus === null) {
      return [];
    }
    const choices: string[] = [];
    const { a: answer, q: question } = this;
    const { [answer]: rightAnswer, [question]: shownObject } = this.wordInFocus;
    if (!rightAnswer) {
      return choices;
    }
    const choiceArray = this.sortedWords.filter(
      (w) => w[answer] !== rightAnswer && w[question] !== shownObject
    );
    choices.push(
      // shuffle first 30 or all
      ...uniq(shuffle(choiceArray.map((w) => w[answer]).slice(0, 20)))
        // take the 4 first (or all) of the suffled array
        .slice(0, 4),
      rightAnswer
    );
    return shuffle(choices);
  }
  beforeMount() {
    this.words = getCurrentWordSet()?.content || null;
    Object.assign(this, getSetting());
  }
  mounted() {
    this.randomN = this.getRandomNWords();
    this.dirHorizontal = JSON.parse(
      localStorage.getItem("wd-dirHorizontal") || "false"
    );
  }
}
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
.hints > * {
  padding-right: 0.25rem;
}
#wd-word-bg {
  position: absolute;
  top: 10rem;
  left: 8rem;
  right: 0;
  color: transparent;
  text-shadow: 0 0 5px rgba(9, 200, 9, 0.5);
  font-size: 20rem;
}
</style>
