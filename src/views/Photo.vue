<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card color="black">
        <v-row no-gutters class="d-flex flex-row header">
          <div class="header-text">
            <div><b>Author: </b>{{ modalData.author }}</div>
            <div><b>Camera Model: </b>{{ modalData.camera }}</div>
            <div><b>Hashtags: </b>{{ modalData.tags }}</div>
          </div>
          <div cols="1" justify="end">
            <v-btn class="close" icon dark @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-row>
        <v-img id="zoompan" :src=modalData.full_picture contain>
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="start"
              justify="center"
            >
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <v-row class="footer sticky">
          <v-card-text>
            <v-btn
              absolute
              dark
              fab
              top
              right
              color="pink"
              @click="share"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-text>
        </v-row>
        <template v-slot:placeholder>
          <v-row
            class="fill-height ma-0"
            align="top"
            justify="center"
          >
            <v-progress-circular indeterminate color="grey">
            </v-progress-circular>
          </v-row>
        </template>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogShare">
      <v-col
        align="center"
        cols="12"
      >
        <v-text-field
          v-model=modalData.full_picture
          label="Copy & Share"
          outlined
          readonly
          dark
          @click="copyText"
        ></v-text-field>
      </v-col>
    </v-dialog>
  </v-row>
</template>

<script>
import Panzoom from '@panzoom/panzoom';

export default {
  data() {
    return {
      dialogShare: false,
      currentPicture: 0,
    };
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    modalData: {
      type: Object,
    },
    pictures: {
      type: Array,
    },
  },
  computed: {
    currentPictureId: () => this.pictures[this.currentPicture].id,
  },
  updated() {
    const elem = document.getElementById('zoompan');
    const panzoom = Panzoom(elem, { maxScale: 5 });
    panzoom.pan(1, 1);
    panzoom.zoom(1, { animate: true });
    elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel, { passive: false });
  },

  methods: {
    close() {
      let myDialog = this.dialog;
      myDialog = false;
      this.removePhoto();
      this.modalData.author = '';
      this.modalData.camera = '';
      this.modalData.tags = '';
      this.$emit('update', myDialog);
    },
    removePhoto() {
      this.modalData.full_picture = '@/assets/n.gif';
    },
    share() {
      this.dialogShare = true;
    },
    copyText(e) {
      e.target.select();
    },
  },
};
</script>

<style lang="css">
  .header {
    position:fixed;
    z-index:900;
    background-color: rgba(20, 20, 24, 0.7);
    width: 100%;
    padding: 10px 15px;
    color: white;
  }
  .close {
    float: right;
  }
  .footer {
    position: fixed;
    bottom: 0px;
    width: 100%;
    padding: 10px;
  }
  .header-text {
    width: 95%;
    padding: 1%;
    font-size: 14px;
  }
  @media only screen and (max-width: 750px) {
    .header {
      padding: 0px;
    }
    .header-text {
      width: 93%;
      font-size: 13px;
    }
  }
  @media only screen and (max-width: 550px) {
    .header {
      padding: 0px;
    }
    .header-text {
      width: 91%;
      font-size: 12px;
    }
  }
  @media only screen and (max-width: 400px) {
    .header {
      padding: 0px;
    }
    .header-text {
      width: 88%;
      font-size: 10px;
    }
  }

</style>
