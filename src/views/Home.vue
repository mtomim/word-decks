<template>
  <div class="home">
    <word-deck/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import WordDeck from '../components/WordDeck.vue'; // @ is an alias to /src

@Component({
  components: {
    WordDeck,
  },
})
export default class Home extends Vue {}
</script>
