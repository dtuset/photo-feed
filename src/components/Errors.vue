<template>
  <v-dialog v-model="onErrors" max-width="500">
      <v-card>
        <v-card-title>
          An error occured
        </v-card-title>
        <v-card-text>
          An error has occured while loding data.
          Try again later or contact support.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="reload"
          >
            Retry
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="onErrors = false"
          >
            Accept
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Errors',
  props: {
    onErrors: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    reload() {
      window.location.reload();
    },
  },
};
</script>

<style>

</style>
