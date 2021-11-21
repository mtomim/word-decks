<template>
  <div>
    <csv-import/>
    <editor
      :words="[{
        word: 'w',
        reading: 'r',
        definition: 'd',
        part: 'p'
      }]"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import csvImport from "@/components/csvImport.vue";
import editor from "@/components/editor.vue"

export default Vue.extend ({
  name: "edit",
  components: {
    csvImport,
    editor,
  },
});
</script>

<style>
</style>