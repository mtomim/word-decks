<template>
  <v-container @click="editing = false" class="wset">
    <v-container @click.stop.prevent="editing = true">
      <v-row>
        <v-text-field
          dense
          :readonly="!editing"
          :label="$t('label.name')"
          v-model="name"
        />
      </v-row>
      <v-row>
        <v-container class="wset-words">
          <label>{{ $t("label.words") }}</label>
          <v-row>
            <template v-for="(w, i) in words">
              <v-col :key="`word-${i}-word`">
                <v-text-field
                  dense
                  height="1em"
                  v-model="words[i].word"
                  :readonly="!editing"
                  :label="$t('label.word.word')"
                />
              </v-col>
              <v-col :key="`word-${i}-reading`">
                <v-text-field
                  dense
                  height="1em"
                  v-model="words[i].reading"
                  :readonly="!editing"
                  :label="$t('label.word.reading')"
                />
              </v-col>
              <v-col :key="`word-${i}-definition`">
                <v-text-field
                  dense
                  height="1em"
                  v-model="words[i].definition"
                  :readonly="!editing"
                  :label="$t('label.word.definition')"
                />
              </v-col>
              <v-col :key="`word-${i}-part`">
                <v-text-field
                  dense
                  height="1em"
                  v-model="words[i].part"
                  :readonly="!editing"
                  :label="$t('label.word.part')"
                />
              </v-col>
              <v-responsive :key="`width-${i}`" width="100%"></v-responsive>
            </template>
          </v-row>
          <v-btn @click.stop="words.push({})" color="primary">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-container>
      </v-row>
      <v-row>
        <v-textarea v-model="tempinput"> </v-textarea>
        <v-btn @click="takeIn" color="primary"
          ><v-icon>mdi-import</v-icon></v-btn
        >
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "wordSet",
  data: () => ({
    words: [],
    name: "",
    editing: false,
    tempinput: "",
  }),
  methods: {
    save: function() {
      this.editing = false;
    },
    takeIn: function() {
      this.tempinput.split("\n").forEach((line) => {
        const [word, reading, definition, part] = line.split("\t");
        this.words.push({ word, reading, definition, part });
      });
    },
  },
};
</script>

<style>
.wset > .container {
  background-color: white;
}
.wset-words .col {
  padding-bottom: 0.125em;
  height: 3em;
  padding-top: 0.25em;
}
</style>
