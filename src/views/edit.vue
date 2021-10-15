<template>
  <csv-import/>
</template>

<script lang="ts">
import Vue from "vue";
import csvImport from "@/components/csvImport.vue";

export default Vue.extend ({
  name: "edit",
  components: {
    csvImport,
  },
});
</script>

<style>
</style>