<template>
  <v-container>
    <v-row>
      <v-col
        @drop.prevent="parse($event)"
        @dragover.prevent="over"
        @dragleave.prevent="end"
        class="drop-zone grey pa-6"
        ref="dropZone"
      >
        <v-row class="justify-center">
          <v-icon large color="#00ff00aa">mdi-tray-arrow-down</v-icon>
          <span class="text-h6 text--secondary">{{
            $t("label.acceptedformat")
          }}</span>
        </v-row>
        <v-row class="justify-center">
          <v-col>
            <div>
              {{ $t("label.example") }}
              <v-icon v-if="!exampleShown" large @click="exampleShown = true"
                >mdi-plus-box</v-icon
              >
              <v-icon v-else large @click="exampleShown = false"
                >mdi-minus-box</v-icon
              >
            </div>
            <div v-if="exampleShown" class="d-flex justify-center flex-row">
              <v-card color="#005800a6" dark>
                <v-card-title>CSV:</v-card-title>
                <v-card-text
                  ><code class="pa-0 d-flex ma-1">{{
                    sampleCsv
                  }}</code></v-card-text
                >
              </v-card>
              <v-card color="#005800a6" dark>
                <v-card-title>JSON:</v-card-title>
                <v-card-text
                  ><code class="pa-0 d-flex ma-1">{{
                    sampleJson
                  }}</code></v-card-text
                >
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card
          :v-model="err"
          v-for="(err, i) in errors"
          :key="`err-${i}`"
          color="error"
          dark
        >
          <v-card-title>{{ err.fileName }}</v-card-title>
          <v-card-text>{{ err.error }}</v-card-text>
          <v-card-actions>
            <v-btn text v-bind="attrs" @click="errors.splice(i, 1)"
              ><v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          @click.stop.prevent="loadData(file)"
          v-for="file in files"
          :key="`file-${file.fileName}`"
          :outlined="file.fileName === currentWordSetName"
          >{{ file.fileName }} ({{ file.content.length }} entries)
          <v-icon @click="registryWrapper.remove(file.fileName)">
            mdi-close
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";
import stringify from "csv-stringify/lib/sync";
import { readFile, shorten, setCurrentWordSet, getCurrentWordSet } from "@/utils/functions";
import { DataFileRegistry, registry as _reg } from "@/utils/types";

const files = Vue.observable(_reg);
const threeRows = files[0].content.slice(0, 3);
const sampleJson = JSON.stringify(threeRows, null, 2);
let sampleCsv = stringify(threeRows, { header: true });

export default {
  data() {
    return {
      registryWrapper: new DataFileRegistry(),
      exampleShown: false,
      sampleJson,
      sampleCsv,
      files,
      errors: [],
      currentWordSetName: "",
    };
  },
  beforeMount() {
    this.currentWordSetName = getCurrentWordSet().fileName;
  },
  methods: {
    parse(e) {
      this.end();
      const droppedFiles = e.dataTransfer?.files;
      if (!droppedFiles) {
        return;
      }

      [...droppedFiles].forEach(async (f) => {
        try {
          const dataFile = await readFile(f, this.registryWrapper);
          if (dataFile.validateHeaders()) {
            this.registryWrapper.add(dataFile);
          }
        } catch(e) {
          this.errors.push({
            fileName: f.name,
            error:
              e.name === "error.filetype"
                ? this.$t(e.name)
                : e.name === "error.headersmissing"
                ? this.$t(e.name, {
                    headers: shorten(e.headers.join(", "), 20),
                    filename: f.name,
                  })
                : e,
          });
        }
      });
    },
    over() {
      this.$refs.dropZone.classList.add("over");
    },
    end() {
      this.$refs.dropZone.classList.remove("over");
    },
    loadData(file) {
      this.$emit("csvFile", file);
      setCurrentWordSet(file.fileName);
      this.currentWordSetName = file.fileName;
      this.$router.push({name: 'play'});
    },
  },
};
</script>

<style>
.drop-zone {
  outline: 2px dashed #92b0b3;
  outline-offset: -10px;
  transition: outline-color 0.15s ease-in-out, background-color 0.15s linear;
}
.drop-zone.over {
  outline: 3px dashed #00ff55;
}
code.pa-0.d-flex {
  white-space: pre;
  line-height: 1.2;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
