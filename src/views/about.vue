<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          {{ $t("welcome") }}
        </h1>

        <p class="subheading font-weight-regular">
          {{ $t("info") }}
          <a
            :href="channelUrl"
            target="_blank"
            >{{ $t("discordChannel") }}</a
          >
        </p>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
export default {
  name: 'about',
  data() {
    return {
      channelUrl: 'https://discord.com/guild-discovery?query=japanese%20language&offset=0&limit=12&preferredLocale=ja&categoryId=-1'
    }
  }
};
</script>

<style>
.noire {
  width: 2em;
  height: 1em;
  background-color: turquoise;
}
.croche, .demi-soupir {
  width: 1em;
  height: 1em;
  background-color: orange;
}
.temps {
  border: 2px solid purple;
  width: 3em;
}
.temps:hover {
  background-color: violet;
}
</style>