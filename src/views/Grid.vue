<template>
  <v-container>
    <v-card id="paginator" width="100%" style="position: -webkit-sticky;position: sticky;
    top: 0px;z-index: 1;" flat>
      <div class="text-center">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-container fluid>
            <v-row no-gutters>
              <v-col
                v-for="picture in pictures"
                :key="picture.id"
                :xs="9"
                :sm="6"
                :md="4"
                :lg="3"
                :cols="12"
              >
                <v-card flat tile link class="d-flex">
                  <v-img :src="picture.cropped_picture" :alt="picture.id"
                    aspect-ratio="1"
                    class="grey lighten-2"
                    tile
                    @click="popImage(picture.id)"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular indeterminate color="grey lighten-5">
                        </v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <Photo :currentPicture=id :dialog=dialog :modalData=modalData :pictures=pictures
          @update="dialog = $event;"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Photo from '@/views/Photo.vue';
import appService from '@/api/app.service';
import { debounce } from 'lodash';

export default {
  name: 'Grid',
  data() {
    return {
      pictures: [],
      page: 1,
      pageCount: 0,
      hasMore: false,
      dialog: false,
      modalData: {},
      // loading: false,
      id: 0,
    };
  },
  methods: {
    popImage(id) {
      // this.loading = true;
      appService.get(`/images/${id}`)
        .then((data) => {
          this.modalData = data;
        })
        // eslint-disable-next-line
        .catch((error) => console.log(error));
      // this.loading = false;
      this.id = id;
      this.dialog = true;
    },
    renderImages(page) {
      // this.loading = true;
      appService.get(`/images?page=${page}`)
        .then((data) => {
          this.pictures = data.pictures;
          this.hasMore = data.hasMore;
          this.page = data.page;
          this.pageCount = data.pageCount;
        })
        // eslint-disable-next-line
        .catch((error) => console.log(error));
      // this.loading = false;
    },
    openPhoto() {
      this.dialog = true;
    },
  },
  watch: {
    // eslint-disable-next-line
    page: debounce(function (n) {
      this.renderImages(n);
    }, 500),
  },
  created() {
    this.renderImages(this.page);
  },
  components: {
    Photo,
  },
};
</script>
