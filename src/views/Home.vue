<template>
  <div class="home">
    <word-deck/>
  </div>
</template>

<script>
// @ is an alias to /src
import WordDeck from '@/components/WordDeck'

export default {
  name: 'Home',
  components: {
    WordDeck
  }
}
</script>
