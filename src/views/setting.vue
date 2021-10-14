<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <v-row style="height: 150px;">
          <v-col cols="3" align-self="center">{{ $t("label.difficulty") }}</v-col>
          <v-col cols="9" align-self="center">
            <v-slider
              v-model="difficulty"
              append-icon="mdi-plus"
              prepend-icon="mdi-minus"
              step="5"
              min="10"
              max="100"
              thumb-label
              @input="storeSetting"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">{{ $t("label.numWords") }}</v-col>
          <v-col cols="9">
            <v-slider
              v-model="numWords"
              append-icon="mdi-plus"
              prepend-icon="mdi-minus"
              step="5"
              min="5"
              max="50"
              thumb-label
              @input="storeSetting"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { getSetting } from "../utils/functions"
export default Vue.extend({
  name: "setting",
  data() {
    return {
      difficulty: 10,
      numWords: 20,
    };
  },
  beforeMount() {
    Object.assign(this, getSetting());
  },
  methods: {
    storeSetting() {
      localStorage.setItem("wd-setting", JSON.stringify({
        difficulty: this.difficulty,
        numWords: this.numWords,
      }));
    },
  }
});
</script>

<style></style>
