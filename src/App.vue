<template>
  <v-app id="app">
    <v-main>
      <Grid />
    </v-main>
  </v-app>
</template>

<script>
import Grid from '@/views/Grid.vue';

export default {
  name: 'App',
  components: {
    Grid,
  },
};
</script>
