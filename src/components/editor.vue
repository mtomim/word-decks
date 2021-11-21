<template>
  <v-container>
    <v-row>
      <v-col>
        <v-list-item-group v-model="fileIndex">
          <v-list-item v-for="(item, i) in files" :key="i">
            <v-list-item-content>
              {{ item.fileName }}
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-row>
          <v-dialog
            v-model="newFileDialog"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                @click.prevent.stop="showNewFileDialog"
                class="add-set-button"
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-plus-circle</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>{{ $t('label.new_words') }}</v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="newFileName"
                        :rules="[rules.required, rules.uniq]"
                        class="new-file-name"
                        :label="$t('label.name')"
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="secondary darken-1"
                  icon
                  @click="newFileDialog = false"
                  class="cancel"
                ><v-icon>mdi-close-circle</v-icon>
                </v-btn>
                <v-btn
                  v-if="rulesSatisfied"
                  color="secondary darken-1"
                  icon
                  @click="saveNewFile"
                  class="save"
                ><v-icon>mdi-content-save</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="headers">
      <v-col v-for="(k, i) in headers" :key="`${k}-${i}`">
        {{ k }}
      </v-col>
    </v-row>
    <v-row
      v-for="(word, i) in editWords"
      :key="`word-${i}`"
      :class="{ word: true, editing: word.editing }"
    >
      <v-col
        v-for="(k, i) in headers"
        :key="`${k}-${i}`"
        class="editable"
        @click.prevent.stop="startEdit(word)"
      >
        <v-text-field
          v-model="word.temp[k]"
          v-if="word.editing"
          @keypress.enter.prevent.stop="endEdit(word)"
          @keypress.esc.prevent.stop="cancelEdit(word)"
          clear-icon="mdi-close-circle"
          append-icon="mdi-check-circle"
          @click:clear="cancelEdit(word)"
          @click:append="endEdit(word)"
          clearable
          single-line
          solo
          :label="k"
        >
        </v-text-field>
        <template v-else>
          {{ word.temp[k] }}
        </template>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn class="add-button" @click.prevent.stop="addNewWord" icon
          ><v-icon>mdi-plus-circle</v-icon></v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { DataFile, DataFileRegistry, Field, registry, Word } from "@/utils/types";

const files = Vue.observable(registry);

class WordEditProxy {
  editing: boolean = false;
  word: Word;
  temp: Word;
  constructor(word: Word) {
    this.word = word;
    this.temp = Object.assign(new Word(), word);
  }
  save() {
    Object.assign(this.word, this.temp);
  }
  cancel() {
    Object.assign(this.temp, this.word);
  }
  startEdit() {
    this.editing = true;
  }
  stopEdit() {
    this.editing = false;
  }
}

// eslint-disable-next-line no-unused-vars
type RuleFunction = (value: string) => true | string;
declare interface Rules {
  // eslint-disable-next-line no-unused-vars
  [key: string]: RuleFunction,
}

export default Vue.extend({
  data() {
    return {
      editWords: [] as WordEditProxy[],
      files,
      fileIndex: 0 as number,
      newFileDialog: false,
      newFileName: '' as string,
      rules: {
        required: (value: string) => !!value || this.$t('error.required'),
        uniq: (value: string) => !registry.map((f) => f.fileName).includes(value) || this.$t('error.already_used', { fileName: value }),
      } as Rules,
    };
  },
  computed: {
    headers() {
      return Object.keys(Field);
    },
    rulesSatisfied(): boolean {
      return (Object.values(this.rules) as RuleFunction[])
        .every(f => f(this.newFileName) === true);
    },
  },
  methods: {
    startEdit(word: WordEditProxy) {
      word.startEdit();
    },
    endEdit(word: WordEditProxy) {
      word.stopEdit();
      word.save();
      this.files[this.fileIndex].content.push(word.word);
      DataFileRegistry.save();
    },
    cancelEdit(word: WordEditProxy) {
      word.stopEdit();
      word.cancel();
    },
    addNewWord() {
      const newWord = new WordEditProxy(new Word());
      this.editWords.push(newWord);
      newWord.startEdit();
    },
    showNewFileDialog() {
      this.newFileDialog = true;
    },
    saveNewFile() {
      this.newFileDialog = false;
      new DataFileRegistry().add(Object.assign(
        new DataFile(),
        {
          fileName: this.newFileName
        }
      ));
      this.fileIndex = registry.findIndex(f => f.fileName === this.newFileName);
      this.addNewWord();
      this.newFileName = '';
    },
  },
  watch: {
    fileIndex(fileIndex: number) {
      this.editWords = this.files[fileIndex].content.map(
        (w) => new WordEditProxy(w)
      );
    },
  },
});
</script>

<style>
.headers .col {
  font-weight: bold;
  font-size: larger;
  text-align: center;
  background-color: #beb6;
}

</style>
