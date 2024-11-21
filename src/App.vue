<template>
  <v-app id="application">
    <v-app-bar elevation="0" :height="80" absolute>
      <v-app-bar-title>
        <div class="toolbar-inner">

          <div class="logo-block">
            <a  href="https://bkpraha.cz">
            <img :src="logo"></img>
          </a>
            <div class="inner">
              <a  href="https://bkpraha.cz">
              <h1 class="title">Bridžový klub Praha</h1>
              </a>
              <h2 class="subtitle">Kalkulačka vkladů</h2>
            </div>    
          </div>   
        </div>
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }} Bridžový klub Praha. Všechna práva vyhrazena.</span>
      <span>{{ versionString }}</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import logo from './assets/logo.png';
import { RouterView } from 'vue-router';
const versionString = (import.meta.env.VITE_APP_VERSION ?? '' as string) + ", " + (import.meta.env.VITE_BUILD_TIME ?? '' as string);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

body {
  font-family: Fira Sans, Fira-Sans-Fallback, Apple Color Emoji, Noto Color Emoji, sans-serif;
}

#application {
  background-color: #f4eae0;
}

.intro {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.v-toolbar {
  margin: 0 auto;
  padding: 0 .625rem;
  justify-content: center !important;
  color: white;
  min-height: 80px;
}

.v-toolbar-title {
  line-height: inherit !important;
}

.v-toolbar a {
  text-decoration: none;
}


@media screen and (min-width: 37.5em) {
  .v-toolbar {
    padding: 0 1.5625rem;
  }
}

@media screen and (min-width: 56.25em) {
  .v-toolbar {
    padding: 0 2.1875rem;
  }
}

.toolbar-inner {
  gap: 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  padding: .3125rem 0;
  height: 100%;
  position: relative;
  width: 100%;
  margin: 0 auto;
}

@supports (padding:max(0px)) {
  .toolbar-inner {
    padding-left: max(0, env(safe-area-inset-left));
    padding-right: max(0, env(safe-area-inset-right));
  }
}
.v-toolbar-title {
  margin-inline-start: 0 !important;
}

.title {
  font-size: 1.1rem;
}

.subtitle {
  font-size: 1rem;
}

@media screen and (min-width: 37.5em) {
  .title {
    font-size: 1.3125rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .toolbar-inner {
    padding-right: .625rem;
    padding-left: .625rem;
  }


  @supports (padding:max(0px)) {
    .toolbar-inner {
      padding-left: max(.625rem, env(safe-area-inset-left));
      padding-right: max(.625rem, env(safe-area-inset-right));
    }
  }
}

@media screen and (min-width: 56.25em) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }

  .toolbar-inner {
    padding-right: .9375rem;
    padding-left: .9375rem;
  }

  @supports (padding:max(0px)) {
    .toolbar-inner {
      padding-left: max(.9375rem, env(safe-area-inset-left));
      padding-right: max(.9375rem, env(safe-area-inset-right));
    }
  }

}

.logo-block {
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 60px;
  gap: .4em;
  padding: .1875rem;
}


.logo-block img {
  max-height: 50px;
  aspect-ratio: 4/6;
  display: block;
  width: auto;
  height: auto; 
}

@media screen and (min-width: 37.5em) {
  .logo-block img {
    max-height: 40px;
  }
}

@media screen and (min-width: 56.25em) {
  .logo-block img {
    max-height: 60px;
  }
}

.logo-block .inner {
  display: flex;
  flex-direction: column;

}

@media screen and (min-width: 37.5em) {
  .logo-block .inner {
    align-items: center;
    gap: 2rem;
    flex-direction: row;
  }
  
}

.title {
  text-transform: uppercase;
  color: rgb(57, 57, 57);
  font-weight: 700;
  letter-spacing: -0.952px;
}

.subtitle {
  color: rgb(57, 57, 57);
  font-weight: 400;
}

.v-footer {

  background-color: #f4eae0;
  text-align: center;
  font-size: .875rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.v-container {
  max-width: 920px;
}

</style>