<template>
  <v-app>
    <v-navigation-drawer
      app
      color="primary lighten-3"
      dark
      class="pt-4"
      mini-variant
    >
      <v-btn
        v-for="route in routes"
        :key="route.path"
        :small="route.name !== 'play'"
        class="mx-auto mb-6 d-flex"
        color="primary"
        fab
        dark
        :to="route.path"
      >
        <v-icon>{{ route.icon }}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-menu open-on-hover>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            fab
            dark
            color="primary"
            small
            class="mx-auto mb-6 d-flex"
          >
            <v-icon>mdi-earth</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item v-for="(item, index) in $i18n.availableLocales" :key="index">
            <v-list-item-title>
              <v-btn @click="setLocale(item)" :outlined="$i18n.locale === item">
                <v-icon small color="primary" dense>{{ $i18n.messages[item].lang }}</v-icon>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-img src="favicon.svg" class="logo"></v-img>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { routes } from "@/router";

export default {
  name: "App",

  data: () => ({
    routes,
  }),
  methods: {
    routePush(route) {
      this.$router.push({ name: route.name }).catch(() => {});
    },
    setLocale(locale) {
      this.$i18n.locale = locale;
      localStorage.setItem("wd-locale", locale);
    },
  },
  mounted() {
    this.routePush({ name: "play" });
  },
};
</script>

<style>
.logo {
  position: fixed !important;
  bottom: 0;
}
</style>
