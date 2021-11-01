<template>
  <v-app>
    <bg />
    <v-app-bar
      v-if="$vuetify.breakpoint.xs"
      dense
      class="pt-3 nav-bg"
      absolute
      height="60"
      bottom
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
    </v-app-bar>
    <v-navigation-drawer
      app
      dark
      class="pt-4 nav-bg"
      mini-variant
      v-if="$vuetify.breakpoint.smAndUp"
      mobile-breakpoint="xs"
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
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { routes } from "@/router";
import bg from "@/components/bg.vue";

export default {
  name: "App",
  components: {
    bg
  },

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
    if (!this.$route.name) {
      this.routePush({ name: "play" });
    }
  },
};
</script>

<style>
.nav-bg,
.theme--dark.v-navigation-drawer.nav-bg {
  background-color: #9ADF66;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpolygon fill='%237dd468' points='1600 160 0 460 0 350 1600 50'/%3E%3Cpolygon fill='%2360ca6a' points='1600 260 0 560 0 450 1600 150'/%3E%3Cpolygon fill='%2344bf6d' points='1600 360 0 660 0 550 1600 250'/%3E%3Cpolygon fill='%2327b56f' points='1600 460 0 760 0 650 1600 350'/%3E%3Cpolygon fill='%230AAA71' points='1600 800 0 800 0 750 1600 450'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
  /* background by SVGBackgrounds.com */
}

.v-application--wrap #bg {
  background-attachment: fixed;
  background-size: cover;
  position: absolute;
}

.logo {
  position: fixed !important;
  bottom: 0;
}
</style>
